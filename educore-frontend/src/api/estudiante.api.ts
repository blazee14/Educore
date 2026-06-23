// src/api/estudiante.api.ts
// Funciones que llaman a los endpoints del módulo Estudiante (backend NestJS).
import { http } from './http';

export interface Estudiante {
  id: string;
  usuarioId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
}

export interface CrearEstudianteInput {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
}

export interface ActualizarEstudianteInput {
  nombres?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: string;
}

// GET /api/estudiantes
export async function listarEstudiantes(): Promise<Estudiante[]> {
  const { data } = await http.get<Estudiante[]>('/api/estudiantes');
  return data;
}

// GET /api/estudiantes/:id
export async function buscarEstudiante(id: string): Promise<Estudiante> {
  const { data } = await http.get<Estudiante>(`/api/estudiantes/${id}`);
  return data;
}

// POST /api/estudiantes
export async function crearEstudiante(input: CrearEstudianteInput): Promise<Estudiante> {
  const { data } = await http.post<Estudiante>('/api/estudiantes', input);
  return data;
}

// PATCH /api/estudiantes/:id
export async function actualizarEstudiante(
  id: string,
  input: ActualizarEstudianteInput,
): Promise<Estudiante> {
  const { data } = await http.patch<Estudiante>(`/api/estudiantes/${id}`, input);
  return data;
}

// DELETE /api/estudiantes/:id
export async function eliminarEstudiante(id: string): Promise<void> {
  await http.delete(`/api/estudiantes/${id}`);
}