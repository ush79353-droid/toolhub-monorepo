'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { HoursToDaysFieldErrors, HoursToDaysInput, HoursToDaysSource } from './types';
import { parseOptionalNumber } from './validation';

export interface HoursToDaysDraft {
  source: HoursToDaysSource;
  hours: string;
  days: string;
  years: string;
  months: string;
  weeks: string;
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

export function emptyDraft(): HoursToDaysDraft {
  return {
    source: 'hours',
    hours: '',
    days: '',
    years: '',
    months: '',
    weeks: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
    otherOpen: false,
  };
}

export function draftToInput(draft: HoursToDaysDraft): HoursToDaysInput {
  return {
    source: draft.source,
    hours: parseOptionalNumber(draft.hours),
    days: parseOptionalNumber(draft.days),
    years: parseOptionalNumber(draft.years),
    months: parseOptionalNumber(draft.months),
    weeks: parseOptionalNumber(draft.weeks),
    minutes: parseOptionalNumber(draft.minutes),
    seconds: parseOptionalNumber(draft.seconds),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface HoursToDaysFormProps {
  draft: HoursToDaysDraft;
  errors: HoursToDaysFieldErrors;
  onDraftChange: (draft: HoursToDaysDraft) => void;
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

export function HoursToDaysForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HoursToDaysFormProps) {
  const set = (patch: Partial<HoursToDaysDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 day = 24 hours. Enter hours or days — the other updates instantly. Years and months
        use average Gregorian durations (not calendar-date spans). Workdays (8-hour) are a different
        concept and are not mixed into this calculator.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Input one and get the other</p>
        <div className="space-y-3">
          <UnitRow
            id="h2d-hours"
            label="Hours"
            unit="hrs"
            value={draft.hours}
            error={errors.hours}
            tip="Days = hours ÷ 24."
            placeholder="Enter hours"
            onChange={(hours) => set({ source: 'hours', hours })}
          />
          <UnitRow
            id="h2d-days"
            label="Days"
            unit="days"
            value={draft.days}
            error={errors.days}
            tip="Hours = days × 24."
            placeholder="Enter days"
            onChange={(days) => set({ source: 'days', days })}
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
          <span>Other Quantities</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <UnitRow
              id="h2d-years"
              label="Years"
              unit="yrs"
              value={draft.years}
              error={errors.years}
              tip="Average Gregorian year = 365.2425 days."
              placeholder="—"
              onChange={(years) => set({ source: 'years', years })}
            />
            <UnitRow
              id="h2d-months"
              label="Months"
              unit="mos"
              value={draft.months}
              error={errors.months}
              tip="Average Gregorian month = 30.436875 days."
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              Years and months use average Gregorian calendar durations. Actual calendar months and
              years vary in length.
            </p>
            <UnitRow
              id="h2d-weeks"
              label="Weeks"
              unit="wks"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = exactly 7 days = 168 hours."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />
            <UnitRow
              id="h2d-minutes"
              label="Minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 hour = 60 minutes."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />
            <UnitRow
              id="h2d-seconds"
              label="Seconds"
              unit="sec"
              value={draft.seconds}
              error={errors.seconds}
              tip="1 hour = 3,600 seconds."
              placeholder="—"
              onChange={(seconds) => set({ source: 'seconds', seconds })}
            />

            <div>
              <p className={labelClass}>
                Hours / Minutes / Seconds
                <InfoTooltip
                  label="Hours / Minutes / Seconds"
                  text="Compound duration. Values such as 1 hr 75 min 90 sec normalize to 2 hrs 16 min 30 sec in other fields."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="h2d-hms-h"
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
                        id="h2d-hms-m"
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
                        id="h2d-hms-s"
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
