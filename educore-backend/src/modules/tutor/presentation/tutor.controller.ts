// src/modules/tutor/presentation/tutor.controller.ts
import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { TutorService } from '../business/tutor.service';

@Controller('api/tutores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Patch(':id/reset-password')
  @Roles('ADMIN')
  resetearPassword(@Param('id') id: string) {
    return this.tutorService.resetearPassword(id);
  }
}