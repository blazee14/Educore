// src/modules/academico/business/academico.service.ts
// Capa de Negocio: agrupa secciones por grado para el año escolar consultado.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AcademicoService {
  constructor(private readonly prisma: PrismaService) {}

  async seccionesDisponibles(anioEscolar: number) {
    const grados = await this.prisma.grado.findMany({
      include: {
        secciones: {
          where: { anioEscolar },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return grados
      .filter((g) => g.secciones.length > 0)
      .map((g) => ({
        gradoId: g.id,
        gradoNombre: g.nombre,
        nivel: g.nivel,
        secciones: g.secciones.map((s) => ({ id: s.id, nombre: s.nombre })),
      }));
  }
}