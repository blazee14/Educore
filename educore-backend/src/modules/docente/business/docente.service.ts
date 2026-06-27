// src/modules/docente/business/docente.service.ts
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { DOCENTE_REPOSITORY, IDocenteRepository } from '../data/docente.repository.interface';
import {
  DocenteNoEncontradoException,
  DniDuplicadoDocenteException,
  EmailDuplicadoDocenteException,
} from './exceptions/docente.exceptions';

const SALT_ROUNDS = 10;

function generarPasswordTemporal(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let resultado = '';
  for (let i = 0; i < 8; i++) {
    resultado += chars[Math.floor(Math.random() * chars.length)];
  }
  return resultado;
}

interface CrearDocenteInput {
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
}

@Injectable()
export class DocenteService {
  constructor(
    @Inject(DOCENTE_REPOSITORY) private readonly docenteRepository: IDocenteRepository,
    private readonly prisma: PrismaService,
  ) {}

  async crear(input: CrearDocenteInput) {
    const usuarioExistente = await this.prisma.usuario.findUnique({ where: { email: input.email } });
    if (usuarioExistente) throw new EmailDuplicadoDocenteException();

    const dniExistente = await this.docenteRepository.buscarPorDni(input.dni);
    if (dniExistente) throw new DniDuplicadoDocenteException();

    const passwordTemporal = generarPasswordTemporal();
    const passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);

    const docente = await this.docenteRepository.crear({ ...input, passwordHash });

    return {
      docenteId: docente.id,
      docente: { nombres: input.nombres, apellidos: input.apellidos },
      credenciales: { email: input.email, passwordTemporal },
    };
  }

  async asignar(docenteId: string, cursoId: string, seccionId: string) {
    await this.prisma.docenteCursoSeccion.create({
      data: { docenteId, cursoId, seccionId },
    });
    return this.buscarDetallePorId(docenteId);
  }

  async quitarAsignacion(asignacionId: string) {
    await this.prisma.docenteCursoSeccion.delete({ where: { id: asignacionId } });
  }

  async listarConDetalle() {
    return this.docenteRepository.listarConDetalle();
  }

  async buscarDetallePorId(id: string) {
    const docente = await this.docenteRepository.buscarDetallePorId(id);
    if (!docente) throw new DocenteNoEncontradoException();
    return docente;
  }

  async eliminar(id: string) {
    await this.buscarDetallePorId(id);
    await this.docenteRepository.eliminar(id);
  }

  async misAsignaciones(usuarioId: string) {
    const docente = await this.docenteRepository.buscarPorUsuarioId(usuarioId);
    if (!docente) throw new DocenteNoEncontradoException();
    const detalle = await this.docenteRepository.buscarDetallePorId(docente.id);
    return detalle?.asignaciones ?? [];
  }
}