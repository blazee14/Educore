// src/modules/matricula/business/exceptions/matricula.exceptions.ts
import { ConflictException, NotFoundException } from '@nestjs/common';

export class MatriculaNoEncontradaException extends NotFoundException {
  constructor() {
    super('Matrícula no encontrada');
  }
}

export class SeccionNoEncontradaException extends NotFoundException {
  constructor() {
    super('La sección seleccionada no existe');
  }
}

export class DniDuplicadoException extends ConflictException {
  constructor() {
    super('Ya existe un estudiante registrado con ese DNI');
  }
}