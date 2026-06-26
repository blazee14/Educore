// src/api/tutor.api.ts
import { http } from './http';

export interface ResetPasswordResultado {
  email: string;
  passwordTemporal: string;
}

// PATCH /api/tutores/:id/reset-password
export async function resetearPasswordTutor(id: string): Promise<ResetPasswordResultado> {
  const { data } = await http.patch<ResetPasswordResultado>(`/api/tutores/${id}/reset-password`);
  return data;
}

export interface HijoResumen {
  estudianteId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  parentesco: string;
  gradoNombre: string | null;
  seccionNombre: string | null;
  estadoMatricula: string | null;
}

// GET /api/tutores/me/hijos
export async function misHijos(): Promise<HijoResumen[]> {
  const { data } = await http.get<HijoResumen[]>('/api/tutores/me/hijos');
  return data;
}

export interface MiPerfilTutor {
  nombres: string;
  apellidos: string;
}

// GET /api/tutores/me
export async function miPerfilTutor(): Promise<MiPerfilTutor> {
  const { data } = await http.get<MiPerfilTutor>('/api/tutores/me');
  return data;
}