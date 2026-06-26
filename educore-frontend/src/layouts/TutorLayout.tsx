// src/layouts/TutorLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarTutor } from './SidebarTutor';
import { Topbar } from './Topbar';
import { routeMeta } from '../config/routeMeta';
import { miPerfilTutor } from '../api/tutor.api';
import { TutorProvider } from '../context/TutorContext';

export function TutorLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState('Tutor');
  const [iniciales, setIniciales] = useState('TU');
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] ?? { titulo: 'Portal de Padres' };

  useEffect(() => {
    miPerfilTutor()
      .then((p) => {
        setNombreCompleto(`${p.nombres} ${p.apellidos}`);
        setIniciales(`${p.nombres[0]}${p.apellidos[0]}`.toUpperCase());
      })
      .catch(() => {});
  }, []);

  return (
    <TutorProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <SidebarTutor
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
    </TutorProvider>
  );
}