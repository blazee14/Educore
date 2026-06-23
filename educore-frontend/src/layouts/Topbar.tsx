// src/layouts/Topbar.tsx
import { useState } from 'react';
import { IconSearch, IconBell, IconMessage, IconMenu, IconChevronDown, IconGraduate } from '../components/icons';

interface Props {
  titulo: string;
  subtitulo?: string;
  onAbrirSidebar: () => void;
}

export function Topbar({ titulo, subtitulo, onAbrirSidebar }: Props) {
  const [menuColegioAbierto, setMenuColegioAbierto] = useState(false);

  return (
    <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <button
        onClick={onAbrirSidebar}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-none">
        <h1 className="truncate text-lg font-bold text-gray-800">{titulo}</h1>
        {subtitulo && <p className="hidden truncate text-xs text-gray-500 sm:block">{subtitulo}</p>}
      </div>

      <div className="ml-2 hidden flex-1 md:block">
        <div className="relative max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar estudiantes, cursos, documentos..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm
              outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Notificaciones">
          <IconBell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            12
          </span>
        </button>
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Mensajes">
          <IconMessage className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            5
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuColegioAbierto((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <IconGraduate className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-none text-gray-700">
                Colegio San Ignacio de Loyola
              </p>
              <p className="text-[11px] text-gray-400">Año Escolar 2026</p>
            </div>
            <IconChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {menuColegioAbierto && (
            <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg">
              <button className="block w-full px-3 py-2 text-left hover:bg-gray-50">Mi perfil</button>
              <button className="block w-full px-3 py-2 text-left hover:bg-gray-50">
                Configuración del colegio
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
