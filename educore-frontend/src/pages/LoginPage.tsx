// src/pages/LoginPage.tsx
import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isRequiere2FA } from '../api/auth.api';
import { TextField } from '../components/TextField';
import axios from 'axios';

type Paso = 'credenciales' | 'codigo-2fa';

const campusPhoto =
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop';

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
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900 transition-colors">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* Columna izquierda: formulario */}
        <div className="flex flex-col items-center justify-center px-8 overflow-y-auto py-10">
          <div className="w-full max-w-sm">

            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white flex-shrink-0">
                <IconShieldBook />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-dark dark:text-white leading-tight">
                  Edu<span className="text-blue-500">Core</span>
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500">Sistema de Gestión Educativa</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark dark:text-white mt-8 mb-1">
              {paso === 'credenciales' ? 'Iniciar sesión' : 'Verificación en dos pasos'}
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {paso === 'credenciales'
                ? 'Ingresa tus credenciales para continuar'
                : 'Ingresa el código de verificación'}
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            {paso === 'credenciales' ? (
              <>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <TextField
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    autoComplete="email"
                    placeholder="ejemplo@colegio.edu.pe"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<IconMail />}
                  />
                  <TextField
                    id="password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<IconLock />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="pointer-events-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <IconEye />
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between -mt-1">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      Recordarme
                    </label>
                    <a href="/recuperar" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white
                      transition hover:bg-primary-dark disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <IconLockSmall />
                    {enviando ? 'Ingresando...' : 'Iniciar sesión'}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">o continuar con</span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600
                    py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <IconGoogle />
                  Continuar con Google
                </button>

                <div className="mt-5 flex gap-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  <span className="text-primary flex-shrink-0 mt-0.5">
                    <IconShieldCheck />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary-dark dark:text-white">Seguridad de tu cuenta</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Todas las conexiones están protegidas con cifrado SSL de 256 bits.
                    </p>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
                  ¿No tienes cuenta?{' '}
                  <a href="/contacto" className="text-primary hover:underline">
                    Contacta al administrador
                  </a>
                </p>
              </>
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
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Modo desarrollo — código de prueba: <strong>{codigoDev}</strong>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={enviando}
                  className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white
                    transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {enviando ? 'Verificando...' : 'Verificar'}
                </button>
                <button
                  type="button"
                  onClick={() => setPaso('credenciales')}
                  className="text-xs text-gray-400 dark:text-gray-500 underline"
                >
                  Volver
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Columna derecha: branding institucional */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${campusPhoto})` }}
        >
          <div className="absolute inset-0 bg-primary-dark/85" />

          <div className="relative z-10 flex justify-end gap-2">
            <span className="flex items-center gap-1 text-xs text-white/90 border border-white/20 rounded-full px-3 py-1.5">
              <IconGlobe /> Español
            </span>
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition"
              aria-label="Cambiar modo oscuro"
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>

          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-3">
              Bienvenido a <span className="text-blue-300">EduCore</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Plataforma integral para la gestión académica, administrativa y comunicacional de tu institución.
            </p>
            <div className="h-0.5 w-10 bg-blue-400 mb-8" />

            <div className="space-y-5">
              <Feature icon={<IconUsers />} title="Gestión Académica" desc="Administra matrículas, notas, asistencia y más desde un solo lugar." />
              <Feature icon={<IconCard />} title="Control de Pagos" desc="Gestiona pensiones, recibos y reportes financieros fácilmente." />
              <Feature icon={<IconChat />} title="Comunicación Eficiente" desc="Mantén informados a docentes, estudiantes y padres en tiempo real." />
              <Feature icon={<IconChart />} title="Reportes Inteligentes" desc="Dashboards y estadísticas para tomar mejores decisiones." />
            </div>
          </div>

          <div className="relative z-10" />
        </div>
      </div>

      {/* Footer institucional */}
      <div className="hidden lg:grid grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800 px-12 py-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="flex items-start gap-2">
          <span className="text-primary mt-0.5"><IconShieldSmall /></span>
          <div>
            <p className="text-sm font-semibold text-primary-dark dark:text-white">Colegio San Ignacio de Loyola</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Formamos hoy, líderes del mañana.</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400 dark:text-gray-500 mt-0.5"><IconHeadset /></span>
          <div>
            <p className="text-sm font-semibold text-primary-dark dark:text-white">¿Necesitas ayuda?</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">soporte@colegio.edu.pe &nbsp;|&nbsp; (01) 123-4567</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400 dark:text-gray-500 mt-0.5"><IconLockSmall2 /></span>
          <div>
            <p className="text-sm font-semibold text-primary-dark dark:text-white">Política de privacidad</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Tus datos están protegidos con nosotros.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-white/15 flex-shrink-0 flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-white font-medium text-sm">{title}</p>
        <p className="text-slate-300 text-xs leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function IconShieldBook() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h6M9 13h6M12 7v9" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 10-8 0" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="13" rx="2" strokeWidth={1.5} />
      <path strokeWidth={1.5} d="M3 10h18" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V9m6 8V5m-12 12v-4" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
    </svg>
  );
}
function IconLockSmall() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
    </svg>
  );
}
function IconLockSmall2() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconShieldSmall() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
    </svg>
  );
}
function IconHeadset() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12a9 9 0 0118 0v5a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3M3 12v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
      <path strokeWidth={1.5} d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function IconSun() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M12 2v2m0 16v2M4 12H2m20 0h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.1V7.05H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.95l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function mensajeDeError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
}