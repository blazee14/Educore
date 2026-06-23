// src/pages/admin/EstudiantesPage.tsx
import { useEffect, useState } from 'react';
import {
  listarEstudiantes,
  crearEstudiante,
  eliminarEstudiante,
  type Estudiante,
  type CrearEstudianteInput,
} from '../../api/estudiante.api';

export function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<Estudiante | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [form, setForm] = useState<CrearEstudianteInput>({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
  });

  async function cargar() {
    setCargando(true);
    try {
      const data = await listarEstudiantes();
      setEstudiantes(data);
    } catch {
      setError('No se pudo cargar la lista de estudiantes');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await crearEstudiante(form);
      setForm({ email: '', password: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '' });
      setMostrarForm(false);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear el estudiante');
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await eliminarEstudiante(aEliminar.id);
      setAEliminar(null);
      await cargar();
    } catch {
      setError('No se pudo eliminar el estudiante');
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{estudiantes.length} estudiantes registrados</p>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo estudiante'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-5">
          <input required type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required type="password" placeholder="Contraseña" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Nombres" value={form.nombres}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="Apellidos" value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required placeholder="DNI" value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input required type="date" value={form.fechaNacimiento}
            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" disabled={enviando}
            className="col-span-2 mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {enviando ? 'Guardando...' : 'Guardar estudiante'}
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {cargando ? (
          <p className="p-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : estudiantes.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No hay estudiantes registrados aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Nombres</th>
                <th className="px-4 py-3">Apellidos</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Fecha de nacimiento</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{est.nombres}</td>
                  <td className="px-4 py-3">{est.apellidos}</td>
                  <td className="px-4 py-3">{est.dni}</td>
                  <td className="px-4 py-3">{new Date(est.fechaNacimiento).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setAEliminar(est)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación */}
      {aEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="mt-4 text-center text-base font-semibold text-gray-800">
              ¿Eliminar estudiante?
            </h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              Vas a eliminar a <span className="font-medium text-gray-700">{aEliminar.nombres} {aEliminar.apellidos}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAEliminar(null)}
                disabled={eliminando}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}