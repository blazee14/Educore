// src/modules/asistencia/domain/asistencia.entity.ts
export class Asistencia {
  constructor(
    public readonly id: string,
    public readonly estudianteId: string,
    public readonly seccionId: string,
    public readonly fecha: Date,
    public readonly estado: string,
  ) {}
}