// src/modules/docente/presentation/docente.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { DocenteService } from '../business/docente.service';
import { CrearDocenteDto } from './dto/crear-docente.dto';
import { AsignarCursoDto } from './dto/asignar-curso.dto';

@Controller('api/docentes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Get('mis-asignaciones')
  @Roles('DOCENTE')
  misAsignaciones(@Req() req: Request) {
    const usuarioId = (req.user as any).id;
    return this.docenteService.misAsignaciones(usuarioId);
  }

  @Post()
  @Roles('ADMIN')
  crear(@Body() dto: CrearDocenteDto) {
    return this.docenteService.crear(dto);
  }

  @Get()
  @Roles('ADMIN', 'DIRECTOR')
  listar() {
    return this.docenteService.listarConDetalle();
  }

  @Get(':id')
  @Roles('ADMIN', 'DIRECTOR')
  buscarPorId(@Param('id') id: string) {
    return this.docenteService.buscarDetallePorId(id);
  }

  @Post(':id/asignaciones')
  @Roles('ADMIN')
  asignar(@Param('id') id: string, @Body() dto: AsignarCursoDto) {
    return this.docenteService.asignar(id, dto.cursoId, dto.seccionId);
  }

  @Delete(':id/asignaciones/:asignacionId')
  @Roles('ADMIN')
  quitarAsignacion(@Param('asignacionId') asignacionId: string) {
    return this.docenteService.quitarAsignacion(asignacionId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  eliminar(@Param('id') id: string) {
    return this.docenteService.eliminar(id);
  }
}