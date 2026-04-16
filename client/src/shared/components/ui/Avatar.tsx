import React from 'react';
import { getInitials, generateAvatarColor } from '../../utils/format.utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeStyles[size]} ${generateAvatarColor(name)} rounded-full flex items-center justify-center text-white font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
