import type { Curso } from '../api/cursos.api';

interface Props {
  curso: Curso;
  modo: 'grid' | 'lista';
}

export function CardCurso({ curso, modo }: Props) {
  if (modo === 'lista') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div
          className="h-10 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: curso.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800">{curso.nombre}</p>
          <p className="text-xs text-gray-500">
            {curso.grado}° &quot;{curso.seccion}&quot; - {curso.nivel}
            <span className="mx-1.5 text-gray-300">|</span>
            {curso.profesor}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border-2 bg-white transition hover:shadow-md"
      style={{ borderColor: curso.color }}
    >
      <div
        className="flex h-24 items-center justify-center"
        style={{ backgroundColor: curso.color + '15' }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl opacity-80"
          style={{ backgroundColor: curso.color + '30' }}>
          <span className="text-2xl font-bold" style={{ color: curso.color }}>
            {curso.nombre.charAt(0)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="text-sm font-semibold text-gray-800">{curso.nombre}</p>
        <p className="text-xs text-gray-500">
          {curso.grado}° &quot;{curso.seccion}&quot; - {curso.nivel}
        </p>
        <p className="text-xs text-gray-400">
          {curso.profesor}
        </p>
      </div>
    </div>
  );
}
