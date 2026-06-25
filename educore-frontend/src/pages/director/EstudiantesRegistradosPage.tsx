// src/pages/director/EstudiantesRegistradosPage.tsx
// Vista de solo lectura para Dirección — la gestión (editar/eliminar) vive en el panel de Admin.
import { useEffect, useState } from 'react';
import { listarMatriculas, type MatriculaConDetalle } from '../../api/matricula.api';

export function EstudiantesRegistradosPage() {
  const [matriculas, setMatriculas] = useState<MatriculaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarMatriculas()
      .then(setMatriculas)
      .catch(() => setError('No se pudo cargar la lista de estudiantes'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">{matriculas.length} estudiantes registrados</p>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {cargando ? (
          <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : matriculas.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No hay estudiantes registrados aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Grado / Sección</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha de matrícula</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-700">{m.nombres} {m.apellidos}</td>
                  <td className="px-4 py-3">{m.dni}</td>
                  <td className="px-4 py-3">{m.gradoNombre} "{m.seccionNombre}"</td>
                  <td className="px-4 py-3">{m.anioEscolar}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">
                      {m.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(m.fechaMatricula).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}