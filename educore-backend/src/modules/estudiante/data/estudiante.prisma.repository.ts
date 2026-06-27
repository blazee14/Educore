// src/modules/estudiante/data/estudiante.prisma.repository.ts
// Capa de Datos: única que conoce Prisma/SQL. Sin reglas de negocio (sección 1, capa Datos).
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IEstudianteRepository,
  CrearEstudianteData,
  EstudianteConDetalle,
} from './estudiante.repository.interface';
import { Estudiante } from '../domain/estudiante.entity';

@Injectable()
export class EstudiantePrismaRepository implements IEstudianteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarConDetalle(): Promise<EstudianteConDetalle[]> {
    const rows = await this.prisma.estudiante.findMany({
      include: {
        usuario: true,
        matriculas: {
          orderBy: { fechaMatricula: 'desc' },
          take: 1,
          include: { seccion: { include: { grado: true } } },
        },
        tutores: { include: { tutor: { include: { usuario: true } } } },
      },
      orderBy: { apellidos: 'asc' },
    });
    return rows.map((row) => this.mapearConDetalle(row));
  }

  async buscarDetallePorId(id: string): Promise<EstudianteConDetalle | null> {
    const row = await this.prisma.estudiante.findUnique({
      where: { id },
      include: {
        usuario: true,
        matriculas: {
          orderBy: { fechaMatricula: 'desc' },
          take: 1,
          include: { seccion: { include: { grado: true } } },
        },
        tutores: { include: { tutor: { include: { usuario: true } } } },
      },
    });
    return row ? this.mapearConDetalle(row) : null;
  }

  private mapearConDetalle(row: any): EstudianteConDetalle {
    const matriculaReciente = row.matriculas[0];
    return {
      id: row.id,
      usuarioId: row.usuarioId,
      email: row.usuario.email,
      nombres: row.nombres,
      apellidos: row.apellidos,
      dni: row.dni,
      fechaNacimiento: row.fechaNacimiento,
      seccionId: matriculaReciente?.seccion.id ?? null,
      gradoNombre: matriculaReciente?.seccion.grado.nombre ?? null,
      seccionNombre: matriculaReciente?.seccion.nombre ?? null,
      tutores: row.tutores.map((et: any) => ({
        id: et.tutor.id,
        email: et.tutor.usuario.email,
        nombres: et.tutor.nombres,
        apellidos: et.tutor.apellidos,
        telefono: et.tutor.telefono,
        parentesco: et.parentesco,
      })),
    };
  }

  private mapear(row: any): Estudiante {
    return new Estudiante(
      row.id,
      row.usuarioId,
      row.nombres,
      row.apellidos,
      row.dni,
      row.fechaNacimiento,
    );
  }

  async crear(data: CrearEstudianteData): Promise<Estudiante> {
    const row = await this.prisma.estudiante.create({ data });
    return this.mapear(row);
  }

  async buscarPorId(id: string): Promise<Estudiante | null> {
    const row = await this.prisma.estudiante.findUnique({ where: { id } });
    return row ? this.mapear(row) : null;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Estudiante | null> {
    const row = await this.prisma.estudiante.findUnique({ where: { usuarioId } });
    return row ? this.mapear(row) : null;
  }

  async buscarPorDni(dni: string): Promise<Estudiante | null> {
    const row = await this.prisma.estudiante.findUnique({ where: { dni } });
    return row ? this.mapear(row) : null;
  }

  async listarTodos(): Promise<Estudiante[]> {
    const rows = await this.prisma.estudiante.findMany({ orderBy: { apellidos: 'asc' } });
    return rows.map((row) => this.mapear(row));
  }

  async actualizar(id: string, data: Partial<CrearEstudianteData>): Promise<Estudiante> {
    const row = await this.prisma.estudiante.update({ where: { id }, data });
    return this.mapear(row);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.estudiante.delete({ where: { id } });
  }
}