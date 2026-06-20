// src/pages/DashboardPage.tsx
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-xl font-bold text-primary-dark">Sesión iniciada ✅</h1>
      <p className="text-sm text-gray-500">
        Aquí irán los módulos de Matrícula, Notas, Asistencia, etc.
      </p>
      <button
        onClick={logout}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
