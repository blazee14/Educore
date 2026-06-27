// src/api/asistencia.api.ts
import { http } from './http';

export type EstadoAsistencia = 'PRESENTE' | 'TARDANZA' | 'FALTA';

export interface AlumnoParaAsistencia {
  estudianteId: string;
  nombres: string;
  apellidos: string;
  estadoActual: EstadoAsistencia | null;
}

export interface RegistroAlumno {
  estudianteId: string;
  estado: EstadoAsistencia;
}

// GET /api/asistencia/seccion/:seccionId?fecha=YYYY-MM-DD
export async function listarAsistenciaPorSeccion(
  seccionId: string,
  fecha: string,
): Promise<AlumnoParaAsistencia[]> {
  const { data } = await http.get<AlumnoParaAsistencia[]>(`/api/asistencia/seccion/${seccionId}`, {
    params: { fecha },
  });
  return data;
}

// POST /api/asistencia
export async function registrarAsistencia(
  seccionId: string,
  fecha: string,
  registros: RegistroAlumno[],
): Promise<void> {
  await http.post('/api/asistencia', { seccionId, fecha, registros });
}