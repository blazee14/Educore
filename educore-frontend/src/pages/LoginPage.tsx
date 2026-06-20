// src/pages/LoginPage.tsx
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isRequiere2FA } from '../api/auth.api';
import { TextField } from '../components/TextField';
import axios from 'axios';

type Paso = 'credenciales' | 'codigo-2fa';

export function LoginPage() {
  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();

  const [paso, setPaso] = useState<Paso>('credenciales');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [codigoDev, setCodigoDev] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const resultado = await login(email, password);
      if (isRequiere2FA(resultado)) {
        setUsuarioId(resultado.usuarioId);
        setCodigoDev(resultado.codigoDev ?? null);
        setPaso('codigo-2fa');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(mensajeDeError(err, 'Email o contraseña incorrectos'));
    } finally {
      setEnviando(false);
    }
  }

  async function handleVerify2FA(e: FormEvent) {
    e.preventDefault();
    if (!usuarioId) return;
    setError(null);
    setEnviando(true);
    try {
      await verify2FA(usuarioId, codigo);
      navigate('/dashboard');
    } catch (err) {
      setError(mensajeDeError(err, 'Código inválido o expirado'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-primary-dark">EduCore</h1>
        <p className="mb-6 text-sm text-gray-500">
          {paso === 'credenciales'
            ? 'Inicia sesión para continuar'
            : 'Ingresa el código de verificación'}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        {paso === 'credenciales' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <TextField
              id="email"
              label="Correo institucional"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white
                transition hover:bg-primary-dark disabled:opacity-60"
            >
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="flex flex-col gap-4">
            <TextField
              id="codigo"
              label="Código de 6 dígitos"
              inputMode="numeric"
              maxLength={6}
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            {codigoDev && (
              <p className="text-xs text-gray-400">
                Modo desarrollo — código de prueba: <strong>{codigoDev}</strong>
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white
                transition hover:bg-primary-dark disabled:opacity-60"
            >
              {enviando ? 'Verificando...' : 'Verificar'}
            </button>
            <button
              type="button"
              onClick={() => setPaso('credenciales')}
              className="text-xs text-gray-400 underline"
            >
              Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function mensajeDeError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
}
