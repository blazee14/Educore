// src/api/tutor.api.ts
import { http } from './http';

export interface ResetPasswordResultado {
  email: string;
  passwordTemporal: string;
}

// PATCH /api/tutores/:id/reset-password
export async function resetearPasswordTutor(id: string): Promise<ResetPasswordResultado> {
  const { data } = await http.patch<ResetPasswordResultado>(`/api/tutores/${id}/reset-password`);
  return data;
}