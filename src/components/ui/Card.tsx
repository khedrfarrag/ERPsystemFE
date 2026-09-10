import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-2xl p-5 border border-slate-100 shadow-sm',
          hoverable && 'hover:shadow-md hover:border-slate-200 transition duration-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
