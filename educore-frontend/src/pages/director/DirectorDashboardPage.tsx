// src/pages/director/DirectorDashboardPage.tsx
// Dashboard del rol Dirección. Datos mock por ahora — se conectan a endpoints reales módulo por módulo.
import {
  IconUsers,
  IconGraduate,
  IconClipboard,
  IconFile,
  IconCard,
  IconShield,
  IconAlert,
  IconChat,
  IconCalendar,
} from '../../components/icons';

interface StatCard {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  valor: string;
  detalle: string;
  variacion: string;
  positivo: boolean;
}

const stats: StatCard[] = [
  { icon: <IconUsers className="h-5 w-5" />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', label: 'Estudiantes', valor: '1,245', detalle: 'Matriculados', variacion: '↑ 12.5% vs. año pasado', positivo: true },
  { icon: <IconGraduate className="h-5 w-5" />, iconBg: 'bg-green-50', iconColor: 'text-green-500', label: 'Docentes', valor: '78', detalle: 'Activos', variacion: '↑ 5.4% vs. año pasado', positivo: true },
  { icon: <IconUsers className="h-5 w-5" />, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', label: 'Asistencia general', valor: '92.5%', detalle: 'Promedio', variacion: '↑ 3.2% vs. ayer', positivo: true },
  { icon: <IconFile className="h-5 w-5" />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', label: 'Matrículas nuevas', valor: '15', detalle: 'Este mes', variacion: '↑ 25% vs. mes pasado', positivo: true },
  { icon: <IconCard className="h-5 w-5" />, iconBg: 'bg-red-50', iconColor: 'text-red-500', label: 'Pagos pendientes', valor: 'S/ 32,560', detalle: '16% del total', variacion: '↓ 4.3% vs. mes pasado', positivo: false },
  { icon: <IconShield className="h-5 w-5" />, iconBg: 'bg-teal-50', iconColor: 'text-teal-500', label: 'Incidencias abiertas', valor: '3', detalle: 'Casos', variacion: '↓ 25% vs. semana pasada', positivo: true },
];

const matriculasPorMes = [
  { mes: 'Ene', valor: 320 },
  { mes: 'Feb', valor: 880 },
  { mes: 'Mar', valor: 950 },
  { mes: 'Abr', valor: 780 },
  { mes: 'May', valor: 1080 },
  { mes: 'Jun', valor: 1180 },
  { mes: 'Jul', valor: 1670 },
];

const matriculasRecientes = [
  { codigo: 'MTR-2026-0015', iniciales: 'JP', nombre: 'Juan Pérez Gómez', grado: '5° Primaria A', fecha: '20/06/2026', estado: 'Registrado' },
  { codigo: 'MTR-2026-0014', iniciales: 'ML', nombre: 'María López Rojas', grado: '2° Secundaria B', fecha: '20/06/2026', estado: 'Registrado' },
  { codigo: 'MTR-2026-0013', iniciales: 'CR', nombre: 'Carlos Ramos Silva', grado: '1° Primaria C', fecha: '19/06/2026', estado: 'Pendiente' },
  { codigo: 'MTR-2026-0012', iniciales: 'AS', nombre: 'Ana Sofía Vargas', grado: '3° Secundaria A', fecha: '19/06/2026', estado: 'Registrado' },
  { codigo: 'MTR-2026-0011', iniciales: 'LG', nombre: 'Luis Gutiérrez Díaz', grado: '4° Primaria B', fecha: '18/06/2026', estado: 'Registrado' },
];

const alertas = [
  { icon: <IconAlert className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-50', titulo: '3 estudiantes sin apoderado registrado', detalle: 'Completar información', cantidad: 3 },
  { icon: <IconFile className="h-4 w-4 text-blue-500" />, bg: 'bg-blue-50', titulo: '5 documentos pendientes de revisión', detalle: 'Revisión requerida', cantidad: 5 },
  { icon: <IconCard className="h-4 w-4 text-green-500" />, bg: 'bg-green-50', titulo: '2 pagos vencidos', detalle: 'Total pendiente: S/ 1,450', cantidad: 2 },
  { icon: <IconUsers className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-50', titulo: '4 incidencias nuevas', detalle: 'Requieren seguimiento', cantidad: 4 },
  { icon: <IconFile className="h-4 w-4 text-amber-500" />, bg: 'bg-amber-50', titulo: '7 solicitudes pendientes', detalle: 'Por atender', cantidad: 7 },
];

const calendario = [
  { dia: 'JUN', numero: '23', titulo: 'Reunión de padres de familia', detalle: '6:00 p.m. - Auditorio Principal', estado: 'Hoy', estadoColor: 'bg-blue-100 text-blue-600' },
  { dia: 'JUN', numero: '25', titulo: 'Entrega de libretas - Bimestre II', detalle: '8:00 a.m. - Aulas', estado: 'Próximo', estadoColor: 'bg-gray-100 text-gray-500' },
  { dia: 'JUN', numero: '28', titulo: 'Feria de ciencias 2026', detalle: '9:00 a.m. - Patio central', estado: 'Próximo', estadoColor: 'bg-purple-100 text-purple-600' },
  { dia: 'JUL', numero: '05', titulo: 'Exámenes bimestrales', detalle: '7:30 a.m. - Aulas', estado: 'Próximo', estadoColor: 'bg-orange-100 text-orange-600' },
];

const accionesRapidas = [
  { icon: <IconFile className="h-4 w-4" />, label: 'Nueva matrícula', color: 'bg-primary text-white' },
  { icon: <IconUsers className="h-4 w-4" />, label: 'Buscar estudiante', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconChat className="h-4 w-4" />, label: 'Registrar comunicado', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconCard className="h-4 w-4" />, label: 'Generar reporte', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconCalendar className="h-4 w-4" />, label: 'Ver agenda', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconFile className="h-4 w-4" />, label: 'Subir documento', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconShield className="h-4 w-4" />, label: 'Registrar incidencia', color: 'bg-gray-100 text-gray-700' },
  { icon: <IconFile className="h-4 w-4" />, label: 'Solicitudes', color: 'bg-gray-100 text-gray-700' },
];

const resumenDia = [
  { label: 'Matrículas hoy', valor: '5' },
  { label: 'Asistencias hoy', valor: '1,148' },
  { label: 'Faltas hoy', valor: '97' },
  { label: 'Comunicados enviados', valor: '3' },
  { label: 'Documentos subidos', valor: '12' },
  { label: 'Incidencias registradas', valor: '1' },
];

function LineChart() {
  const width = 600;
  const height = 220;
  const padding = 30;
  const max = 2000;
  const puntos = matriculasPorMes.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (matriculasPorMes.length - 1);
    const y = height - padding - (d.valor / max) * (height - padding * 2);
    return { x, y, ...d };
  });
  const linea = puntos.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${puntos[0].x},${height - padding} ${linea} ${puntos[puntos.length - 1].x},${height - padding}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 500, 1000, 1500, 2000].map((val) => {
        const y = height - padding - (val / max) * (height - padding * 2);
        return (
          <g key={val}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={0} y={y + 4} fontSize="10" fill="#94a3b8">{val}</text>
          </g>
        );
      })}
      <polygon points={area} fill="#2D6CDF" opacity="0.08" />
      <polyline points={linea} fill="none" stroke="#2D6CDF" strokeWidth="2.5" />
      {puntos.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#2D6CDF" />
          <text x={p.x} y={height - 6} fontSize="11" fill="#64748b" textAnchor="middle">{p.mes}</text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart() {
  const primaria = 680;
  const secundaria = 565;
  const total = primaria + secundaria;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pctPrimaria = primaria / total;
  const offsetPrimaria = circ * (1 - pctPrimaria);

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-44 w-44">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#2D6CDF" strokeWidth="20" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke="#22C55E" strokeWidth="20"
          strokeDasharray={circ} strokeDashoffset={offsetPrimaria}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</p>
        <p className="text-xs text-gray-400">Total</p>
      </div>
    </div>
  );
}

export function DirectorDashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.iconBg} ${s.iconColor}`}>
              {s.icon}
            </div>
            <p className="mt-3 text-xs text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-800">{s.valor}</p>
            <p className="text-xs text-gray-400">{s.detalle}</p>
            <p className={`mt-1 text-xs font-medium ${s.positivo ? 'text-green-500' : 'text-red-500'}`}>
              {s.variacion}
            </p>
          </div>
        ))}
      </div>

      {/* Gráfico + matrículas recientes */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Resumen de matrículas</p>
            <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500">Este año</span>
          </div>
          <LineChart />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Matrículas recientes</p>
            <a href="#" className="text-xs font-medium text-primary">Ver todas</a>
          </div>
          <div className="flex flex-col gap-3">
            {matriculasRecientes.map((m) => (
              <div key={m.codigo} className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  {m.iniciales}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{m.nombre}</p>
                  <p className="text-xs text-gray-400">{m.grado}</p>
                </div>
                <span className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  m.estado === 'Registrado' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {m.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas + calendario + donut */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Alertas importantes</p>
            <a href="#" className="text-xs font-medium text-primary">Ver todas</a>
          </div>
          <div className="flex flex-col gap-3">
            {alertas.map((a) => (
              <div key={a.titulo} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${a.bg}`}>
                  {a.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{a.titulo}</p>
                  <p className="text-xs text-gray-400">{a.detalle}</p>
                </div>
                <span className="flex-none text-sm font-semibold text-gray-700">{a.cantidad}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Calendario institucional</p>
            <a href="#" className="text-xs font-medium text-primary">Ver calendario completo</a>
          </div>
          <div className="flex flex-col gap-3">
            {calendario.map((c) => (
              <div key={c.titulo} className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-none flex-col items-center justify-center rounded-lg bg-gray-50 text-center">
                  <p className="text-[10px] font-semibold uppercase text-gray-400">{c.dia}</p>
                  <p className="text-sm font-bold text-gray-700">{c.numero}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{c.titulo}</p>
                  <p className="text-xs text-gray-400">{c.detalle}</p>
                </div>
                <span className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-medium ${c.estadoColor}`}>
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <IconCalendar className="h-4 w-4" /> Ver todos los eventos
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Distribución por nivel</p>
            <a href="#" className="text-xs font-medium text-primary">Ver reporte completo</a>
          </div>
          <DonutChart />
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Primaria
              </span>
              <span className="font-medium text-gray-700">680 (54.6%)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Secundaria
              </span>
              <span className="font-medium text-gray-700">565 (45.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-3 font-semibold text-gray-800">Acciones rápidas</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {accionesRapidas.map((a) => (
            <button
              key={a.label}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-4 text-xs font-medium transition hover:opacity-90 ${a.color}`}
            >
              {a.icon}
              <span className="text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resumen del día */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-3 font-semibold text-gray-800">Resumen general del día</p>
        <div className="flex flex-wrap gap-6">
          {resumenDia.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{r.label}</span>
              <span className="text-base font-bold text-gray-800">{r.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}