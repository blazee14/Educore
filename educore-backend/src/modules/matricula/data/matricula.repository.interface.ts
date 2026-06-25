// src/modules/matricula/data/matricula.repository.interface.ts
// Capa de Negocio depende de esta interfaz, NUNCA de PrismaService directamente (SOLID — Dependency Inversion).
import { Matricula } from '../domain/matricula.entity';

export interface DatosAlumno {
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: Date;
}

export interface DatosApoderado {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  parentesco: string;
}

export interface RegistrarMatriculaData {
  alumno: DatosAlumno;
  apoderado: DatosApoderado;
  seccionId: string;
  anioEscolar: number;
}

export interface MatriculaConDetalle {
  id: string;
  estudianteId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  gradoNombre: string;
  seccionNombre: string;
  nivel: string;
  anioEscolar: number;
  estado: string;
  fechaMatricula: Date;
}

export interface IMatriculaRepository {
  registrar(
    data: RegistrarMatriculaData,
    usuarioId: string,
    estudianteId: string,
  ): Promise<Matricula>;
  listarConDetalle(): Promise<MatriculaConDetalle[]>;
  buscarPorIdConDetalle(id: string): Promise<MatriculaConDetalle | null>;
  contarPorAnio(anioEscolar: number): Promise<number>;
  eliminar(id: string): Promise<void>;
}

export const MATRICULA_REPOSITORY = 'MATRICULA_REPOSITORY';