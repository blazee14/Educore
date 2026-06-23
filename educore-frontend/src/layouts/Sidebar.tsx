// src/layouts/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { adminNavGroups, adminHomeItem } from '../config/adminNav';
import { IconGraduate, IconLogout } from '../components/icons';
import { useAuth } from '../context/AuthContext';

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkInactive = 'text-blue-100/80 hover:bg-white/10 hover:text-white';
const linkActive = 'bg-white text-primary-dark';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const { logout } = useAuth();

  return (
    <>
      {/* overlay en mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary-dark
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <IconGraduate className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-white">EduCore</p>
            <p className="text-xs text-blue-100/70">Sistema de Gestión Educativa</p>
          </div>
        </div>

        {/* navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink
            to={adminHomeItem.to}
            end
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive} mb-4`}
            onClick={onClose}
          >
            <adminHomeItem.icon className="h-[18px] w-[18px]" />
            {adminHomeItem.label}
          </NavLink>

          {adminNavGroups.map((grupo) => (
            <div key={grupo.titulo} className="mb-5">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-blue-100/50">
                {grupo.titulo}
              </p>
              <div className="flex flex-col gap-0.5">
                {grupo.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                    onClick={onClose}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* perfil + logout */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-400/30 text-sm font-semibold text-white">
              AD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Administrador</p>
              <p className="flex items-center gap-1 text-xs text-blue-100/70">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> En línea
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <IconLogout className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
