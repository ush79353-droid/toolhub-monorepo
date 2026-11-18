'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SecondsConverterFieldErrors,
  SecondsConverterInput,
  SecondsSource,
} from './types';
import {
  DAYS_PER_GREGORIAN_YEAR,
  SECONDS_PER_GREGORIAN_MONTH,
  SECONDS_PER_GREGORIAN_YEAR,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SecondsConverterDraft {
  source: SecondsSource;
  otherOpen: boolean;
  seconds: string;
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  hmsHours: string;
  hmsMinutes: string;
  hmsSeconds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): SecondsConverterDraft {
  return {
    source: 'seconds',
    otherOpen: true,
    seconds: '',
    years: '',
    months: '',
    weeks: '',
    days: '',
    hours: '',
    minutes: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
}

export function draftToInput(draft: SecondsConverterDraft): SecondsConverterInput {
  return {
    source: draft.source,
    seconds: parseOptionalNumber(draft.seconds),
    years: parseOptionalNumber(draft.years),
    months: parseOptionalNumber(draft.months),
    weeks: parseOptionalNumber(draft.weeks),
    days: parseOptionalNumber(draft.days),
    hours: parseOptionalNumber(draft.hours),
    minutes: parseOptionalNumber(draft.minutes),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface SecondsConverterFormProps {
  draft: SecondsConverterDraft;
  errors: SecondsConverterFieldErrors;
  onDraftChange: (draft: SecondsConverterDraft) => void;
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

export function SecondsConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SecondsConverterFormProps) {
  const set = (patch: Partial<SecondsConverterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 min = 60 sec; 1 hr = 3,600 sec; 1 day = 86,400 sec; 1 week = 604,800 sec. Years and
        months use average Gregorian durations ({DAYS_PER_GREGORIAN_YEAR} days/year ={' '}
        {SECONDS_PER_GREGORIAN_YEAR} sec; month = year ÷ 12 = {SECONDS_PER_GREGORIAN_MONTH} sec).
        Actual calendar months and years vary. Signed durations are allowed.
      </div>

      <UnitRow
        id="sec-conv-sec"
        label="Time in seconds"
        unit="sec"
        value={draft.seconds}
        error={errors.seconds}
        tip="Enter a duration in seconds. Fractions and negative values are allowed."
        placeholder="Enter seconds"
        onChange={(seconds) => set({ source: 'seconds', seconds })}
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
              id="sec-conv-yr"
              label="Years"
              unit="yrs"
              value={draft.years}
              error={errors.years}
              tip={`Average Gregorian year = ${DAYS_PER_GREGORIAN_YEAR} days = ${SECONDS_PER_GREGORIAN_YEAR} sec.`}
              placeholder="—"
              onChange={(years) => set({ source: 'years', years })}
            />
            <UnitRow
              id="sec-conv-mo"
              label="Months"
              unit="mos"
              value={draft.months}
              error={errors.months}
              tip={`Average Gregorian month = year ÷ 12 = ${SECONDS_PER_GREGORIAN_MONTH} sec.`}
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              Years and months are average calendar durations, not fixed date ranges. Exact
              calendar conversion needs a start date.
            </p>
            <UnitRow
              id="sec-conv-wk"
              label="Weeks"
              unit="wks"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = exactly 604,800 seconds."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />
            <UnitRow
              id="sec-conv-d"
              label="Days"
              unit="days"
              value={draft.days}
              error={errors.days}
              tip="1 day = exactly 86,400 seconds."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="sec-conv-h"
              label="Hours"
              unit="hrs"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = exactly 3,600 seconds."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="sec-conv-min"
              label="Minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 minute = exactly 60 seconds."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />

            <div>
              <p className={labelClass}>
                Hours / minutes / seconds
                <InfoTooltip
                  label="Hours / minutes / seconds"
                  text="Compound hours / minutes / seconds. Sign is kept on the hours part when syncing. Values such as 1 hr 75 min normalize in other fields."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="sec-conv-hms-h"
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
                        id="sec-conv-hms-m"
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
                        id="sec-conv-hms-s"
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

      <p className="text-xs text-muted-foreground">
        1 min = 60 sec · 1 hr = 3,600 sec · 1 day = 86,400 sec
      </p>

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
