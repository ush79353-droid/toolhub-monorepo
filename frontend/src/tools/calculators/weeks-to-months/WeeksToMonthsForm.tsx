'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WeeksMonthsSource,
  WeeksToMonthsFieldErrors,
  WeeksToMonthsInput,
} from './types';
import {
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  WEEKS_PER_MONTH,
} from './types';
import { parseOptionalNumber } from './validation';

export interface WeeksToMonthsDraft {
  source: WeeksMonthsSource;
  otherOpen: boolean;
  weeks: string;
  months: string;
  years: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  hmsHours: string;
  hmsMinutes: string;
  hmsSeconds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): WeeksToMonthsDraft {
  return {
    source: 'weeks',
    otherOpen: true,
    weeks: '',
    months: '',
    years: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
}

export function draftToInput(draft: WeeksToMonthsDraft): WeeksToMonthsInput {
  return {
    source: draft.source,
    weeks: parseOptionalNumber(draft.weeks),
    months: parseOptionalNumber(draft.months),
    years: parseOptionalNumber(draft.years),
    days: parseOptionalNumber(draft.days),
    hours: parseOptionalNumber(draft.hours),
    minutes: parseOptionalNumber(draft.minutes),
    seconds: parseOptionalNumber(draft.seconds),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface WeeksToMonthsFormProps {
  draft: WeeksToMonthsDraft;
  errors: WeeksToMonthsFieldErrors;
  onDraftChange: (draft: WeeksToMonthsDraft) => void;
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

export function WeeksToMonthsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: WeeksToMonthsFormProps) {
  const set = (patch: Partial<WeeksToMonthsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Uses an average Gregorian month of ≈ {DAYS_PER_MONTH} days ({WEEKS_PER_MONTH} weeks). Mean
        year = {DAYS_PER_YEAR} days = {SECONDS_PER_YEAR.toLocaleString('en-US')} sec; mean month ={' '}
        {SECONDS_PER_MONTH.toLocaleString('en-US')} sec; 1 week ={' '}
        {SECONDS_PER_WEEK.toLocaleString('en-US')} sec. Actual calendar months are 28–31 days.
      </div>

      <p className="text-sm font-semibold text-accent">Weeks to months</p>

      <UnitRow
        id="w2m-wk"
        label="Time in weeks"
        unit="wks"
        value={draft.weeks}
        error={errors.weeks}
        tip={`1 week = exactly 7 days = ${SECONDS_PER_WEEK.toLocaleString('en-US')} seconds.`}
        placeholder="Enter weeks"
        onChange={(weeks) => set({ source: 'weeks', weeks })}
      />
      <UnitRow
        id="w2m-mo"
        label="Time in months"
        unit="mos"
        value={draft.months}
        error={errors.months}
        tip={`Average Gregorian month ≈ ${WEEKS_PER_MONTH} weeks (${SECONDS_PER_MONTH.toLocaleString('en-US')} sec).`}
        placeholder="Enter months"
        onChange={(months) => set({ source: 'months', months })}
      />

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Other time units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <UnitRow
              id="w2m-yr"
              label="Time in years"
              unit="yrs"
              value={draft.years}
              error={errors.years}
              tip={`Average Gregorian year = ${DAYS_PER_YEAR} days.`}
              placeholder="—"
              onChange={(years) => set({ source: 'years', years })}
            />
            <UnitRow
              id="w2m-d"
              label="Time in days"
              unit="days"
              value={draft.days}
              error={errors.days}
              tip="1 day = exactly 86,400 seconds."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="w2m-h"
              label="Time in hours"
              unit="hrs"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = exactly 3,600 seconds."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="w2m-min"
              label="Time in minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 minute = exactly 60 seconds."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />
            <UnitRow
              id="w2m-sec"
              label="Time in seconds"
              unit="sec"
              value={draft.seconds}
              error={errors.seconds}
              tip="Canonical SI second."
              placeholder="—"
              onChange={(seconds) => set({ source: 'seconds', seconds })}
            />

            <div>
              <p className={labelClass}>
                Time in hours, minutes, seconds
                <InfoTooltip
                  label="Time in hours, minutes, seconds"
                  text="Compound hours / minutes / seconds for the same total duration."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="w2m-hms-h"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.hmsHours}
                        placeholder="hrs"
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
                        id="w2m-hms-m"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.hmsMinutes}
                        placeholder="min"
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
                        id="w2m-hms-s"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.hmsSeconds}
                        placeholder="sec"
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
