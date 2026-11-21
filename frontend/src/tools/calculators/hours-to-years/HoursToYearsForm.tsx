'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { HoursToYearsFieldErrors, HoursToYearsInput, HoursToYearsSource } from './types';
import { parseOptionalNumber } from './validation';

export interface HoursToYearsDraft {
  source: HoursToYearsSource;
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
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): HoursToYearsDraft {
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
    otherOpen: false,
  };
}

export function draftToInput(draft: HoursToYearsDraft): HoursToYearsInput {
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

interface HoursToYearsFormProps {
  draft: HoursToYearsDraft;
  errors: HoursToYearsFieldErrors;
  onDraftChange: (draft: HoursToYearsDraft) => void;
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

export function HoursToYearsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HoursToYearsFormProps) {
  const set = (patch: Partial<HoursToYearsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Average Gregorian year = 365.2425 days = 8,765.82 hours. Enter hours or years: the other
        updates instantly. Months also use the average Gregorian month (year ÷ 12), not calendar
        dates.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Hours to years</p>
        <div className="space-y-3">
          <UnitRow
            id="h2y-hours"
            label="Time in hours"
            unit="hrs"
            value={draft.hours}
            error={errors.hours}
            tip="Years = hours ÷ 8,765.82 (average Gregorian year)."
            placeholder="Enter hours"
            onChange={(hours) => set({ source: 'hours', hours })}
          />
          <UnitRow
            id="h2y-years"
            label="Time in years"
            unit="yrs"
            value={draft.years}
            error={errors.years}
            tip="Hours = years × 8,765.82."
            placeholder="Enter years"
            onChange={(years) => set({ source: 'years', years })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => set({ otherOpen: !draft.otherOpen })}
          aria-expanded={draft.otherOpen}
        >
          <span>Other time units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <UnitRow
              id="h2y-months"
              label="Time in months"
              unit="mos"
              value={draft.months}
              error={errors.months}
              tip="Average Gregorian month = 30.436875 days = 730.485 hours."
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              Years and months use average Gregorian calendar durations. Actual calendar months and
              years vary in length (common year 8,760 hours; leap year 8,784 hours).
            </p>
            <UnitRow
              id="h2y-weeks"
              label="Time in weeks"
              unit="wks"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = exactly 168 hours."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />
            <UnitRow
              id="h2y-days"
              label="Time in days"
              unit="days"
              value={draft.days}
              error={errors.days}
              tip="1 day = exactly 24 hours."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="h2y-minutes"
              label="Time in minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 hour = 60 minutes."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />
            <UnitRow
              id="h2y-seconds"
              label="Time in seconds"
              unit="sec"
              value={draft.seconds}
              error={errors.seconds}
              tip="1 hour = 3,600 seconds."
              placeholder="—"
              onChange={(seconds) => set({ source: 'seconds', seconds })}
            />

            <div>
              <p className={labelClass}>
                Time in hours, minutes and seconds
                <InfoTooltip
                  label="Time in hours, minutes and seconds"
                  text="Compound duration. Values such as 1 hr 60 min 0 sec normalize to 2 hrs 0 min 0 sec in other fields."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="h2y-hms-h"
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
                        id="h2y-hms-m"
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
                        id="h2y-hms-s"
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
        ) : null}
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
