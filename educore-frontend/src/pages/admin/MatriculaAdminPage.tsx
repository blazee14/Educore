// src/pages/admin/MatriculaAdminPage.tsx
import { useEffect, useState } from 'react';
import {
  listarMatriculas,
  eliminarMatricula,
  eliminarMatriculaCompleto,
  type MatriculaConDetalle,
} from '../../api/matricula.api';

type TipoEliminacion = 'soft' | 'completo';

export function MatriculaAdminPage() {
  const [matriculas, setMatriculas] = useState<MatriculaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<{ matricula: MatriculaConDetalle; tipo: TipoEliminacion } | null>(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const data = await listarMatriculas();
      setMatriculas(data);
    } catch {
      setError('No se pudo cargar la lista de matrículas');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function confirmarEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      if (aEliminar.tipo === 'soft') {
        await eliminarMatricula(aEliminar.matricula.id);
      } else {
        await eliminarMatriculaCompleto(aEliminar.matricula.id);
      }
      setAEliminar(null);
      await cargar();
    } catch {
      setError('No se pudo eliminar el registro');
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">{matriculas.length} matrículas registradas</p>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {cargando ? (
          <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : matriculas.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No hay matrículas registradas aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Grado / Sección</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setAEliminar({ matricula: m, tipo: 'soft' })}
                        className="text-xs font-medium text-orange-500 hover:text-orange-700"
                      >
                        Eliminar matrícula
                      </button>
                      <button
                        onClick={() => setAEliminar({ matricula: m, tipo: 'completo' })}
                        className="text-xs font-medium text-red-500 hover:text-red-700"
                      >
                        Eliminar todo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación */}
      {aEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="mt-4 text-center text-base font-semibold text-gray-800">
              {aEliminar.tipo === 'soft' ? '¿Eliminar matrícula?' : '¿Eliminar todo el registro?'}
            </h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              {aEliminar.tipo === 'soft' ? (
                <>Se eliminará la matrícula de <span className="font-medium text-gray-700">{aEliminar.matricula.nombres} {aEliminar.matricula.apellidos}</span>. El estudiante y su cuenta de acceso se conservan.</>
              ) : (
                <>Se eliminará <span className="font-medium text-gray-700">{aEliminar.matricula.nombres} {aEliminar.matricula.apellidos}</span> por completo: matrícula, estudiante y cuenta de acceso. Esta acción no se puede deshacer.</>
              )}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAEliminar(null)}
                disabled={eliminando}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}