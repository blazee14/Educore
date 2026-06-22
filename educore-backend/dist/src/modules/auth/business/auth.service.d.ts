import { JwtService } from '@nestjs/jwt';
import { IAuthRepository } from '../data/auth.repository.interface';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: IAuthRepository, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    } | {
        codigoDev?: string | undefined;
        requiere2FA: boolean;
        usuarioId: string;
    }>;
    verificar2FA(usuarioId: string, codigo: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refrescar(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    private emitirTokens;
    private generarCodigo6Digitos;
}
