// src/modules/matricula/matricula.module.ts
import { Module } from '@nestjs/common';
import { MatriculaController } from './presentation/matricula.controller';
import { MatriculaService } from './business/matricula.service';
import { MatriculaPrismaRepository } from './data/matricula.prisma.repository';
import { MATRICULA_REPOSITORY } from './data/matricula.repository.interface';

@Module({
  controllers: [MatriculaController],
  providers: [
    MatriculaService,
    {
      provide: MATRICULA_REPOSITORY,
      useClass: MatriculaPrismaRepository,
    },
  ],
  exports: [MatriculaService],
})
export class MatriculaModule {}