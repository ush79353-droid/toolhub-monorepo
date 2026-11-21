'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OUTPUT_UNITS,
  UNIT_LABEL,
  UNIT_TITLE,
  type DayConverterFieldErrors,
  type DayConverterInput,
  type DayConverterSource,
  type DayTimeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface DayConverterDraft {
  source: DayConverterSource;
  days: string;
  years: string;
  months: string;
  weeks: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DayConverterDraft {
  return {
    source: 'days',
    days: '',
    years: '',
    months: '',
    weeks: '',
    hours: '',
    minutes: '',
    seconds: '',
  };
}

export function draftToInput(draft: DayConverterDraft): DayConverterInput {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DayConverterFormProps {
  draft: DayConverterDraft;
  errors: DayConverterFieldErrors;
  onDraftChange: (draft: DayConverterDraft) => void;
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
  const id = `day-conv-${unit}`;
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

export function DayConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DayConverterFormProps) {
  const setUnit = (unit: DayTimeUnit, text: string) =>
    onDraftChange({ ...draft, source: unit, [unit]: text });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Weeks, hours, minutes, and seconds use fixed SI day lengths (24 h). Years and months use
        average Gregorian lengths (365.2425 d/yr · 30.436875 d/mo) and are not calendar-date
        arithmetic.
      </div>

      <UnitField
        unit="days"
        value={draft.days}
        error={errors.days}
        tip="Enter a duration in days. Fractions are allowed (for example 0.4)."
        placeholder="Enter days"
        onChange={(text) => setUnit('days', text)}
      />

      <div className="space-y-3 border-t border-border pt-3">
        <p className="text-[13px] font-medium text-accent">That amount of days equals to:</p>
        {OUTPUT_UNITS.map((unit) => (
          <UnitField
            key={unit}
            unit={unit}
            value={draft[unit]}
            error={errors[unit]}
            tip={
              unit === 'years' || unit === 'months'
                ? 'Average approximation; not an exact calendar span.'
                : undefined
            }
            placeholder="—"
            onChange={(text) => setUnit(unit, text)}
          />
        ))}
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
