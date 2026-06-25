// src/pages/director/MatriculaPage.tsx
import { useEffect, useState } from 'react';
import {
  registrarMatricula,
  type RegistrarMatriculaInput,
  type CredencialesGeneradas,
} from '../../api/matricula.api';
import { seccionesDisponibles, type GradoConSecciones } from '../../api/academico.api';

const ANIO_ESCOLAR = 2026;

const formVacio: RegistrarMatriculaInput = {
  alumno: { nombres: '', apellidos: '', dni: '', fechaNacimiento: '' },
  apoderado: { nombres: '', apellidos: '', dni: '', telefono: '', parentesco: '' },
  seccionId: '',
  anioEscolar: ANIO_ESCOLAR,
};

export function MatriculaPage() {
  const [grados, setGrados] = useState<GradoConSecciones[]>([]);
  const [form, setForm] = useState<RegistrarMatriculaInput>(formVacio);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CredencialesGeneradas | null>(null);

  useEffect(() => {
    seccionesDisponibles(ANIO_ESCOLAR).then(setGrados).catch(() => setError('No se pudieron cargar los grados y secciones'));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const data = await registrarMatricula(form);
      setResultado(data);
      setForm(formVacio);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al registrar la matrícula');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      {resultado && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-700">
            Matrícula registrada: {resultado.estudiante.nombres} {resultado.estudiante.apellidos}
          </p>
          <p className="mt-2 text-sm text-green-700">
            Entrega estas credenciales al apoderado — no se mostrarán de nuevo:
          </p>
          <div className="mt-2 rounded-lg bg-white p-3 text-sm">
            <p><span className="font-medium">Correo:</span> {resultado.credenciales.email}</p>
            <p><span className="font-medium">Contraseña temporal:</span> {resultado.credenciales.passwordTemporal}</p>
          </div>

          {resultado.credencialesTutor && (
            <div className="mt-3 rounded-lg bg-white p-3 text-sm">
              <p className="mb-1 font-medium text-green-700">Credenciales del apoderado:</p>
              <p><span className="font-medium">Correo:</span> {resultado.credencialesTutor.email}</p>
              <p><span className="font-medium">Contraseña temporal:</span> {resultado.credencialesTutor.passwordTemporal}</p>
            </div>
          )}

          <button
            onClick={() => setResultado(null)}
            className="mt-3 text-sm font-medium text-green-700 underline"
          >
            Registrar otra matrícula
          </button>
        </div>
      )}

      {!resultado && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="mb-3 font-semibold text-gray-800">Datos del alumno</p>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Nombres" value={form.alumno.nombres}
                onChange={(e) => setForm({ ...form, alumno: { ...form.alumno, nombres: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="Apellidos" value={form.alumno.apellidos}
                onChange={(e) => setForm({ ...form, alumno: { ...form.alumno, apellidos: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="DNI" value={form.alumno.dni}
                onChange={(e) => setForm({ ...form, alumno: { ...form.alumno, dni: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required type="date" value={form.alumno.fechaNacimiento}
                onChange={(e) => setForm({ ...form, alumno: { ...form.alumno, fechaNacimiento: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="mb-3 font-semibold text-gray-800">Datos académicos</p>
            <select required value={form.seccionId}
              onChange={(e) => setForm({ ...form, seccionId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Selecciona grado y sección</option>
              {grados.map((g) => (
                <optgroup key={g.gradoId} label={`${g.gradoNombre} - ${g.nivel}`}>
                  {g.secciones.map((s) => (
                    <option key={s.id} value={s.id}>
                      {g.gradoNombre} "{s.nombre}"
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="mb-3 font-semibold text-gray-800">Datos del apoderado</p>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Nombres" value={form.apoderado.nombres}
                onChange={(e) => setForm({ ...form, apoderado: { ...form.apoderado, nombres: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="Apellidos" value={form.apoderado.apellidos}
                onChange={(e) => setForm({ ...form, apoderado: { ...form.apoderado, apellidos: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input required placeholder="DNI" value={form.apoderado.dni}
                onChange={(e) => setForm({ ...form, apoderado: { ...form.apoderado, dni: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input placeholder="Teléfono" value={form.apoderado.telefono}
                onChange={(e) => setForm({ ...form, apoderado: { ...form.apoderado, telefono: e.target.value } })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select required value={form.apoderado.parentesco}
                onChange={(e) => setForm({ ...form, apoderado: { ...form.apoderado, parentesco: e.target.value } })}
                className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Parentesco</option>
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Apoderado">Apoderado</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={enviando}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60"
          >
            {enviando ? 'Registrando...' : 'Registrar matrícula'}
          </button>
        </form>
      )}
    </div>
  );
}