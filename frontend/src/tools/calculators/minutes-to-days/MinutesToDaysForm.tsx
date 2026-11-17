'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MINUTES_PER_DAY } from './types';
import type {
  MinutesToDaysFieldErrors,
  MinutesToDaysInput,
  MinutesToDaysSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MinutesToDaysDraft {
  source: MinutesToDaysSource;
  minutes: string;
  days: string;
  seconds: string;
  hours: string;
  weeks: string;
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

export function emptyDraft(): MinutesToDaysDraft {
  return {
    source: 'minutes',
    minutes: '',
    days: '',
    seconds: '',
    hours: '',
    weeks: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
    otherOpen: false,
  };
}

export function draftToInput(draft: MinutesToDaysDraft): MinutesToDaysInput {
  return {
    source: draft.source,
    minutes: parseOptionalNumber(draft.minutes),
    days: parseOptionalNumber(draft.days),
    seconds: parseOptionalNumber(draft.seconds),
    hours: parseOptionalNumber(draft.hours),
    weeks: parseOptionalNumber(draft.weeks),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface MinutesToDaysFormProps {
  draft: MinutesToDaysDraft;
  errors: MinutesToDaysFieldErrors;
  onDraftChange: (draft: MinutesToDaysDraft) => void;
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

export function MinutesToDaysForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MinutesToDaysFormProps) {
  const set = (patch: Partial<MinutesToDaysDraft>) => onDraftChange({ ...draft, ...patch });

  const applyExample = (minutes: number) => {
    onDraftChange({
      ...draft,
      source: 'minutes',
      minutes: String(minutes),
      otherOpen: draft.otherOpen,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 day = {MINUTES_PER_DAY} minutes (24 × 60). Enter minutes or days — the other
        updates instantly. Other equivalent amounts stay optional.
      </div>

      <div className="rounded-xl border border-border p-3.5 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-accent">Minutes to Days</p>
        <div className="space-y-3">
          <UnitRow
            id="m2d-minutes"
            label="Time in minutes"
            unit="min"
            value={draft.minutes}
            error={errors.minutes}
            tip={`Days = minutes ÷ ${MINUTES_PER_DAY}.`}
            placeholder="Enter minutes"
            onChange={(minutes) => set({ source: 'minutes', minutes })}
          />
          <UnitRow
            id="m2d-days"
            label="Time in days"
            unit="days"
            value={draft.days}
            error={errors.days}
            tip={`Minutes = days × ${MINUTES_PER_DAY}.`}
            placeholder="Enter days"
            onChange={(days) => set({ source: 'days', days })}
          />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[13px] font-medium text-accent">Check our examples</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-10 justify-start text-left text-sm"
              onClick={() => applyExample(1440)}
            >
              Example 1 — Minutes in a day (1440 min = 1 day)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 justify-start text-left text-sm"
              onClick={() => applyExample(180)}
            >
              Example 2 — Marathon training (180 min = 0.125 days)
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => set({ otherOpen: !draft.otherOpen })}
          aria-expanded={draft.otherOpen}
        >
          <span>Other equivalent amounts</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <UnitRow
              id="m2d-seconds"
              label="Seconds"
              unit="sec"
              value={draft.seconds}
              error={errors.seconds}
              tip="1 minute = 60 seconds."
              placeholder="—"
              onChange={(seconds) => set({ source: 'seconds', seconds })}
            />
            <UnitRow
              id="m2d-hours"
              label="Hours"
              unit="hrs"
              value={draft.hours}
              error={errors.hours}
              tip="1 hour = 60 minutes."
              placeholder="—"
              onChange={(hours) => set({ source: 'hours', hours })}
            />
            <UnitRow
              id="m2d-weeks"
              label="Weeks"
              unit="wks"
              value={draft.weeks}
              error={errors.weeks}
              tip="1 week = 10,080 minutes."
              placeholder="—"
              onChange={(weeks) => set({ source: 'weeks', weeks })}
            />

            <div>
              <p className={labelClass}>
                Hours / Minutes / Seconds
                <InfoTooltip
                  label="Hours / Minutes / Seconds"
                  text="Compound duration, not clock time. Values normalize across linked fields."
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="m2d-hms-h"
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
                        id="m2d-hms-m"
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
                        id="m2d-hms-s"
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
