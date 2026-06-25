// src/api/matricula.api.ts
import { http } from './http';

export interface DatosAlumno {
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
}

export interface DatosApoderado {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
  parentesco: string;
}

export interface RegistrarMatriculaInput {
  alumno: DatosAlumno;
  apoderado: DatosApoderado;
  seccionId: string;
  anioEscolar: number;
}

export interface CredencialesGeneradas {
  matriculaId: string;
  estudiante: { nombres: string; apellidos: string };
  credenciales: { email: string; passwordTemporal: string };
  credencialesTutor: { email: string; passwordTemporal: string } | null;
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
  fechaMatricula: string;
}

// POST /api/matricula
export async function registrarMatricula(input: RegistrarMatriculaInput): Promise<CredencialesGeneradas> {
  const { data } = await http.post<CredencialesGeneradas>('/api/matricula', input);
  return data;
}

// GET /api/matricula
export async function listarMatriculas(): Promise<MatriculaConDetalle[]> {
  const { data } = await http.get<MatriculaConDetalle[]>('/api/matricula');
  return data;
}

// GET /api/matricula/:id
export async function buscarMatricula(id: string): Promise<MatriculaConDetalle> {
  const { data } = await http.get<MatriculaConDetalle>(`/api/matricula/${id}`);
  return data;
}

// DELETE /api/matricula/:id
export async function eliminarMatricula(id: string): Promise<void> {
  await http.delete(`/api/matricula/${id}`);
}

// DELETE /api/matricula/:id/completo
export async function eliminarMatriculaCompleto(id: string): Promise<void> {
  await http.delete(`/api/matricula/${id}/completo`);
}