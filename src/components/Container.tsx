import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default'
}) => {
  const maxWidthClass =
    size === 'narrow' ? 'max-w-4xl' : size === 'wide' ? 'max-w-7xl' : 'max-w-6xl';

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
};
