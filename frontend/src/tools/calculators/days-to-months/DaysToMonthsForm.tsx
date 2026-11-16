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
  type DaysToMonthsFieldErrors,
  type DaysToMonthsInput,
  type DaysToMonthsSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface DaysToMonthsDraft {
  source: DaysToMonthsSource;
  days: string;
  months: string;
  seconds: string;
  minutes: string;
  hours: string;
  weeks: string;
  years: string;
}

export type ExampleId = 'days-180' | 'months-6' | 'hours-2000';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DaysToMonthsDraft {
  return {
    source: 'days',
    days: '',
    months: '',
    seconds: '',
    minutes: '',
    hours: '',
    weeks: '',
    years: '',
  };
}

export function draftToInput(draft: DaysToMonthsDraft): DaysToMonthsInput {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DaysToMonthsFormProps {
  draft: DaysToMonthsDraft;
  errors: DaysToMonthsFieldErrors;
  onDraftChange: (draft: DaysToMonthsDraft) => void;
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
  const id = `dtm-${unit}`;
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

export function DaysToMonthsForm({
  draft,
  errors,
  onDraftChange,
  onExample,
  onSubmit,
  onReset,
  onReload,
  children,
}: DaysToMonthsFormProps) {
  const setUnit = (unit: DayTimeUnit, text: string) =>
    onDraftChange({ ...draft, source: unit, [unit]: text });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Months use the average Gregorian length of 30.436875 days (365.2425 ÷ 12). That is a
        duration approximation — not the exact length of a named calendar month.
      </div>

      <p className="text-[13px] font-semibold text-accent">Days to Months Conversion</p>

      <UnitField
        unit="days"
        value={draft.days}
        error={errors.days}
        tip="Enter days to get average months and other durations."
        placeholder="Enter days"
        onChange={(text) => setUnit('days', text)}
      />
      <UnitField
        unit="months"
        value={draft.months}
        error={errors.months}
        tip="Average months. Edit to reverse-convert into days."
        placeholder="Enter months"
        onChange={(text) => setUnit('months', text)}
      />

      <details className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Other Time Conversions</span>
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
                unit === 'years'
                  ? 'Average Gregorian year (365.2425 days).'
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
            onClick={() => onExample('days-180')}
          >
            Example 1: Months in 180 days
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 justify-start"
            onClick={() => onExample('months-6')}
          >
            Example 2: Days in 6 months
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 justify-start"
            onClick={() => onExample('hours-2000')}
          >
            Example 3: Months in 2,000 hours
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
