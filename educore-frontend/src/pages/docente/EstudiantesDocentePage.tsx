import { useState, useEffect, useMemo } from 'react';
import { IconSearch } from '../../components/icons';
import { misEstudiantes, type EstudianteConCursos } from '../../api/docente.api';

interface FilaTabla {
  estudianteId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  grado: string;
  seccion: string;
  cursoNombre: string;
  cursoColor: string;
  promedio: number;
}

const opcionesPagina = [8, 12, 24];

function useEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<EstudianteConCursos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let activo = true;
    misEstudiantes()
      .then((data) => { if (activo) { setEstudiantes(data); setCargando(false); } })
      .catch(() => { if (activo) { setError('No se pudieron cargar los estudiantes.'); setCargando(false); } });
    return () => { activo = false; };
  }, []);
  return { estudiantes, cargando, error };
}

export function EstudiantesDocentePage() {
  const { estudiantes, cargando, error } = useEstudiantes();
  const [busqueda, setBusqueda] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [porPagina, setPorPagina] = useState(12);
  const [pagina, setPagina] = useState(1);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<EstudianteConCursos | null>(null);

  const filas: FilaTabla[] = useMemo(
    () => estudiantes.flatMap((e) =>
      e.cursos.map((c) => ({
        estudianteId: e.id,
        nombres: e.nombres,
        apellidos: e.apellidos,
        dni: e.dni,
        grado: e.gradoNombre ?? '',
        seccion: e.seccionNombre ?? '',
        cursoNombre: c.nombre,
        cursoColor: c.color,
        promedio: c.promedio,
      }))
    ),
    [estudiantes],
  );

  const grados = useMemo(() => [...new Set(estudiantes.map((e) => e.gradoNombre).filter(Boolean))].sort() as string[], [estudiantes]);
  const secciones = useMemo(() => [...new Set(estudiantes.map((e) => e.seccionNombre).filter(Boolean))].sort() as string[], [estudiantes]);
  const cursosList = useMemo(() => [...new Set(estudiantes.flatMap((e) => e.cursos.map((c) => c.nombre)))].sort(), [estudiantes]);

  const filtrados = useMemo(() => {
    let result = filas;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(
        (f) =>
          `${f.nombres} ${f.apellidos}`.toLowerCase().includes(q) ||
          f.dni.includes(q),
      );
    }
    if (filtroGrado) result = result.filter((f) => f.grado === filtroGrado);
    if (filtroSeccion) result = result.filter((f) => f.seccion === filtroSeccion);
    if (filtroCurso) result = result.filter((f) => f.cursoNombre === filtroCurso);
    return result;
  }, [busqueda, filtroGrado, filtroSeccion, filtroCurso, filas]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  function cambiarPagina(p: number) {
    if (p >= 1 && p <= totalPaginas) setPagina(p);
  }

  function abrirModal(estudianteId: string) {
    const encontrado = estudiantes.find((e) => e.id === estudianteId);
    if (encontrado) setEstudianteSeleccionado(encontrado);
  }

  const promedioGeneral = estudianteSeleccionado
    ? (estudianteSeleccionado.cursos.reduce((sum, c) => sum + c.promedio, 0) / Math.max(estudianteSeleccionado.cursos.length, 1)).toFixed(1)
    : '0.0';

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <div className="relative min-w-0 flex-[2] sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            placeholder="Buscar alumno o DNI..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={filtroGrado}
          onChange={(e) => { setFiltroGrado(e.target.value); setPagina(1); }}
          className="min-w-[100px] rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary"
        >
          <option value="">Grado: todos</option>
          {grados.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={filtroSeccion}
          onChange={(e) => { setFiltroSeccion(e.target.value); setPagina(1); }}
          className="min-w-[100px] rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary"
        >
          <option value="">Sección: todas</option>
          {secciones.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filtroCurso}
          onChange={(e) => { setFiltroCurso(e.target.value); setPagina(1); }}
          className="min-w-[130px] rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary"
        >
          <option value="">Curso: todos</option>
          {cursosList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(+e.target.value); setPagina(1); }}
            className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary"
          >
            {opcionesPagina.map((n) => (
              <option key={n} value={n}>Mostrar: {n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contador y tabla */}
      <p className="text-sm text-gray-500">{filtrados.length} registros encontrados</p>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {paginados.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No se encontraron estudiantes con esos filtros.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="w-10 px-4 py-3 text-center">#</th>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Grado / Sección</th>
                <th className="px-4 py-3">Curso</th>
                <th className="px-4 py-3">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {paginados.map((fila, idx) => (
                <tr
                  key={`${fila.estudianteId}-${fila.cursoNombre}`}
                  onClick={() => abrirModal(fila.estudianteId)}
                  className="cursor-pointer border-t border-gray-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-4 py-3 text-center text-gray-400">{idx + 1 + (pagina - 1) * porPagina}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {fila.nombres} {fila.apellidos}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{fila.dni}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {fila.grado} &quot;{fila.seccion}&quot;
                  </td>
                  <td className="px-4 py-3 text-gray-700">{fila.cursoNombre}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">{fila.promedio.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => cambiarPagina(pagina - 1)}
            disabled={pagina === 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => cambiarPagina(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition
                ${p === pagina ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => cambiarPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de detalle del estudiante */}
      {estudianteSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEstudianteSeleccionado(null)}
        >
          <div
            className="flex w-full max-w-lg flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Detalle del Estudiante</h3>
              <button
                onClick={() => setEstudianteSeleccionado(null)}
                className="text-lg text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Avatar */}
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <span className="text-3xl font-bold text-primary">
                  {estudianteSeleccionado.nombres.charAt(0)}
                  {estudianteSeleccionado.apellidos.charAt(0)}
                </span>
              </div>
            </div>

            {/* Datos personales */}
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {estudianteSeleccionado.nombres} {estudianteSeleccionado.apellidos}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                DNI: {estudianteSeleccionado.dni}
              </p>
              <p className="text-sm text-gray-500">
                {estudianteSeleccionado.gradoNombre} &quot;{estudianteSeleccionado.seccionNombre}&quot;
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Lista de cursos */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Cursos</p>
              <div className="flex flex-col gap-2">
                {estudianteSeleccionado.cursos.map((c, i) => (
                  <div
                    key={`${c.nombre}-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div
                      className="h-10 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="flex min-w-0 flex-1 items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${c.promedio >= 14 ? 'text-green-600' : c.promedio >= 11 ? 'text-amber-600' : 'text-gray-800'}`}>
                          {c.promedio.toFixed(1)}
                        </p>
                        <p className="text-[11px] text-gray-400">{c.cantidadNotas} notas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promedio general */}
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Promedio general</p>
              <p className="text-xl font-bold text-gray-800">{promedioGeneral}</p>
            </div>

            {/* Cerrar */}
            <button
              onClick={() => setEstudianteSeleccionado(null)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
