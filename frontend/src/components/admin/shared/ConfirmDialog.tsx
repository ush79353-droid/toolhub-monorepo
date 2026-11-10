'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-secondary text-primary'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-accent">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              variant === 'danger'
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-primary text-white hover:bg-[hsl(var(--primary-hover))]'
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
