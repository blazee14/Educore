import { useState, useEffect, useCallback } from 'react';
import { ModalActividad, type Actividad, type TipoActividad } from './ModalActividad';
import type { Curso } from '../api/cursos.api';

interface Props {
  curso: Curso & { profesorEmail?: string };
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'contenido' | 'calendario' | 'asistencia' | 'calificaciones';

const STORAGE_PREFIX = 'educore-actividades-';
const ASISTENCIA_STORAGE_PREFIX = 'educore-asistencia-';
const CALIFICACIONES_STORAGE_PREFIX = 'educore-calificaciones-';

type EstadoAsistencia = 'ASISTIO' | 'FALTO' | 'JUSTIFICADO' | 'TARDANZA';

interface AsistenciaAlumno {
  id: string;
  nombres: string;
  apellidos: string;
}

const estudiantesMock: AsistenciaAlumno[] = [
  { id: 's1', nombres: 'Juan', apellidos: 'Pérez' },
  { id: 's2', nombres: 'María', apellidos: 'García' },
  { id: 's3', nombres: 'Carlos', apellidos: 'López' },
  { id: 's4', nombres: 'Ana', apellidos: 'Torres' },
  { id: 's5', nombres: 'Luis', apellidos: 'Mendoza' },
  { id: 's6', nombres: 'Sofía', apellidos: 'Ríos' },
  { id: 's7', nombres: 'Diego', apellidos: 'Castro' },
  { id: 's8', nombres: 'Valentina', apellidos: 'Ruiz' },
  { id: 's9', nombres: 'Mateo', apellidos: 'Flores' },
  { id: 's10', nombres: 'Lucía', apellidos: 'Álvarez' },
];

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatearFecha(dia: number, mes: number, anio: number) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

const TIPO_ICON: Record<TipoActividad, string> = {
  PRACTICA: '📝',
  EXAMEN: '📄',
  TRABAJO_GRUPAL: '💼',
};

const TIPO_LABEL: Record<TipoActividad, string> = {
  PRACTICA: 'Prácticas',
  EXAMEN: 'Exámenes',
  TRABAJO_GRUPAL: 'Trabajos grupales',
};

const GRUPOS: TipoActividad[] = ['PRACTICA', 'EXAMEN', 'TRABAJO_GRUPAL'];

const actividadesMock: Actividad[] = [
  { id: 'm1', tipo: 'PRACTICA', nombre: 'Práctica 1', fecha: '2026-06-15' },
  { id: 'm2', tipo: 'PRACTICA', nombre: 'Práctica 2', fecha: '2026-06-22' },
  { id: 'm3', tipo: 'EXAMEN', nombre: 'Examen 1/2 Semestre', fecha: '2026-07-10' },
  { id: 'm4', tipo: 'TRABAJO_GRUPAL', nombre: 'Trabajo de investigación', fecha: '2026-06-28' },
];

function obtenerActividades(cursoKey: string): Actividad[] {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + cursoKey);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return actividadesMock;
}

function guardarActividades(cursoKey: string, data: Actividad[]) {
  localStorage.setItem(STORAGE_PREFIX + cursoKey, JSON.stringify(data));
}

export function SidebarCurso({ curso, isOpen, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('contenido');
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [expandidos, setExpandidos] = useState<Set<TipoActividad>>(new Set(['PRACTICA']));
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Actividad | null>(null);
  const [tipoModal, setTipoModal] = useState<TipoActividad>('PRACTICA');
  const [mesCal, setMesCal] = useState(new Date().getMonth());
  const [anioCal, setAnioCal] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().split('T')[0]);
  const [asistencia, setAsistencia] = useState<Record<string, EstadoAsistencia>>({});
  const [estudianteHistorial, setEstudianteHistorial] = useState<AsistenciaAlumno | null>(null);
  const [calificaciones, setCalificaciones] = useState<Record<string, number>>({});
  const [estudianteCalif, setEstudianteCalif] = useState<AsistenciaAlumno | null>(null);

  const cursoKey = `${curso.nombre}-${curso.grado}-${curso.seccion}`.replace(/\s+/g, '_');

  function getEstudiantesCurso(): AsistenciaAlumno[] {
    const hash = cursoKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const start = hash % 7;
    return estudiantesMock.slice(start, start + 5);
  }

  function getNotaMock(estId: string, actId: string): number {
    let h = 0;
    for (let i = 0; i < estId.length; i++) h = ((h << 5) - h) + estId.charCodeAt(i);
    for (let i = 0; i < actId.length; i++) h = ((h << 5) - h) + actId.charCodeAt(i);
    return (Math.abs(h) % 16) + 5;
  }

  function getCalificacionesCurso(): Record<string, number> {
    try {
      const stored = localStorage.getItem(CALIFICACIONES_STORAGE_PREFIX + cursoKey);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    const cal: Record<string, number> = {};
    const acts = obtenerActividades(cursoKey);
    const ests = getEstudiantesCurso();
    for (const est of ests) {
      for (const act of acts) {
        cal[`${est.id}-${act.id}`] = getNotaMock(est.id, act.id);
      }
    }
    return cal;
  }

  useEffect(() => {
    if (isOpen) {
      setActividades(obtenerActividades(cursoKey));
      setTab('contenido');
      const ahora = new Date();
      setMesCal(ahora.getMonth());
      setAnioCal(ahora.getFullYear());
      setDiaSeleccionado(null);
      const fechaHoy = ahora.toISOString().split('T')[0];
      setFechaAsistencia(fechaHoy);
      try {
        const stored = localStorage.getItem(ASISTENCIA_STORAGE_PREFIX + cursoKey + '-' + fechaHoy);
        setAsistencia(stored ? JSON.parse(stored) : {});
      } catch {
        setAsistencia({});
      }
      setCalificaciones(getCalificacionesCurso());
    }
  }, [isOpen, cursoKey]);

  useEffect(() => {
    if (isOpen && actividades.length) {
      guardarActividades(cursoKey, actividades);
    }
  }, [actividades, isOpen, cursoKey]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(ASISTENCIA_STORAGE_PREFIX + cursoKey + '-' + fechaAsistencia, JSON.stringify(asistencia));
    }
  }, [asistencia, isOpen, cursoKey, fechaAsistencia]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(CALIFICACIONES_STORAGE_PREFIX + cursoKey, JSON.stringify(calificaciones));
    }
  }, [calificaciones, isOpen, cursoKey]);

  const toggleGrupo = useCallback((tipo: TipoActividad) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(tipo)) next.delete(tipo);
      else next.add(tipo);
      return next;
    });
  }, []);

  function abrirAgregar(tipo: TipoActividad) {
    setEditando(null);
    setTipoModal(tipo);
    setModalOpen(true);
  }

  function abrirEditar(act: Actividad) {
    setEditando(act);
    setTipoModal(act.tipo);
    setModalOpen(true);
  }

  function guardarActividad(data: Actividad) {
    setActividades((prev) => {
      const idx = prev.findIndex((a) => a.id === data.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = data;
        return copy;
      }
      return [...prev, data];
    });
    setModalOpen(false);
  }

  function getProfesorApellidos(): string {
    const parts = (curso.profesor || '').split(' ');
    return parts.slice(0, 2).join(' ') || curso.profesor || 'Docente';
  }

  const iniciales = (curso.profesor || 'Docente')
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'contenido', label: 'Contenido' },
    { key: 'calendario', label: 'Calendario' },
    { key: 'asistencia', label: 'Asistencia' },
    { key: 'calificaciones', label: 'Calificaciones' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-4xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: curso.color }}
            >
              {curso.nombre.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{curso.nombre}</p>
              <p className="text-xs text-gray-500">
                {curso.grado} &quot;{curso.seccion}&quot; &ndash; {curso.nivel}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-4 py-3 text-xs font-medium transition
                ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'contenido' && (
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Columna izquierda — Profesor */}
              <div className="flex flex-col items-center gap-3 md:w-56">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
                  style={{ backgroundColor: curso.color }}
                >
                  {iniciales}
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-800">{getProfesorApellidos()}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>📧</span>
                  <span>{curso.profesorEmail || 'docente@educore.test'}</span>
                </div>
              </div>

              {/* Columna derecha — Actividades */}
              <div className="flex-1 space-y-4">
                {GRUPOS.map((tipo) => {
                  const items = actividades.filter((a) => a.tipo === tipo);
                  const abierto = expandidos.has(tipo);
                  return (
                    <div key={tipo} className="rounded-xl border border-gray-200">
                      <button
                        onClick={() => toggleGrupo(tipo)}
                        className="flex w-full items-center justify-between rounded-t-xl px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {TIPO_LABEL[tipo]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={(e) => { e.stopPropagation(); abrirAgregar(tipo); }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20"
                          >
                            +
                          </span>
                          <span className={`text-xs text-gray-400 transition ${abierto ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </button>
                      {abierto && (
                        <div className="border-t border-gray-100 px-4 py-2">
                          {items.length === 0 ? (
                            <p className="py-3 text-center text-xs text-gray-400">
                              Sin actividades. Presiona + para agregar.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {items.map((act) => (
                                <div
                                  key={act.id}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="shrink-0 text-sm">{TIPO_ICON[act.tipo]}</span>
                                    <span className="text-sm font-medium text-gray-700 truncate">{act.nombre}</span>
                                    <span className="shrink-0 text-xs text-gray-400">
                                      {new Date(act.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => abrirEditar(act)}
                                    className="shrink-0 rounded p-1 text-gray-400 hover:text-gray-600"
                                    title="Editar actividad"
                                  >
                                    ✏️
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'calendario' && (() => {
            const totalDias = new Date(anioCal, mesCal + 1, 0).getDate();
            const eventosCal = actividades.map((a) => ({
              fecha: a.fecha,
              nombre: a.nombre,
            }));
            function eventosDelDia(dia: number) {
              const fecha = formatearFecha(dia, mesCal, anioCal);
              return eventosCal.filter((e) => e.fecha === fecha);
            }
            function esFinde(dia: number) {
              const d = new Date(anioCal, mesCal, dia).getDay();
              return d === 0 || d === 6;
            }
            const offset = Math.min((new Date(anioCal, mesCal, 1).getDay() + 6) % 7, 5);
            const weekdays = Array.from({ length: totalDias }, (_, i) => i + 1).filter((d) => !esFinde(d));
            const trailing = (5 - ((offset + weekdays.length) % 5)) % 5;
            return (
              <div className="flex flex-col gap-5">
                {/* Navegación */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { if (mesCal === 0) { setMesCal(11); setAnioCal((a) => a - 1); } else { setMesCal((m) => m - 1); } setDiaSeleccionado(null); }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    &larr;
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { const ahora = new Date(); setMesCal(ahora.getMonth()); setAnioCal(ahora.getFullYear()); setDiaSeleccionado(null); }}
                      className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                    >
                      Hoy
                    </button>
                    <h3 className="text-base font-bold text-gray-800">{meses[mesCal]} {anioCal}</h3>
                  </div>
                  <button
                    onClick={() => { if (mesCal === 11) { setMesCal(0); setAnioCal((a) => a + 1); } else { setMesCal((m) => m + 1); } setDiaSeleccionado(null); }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    &rarr;
                  </button>
                </div>

                {/* Cuadrícula de días (Lun–Vie) */}
                <div className="grid grid-cols-5 gap-px bg-gray-200 rounded-lg overflow-hidden">
                  {diasSemana.map((d) => (
                    <div key={d} className="bg-gray-50 px-1 py-2 text-center text-xs font-semibold text-gray-500">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`e-${i}`} className="bg-white min-h-[72px] p-1" />
                  ))}
                  {weekdays.map((dia) => {
                    const evts = eventosDelDia(dia);
                    const esHoy = dia === new Date().getDate() && mesCal === new Date().getMonth() && anioCal === new Date().getFullYear();
                    const seleccionado = dia === diaSeleccionado;
                    return (
                      <button
                        key={dia}
                        onClick={() => setDiaSeleccionado(diaSeleccionado === dia ? null : dia)}
                        className={`bg-white min-h-[72px] p-1.5 text-left text-sm transition hover:bg-gray-50
                          ${seleccionado ? 'ring-2 ring-primary ring-inset bg-blue-50/30' : ''}`}
                      >
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium
                          ${esHoy ? 'bg-primary text-white' : 'text-gray-600'}
                          ${seleccionado && !esHoy ? 'bg-primary/10 text-primary' : ''}`}>
                          {dia}
                        </span>
                        {evts.length > 0 && (
                          <div className="mt-1 flex flex-col gap-0.5">
                            {evts.slice(0, 2).map((e, i) => (
                              <span key={i} className="truncate rounded bg-gray-100 px-1 py-0.5 text-[10px] font-medium leading-tight text-gray-600">
                                {e.nombre}
                              </span>
                            ))}
                            {evts.length > 2 && (
                              <span className="text-[10px] text-gray-400">+{evts.length - 2} más</span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {Array.from({ length: trailing }).map((_, i) => (
                    <div key={`t-${i}`} className="bg-white min-h-[72px] p-1" />
                  ))}
                </div>

                {/* Eventos del día seleccionado */}
                {diaSeleccionado !== null && (() => {
                  const evts = eventosDelDia(diaSeleccionado);
                  return (
                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-600">
                        {diaSeleccionado} de {meses[mesCal]}
                      </p>
                      {evts.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">Sin actividades este día</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {evts.map((e, i) => (
                            <div key={`${e.nombre}-${i}`} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                              {e.nombre}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {tab === 'asistencia' && (() => {
            const estudiantes = getEstudiantesCurso();
            function cambiarEstado(id: string, estado: EstadoAsistencia) {
              setAsistencia((prev) => ({ ...prev, [id]: estado }));
            }
            function cargarFecha(fecha: string) {
              const d = new Date(fecha + 'T00:00:00');
              if (d.getDay() === 0 || d.getDay() === 6) return;
              setFechaAsistencia(fecha);
              try {
                const stored = localStorage.getItem(ASISTENCIA_STORAGE_PREFIX + cursoKey + '-' + fecha);
                setAsistencia(stored ? JSON.parse(stored) : {});
              } catch {
                setAsistencia({});
              }
            }
            return (
              <div className="flex flex-col gap-4">
                {/* Selector de fecha */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Fecha:</label>
                  <input
                    type="date"
                    value={fechaAsistencia}
                    onChange={(e) => cargarFecha(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-xs text-gray-400">(Solo Lun–Vie)</span>
                </div>

                {/* Lista de estudiantes */}
                {estudiantes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">No hay estudiantes en este curso</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {estudiantes.map((est) => {
                      const estado = asistencia[est.id] || 'ASISTIO';
                      return (
                        <div
                          key={est.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3"
                        >
                          {/* Avatar + Nombre (click → historial) */}
                          <button
                            onClick={() => setEstudianteHistorial(est)}
                            className="flex items-center gap-3 min-w-0 flex-1 text-left"
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                              style={{ backgroundColor: curso.color }}
                            >
                              {est.nombres.charAt(0)}{est.apellidos.charAt(0)}
                            </div>
                            <p className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                              {est.nombres} {est.apellidos}
                            </p>
                          </button>
                          {/* Select */}
                          <select
                            value={estado}
                            onChange={(e) => cambiarEstado(est.id, e.target.value as EstadoAsistencia)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none
                              ${estado === 'ASISTIO' ? 'border-green-300 bg-green-50 text-green-700' : ''}
                              ${estado === 'FALTO' ? 'border-red-300 bg-red-50 text-red-700' : ''}
                              ${estado === 'JUSTIFICADO' ? 'border-blue-300 bg-blue-50 text-blue-700' : ''}
                              ${estado === 'TARDANZA' ? 'border-amber-300 bg-amber-50 text-amber-700' : ''}`}
                          >
                            <option value="ASISTIO">Asistió</option>
                            <option value="FALTO">Faltó</option>
                            <option value="JUSTIFICADO">Justificado</option>
                            <option value="TARDANZA">Tardanza</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {tab === 'calificaciones' && (() => {
            const estudiantes = getEstudiantesCurso();
            function promedioEstudiante(estId: string): number {
              const acts = actividades;
              const notas = acts.map((a) => calificaciones[`${estId}-${a.id}`]).filter((n) => n !== undefined);
              if (notas.length === 0) return 0;
              return notas.reduce((s, n) => s + n, 0) / notas.length;
            }
            function colorNota(n: number): string {
              if (n >= 14) return 'text-green-700 bg-green-50 border-green-200';
              if (n >= 11) return 'text-amber-700 bg-amber-50 border-amber-200';
              return 'text-red-700 bg-red-50 border-red-200';
            }
            return (
              <div className="flex flex-col gap-4">
                {estudiantes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">No hay estudiantes en este curso</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {estudiantes.map((est) => {
                      const prom = promedioEstudiante(est.id);
                      return (
                        <div
                          key={est.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3"
                        >
                          <button
                            onClick={() => setEstudianteCalif(est)}
                            className="flex items-center gap-3 min-w-0 flex-1 text-left"
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                              style={{ backgroundColor: curso.color }}
                            >
                              {est.nombres.charAt(0)}{est.apellidos.charAt(0)}
                            </div>
                            <p className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                              {est.nombres} {est.apellidos}
                            </p>
                          </button>
                          <div className={`rounded-xl border px-3 py-1 text-sm font-bold ${colorNota(prom)}`}>
                            {prom.toFixed(1)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <ModalActividad
        isOpen={modalOpen}
        actividad={editando}
        tipoInicial={tipoModal}
        onSave={guardarActividad}
        onDelete={editando ? () => { setActividades((prev) => prev.filter((a) => a.id !== editando.id)); setModalOpen(false); setEditando(null); } : undefined}
        onClose={() => { setModalOpen(false); setEditando(null); }}
      />

      {estudianteHistorial && (() => {
        const ESTADOS: EstadoAsistencia[] = ['ASISTIO', 'FALTO', 'JUSTIFICADO', 'TARDANZA'];
        const historial: { fecha: string; estado: EstadoAsistencia }[] = [];
        const hoy = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(hoy);
          d.setDate(d.getDate() - i);
          if (d.getDay() === 0 || d.getDay() === 6) continue;
          const dia = String(d.getDate()).padStart(2, '0');
          const mes = String(d.getMonth() + 1).padStart(2, '0');
          const anio = d.getFullYear();
          const fechaStr = `${anio}-${mes}-${dia}`;
          const idx = (estudianteHistorial.id.charCodeAt(1) + i) % ESTADOS.length;
          historial.push({ fecha: fechaStr, estado: ESTADOS[idx] });
        }
        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            onClick={() => setEstudianteHistorial(null)}
          >
            <div
              className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Historial de Asistencia</h3>
                <button
                  onClick={() => setEstudianteHistorial(null)}
                  className="text-lg text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ backgroundColor: curso.color }}
                >
                  {estudianteHistorial.nombres.charAt(0)}{estudianteHistorial.apellidos.charAt(0)}
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {estudianteHistorial.nombres} {estudianteHistorial.apellidos}
                </p>
              </div>

              <hr className="border-gray-100" />

              <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {historial.map((item) => {
                  const colorMap: Record<EstadoAsistencia, string> = {
                    ASISTIO: 'text-green-700 bg-green-50',
                    FALTO: 'text-red-700 bg-red-50',
                    JUSTIFICADO: 'text-blue-700 bg-blue-50',
                    TARDANZA: 'text-amber-700 bg-amber-50',
                  };
                  return (
                    <div
                      key={item.fecha}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-gray-600">
                        {new Date(item.fecha + 'T00:00:00').toLocaleDateString('es-PE', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[item.estado]}`}>
                        {item.estado === 'ASISTIO' && 'Asistió'}
                        {item.estado === 'FALTO' && 'Faltó'}
                        {item.estado === 'JUSTIFICADO' && 'Justificado'}
                        {item.estado === 'TARDANZA' && 'Tardanza'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setEstudianteHistorial(null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        );
      })()}

      {estudianteCalif && (() => {
        const est = estudianteCalif;
        const acts = actividades;
        const GRUPOS_CALIF: TipoActividad[] = ['PRACTICA', 'EXAMEN', 'TRABAJO_GRUPAL'];
        function promedio(): number {
          const notas = acts.map((a) => calificaciones[`${est.id}-${a.id}`]).filter((n) => n !== undefined);
          if (notas.length === 0) return 0;
          return notas.reduce((s, n) => s + n, 0) / notas.length;
        }
        function colorNota(n: number): string {
          if (n >= 14) return 'text-green-700 bg-green-50';
          if (n >= 11) return 'text-amber-700 bg-amber-50';
          return 'text-red-700 bg-red-50';
        }
        function colorBorde(n: number): string {
          if (n >= 14) return 'border-green-300';
          if (n >= 11) return 'border-amber-300';
          return 'border-red-300';
        }
        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            onClick={() => setEstudianteCalif(null)}
          >
            <div
              className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Calificaciones</h3>
                <button
                  onClick={() => setEstudianteCalif(null)}
                  className="text-lg text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ backgroundColor: curso.color }}
                >
                  {est.nombres.charAt(0)}{est.apellidos.charAt(0)}
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {est.nombres} {est.apellidos}
                </p>
              </div>

              <hr className="border-gray-100" />

              <div className="flex max-h-72 flex-col gap-4 overflow-y-auto">
                {GRUPOS_CALIF.map((tipo) => {
                  const items = acts.filter((a) => a.tipo === tipo);
                  if (items.length === 0) return null;
                  return (
                    <div key={tipo}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {TIPO_LABEL[tipo]}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {items.map((act) => {
                          const key = `${est.id}-${act.id}`;
                          const nota = calificaciones[key] ?? 0;
                          return (
                            <div
                              key={act.id}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${colorBorde(nota)}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm">{TIPO_ICON[act.tipo]}</span>
                                <span className="text-sm font-medium text-gray-700 truncate">{act.nombre}</span>
                                <span className="shrink-0 text-xs text-gray-400">
                                  {new Date(act.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })}
                                </span>
                              </div>
                              <input
                                type="number"
                                placeholder="0"
                                value={nota || ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === '') {
                                    setCalificaciones((prev) => ({ ...prev, [key]: 0 }));
                                    return;
                                  }
                                  const cleaned = raw.replace(/^0+/, '');
                                  let num = Number(cleaned);
                                  if (isNaN(num)) return;
                                  num = Math.max(0, Math.min(20, num));
                                  setCalificaciones((prev) => ({ ...prev, [key]: num }));
                                }}
                                className={`w-14 rounded-lg border px-2 py-1 text-center text-sm font-bold outline-none
                                  ${colorNota(nota)}
                                  ${colorBorde(nota).replace('border-', 'border-')}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Promedio final</span>
                <span className={`rounded-xl border-2 px-4 py-1.5 text-base font-bold ${colorNota(promedio())} ${colorBorde(promedio())}`}>
                  {promedio().toFixed(1)}
                </span>
              </div>

              <button
                onClick={() => setEstudianteCalif(null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}
