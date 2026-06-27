// src/modules/asistencia/asistencia.module.ts
import { Module } from '@nestjs/common';
import { AsistenciaController } from './presentation/asistencia.controller';
import { AsistenciaService } from './business/asistencia.service';
import { AsistenciaPrismaRepository } from './data/asistencia.prisma.repository';
import { ASISTENCIA_REPOSITORY } from './data/asistencia.repository.interface';

@Module({
  controllers: [AsistenciaController],
  providers: [
    AsistenciaService,
    { provide: ASISTENCIA_REPOSITORY, useClass: AsistenciaPrismaRepository },
  ],
  exports: [AsistenciaService],
})
export class AsistenciaModule {}