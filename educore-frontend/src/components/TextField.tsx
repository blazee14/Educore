// src/components/TextField.tsx
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-primary-dark">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-lg border px-3 py-2 text-sm outline-none transition
          focus:border-primary focus:ring-2 focus:ring-primary/30
          ${error ? 'border-red-400' : 'border-gray-300'}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
