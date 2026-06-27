// src/api/academico.api.ts
import { http } from './http';

export interface SeccionDisponible {
  id: string;
  nombre: string;
}

export interface GradoConSecciones {
  gradoId: string;
  gradoNombre: string;
  nivel: 'PRIMARIA' | 'SECUNDARIA';
  secciones: SeccionDisponible[];
}

// GET /api/academico/secciones-disponibles
export async function seccionesDisponibles(anioEscolar: number): Promise<GradoConSecciones[]> {
  const { data } = await http.get<GradoConSecciones[]>('/api/academico/secciones-disponibles', {
    params: { anioEscolar },
  });
  return data;
}

export interface Curso {
  id: string;
  nombre: string;
  nivel: 'PRIMARIA' | 'SECUNDARIA';
}

// GET /api/academico/cursos
export async function listarCursos(): Promise<Curso[]> {
  const { data } = await http.get<Curso[]>('/api/academico/cursos');
  return data;
}