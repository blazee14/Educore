// src/modules/matricula/presentation/dto/registrar-matricula.dto.ts
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class DatosAlumnoDto {
  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsString()
  dni!: string;

  @IsDateString()
  fechaNacimiento!: string;
}

class DatosApoderadoDto {
  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsString()
  dni!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  parentesco!: string;
}

export class RegistrarMatriculaDto {
  @ValidateNested()
  @Type(() => DatosAlumnoDto)
  alumno!: DatosAlumnoDto;

  @ValidateNested()
  @Type(() => DatosApoderadoDto)
  apoderado!: DatosApoderadoDto;

  @IsString()
  seccionId!: string;

  @IsInt()
  anioEscolar!: number;
}