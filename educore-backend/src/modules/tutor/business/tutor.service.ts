// src/modules/tutor/business/tutor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';

const SALT_ROUNDS = 10;

@Injectable()
export class TutorService {
  constructor(private readonly prisma: PrismaService) {}

  /** PATCH /api/tutores/:id/reset-password */
  async resetearPassword(id: string) {
    const tutor = await this.prisma.tutor.findUnique({ where: { id } });
    if (!tutor) throw new NotFoundException('Tutor no encontrado');

    const passwordTemporal = this.generarPasswordTemporal();
    const passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);

    const usuario = await this.prisma.usuario.update({
      where: { id: tutor.usuarioId },
      data: { passwordHash },
    });

    return { email: usuario.email, passwordTemporal };
  }

  private generarPasswordTemporal(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let resultado = '';
    for (let i = 0; i < 8; i++) {
      resultado += chars[Math.floor(Math.random() * chars.length)];
    }
    return resultado;
  }

  /** GET /api/tutores/me/hijos — el tutor autenticado ve a sus hijos matriculados */
  async misHijos(usuarioId: string) {
    const tutor = await this.prisma.tutor.findUnique({ where: { usuarioId } });
    if (!tutor) throw new NotFoundException('Tutor no encontrado');

    const relaciones = await this.prisma.estudianteTutor.findMany({
      where: { tutorId: tutor.id },
      include: {
        estudiante: {
          include: {
            matriculas: {
              orderBy: { fechaMatricula: 'desc' },
              take: 1,
              include: { seccion: { include: { grado: true } } },
            },
          },
        },
      },
    });

    return relaciones.map((rel) => {
      const matriculaReciente = rel.estudiante.matriculas[0];
      return {
        estudianteId: rel.estudiante.id,
        nombres: rel.estudiante.nombres,
        apellidos: rel.estudiante.apellidos,
        dni: rel.estudiante.dni,
        parentesco: rel.parentesco,
        gradoNombre: matriculaReciente?.seccion.grado.nombre ?? null,
        seccionNombre: matriculaReciente?.seccion.nombre ?? null,
        estadoMatricula: matriculaReciente?.estado ?? null,
      };
    });
  }

  /** GET /api/tutores/me */
  async miPerfil(usuarioId: string) {
    const tutor = await this.prisma.tutor.findUnique({ where: { usuarioId } });
    if (!tutor) throw new NotFoundException('Tutor no encontrado');
    return { nombres: tutor.nombres, apellidos: tutor.apellidos };
  }
}