// src/modules/auth/data/auth.prisma.repository.ts
// Capa de Datos: única que conoce Prisma/SQL. Sin reglas de negocio (sección 1, capa Datos).

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAuthRepository, SesionRefreshToken } from './auth.repository.interface';
import { Usuario } from '../domain/usuario.entity';

@Injectable()
export class AuthPrismaRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const row = await this.prisma.usuario.findUnique({ where: { email } });
    if (!row) return null;
    return new Usuario(row.id, row.email, row.passwordHash, row.rol, row.dosFaActivo);
  }

  async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    const row = await this.prisma.usuario.findUnique({ where: { id } });
    if (!row) return null;
    return new Usuario(row.id, row.email, row.passwordHash, row.rol, row.dosFaActivo);
  }

  async guardarCodigo2FA(usuarioId: string, codigoHash: string, expiraEn: Date): Promise<void> {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { dosFaCodigoHash: codigoHash, dosFaExpiraEn: expiraEn },
    });
  }

  async obtenerCodigo2FA(usuarioId: string) {
    const row = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { dosFaCodigoHash: true, dosFaExpiraEn: true },
    });
    if (!row?.dosFaCodigoHash || !row.dosFaExpiraEn) return null;
    return { codigoHash: row.dosFaCodigoHash, expiraEn: row.dosFaExpiraEn };
  }

  async limpiarCodigo2FA(usuarioId: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { dosFaCodigoHash: null, dosFaExpiraEn: null },
    });
  }

  async crearSesion(usuarioId: string, tokenHash: string, expiraEn: Date): Promise<SesionRefreshToken> {
    return this.prisma.sesionRefreshToken.create({
      data: { usuarioId, tokenHash, expiraEn },
    });
  }

  async buscarSesionPorTokenHash(tokenHash: string): Promise<SesionRefreshToken | null> {
    return this.prisma.sesionRefreshToken.findFirst({
      where: { tokenHash, revocado: false },
    });
  }

  async revocarSesion(sesionId: string): Promise<void> {
    await this.prisma.sesionRefreshToken.update({
      where: { id: sesionId },
      data: { revocado: true },
    });
  }

  async registrarAuditoria(usuarioId: string, accion: string): Promise<void> {
    await this.prisma.auditLog.create({ data: { usuarioId, accion } });
  }
}
