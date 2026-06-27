// src/modules/docente/presentation/dto/crear-docente.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CrearDocenteDto {
  @IsEmail()
  email!: string;

  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsString()
  dni!: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}