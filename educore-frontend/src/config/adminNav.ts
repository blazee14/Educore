// src/config/adminNav.ts
import {
  IconHome,
  IconClipboard,
  IconUsers,
  IconGraduate,
  IconCalendar,
  IconBook,
  IconChart,
  IconCard,
  IconReceipt,
  IconMegaphone,
  IconMessage,
  IconBell,
  IconSettings,
  IconAlert,
} from '../components/icons';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof IconHome;
}

export interface NavGroup {
  titulo: string;
  items: NavItem[];
}

export const adminNavGroups: NavGroup[] = [
  {
    titulo: 'Gestión Académica',
    items: [
      { label: 'Matrícula', to: '/admin/matricula', icon: IconClipboard },
      { label: 'Estudiantes', to: '/admin/estudiantes', icon: IconUsers },
      { label: 'Docentes', to: '/admin/docentes', icon: IconGraduate },
      { label: 'Cursos y Secciones', to: '/admin/cursos', icon: IconBook },
      { label: 'Asistencia', to: '/admin/asistencia', icon: IconClipboard },
      { label: 'Notas y Evaluaciones', to: '/admin/notas', icon: IconChart },
      { label: 'Calendario Académico', to: '/admin/calendario', icon: IconCalendar },
    ],
  },
  {
    titulo: 'Gestión Financiera',
    items: [
      { label: 'Pagos y Pensiones', to: '/admin/pagos', icon: IconCard },
      { label: 'Recibos', to: '/admin/recibos', icon: IconReceipt },
      { label: 'Reportes Financieros', to: '/admin/reportes-financieros', icon: IconChart },
    ],
  },
  {
    titulo: 'Comunicación',
    items: [
      { label: 'Comunicados', to: '/admin/comunicados', icon: IconMegaphone },
      { label: 'Mensajería Interna', to: '/admin/mensajeria', icon: IconMessage },
      { label: 'Notificaciones', to: '/admin/notificaciones', icon: IconBell },
    ],
  },
  {
    titulo: 'Herramientas',
    items: [
      { label: 'Reportes e Indicadores', to: '/admin/reportes', icon: IconChart },
      { label: 'Biblioteca', to: '/admin/biblioteca', icon: IconBook },
      { label: 'Incidencias y Disciplina', to: '/admin/incidencias', icon: IconAlert },
      { label: 'Configuración', to: '/admin/configuracion', icon: IconSettings },
    ],
  },
];

export const adminHomeItem: NavItem = { label: 'Dashboard', to: '/admin', icon: IconHome };
