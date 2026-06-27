// src/modules/docente/presentation/dto/asignar-curso.dto.ts
import { IsString } from 'class-validator';

export class AsignarCursoDto {
  @IsString()
  cursoId!: string;

  @IsString()
  seccionId!: string;
}