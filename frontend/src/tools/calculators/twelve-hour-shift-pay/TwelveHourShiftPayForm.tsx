'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { TwelveHourShiftPayFieldErrors, TwelveHourShiftPayInput } from './types';

export interface TwelveHourShiftPayDraft {
  hourlyWage: string;
  overtimeHourlyWage: string;
  regularHours: string;
  currency: TwelveHourShiftPayInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function inputToDraft(input: TwelveHourShiftPayInput): TwelveHourShiftPayDraft {
  return {
    hourlyWage: String(input.hourlyWage),
    overtimeHourlyWage: String(input.overtimeHourlyWage),
    regularHours: String(input.regularHours),
    currency: input.currency,
  };
}

function parseDraftNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return Number.NaN;
  return Number(cleaned);
}

export function draftToInput(draft: TwelveHourShiftPayDraft): TwelveHourShiftPayInput {
  return {
    hourlyWage: parseDraftNumber(draft.hourlyWage),
    overtimeHourlyWage: parseDraftNumber(draft.overtimeHourlyWage),
    regularHours: parseDraftNumber(draft.regularHours),
    currency: draft.currency,
  };
}

interface TwelveHourShiftPayFormProps {
  draft: TwelveHourShiftPayDraft;
  errors: TwelveHourShiftPayFieldErrors;
  onDraftChange: (draft: TwelveHourShiftPayDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function TwelveHourShiftPayForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: TwelveHourShiftPayFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<TwelveHourShiftPayDraft>) => {
    onDraftChange({ ...draft, ...next });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Field
          id="shift-hourly-wage"
          label="Hourly wage"
          prefix={symbol}
          value={draft.hourlyWage}
          error={errors.hourlyWage}
          onChange={(hourlyWage) => patch({ hourlyWage })}
        />
        <Field
          id="shift-overtime-wage"
          label="Overtime hourly wage"
          prefix={symbol}
          value={draft.overtimeHourlyWage}
          error={errors.overtimeHourlyWage}
          onChange={(overtimeHourlyWage) => patch({ overtimeHourlyWage })}
        />
        <Field
          id="shift-regular-hours"
          label="Number of regular hours"
          suffix="hrs"
          value={draft.regularHours}
          error={errors.regularHours}
          onChange={(regularHours) => patch({ regularHours })}
        />
      </div>
      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  prefix,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
          error ? 'border-rose-500' : 'border-border'
        } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
