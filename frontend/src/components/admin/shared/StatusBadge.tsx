import * as React from 'react';
import { cn } from '@/lib/utils';

export type AdminStatus =
  | 'published'
  | 'draft'
  | 'disabled'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending'
  | 'connected'
  | 'disconnected'
  | 'pending_setup'
  | 'optimized'
  | 'needs_review';

interface StatusBadgeProps {
  status: AdminStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-muted text-muted-foreground border-border';
  let dotColor = 'bg-muted-foreground';
  let label = status;

  switch (normalized) {
    case 'published':
    case 'active':
    case 'connected':
    case 'optimized':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      label =
        normalized === 'optimized'
          ? 'Optimized'
          : normalized === 'connected'
            ? 'Connected'
            : normalized === 'active'
              ? 'Active'
              : 'Published';
      break;

    case 'draft':
    case 'pending':
    case 'pending_setup':
    case 'needs_review':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
      label =
        normalized === 'needs_review'
          ? 'Review Needed'
          : normalized === 'pending_setup'
            ? 'Pending Setup'
            : normalized === 'pending'
              ? 'Pending'
              : 'Draft';
      break;

    case 'disabled':
    case 'inactive':
    case 'suspended':
    case 'disconnected':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-500';
      label =
        normalized === 'disconnected'
          ? 'Disconnected'
          : normalized === 'suspended'
            ? 'Suspended'
            : normalized === 'inactive'
              ? 'Inactive'
              : 'Disabled';
      break;

    default:
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        colorClasses,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} aria-hidden="true" />
      {label}
    </span>
  );
}
