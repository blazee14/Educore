import { useState, useMemo } from 'react';
import { CardCursoDocente } from '../../components/CardCursoDocente';
import { SidebarCurso } from '../../components/SidebarCurso';
import { IconSearch } from '../../components/icons';
import type { Curso } from '../../api/cursos.api';

type CursoConProfesor = Curso & { profesorEmail: string };

const cursos: CursoConProfesor[] = [
  { nombre: 'Matemáticas', grado: '3°', seccion: 'A', nivel: 'Primaria', profesor: 'Juan Pérez', color: '#ef4444', profesorEmail: 'juan.perez@educore.test' },
  { nombre: 'Matemáticas', grado: '3°', seccion: 'B', nivel: 'Primaria', profesor: 'Juan Pérez', color: '#ef4444', profesorEmail: 'juan.perez@educore.test' },
  { nombre: 'Matemáticas', grado: '4°', seccion: 'A', nivel: 'Primaria', profesor: 'Juan Pérez', color: '#ef4444', profesorEmail: 'juan.perez@educore.test' },
  { nombre: 'Comunicación', grado: '3°', seccion: 'A', nivel: 'Primaria', profesor: 'María López', color: '#eab308', profesorEmail: 'maria.lopez@educore.test' },
  { nombre: 'Comunicación', grado: '4°', seccion: 'B', nivel: 'Primaria', profesor: 'María López', color: '#eab308', profesorEmail: 'maria.lopez@educore.test' },
  { nombre: 'Ciencia y Tecnología', grado: '3°', seccion: 'A', nivel: 'Primaria', profesor: 'Carlos Ruiz', color: '#22c55e', profesorEmail: 'carlos.ruiz@educore.test' },
  { nombre: 'Ciencia y Tecnología', grado: '5°', seccion: 'A', nivel: 'Primaria', profesor: 'Carlos Ruiz', color: '#22c55e', profesorEmail: 'carlos.ruiz@educore.test' },
  { nombre: 'Inglés', grado: '4°', seccion: 'A', nivel: 'Primaria', profesor: 'Peter Smith', color: '#a855f7', profesorEmail: 'peter.smith@educore.test' },
  { nombre: 'Inglés', grado: '5°', seccion: 'B', nivel: 'Primaria', profesor: 'Peter Smith', color: '#a855f7', profesorEmail: 'peter.smith@educore.test' },
  { nombre: 'Personal Social', grado: '3°', seccion: 'B', nivel: 'Primaria', profesor: 'Ana García', color: '#f97316', profesorEmail: 'ana.garcia@educore.test' },
  { nombre: 'Arte y Cultura', grado: '5°', seccion: 'A', nivel: 'Primaria', profesor: 'Lucía Torres', color: '#06b6d4', profesorEmail: 'lucia.torres@educore.test' },
  { nombre: 'Educación Física', grado: '3°', seccion: 'A', nivel: 'Primaria', profesor: 'Roberto Díaz', color: '#84cc16', profesorEmail: 'roberto.diaz@educore.test' },
  { nombre: 'Educación Física', grado: '1°', seccion: 'A', nivel: 'Primaria', profesor: 'Roberto Díaz', color: '#84cc16', profesorEmail: 'roberto.diaz@educore.test' },
  { nombre: 'Religión', grado: '2°', seccion: 'A', nivel: 'Primaria', profesor: 'Sofía Mendoza', color: '#7dd3fc', profesorEmail: 'sofia.mendoza@educore.test' },
  { nombre: 'Religión', grado: '2°', seccion: 'B', nivel: 'Primaria', profesor: 'Sofía Mendoza', color: '#7dd3fc', profesorEmail: 'sofia.mendoza@educore.test' },
];

const opcionesPagina = [8, 12, 24];

export function CursosDocentePage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [modo, setModo] = useState<'grid' | 'lista'>('grid');
  const [porPagina, setPorPagina] = useState(12);
  const [pagina, setPagina] = useState(1);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoConProfesor | null>(null);

  const grados = useMemo(() => [...new Set(cursos.map((c) => c.grado))].sort(), []);
  const secciones = useMemo(() => [...new Set(cursos.map((c) => c.seccion))].sort(), []);

  const filtrados = useMemo(() => {
    let result = cursos;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter((c) => c.nombre.toLowerCase().includes(q) || c.grado.includes(q));
    }
    if (filtroGrado) result = result.filter((c) => c.grado === filtroGrado);
    if (filtroSeccion) result = result.filter((c) => c.seccion === filtroSeccion);
    return result;
  }, [busqueda, filtroGrado, filtroSeccion]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  function cambiarPagina(p: number) {
    if (p >= 1 && p <= totalPaginas) setPagina(p);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <div className="relative min-w-0 flex-[2] sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            placeholder="Buscar curso..."
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

          <div className="flex overflow-hidden rounded-lg border border-gray-200">
            <button
              onClick={() => setModo('grid')}
              className={`px-2.5 py-2 text-xs font-medium transition
                ${modo === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              ▦
            </button>
            <button
              onClick={() => setModo('lista')}
              className={`px-2.5 py-2 text-xs font-medium transition
                ${modo === 'lista' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {paginados.length === 0 ? (
        <div className="flex h-full min-h-[30vh] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
          <p className="text-sm text-gray-400">No se encontraron cursos con esos filtros.</p>
        </div>
      ) : modo === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginados.map((curso, i) => (
            <CardCursoDocente
              key={`${curso.nombre}-${curso.grado}-${curso.seccion}-${i}`}
              curso={curso}
              modo="grid"
              onClick={() => setCursoSeleccionado(curso)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {paginados.map((curso, i) => (
            <CardCursoDocente
              key={`${curso.nombre}-${curso.grado}-${curso.seccion}-${i}`}
              curso={curso}
              modo="lista"
              onClick={() => setCursoSeleccionado(curso)}
            />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => cambiarPagina(pagina - 1)}
            disabled={pagina === 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
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
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {cursoSeleccionado && (
        <SidebarCurso
          curso={cursoSeleccionado}
          isOpen={true}
          onClose={() => setCursoSeleccionado(null)}
        />
      )}
    </div>
  );
}
