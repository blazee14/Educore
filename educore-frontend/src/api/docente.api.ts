// src/api/docente.api.ts
import { http } from './http';

export interface AsignacionResumen {
  id: string;
  cursoNombre: string;
  gradoNombre: string;
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

export interface CrearDocenteInput {
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string;
}

export interface CredencialesDocente {
  docenteId: string;
  docente: { nombres: string; apellidos: string };
  credenciales: { email: string; passwordTemporal: string };
}

// POST /api/docentes
export async function crearDocente(input: CrearDocenteInput): Promise<CredencialesDocente> {
  const { data } = await http.post<CredencialesDocente>('/api/docentes', input);
  return data;
}

// GET /api/docentes
export async function listarDocentes(): Promise<DocenteConDetalle[]> {
  const { data } = await http.get<DocenteConDetalle[]>('/api/docentes');
  return data;
}

// POST /api/docentes/:id/asignaciones
export async function asignarCurso(docenteId: string, cursoId: string, seccionId: string): Promise<DocenteConDetalle> {
  const { data } = await http.post<DocenteConDetalle>(`/api/docentes/${docenteId}/asignaciones`, { cursoId, seccionId });
  return data;
}

// DELETE /api/docentes/:id/asignaciones/:asignacionId
export async function quitarAsignacion(docenteId: string, asignacionId: string): Promise<void> {
  await http.delete(`/api/docentes/${docenteId}/asignaciones/${asignacionId}`);
}

// DELETE /api/docentes/:id
export async function eliminarDocente(id: string): Promise<void> {
  await http.delete(`/api/docentes/${id}`);
}