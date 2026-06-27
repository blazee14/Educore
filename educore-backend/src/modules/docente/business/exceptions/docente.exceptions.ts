// src/modules/docente/business/exceptions/docente.exceptions.ts
import { ConflictException, NotFoundException } from '@nestjs/common';

export class DocenteNoEncontradoException extends NotFoundException {
  constructor() {
    super('Docente no encontrado');
  }
}

export class DniDuplicadoDocenteException extends ConflictException {
  constructor() {
    super('Ya existe un docente registrado con ese DNI');
  }
}

export class EmailDuplicadoDocenteException extends ConflictException {
  constructor() {
    super('Ya existe un usuario registrado con ese email');
  }
}