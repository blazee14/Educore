// src/modules/estudiante/estudiante.module.ts
// Conecta las 3 capas: Presentación (Controller) usa Negocio (Service),
// que depende de la ABSTRACCIÓN IEstudianteRepository, no de la implementación Prisma directamente.
import { Module } from '@nestjs/common';
import { EstudianteController } from './presentation/estudiante.controller';
import { EstudianteService } from './business/estudiante.service';
import { EstudiantePrismaRepository } from './data/estudiante.prisma.repository';
import { ESTUDIANTE_REPOSITORY } from './data/estudiante.repository.interface';

@Module({
  controllers: [EstudianteController],
  providers: [
    EstudianteService,
    {
      provide: ESTUDIANTE_REPOSITORY,
      useClass: EstudiantePrismaRepository, // <- el único lugar donde se elige la implementación concreta
    },
  ],
  exports: [EstudianteService],
})
export class EstudianteModule {}