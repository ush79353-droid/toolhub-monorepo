'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const textareaClass =
  'min-h-[120px] w-full resize-y break-words bg-transparent px-3 py-2.5 font-mono text-sm leading-relaxed text-accent outline-none placeholder:text-muted-foreground';

interface UppercaseToLowercaseFormProps {
  value: string;
  warning?: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function UppercaseToLowercaseForm({
  value,
  warning,
  onChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: UppercaseToLowercaseFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Conversion runs in your browser with JavaScript&apos;s standard Unicode lowercase mapping.
        Numbers, punctuation, spaces, and most emoji stay unchanged.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="upper-to-lower-input" className={labelClass}>
          Enter text to convert to lowercase
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="upper-to-lower-input"
            rows={5}
            autoComplete="off"
            spellCheck={false}
            className={textareaClass}
            value={value}
            placeholder="Type or paste your text here..."
            aria-describedby={warning ? 'upper-to-lower-warning' : 'upper-to-lower-hint'}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        {warning ? (
          <p id="upper-to-lower-warning" className="text-xs text-amber-700" role="status">
            {warning}
          </p>
        ) : (
          <p id="upper-to-lower-hint" className="text-xs text-muted-foreground">
            Multiline text, mixed case, numbers, and Unicode letters are supported. Results update as
            you type.
          </p>
        )}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
