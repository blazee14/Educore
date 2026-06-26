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
    default:
      return '/admin'; // DOCENTE, TUTOR: pendiente layouts propios
  }
}