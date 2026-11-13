'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { suggestedOvertimeWage } from './calculation';
import {
  DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT,
  MAX_REGULAR_HOURS,
  type OvertimeWageSource,
  type TwelveHourShiftPayFieldErrors,
  type TwelveHourShiftPayInput,
} from './types';

export interface TwelveHourShiftPayDraft {
  hourlyWage: string;
  overtimeHourlyWage: string;
  overtimeWageSource: OvertimeWageSource;
  regularHours: string;
  shiftHours: string;
  shiftsPerWeek: string;
  weeksPerYear: string;
  currency: TwelveHourShiftPayInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function inputToDraft(input: TwelveHourShiftPayInput): TwelveHourShiftPayDraft {
  return {
    hourlyWage: String(input.hourlyWage),
    overtimeHourlyWage: String(input.overtimeHourlyWage),
    overtimeWageSource: input.overtimeWageSource,
    regularHours: String(input.regularHours),
    shiftHours: String(input.shiftHours),
    shiftsPerWeek: String(input.shiftsPerWeek),
    weeksPerYear: String(input.weeksPerYear),
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
    overtimeWageSource: draft.overtimeWageSource,
    regularHours: parseDraftNumber(draft.regularHours),
    shiftHours: parseDraftNumber(draft.shiftHours),
    shiftsPerWeek: parseDraftNumber(draft.shiftsPerWeek),
    weeksPerYear: parseDraftNumber(draft.weeksPerYear),
    currency: draft.currency,
  };
}

function formatDraftAmount(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(value);
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

  const onHourlyChange = (hourlyWage: string) => {
    if (draft.overtimeWageSource === 'entered') {
      patch({ hourlyWage });
      return;
    }
    const wage = parseDraftNumber(hourlyWage);
    patch({
      hourlyWage,
      overtimeHourlyWage: Number.isFinite(wage) && wage >= 0 ? formatDraftAmount(suggestedOvertimeWage(wage)) : '',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <Field
          id="shift-hourly-wage"
          label="Hourly wage"
          prefix={symbol}
          value={draft.hourlyWage}
          error={errors.hourlyWage}
          onChange={onHourlyChange}
        />
        <Field
          id="shift-overtime-wage"
          label="Overtime hourly wage"
          prefix={symbol}
          value={draft.overtimeHourlyWage}
          error={errors.overtimeHourlyWage}
          hint={
            draft.overtimeWageSource === 'suggested'
              ? 'Filled with 1.5× the hourly wage. Typing here keeps your own rate.'
              : 'Using the rate you entered. It will not change when the hourly wage changes.'
          }
          onChange={(overtimeHourlyWage) => patch({ overtimeHourlyWage, overtimeWageSource: 'entered' })}
        />
        <div className="min-[420px]:col-span-2">
          <Field
            id="shift-regular-hours"
            label="Regular hours in the shift"
            suffix="hrs"
            value={draft.regularHours}
            error={errors.regularHours}
            hint={`Non-overtime hours in one shift. Default ${DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT.regularHours}, maximum ${MAX_REGULAR_HOURS}.`}
            onChange={(regularHours) => patch({ regularHours })}
          />
        </div>
      </div>

      {draft.overtimeWageSource === 'entered' ? (
        <button
          type="button"
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          onClick={() => {
            const wage = parseDraftNumber(draft.hourlyWage);
            patch({
              overtimeWageSource: 'suggested',
              overtimeHourlyWage:
                Number.isFinite(wage) && wage >= 0 ? formatDraftAmount(suggestedOvertimeWage(wage)) : '',
            });
          }}
        >
          Use 1.5× the hourly wage
        </button>
      ) : null}

      <details className="rounded-xl border border-border bg-muted/20 px-3 py-2">
        <summary className="cursor-pointer text-[13px] font-medium text-accent">
          Schedule assumptions
        </summary>
        <div className="grid grid-cols-1 gap-3.5 pb-2 pt-3 min-[420px]:grid-cols-3">
          <Field
            id="shift-length"
            label="Shift length"
            suffix="hrs"
            value={draft.shiftHours}
            error={errors.shiftHours}
            onChange={(shiftHours) => patch({ shiftHours })}
          />
          <Field
            id="shift-per-week"
            label="Shifts per week"
            value={draft.shiftsPerWeek}
            error={errors.shiftsPerWeek}
            onChange={(shiftsPerWeek) => patch({ shiftsPerWeek })}
          />
          <Field
            id="shift-weeks-year"
            label="Weeks per year"
            value={draft.weeksPerYear}
            error={errors.weeksPerYear}
            onChange={(weeksPerYear) => patch({ weeksPerYear })}
          />
        </div>
      </details>

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
  hint,
  prefix,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
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
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
