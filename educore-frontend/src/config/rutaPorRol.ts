// src/config/rutaPorRol.ts
export function rutaPorRol(rol: string | null): string {
  switch (rol) {
    case 'DIRECTOR':
      return '/director';
    case 'ADMIN':
      return '/admin';
    case 'TUTOR':
      return '/tutor';
    case 'ESTUDIANTE':
      return '/estudiante';
    case 'DOCENTE':
      return '/docente';
    default:
      return '/admin';
  }
}