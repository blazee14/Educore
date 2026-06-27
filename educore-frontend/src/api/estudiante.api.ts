// src/api/estudiante.api.ts
import { http } from './http';

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
  fechaNacimiento: string;
  seccionId: string | null;
  gradoNombre: string | null;
  seccionNombre: string | null;
  tutores: TutorResumen[];
}

export interface ActualizarEstudianteInput {
  nombres?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: string;
}

export interface ResetPasswordResultado {
  email: string;
  passwordTemporal: string;
}

// GET /api/estudiantes
export async function listarEstudiantes(): Promise<EstudianteConDetalle[]> {
  const { data } = await http.get<EstudianteConDetalle[]>('/api/estudiantes');
  return data;
}

// PATCH /api/estudiantes/:id
export async function actualizarEstudiante(
  id: string,
  input: ActualizarEstudianteInput,
): Promise<EstudianteConDetalle> {
  const { data } = await http.patch<EstudianteConDetalle>(`/api/estudiantes/${id}`, input);
  return data;
}

// PATCH /api/estudiantes/:id/reset-password
export async function resetearPasswordEstudiante(id: string): Promise<ResetPasswordResultado> {
  const { data } = await http.patch<ResetPasswordResultado>(`/api/estudiantes/${id}/reset-password`);
  return data;
}

export interface MiPerfilEstudiante {
  nombres: string;
  apellidos: string;
}

// GET /api/estudiantes/me
export async function miPerfilEstudiante(): Promise<EstudianteConDetalle> {
  const { data } = await http.get<EstudianteConDetalle>('/api/estudiantes/me');
  return data;
}