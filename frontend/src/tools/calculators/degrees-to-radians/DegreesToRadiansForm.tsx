'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { DegreesRadiansSource, DegreesToRadiansFieldErrors } from './types';
import { parseOptionalNumber } from './validation';

export interface DegreesToRadiansDraft {
  source: DegreesRadiansSource;
  degrees: string;
  radians: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DegreesToRadiansDraft {
  return {
    source: 'degrees',
    degrees: '',
    radians: '',
  };
}

export function draftToInput(draft: DegreesToRadiansDraft) {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.source === 'degrees' ? draft.degrees : draft.radians),
  };
}

interface DegreesToRadiansFormProps {
  draft: DegreesToRadiansDraft;
  errors: DegreesToRadiansFieldErrors;
  onDraftChange: (draft: DegreesToRadiansDraft) => void;
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

export function DegreesToRadiansForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DegreesToRadiansFormProps) {
  const set = (patch: Partial<DegreesToRadiansDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Uses Math.PI exactly: radians = degrees × π/180 and degrees = radians × 180/π. Negative
        angles and values beyond 360° are allowed.
      </div>

      <FieldShell
        label="Degrees"
        htmlFor="dtr-degrees"
        tip="Enter an angle in degrees (°). Radians update as degrees × π / 180."
        error={errors.degrees}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dtr-degrees"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.degrees}
            placeholder="Enter degrees"
            aria-invalid={Boolean(errors.degrees)}
            onChange={(event) => set({ source: 'degrees', degrees: event.target.value })}
          />
          <span className={suffixClass} aria-hidden="true">
            °
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Radians"
        htmlFor="dtr-radians"
        tip="Enter radians (rad). Degrees update as radians × 180 / π. Enter a decimal for π (about 3.141592653589793)."
        error={errors.radians}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dtr-radians"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.radians}
            placeholder="Enter radians"
            aria-invalid={Boolean(errors.radians)}
            onChange={(event) => set({ source: 'radians', radians: event.target.value })}
          />
          <span className={suffixClass} aria-hidden="true">
            rad
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
