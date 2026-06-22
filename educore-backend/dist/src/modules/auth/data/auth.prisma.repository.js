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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const usuario_entity_1 = require("../domain/usuario.entity");
let AuthPrismaRepository = class AuthPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buscarUsuarioPorEmail(email) {
        const row = await this.prisma.usuario.findUnique({ where: { email } });
        if (!row)
            return null;
        return new usuario_entity_1.Usuario(row.id, row.email, row.passwordHash, row.rol, row.dosFaActivo);
    }
    async buscarUsuarioPorId(id) {
        const row = await this.prisma.usuario.findUnique({ where: { id } });
        if (!row)
            return null;
        return new usuario_entity_1.Usuario(row.id, row.email, row.passwordHash, row.rol, row.dosFaActivo);
    }
    async guardarCodigo2FA(usuarioId, codigoHash, expiraEn) {
        await this.prisma.usuario.update({
            where: { id: usuarioId },
            data: { dosFaCodigoHash: codigoHash, dosFaExpiraEn: expiraEn },
        });
    }
    async obtenerCodigo2FA(usuarioId) {
        const row = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { dosFaCodigoHash: true, dosFaExpiraEn: true },
        });
        if (!row?.dosFaCodigoHash || !row.dosFaExpiraEn)
            return null;
        return { codigoHash: row.dosFaCodigoHash, expiraEn: row.dosFaExpiraEn };
    }
    async limpiarCodigo2FA(usuarioId) {
        await this.prisma.usuario.update({
            where: { id: usuarioId },
            data: { dosFaCodigoHash: null, dosFaExpiraEn: null },
        });
    }
    async crearSesion(usuarioId, tokenHash, expiraEn) {
        return this.prisma.sesionRefreshToken.create({
            data: { usuarioId, tokenHash, expiraEn },
        });
    }
    async buscarSesionPorTokenHash(tokenHash) {
        return this.prisma.sesionRefreshToken.findFirst({
            where: { tokenHash, revocado: false },
        });
    }
    async revocarSesion(sesionId) {
        await this.prisma.sesionRefreshToken.update({
            where: { id: sesionId },
            data: { revocado: true },
        });
    }
    async registrarAuditoria(usuarioId, accion) {
        await this.prisma.auditLog.create({ data: { usuarioId, accion } });
    }
};
exports.AuthPrismaRepository = AuthPrismaRepository;
exports.AuthPrismaRepository = AuthPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthPrismaRepository);
//# sourceMappingURL=auth.prisma.repository.js.map