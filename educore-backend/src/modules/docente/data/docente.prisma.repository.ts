// src/modules/docente/data/docente.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IDocenteRepository,
  CrearDocenteData,
  DocenteConDetalle,
} from './docente.repository.interface';
import { Docente } from '../domain/docente.entity';

@Injectable()
export class DocentePrismaRepository implements IDocenteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearDocenteData): Promise<Docente> {
    const usuario = await this.prisma.usuario.create({
      data: { email: data.email, passwordHash: data.passwordHash, rol: 'DOCENTE' },
    });
    const row = await this.prisma.docente.create({
      data: {
        usuarioId: usuario.id,
        nombres: data.nombres,
        apellidos: data.apellidos,
        dni: data.dni,
        telefono: data.telefono,
      },
    });
    return this.mapear(row);
  }

  async buscarPorDni(dni: string): Promise<Docente | null> {
    const row = await this.prisma.docente.findUnique({ where: { dni } });
    return row ? this.mapear(row) : null;
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Docente | null> {
    const row = await this.prisma.docente.findUnique({ where: { usuarioId } });
    return row ? this.mapear(row) : null;
  }

  async listarConDetalle(): Promise<DocenteConDetalle[]> {
    const rows = await this.prisma.docente.findMany({
      include: {
        usuario: true,
        asignaciones: { include: { curso: true, seccion: { include: { grado: true } } } },
      },
      orderBy: { apellidos: 'asc' },
    });
    return rows.map((row) => this.mapearConDetalle(row));
  }

  async buscarDetallePorId(id: string): Promise<DocenteConDetalle | null> {
    const row = await this.prisma.docente.findUnique({
      where: { id },
      include: {
        usuario: true,
        asignaciones: { include: { curso: true, seccion: { include: { grado: true } } } },
      },
    });
    return row ? this.mapearConDetalle(row) : null;
  }

  async eliminar(id: string): Promise<void> {
    const docente = await this.prisma.docente.findUnique({ where: { id } });
    if (docente) {
      await this.prisma.usuario.delete({ where: { id: docente.usuarioId } });
    }
  }

  private mapear(row: any): Docente {
    return new Docente(row.id, row.usuarioId, row.nombres, row.apellidos, row.dni, row.telefono);
  }

  private mapearConDetalle(row: any): DocenteConDetalle {
    return {
      id: row.id,
      usuarioId: row.usuarioId,
      email: row.usuario.email,
      nombres: row.nombres,
      apellidos: row.apellidos,
      dni: row.dni,
      telefono: row.telefono,
      asignaciones: row.asignaciones.map((a: any) => ({
        id: a.id,
        cursoNombre: a.curso.nombre,
        gradoNombre: a.seccion.grado.nombre,
        seccionNombre: a.seccion.nombre,
      })),
    };
  }
}