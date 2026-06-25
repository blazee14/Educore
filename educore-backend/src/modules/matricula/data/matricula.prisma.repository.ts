// src/modules/matricula/data/matricula.prisma.repository.ts
// Capa de Datos: única que conoce Prisma/SQL. Sin reglas de negocio.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IMatriculaRepository,
  RegistrarMatriculaData,
  MatriculaConDetalle,
} from './matricula.repository.interface';
import { Matricula } from '../domain/matricula.entity';

@Injectable()
export class MatriculaPrismaRepository implements IMatriculaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(
    data: RegistrarMatriculaData,
    usuarioId: string,
    estudianteId: string,
  ): Promise<Matricula> {
    const row = await this.prisma.matricula.create({
      data: {
        estudianteId,
        seccionId: data.seccionId,
        anioEscolar: data.anioEscolar,
        estado: 'ACTIVA',
      },
    });
    return new Matricula(row.id, row.estudianteId, row.seccionId, row.anioEscolar, row.estado, row.fechaMatricula);
  }

  async listarConDetalle(): Promise<MatriculaConDetalle[]> {
    const rows = await this.prisma.matricula.findMany({
      orderBy: { fechaMatricula: 'desc' },
      include: {
        estudiante: true,
        seccion: { include: { grado: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      estudianteId: row.estudianteId,
      nombres: row.estudiante.nombres,
      apellidos: row.estudiante.apellidos,
      dni: row.estudiante.dni,
      gradoNombre: row.seccion.grado.nombre,
      seccionNombre: row.seccion.nombre,
      nivel: row.seccion.grado.nivel,
      anioEscolar: row.anioEscolar,
      estado: row.estado,
      fechaMatricula: row.fechaMatricula,
    }));
  }

  async buscarPorIdConDetalle(id: string): Promise<MatriculaConDetalle | null> {
    const row = await this.prisma.matricula.findUnique({
      where: { id },
      include: {
        estudiante: true,
        seccion: { include: { grado: true } },
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      estudianteId: row.estudianteId,
      nombres: row.estudiante.nombres,
      apellidos: row.estudiante.apellidos,
      dni: row.estudiante.dni,
      gradoNombre: row.seccion.grado.nombre,
      seccionNombre: row.seccion.nombre,
      nivel: row.seccion.grado.nivel,
      anioEscolar: row.anioEscolar,
      estado: row.estado,
      fechaMatricula: row.fechaMatricula,
    };
  }

  async contarPorAnio(anioEscolar: number): Promise<number> {
    return this.prisma.matricula.count({ where: { anioEscolar } });
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.matricula.delete({ where: { id } });
  }
}