// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authApi from '../api/auth.api';
import { setAccessToken } from '../api/http';
import { decodificarRol } from '../api/jwt';

interface AuthState {
  autenticado: boolean;
  cargando: boolean;
  rol: string | null;
  login: (email: string, password: string) => Promise<authApi.LoginResult>;
  verify2FA: (usuarioId: string, codigo: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .refresh()
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        setAutenticado(true);
        setRol(decodificarRol(accessToken));
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
      setRol(decodificarRol(resultado.accessToken));
    }
    return resultado;
  }

  async function verify2FA(usuarioId: string, codigo: string) {
    const resultado = await authApi.verify2FA(usuarioId, codigo);
    setAccessToken(resultado.accessToken);
    setAutenticado(true);
    const rolDecodificado = decodificarRol(resultado.accessToken);
    setRol(rolDecodificado);
    return rolDecodificado;
  }

  async function logout() {
    await authApi.logout();
    setAccessToken(null);
    setAutenticado(false);
    setRol(null);
  }

  return (
    <AuthContext.Provider value={{ autenticado, cargando, rol, login, verify2FA, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}