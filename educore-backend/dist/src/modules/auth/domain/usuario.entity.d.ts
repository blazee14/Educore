export type Rol = 'ADMIN' | 'DOCENTE' | 'TUTOR' | 'ESTUDIANTE';
export declare class Usuario {
    readonly id: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly rol: Rol;
    readonly dosFaActivo: boolean;
    constructor(id: string, email: string, passwordHash: string, rol: Rol, dosFaActivo: boolean);
}
