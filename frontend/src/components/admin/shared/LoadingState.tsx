import * as React from 'react';

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function LoadingState({ rows = 5, className = '' }: LoadingStateProps) {
  return (
    <div className={`space-y-3 rounded-xl border border-border bg-white p-6 ${className}`}>
      <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted/70" />
      <div className="pt-4 space-y-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted/80" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
