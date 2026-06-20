# EduCore — Módulo Auth

Implementación del módulo de autenticación descrito en el informe técnico
(secciones 1 N-Layer, 2.1 DDD, 3.1 Esquema de BD, 3.2 Contratos de API, 3.4
Diagrama de secuencia).

## Estructura (N-Layer)

```
src/modules/auth/
  presentation/   -> Controller + DTOs (capa Presentación)
  business/       -> AuthService + excepciones (capa Negocio)
  data/           -> Interfaz IAuthRepository + implementación Prisma (capa Datos)
  domain/         -> Entidad Usuario (DDD)
```

La regla de la sección 1.3 se respeta así:
`AuthController` → `AuthService` → `IAuthRepository` (interfaz) → `AuthPrismaRepository` (implementación).
El `AuthService` **nunca** importa `PrismaService` directamente — eso sería violar
Dependency Inversion (sección 1.7). La elección de la implementación concreta
se hace en un solo lugar: `auth.module.ts`.

## Cómo levantarlo

```bash
npm install
cp .env.example .env          # y completa DATABASE_URL / JWT_SECRET
npx prisma migrate dev --name init
npm run seed                  # crea admin@educore.test y docente@educore.test (pass: Password123!)
npm run start:dev
```

## Endpoints (coinciden con la sección 3.2 del informe)

| Método | Endpoint              | Notas |
|--------|------------------------|-------|
| POST   | /api/auth/login        | Si el usuario tiene 2FA activo, responde `{ requiere2FA: true, usuarioId }` en vez de tokens |
| POST   | /api/auth/2fa/verify   | Completa el login cuando `requiere2FA` fue true |
| POST   | /api/auth/refresh      | Lee el refresh token de la cookie httpOnly, no del body |
| POST   | /api/auth/logout       | Revoca la sesión en `sesion_refresh_token` |

### Probar con curl

```bash
# 1. Login (admin, sin 2FA) — devuelve tokens directo
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@educore.test","password":"Password123!"}'

# 2. Login (docente, con 2FA) — pide código
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"docente@educore.test","password":"Password123!"}'
# -> { "requiere2FA": true, "usuarioId": "...", "codigoDev": "123456" }  (codigoDev solo en dev)

curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":"<el id de arriba>","codigo":"123456"}'

# 3. Refrescar access token usando la cookie
curl -i -b cookies.txt -X POST http://localhost:3000/api/auth/refresh

# 4. Logout
curl -i -b cookies.txt -X POST http://localhost:3000/api/auth/logout
```

## Proteger otros módulos con este Auth

En cualquier otro controller (ej. Matrícula):

```ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Patch(':id/estado')
actualizarEstado(...) { ... }
```

## Pendiente (siguiente paso lógico)

- Módulo Matrícula (sección 3.2), siguiendo exactamente la misma estructura
  de carpetas que Auth.
- Tests unitarios de `AuthService` con mocks de `IAuthRepository`
  (sección 9.1 del informe — Jest + ts-mockito).
