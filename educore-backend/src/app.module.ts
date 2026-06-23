// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EstudianteModule,
    // Aquí se irán agregando MatriculaModule, AcademicoModule, etc.
  ],
})
export class AppModule {}
