// src/modules/docente/docente.module.ts
import { Module } from '@nestjs/common';
import { DocenteController } from './presentation/docente.controller';
import { DocenteService } from './business/docente.service';
import { DocentePrismaRepository } from './data/docente.prisma.repository';
import { DOCENTE_REPOSITORY } from './data/docente.repository.interface';

@Module({
  controllers: [DocenteController],
  providers: [
    DocenteService,
    { provide: DOCENTE_REPOSITORY, useClass: DocentePrismaRepository },
  ],
  exports: [DocenteService],
})
export class DocenteModule {}