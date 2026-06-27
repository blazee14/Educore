import { http } from './http';
import type { Curso } from './cursos.api';
import { listarEstudiantes, type EstudianteConDetalle } from './estudiante.api';

export interface AsignacionCurso {
  id: string;
  cursoNombre: string;
  gradoNombre: string;
  seccionId: string;
  seccionNombre: string;
}

export interface MisAsignacionesResponse {
  docente: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  asignaciones: AsignacionCurso[];
}

const COLORES_POR_CURSO: Record<string, string> = {
  MATEMATICAS: '#ef4444',
  COMUNICACION: '#eab308',
  'CIENCIA Y TECNOLOGIA': '#22c55e',
  INGLES: '#a855f7',
  'PERSONAL SOCIAL': '#f97316',
  'ARTE Y CULTURA': '#06b6d4',
  'EDUCACION FISICA': '#84cc16',
  RELIGION: '#7dd3fc',
};

function colorCurso(nombre: string): string {
  const key = nombre.toUpperCase().trim().replace(/\s+/g, ' ');
  if (COLORES_POR_CURSO[key]) return COLORES_POR_CURSO[key];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  const colores = ['#ef4444', '#eab308', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#84cc16', '#7dd3fc', '#f43f5e', '#8b5cf6'];
  return colores[Math.abs(hash) % colores.length];
}

function nivelDesdeGrado(grado: string): string {
  const g = parseInt(grado);
  if (g >= 1 && g <= 6) return 'Primaria';
  return 'Primaria';
}

export interface CursoConProfesor extends Curso {
  profesorEmail: string;
  asignacionId: string;
  seccionId: string;
}

export async function misAsignaciones(): Promise<CursoConProfesor[]> {
  const { data } = await http.get<MisAsignacionesResponse>('/api/docentes/mis-asignaciones');
  return data.asignaciones.map((a) => ({
    nombre: a.cursoNombre,
    grado: a.gradoNombre,
    seccion: a.seccionNombre,
    nivel: nivelDesdeGrado(a.gradoNombre),
    profesor: `${data.docente.nombres} ${data.docente.apellidos}`,
    profesorEmail: data.docente.email,
    color: colorCurso(a.cursoNombre),
    asignacionId: a.id,
    seccionId: a.seccionId,
  }));
}

export interface EstudianteConCursos extends EstudianteConDetalle {
  cursos: { nombre: string; color: string; promedio: number; cantidadNotas: number }[];
}

export async function misEstudiantes(): Promise<EstudianteConCursos[]> {
  const [asignaciones, todos] = await Promise.all([misAsignaciones(), listarEstudiantes()]);
  const seccionIds = new Set(asignaciones.map((a) => a.seccionId));
  const cursosPorSeccion = new Map<string, { nombre: string; color: string }[]>();
  for (const a of asignaciones) {
    const list = cursosPorSeccion.get(a.seccionId) ?? [];
    list.push({ nombre: a.nombre, color: a.color });
    cursosPorSeccion.set(a.seccionId, list);
  }
  return todos
    .filter((e) => e.seccionId && seccionIds.has(e.seccionId))
    .map((e) => ({
      ...e,
      cursos: cursosPorSeccion.get(e.seccionId!)!.map((c) => ({
        nombre: c.nombre,
        color: c.color,
        promedio: 0,
        cantidadNotas: 0,
      })),
    }));
}
