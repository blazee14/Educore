import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { misAsignaciones, type CursoConProfesor } from '../../api/docente.api';
import { IconBook, IconUsers, IconCalendar, IconTrendingUp } from '../../components/icons';

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

const NOMBRES_DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const NOMBRES_MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function formatearHora(hora: string): string {
  const [h] = hora.split(':').map(Number);
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12} ${ampm}`;
}

function diffHoras(inicio: string, fin: string): number {
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fin.split(':').map(Number);
  return (hf + mf / 60) - (hi + mi / 60);
}

export function DashboardDocentePage() {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState('');
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseHorario | null>(null);

  useEffect(() => {
    misAsignaciones()
      .then((data: CursoConProfesor[]) => {
        if (data.length > 0) setProfesor(data[0].profesor);
      })
      .catch(() => {});
  }, []);

  const hoy = useMemo(() => {
    const d = new Date();
    const diaSemana = d.getDay();
    const diaMes = d.getDate();
    const mes = NOMBRES_MESES[d.getMonth()];
    const anio = d.getFullYear();
    const diaNombre = NOMBRES_DIAS[diaSemana];
    const diaIdx = diaSemana === 0 || diaSemana === 6 ? -1 : diaSemana - 1;
    return { diaNombre, diaMes, mes, anio, diaIdx };
  }, []);

  const clasesHoy = useMemo(
    () => clases.filter((c) => c.dia === hoy.diaIdx).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    [hoy.diaIdx],
  );

  const totalHoras = clasesHoy.reduce((sum, c) => sum + diffHoras(c.horaInicio, c.horaFin), 0);

  if (hoy.diaIdx === -1) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-semibold text-gray-700">¡Es fin de semana!</p>
        <p className="text-sm text-gray-400">Disfruta tu descanso, {profesor || 'Docente'}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-bold text-gray-800">Buenos días, {profesor || 'Docente'}</p>
          <p className="text-sm text-gray-400">
            {hoy.diaNombre}, {hoy.diaMes} de {hoy.mes} de {hoy.anio}
          </p>
        </div>
      </div>

      {/* Contenido: Agenda + Stats */}
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Agenda de hoy */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-sm font-semibold text-gray-700">
              Agenda de hoy <span className="font-normal text-gray-400">({clasesHoy.length} clases)</span>
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {clasesHoy.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">No tienes clases programadas para hoy.</p>
            ) : (
              clasesHoy.map((clase) => (
                <button
                  key={clase.id}
                  onClick={() => setClaseSeleccionada(clase)}
                  className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-700">{formatearHora(clase.horaInicio)}</p>
                    <div className="my-1 h-8 w-0.5 rounded-full" style={{ backgroundColor: clase.color }} />
                    <p className="text-xs text-gray-400">{formatearHora(clase.horaFin)}</p>
                  </div>
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
                    style={{ backgroundColor: clase.color }}
                  >
                    {clase.curso.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{clase.curso}</p>
                    <p className="text-xs text-gray-500">
                      {clase.grado} &quot;{clase.seccion}&quot; · {clase.nivel}
                    </p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 lg:w-72">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <IconBook className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Clases hoy</p>
              <p className="text-lg font-bold text-gray-800">{clasesHoy.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <IconTrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Horas lectivas</p>
              <p className="text-lg font-bold text-gray-800">{totalHoras.toFixed(1)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <IconUsers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Asistencia promedio</p>
              <p className="text-lg font-bold text-gray-800">--</p>
            </div>
          </div>

          {/* Acceso rápido */}
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/docente/cursos')}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <IconCalendar className="h-4 w-4 text-primary" />
              Ir a Mis Cursos
            </button>
            <button
              onClick={() => navigate('/docente/estudiantes')}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <IconUsers className="h-4 w-4 text-primary" />
              Ver Estudiantes
            </button>
            <button
              onClick={() => navigate('/docente/horario')}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <IconBook className="h-4 w-4 text-primary" />
              Ver Horario Completo
            </button>
          </div>
        </div>
      </div>

      {/* Modal detalle de clase */}
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
