'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { DegreesMinutesSource, DegreesToMinutesFieldErrors } from './types';
import { parseOptionalNumber } from './validation';

export interface DegreesToMinutesDraft {
  source: DegreesMinutesSource;
  degrees: string;
  arcminutes: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DegreesToMinutesDraft {
  return {
    source: 'degrees',
    degrees: '',
    arcminutes: '',
  };
}

export function draftToInput(draft: DegreesToMinutesDraft) {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.source === 'degrees' ? draft.degrees : draft.arcminutes),
  };
}

interface DegreesToMinutesFormProps {
  draft: DegreesToMinutesDraft;
  errors: DegreesToMinutesFieldErrors;
  onDraftChange: (draft: DegreesToMinutesDraft) => void;
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

export function DegreesToMinutesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DegreesToMinutesFormProps) {
  const set = (patch: Partial<DegreesToMinutesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts angular degrees to minutes of arc (arcminutes), not clock time. Exactly 1° = 60′.
        Negative angles and values beyond 360° are allowed.
      </div>

      <FieldShell
        label="Angle in degrees"
        htmlFor="dtm-degrees"
        tip="Enter an angle in degrees (°). The arcminutes field updates as degrees × 60."
        error={errors.degrees}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dtm-degrees"
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
        label="Angle in minutes of arc"
        htmlFor="dtm-arcminutes"
        tip="Arcminutes (′) measure angles (one-sixtieth of a degree) not minutes of time. Edit here to reverse-convert into degrees."
        error={errors.arcminutes}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dtm-arcminutes"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.arcminutes}
            placeholder="Enter arcminutes"
            aria-invalid={Boolean(errors.arcminutes)}
            onChange={(event) => set({ source: 'arcminutes', arcminutes: event.target.value })}
          />
          <span className={suffixClass} aria-hidden="true">
            ′
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
