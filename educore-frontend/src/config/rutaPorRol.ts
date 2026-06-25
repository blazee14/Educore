// src/config/rutaPorRol.ts
export function rutaPorRol(rol: string | null): string {
  switch (rol) {
    case 'DIRECTOR':
      return '/director';
    case 'ADMIN':
      return '/admin';
    default:
      return '/admin'; // DOCENTE, TUTOR, ESTUDIANTE: pendiente layouts propios
  }
}