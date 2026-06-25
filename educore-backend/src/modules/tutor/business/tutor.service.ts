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
}