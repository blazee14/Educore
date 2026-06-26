// src/config/tutorNav.ts
import {
  IconHome,
  IconChart,
  IconClipboard,
  IconBook,
  IconChat,
  IconCalendar,
  IconCard,
  IconUsers,
  IconShield,
  IconFile,
  IconSettings,
} from '../components/icons';
import type { NavItem, NavGroup } from './adminNav';

export const tutorNavGroups: NavGroup[] = [
  {
    titulo: 'Menú principal',
    items: [
      { label: 'Rendimiento académico', to: '/tutor/rendimiento', icon: IconChart },
      { label: 'Asistencia', to: '/tutor/asistencia', icon: IconClipboard },
      { label: 'Tareas y evaluaciones', to: '/tutor/tareas', icon: IconBook },
      { label: 'Comunicados', to: '/tutor/comunicados', icon: IconChat },
      { label: 'Calendario', to: '/tutor/calendario', icon: IconCalendar },
      { label: 'Pagos y recibos', to: '/tutor/pagos', icon: IconCard },
      { label: 'Reuniones y citas', to: '/tutor/reuniones', icon: IconUsers },
      { label: 'Autorizaciones', to: '/tutor/autorizaciones', icon: IconShield },
      { label: 'Documentos', to: '/tutor/documentos', icon: IconFile },
    ],
  },
  {
    titulo: 'Mi cuenta',
    items: [
      { label: 'Configuración', to: '/tutor/configuracion', icon: IconSettings },
    ],
  },
];

export const tutorHomeItem: NavItem = { label: 'Inicio', to: '/tutor', icon: IconHome };