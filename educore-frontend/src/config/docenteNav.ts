import {
  IconHome,
  IconBook,
  IconUsers,
  IconCalendar,
  IconChart,
  IconClipboard,
  IconMegaphone,
  IconMessage,
  IconGraduate,
  IconSettings,
} from '../components/icons';
import type { NavItem, NavGroup } from './adminNav';

export const docenteNavGroups: NavGroup[] = [
  {
    titulo: 'Menú del Docente',
    items: [
      { label: 'Dashboard', to: '/docente', icon: IconHome },
      { label: 'Cursos', to: '/docente/cursos', icon: IconBook },
      { label: 'Estudiantes', to: '/docente/estudiantes', icon: IconUsers },
      { label: 'Horario', to: '/docente/horario', icon: IconCalendar },
      { label: 'Notas', to: '/docente/notas', icon: IconChart },
      { label: 'Asistencia', to: '/docente/asistencia', icon: IconClipboard },
      { label: 'Comunicados', to: '/docente/comunicados', icon: IconMegaphone },
      { label: 'Mensajería', to: '/docente/mensajeria', icon: IconMessage },
      { label: 'Perfil', to: '/docente/perfil', icon: IconGraduate },
      { label: 'Configuración', to: '/docente/configuracion', icon: IconSettings },
    ],
  },
];

export const docenteHomeItem: NavItem = { label: 'Dashboard', to: '/docente', icon: IconHome };
