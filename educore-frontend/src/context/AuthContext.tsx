// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authApi from '../api/auth.api';
import { setAccessToken } from '../api/http';

interface AuthState {
  autenticado: boolean;
  cargando: boolean;
  login: (email: string, password: string) => Promise<authApi.LoginResult>;
  verify2FA: (usuarioId: string, codigo: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Al montar la app, intenta refrescar la sesión usando la cookie httpOnly.
  // Si el backend la acepta, el usuario sigue logueado sin volver a escribir su clave.
  useEffect(() => {
    authApi
      .refresh()
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        setAutenticado(true);
      })
      .catch(() => {
        setAutenticado(false);
      })
      .finally(() => setCargando(false));
  }, []);

  async function login(email: string, password: string) {
    const resultado = await authApi.login(email, password);
    if (!authApi.isRequiere2FA(resultado)) {
      setAccessToken(resultado.accessToken);
      setAutenticado(true);
    }
    return resultado;
  }

  async function verify2FA(usuarioId: string, codigo: string) {
    const resultado = await authApi.verify2FA(usuarioId, codigo);
    setAccessToken(resultado.accessToken);
    setAutenticado(true);
  }

  async function logout() {
    await authApi.logout();
    setAccessToken(null);
    setAutenticado(false);
  }

  return (
    <AuthContext.Provider value={{ autenticado, cargando, login, verify2FA, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
