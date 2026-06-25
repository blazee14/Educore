// src/pages/admin/EstudiantesPage.tsx
import { useEffect, useState } from 'react';
import {
  listarEstudiantes,
  actualizarEstudiante,
  resetearPasswordEstudiante,
  type EstudianteConDetalle,
  type ActualizarEstudianteInput,
  type ResetPasswordResultado,
} from '../../api/estudiante.api';
import { resetearPasswordTutor } from '../../api/tutor.api';

export function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<EstudianteConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<EstudianteConDetalle | null>(null);
  const [form, setForm] = useState<ActualizarEstudianteInput>({});
  const [guardando, setGuardando] = useState(false);
  const [resetResultado, setResetResultado] = useState<ResetPasswordResultado | null>(null);
  const [aResetear, setAResetear] = useState<{ tipo: 'estudiante' | 'tutor'; id: string; nombre: string } | null>(null);
  const [reseteando, setReseteando] = useState<string | null>(null);


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

  function abrirEdicion(est: EstudianteConDetalle) {
    setEditando(est);
    setForm({
      nombres: est.nombres,
      apellidos: est.apellidos,
      dni: est.dni,
      fechaNacimiento: est.fechaNacimiento.slice(0, 10),
    });
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;
    setGuardando(true);
    setError(null);
    try {
      await actualizarEstudiante(editando.id, form);
      setEditando(null);
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al actualizar el estudiante');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarReset() {
  if (!aResetear) return;
  setReseteando(aResetear.id);
  setError(null);
  try {
    const resultado = aResetear.tipo === 'estudiante'
      ? await resetearPasswordEstudiante(aResetear.id)
      : await resetearPasswordTutor(aResetear.id);
    setResetResultado(resultado);
  } catch {
    setError('No se pudo restablecer la contraseña');
  } finally {
    setReseteando(null);
    setAResetear(null);
  }
}

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">{estudiantes.length} estudiantes registrados</p>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
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
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Grado / Sección</th>
                <th className="px-4 py-3">Apoderado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{est.nombres}</td>
                  <td className="px-4 py-3">{est.apellidos}</td>
                  <td className="px-4 py-3">{est.dni}</td>
                  <td className="px-4 py-3 text-gray-500">{est.email}</td>
                  <td className="px-4 py-3">
                    {est.gradoNombre ? `${est.gradoNombre} "${est.seccionNombre}"` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {est.tutores[0] ? (
                      <div className="flex items-center gap-2">
                        <span>{est.tutores[0].nombres} {est.tutores[0].apellidos}</span>
                        <button
  onClick={() => setAResetear({ tipo: 'tutor', id: est.tutores[0].id, nombre: `${est.tutores[0].nombres} ${est.tutores[0].apellidos}` })}
  className="text-xs font-medium text-orange-500 hover:underline"
>
  Restablecer clave
</button>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => abrirEdicion(est)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Editar
                      </button>
                      <button
  onClick={() => setAResetear({ tipo: 'estudiante', id: est.id, nombre: `${est.nombres} ${est.apellidos}` })}
  className="text-xs font-medium text-orange-500 hover:underline"
>
  Restablecer clave
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de edición */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={handleGuardar} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Editar estudiante
            </h3>
            <div className="flex flex-col gap-3">
              <input required placeholder="Nombres" value={form.nombres ?? ''}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="Apellidos" value={form.apellidos ?? ''}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="DNI" value={form.dni ?? ''}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required type="date" value={form.fechaNacimiento ?? ''}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setEditando(null)}
                disabled={guardando}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      )}
{aResetear && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
        <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="mt-4 text-center text-base font-semibold text-gray-800">
        ¿Restablecer contraseña?
      </h3>
      <p className="mt-1 text-center text-sm text-gray-500">
        Se generará una nueva contraseña para <span className="font-medium text-gray-700">{aResetear.nombre}</span>. La contraseña anterior dejará de funcionar.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setAResetear(null)}
          disabled={reseteando !== null}
          className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={confirmarReset}
          disabled={reseteando !== null}
          className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60"
        >
          {reseteando !== null ? 'Generando...' : 'Restablecer'}
        </button>
      </div>
    </div>
  </div>
)}
      {/* Modal de resultado de reset password */}
      {resetResultado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-800">Contraseña restablecida</h3>
            <p className="mt-1 text-sm text-gray-500">
              Entrega esta nueva contraseña a quien corresponda — no se mostrará de nuevo:
            </p>
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
              <p><span className="font-medium">Correo:</span> {resetResultado.email}</p>
              <p><span className="font-medium">Nueva contraseña:</span> {resetResultado.passwordTemporal}</p>
            </div>
            <button
              onClick={() => setResetResultado(null)}
              className="mt-4 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary-dark transition"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}