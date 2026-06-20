// src/modules/auth/domain/usuario.entity.ts
// Entidad de dominio (DDD, sección 2.1). No conoce Prisma, HTTP ni JWT.

export type Rol = 'ADMIN' | 'DOCENTE' | 'TUTOR' | 'ESTUDIANTE';

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: Rol,
    public readonly dosFaActivo: boolean,
  ) {}
}
