"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const auth_repository_interface_1 = require("../data/auth.repository.interface");
const auth_exceptions_1 = require("./exceptions/auth.exceptions");
const REFRESH_TOKEN_DIAS = 7;
const CODIGO_2FA_MINUTOS = 5;
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
let AuthService = class AuthService {
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async login(email, password) {
        const usuario = await this.authRepository.buscarUsuarioPorEmail(email);
        if (!usuario)
            throw new auth_exceptions_1.CredencialesInvalidasException();
        const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordValido)
            throw new auth_exceptions_1.CredencialesInvalidasException();
        if (usuario.dosFaActivo) {
            const codigo = this.generarCodigo6Digitos();
            const codigoHash = hashToken(codigo);
            const expiraEn = new Date(Date.now() + CODIGO_2FA_MINUTOS * 60_000);
            await this.authRepository.guardarCodigo2FA(usuario.id, codigoHash, expiraEn);
            return {
                requiere2FA: true,
                usuarioId: usuario.id,
                ...(process.env.NODE_ENV !== 'production' ? { codigoDev: codigo } : {}),
            };
        }
        await this.authRepository.registrarAuditoria(usuario.id, 'LOGIN_EXITOSO');
        return this.emitirTokens(usuario.id, usuario.rol);
    }
    async verificar2FA(usuarioId, codigo) {
        const registro = await this.authRepository.obtenerCodigo2FA(usuarioId);
        if (!registro)
            throw new auth_exceptions_1.CodigoInvalidoException();
        if (registro.expiraEn.getTime() < Date.now())
            throw new auth_exceptions_1.CodigoInvalidoException();
        const codigoHash = hashToken(codigo);
        if (codigoHash !== registro.codigoHash)
            throw new auth_exceptions_1.CodigoInvalidoException();
        await this.authRepository.limpiarCodigo2FA(usuarioId);
        const usuario = await this.authRepository.buscarUsuarioPorId(usuarioId);
        if (!usuario)
            throw new auth_exceptions_1.CredencialesInvalidasException();
        await this.authRepository.registrarAuditoria(usuario.id, 'LOGIN_2FA_EXITOSO');
        return this.emitirTokens(usuario.id, usuario.rol);
    }
    async refrescar(refreshToken) {
        const tokenHash = hashToken(refreshToken);
        const sesion = await this.authRepository.buscarSesionPorTokenHash(tokenHash);
        if (!sesion || sesion.revocado || sesion.expiraEn.getTime() < Date.now()) {
            throw new auth_exceptions_1.RefreshTokenInvalidoException();
        }
        const usuario = await this.authRepository.buscarUsuarioPorId(sesion.usuarioId);
        if (!usuario)
            throw new auth_exceptions_1.RefreshTokenInvalidoException();
        const accessToken = this.jwtService.sign({ sub: usuario.id, rol: usuario.rol }, { expiresIn: '15m' });
        return { accessToken };
    }
    async logout(refreshToken) {
        const tokenHash = hashToken(refreshToken);
        const sesion = await this.authRepository.buscarSesionPorTokenHash(tokenHash);
        if (sesion) {
            await this.authRepository.revocarSesion(sesion.id);
            await this.authRepository.registrarAuditoria(sesion.usuarioId, 'LOGOUT');
        }
    }
    async emitirTokens(usuarioId, rol) {
        const accessToken = this.jwtService.sign({ sub: usuarioId, rol }, { expiresIn: '15m' });
        const refreshToken = crypto.randomBytes(48).toString('hex');
        const tokenHash = hashToken(refreshToken);
        const expiraEn = new Date(Date.now() + REFRESH_TOKEN_DIAS * 24 * 60 * 60_000);
        await this.authRepository.crearSesion(usuarioId, tokenHash, expiraEn);
        return { accessToken, refreshToken };
    }
    generarCodigo6Digitos() {
        return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_repository_interface_1.AUTH_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map