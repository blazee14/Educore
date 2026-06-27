// src/pages/director/AsistenciaDirectorPage.tsx
// Vista de solo lectura para Dirección — el registro/edición vive en Admin (y luego en Docente).
import { useEffect, useState } from 'react';
import { seccionesDisponibles, type GradoConSecciones } from '../../api/academico.api';
import { listarAsistenciaPorSeccion, type AlumnoParaAsistencia } from '../../api/asistencia.api';

const ANIO_ESCOLAR = new Date().getFullYear();
const hoy = new Date().toISOString().slice(0, 10);

const colores: Record<string, string> = {
  PRESENTE: 'bg-green-50 text-green-600',
  TARDANZA: 'bg-orange-50 text-orange-600',
  FALTA: 'bg-red-50 text-red-600',
};

const labels: Record<string, string> = {
  PRESENTE: 'Presente',
  TARDANZA: 'Tardanza',
  FALTA: 'Falta',
};

export function AsistenciaDirectorPage() {
  const [grados, setGrados] = useState<GradoConSecciones[]>([]);
  const [seccionId, setSeccionId] = useState('');
  const [fecha, setFecha] = useState(hoy);
  const [alumnos, setAlumnos] = useState<AlumnoParaAsistencia[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    seccionesDisponibles(ANIO_ESCOLAR).then(setGrados).catch(() => {});
  }, []);

  useEffect(() => {
    if (!seccionId || !fecha) return;
    setCargando(true);
    setError(null);
    listarAsistenciaPorSeccion(seccionId, fecha)
      .then(setAlumnos)
      .catch(() => setError('No se pudo cargar la asistencia'))
      .finally(() => setCargando(false));
  }, [seccionId, fecha]);

  const presentes = alumnos.filter((a) => a.estadoActual === 'PRESENTE').length;
  const tardanzas = alumnos.filter((a) => a.estadoActual === 'TARDANZA').length;
  const faltas = alumnos.filter((a) => a.estadoActual === 'FALTA').length;

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

      {seccionId && !cargando && alumnos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{presentes}</p>
            <p className="text-xs text-gray-400">Presentes</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{tardanzas}</p>
            <p className="text-xs text-gray-400">Tardanzas</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{faltas}</p>
            <p className="text-xs text-gray-400">Faltas</p>
          </div>
        </div>
      )}

      {seccionId && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {cargando ? (
            <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
          ) : alumnos.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No hay alumnos matriculados en esta sección.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Alumno</th>
                  <th className="px-4 py-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((a) => (
                  <tr key={a.estudianteId} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">{a.nombres} {a.apellidos}</td>
                    <td className="px-4 py-3 text-right">
                      {a.estadoActual ? (
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${colores[a.estadoActual]}`}>
                          {labels[a.estadoActual]}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Sin registrar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}