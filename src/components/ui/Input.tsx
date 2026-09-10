import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-bold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition',
                icon && 'pr-10',
                error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20',
                className
              )
            )}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-semibold text-rose-600 animate-in fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
