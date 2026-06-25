// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RutaPrivada } from './components/RutaPrivada';
import { AdminLayout } from './layouts/AdminLayout';
import { OverviewPage } from './pages/admin/OverviewPage';
import { EnConstruccion } from './pages/admin/EnConstruccion';
import { EstudiantesPage } from './pages/admin/EstudiantesPage';
import { EstudianteLayout } from './layouts/EstudianteLayout';
import { InicioPage } from './pages/estudiante/InicioPage';
import { MiPerfilPage } from './pages/estudiante/MiPerfilPage';
import { MiMatriculaPage } from './pages/estudiante/MiMatriculaPage';
import { EnConstruccion as EnConstruccionEst } from './pages/estudiante/EnConstruccion';
import { CalendarioPage } from './pages/estudiante/CalendarioPage';
import { MisCursosPage } from './pages/estudiante/MisCursosPage';

// path -> { titulo, subtitulo } que el Topbar muestra (sección 6 del informe: un módulo por sidebar item)
const seccionesEnConstruccion: { path: string; titulo: string; subtitulo: string }[] = [
  { path: 'matricula', titulo: 'Matrícula', subtitulo: 'Gestión de matrículas por sección' },
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
              handle={{ titulo: 'Dashboard', subtitulo: 'Listado y perfiles de estudiantes' }}
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
              element={<MisCursosPage />}
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
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}