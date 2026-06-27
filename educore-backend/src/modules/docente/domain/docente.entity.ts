// src/modules/docente/domain/docente.entity.ts
export class Docente {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly dni: string,
    public readonly telefono: string | null,
  ) {}
}