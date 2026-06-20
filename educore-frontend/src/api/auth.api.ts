// src/api/auth.api.ts
// Funciones que llaman EXACTAMENTE a los 4 endpoints definidos en la sección 3.2 del informe.

import { http } from './http';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Requiere2FAResponse {
  requiere2FA: true;
  usuarioId: string;
  codigoDev?: string; // solo aparece en entorno de desarrollo del backend
}

export type LoginResult = LoginResponse | Requiere2FAResponse;

export function isRequiere2FA(result: LoginResult): result is Requiere2FAResponse {
  return 'requiere2FA' in result;
}

// POST /api/auth/login
export async function login(email: string, password: string): Promise<LoginResult> {
  const { data } = await http.post<LoginResult>('/api/auth/login', { email, password });
  return data;
}

// POST /api/auth/2fa/verify
export async function verify2FA(usuarioId: string, codigo: string): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/api/auth/2fa/verify', { usuarioId, codigo });
  return data;
}

// POST /api/auth/refresh
export async function refresh(): Promise<{ accessToken: string }> {
  const { data } = await http.post<{ accessToken: string }>('/api/auth/refresh');
  return data;
}

// POST /api/auth/logout
export async function logout(): Promise<void> {
  await http.post('/api/auth/logout');
}
