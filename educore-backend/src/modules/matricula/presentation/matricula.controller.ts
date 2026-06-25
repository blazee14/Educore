// src/modules/matricula/presentation/matricula.controller.ts
// Capa de Presentación: HTTP, validación de entrada, guards.
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { MatriculaService } from '../business/matricula.service';
import { RegistrarMatriculaDto } from './dto/registrar-matricula.dto';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('api/matricula')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Post()
  @Roles('DIRECTOR', 'ADMIN')
  registrar(@Body() dto: RegistrarMatriculaDto) {
    return this.matriculaService.registrar({
      alumno: {
        ...dto.alumno,
        fechaNacimiento: new Date(dto.alumno.fechaNacimiento),
      },
      apoderado: dto.apoderado,
      seccionId: dto.seccionId,
      anioEscolar: dto.anioEscolar,
    });
  }

  @Get()
  @Roles('DIRECTOR', 'ADMIN')
  listar() {
    return this.matriculaService.listar();
  }

  @Get(':id')
  @Roles('DIRECTOR', 'ADMIN')
  buscarPorId(@Param('id') id: string) {
    return this.matriculaService.buscarPorId(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  eliminar(@Param('id') id: string) {
    return this.matriculaService.eliminar(id);
  }

  @Delete(':id/completo')
  @Roles('ADMIN')
  eliminarCompleto(@Param('id') id: string) {
    return this.matriculaService.eliminarCompleto(id);
  }
}