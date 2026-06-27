# EduCore — Sistema de Gestión Educativa

EduCore es un sistema de gestión educativa diseñado para digitalizar y automatizar los procesos de una institución de nivel primaria y secundaria: matrícula, seguimiento académico, asistencia, pagos y comunicación institucional.

Es un proyecto académico (Capstone) construido con arquitectura **N-Layer** y principios de **Domain-Driven Design (DDD)**. Cada decisión técnica — desde el motor de base de datos hasta el framework del backend — fue evaluada frente a sus alternativas reales del mercado antes de elegirse; esas comparativas están resumidas en este documento y desarrolladas a fondo en el **Informe Técnico** del proyecto.

> 📄 Este README describe el **estado real del código en este repositorio** y, en la sección [Roadmap](#roadmap), la **visión completa a futuro** documentada en el informe técnico (versión 3.0, junio 2026).

---

## Índice

- [¿Qué problema resuelve?](#qué-problema-resuelve)
- [Roles y qué puede hacer cada uno](#roles-y-qué-puede-hacer-cada-uno)
- [Módulos del sistema](#módulos-del-sistema)
- [Arquitectura](#arquitectura)
- [Patrones de diseño](#patrones-de-diseño)
- [Modelo de datos](#modelo-de-datos)
- [Autenticación y seguridad](#autenticación-y-seguridad)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Instalación y uso local](#instalación-y-uso-local)
- [Variables de entorno](#variables-de-entorno)
- [Referencia de la API](#referencia-de-la-api)
- [Roadmap](#roadmap)

---

## ¿Qué problema resuelve?

Un colegio necesita llevar el control de quién está matriculado, en qué sección, qué docente dicta qué curso y quién asistió cada día — y que cada perfil (director, administrativo, docente, estudiante, padre de familia) vea únicamente lo que le corresponde. EduCore reemplaza ese seguimiento manual (hojas de cálculo, cuadernos de asistencia, registros en papel) por un sistema único con login, roles y datos centralizados en una base de datos relacional.

---

## Roles y qué puede hacer cada uno

| Rol | Qué puede hacer en el sistema actual |
|-----|----------------------------------------|
| **Director** | Ver y registrar matrículas, listar docentes, consultar asistencia por sección o por estudiante |
| **Admin** | Todo lo del Director, además crear/editar estudiantes y docentes, asignar cursos a docentes, resetear contraseñas, eliminar matrículas |
| **Docente** | Ver sus cursos/secciones asignadas, registrar asistencia de su sección, listar sus estudiantes |
| **Estudiante** | Ver su propio perfil, su matrícula y su historial de asistencia |
| **Tutor** | Ver los estudiantes asociados a él (sus "hijos") y la asistencia de cada uno |

El acceso a cada endpoint está controlado por rol mediante guards, no solo ocultando botones en la interfaz.

---

## Módulos del sistema

| Módulo | Descripción | Roles | Estado |
|--------|-------------|-------|--------|
| **Auth** | Login, JWT, 2FA opcional por código de 6 dígitos, refresh token, logout | Todos | ✅ Implementado |
| **Estudiante** | Perfil propio, listado, edición, reseteo de contraseña | Admin, Docente | ✅ Implementado |
| **Docente** | Alta, listado, asignación a curso/sección, "mis asignaciones" | Admin, Director | ✅ Implementado |
| **Tutor** | Perfil propio, listado de hijos asociados, reseteo de contraseña | Tutor, Admin | ✅ Implementado |
| **Matrícula** | Registro de matrícula (alumno + apoderado), historial, baja, "mi matrícula" | Admin, Director | ✅ Implementado |
| **Académico** | Catálogo de secciones disponibles por año escolar | Todos | ✅ Implementado |
| **Asistencia** | Registro diario por sección, consulta por estudiante/sección/hijo | Docente, Admin, Director, Estudiante, Tutor | ✅ Implementado |
| **Pagos** | Pensiones, recibos PDF, vencimientos, historial, morosidad | Admin, Tutor | 🔜 Fase 3 |
| **Comunicados** | Mensajería interna, notificaciones push (app móvil) | Todos | 🔜 Fase 3 |
| **Reportes** | Dashboards, estadísticas, exportación PDF/Excel, CQRS | Director, Admin | 🔜 Fase 4 |
| **RBAC dinámico** | Roles y permisos personalizables por módulo/acción | Admin | 🔜 Fase 5 |

---

## Arquitectura

### Por qué N-Layer (y no microservicios ni monolito plano)

El informe técnico evaluó cuatro enfoques arquitectónicos antes de decidir:

| Opción | Veredicto | Motivo |
|--------|-----------|--------|
| Monolítico tradicional (sin capas) | ❌ Descartado | Sin separación de responsabilidades; un bug puede romper todo el sistema |
| **N-Layer Architecture** | ✅ **Elegido** | Separación clara por capas, bajo costo de infraestructura (un solo proceso), control total por capa |
| Microservicios | ❌ Descartado | Complejidad operacional y costo de infraestructura excesivos para el tamaño del proyecto (requeriría Docker, Kubernetes, API Gateway) |
| Serverless | ❌ Descartado | Cold starts inaceptables, vendor lock-in, difícil de depurar localmente |

El backend sigue **N-Layer** aplicada *dentro de cada módulo* (no como carpetas globales del proyecto). Cada módulo de `src/modules/<nombre>/` tiene esta forma:

```
<modulo>/
├── presentation/   → Controller + DTOs. Recibe HTTP, valida con class-validator. No conoce SQL ni reglas de negocio.
├── business/       → Service + excepciones propias. Toda la lógica de negocio vive aquí. No conoce HTTP ni SQL.
├── data/            → Interfaz de repositorio (contrato) + implementación con Prisma. No conoce reglas de negocio.
└── domain/          → Entidad de dominio (DDD): el modelo de negocio, independiente del ORM.
```

**Regla de comunicación (la más importante de N-Layer):** el flujo siempre va hacia abajo, nunca al revés ni saltando capas:

```
Presentación → Negocio → Datos
```

`Datos` nunca llama a `Negocio`. `Negocio` nunca llama a `Presentación`. El `Service` nunca importa `PrismaService` directamente — solo conoce la interfaz del repositorio (Dependency Inversion). La implementación concreta se decide en un único lugar, el `*.module.ts`:

```ts
{
  provide: AUTH_REPOSITORY,
  useClass: AuthPrismaRepository, // único lugar donde se elige la implementación concreta
}
```

### N-Layer vs. Clean Architecture (Hexagonal)

El informe también evaluó Clean Architecture / Hexagonal como alternativa. La diferencia clave: en Hexagonal, el dominio depende solo de interfaces (puertos) y nunca conoce la infraestructura, lo que facilita testear sin base de datos y cambiar de motor sin tocar la lógica. En N-Layer, el Service depende indirectamente de la capa de Datos, lo que es más simple de implementar pero acopla un poco más.

**Decisión:** EduCore usa N-Layer + DDD como punto de equilibrio — aplica los principios de Clean Architecture (dominio sin dependencias externas, repositorios como abstracciones, eventos de dominio desacoplados) sin asumir el costo de formalizar puertos y adaptadores explícitos. Si el sistema crece, la migración a Hexagonal sería incremental, no una reescritura.

### Clean Code y SOLID

El informe define estándares de escritura aplicados en todas las capas:
- **Nombres significativos** (`calcularPromedioFinal()` en vez de `calc()`)
- **Funciones pequeñas, una sola responsabilidad** (máx. ~20 líneas como guía)
- **Sin números mágicos** (`UMBRAL_INASISTENCIAS = 0.30` en vez de `0.30` suelto en un `if`)
- **Ubiquitous Language**: el código usa el mismo vocabulario que el colegio (`bimestre`, `acta`, `pensión`, `tutor`)

Los cinco principios **SOLID** se aplican en la capa de Negocio y en las interfaces entre capas — por ejemplo, Dependency Inversion es la base de cómo `AuthService` depende de `IAuthRepository` en vez de instanciar `AuthPrismaRepository` directamente.

---

## Patrones de diseño

DDD (Domain-Driven Design) es el enfoque central de la capa de Negocio: el código debe reflejar el lenguaje del colegio, no al revés. Conceptos clave aplicados:

| Concepto DDD | Ejemplo en EduCore |
|--------------|---------------------|
| Entidad | `Estudiante`, `Pago`, `Matrícula` (tienen identidad propia) |
| Value Object | DNI, Promedio Bimestral (sin identidad, definidos por sus atributos) |
| Aggregate | `Matrícula` (trata Estudiante + Sección + Año Escolar como una unidad transaccional) |
| Repository | `IAuthRepository`, `IEstudianteRepository` (abstracción de persistencia) |
| Domain Event | `EstudianteMatriculado`, `InasistenciaDetectada` (pendiente de implementar) |

Además de DDD, el informe define estos patrones para problemas concretos del dominio:

| Patrón | Problema que resuelve | Estado |
|--------|------------------------|--------|
| **Repository** | Separar acceso a datos de la lógica de negocio (en vez de Active Record, que acopla el modelo a la BD) | ✅ Implementado en todos los módulos |
| **Factory** | Crear un usuario que puede ser estudiante, docente o tutor, cada uno con reglas distintas, sin if/else inmanejables | 🔜 Roadmap |
| **Strategy** | El cálculo de promedio varía (bimestral, ponderado por créditos, anual) sin tocar el servicio completo | 🔜 Roadmap |
| **Observer + Domain Events** | Notificar al tutor ante una inasistencia sin acoplar el módulo de Asistencia con Comunicados | 🔜 Roadmap |
| **CQRS** (a nivel de módulo) | Separar lectura de reportes (joins pesados) de la escritura de notas, para que el cierre bimestral no degrade el sistema | 🔜 Fase 4 |

### Lógica de negocio vs. lógica de código

Distinción central del diseño: la **lógica de negocio** son las reglas del colegio (ej. "un pago vencido después de 15 días genera recargo", "se alerta al tutor si las inasistencias superan 30%") y vive en Entidades, Value Objects y Domain Services — nunca en controladores ni en queries SQL. La **lógica de código** es el mecanismo técnico (conectar a PostgreSQL, serializar JSON, enviar un email) y vive en Repositorios y adaptadores de infraestructura.

---

## Modelo de datos

Entidades implementadas en `educore-backend/prisma/schema.prisma`:

- **Usuario** — cuenta de acceso (email, password hasheado, rol, estado de 2FA)
- **Estudiante / Tutor / Docente** — perfiles de negocio, cada uno 1 a 1 con un `Usuario`
- **EstudianteTutor** — relación N a N entre estudiante y tutor, con el parentesco
- **Grado / Sección** — catálogo académico por año escolar
- **Matricula** — vincula estudiante + sección + año escolar, con estado (`PENDIENTE`, `ACTIVA`, `RETIRADA`, `FINALIZADA`)
- **Curso / DocenteCursoSeccion** — qué curso dicta qué docente en qué sección
- **Asistencia** — registro diario (`PRESENTE`, `TARDANZA`, `FALTA`), único por estudiante y fecha
- **SesionRefreshToken** — sesiones de refresh token hasheadas, revocables individualmente
- **AuditLog** — bitácora de acciones sensibles (login, login 2FA, logout)

Todas las claves primarias son UUID. Los nombres de tabla/columna están mapeados a `snake_case` en la base de datos aunque el código TypeScript use camelCase.

**Pendiente del modelo completo (según el informe):** tablas `nota`, `curso_docente` con créditos, `pago` y `recibo_pdf` — y encriptación en reposo con `pgcrypto` para DNI y datos financieros una vez se implementen los módulos de Académico avanzado y Pagos.

---

## Autenticación y seguridad

### Implementado

- **JWT de corta duración** (`accessToken`, 15 min) + **refresh token** de 7 días.
- El refresh token **no es un JWT**: es un valor aleatorio (`crypto.randomBytes(48)`) guardado **hasheado con SHA-256** en `sesion_refresh_token`. Así, aunque alguien accediera a la base de datos, no podría reconstruir el token original.
- El refresh token viaja en una **cookie httpOnly, `sameSite: strict`**, restringida al path `/api/auth`. El frontend nunca la lee ni la guarda en JS.
- El `accessToken` se guarda **en memoria** en el frontend (nunca en `localStorage`), para reducir superficie de ataque ante XSS.
- **2FA opcional por usuario**: código de 6 dígitos hasheado, expira en 5 min. Solo se devuelve en la respuesta cuando `NODE_ENV !== 'production'`.
- **RBAC por roles** vía `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN', ...)` en cada endpoint protegido.
- Validación de entrada con `class-validator` en todos los DTOs — ninguna regla de negocio recibe datos sin sanitizar.
- El frontend refresca el `accessToken` automáticamente: un interceptor de Axios detecta un 401, refresca una sola vez (evitando refrescos duplicados en paralelo) y reintenta la petición original.

### Planeado (según el informe, sección 7)

| Área | Medida planeada |
|------|-------------------|
| Rate limiting | `@nestjs/throttler`: 100 req/min por IP, 300 req/min autenticado |
| Datos sensibles | Encriptación en tránsito (TLS) y en reposo (`pgcrypto` para DNI y datos financieros) |
| Auditoría | Ampliar `audit_log` a modificación de notas, pagos y acceso a datos sensibles |
| Cabeceras HTTP | `helmet` (no configurado todavía) |

---

## Stack tecnológico

### Implementado

| Capa | Tecnología |
|------|------------|
| Backend | NestJS (Node.js + TypeScript) |
| Base de datos | Prisma ORM sobre PostgreSQL 16 |
| Validación | `class-validator` / `class-transformer` |
| Autenticación | `passport-jwt` + `@nestjs/jwt`, `bcrypt` para hash de contraseñas |
| Frontend | React 18 + TypeScript + Vite, Tailwind CSS, React Router DOM, Axios |
| Estado global | Context API (`AuthContext`, `TutorContext`) |

### Por qué estas elecciones (resumen de la comparativa del informe)

- **PostgreSQL 16** sobre MySQL/MongoDB/SQL Server: única opción open source con ACID completo, UUID nativo, columnas JSON maduras y `pgcrypto`. Un sistema con datos financieros y académicos no puede sacrificar integridad transaccional.
- **React + TypeScript + Vite** sobre Angular/Vue/Next.js: ecosistema más grande, tipado fuerte sin runtime errors, build mucho más rápido que CRA; SSR de Next.js es innecesario para un sistema interno detrás de login.
- **NestJS** sobre Express/Spring Boot/Laravel: TypeScript nativo en todo el stack (mismo lenguaje que el frontend), inyección de dependencias incluida, estructura modular que encaja con N-Layer sin el boilerplate de Express ni la desconexión de stack de Laravel/Spring.

---

## Estructura del repositorio

```
Educore/
├── educore-backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos completo
│   │   ├── migrations/         # Historial de migraciones SQL
│   │   └── seed.ts             # Datos iniciales de prueba
│   └── src/
│       ├── common/             # Guards, decorators (@Roles) y JwtStrategy compartidos
│       ├── prisma/              # PrismaService global (conexión única)
│       └── modules/
│           ├── auth/
│           ├── estudiante/
│           ├── docente/
│           ├── tutor/
│           ├── matricula/
│           ├── academico/
│           └── asistencia/
│               └── (cada uno con presentation/business/data/domain)
│
└── educore-frontend/
    └── src/
        ├── api/                 # http.ts (cliente Axios + interceptor), un *.api.ts por módulo
        ├── components/          # TextField, RutaPrivada, tarjetas de curso, modales
        ├── context/             # AuthContext, TutorContext
        ├── layouts/             # Layout + Sidebar por rol (Admin, Director, Docente, Estudiante, Tutor)
        ├── config/              # Definición de navegación por rol
        └── pages/                # Páginas agrupadas por rol
```

---

## Instalación y uso local

### Requisitos previos
- Node.js 20+
- PostgreSQL 16
- npm o pnpm

### Backend

```bash
cd educore-backend
npm install
cp .env.example .env        # completa DATABASE_URL y JWT_SECRET
npx prisma migrate dev
npm run seed                # crea usuarios de prueba
npm run start:dev
```

El servidor corre en `http://localhost:3000`.

### Frontend

```bash
cd educore-frontend
npm install
cp .env.example .env        # apunta VITE_API_URL al backend
npm run dev
```

La app corre en `http://localhost:5173/login`.

> El backend necesita `FRONTEND_URL=http://localhost:5173` en su `.env` para que `app.enableCors({ origin, credentials: true })` acepte la cookie httpOnly del refresh token.

### Usuarios de prueba (seed)

| Email | Password | Rol | 2FA |
|-------|----------|-----|-----|
| admin@educore.test | Password123! | ADMIN | No |
| docente@educore.test | Password123! | DOCENTE | Sí (código se devuelve en `codigoDev` en dev) |

---

## Variables de entorno

### Backend (`.env`)

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/educore?schema=public
JWT_SECRET=tu_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

> El refresh token no usa un secreto JWT propio: es un valor aleatorio hasheado en BD, así que no hace falta un `JWT_REFRESH_SECRET` separado.

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000
```

---

## Referencia de la API

Todos los endpoints (excepto `/api/auth/*`) requieren el header `Authorization: Bearer <accessToken>` y respetan el rol indicado.

### Auth
| Método | Endpoint | Descripción |
|--------|----------|--------------|
| POST | `/api/auth/login` | Login. Si tiene 2FA, responde `{ requiere2FA, usuarioId }` en vez de tokens |
| POST | `/api/auth/2fa/verify` | Completa el login con el código 2FA |
| POST | `/api/auth/refresh` | Renueva el access token leyendo la cookie httpOnly |
| POST | `/api/auth/logout` | Revoca la sesión y limpia la cookie |

### Estudiante
| Método | Endpoint | Rol |
|--------|----------|-----|
| GET | `/api/estudiantes/me` | ESTUDIANTE |
| GET | `/api/estudiantes` | ADMIN, DOCENTE |
| GET | `/api/estudiantes/:id` | ADMIN, DOCENTE |
| PATCH | `/api/estudiantes/:id` | ADMIN |
| PATCH | `/api/estudiantes/:id/reset-password` | ADMIN |

### Docente
| Método | Endpoint | Rol |
|--------|----------|-----|
| GET | `/api/docentes/mis-asignaciones` | DOCENTE |
| POST | `/api/docentes` | ADMIN |
| GET | `/api/docentes` | ADMIN, DIRECTOR |
| GET | `/api/docentes/:id` | ADMIN, DIRECTOR |
| POST | `/api/docentes/:id/asignaciones` | ADMIN |
| DELETE | `/api/docentes/:id/asignaciones/:asignacionId` | ADMIN |
| DELETE | `/api/docentes/:id` | ADMIN |

### Tutor
| Método | Endpoint | Rol |
|--------|----------|-----|
| GET | `/api/tutores/me` | TUTOR |
| GET | `/api/tutores/me/hijos` | TUTOR |
| PATCH | `/api/tutores/:id/reset-password` | ADMIN |

### Matrícula
| Método | Endpoint | Rol |
|--------|----------|-----|
| GET | `/api/matricula/mi-matricula` | ESTUDIANTE |
| POST | `/api/matricula` | DIRECTOR, ADMIN |
| GET | `/api/matricula` | DIRECTOR, ADMIN |
| GET | `/api/matricula/:id` | DIRECTOR, ADMIN |
| DELETE | `/api/matricula/:id` | ADMIN |
| DELETE | `/api/matricula/:id/completo` | ADMIN |

### Académico
| Método | Endpoint | Rol |
|--------|----------|-----|
| GET | `/api/academico/secciones-disponibles?anioEscolar=2026` | Cualquier usuario autenticado |

### Asistencia
| Método | Endpoint | Rol |
|--------|----------|-----|
| POST | `/api/asistencia` | DOCENTE, ADMIN |
| GET | `/api/asistencia/mi-asistencia` | ESTUDIANTE |
| GET | `/api/asistencia/hijo/:estudianteId` | TUTOR |
| GET | `/api/asistencia/seccion/:seccionId?fecha=` | DOCENTE, ADMIN, DIRECTOR |
| GET | `/api/asistencia/estudiante/:estudianteId` | ADMIN, DIRECTOR |

---

## Roadmap

Visión completa documentada en el Informe Técnico del proyecto, organizada en fases:

| Fase | Duración estimada | Entregables |
|------|---------------------|-------------|
| **Fase 1 — Fundación** | Semanas 1-3 | Auth con JWT, login web, CI/CD básico | ✅ Completada |
| **Fase 2 — Core Académico** | Semanas 4-8 | Académico, Matrícula, Dashboard, Asistencia con alertas | ✅ Completada (lo que hay en este repo) |
| **Fase 3 — Pagos y Comunicación** | Semanas 9-13 | Módulo Pagos, recibos PDF, Domain Events, Comunicados, app móvil básica | 🔜 Próxima |
| **Fase 4 — Reportes y Producción** | Semanas 14-18 | Reportes con CQRS, dashboards Grafana, pruebas de carga, documentación final | 🔜 Pendiente |
| **Fase 5 — Funcionalidades avanzadas** | Semanas 19-23 | RBAC dinámico, biblioteca escolar, portal de padres, sistema de incidencias, dashboard analítico | 🔜 Pendiente |
| **Fase 6 — Escalabilidad** | Semanas 24-28 | Integración con pagos externos, sincronización móvil offline, optimización UX/UI, auditoría avanzada | 🔜 Pendiente |

### Infraestructura planeada para fases futuras

| Componente | Elegido | Por qué (resumen) |
|------------|---------|----------------------|
| Caché y sesiones | Redis | Sub-milisegundo en lecturas, pub/sub, soporte nativo en NestJS (vs. Memcached, que no soporta estructuras complejas) |
| Almacenamiento de archivos | MinIO (self-hosted, compatible S3) | Control total de los datos del colegio, gratis, 100% compatible con SDK de AWS S3 si se migra después |
| CI/CD | GitHub Actions | Integración nativa con el repo, pipelines como código, sin servidor adicional que mantener |
| Monitoreo | Prometheus + Grafana | Open source, módulo oficial de métricas para NestJS, sin costo de licencia (vs. Datadog, ~$15-23 USD/host/mes) |
| Frontend móvil | React Native + Expo | Comparte ~70% del código con el frontend web React (vs. Flutter, que usa Dart y no comparte código) |

### Testing planeado
Jest (unitarios), Playwright (end-to-end), k6 (carga), OWASP ZAP (seguridad) — ninguno implementado todavía en este repositorio.

---

## Desarrollado por

**Blazee / FMI Enterprise** — Junio 2026
Para instituciones de nivel primaria y secundaria en Perú.
