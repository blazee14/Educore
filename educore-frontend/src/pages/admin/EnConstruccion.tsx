// src/pages/admin/EnConstruccion.tsx
interface Props {
  nombre: string;
}

export function EnConstruccion({ nombre }: Props) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
      <p className="text-lg font-semibold text-gray-700">{nombre}</p>
      <p className="mt-1 text-sm text-gray-400">Esta sección se construye en el siguiente paso.</p>
    </div>
  );
}
