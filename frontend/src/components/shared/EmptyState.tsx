import * as React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No tools found',
  description = 'Try adjusting your search terms or category filters to find what you are looking for.',
  actionLabel = 'Reset Filters',
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-xs ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>
      {onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="mt-6 inline-flex items-center gap-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
