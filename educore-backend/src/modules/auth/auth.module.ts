// src/modules/auth/auth.module.ts
// Conecta las 3 capas: Presentación (Controller) usa Negocio (Service),
// que depende de la ABSTRACCIÓN IAuthRepository, no de la implementación Prisma directamente.

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './business/auth.service';
import { AuthPrismaRepository } from './data/auth.prisma.repository';
import { AUTH_REPOSITORY } from './data/auth.repository.interface';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthPrismaRepository, // <- el único lugar donde se elige la implementación concreta
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
