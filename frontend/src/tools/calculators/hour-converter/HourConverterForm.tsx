'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { HourFieldErrors, HourInput, HourSource } from './types';
import { parseOptionalNumber } from './validation';

export interface HourDraft {
  source: HourSource;
  hours: string;
  years: string;
  months: string;
  weeks: string;
  days: string;
  minutes: string;
  seconds: string;
  hmsHours: string;
  hmsMinutes: string;
  hmsSeconds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): HourDraft {
  return {
    source: 'hours',
    hours: '',
    years: '',
    months: '',
    weeks: '',
    days: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
}

export function draftToInput(draft: HourDraft): HourInput {
  return {
    source: draft.source,
    hours: parseOptionalNumber(draft.hours),
    years: parseOptionalNumber(draft.years),
    months: parseOptionalNumber(draft.months),
    weeks: parseOptionalNumber(draft.weeks),
    days: parseOptionalNumber(draft.days),
    minutes: parseOptionalNumber(draft.minutes),
    seconds: parseOptionalNumber(draft.seconds),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface HourConverterFormProps {
  draft: HourDraft;
  errors: HourFieldErrors;
  onDraftChange: (draft: HourDraft) => void;
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

function UnitRow({
  id,
  label,
  unit,
  value,
  error,
  tip,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  error?: string;
  tip?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} htmlFor={id} tip={tip} error={error}>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
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
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          {unit}
        </span>
      </div>
    </FieldShell>
  );
}

export function HourConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HourConverterFormProps) {
  const set = (patch: Partial<HourDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 hr = 60 min = 3,600 sec; 1 day = 24 hr; 1 week = 168 hr. Years and months use
        average Gregorian calendar durations. Actual calendar months and years vary in length.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Time in Hours</p>
        <UnitRow
          id="hc-hours"
          label="Hours"
          unit="hrs"
          value={draft.hours}
          error={errors.hours}
          tip="Enter a duration in hours. Fractions are allowed (for example 2.5)."
          placeholder="Enter hours"
          onChange={(hours) => set({ source: 'hours', hours })}
        />
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Time in Other Units</p>
        <div className="space-y-3">
          <UnitRow
            id="hc-years"
            label="Years"
            unit="yrs"
            value={draft.years}
            error={errors.years}
            tip="Average Gregorian year = 365.2425 days = 8765.82 hours."
            placeholder="—"
            onChange={(years) => set({ source: 'years', years })}
          />
          <UnitRow
            id="hc-months"
            label="Months"
            unit="mos"
            value={draft.months}
            error={errors.months}
            tip="Average Gregorian month = 30.436875 days = 730.485 hours."
            placeholder="—"
            onChange={(months) => set({ source: 'months', months })}
          />
          <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Years and months use average Gregorian calendar durations. Actual calendar months and
            years vary in length.
          </p>
          <UnitRow
            id="hc-weeks"
            label="Weeks"
            unit="wks"
            value={draft.weeks}
            error={errors.weeks}
            tip="1 week = exactly 168 hours."
            placeholder="—"
            onChange={(weeks) => set({ source: 'weeks', weeks })}
          />
          <UnitRow
            id="hc-days"
            label="Days"
            unit="days"
            value={draft.days}
            error={errors.days}
            tip="1 day = exactly 24 hours."
            placeholder="—"
            onChange={(days) => set({ source: 'days', days })}
          />
          <UnitRow
            id="hc-minutes"
            label="Minutes"
            unit="min"
            value={draft.minutes}
            error={errors.minutes}
            tip="1 hour = exactly 60 minutes."
            placeholder="—"
            onChange={(minutes) => set({ source: 'minutes', minutes })}
          />
          <UnitRow
            id="hc-seconds"
            label="Seconds"
            unit="sec"
            value={draft.seconds}
            error={errors.seconds}
            tip="1 hour = exactly 3,600 seconds."
            placeholder="—"
            onChange={(seconds) => set({ source: 'seconds', seconds })}
          />

          <div>
            <p className={labelClass}>
              Hours / Minutes / Seconds
              <InfoTooltip
                label="Hours / Minutes / Seconds"
                text="Compound duration. Values such as 1 hr 75 min 90 sec normalize to 2 hrs 16 min 30 sec in other fields. Hours do not wrap into days."
              />
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="hc-hms-h"
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.hmsHours}
                      placeholder="Hours"
                      aria-label="Compound hours"
                      aria-invalid={Boolean(errors.hmsHours)}
                      onChange={(event) =>
                        set({ source: 'hms', hmsHours: event.target.value })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    hrs
                  </span>
                </div>
                {errors.hmsHours ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.hmsHours}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="hc-hms-m"
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.hmsMinutes}
                      placeholder="Minutes"
                      aria-label="Compound minutes"
                      aria-invalid={Boolean(errors.hmsMinutes)}
                      onChange={(event) =>
                        set({ source: 'hms', hmsMinutes: event.target.value })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    min
                  </span>
                </div>
                {errors.hmsMinutes ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.hmsMinutes}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="hc-hms-s"
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.hmsSeconds}
                      placeholder="Seconds"
                      aria-label="Compound seconds"
                      aria-invalid={Boolean(errors.hmsSeconds)}
                      onChange={(event) =>
                        set({ source: 'hms', hmsSeconds: event.target.value })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    sec
                  </span>
                </div>
                {errors.hmsSeconds ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.hmsSeconds}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
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
