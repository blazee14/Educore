import { Usuario } from '../domain/usuario.entity';
export interface SesionRefreshToken {
    id: string;
    usuarioId: string;
    tokenHash: string;
    expiraEn: Date;
    revocado: boolean;
}
export interface IAuthRepository {
    buscarUsuarioPorEmail(email: string): Promise<Usuario | null>;
    buscarUsuarioPorId(id: string): Promise<Usuario | null>;
    guardarCodigo2FA(usuarioId: string, codigoHash: string, expiraEn: Date): Promise<void>;
    obtenerCodigo2FA(usuarioId: string): Promise<{
        codigoHash: string;
        expiraEn: Date;
    } | null>;
    limpiarCodigo2FA(usuarioId: string): Promise<void>;
    crearSesion(usuarioId: string, tokenHash: string, expiraEn: Date): Promise<SesionRefreshToken>;
    buscarSesionPorTokenHash(tokenHash: string): Promise<SesionRefreshToken | null>;
    revocarSesion(sesionId: string): Promise<void>;
    registrarAuditoria(usuarioId: string, accion: string): Promise<void>;
}
export declare const AUTH_REPOSITORY = "AUTH_REPOSITORY";
