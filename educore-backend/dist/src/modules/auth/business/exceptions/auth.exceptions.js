"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenInvalidoException = exports.CodigoInvalidoException = exports.CredencialesInvalidasException = void 0;
class CredencialesInvalidasException extends Error {
    constructor() {
        super('Email o contraseña incorrectos');
    }
}
exports.CredencialesInvalidasException = CredencialesInvalidasException;
class CodigoInvalidoException extends Error {
    constructor() {
        super('El código de verificación es inválido o expiró');
    }
}
exports.CodigoInvalidoException = CodigoInvalidoException;
class RefreshTokenInvalidoException extends Error {
    constructor() {
        super('El refresh token no es válido o fue revocado');
    }
}
exports.RefreshTokenInvalidoException = RefreshTokenInvalidoException;
//# sourceMappingURL=auth.exceptions.js.map