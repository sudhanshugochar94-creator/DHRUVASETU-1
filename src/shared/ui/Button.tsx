import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-b from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-semibold shadow-md shadow-sky-700/25 border border-sky-700/30',
    secondary:
      'bg-white hover:bg-sky-50 text-slate-900 border border-sky-200 shadow-sm',
    outline:
      'bg-white/60 hover:bg-sky-50 text-sky-800 border border-sky-600/40 hover:border-sky-600',
    ghost:
      'bg-transparent hover:bg-sky-100/70 text-slate-700 hover:text-slate-900',
    danger:
      'bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-500/40 shadow-lg shadow-rose-900/30'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
