// src/modules/matricula/domain/matricula.entity.ts
// Entidad de dominio (DDD). No conoce Prisma, HTTP ni JWT.
export class Matricula {
  constructor(
    public readonly id: string,
    public readonly estudianteId: string,
    public readonly seccionId: string,
    public readonly anioEscolar: number,
    public readonly estado: string,
    public readonly fechaMatricula: Date,
  ) {}
}