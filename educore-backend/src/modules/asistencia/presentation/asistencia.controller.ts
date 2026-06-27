// src/modules/asistencia/presentation/asistencia.controller.ts
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AsistenciaService } from '../business/asistencia.service';
import { RegistrarAsistenciaDto } from './dto/registrar-asistencia.dto';

const ANIO_ACTUAL = new Date().getFullYear();

@Controller('api/asistencia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  // El registro lo puede hacer el Docente (cuando exista su dashboard) o Admin como respaldo
  @Post()
  @Roles('DOCENTE', 'ADMIN')
  registrar(@Body() dto: RegistrarAsistenciaDto) {
    return this.asistenciaService.registrar(dto.seccionId, dto.fecha, dto.registros);
  }

  @Get('mi-asistencia')
  @Roles('ESTUDIANTE')
  miAsistencia(@Req() req: Request, @Query('anioEscolar') anioEscolar?: string) {
    const usuarioId = (req.user as any).id;
    return this.asistenciaService.miAsistencia(usuarioId, anioEscolar ? +anioEscolar : ANIO_ACTUAL);
  }

  @Get('hijo/:estudianteId')
  @Roles('TUTOR')
  asistenciaDeHijo(
    @Req() req: Request,
    @Param('estudianteId') estudianteId: string,
    @Query('anioEscolar') anioEscolar?: string,
  ) {
    const usuarioId = (req.user as any).id;
    return this.asistenciaService.asistenciaDeHijo(usuarioId, estudianteId, anioEscolar ? +anioEscolar : ANIO_ACTUAL);
  }

  @Get('seccion/:seccionId')
  @Roles('DOCENTE', 'ADMIN', 'DIRECTOR')
  listarPorSeccion(@Param('seccionId') seccionId: string, @Query('fecha') fecha: string) {
    return this.asistenciaService.listarPorSeccion(seccionId, fecha);
  }

  @Get('estudiante/:estudianteId')
  @Roles('ADMIN', 'DIRECTOR')
  listarPorEstudiante(@Param('estudianteId') estudianteId: string, @Query('anioEscolar') anioEscolar?: string) {
    return this.asistenciaService.listarPorEstudiante(estudianteId, anioEscolar ? +anioEscolar : ANIO_ACTUAL);
  }
}