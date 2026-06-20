// src/modules/auth/presentation/auth.controller.ts
// Capa de Presentación: recibe HTTP, valida DTO, delega en el Service. Sin lógica de negocio (sección 1).

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../business/auth.service';
import { LoginDto } from './dto/login.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import {
  CredencialesInvalidasException,
  CodigoInvalidoException,
  RefreshTokenInvalidoException,
} from '../business/exceptions/auth.exceptions';

const COOKIE_REFRESH = 'refreshToken';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth',
};

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const resultado = await this.authService.login(dto.email, dto.password);

      if ('requiere2FA' in resultado) {
        return resultado; // { requiere2FA: true, usuarioId }
      }

      res.cookie(COOKIE_REFRESH, resultado.refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        accessToken: resultado.accessToken,
        refreshToken: resultado.refreshToken,
      };
    } catch (err) {
      if (err instanceof CredencialesInvalidasException) {
        throw new UnauthorizedException(err.message);
      }
      throw err;
    }
  }

  // POST /api/auth/2fa/verify
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verify2FA(@Body() dto: Verify2FADto, @Res({ passthrough: true }) res: Response) {
    try {
      const resultado = await this.authService.verificar2FA(dto.usuarioId, dto.codigo);

      res.cookie(COOKIE_REFRESH, resultado.refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return resultado;
    } catch (err) {
      if (err instanceof CodigoInvalidoException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  // POST /api/auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.[COOKIE_REFRESH];
    if (!refreshToken) throw new UnauthorizedException('No hay refresh token');

    try {
      return await this.authService.refrescar(refreshToken);
    } catch (err) {
      if (err instanceof RefreshTokenInvalidoException) {
        throw new UnauthorizedException(err.message);
      }
      throw err;
    }
  }

  // POST /api/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[COOKIE_REFRESH];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie(COOKIE_REFRESH, { path: '/api/auth' });
  }
}
