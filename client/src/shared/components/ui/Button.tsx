import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ariaLabel,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-mono uppercase tracking-widest transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-transparent border border-white text-white hover:bg-white hover:text-black',
    secondary: 'bg-transparent border border-silver-mist text-white hover:border-white',
    ghost: 'bg-transparent text-white hover:opacity-75',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-button-sm rounded-sm',
    md: 'px-6 py-3 text-button rounded-pill',
    lg: 'px-8 py-4 text-button rounded-pill',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
