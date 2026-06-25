// src/modules/academico/presentation/academico.controller.ts
// Capa de Presentación: catálogo de Grado/Sección, consumido por Matrícula, Cursos y otros módulos.
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AcademicoService } from '../business/academico.service';

@Controller('api/academico')
@UseGuards(JwtAuthGuard)
export class AcademicoController {
  constructor(private readonly academicoService: AcademicoService) {}

  // GET /api/academico/secciones-disponibles?anioEscolar=2026
  @Get('secciones-disponibles')
  seccionesDisponibles(@Query('anioEscolar') anioEscolar?: string) {
    const anio = anioEscolar ? parseInt(anioEscolar, 10) : new Date().getFullYear();
    return this.academicoService.seccionesDisponibles(anio);
  }
}