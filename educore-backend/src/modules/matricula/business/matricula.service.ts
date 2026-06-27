// src/modules/matricula/business/matricula.service.ts
// Capa de Negocio: registra una matrícula creando Usuario + Estudiante + Matricula en una transacción.
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  MATRICULA_REPOSITORY,
  IMatriculaRepository,
  RegistrarMatriculaData,
} from '../data/matricula.repository.interface';
import {
  MatriculaNoEncontradaException,
  SeccionNoEncontradaException,
  DniDuplicadoException,
} from './exceptions/matricula.exceptions';

const SALT_ROUNDS = 10;

function generarPasswordTemporal(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let resultado = '';
  for (let i = 0; i < 8; i++) {
    resultado += chars[Math.floor(Math.random() * chars.length)];
  }
  return resultado;
}

@Injectable()
export class MatriculaService {
  constructor(
    @Inject(MATRICULA_REPOSITORY) private readonly matriculaRepository: IMatriculaRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Registra la matrícula: crea Usuario (rol ESTUDIANTE) + Estudiante + Matricula
   * en una sola transacción. Devuelve también las credenciales generadas
   * (correo + contraseña temporal) para que Dirección las entregue una sola vez.
   */

  /** DELETE /api/matricula/:id — borra solo la matrícula, conserva al estudiante y su cuenta. */
  async eliminar(id: string) {
    await this.buscarPorId(id); // valida que exista, lanza MatriculaNoEncontradaException si no
    await this.matriculaRepository.eliminar(id);
  }

  /** DELETE /api/matricula/:id/completo — borra matrícula + estudiante + usuario, sin dejar rastro. */
  async eliminarCompleto(id: string) {
    const matricula = await this.matriculaRepository.buscarPorIdConDetalle(id);
    if (!matricula) throw new MatriculaNoEncontradaException();

    await this.prisma.$transaction(async (tx) => {
      // Borra todas las matrículas del estudiante (puede tener historial de años anteriores)
      await tx.matricula.deleteMany({ where: { estudianteId: matricula.estudianteId } });

      const estudiante = await tx.estudiante.findUnique({ where: { id: matricula.estudianteId } });
      if (estudiante) {
        // Borra el usuario: por la relación Estudiante.usuario (onDelete: Cascade),
        // esto elimina también el registro de Estudiante automáticamente.
        await tx.usuario.delete({ where: { id: estudiante.usuarioId } });
      }
    });
  }

  /** GET /api/matricula/mi-matricula — el estudiante autenticado ve su propia matrícula */
  async miMatricula(usuarioId: string) {
    const estudiante = await this.prisma.estudiante.findUnique({ where: { usuarioId } });
    if (!estudiante) throw new MatriculaNoEncontradaException();

    const matricula = await this.prisma.matricula.findFirst({
      where: { estudianteId: estudiante.id },
      orderBy: { fechaMatricula: 'desc' },
      include: { seccion: { include: { grado: true } } },
    });
    if (!matricula) throw new MatriculaNoEncontradaException();

    return {
      id: matricula.id,
      gradoNombre: matricula.seccion.grado.nombre,
      seccionNombre: matricula.seccion.nombre,
      nivel: matricula.seccion.grado.nivel,
      anioEscolar: matricula.anioEscolar,
      estado: matricula.estado,
      fechaMatricula: matricula.fechaMatricula,
    };
  }

  async registrar(data: RegistrarMatriculaData) {
    const seccion = await this.prisma.seccion.findUnique({ where: { id: data.seccionId } });
    if (!seccion) throw new SeccionNoEncontradaException();

    const dniExistente = await this.prisma.estudiante.findUnique({ where: { dni: data.alumno.dni } });
    if (dniExistente) throw new DniDuplicadoException();

    const correlativo = (await this.matriculaRepository.contarPorAnio(data.anioEscolar)) + 1;
    const email = `N${data.anioEscolar}${String(correlativo).padStart(3, '0')}@educore.com`;
    const passwordTemporal = generarPasswordTemporal();
    const passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);

    let tutorEsNuevo = false;
    let tutorEmail = '';
    let tutorPasswordTemporal = '';

    const resultado = await this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email, passwordHash, rol: 'ESTUDIANTE' },
      });

      const estudiante = await tx.estudiante.create({
        data: {
          usuarioId: usuario.id,
          nombres: data.alumno.nombres,
          apellidos: data.alumno.apellidos,
          dni: data.alumno.dni,
          fechaNacimiento: data.alumno.fechaNacimiento,
        },
      });

      let tutor = await tx.tutor.findUnique({ where: { dni: data.apoderado.dni } });
      if (!tutor) {
        tutorEsNuevo = true;
        tutorPasswordTemporal = generarPasswordTemporal();
        const tutorPasswordHash = await bcrypt.hash(tutorPasswordTemporal, SALT_ROUNDS);
        tutorEmail = `tutor.${data.apoderado.dni}@educore.com`;
        const usuarioTutor = await tx.usuario.create({
          data: { email: tutorEmail, passwordHash: tutorPasswordHash, rol: 'TUTOR' },
        });
        tutor = await tx.tutor.create({
          data: {
            usuarioId: usuarioTutor.id,
            nombres: data.apoderado.nombres,
            apellidos: data.apoderado.apellidos,
            dni: data.apoderado.dni,
            telefono: data.apoderado.telefono,
          },
        });
      }

      await tx.estudianteTutor.create({
        data: {
          estudianteId: estudiante.id,
          tutorId: tutor.id,
          parentesco: data.apoderado.parentesco,
        },
      });

      const matricula = await tx.matricula.create({
        data: {
          estudianteId: estudiante.id,
          seccionId: data.seccionId,
          anioEscolar: data.anioEscolar,
          estado: 'ACTIVA',
        },
      });

      return { estudiante, matricula };
    });

    return {
      matriculaId: resultado.matricula.id,
      estudiante: {
        nombres: data.alumno.nombres,
        apellidos: data.alumno.apellidos,
      },
      credenciales: {
        email,
        passwordTemporal,
      },
      credencialesTutor: tutorEsNuevo
        ? { email: tutorEmail, passwordTemporal: tutorPasswordTemporal }
        : null,
    };
  }

  async listar() {
    return this.matriculaRepository.listarConDetalle();
  }

  async buscarPorId(id: string) {
    const matricula = await this.matriculaRepository.buscarPorIdConDetalle(id);
    if (!matricula) throw new MatriculaNoEncontradaException();
    return matricula;
  }
}