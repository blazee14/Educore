import { useState, useEffect, useCallback } from 'react';

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const STORAGE_KEY = 'educore-calendario';

const tiposEvento = [
  { valor: 'examen', label: 'Examen', color: '#fecaca', border: '#fca5a5' },
  { valor: 'tarea', label: 'Tarea', color: '#bfdbfe', border: '#93c5fd' },
  { valor: 'evento', label: 'Evento personal', color: '#bbf7d0', border: '#86efac' },
  { valor: 'feriado', label: 'Feriado', color: '#fed7aa', border: '#fdba74' },
  { valor: 'recordatorio', label: 'Recordatorio', color: '#e9d5ff', border: '#d8b4fe' },
];

interface Evento {
  id: string;
  fecha: string;
  nombre: string;
  tipo: string;
}

function generarId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function formatearFecha(dia: number, mes: number, anio: number) {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function obtenerEventosStorage(): Evento[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function guardarEventosStorage(eventos: Evento[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
}

export function CalendarioPage() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [modal, setModal] = useState<'agregar' | 'editar' | 'confirmar-eliminar' | null>(null);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [eventoEliminando, setEventoEliminando] = useState<Evento | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);

  useEffect(() => {
    setEventos(obtenerEventosStorage());
  }, []);

  useEffect(() => {
    if (eventos.length || localStorage.getItem(STORAGE_KEY)) {
      guardarEventosStorage(eventos);
    }
  }, [eventos]);

  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  const irHoy = useCallback(() => {
    const ahora = new Date();
    setMes(ahora.getMonth());
    setAnio(ahora.getFullYear());
  }, []);

  function irMesAnterior() {
    if (mes === 0) { setMes(11); setAnio((a) => a - 1); }
    else { setMes((m) => m - 1); }
  }

  function irMesSiguiente() {
    if (mes === 11) { setMes(0); setAnio((a) => a + 1); }
    else { setMes((m) => m + 1); }
  }

  function esHoy(dia: number) {
    return dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();
  }

  function esDiaSeleccionado(dia: number) {
    return dia === diaSeleccionado;
  }

  function eventosDelDia(dia: number) {
    const fecha = formatearFecha(dia, mes, anio);
    return eventos.filter((e) => e.fecha === fecha);
  }

  function alClicDia(dia: number) {
    setDiaSeleccionado(dia);
    setPanelAbierto(true);
  }

  function abrirAgregar() {
    setEventoEditando(null);
    setModal('agregar');
  }

  function abrirEditar(evento: Evento) {
    setEventoEditando({ ...evento });
    setModal('editar');
  }

  function confirmarEliminar(evento: Evento) {
    setEventoEliminando(evento);
    setModal('confirmar-eliminar');
  }

  function guardarEvento(nuevo: Evento) {
    setEventos((prev) => [...prev, { ...nuevo, id: generarId() }]);
    setModal(null);
  }

  function actualizarEvento(actualizado: Evento) {
    setEventos((prev) => prev.map((e) => (e.id === actualizado.id ? actualizado : e)));
    setModal(null);
  }

  function eliminarEvento() {
    if (!eventoEliminando) return;
    setEventos((prev) => prev.filter((e) => e.id !== eventoEliminando.id));
    setEventoEliminando(null);
    setModal(null);
  }

  function obtenerFechaSeleccionada() {
    if (diaSeleccionado === null) return '';
    return formatearFecha(diaSeleccionado, mes, anio);
  }

  const eventosDia = diaSeleccionado !== null ? eventosDelDia(diaSeleccionado) : [];

  const fechaLabel = diaSeleccionado !== null
    ? `${diaSeleccionado} de ${meses[mes]} de ${anio}`
    : '';

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className={`flex flex-col gap-4 ${panelAbierto ? 'lg:w-[calc(100%-320px)]' : 'w-full'} min-w-0`}>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <button onClick={irMesAnterior} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
              &larr; Anterior
            </button>
            <div className="flex items-center gap-2">
              <button onClick={irHoy} className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5">
                Hoy
              </button>
              <h2 className="text-lg font-bold text-gray-800">{meses[mes]} {anio}</h2>
            </div>
            <button onClick={irMesSiguiente} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
              Siguiente &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {diasSemana.map((d) => (
              <div key={d} className="bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-gray-500">
                {d}
              </div>
            ))}
            {Array.from({ length: primerDia }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white min-h-[90px] p-1 sm:min-h-[100px]" />
            ))}
            {Array.from({ length: totalDias }, (_, i) => i + 1).map((dia) => {
              const evts = eventosDelDia(dia);
              const seleccionado = esDiaSeleccionado(dia);
              const hoyClass = esHoy(dia);
              return (
                <button
                  key={dia}
                  onClick={() => alClicDia(dia)}
                  className={`bg-white min-h-[90px] p-1 text-left text-sm transition
                    hover:bg-blue-50/50 sm:min-h-[100px]
                    ${seleccionado ? 'ring-2 ring-primary ring-inset bg-blue-50/30' : ''}`}
                >
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                    ${hoyClass ? 'bg-primary text-white' : 'text-gray-600'}
                    ${seleccionado && !hoyClass ? 'bg-primary/10 text-primary' : ''}`}>
                    {dia}
                  </span>
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    {evts.slice(0, 2).map((e) => {
                      const t = tiposEvento.find((te) => te.valor === e.tipo) ?? tiposEvento[0];
                      return (
                        <span
                          key={e.id}
                          className="truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight"
                          style={{ backgroundColor: t.color, border: `1px solid ${t.border}`, color: '#1f2937' }}
                        >
                          {e.nombre}
                        </span>
                      );
                    })}
                    {evts.length > 2 && (
                      <span className="text-[10px] text-gray-400">+{evts.length - 2} más</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          {tiposEvento.map((t) => (
            <div key={t.valor} className="flex items-center gap-1.5 text-sm text-gray-600">
              <span className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: t.color, border: `1px solid ${t.border}` }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {panelAbierto && diaSeleccionado !== null && (
        <div className="w-full shrink-0 lg:w-80">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Eventos del {fechaLabel}</h3>
              <button
                onClick={() => { setPanelAbierto(false); setDiaSeleccionado(null); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={abrirAgregar}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                + Agregar
              </button>
            </div>

            {eventosDia.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">Sin eventos este día</p>
            ) : (
              <div className="flex flex-col gap-2">
                {eventosDia.map((e) => {
                  const t = tiposEvento.find((te) => te.valor === e.tipo) ?? tiposEvento[0];
                  return (
                    <div
                      key={e.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{ backgroundColor: t.color, borderColor: t.border }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{e.nombre}</p>
                        <p className="text-xs text-gray-500">{t.label}</p>
                      </div>
                      <button
                        onClick={() => abrirEditar(e)}
                        className="ml-2 shrink-0 rounded p-1.5 text-gray-500 hover:bg-white/50"
                        title="Editar evento"
                      >
                        ✏️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {modal === 'agregar' && (
        <ModalEvento
          titulo="Agregar Evento"
          fechaInicial={diaSeleccionado !== null ? obtenerFechaSeleccionada() : ''}
          onGuardar={guardarEvento}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal === 'editar' && eventoEditando && (
        <ModalEvento
          titulo="Editar Evento"
          evento={eventoEditando}
          onGuardar={actualizarEvento}
          onEliminar={() => confirmarEliminar(eventoEditando)}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal === 'confirmar-eliminar' && (
        <ModalConfirmar
          mensaje="¿Estás seguro de eliminar este evento?"
          onConfirmar={eliminarEvento}
          onCancelar={() => { setModal(null); setEventoEliminando(null); }}
        />
      )}
    </div>
  );
}

interface ModalEventoProps {
  titulo: string;
  fechaInicial?: string;
  evento?: Evento;
  onGuardar: (data: Evento) => void;
  onEliminar?: () => void;
  onCerrar: () => void;
}

function ModalEvento({ titulo, fechaInicial, evento, onGuardar, onEliminar, onCerrar }: ModalEventoProps) {
  const [fecha, setFecha] = useState(evento?.fecha ?? fechaInicial ?? '');
  const [nombre, setNombre] = useState(evento?.nombre ?? '');
  const [tipo, setTipo] = useState(evento?.tipo ?? 'examen');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha) { setError('Selecciona una fecha'); return; }
    if (!nombre.trim()) { setError('Escribe un nombre para el evento'); return; }
    setError(null);
    if (evento) {
      onGuardar({ ...evento, fecha, nombre: nombre.trim(), tipo });
    } else {
      onGuardar({ id: '', fecha, nombre: nombre.trim(), tipo });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCerrar}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold text-gray-800">{titulo}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Nombre del evento</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Examen de Matemáticas"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Color / Tipo</label>
            <div className="flex flex-wrap gap-2">
              {tiposEvento.map((t) => (
                <button
                  key={t.valor}
                  type="button"
                  onClick={() => setTipo(t.valor)}
                  className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm transition
                    ${tipo === t.valor ? '' : 'opacity-60 hover:opacity-100'}`}
                  style={{
                    backgroundColor: t.color,
                    borderColor: tipo === t.valor ? t.border : t.border + '60',
                  }}
                >
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: t.color, border: `1px solid ${t.border}` }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCerrar} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              {evento ? 'Guardar cambios' : 'Guardar'}
            </button>
            {onEliminar && (
              <button
                type="button"
                onClick={onEliminar}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

interface ModalConfirmarProps {
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

function ModalConfirmar({ mensaje, onConfirmar, onCancelar }: ModalConfirmarProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancelar}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="mb-6 text-sm text-gray-700">{mensaje}</p>
        <div className="flex gap-2">
          <button onClick={onCancelar} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
