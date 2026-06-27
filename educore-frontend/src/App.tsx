// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RutaPrivada } from './components/RutaPrivada';

import { AdminLayout } from './layouts/AdminLayout';
import { OverviewPage } from './pages/admin/OverviewPage';
import { EnConstruccion } from './pages/admin/EnConstruccion';
import { EstudiantesPage } from './pages/admin/EstudiantesPage';
import { MatriculaAdminPage } from './pages/admin/MatriculaAdminPage';

import { DirectorLayout } from './layouts/DirectorLayout';
import { DirectorDashboardPage } from './pages/director/DirectorDashboardPage';
import { MatriculaPage } from './pages/director/MatriculaPage';
import { EstudiantesRegistradosPage } from './pages/director/EstudiantesRegistradosPage';

import { EstudianteLayout } from './layouts/EstudianteLayout';
import { InicioPage } from './pages/estudiante/InicioPage';
import { MiPerfilPage } from './pages/estudiante/MiPerfilPage';
import { MiMatriculaPage } from './pages/estudiante/MiMatriculaPage';
import { EnConstruccion as EnConstruccionEst } from './pages/estudiante/EnConstruccion';
import { CalendarioPage } from './pages/estudiante/CalendarioPage';
import { CursosEstudiantePage } from './pages/estudiante/MisCursosPage';
import { TutorLayout } from './layouts/TutorLayout';
import { TutorDashboardPage } from './pages/tutor/TutorDashboardPage';

import { DocenteLayout } from './layouts/DocenteLayout';
import { DashboardDocentePage } from './pages/docente/DashboardDocentePage';
import { EnConstruccion as EnConstruccionDoc } from './pages/docente/EnConstruccion';
import { CursosDocentePage } from './pages/docente/MisCursosPage';
import { EstudiantesDocentePage } from './pages/docente/EstudiantesDocentePage';
import { HorarioDocentePage } from './pages/docente/HorarioDocentePage';

// path -> { titulo, subtitulo } que el Topbar muestra (sección 6 del informe: un módulo por sidebar item)
const seccionesEnConstruccion: { path: string; titulo: string; subtitulo: string }[] = [
  { path: 'docentes', titulo: 'Docentes', subtitulo: 'Listado y asignación de docentes' },
  { path: 'cursos', titulo: 'Cursos y Secciones', subtitulo: 'Gestión de cursos y secciones' },
  { path: 'asistencia', titulo: 'Asistencia', subtitulo: 'Registro y reportes de asistencia' },
  { path: 'notas', titulo: 'Notas y Evaluaciones', subtitulo: 'Registro de notas por bimestre' },
  { path: 'calendario', titulo: 'Calendario Académico', subtitulo: 'Eventos y fechas clave del año' },
  { path: 'pagos', titulo: 'Pagos y Pensiones', subtitulo: 'Control de pagos por estudiante' },
  { path: 'recibos', titulo: 'Recibos', subtitulo: 'Historial de recibos emitidos' },
  { path: 'reportes-financieros', titulo: 'Reportes Financieros', subtitulo: 'Morosidad e ingresos' },
  { path: 'comunicados', titulo: 'Comunicados', subtitulo: 'Avisos a la comunidad educativa' },
  { path: 'mensajeria', titulo: 'Mensajería Interna', subtitulo: 'Comunicación entre usuarios' },
  { path: 'notificaciones', titulo: 'Notificaciones', subtitulo: 'Historial de notificaciones enviadas' },
  { path: 'reportes', titulo: 'Reportes e Indicadores', subtitulo: 'Indicadores generales de la institución' },
  { path: 'biblioteca', titulo: 'Biblioteca', subtitulo: 'Catálogo y préstamos' },
  { path: 'incidencias', titulo: 'Incidencias y Disciplina', subtitulo: 'Registro de incidencias' },
  { path: 'configuracion', titulo: 'Configuración', subtitulo: 'Configuración general del sistema' },
];

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* ---------- ADMIN ---------- */}
          <Route
            path="/admin"
            element={
              <RutaPrivada>
                <AdminLayout />
              </RutaPrivada>
            }
          >
            <Route
              index
              element={<OverviewPage />}
              handle={{ titulo: 'Dashboard', subtitulo: 'Resumen general de la institución' }}
            />
            <Route
              path="estudiantes"
              element={<EstudiantesPage />}
              handle={{ titulo: 'Estudiantes', subtitulo: 'Listado y perfiles de estudiantes' }}
            />
            <Route
              path="matricula"
              element={<MatriculaAdminPage />}
              handle={{ titulo: 'Matrícula', subtitulo: 'Gestión de matrículas por sección' }}
            />
            {seccionesEnConstruccion.map(({ path, titulo, subtitulo }) => (
              <Route
                key={path}
                path={path}
                element={<EnConstruccion nombre={titulo} />}
                handle={{ titulo, subtitulo }}
              />
            ))}
          </Route>

          {/* ---------- DIRECTOR ---------- */}
          <Route
            path="/director"
            element={
              <RutaPrivada>
                <DirectorLayout />
              </RutaPrivada>
            }
          >
            <Route
              index
              element={<DirectorDashboardPage />}
              handle={{ titulo: 'Dashboard Dirección', subtitulo: 'Bienvenido(a), Director' }}
            />
            <Route
              path="matricula"
              element={<MatriculaPage />}
              handle={{ titulo: 'Matrícula', subtitulo: 'Registro de nuevos estudiantes' }}
            />
            <Route
              path="estudiantes"
              element={<EstudiantesRegistradosPage />}
              handle={{ titulo: 'Estudiantes registrados', subtitulo: 'Listado y perfiles de estudiantes' }}
            />
            {/* Los demás módulos del sidebar de Dirección quedan pendientes */}
          </Route>

          {/* ---------- ESTUDIANTE ---------- */}
          <Route
            path="/estudiante"
            element={
              <RutaPrivada>
                <EstudianteLayout />
              </RutaPrivada>
            }
          >
            <Route
              index
              element={<InicioPage />}
              handle={{ titulo: 'Inicio', subtitulo: 'Resumen académico del estudiante' }}
            />
            <Route
              path="perfil"
              element={<MiPerfilPage />}
              handle={{ titulo: 'Mi Perfil', subtitulo: 'Datos personales del estudiante' }}
            />
            <Route
              path="matricula"
              element={<MiMatriculaPage />}
              handle={{ titulo: 'Mi Matrícula', subtitulo: 'Información de matrícula actual' }}
            />
            <Route
              path="notas"
              element={<EnConstruccionEst nombre="Mis Notas" />}
              handle={{ titulo: 'Mis Notas', subtitulo: 'Calificaciones por bimestre' }}
            />
            <Route
              path="asistencia"
              element={<EnConstruccionEst nombre="Mi Asistencia" />}
              handle={{ titulo: 'Mi Asistencia', subtitulo: 'Registro de asistencia' }}
            />
            <Route
              path="cursos"
              element={<CursosEstudiantePage />}
              handle={{ titulo: 'Mis Cursos', subtitulo: 'Cursos y horarios' }}
            />
            <Route
              path="comunicados"
              element={<EnConstruccionEst nombre="Comunicados" />}
              handle={{ titulo: 'Comunicados', subtitulo: 'Avisos y notificaciones' }}
            />
            <Route
              path="calendario"
              element={<CalendarioPage />}
              handle={{ titulo: 'Calendario', subtitulo: 'Calendario académico y fechas importantes' }}
            />
            <Route
              path="tareas"
              element={<EnConstruccionEst nombre="Tareas" />}
              handle={{ titulo: 'Tareas', subtitulo: 'Tareas y asignaciones pendientes' }}
            />
            <Route
              path="biblioteca"
              element={<EnConstruccionEst nombre="Biblioteca Digital" />}
              handle={{ titulo: 'Biblioteca Digital', subtitulo: 'Recursos y materiales de estudio' }}
            />
          </Route>

          {/* ---------- DOCENTE ---------- */}
          <Route
            path="/docente"
            element={
              <RutaPrivada>
                <DocenteLayout />
              </RutaPrivada>
            }
          >
            <Route
              index
              element={<DashboardDocentePage />}
              handle={{ titulo: 'Dashboard', subtitulo: 'Bienvenido(a), Docente' }}
            />
            <Route
              path="cursos"
              element={<CursosDocentePage />}
              handle={{ titulo: 'Cursos', subtitulo: 'Gestión de cursos asignados' }}
            />
            <Route
              path="estudiantes"
              element={<EstudiantesDocentePage />}
              handle={{ titulo: 'Estudiantes', subtitulo: 'Listado de estudiantes' }}
            />
            <Route
              path="horario"
              element={<HorarioDocentePage />}
              handle={{ titulo: 'Horario', subtitulo: 'Horario de clases' }}
            />
            <Route
              path="notas"
              element={<EnConstruccionDoc nombre="Notas" />}
              handle={{ titulo: 'Notas', subtitulo: 'Registro de notas' }}
            />
            <Route
              path="asistencia"
              element={<EnConstruccionDoc nombre="Asistencia" />}
              handle={{ titulo: 'Asistencia', subtitulo: 'Registro de asistencia' }}
            />
            <Route
              path="comunicados"
              element={<EnConstruccionDoc nombre="Comunicados" />}
              handle={{ titulo: 'Comunicados', subtitulo: 'Avisos y comunicados' }}
            />
            <Route
              path="mensajeria"
              element={<EnConstruccionDoc nombre="Mensajería" />}
              handle={{ titulo: 'Mensajería', subtitulo: 'Mensajería interna' }}
            />
            <Route
              path="perfil"
              element={<EnConstruccionDoc nombre="Perfil" />}
              handle={{ titulo: 'Perfil', subtitulo: 'Datos personales' }}
            />
            <Route
              path="configuracion"
              element={<EnConstruccionDoc nombre="Configuración" />}
              handle={{ titulo: 'Configuración', subtitulo: 'Configuración del sistema' }}
            />
          </Route>

          {/* ---------- TUTOR ---------- */}
<Route
  path="/tutor"
  element={
    <RutaPrivada>
      <TutorLayout />
    </RutaPrivada>
  }
>
  <Route
    index
    element={<TutorDashboardPage />}
    handle={{ titulo: 'Portal de Padres', subtitulo: 'Mantente informado sobre el progreso de tu hijo(a)' }}
  />
</Route>

          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}