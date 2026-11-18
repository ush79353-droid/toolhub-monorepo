'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'min-h-[88px] w-full resize-y bg-transparent px-3 py-2.5 font-mono text-sm text-accent outline-none placeholder:text-muted-foreground';

interface UnicodeTextFormProps {
  value: string;
  warning?: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function UnicodeTextForm({
  value,
  warning,
  onChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: UnicodeTextFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="unicode-text-input" className={labelClass}>
          Type the text to convert
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="unicode-text-input"
            rows={3}
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={value}
            placeholder="Enter your text here..."
            aria-describedby={warning ? 'unicode-text-warning' : 'unicode-text-hint'}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        {warning ? (
          <p id="unicode-text-warning" className="text-xs text-amber-700" role="status">
            {warning}
          </p>
        ) : (
          <p id="unicode-text-hint" className="text-xs text-muted-foreground">
            Words, spaces, digits, and punctuation are supported. Unmapped characters stay as-is.
          </p>
        )}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
