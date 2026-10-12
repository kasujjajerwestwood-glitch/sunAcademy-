import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'sm',
  className = '',
  icon
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const variantClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    outline: 'bg-transparent text-slate-300 border border-slate-700'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
