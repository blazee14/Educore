// src/pages/admin/DocentesPage.tsx
import { useEffect, useState } from 'react';
import {
  listarDocentes,
  crearDocente,
  asignarCurso,
  quitarAsignacion,
  eliminarDocente,
  type DocenteConDetalle,
  type CrearDocenteInput,
  type CredencialesDocente,
} from '../../api/docente.api';
import { seccionesDisponibles, listarCursos, type GradoConSecciones, type Curso } from '../../api/academico.api';

const ANIO_ESCOLAR = new Date().getFullYear();

const formVacio: CrearDocenteInput = { email: '', nombres: '', apellidos: '', dni: '', telefono: '' };

export function DocentesPage() {
  const [docentes, setDocentes] = useState<DocenteConDetalle[]>([]);
  const [grados, setGrados] = useState<GradoConSecciones[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<CrearDocenteInput>(formVacio);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CredencialesDocente | null>(null);
  const [asignando, setAsignando] = useState<string | null>(null);
  const [cursoSel, setCursoSel] = useState('');
  const [seccionSel, setSeccionSel] = useState('');

  async function cargar() {
    setCargando(true);
    try {
      setDocentes(await listarDocentes());
    } catch {
      setError('No se pudo cargar la lista de docentes');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    seccionesDisponibles(ANIO_ESCOLAR).then(setGrados).catch(() => {});
    listarCursos().then(setCursos).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const data = await crearDocente(form);
      setResultado(data);
      setForm(formVacio);
      setMostrarForm(false);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear el docente');
    } finally {
      setEnviando(false);
    }
  }

  async function handleAsignar(docenteId: string) {
    if (!cursoSel || !seccionSel) return;
    try {
      await asignarCurso(docenteId, cursoSel, seccionSel);
      setCursoSel('');
      setSeccionSel('');
      setAsignando(null);
      await cargar();
    } catch {
      setError('No se pudo asignar el curso');
    }
  }

  async function handleQuitarAsignacion(docenteId: string, asignacionId: string) {
    try {
      await quitarAsignacion(docenteId, asignacionId);
      await cargar();
    } catch {
      setError('No se pudo quitar la asignación');
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este docente y su cuenta de acceso?')) return;
    try {
      await eliminarDocente(id);
      await cargar();
    } catch {
      setError('No se pudo eliminar el docente');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{docentes.length} docentes registrados</p>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo docente'}
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      {resultado && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-700">
            Docente registrado: {resultado.docente.nombres} {resultado.docente.apellidos}
          </p>
          <p className="mt-2 text-sm text-green-700">Entrega estas credenciales — no se mostrarán de nuevo:</p>
          <div className="mt-2 rounded-lg bg-white p-3 text-sm">
            <p><span className="font-medium">Correo:</span> {resultado.credenciales.email}</p>
            <p><span className="font-medium">Contraseña temporal:</span> {resultado.credenciales.passwordTemporal}</p>
          </div>
          <button onClick={() => setResultado(null)} className="mt-3 text-sm font-medium text-green-700 underline">
            Cerrar
          </button>
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-5">
          <input required type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Teléfono" value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Nombres" value={form.nombres}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Apellidos" value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="DNI" value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
            className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" disabled={enviando}
            className="col-span-2 mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {enviando ? 'Guardando...' : 'Guardar docente'}
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {cargando ? (
          <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : docentes.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No hay docentes registrados aún.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {docentes.map((d) => (
              <div key={d.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{d.nombres} {d.apellidos}</p>
                    <p className="text-xs text-gray-400">{d.email} · DNI {d.dni}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setAsignando(asignando === d.id ? null : d.id)} className="text-xs font-medium text-primary hover:underline">
                      {asignando === d.id ? 'Cancelar' : '+ Asignar curso'}
                    </button>
                    <button onClick={() => handleEliminar(d.id)} className="text-xs font-medium text-red-500 hover:underline">
                      Eliminar
                    </button>
                  </div>
                </div>

                {d.asignaciones.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {d.asignaciones.map((a) => (
                      <span key={a.id} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                        {a.cursoNombre} · {a.gradoNombre} "{a.seccionNombre}"
                        <button onClick={() => handleQuitarAsignacion(d.id, a.id)} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
                      </span>
                    ))}
                  </div>
                )}

                {asignando === d.id && (
                  <div className="mt-3 flex gap-2">
                    <select value={cursoSel} onChange={(e) => setCursoSel(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm">
                      <option value="">Curso</option>
                      {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <select value={seccionSel} onChange={(e) => setSeccionSel(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm">
                      <option value="">Sección</option>
                      {grados.map((g) => (
                        <optgroup key={g.gradoId} label={g.gradoNombre}>
                          {g.secciones.map((s) => <option key={s.id} value={s.id}>{g.gradoNombre} "{s.nombre}"</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <button onClick={() => handleAsignar(d.id)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                      Asignar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}