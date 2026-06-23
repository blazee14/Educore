// src/modules/estudiante/domain/estudiante.entity.ts
// Entidad de dominio (DDD, sección 2.1). No conoce Prisma, HTTP ni JWT.

export class Estudiante {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly dni: string,
    public readonly fechaNacimiento: Date,
  ) {}

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }
}