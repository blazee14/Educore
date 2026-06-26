// src/context/TutorContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { misHijos, type HijoResumen } from '../api/tutor.api';

interface TutorState {
  hijos: HijoResumen[];
  hijoSeleccionado: HijoResumen | null;
  cargando: boolean;
  seleccionarHijo: (estudianteId: string) => void;
}

const TutorContext = createContext<TutorState | null>(null);

export function TutorProvider({ children }: { children: ReactNode }) {
  const [hijos, setHijos] = useState<HijoResumen[]>([]);
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    misHijos()
      .then((data) => {
        setHijos(data);
        if (data.length > 0) setHijoSeleccionadoId(data[0].estudianteId);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const hijoSeleccionado = hijos.find((h) => h.estudianteId === hijoSeleccionadoId) ?? hijos[0] ?? null;

  return (
    <TutorContext.Provider
      value={{ hijos, hijoSeleccionado, cargando, seleccionarHijo: setHijoSeleccionadoId }}
    >
      {children}
    </TutorContext.Provider>
  );
}

export function useTutor() {
  const ctx = useContext(TutorContext);
  if (!ctx) throw new Error('useTutor debe usarse dentro de <TutorProvider>');
  return ctx;
}