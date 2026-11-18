'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MsSource, MsToSecondsFieldErrors, MsToSecondsInput } from './types';
import {
  DAYS_PER_GREGORIAN_YEAR,
  MILLISECONDS_PER_GREGORIAN_MONTH,
  MILLISECONDS_PER_GREGORIAN_YEAR,
  MILLISECONDS_PER_SECOND,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MsToSecondsDraft {
  source: MsSource;
  otherOpen: boolean;
  milliseconds: string;
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

export function emptyDraft(): MsToSecondsDraft {
  return {
    source: 'milliseconds',
    otherOpen: true,
    milliseconds: '',
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

export function draftToInput(draft: MsToSecondsDraft): MsToSecondsInput {
  return {
    source: draft.source,
    milliseconds: parseOptionalNumber(draft.milliseconds),
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

interface MsToSecondsFormProps {
  draft: MsToSecondsDraft;
  errors: MsToSecondsFieldErrors;
  onDraftChange: (draft: MsToSecondsDraft) => void;
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

export function MsToSecondsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MsToSecondsFormProps) {
  const set = (patch: Partial<MsToSecondsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 s = {MILLISECONDS_PER_SECOND} ms. Years and months use average Gregorian durations (
        {DAYS_PER_GREGORIAN_YEAR} days/year ≈ {MILLISECONDS_PER_GREGORIAN_YEAR} ms; month = year ÷
        12 ≈ {MILLISECONDS_PER_GREGORIAN_MONTH} ms). Actual calendar months and years vary. Signed
        durations are allowed.
      </div>

      <UnitRow
        id="ms2s-ms"
        label="Milliseconds"
        unit="ms"
        value={draft.milliseconds}
        error={errors.milliseconds}
        tip={`seconds = ms ÷ ${MILLISECONDS_PER_SECOND}.`}
        placeholder="Enter milliseconds"
        onChange={(milliseconds) => set({ source: 'milliseconds', milliseconds })}
      />

      <UnitRow
        id="ms2s-s"
        label="Seconds"
        unit="s"
        value={draft.seconds}
        error={errors.seconds}
        tip={`ms = seconds × ${MILLISECONDS_PER_SECOND}.`}
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
          <span>Other Units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <UnitRow
              id="ms2s-yr"
              label="Years"
              unit="yr"
              value={draft.years}
              error={errors.years}
              tip={`Average Gregorian year = ${DAYS_PER_GREGORIAN_YEAR} days.`}
              placeholder="—"
              onChange={(years) => set({ source: 'years', years })}
            />
            <UnitRow
              id="ms2s-mo"
              label="Months"
              unit="mo"
              value={draft.months}
              error={errors.months}
              tip="Average Gregorian month = year ÷ 12."
              placeholder="—"
              onChange={(months) => set({ source: 'months', months })}
            />
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              Years and months are average calendar durations, not fixed date ranges. Exact
              calendar conversion needs a start date.
            </p>
            <UnitRow
              id="ms2s-wk"
              label="Weeks"
              unit="wk"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = exactly 604,800,000 ms."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />
            <UnitRow
              id="ms2s-d"
              label="Days"
              unit="d"
              value={draft.days}
              error={errors.days}
              tip="1 day = exactly 86,400,000 ms."
              placeholder="—"
              onChange={(days) => set({ source: 'days', days })}
            />
            <UnitRow
              id="ms2s-h"
              label="Hours"
              unit="h"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = exactly 3,600,000 ms."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="ms2s-min"
              label="Minutes"
              unit="min"
              value={draft.minutes}
              error={errors.minutes}
              tip="1 minute = exactly 60,000 ms."
              placeholder="—"
              onChange={(minutes) => set({ source: 'minutes', minutes })}
            />

            <div>
              <p className={labelClass}>
                Mixed Units
                <InfoTooltip
                  label="Mixed Units"
                  text="Compound hours / minutes / seconds. Values such as 1 hr 75 min normalize in other fields. Sign is kept on the hours part when syncing."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="ms2s-hms-h"
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
                      h
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
                        id="ms2s-hms-m"
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
                        id="ms2s-hms-s"
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
                      s
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
        1 s = {MILLISECONDS_PER_SECOND} ms · seconds = ms ÷ {MILLISECONDS_PER_SECOND}
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
