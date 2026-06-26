// src/layouts/SidebarTutor.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { tutorNavGroups, tutorHomeItem } from '../config/tutorNav';
import { IconGraduate, IconLogout, IconChevronDown } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useTutor } from '../context/TutorContext';

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkInactive = 'text-blue-100/80 hover:bg-white/10 hover:text-white';
const linkActive = 'bg-white text-primary-dark';

interface Props {
  open: boolean;
  onClose: () => void;
  userName?: string;
  userInitials?: string;
}

export function SidebarTutor({ open, onClose, userName = 'Tutor', userInitials = 'TU' }: Props) {
  const { logout } = useAuth();
  const { hijos, hijoSeleccionado, seleccionarHijo } = useTutor();
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary-dark
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <IconGraduate className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-white">EduCore</p>
            <p className="text-xs text-blue-100/70">Portal de Padres</p>
          </div>
        </div>

        {/* Mis hijos */}
        {hijos.length > 0 && (
          <div className="border-b border-white/10 px-3 py-4">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-blue-100/50">
              Mis hijos
            </p>
            <div className="relative">
              <button
                onClick={() => setDropdownAbierto((v) => !v)}
                className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-left transition hover:bg-white/15"
              >
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-400/40 text-xs font-semibold text-white">
                  {hijoSeleccionado?.nombres[0]}{hijoSeleccionado?.apellidos[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {hijoSeleccionado?.nombres} {hijoSeleccionado?.apellidos}
                  </p>
                  <p className="truncate text-xs text-blue-100/60">
                    {hijoSeleccionado?.gradoNombre ? `${hijoSeleccionado.gradoNombre} "${hijoSeleccionado.seccionNombre}"` : ''}
                  </p>
                </div>
                {hijos.length > 1 && (
                  <IconChevronDown className={`h-4 w-4 flex-none text-blue-100/70 transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`} />
                )}
              </button>

              {dropdownAbierto && hijos.length > 1 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg bg-white shadow-lg">
                  {hijos.map((h) => (
                    <button
                      key={h.estudianteId}
                      onClick={() => {
                        seleccionarHijo(h.estudianteId);
                        setDropdownAbierto(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                        h.estudianteId === hijoSeleccionado?.estudianteId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-600">
                        {h.nombres[0]}{h.apellidos[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-700">{h.nombres} {h.apellidos}</p>
                        <p className="truncate text-xs text-gray-400">
                          {h.gradoNombre ? `${h.gradoNombre} "${h.seccionNombre}"` : ''}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink
            to={tutorHomeItem.to}
            end
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive} mb-4`}
            onClick={onClose}
          >
            <tutorHomeItem.icon className="h-[18px] w-[18px]" />
            {tutorHomeItem.label}
          </NavLink>
          {tutorNavGroups.map((grupo) => (
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

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-400/30 text-sm font-semibold text-white">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
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