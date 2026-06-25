// src/api/jwt.ts
// Decodifica el payload de un JWT en el cliente, sin verificar la firma
// (la verificación real ya la hizo el backend; aquí solo leemos el rol para la UI).
export function decodificarRol(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1];
    const json = JSON.parse(atob(payload));
    return json.rol ?? null;
  } catch {
    return null;
  }
}