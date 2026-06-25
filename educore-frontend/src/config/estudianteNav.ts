import {
  IconHome,
  IconUsers,
  IconClipboard,
  IconChart,
  IconCalendar,
  IconBook,
  IconMegaphone,
  IconReceipt,
} from '../components/icons';
import type { NavItem, NavGroup } from './adminNav';

export const estudianteNavGroups: NavGroup[] = [
  {
    titulo: 'Menú del Estudiante',
    items: [
      { label: 'Inicio', to: '/estudiante', icon: IconHome },
      { label: 'Mi Perfil', to: '/estudiante/perfil', icon: IconUsers },
      { label: 'Mi Matrícula', to: '/estudiante/matricula', icon: IconClipboard },
      { label: 'Mis Notas', to: '/estudiante/notas', icon: IconChart },
      { label: 'Mi Asistencia', to: '/estudiante/asistencia', icon: IconCalendar },
      { label: 'Mis Cursos', to: '/estudiante/cursos', icon: IconBook },
      { label: 'Calendario', to: '/estudiante/calendario', icon: IconCalendar },
      { label: 'Tareas', to: '/estudiante/tareas', icon: IconReceipt },
      { label: 'Biblioteca Digital', to: '/estudiante/biblioteca', icon: IconBook },
      { label: 'Comunicados', to: '/estudiante/comunicados', icon: IconMegaphone },
    ],
  },
];

export const estudianteHomeItem: NavItem = { label: 'Inicio', to: '/estudiante', icon: IconHome };
