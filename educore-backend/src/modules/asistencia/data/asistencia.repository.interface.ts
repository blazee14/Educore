// src/modules/asistencia/data/asistencia.repository.interface.ts
export interface RegistroAsistencia {
  estudianteId: string;
  estado: 'PRESENTE' | 'TARDANZA' | 'FALTA';
}

export interface AlumnoParaAsistencia {
  estudianteId: string;
  nombres: string;
  apellidos: string;
  estadoActual: string | null;
}

export interface AsistenciaResumen {
  fecha: string;
  estado: string;
}

export interface IAsistenciaRepository {
  registrarLote(seccionId: string, fecha: Date, registros: RegistroAsistencia[]): Promise<void>;
  listarPorSeccionYFecha(seccionId: string, fecha: Date): Promise<AlumnoParaAsistencia[]>;
  listarPorEstudiante(estudianteId: string, anioEscolar: number): Promise<AsistenciaResumen[]>;
}

export const ASISTENCIA_REPOSITORY = 'ASISTENCIA_REPOSITORY';