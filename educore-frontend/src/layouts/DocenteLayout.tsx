import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarDocente } from './SidebarDocente';
import { Topbar } from './Topbar';
import { routeMeta } from '../config/routeMeta';

export function DocenteLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] ?? { titulo: 'Dashboard' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarDocente open={sidebarAbierto} onClose={() => setSidebarAbierto(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          titulo={meta.titulo}
          subtitulo={meta.subtitulo}
          onAbrirSidebar={() => setSidebarAbierto(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
