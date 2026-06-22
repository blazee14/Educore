import { Request, Response } from 'express';
import { AuthService } from '../business/auth.service';
import { LoginDto } from './dto/login.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, res: Response): Promise<{
        codigoDev?: string | undefined;
        requiere2FA: boolean;
        usuarioId: string;
    } | {
        accessToken: string;
        refreshToken: string;
    }>;
    verify2FA(dto: Verify2FADto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(req: Request): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<void>;
}
