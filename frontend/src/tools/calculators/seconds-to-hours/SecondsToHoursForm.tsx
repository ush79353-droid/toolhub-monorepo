'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SecHoursSource,
  SecondsToHoursFieldErrors,
  SecondsToHoursInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SecondsToHoursDraft {
  source: SecHoursSource;
  seconds: string;
  hours: string;
  hmsHours: string;
  hmsMinutes: string;
  hmsSeconds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): SecondsToHoursDraft {
  return {
    source: 'seconds',
    seconds: '',
    hours: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
  };
}

export function draftToInput(draft: SecondsToHoursDraft): SecondsToHoursInput {
  return {
    source: draft.source,
    seconds: parseOptionalNumber(draft.seconds),
    hours: parseOptionalNumber(draft.hours),
    hmsHours: parseOptionalNumber(draft.hmsHours),
    hmsMinutes: parseOptionalNumber(draft.hmsMinutes),
    hmsSeconds: parseOptionalNumber(draft.hmsSeconds),
  };
}

interface SecondsToHoursFormProps {
  draft: SecondsToHoursDraft;
  errors: SecondsToHoursFieldErrors;
  onDraftChange: (draft: SecondsToHoursDraft) => void;
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

export function SecondsToHoursForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SecondsToHoursFormProps) {
  const set = (patch: Partial<SecondsToHoursDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 hour = 3,600 seconds. Enter seconds or hours — the other updates instantly. The
        Time fields show hours, minutes, and seconds. Negative values are allowed for signed
        durations.
      </div>

      <UnitRow
        id="s2h-seconds"
        label="Seconds"
        unit="sec"
        value={draft.seconds}
        error={errors.seconds}
        tip="Hours = seconds ÷ 3,600."
        placeholder="Enter seconds"
        onChange={(seconds) => set({ source: 'seconds', seconds })}
      />
      <UnitRow
        id="s2h-hours"
        label="Hours"
        unit="hrs"
        value={draft.hours}
        error={errors.hours}
        tip="Seconds = hours × 3,600."
        placeholder="Enter hours"
        onChange={(hours) => set({ source: 'hours', hours })}
      />

      <div>
        <p className={labelClass}>
          Time
          <InfoTooltip
            label="Time"
            text="Compound duration as hours / minutes / seconds. Overflow normalizes in other fields (for example 0 hr 90 min → 1 hr 30 min)."
          />
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="s2h-hms-h"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.hmsHours}
                  placeholder="Hours"
                  aria-label="Compound hours"
                  aria-invalid={Boolean(errors.hmsHours)}
                  onChange={(event) => set({ source: 'hms', hmsHours: event.target.value })}
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
                  id="s2h-hms-m"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.hmsMinutes}
                  placeholder="Minutes"
                  aria-label="Compound minutes"
                  aria-invalid={Boolean(errors.hmsMinutes)}
                  onChange={(event) => set({ source: 'hms', hmsMinutes: event.target.value })}
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
                  id="s2h-hms-s"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.hmsSeconds}
                  placeholder="Seconds"
                  aria-label="Compound seconds"
                  aria-invalid={Boolean(errors.hmsSeconds)}
                  onChange={(event) => set({ source: 'hms', hmsSeconds: event.target.value })}
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
