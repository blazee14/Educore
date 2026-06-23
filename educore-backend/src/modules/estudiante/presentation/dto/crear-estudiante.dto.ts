// src/modules/estudiante/presentation/dto/crear-estudiante.dto.ts
import { IsDateString, IsEmail, IsString, MinLength } from 'class-validator';

export class CrearEstudianteDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsString()
  dni!: string;

  @IsDateString()
  fechaNacimiento!: string;
}