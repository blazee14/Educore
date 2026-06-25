// src/config/directorNav.ts
import {
  IconHome,
  IconClipboard,
  IconUsers,
  IconGraduate,
  IconBook,
  IconCalendar,
  IconTrendingUp,
  IconCard,
  IconFile,
  IconChart,
  IconMegaphone,
  IconMessage,
  IconChat,
  IconAlert,
  IconInbox,
  IconSettings,
} from '../components/icons';
import type { NavItem, NavGroup } from './adminNav';

export const directorNavGroups: NavGroup[] = [
  {
    titulo: 'Gestión Académica',
    items: [
      { label: 'Matrícula', to: '/director/matricula', icon: IconClipboard },
      { label: 'Estudiantes registrados', to: '/director/estudiantes', icon: IconUsers },
      { label: 'Docentes', to: '/director/docentes', icon: IconGraduate },
      { label: 'Cursos y Secciones', to: '/director/cursos', icon: IconBook },
      { label: 'Calendario académico', to: '/director/calendario', icon: IconCalendar },
      { label: 'Rendimiento académico', to: '/director/rendimiento', icon: IconTrendingUp },
    ],
  },
  {
    titulo: 'Gestión Administrativa',
    items: [
      { label: 'Pagos y pensiones', to: '/director/pagos', icon: IconCard },
      { label: 'Documentos', to: '/director/documentos', icon: IconFile },
      { label: 'Reportes', to: '/director/reportes', icon: IconChart },
    ],
  },
  {
    titulo: 'Comunicación',
    items: [
      { label: 'Comunicados', to: '/director/comunicados', icon: IconMegaphone },
      { label: 'Mensajería interna', to: '/director/mensajeria', icon: IconMessage },
      { label: 'Reuniones con padres', to: '/director/reuniones', icon: IconChat },
    ],
  },
  {
    titulo: 'Control y Seguimiento',
    items: [
      { label: 'Asistencia general', to: '/director/asistencia', icon: IconClipboard },
      { label: 'Incidencias y disciplina', to: '/director/incidencias', icon: IconAlert },
      { label: 'Solicitudes', to: '/director/solicitudes', icon: IconInbox },
    ],
  },
  {
    titulo: 'Configuración',
    items: [
      { label: 'Configuración', to: '/director/configuracion', icon: IconSettings },
    ],
  },
];

export const directorHomeItem: NavItem = { label: 'Dashboard', to: '/director', icon: IconHome };