// src/modules/academico/academico.module.ts
import { Module } from '@nestjs/common';
import { AcademicoController } from './presentation/academico.controller';
import { AcademicoService } from './business/academico.service';

@Module({
  controllers: [AcademicoController],
  providers: [AcademicoService],
  exports: [AcademicoService],
})
export class AcademicoModule {}