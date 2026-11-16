'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OTHER_UNITS,
  UNIT_LABEL,
  UNIT_TITLE,
  type DayTimeUnit,
  type DaysToWeeksFieldErrors,
  type DaysToWeeksInput,
  type DaysToWeeksSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface DaysToWeeksDraft {
  source: DaysToWeeksSource;
  days: string;
  weeks: string;
  years: string;
  months: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export type ExampleId = 'days-5' | 'days-100' | 'hours-2000';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DaysToWeeksDraft {
  return {
    source: 'days',
    days: '',
    weeks: '',
    years: '',
    months: '',
    hours: '',
    minutes: '',
    seconds: '',
  };
}

export function draftToInput(draft: DaysToWeeksDraft): DaysToWeeksInput {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DaysToWeeksFormProps {
  draft: DaysToWeeksDraft;
  errors: DaysToWeeksFieldErrors;
  onDraftChange: (draft: DaysToWeeksDraft) => void;
  onExample: (id: ExampleId) => void;
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

function UnitField({
  unit,
  value,
  error,
  tip,
  placeholder,
  onChange,
}: {
  unit: DayTimeUnit;
  value: string;
  error?: string;
  tip?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const id = `dtw-${unit}`;
  return (
    <FieldShell label={UNIT_TITLE[unit]} htmlFor={id} tip={tip} error={error}>
      <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          className={inputClass}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={suffixClass}>{UNIT_LABEL[unit]}</span>
      </div>
    </FieldShell>
  );
}

export function DaysToWeeksForm({
  draft,
  errors,
  onDraftChange,
  onExample,
  onSubmit,
  onReset,
  onReload,
  children,
}: DaysToWeeksFormProps) {
  const setUnit = (unit: DayTimeUnit, text: string) =>
    onDraftChange({ ...draft, source: unit, [unit]: text });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        There are exactly 7 days in one week. Years and months use average Gregorian lengths
        (365.2425 d/yr · 30.436875 d/mo) and are duration approximations, not named calendar spans.
      </div>

      <p className="text-[13px] font-semibold text-accent">Days and Weeks</p>

      <UnitField
        unit="days"
        value={draft.days}
        error={errors.days}
        tip="Enter days to get weeks and other durations."
        placeholder="Enter days"
        onChange={(text) => setUnit('days', text)}
      />
      <UnitField
        unit="weeks"
        value={draft.weeks}
        error={errors.weeks}
        tip="Edit weeks to reverse-convert into days (×7)."
        placeholder="Enter weeks"
        onChange={(text) => setUnit('weeks', text)}
      />

      <details className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Other Quantities</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-4 py-3">
          {OTHER_UNITS.map((unit) => (
            <UnitField
              key={unit}
              unit={unit}
              value={draft[unit]}
              error={errors[unit]}
              tip={
                unit === 'years' || unit === 'months'
                  ? 'Average Gregorian approximation.'
                  : undefined
              }
              placeholder="—"
              onChange={(text) => setUnit(unit, text)}
            />
          ))}
        </div>
      </details>

      {children}

      <div className="space-y-2 rounded-xl border border-border bg-muted/10 px-4 py-3">
        <p className="text-sm font-semibold text-accent">Check Our Examples</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="h-10 justify-start"
            onClick={() => onExample('days-5')}
          >
            Example 1: Weeks in 5 days
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 justify-start"
            onClick={() => onExample('days-100')}
          >
            Example 2: Weeks in 100 days
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 justify-start"
            onClick={() => onExample('hours-2000')}
          >
            Example 3: Weeks in 2,000 hours
          </Button>
        </div>
      </div>

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
