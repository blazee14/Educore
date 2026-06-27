// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { MatriculaModule } from './modules/matricula/matricula.module';
import { AcademicoModule } from './modules/academico/academico.module';
import { TutorModule } from './modules/tutor/tutor.module';
import { AsistenciaModule } from './modules/asistencia/asistencia.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EstudianteModule,
    MatriculaModule,
    AcademicoModule,
    TutorModule,
    AsistenciaModule,
    // Aquí se irán agregando MatriculaModule, AcademicoModule, etc.
  ],
})
export class AppModule {}
