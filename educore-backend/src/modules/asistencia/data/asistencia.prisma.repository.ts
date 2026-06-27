// src/modules/asistencia/data/asistencia.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IAsistenciaRepository,
  RegistroAsistencia,
  AlumnoParaAsistencia,
  AsistenciaResumen,
} from './asistencia.repository.interface';

@Injectable()
export class AsistenciaPrismaRepository implements IAsistenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrarLote(seccionId: string, fecha: Date, registros: RegistroAsistencia[]): Promise<void> {
    await this.prisma.$transaction(
      registros.map((r) =>
        this.prisma.asistencia.upsert({
          where: { estudianteId_fecha: { estudianteId: r.estudianteId, fecha } },
          update: { estado: r.estado, seccionId },
          create: { estudianteId: r.estudianteId, seccionId, fecha, estado: r.estado },
        }),
      ),
    );
  }

  async listarPorSeccionYFecha(seccionId: string, fecha: Date): Promise<AlumnoParaAsistencia[]> {
    const matriculas = await this.prisma.matricula.findMany({
      where: { seccionId, estado: 'ACTIVA' },
      include: {
        estudiante: {
          include: {
            asistencias: { where: { fecha } },
          },
        },
      },
      orderBy: { estudiante: { apellidos: 'asc' } },
    });

    return matriculas.map((m) => ({
      estudianteId: m.estudiante.id,
      nombres: m.estudiante.nombres,
      apellidos: m.estudiante.apellidos,
      estadoActual: m.estudiante.asistencias[0]?.estado ?? null,
    }));
  }

  async listarPorEstudiante(estudianteId: string, anioEscolar: number): Promise<AsistenciaResumen[]> {
    const inicio = new Date(`${anioEscolar}-01-01`);
    const fin = new Date(`${anioEscolar}-12-31`);
    const rows = await this.prisma.asistencia.findMany({
      where: { estudianteId, fecha: { gte: inicio, lte: fin } },
      orderBy: { fecha: 'desc' },
    });
    return rows.map((r) => ({ fecha: r.fecha.toISOString().slice(0, 10), estado: r.estado }));
  }
}