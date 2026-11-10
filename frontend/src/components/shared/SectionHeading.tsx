import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
  action,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col mb-8 sm:mb-12',
        isCentered ? 'items-center text-center' : 'items-start text-left',
        action ? 'md:flex-row md:items-end md:justify-between' : '',
        className
      )}
    >
      <div className={cn(action ? 'max-w-2xl' : isCentered ? 'max-w-2xl mx-auto' : 'max-w-3xl')}>
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight text-accent sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-4 md:mt-0 flex-shrink-0">{action}</div>}
    </div>
  );
}

