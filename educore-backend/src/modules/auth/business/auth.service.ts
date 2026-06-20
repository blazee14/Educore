// src/modules/auth/business/auth.service.ts
// Capa de Negocio: reglas del módulo Auth. No conoce HTTP ni SQL (sección 1, capa Negocio).

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AUTH_REPOSITORY, IAuthRepository } from '../data/auth.repository.interface';
import {
  CredencialesInvalidasException,
  CodigoInvalidoException,
  RefreshTokenInvalidoException,
} from './exceptions/auth.exceptions';

const REFRESH_TOKEN_DIAS = 7;
const CODIGO_2FA_MINUTOS = 5;

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * POST /api/auth/login (sección 3.2)
   * Si el usuario tiene 2FA activo, no entrega tokens todavía:
   * genera un código y espera la verificación en /api/auth/2fa/verify.
   */
  async login(email: string, password: string) {
    const usuario = await this.authRepository.buscarUsuarioPorEmail(email);
    if (!usuario) throw new CredencialesInvalidasException();

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValido) throw new CredencialesInvalidasException();

    if (usuario.dosFaActivo) {
      const codigo = this.generarCodigo6Digitos();
      const codigoHash = hashToken(codigo);
      const expiraEn = new Date(Date.now() + CODIGO_2FA_MINUTOS * 60_000);

      await this.authRepository.guardarCodigo2FA(usuario.id, codigoHash, expiraEn);
      // En producción: enviar `codigo` por email/SMS, nunca devolverlo en la respuesta.
      // Aquí se expone solo en entorno de desarrollo para poder probar el flujo.
      return {
        requiere2FA: true,
        usuarioId: usuario.id,
        ...(process.env.NODE_ENV !== 'production' ? { codigoDev: codigo } : {}),
      };
    }

    await this.authRepository.registrarAuditoria(usuario.id, 'LOGIN_EXITOSO');
    return this.emitirTokens(usuario.id, usuario.rol);
  }

  /**
   * POST /api/auth/2fa/verify (sección 3.2)
   */
  async verificar2FA(usuarioId: string, codigo: string) {
    const registro = await this.authRepository.obtenerCodigo2FA(usuarioId);
    if (!registro) throw new CodigoInvalidoException();
    if (registro.expiraEn.getTime() < Date.now()) throw new CodigoInvalidoException();

    const codigoHash = hashToken(codigo);
    if (codigoHash !== registro.codigoHash) throw new CodigoInvalidoException();

    await this.authRepository.limpiarCodigo2FA(usuarioId);

    const usuario = await this.authRepository.buscarUsuarioPorId(usuarioId);
    if (!usuario) throw new CredencialesInvalidasException();

    await this.authRepository.registrarAuditoria(usuario.id, 'LOGIN_2FA_EXITOSO');
    return this.emitirTokens(usuario.id, usuario.rol);
  }

  /**
   * POST /api/auth/refresh (sección 3.2)
   */
  async refrescar(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    const sesion = await this.authRepository.buscarSesionPorTokenHash(tokenHash);

    if (!sesion || sesion.revocado || sesion.expiraEn.getTime() < Date.now()) {
      throw new RefreshTokenInvalidoException();
    }

    const usuario = await this.authRepository.buscarUsuarioPorId(sesion.usuarioId);
    if (!usuario) throw new RefreshTokenInvalidoException();

    const accessToken = this.jwtService.sign(
      { sub: usuario.id, rol: usuario.rol },
      { expiresIn: '15m' },
    );

    return { accessToken };
  }

  /**
   * POST /api/auth/logout (sección 3.2)
   */
  async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    const sesion = await this.authRepository.buscarSesionPorTokenHash(tokenHash);
    if (sesion) {
      await this.authRepository.revocarSesion(sesion.id);
      await this.authRepository.registrarAuditoria(sesion.usuarioId, 'LOGOUT');
    }
  }

  // ---- privados ----

  private async emitirTokens(usuarioId: string, rol: string) {
    const accessToken = this.jwtService.sign({ sub: usuarioId, rol }, { expiresIn: '15m' });

    const refreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = hashToken(refreshToken);
    const expiraEn = new Date(Date.now() + REFRESH_TOKEN_DIAS * 24 * 60 * 60_000);

    await this.authRepository.crearSesion(usuarioId, tokenHash, expiraEn);

    return { accessToken, refreshToken };
  }

  private generarCodigo6Digitos(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  }
}
