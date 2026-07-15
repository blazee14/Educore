import { http } from './http';
import type { Curso } from './cursos.api';

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

// ============================================================
// Funciones DOCENTE (mis cursos, mis estudiantes)
// ============================================================

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

export interface EstudianteConCursos {
  id: string;
  usuarioId: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  gradoNombre: string | null;
  seccionNombre: string | null;
  tutores: { id: string; email: string; nombres: string; apellidos: string; telefono: string | null; parentesco: string }[];
  cursos: { nombre: string; color: string; promedio: number; cantidadNotas: number }[];
}

export async function misEstudiantes(): Promise<EstudianteConCursos[]> {
  const { listarEstudiantes } = await import('./estudiante.api');
  const [asignaciones, todos] = await Promise.all([misAsignaciones(), listarEstudiantes()]);
  const key = (g: string | null, s: string | null) => `${g}|${s}`;
  const cursosPorSeccion = new Map<string, { nombre: string; color: string }[]>();
  for (const a of asignaciones) {
    const k = key(a.grado, a.seccion);
    const list = cursosPorSeccion.get(k) ?? [];
    list.push({ nombre: a.nombre, color: a.color });
    cursosPorSeccion.set(k, list);
  }
  const seccionesDocente = new Set(asignaciones.map((a) => key(a.grado, a.seccion)));
  return todos
    .filter((e) => seccionesDocente.has(key(e.gradoNombre, e.seccionNombre)))
    .map((e) => ({
      id: e.id,
      usuarioId: e.usuarioId,
      email: e.email,
      nombres: e.nombres,
      apellidos: e.apellidos,
      dni: e.dni,
      fechaNacimiento: e.fechaNacimiento,
      gradoNombre: e.gradoNombre,
      seccionNombre: e.seccionNombre,
      tutores: e.tutores,
      cursos: cursosPorSeccion.get(key(e.gradoNombre, e.seccionNombre))!.map((c) => ({
        nombre: c.nombre,
        color: c.color,
        promedio: 0,
        cantidadNotas: 0,
      })),
    }));
}
