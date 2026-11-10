import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query, filter criteria, or add a new record to get started.',
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white p-8 text-center sm:p-12 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
        {icon ?? <Layers className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-accent">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
