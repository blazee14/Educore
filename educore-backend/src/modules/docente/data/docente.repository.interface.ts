// src/modules/docente/data/docente.repository.interface.ts
import { Docente } from '../domain/docente.entity';

export interface CrearDocenteData {
  email: string;
  passwordHash: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
}

export interface AsignacionResumen {
  id: string;
  cursoNombre: string;
  gradoNombre: string;
  seccionId: string;
  seccionNombre: string;
}

export interface DocenteConDetalle {
  id: string;
  usuarioId: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string | null;
  asignaciones: AsignacionResumen[];
}

export interface IDocenteRepository {
  crear(data: CrearDocenteData): Promise<Docente>;
  buscarPorDni(dni: string): Promise<Docente | null>;
  buscarPorUsuarioId(usuarioId: string): Promise<Docente | null>;
  listarConDetalle(): Promise<DocenteConDetalle[]>;
  buscarDetallePorId(id: string): Promise<DocenteConDetalle | null>;
  eliminar(id: string): Promise<void>;
}

export const DOCENTE_REPOSITORY = 'DOCENTE_REPOSITORY';