// src/layouts/EstudianteLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { miPerfilEstudiante } from '../api/estudiante.api';
import { routeMeta } from '../config/routeMeta';
import { SidebarEstudiante } from './SidebarEstudiante';
import { Topbar } from './Topbar';

export function EstudianteLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('Estudiante');
  const [iniciales, setIniciales] = useState('ES');
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] ?? { titulo: 'Dashboard' };

  useEffect(() => {
    miPerfilEstudiante()
      .then((p) => {
        setNombreCompleto(`${p.nombres} ${p.apellidos}`);
        setIniciales(`${p.nombres[0]}${p.apellidos[0]}`.toUpperCase());
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarEstudiante
        open={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
        userName={nombreCompleto}
        userInitials={iniciales}
      />
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