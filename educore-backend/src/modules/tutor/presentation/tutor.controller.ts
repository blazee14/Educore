// src/modules/tutor/presentation/tutor.controller.ts
import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { TutorService } from '../business/tutor.service';

@Controller('api/tutores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Get('me/hijos')
  @Roles('TUTOR')
  misHijos(@Req() req: Request) {
    const usuarioId = (req.user as any).id;
    return this.tutorService.misHijos(usuarioId);
  }

  @Patch(':id/reset-password')
  @Roles('ADMIN')
  resetearPassword(@Param('id') id: string) {
    return this.tutorService.resetearPassword(id);
  }

  @Get('me')
  @Roles('TUTOR')
  miPerfil(@Req() req: Request) {
    const usuarioId = (req.user as any).id;
    return this.tutorService.miPerfil(usuarioId);
  }
}