import React from 'react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  tag?: string;
  tagVariant?: 'emerald' | 'cyan' | 'amber' | 'indigo';
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  tagVariant = 'emerald',
  title,
  description,
  align = 'center',
  className = ''
}) => {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-12 sm:mb-16 ${alignmentClass} ${className}`}>
      {tag && (
        <div className="mb-3">
          <Badge variant={tagVariant} size="sm">
            {tag}
          </Badge>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
