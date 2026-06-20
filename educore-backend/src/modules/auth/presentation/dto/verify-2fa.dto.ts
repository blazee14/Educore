// src/modules/auth/presentation/dto/verify-2fa.dto.ts
import { IsString, Length } from 'class-validator';

export class Verify2FADto {
  @IsString()
  usuarioId: string;

  @IsString()
  @Length(6, 6)
  codigo: string;
}
