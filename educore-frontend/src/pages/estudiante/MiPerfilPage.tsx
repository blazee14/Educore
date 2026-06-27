// src/pages/estudiante/MiPerfilPage.tsx
import { useEffect, useState } from 'react';
import { miPerfilEstudiante, type EstudianteConDetalle } from '../../api/estudiante.api';

export function MiPerfilPage() {
  const [perfil, setPerfil] = useState<EstudianteConDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    miPerfilEstudiante()
      .then(setPerfil)
      .catch(() => setError('No se pudo cargar tu información'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>;
  }

  if (error || !perfil) {
    return (
      <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {error ?? 'No se encontró tu información'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 flex-none items-center justify-center rounded-full bg-blue-100 text-3xl font-semibold text-blue-600">
            {perfil.nombres[0]}{perfil.apellidos[0]}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{perfil.nombres} {perfil.apellidos}</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {perfil.gradoNombre ? `${perfil.gradoNombre} "${perfil.seccionNombre}"` : 'Sin sección asignada'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-4 font-semibold text-gray-800">Datos personales</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-400">Nombres</p>
            <p className="text-sm font-medium text-gray-700">{perfil.nombres}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Apellidos</p>
            <p className="text-sm font-medium text-gray-700">{perfil.apellidos}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">DNI</p>
            <p className="text-sm font-medium text-gray-700">{perfil.dni}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Fecha de nacimiento</p>
            <p className="text-sm font-medium text-gray-700">
              {new Date(perfil.fechaNacimiento).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Correo institucional</p>
            <p className="text-sm font-medium text-gray-700">{perfil.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-4 font-semibold text-gray-800">Apoderado(s)</p>
        {perfil.tutores.length === 0 ? (
          <p className="text-sm text-gray-400">No hay apoderados registrados.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {perfil.tutores.map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  {t.nombres[0]}{t.apellidos[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.nombres} {t.apellidos}</p>
                  <p className="text-xs text-gray-400">{t.parentesco}{t.telefono ? ` · ${t.telefono}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}