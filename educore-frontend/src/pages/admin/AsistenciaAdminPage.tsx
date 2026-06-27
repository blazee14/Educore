// src/pages/admin/AsistenciaAdminPage.tsx
import { useEffect, useState } from 'react';
import { seccionesDisponibles, type GradoConSecciones } from '../../api/academico.api';
import {
  listarAsistenciaPorSeccion,
  registrarAsistencia,
  type AlumnoParaAsistencia,
  type EstadoAsistencia,
} from '../../api/asistencia.api';

const ANIO_ESCOLAR = new Date().getFullYear();
const hoy = new Date().toISOString().slice(0, 10);

const opciones: { valor: EstadoAsistencia; label: string; color: string }[] = [
  { valor: 'PRESENTE', label: 'Presente', color: 'bg-green-500' },
  { valor: 'TARDANZA', label: 'Tardanza', color: 'bg-orange-500' },
  { valor: 'FALTA', label: 'Falta', color: 'bg-red-500' },
];

export function AsistenciaAdminPage() {
  const [grados, setGrados] = useState<GradoConSecciones[]>([]);
  const [seccionId, setSeccionId] = useState('');
  const [fecha, setFecha] = useState(hoy);
  const [alumnos, setAlumnos] = useState<AlumnoParaAsistencia[]>([]);
  const [marcados, setMarcados] = useState<Record<string, EstadoAsistencia>>({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    seccionesDisponibles(ANIO_ESCOLAR).then(setGrados).catch(() => {});
  }, []);

  async function cargarAlumnos() {
    if (!seccionId || !fecha) return;
    setCargando(true);
    setError(null);
    setMensaje(null);
    try {
      const data = await listarAsistenciaPorSeccion(seccionId, fecha);
      setAlumnos(data);
      const inicial: Record<string, EstadoAsistencia> = {};
      data.forEach((a) => {
        if (a.estadoActual) inicial[a.estudianteId] = a.estadoActual;
      });
      setMarcados(inicial);
    } catch {
      setError('No se pudo cargar la lista de alumnos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarAlumnos();
  }, [seccionId, fecha]);

  async function handleGuardar() {
    if (alumnos.length === 0) return;
    setGuardando(true);
    setError(null);
    try {
      const registros = alumnos
        .filter((a) => marcados[a.estudianteId])
        .map((a) => ({ estudianteId: a.estudianteId, estado: marcados[a.estudianteId] }));

      if (registros.length < alumnos.length) {
        setError('Marca el estado de todos los alumnos antes de guardar');
        setGuardando(false);
        return;
      }

      await registrarAsistencia(seccionId, fecha, registros);
      setMensaje('Asistencia guardada correctamente');
    } catch {
      setError('No se pudo guardar la asistencia');
    } finally {
      setGuardando(false);
    }
  }

  function marcarTodos(estado: EstadoAsistencia) {
    const nuevo: Record<string, EstadoAsistencia> = {};
    alumnos.forEach((a) => { nuevo[a.estudianteId] = estado; });
    setMarcados(nuevo);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            value={seccionId}
            onChange={(e) => setSeccionId(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Selecciona grado y sección</option>
            {grados.map((g) => (
              <optgroup key={g.gradoId} label={`${g.gradoNombre} - ${g.nivel}`}>
                {g.secciones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {g.gradoNombre} "{s.nombre}"
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}
      {mensaje && (
        <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">{mensaje}</div>
      )}

      {seccionId && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {cargando ? (
            <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
          ) : alumnos.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No hay alumnos matriculados en esta sección.</p>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-600">{alumnos.length} alumnos</p>
                <div className="flex gap-2">
                  <button onClick={() => marcarTodos('PRESENTE')} className="text-xs font-medium text-green-600 hover:underline">
                    Marcar todos presentes
                  </button>
                </div>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {alumnos.map((a) => (
                    <tr key={a.estudianteId} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-700">{a.nombres} {a.apellidos}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {opciones.map((op) => (
                            <button
                              key={op.valor}
                              onClick={() => setMarcados({ ...marcados, [a.estudianteId]: op.valor })}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                marcados[a.estudianteId] === op.valor
                                  ? `${op.color} text-white`
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {op.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Guardar asistencia'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}