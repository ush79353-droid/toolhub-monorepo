'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CelsiusToFahrenheitFieldErrors,
  CelsiusToFahrenheitInput,
  CfSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CelsiusToFahrenheitDraft {
  source: CfSource;
  celsius: string;
  fahrenheit: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CelsiusToFahrenheitDraft): CelsiusToFahrenheitInput {
  return {
    source: draft.source,
    celsius: parseOptionalNumber(draft.celsius),
    fahrenheit: parseOptionalNumber(draft.fahrenheit),
  };
}

export function emptyDraft(): CelsiusToFahrenheitDraft {
  return { source: 'celsius', celsius: '', fahrenheit: '' };
}

interface CelsiusToFahrenheitFormProps {
  draft: CelsiusToFahrenheitDraft;
  errors: CelsiusToFahrenheitFieldErrors;
  onDraftChange: (draft: CelsiusToFahrenheitDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CelsiusToFahrenheitForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CelsiusToFahrenheitFormProps) {
  const set = (patch: Partial<CelsiusToFahrenheitDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        °F = (°C × 9/5) + 32. Edit either field — the other updates instantly. Absolute zero is
        −273.15°C / −459.67°F.
      </div>

      <FieldShell
        label="Temperature in Celsius"
        htmlFor="cf-celsius"
        tip="Enter Celsius. Values below −273.15°C are below absolute zero."
        error={errors.celsius}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cf-celsius"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.celsius}
              placeholder="Enter temperature"
              aria-invalid={Boolean(errors.celsius)}
              onChange={(event) => set({ source: 'celsius', celsius: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            °C
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Temperature in Fahrenheit"
        htmlFor="cf-fahrenheit"
        tip="Enter Fahrenheit. Values below −459.67°F are below absolute zero."
        error={errors.fahrenheit}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cf-fahrenheit"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.fahrenheit}
              placeholder="Enter temperature"
              aria-invalid={Boolean(errors.fahrenheit)}
              onChange={(event) =>
                set({ source: 'fahrenheit', fahrenheit: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            °F
          </span>
        </div>
      </FieldShell>

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
