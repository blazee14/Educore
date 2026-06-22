"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../business/auth.service");
const login_dto_1 = require("./dto/login.dto");
const verify_2fa_dto_1 = require("./dto/verify-2fa.dto");
const auth_exceptions_1 = require("../business/exceptions/auth.exceptions");
const COOKIE_REFRESH = 'refreshToken';
const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
};
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto, res) {
        try {
            const resultado = await this.authService.login(dto.email, dto.password);
            if ('requiere2FA' in resultado) {
                return resultado;
            }
            res.cookie(COOKIE_REFRESH, resultado.refreshToken, {
                ...COOKIE_OPTS,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return {
                accessToken: resultado.accessToken,
                refreshToken: resultado.refreshToken,
            };
        }
        catch (err) {
            if (err instanceof auth_exceptions_1.CredencialesInvalidasException) {
                throw new common_1.UnauthorizedException(err.message);
            }
            throw err;
        }
    }
    async verify2FA(dto, res) {
        try {
            const resultado = await this.authService.verificar2FA(dto.usuarioId, dto.codigo);
            res.cookie(COOKIE_REFRESH, resultado.refreshToken, {
                ...COOKIE_OPTS,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return resultado;
        }
        catch (err) {
            if (err instanceof auth_exceptions_1.CodigoInvalidoException) {
                throw new common_1.BadRequestException(err.message);
            }
            throw err;
        }
    }
    async refresh(req) {
        const refreshToken = req.cookies?.[COOKIE_REFRESH];
        if (!refreshToken)
            throw new common_1.UnauthorizedException('No hay refresh token');
        try {
            return await this.authService.refrescar(refreshToken);
        }
        catch (err) {
            if (err instanceof auth_exceptions_1.RefreshTokenInvalidoException) {
                throw new common_1.UnauthorizedException(err.message);
            }
            throw err;
        }
    }
    async logout(req, res) {
        const refreshToken = req.cookies?.[COOKIE_REFRESH];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        res.clearCookie(COOKIE_REFRESH, { path: '/api/auth' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_2fa_dto_1.Verify2FADto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map