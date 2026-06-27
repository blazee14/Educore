// src/modules/asistencia/presentation/dto/registrar-asistencia.dto.ts
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsString, ValidateNested } from 'class-validator';

export class RegistroAlumnoDto {
  @IsString()
  estudianteId!: string;

  @IsEnum(['PRESENTE', 'TARDANZA', 'FALTA'])
  estado!: 'PRESENTE' | 'TARDANZA' | 'FALTA';
}

export class RegistrarAsistenciaDto {
  @IsString()
  seccionId!: string;

  @IsDateString()
  fecha!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RegistroAlumnoDto)
  registros!: RegistroAlumnoDto[];
}