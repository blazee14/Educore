// src/modules/estudiante/business/exceptions/estudiante.exceptions.ts
import { ConflictException, NotFoundException } from '@nestjs/common';

export class EstudianteNoEncontradoException extends NotFoundException {
  constructor() {
    super('Estudiante no encontrado');
  }
}

export class DniDuplicadoException extends ConflictException {
  constructor() {
    super('Ya existe un estudiante registrado con ese DNI');
  }
}

export class EmailDuplicadoException extends ConflictException {
  constructor() {
    super('Ya existe un usuario registrado con ese email');
  }
}