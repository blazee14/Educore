// src/modules/tutor/tutor.module.ts
import { Module } from '@nestjs/common';
import { TutorController } from './presentation/tutor.controller';
import { TutorService } from './business/tutor.service';

@Module({
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {}