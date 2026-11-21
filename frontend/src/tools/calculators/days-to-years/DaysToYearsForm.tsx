'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { DaysToYearsFieldErrors, DaysToYearsInput, DaysToYearsSource } from './types';
import { parseOptionalNumber } from './validation';

export interface DaysToYearsDraft {
  source: DaysToYearsSource;
  days: string;
  years: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DaysToYearsDraft {
  return { source: 'days', days: '', years: '' };
}

export function draftToInput(draft: DaysToYearsDraft): DaysToYearsInput {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DaysToYearsFormProps {
  draft: DaysToYearsDraft;
  errors: DaysToYearsFieldErrors;
  onDraftChange: (draft: DaysToYearsDraft) => void;
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

export function DaysToYearsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DaysToYearsFormProps) {
  const set = (patch: Partial<DaysToYearsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Uses the average Gregorian year of 365.2425 days (400-year leap cycle). This is a duration
 converter; not calendar-date arithmetic between two dates.
      </div>

      <FieldShell
        label="Days"
        htmlFor="dty-days"
        tip="Enter days to convert into average Gregorian years."
        error={errors.days}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dty-days"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.days}
            placeholder="Enter number of days"
            aria-invalid={Boolean(errors.days)}
            onChange={(event) => set({ source: 'days', days: event.target.value })}
          />
          <span className={suffixClass}>days</span>
        </div>
      </FieldShell>

      <FieldShell
        label="Years"
        htmlFor="dty-years"
        tip="Average Gregorian years. Edit to reverse-convert into days."
        error={errors.years}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="dty-years"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.years}
            placeholder="Enter years"
            aria-invalid={Boolean(errors.years)}
            onChange={(event) => set({ source: 'years', years: event.target.value })}
          />
          <span className={suffixClass}>yr</span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        Common year = 365 days · Leap year = 366 days · Average = 365.2425 days
      </p>

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
