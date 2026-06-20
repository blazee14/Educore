// src/modules/auth/business/exceptions/auth.exceptions.ts

export class CredencialesInvalidasException extends Error {
  constructor() {
    super('Email o contraseña incorrectos');
  }
}

export class CodigoInvalidoException extends Error {
  constructor() {
    super('El código de verificación es inválido o expiró');
  }
}

export class RefreshTokenInvalidoException extends Error {
  constructor() {
    super('El refresh token no es válido o fue revocado');
  }
}
