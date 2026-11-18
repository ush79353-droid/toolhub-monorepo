'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CONVERSION_MODES,
  DEFAULT_MODE,
  MODE_LABELS,
  MODE_META,
  type ConversionMode,
  type DbmFieldErrors,
} from './types';

export interface DbmToWattsDraft {
  mode: ConversionMode;
  input: string;
  output: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(mode: ConversionMode = DEFAULT_MODE): DbmToWattsDraft {
  return { mode, input: '', output: '' };
}

interface DbmToWattsFormProps {
  draft: DbmToWattsDraft;
  errors: DbmFieldErrors;
  onDraftChange: (draft: DbmToWattsDraft) => void;
  onModeChange: (mode: ConversionMode) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function DbmToWattsForm({
  draft,
  errors,
  onDraftChange,
  onModeChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DbmToWattsFormProps) {
  const meta = MODE_META[draft.mode];
  const inputError = errors.input;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-accent">Conversion type</legend>
        {CONVERSION_MODES.map((mode) => (
          <label key={mode} className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="dbm-conversion-mode"
              checked={draft.mode === mode}
              onChange={() => onModeChange(mode)}
            />
            {MODE_LABELS[mode]}
          </label>
        ))}
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="dbm-input" className={labelClass}>
          {meta.inputLabel}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="dbm-input"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.input}
              placeholder=""
              aria-invalid={Boolean(inputError)}
              aria-describedby={inputError ? 'dbm-input-error' : undefined}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  input: event.target.value,
                })
              }
            />
          </div>
          <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
            {meta.inputUnit}
          </span>
        </div>
        {inputError ? (
          <p id="dbm-input-error" className="text-xs text-red-600" role="alert">
            {inputError}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="dbm-output" className={labelClass}>
          {meta.outputLabel}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/20">
            <input
              id="dbm-output"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={draft.output}
              placeholder=""
              aria-live="polite"
            />
          </div>
          <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
            {meta.outputUnit}
          </span>
        </div>
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
