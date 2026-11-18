'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WeeksToYearsFieldErrors,
  WeeksToYearsInput,
  WeeksYearsSource,
} from './types';
import {
  DAYS_PER_YEAR,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  WEEKS_PER_YEAR,
} from './types';
import { parseOptionalNumber } from './validation';

export interface WeeksToYearsDraft {
  source: WeeksYearsSource;
  otherOpen: boolean;
  weeks: string;
  years: string;
  months: string;
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

export function emptyDraft(): WeeksToYearsDraft {
  return {
    source: 'weeks',
    otherOpen: true,
    weeks: '',
    years: '',
    months: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
}

export function draftToInput(draft: WeeksToYearsDraft): WeeksToYearsInput {
  return {
    source: draft.source,
    weeks: parseOptionalNumber(draft.weeks),
    years: parseOptionalNumber(draft.years),
    months: parseOptionalNumber(draft.months),
    days: parseOptionalNumber(draft.days),
    hours: parseOptionalNumber(draft.hours),
    minutes: parseOptionalNumber(draft.minutes),
    seconds: parseOptionalNumber(draft.seconds),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface WeeksToYearsFormProps {
  draft: WeeksToYearsDraft;
  errors: WeeksToYearsFieldErrors;
  onDraftChange: (draft: WeeksToYearsDraft) => void;
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

export function WeeksToYearsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: WeeksToYearsFormProps) {
  const set = (patch: Partial<WeeksToYearsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Uses an average Gregorian year of {DAYS_PER_YEAR} days = {WEEKS_PER_YEAR} weeks (
        {SECONDS_PER_YEAR.toLocaleString('en-US')} sec). 1 week = 7 days ={' '}
        {SECONDS_PER_WEEK.toLocaleString('en-US')} sec. Actual calendar years are 365 or 366 days.
      </div>

      <UnitRow
        id="w2y-wk"
        label="Time in weeks"
        unit="wks"
        value={draft.weeks}
        error={errors.weeks}
        tip={`1 week = exactly 7 days = ${SECONDS_PER_WEEK.toLocaleString('en-US')} seconds.`}
        placeholder="Enter weeks"
        onChange={(weeks) => set({ source: 'weeks', weeks })}
      />

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Time in other units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <UnitRow
              id="w2y-yr"
              label="Time in years"
              unit="yrs"
              value={draft.years}
              error={errors.years}
              tip={`Average Gregorian year = ${DAYS_PER_YEAR} days ≈ ${WEEKS_PER_YEAR} weeks.`}
              placeholder="—"
              onChange={(years) => set({ source: 'years', years })}
            />
            <UnitRow
              id="w2y-mo"
              label="Time in months"
              unit="mos"
              value={draft.months}
              error={errors.months}
              tip="Average Gregorian month = year ÷ 12."
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <UnitRow
              id="w2y-d"
              label="Time in days"
              unit="days"
              value={draft.days}
              error={errors.days}
              tip="1 day = exactly 86,400 seconds."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="w2y-h"
              label="Time in hours"
              unit="hrs"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = exactly 3,600 seconds."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="w2y-min"
              label="Time in minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 minute = exactly 60 seconds."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />
            <UnitRow
              id="w2y-sec"
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
                Time in hours, minutes, and seconds
                <InfoTooltip
                  label="Time in hours, minutes, and seconds"
                  text="Compound hours / minutes / seconds for the same total duration."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="w2y-hms-h"
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
                        id="w2y-hms-m"
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
                        id="w2y-hms-s"
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
