import { useState, useEffect } from 'react';

export type TipoActividad = 'PRACTICA' | 'EXAMEN' | 'TRABAJO_GRUPAL';

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  nombre: string;
  fecha: string;
}

const TIPOS: { valor: TipoActividad; label: string }[] = [
  { valor: 'PRACTICA', label: 'Práctica' },
  { valor: 'EXAMEN', label: 'Examen' },
  { valor: 'TRABAJO_GRUPAL', label: 'Trabajo Grupal' },
];

interface Props {
  isOpen: boolean;
  actividad?: Actividad | null;
  tipoInicial?: TipoActividad;
  onSave: (data: Actividad) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function generarId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function ModalActividad({ isOpen, actividad, tipoInicial, onSave, onDelete, onClose }: Props) {
  const [tipo, setTipo] = useState<TipoActividad>(actividad?.tipo ?? tipoInicial ?? 'PRACTICA');
  const [nombre, setNombre] = useState(actividad?.nombre ?? '');
  const [fecha, setFecha] = useState(actividad?.fecha ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTipo(actividad?.tipo ?? tipoInicial ?? 'PRACTICA');
      setNombre(actividad?.nombre ?? '');
      setFecha(actividad?.fecha ?? '');
      setError(null);
    }
  }, [isOpen, actividad, tipoInicial]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError('Escribe un nombre'); return; }
    if (!fecha) { setError('Selecciona una fecha'); return; }
    setError(null);
    onSave({
      id: actividad?.id ?? generarId(),
      tipo,
      nombre: nombre.trim(),
      fecha,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          {actividad ? 'Editar Actividad' : 'Nueva Actividad'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Tipo</label>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.valor}
                  type="button"
                  onClick={() => setTipo(t.valor)}
                  className={`rounded-lg border-2 px-3 py-2 text-sm transition
                    ${tipo === t.valor ? 'border-primary bg-primary/10 font-medium text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Práctica 3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              {actividad ? 'Guardar cambios' : 'Crear'}
            </button>
            {onDelete && (
              <button type="button" onClick={onDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
