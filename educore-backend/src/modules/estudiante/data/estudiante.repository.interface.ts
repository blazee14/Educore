// src/modules/estudiante/data/estudiante.repository.interface.ts
// Capa de Negocio depende de esta interfaz, NUNCA de PrismaService directamente (SOLID — Dependency Inversion, sección 1.7)
import { Estudiante } from '../domain/estudiante.entity';

export interface CrearEstudianteData {
  usuarioId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: Date;
}

export interface IEstudianteRepository {
  crear(data: CrearEstudianteData): Promise<Estudiante>;
  buscarPorId(id: string): Promise<Estudiante | null>;
  buscarPorUsuarioId(usuarioId: string): Promise<Estudiante | null>;
  buscarPorDni(dni: string): Promise<Estudiante | null>;
  listarTodos(): Promise<Estudiante[]>;
  actualizar(id: string, data: Partial<CrearEstudianteData>): Promise<Estudiante>;
  eliminar(id: string): Promise<void>;
  listarConDetalle(): Promise<EstudianteConDetalle[]>;
  buscarDetallePorId(id: string): Promise<EstudianteConDetalle | null>;
}

export const ESTUDIANTE_REPOSITORY = 'ESTUDIANTE_REPOSITORY';

export interface TutorResumen {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  parentesco: string;
}

export interface EstudianteConDetalle {
  id: string;
  usuarioId: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: Date;
  seccionId: string | null;
  gradoNombre: string | null;
  seccionNombre: string | null;
  tutores: TutorResumen[];
}