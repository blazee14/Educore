// src/modules/estudiante/presentation/estudiante.controller.ts
// Capa de Presentación: HTTP, validación de entrada, guards. No conoce SQL ni reglas de negocio.
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { EstudianteService } from '../business/estudiante.service';
import { CrearEstudianteDto } from './dto/crear-estudiante.dto';
import { ActualizarEstudianteDto } from './dto/actualizar-estudiante.dto';

@Controller('api/estudiantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @Roles('ADMIN')
  crear(@Body() dto: CrearEstudianteDto) {
    return this.estudianteService.crear({
      ...dto,
      fechaNacimiento: new Date(dto.fechaNacimiento),
    });
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE')
  listarTodos() {
    return this.estudianteService.listarTodos();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE')
  buscarPorId(@Param('id') id: string) {
    return this.estudianteService.buscarPorId(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarEstudianteDto) {
    const data = {
      ...dto,
      fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
    };
    return this.estudianteService.actualizar(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  eliminar(@Param('id') id: string) {
    return this.estudianteService.eliminar(id);
  }
}