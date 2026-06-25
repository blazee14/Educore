// src/config/routeMeta.ts
export interface RouteMeta {
  titulo: string;
  subtitulo?: string;
}

export const routeMeta: Record<string, RouteMeta> = {
  '/admin': { titulo: 'Dashboard', subtitulo: 'Resumen general de la institución' },
  '/admin/matricula': { titulo: 'Matrícula', subtitulo: 'Gestión de matrículas por sección' },
  '/admin/estudiantes': { titulo: 'Estudiantes', subtitulo: 'Listado y perfiles de estudiantes' },
  '/admin/docentes': { titulo: 'Docentes', subtitulo: 'Listado y asignación de docentes' },
  '/admin/cursos': { titulo: 'Cursos y Secciones', subtitulo: 'Gestión de cursos y secciones' },
  '/admin/asistencia': { titulo: 'Asistencia', subtitulo: 'Registro y reportes de asistencia' },
  '/admin/notas': { titulo: 'Notas y Evaluaciones', subtitulo: 'Registro de notas por bimestre' },
  '/admin/calendario': { titulo: 'Calendario Académico', subtitulo: 'Eventos y fechas clave del año' },
  '/admin/pagos': { titulo: 'Pagos y Pensiones', subtitulo: 'Control de pagos por estudiante' },
  '/admin/recibos': { titulo: 'Recibos', subtitulo: 'Historial de recibos emitidos' },
  '/admin/reportes-financieros': { titulo: 'Reportes Financieros', subtitulo: 'Morosidad e ingresos' },
  '/admin/comunicados': { titulo: 'Comunicados', subtitulo: 'Avisos a la comunidad educativa' },
  '/admin/mensajeria': { titulo: 'Mensajería Interna', subtitulo: 'Comunicación entre usuarios' },
  '/admin/notificaciones': { titulo: 'Notificaciones', subtitulo: 'Historial de notificaciones enviadas' },
  '/admin/reportes': { titulo: 'Reportes e Indicadores', subtitulo: 'Indicadores generales de la institución' },
  '/admin/biblioteca': { titulo: 'Biblioteca', subtitulo: 'Catálogo y préstamos' },
  '/admin/incidencias': { titulo: 'Incidencias y Disciplina', subtitulo: 'Registro de incidencias' },
  '/admin/configuracion': { titulo: 'Configuración', subtitulo: 'Configuración general del sistema' },

  '/estudiante': { titulo: 'Inicio', subtitulo: 'Resumen académico del estudiante' },
  '/estudiante/perfil': { titulo: 'Mi Perfil', subtitulo: 'Datos personales del estudiante' },
  '/estudiante/matricula': { titulo: 'Mi Matrícula', subtitulo: 'Información de matrícula actual' },
  '/estudiante/notas': { titulo: 'Mis Notas', subtitulo: 'Calificaciones por bimestre' },
  '/estudiante/asistencia': { titulo: 'Mi Asistencia', subtitulo: 'Registro de asistencia' },
  '/estudiante/cursos': { titulo: 'Mis Cursos', subtitulo: 'Cursos y horarios' },
  '/estudiante/comunicados': { titulo: 'Comunicados', subtitulo: 'Avisos y notificaciones' },
  '/estudiante/calendario': { titulo: 'Calendario', subtitulo: 'Calendario académico y fechas importantes' },
  '/estudiante/tareas': { titulo: 'Tareas', subtitulo: 'Tareas y asignaciones pendientes' },
  '/estudiante/biblioteca': { titulo: 'Biblioteca Digital', subtitulo: 'Recursos y materiales de estudio' },
};
