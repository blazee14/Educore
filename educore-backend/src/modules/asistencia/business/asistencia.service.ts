// src/modules/asistencia/business/asistencia.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ASISTENCIA_REPOSITORY,
  IAsistenciaRepository,
  RegistroAsistencia,
} from '../data/asistencia.repository.interface';

@Injectable()
export class AsistenciaService {
  constructor(
    @Inject(ASISTENCIA_REPOSITORY) private readonly asistenciaRepository: IAsistenciaRepository,
    private readonly prisma: PrismaService,
  ) {}

  /** POST /api/asistencia — registrado por Docente o Admin */
  async registrar(seccionId: string, fecha: string, registros: RegistroAsistencia[]) {
    return this.asistenciaRepository.registrarLote(seccionId, new Date(fecha), registros);
  }

  /** GET /api/asistencia/seccion/:seccionId?fecha=YYYY-MM-DD — para marcar/revisar el día */
  async listarPorSeccion(seccionId: string, fecha: string) {
    return this.asistenciaRepository.listarPorSeccionYFecha(seccionId, new Date(fecha));
  }

  /** GET /api/asistencia/estudiante/:estudianteId — para Admin/Director consultando a alguien puntual */
  async listarPorEstudiante(estudianteId: string, anioEscolar: number) {
    return this.calcularResumen(estudianteId, anioEscolar);
  }

  /** GET /api/asistencia/mi-asistencia — el propio Estudiante */
  async miAsistencia(usuarioId: string, anioEscolar: number) {
    const estudiante = await this.prisma.estudiante.findUnique({ where: { usuarioId } });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return this.calcularResumen(estudiante.id, anioEscolar);
  }

  /** GET /api/asistencia/hijo/:estudianteId — el Tutor consultando a un hijo suyo (valida relación) */
  async asistenciaDeHijo(usuarioId: string, estudianteId: string, anioEscolar: number) {
    const tutor = await this.prisma.tutor.findUnique({ where: { usuarioId } });
    if (!tutor) throw new NotFoundException('Tutor no encontrado');

    const relacion = await this.prisma.estudianteTutor.findFirst({
      where: { tutorId: tutor.id, estudianteId },
    });
    if (!relacion) throw new NotFoundException('Este estudiante no está asociado a tu cuenta');

    return this.calcularResumen(estudianteId, anioEscolar);
  }

  private async calcularResumen(estudianteId: string, anioEscolar: number) {
    const registros = await this.asistenciaRepository.listarPorEstudiante(estudianteId, anioEscolar);
    const total = registros.length;
    const presentes = registros.filter((r) => r.estado === 'PRESENTE').length;
    const tardanzas = registros.filter((r) => r.estado === 'TARDANZA').length;
    const faltas = registros.filter((r) => r.estado === 'FALTA').length;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

    return { registros, total, presentes, tardanzas, faltas, porcentajeAsistencia: porcentaje };
  }
}