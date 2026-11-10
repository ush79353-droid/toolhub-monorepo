import * as React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  children,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border ${className}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-accent">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}
