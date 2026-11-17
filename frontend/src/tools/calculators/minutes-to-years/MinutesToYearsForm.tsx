'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DAYS_PER_AVERAGE_YEAR,
  MINUTES_PER_AVERAGE_MONTH,
  MINUTES_PER_AVERAGE_YEAR,
} from './types';
import type {
  MinutesToYearsFieldErrors,
  MinutesToYearsInput,
  MinutesToYearsSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MinutesToYearsDraft {
  source: MinutesToYearsSource;
  minutes: string;
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
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

export function emptyDraft(): MinutesToYearsDraft {
  return {
    source: 'minutes',
    minutes: '',
    years: '',
    months: '',
    weeks: '',
    days: '',
    hours: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
    otherOpen: false,
  };
}

export function draftToInput(draft: MinutesToYearsDraft): MinutesToYearsInput {
  return {
    source: draft.source,
    minutes: parseOptionalNumber(draft.minutes),
    years: parseOptionalNumber(draft.years),
    months: parseOptionalNumber(draft.months),
    weeks: parseOptionalNumber(draft.weeks),
    days: parseOptionalNumber(draft.days),
    hours: parseOptionalNumber(draft.hours),
    seconds: parseOptionalNumber(draft.seconds),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface MinutesToYearsFormProps {
  draft: MinutesToYearsDraft;
  errors: MinutesToYearsFieldErrors;
  onDraftChange: (draft: MinutesToYearsDraft) => void;
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

export function MinutesToYearsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MinutesToYearsFormProps) {
  const set = (patch: Partial<MinutesToYearsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Average year = {DAYS_PER_AVERAGE_YEAR} days = {MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')}{' '}
        minutes (not a specific calendar year). Average month = 1/12 year ={' '}
        {MINUTES_PER_AVERAGE_MONTH.toLocaleString('en-US')} minutes.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Minutes to Years</p>
        <div className="space-y-3">
          <UnitRow
            id="m2y-minutes"
            label="Time in minutes"
            unit="min"
            value={draft.minutes}
            error={errors.minutes}
            tip={`Years = minutes ÷ ${MINUTES_PER_AVERAGE_YEAR}.`}
            placeholder="Enter minutes"
            onChange={(minutes) => set({ source: 'minutes', minutes })}
          />
          <UnitRow
            id="m2y-years"
            label="Time in years"
            unit="yr"
            value={draft.years}
            error={errors.years}
            tip={`Minutes = years × ${MINUTES_PER_AVERAGE_YEAR} (average year).`}
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
          <span>Other Time Units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <UnitRow
              id="m2y-months"
              label="Time in months"
              unit="mo"
              value={draft.months}
              error={errors.months}
              tip={`Average month = ${MINUTES_PER_AVERAGE_MONTH} minutes (1/12 year).`}
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <UnitRow
              id="m2y-weeks"
              label="Time in weeks"
              unit="wk"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = 10,080 minutes."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />
            <UnitRow
              id="m2y-days"
              label="Time in days"
              unit="d"
              value={draft.days}
              error={errors.days}
              tip="1 day = 1,440 minutes."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="m2y-hours"
              label="Time in hours"
              unit="h"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = 60 minutes."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="m2y-seconds"
              label="Time in seconds"
              unit="s"
              value={draft.seconds}
              error={errors.seconds}
              tip="1 minute = 60 seconds."
              placeholder="—"
              onChange={(seconds) => set({ source: 'seconds', seconds })}
            />

            <div>
              <p className={labelClass}>
                Time in hours, minutes, and seconds
                <InfoTooltip
                  label="Hours / Minutes / Seconds"
                  text="Compound duration, not clock time. Minutes and seconds normalize to [0, 60); hours may exceed 24."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    ['hmsHours', 'h', 'Hours', 'hrs'],
                    ['hmsMinutes', 'm', 'Minutes', 'min'],
                    ['hmsSeconds', 's', 'Seconds', 'sec'],
                  ] as const
                ).map(([key, short, aria, unit]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                        <input
                          id={`m2y-hms-${short}`}
                          inputMode="decimal"
                          autoComplete="off"
                          className={inputClass}
                          value={draft[key]}
                          placeholder={aria}
                          aria-label={`Compound ${aria.toLowerCase()}`}
                          aria-invalid={Boolean(errors[key])}
                          onChange={(event) =>
                            set({ source: 'hms', [key]: event.target.value })
                          }
                        />
                      </div>
                      <span className={unitBadgeClass} aria-hidden="true">
                        {unit}
                      </span>
                    </div>
                    {errors[key] ? (
                      <p className="text-xs text-red-600" role="alert">
                        {errors[key]}
                      </p>
                    ) : null}
                  </div>
                ))}
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
