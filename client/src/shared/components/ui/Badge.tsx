import React from 'react';

interface BadgeProps {
  variant: 'admin' | 'manager' | 'user' | 'active' | 'inactive';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  size = 'md',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono uppercase tracking-widest rounded-sm';

  const variantStyles = {
    admin: 'bg-white/20 text-white',
    manager: 'bg-white/10 text-white',
    user: 'bg-white/10 text-silver-mist',
    active: 'bg-white/10 text-white',
    inactive: 'bg-white/5 text-silver-mist',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-micro',
    md: 'px-3 py-1 text-micro',
  };

  const dotColors = {
    admin: 'bg-white',
    manager: 'bg-silver-mist',
    user: 'bg-silver-mist',
    active: 'bg-white',
    inactive: 'bg-silver-mist',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  );
};
