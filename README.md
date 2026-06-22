# EduCore — Sistema de Gestión Educativa

Plataforma integral para digitalizar y automatizar los procesos de instituciones educativas de nivel primaria y secundaria: matrícula, seguimiento académico, asistencia, pagos y comunicación institucional.

---

## Módulos

| Módulo | Descripción | Roles |
|--------|-------------|-------|
| Auth | Autenticación multi-rol con JWT y 2FA opcional | Todos |
| Matrícula | Registro, validación y asignación de secciones | Admin, Tutor |
| Académico | Cursos, notas, bimestres, actas | Docente, Estudiante |
| Asistencia | Registro diario con alertas automáticas | Docente, Admin |
| Pagos | Pensiones, recibos, vencimientos, historial | Admin, Tutor |
| Comunicados | Mensajería interna y notificaciones push | Todos |
| Reportes | Dashboard, estadísticas, exportación PDF/Excel | Director, Admin |

---

## Stack Tecnológico

### Frontend Web
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS**
- React Router DOM
- Axios

### Frontend Móvil
- **React Native** + **Expo**

### Backend
- **NestJS** + **Node.js** + **TypeScript**
- **Prisma ORM**
- **PostgreSQL 16**
- **Redis** (caché y sesiones)
- **MinIO** (almacenamiento de archivos)

### Autenticación
- JWT (access token + refresh token en cookie httpOnly)
- 2FA con código de 6 dígitos
- RBAC por roles: Director, Admin, Docente, Estudiante, Tutor

### Arquitectura
- N-Layer Architecture (Presentación → Negocio → Datos)
- Domain-Driven Design (DDD)
- Patrones: Repository, Factory, Strategy, Observer + Domain Events, CQRS

### Testing
- **Jest** — unit tests
- **Playwright** — tests end-to-end
- **k6** — pruebas de carga
- **OWASP ZAP** — seguridad

---

## Estructura del Proyecto

```
Educore/
├── educore-backend/        # NestJS + Prisma + PostgreSQL
│   ├── prisma/             # Schema y migraciones
│   └── src/
│       ├── presentation/   # Controllers, DTOs, Guards
│       ├── business/       # Services, Domain Services, patrones
│       ├── data/           # Repositories, Prisma client, Redis, MinIO
│       └── shared/         # Interfaces, constantes, tipos compartidos
│
└── educore-frontend/       # React + Vite + Tailwind
    └── src/
        ├── api/            # Clientes HTTP (axios)
        ├── components/     # Componentes reutilizables
        ├── context/        # AuthContext y otros contextos
        └── pages/          # Páginas de la app
```

---

## Requisitos previos

- Node.js 20+
- PostgreSQL 16
- Redis
- npm o pnpm

---

## Instalación y uso local

### Backend

```bash
cd educore-backend
npm install
cp .env.example .env
# Configura las variables en .env
npx prisma migrate dev
npm run start:dev
```

El servidor corre en `http://localhost:3000`

### Frontend

```bash
cd educore-frontend
npm install
cp .env.example .env
# Configura VITE_API_URL en .env
npm run dev
```

La app corre en `http://localhost:5173`

---

## Variables de entorno

### Backend (`.env`)

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/educore
JWT_SECRET=tu_jwt_secret
JWT_REFRESH_SECRET=tu_refresh_secret
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=tu_access_key
MINIO_SECRET_KEY=tu_secret_key
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000
```

---

## API — Endpoints principales

### Auth

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login con email y contraseña |
| POST | `/api/auth/refresh` | Renovar access token |
| POST | `/api/auth/2fa/verify` | Verificar código 2FA |
| POST | `/api/auth/logout` | Cerrar sesión |

### Matrícula

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/matricula` | Crear matrícula |
| GET | `/api/matricula/:estudianteId/historial` | Historial de matrículas |
| GET | `/api/matricula/seccion/:seccionId` | Estudiantes por sección |
| PATCH | `/api/matricula/:id/estado` | Actualizar estado de matrícula |

---

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| Director | Reportes, dashboard, estadísticas globales |
| Admin | Matrícula, pagos, comunicados, configuración |
| Docente | Notas, asistencia, cursos asignados |
| Estudiante | Notas propias, asistencia, comunicados |
| Tutor | Seguimiento del estudiante, pagos, comunicados |

---

## Desarrollado por

**Blazee / FMI Enterprise** — Junio 2026

Para instituciones de nivel primaria y secundaria en Perú.
