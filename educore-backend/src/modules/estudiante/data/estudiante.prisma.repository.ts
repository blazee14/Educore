// src/modules/estudiante/data/estudiante.prisma.repository.ts
// Capa de Datos: única que conoce Prisma/SQL. Sin reglas de negocio (sección 1, capa Datos).
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IEstudianteRepository,
  CrearEstudianteData,
} from './estudiante.repository.interface';
import { Estudiante } from '../domain/estudiante.entity';

@Injectable()
export class EstudiantePrismaRepository implements IEstudianteRepository {
  constructor(private readonly prisma: PrismaService) {}

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