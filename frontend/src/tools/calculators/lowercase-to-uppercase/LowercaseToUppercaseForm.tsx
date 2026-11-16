'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CASE_MODE_OPTIONS, type CaseMode } from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const textareaClass =
  'min-h-[120px] w-full resize-y break-words bg-transparent px-3 py-2.5 font-mono text-sm leading-relaxed text-accent outline-none placeholder:text-muted-foreground';

interface LowercaseToUppercaseFormProps {
  value: string;
  mode: CaseMode;
  warning?: string;
  onChange: (value: string) => void;
  onModeChange: (mode: CaseMode) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function LowercaseToUppercaseForm({
  value,
  mode,
  warning,
  onChange,
  onModeChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LowercaseToUppercaseFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Conversion runs in your browser with JavaScript&apos;s standard Unicode uppercase mapping.
        Default mode is Uppercase. Extra modes are optional helpers — title case is a simple
        whitespace rule, not a full linguistic style guide.
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Transformation (optional)</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Case transformation mode">
          {CASE_MODE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="case-mode"
                  value={option.id}
                  checked={mode === option.id}
                  className="h-4 w-4 accent-primary"
                  onChange={() => onModeChange(option.id)}
                />
                <span className="font-medium">{option.label}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">{option.example}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="lower-to-upper-input" className={labelClass}>
          Enter text to convert to uppercase
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="lower-to-upper-input"
            rows={5}
            autoComplete="off"
            spellCheck={false}
            className={textareaClass}
            value={value}
            placeholder="hello world"
            aria-describedby={warning ? 'lower-to-upper-warning' : 'lower-to-upper-hint'}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        {warning ? (
          <p id="lower-to-upper-warning" className="text-xs text-amber-700" role="status">
            {warning}
          </p>
        ) : (
          <p id="lower-to-upper-hint" className="text-xs text-muted-foreground">
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
