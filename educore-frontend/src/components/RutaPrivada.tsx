// src/components/RutaPrivada.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

export function RutaPrivada({ children }: { children: ReactNode }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">
        Verificando sesión...
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
