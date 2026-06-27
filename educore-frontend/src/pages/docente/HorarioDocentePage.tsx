import { useState } from 'react';

interface ClaseHorario {
  id: string;
  curso: string;
  color: string;
  profesor: string;
  grado: string;
  seccion: string;
  nivel: string;
  dia: number;
  horaInicio: string;
  horaFin: string;
}

const clases: ClaseHorario[] = [
  { id: '1',  curso: 'Educación Física',   color: '#84cc16', profesor: 'Roberto Díaz',     grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 0, horaInicio: '07:00', horaFin: '08:00' },
  { id: '2',  curso: 'Educación Física',   color: '#84cc16', profesor: 'Roberto Díaz',     grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 2, horaInicio: '07:00', horaFin: '08:00' },
  { id: '3',  curso: 'Educación Física',   color: '#84cc16', profesor: 'Roberto Díaz',     grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '07:00', horaFin: '08:00' },
  { id: '4',  curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 0, horaInicio: '08:00', horaFin: '09:00' },
  { id: '5',  curso: 'Comunicación',       color: '#eab308', profesor: 'María López',      grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 1, horaInicio: '08:00', horaFin: '09:00' },
  { id: '6',  curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 2, horaInicio: '08:00', horaFin: '09:00' },
  { id: '7',  curso: 'Comunicación',       color: '#eab308', profesor: 'María López',      grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 3, horaInicio: '08:00', horaFin: '09:00' },
  { id: '8',  curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '08:00', horaFin: '09:00' },
  { id: '9',  curso: 'Ciencia y Tecnología', color: '#22c55e', profesor: 'Carlos Ruiz',    grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 0, horaInicio: '09:00', horaFin: '10:00' },
  { id: '10', curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '3°', seccion: 'B', nivel: 'Primaria', dia: 1, horaInicio: '09:00', horaFin: '10:00' },
  { id: '11', curso: 'Ciencia y Tecnología', color: '#22c55e', profesor: 'Carlos Ruiz',    grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 2, horaInicio: '09:00', horaFin: '10:00' },
  { id: '12', curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '3°', seccion: 'B', nivel: 'Primaria', dia: 3, horaInicio: '09:00', horaFin: '10:00' },
  { id: '13', curso: 'Ciencia y Tecnología', color: '#22c55e', profesor: 'Carlos Ruiz',    grado: '3°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '09:00', horaFin: '10:00' },
  { id: '14', curso: 'Inglés',             color: '#a855f7', profesor: 'Peter Smith',      grado: '4°', seccion: 'A', nivel: 'Primaria', dia: 0, horaInicio: '10:00', horaFin: '11:00' },
  { id: '15', curso: 'Ciencia y Tecnología', color: '#22c55e', profesor: 'Carlos Ruiz',    grado: '5°', seccion: 'A', nivel: 'Primaria', dia: 1, horaInicio: '10:00', horaFin: '11:00' },
  { id: '16', curso: 'Inglés',             color: '#a855f7', profesor: 'Peter Smith',      grado: '4°', seccion: 'A', nivel: 'Primaria', dia: 2, horaInicio: '10:00', horaFin: '11:00' },
  { id: '17', curso: 'Ciencia y Tecnología', color: '#22c55e', profesor: 'Carlos Ruiz',    grado: '5°', seccion: 'A', nivel: 'Primaria', dia: 3, horaInicio: '10:00', horaFin: '11:00' },
  { id: '18', curso: 'Inglés',             color: '#a855f7', profesor: 'Peter Smith',      grado: '4°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '10:00', horaFin: '11:00' },
  { id: '19', curso: 'Personal Social',    color: '#f97316', profesor: 'Ana García',       grado: '3°', seccion: 'B', nivel: 'Primaria', dia: 0, horaInicio: '11:00', horaFin: '12:00' },
  { id: '20', curso: 'Inglés',             color: '#a855f7', profesor: 'Peter Smith',      grado: '5°', seccion: 'B', nivel: 'Primaria', dia: 1, horaInicio: '11:00', horaFin: '12:00' },
  { id: '21', curso: 'Personal Social',    color: '#f97316', profesor: 'Ana García',       grado: '3°', seccion: 'B', nivel: 'Primaria', dia: 2, horaInicio: '11:00', horaFin: '12:00' },
  { id: '22', curso: 'Inglés',             color: '#a855f7', profesor: 'Peter Smith',      grado: '5°', seccion: 'B', nivel: 'Primaria', dia: 3, horaInicio: '11:00', horaFin: '12:00' },
  { id: '23', curso: 'Arte y Cultura',     color: '#06b6d4', profesor: 'Lucía Torres',     grado: '5°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '11:00', horaFin: '12:00' },
  { id: '24', curso: 'Matemáticas',        color: '#ef4444', profesor: 'Juan Pérez',       grado: '4°', seccion: 'A', nivel: 'Primaria', dia: 0, horaInicio: '12:00', horaFin: '13:00' },
  { id: '25', curso: 'Religión',           color: '#7dd3fc', profesor: 'Sofía Mendoza',    grado: '2°', seccion: 'A', nivel: 'Primaria', dia: 1, horaInicio: '12:00', horaFin: '13:00' },
  { id: '26', curso: 'Comunicación',       color: '#eab308', profesor: 'María López',      grado: '4°', seccion: 'B', nivel: 'Primaria', dia: 2, horaInicio: '12:00', horaFin: '13:00' },
  { id: '27', curso: 'Religión',           color: '#7dd3fc', profesor: 'Sofía Mendoza',    grado: '2°', seccion: 'B', nivel: 'Primaria', dia: 3, horaInicio: '12:00', horaFin: '13:00' },
  { id: '28', curso: 'Religión',           color: '#7dd3fc', profesor: 'Sofía Mendoza',    grado: '2°', seccion: 'A', nivel: 'Primaria', dia: 4, horaInicio: '12:00', horaFin: '13:00' },
];

const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

function formatearHora(hora: string): string {
  const [h] = hora.split(':').map(Number);
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12} ${ampm}`;
}

export function HorarioDocentePage() {
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseHorario | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-20 px-3 py-3 text-left text-xs font-semibold text-gray-400">Hora</th>
                {dias.map((d) => (
                  <th key={d} className="px-2 py-3 text-center text-xs font-semibold text-gray-500">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora} className="border-t border-gray-100">
                  <td className="px-3 py-2 align-top pt-3 text-xs font-medium text-gray-400">
                    {formatearHora(hora)}
                  </td>
                  {dias.map((_, diaIdx) => {
                    const clase = clases.find(
                      (c) => c.dia === diaIdx && c.horaInicio === hora,
                    );
                    return (
                      <td key={diaIdx} className="px-1.5 py-1.5">
                        {clase ? (
                          <button
                            onClick={() => setClaseSeleccionada(clase)}
                            className="flex w-full items-center gap-2 rounded-xl border-2 p-2 text-left transition hover:shadow-md"
                            style={{
                              borderColor: clase.color,
                              backgroundColor: clase.color + '0d',
                            }}
                          >
                            <div
                              className="h-10 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: clase.color }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold leading-tight text-gray-800 truncate">
                                {clase.curso}
                              </p>
                              <p className="mt-0.5 text-[10px] leading-tight text-gray-500">
                                {clase.grado} &quot;{clase.seccion}&quot;
                              </p>
                            </div>
                          </button>
                        ) : (
                          <div className="flex h-full min-h-[56px] items-center justify-center rounded-xl bg-gray-50">
                            <span className="text-xs text-gray-300">&mdash;</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {claseSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setClaseSeleccionada(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            style={{ border: `2px solid ${claseSeleccionada.color}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: claseSeleccionada.color + '20' }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ color: claseSeleccionada.color }}
                >
                  {claseSeleccionada.curso.charAt(0)}
                </span>
              </div>
            </div>

            <h3 className="mb-5 mt-4 text-center text-xl font-bold text-gray-800">
              {claseSeleccionada.curso}
            </h3>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Profesor:</span>{' '}
                {claseSeleccionada.profesor}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Grado / Sección:</span>{' '}
                {claseSeleccionada.grado} &quot;{claseSeleccionada.seccion}&quot; &ndash;{' '}
                {claseSeleccionada.nivel}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Horario:</span>{' '}
                {formatearHora(claseSeleccionada.horaInicio)} &ndash;{' '}
                {formatearHora(claseSeleccionada.horaFin)}
              </p>
            </div>

            <button
              onClick={() => setClaseSeleccionada(null)}
              className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
