// src/components/TextField.tsx
import { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export function TextField({ label, error, id, icon, rightIcon, className, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-primary-dark dark:text-gray-200">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:border-primary focus:ring-2 focus:ring-primary/30
            ${icon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''}
            ${error ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</span>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}