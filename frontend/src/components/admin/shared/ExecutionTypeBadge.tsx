import * as React from 'react';
import { cn } from '@/lib/utils';
import { Monitor, Server, Cloud } from 'lucide-react';

interface ExecutionTypeBadgeProps {
  type: 'client' | 'server' | 'third-party' | string;
  className?: string;
}

export function ExecutionTypeBadge({ type, className }: ExecutionTypeBadgeProps) {
  const normalized = type.toLowerCase();

  if (normalized === 'client' || normalized === 'client-side') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md bg-secondary/70 border border-teal-200 px-2 py-0.5 text-xs font-medium text-primary',
          className
        )}
      >
        <Monitor className="h-3 w-3" />
        <span>Client-Side</span>
      </span>
    );
  }

  if (normalized === 'server' || normalized === 'server-side') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs font-medium text-sky-800',
          className
        )}
      >
        <Server className="h-3 w-3" />
        <span>Server Pipeline</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs font-medium text-purple-800',
        className
      )}
    >
      <Cloud className="h-3 w-3" />
      <span>Third-Party API</span>
    </span>
  );
}
