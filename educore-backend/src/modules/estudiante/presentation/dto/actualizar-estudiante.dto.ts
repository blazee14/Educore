// src/modules/estudiante/presentation/dto/actualizar-estudiante.dto.ts
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ActualizarEstudianteDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;
}