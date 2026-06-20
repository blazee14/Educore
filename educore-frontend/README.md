# EduCore — Frontend Web (Login)

Stack según la sección 4.1 del informe: **React + TypeScript + Vite**, con
**Tailwind CSS** y **Axios + Context API** para el estado de sesión.

## Cómo levantarlo

```bash
npm install
cp .env.example .env     # apunta VITE_API_URL al backend (http://localhost:3000)
npm run dev
```

Abre `http://localhost:5173/login`.

> Importante: el backend (`educore-backend`) debe tener `FRONTEND_URL=http://localhost:5173`
> en su `.env` para que `app.enableCors({ origin, credentials: true })` acepte las
> cookies httpOnly del refresh token.

## Flujo implementado

1. `LoginPage` llama a `POST /api/auth/login`.
   - Si el usuario **no** tiene 2FA → recibe `accessToken` y entra directo al dashboard.
   - Si **sí** tiene 2FA → la pantalla cambia al paso de código sin recargar.
2. `AuthContext` guarda el `accessToken` en memoria (nunca en localStorage, para reducir
   superficie de ataque XSS) y lo manda en el header `Authorization` vía un interceptor de Axios.
3. El `refreshToken` vive en una cookie `httpOnly` que el navegador maneja solo —
   el frontend nunca lo lee ni lo guarda.
4. Al recargar la página, `AuthContext` intenta `POST /api/auth/refresh` automáticamente.
   Si la cookie sigue siendo válida, el usuario sigue logueado sin volver a escribir su clave.
5. Si cualquier request da 401 (access token expirado), el interceptor de `http.ts`
   refresca una sola vez y reintenta la petición original — transparente para las páginas.

## Estructura

```
src/
  api/        -> http.ts (cliente Axios + interceptor de refresh), auth.api.ts (4 endpoints)
  context/    -> AuthContext.tsx (estado global de sesión)
  components/ -> TextField, RutaPrivada (guard de rutas)
  pages/      -> LoginPage, DashboardPage (placeholder)
```

## Siguiente paso lógico

- Conectar el módulo de Matrícula (sección 3.2) una vez tengas el dashboard real.
- Mover el `accessToken` a un store más robusto (Zustand) si la app crece más allá del login.
