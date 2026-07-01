// src/pages/estudiante/InicioPage.tsx
import { useEffect, useState } from 'react';
import { miPerfilEstudiante, type EstudianteConDetalle } from '../../api/estudiante.api';
import { miAsistencia, type ResumenAsistencia } from '../../api/asistencia.api';
import { IconBookOpen, IconCheckCircle, IconClipboard, IconChat, IconCalendar } from '../../components/icons';

const statsMock = [
  { icon: <IconBookOpen className="h-5 w-5" />, bg: 'bg-purple-50', color: 'text-purple-500', label: 'Promedio general', valor: '16.2', detalle: 'Buen rendimiento' },
  { icon: <IconClipboard className="h-5 w-5" />, bg: 'bg-orange-50', color: 'text-orange-500', label: 'Tareas pendientes', valor: '2', detalle: 'Ver tareas' },
  { icon: <IconChat className="h-5 w-5" />, bg: 'bg-blue-50', color: 'text-blue-500', label: 'Comunicados', valor: '3', detalle: 'Ver mensajes' },
];

const cursosMock = [
  { curso: 'Matemática', nota: 17.0, estado: 'Muy bueno' },
  { curso: 'Comunicación', nota: 15.5, estado: 'Bueno' },
  { curso: 'Ciencia y Tecnología', nota: 16.8, estado: 'Muy bueno' },
  { curso: 'Inglés', nota: 14.5, estado: 'Bueno' },
];

export function InicioPage() {
  const [perfil, setPerfil] = useState<EstudianteConDetalle | null>(null);
  const [asistencia, setAsistencia] = useState<ResumenAsistencia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      miPerfilEstudiante().catch(() => null),
      miAsistencia().catch(() => null),
    ]).then(([p, a]) => {
      setPerfil(p);
      setAsistencia(a);
    }).finally(() => setCargando(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statsMock.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <p className="mt-3 text-xs text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-800">{s.valor}</p>
            <p className="text-xs text-gray-400">{s.detalle}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-500">
            <IconCheckCircle className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs text-gray-500">Asistencia</p>
          <p className="text-xl font-bold text-gray-800">{asistencia ? `${asistencia.porcentajeAsistencia}%` : '--'}</p>
          <p className="text-xs text-gray-400">{asistencia ? `${asistencia.presentes} de ${asistencia.total} días` : 'Cargando...'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        {cargando ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : !perfil ? (
          <p className="text-sm text-gray-400">No se encontró tu información.</p>
        ) : (
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-600">
              {perfil.nombres[0]}{perfil.apellidos[0]}
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">{perfil.nombres} {perfil.apellidos}</p>
              <p className="mt-0.5 text-sm text-gray-500">
                {perfil.gradoNombre ? `${perfil.gradoNombre} "${perfil.seccionNombre}"` : 'Sin sección asignada'}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                <span>DNI: {perfil.dni}</span>
                <span>Correo: {perfil.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Mi rendimiento — Bimestre II</p>
          <span className="text-xs text-gray-400">(datos de ejemplo)</span>
        </div>
        <div className="flex flex-col gap-3">
          {cursosMock.map((c) => (
            <div key={c.curso} className="flex items-center gap-3">
              <span className="w-40 flex-none text-sm text-gray-600">{c.curso}</span>
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(c.nota / 20) * 100}%` }} />
              </div>
              <span className="w-10 flex-none text-right text-sm font-semibold text-gray-700">{c.nota}</span>
              <span className="w-24 flex-none rounded-full bg-blue-50 px-2 py-0.5 text-center text-[11px] font-medium text-blue-600">
                {c.estado}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <IconCalendar className="h-4 w-4 text-gray-400" />
          <p className="font-semibold text-gray-800">Próximos eventos</p>
          <span className="text-xs text-gray-400">(datos de ejemplo)</span>
        </div>
        <p className="text-sm text-gray-500">27 jun — Reunión de padres de familia, 5:00 p.m.</p>
        <p className="text-sm text-gray-500">02 jul — Entrega de boletas bimestrales</p>
      </div>
    </div>
  );
}