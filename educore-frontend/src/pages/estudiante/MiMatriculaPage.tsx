// src/pages/estudiante/MiMatriculaPage.tsx
import { useEffect, useState } from 'react';
import { miMatricula, type MiMatricula } from '../../api/matricula.api';

export function MiMatriculaPage() {
  const [matricula, setMatricula] = useState<MiMatricula | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    miMatricula()
      .then(setMatricula)
      .catch(() => setError('No se encontró información de matrícula'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>;
  }

  if (error || !matricula) {
    return (
      <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {error ?? 'No se encontró información de matrícula'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800">Matrícula {matricula.anioEscolar}</p>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
            {matricula.estado}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-400">Nivel</p>
            <p className="text-sm font-medium text-gray-700">{matricula.nivel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Grado y sección</p>
            <p className="text-sm font-medium text-gray-700">
              {matricula.gradoNombre} "{matricula.seccionNombre}"
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Año escolar</p>
            <p className="text-sm font-medium text-gray-700">{matricula.anioEscolar}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Fecha de matrícula</p>
            <p className="text-sm font-medium text-gray-700">
              {new Date(matricula.fechaMatricula).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}