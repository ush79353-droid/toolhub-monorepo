'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DurationField, MinutesToHoursFieldErrors } from './types';

export interface MinutesToHoursDraft {
  hours: string;
  minutes: string;
  seconds: string;
  hmsHours: string;
  hmsMinutes: string;
  hmsSeconds: string;
  negative: boolean;
  activeField: DurationField | 'hmsHours' | 'hmsMinutes' | 'hmsSeconds' | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): MinutesToHoursDraft {
  return {
    hours: '2.5',
    minutes: '150',
    seconds: '9000',
    hmsHours: '02',
    hmsMinutes: '30',
    hmsSeconds: '00',
    negative: false,
    activeField: null,
  };
}

export function emptyDraft(): MinutesToHoursDraft {
  return {
    hours: '',
    minutes: '',
    seconds: '',
    hmsHours: '',
    hmsMinutes: '',
    hmsSeconds: '',
    negative: false,
    activeField: null,
  };
}

interface MinutesToHoursFormProps {
  draft: MinutesToHoursDraft;
  errors: MinutesToHoursFieldErrors;
  onDraftChange: (draft: MinutesToHoursDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function NumberField({
  id,
  label,
  suffix,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  suffix: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={value}
            placeholder="0"
            aria-invalid={Boolean(error)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
          {suffix}
        </span>
      </div>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MinutesToHoursForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MinutesToHoursFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Hours, minutes, and seconds stay synchronized. HH:MM:SS is a duration, not a clock; hours
        can exceed 24 and values may be negative.
      </div>

      <NumberField
        id="mth-hours"
        label="Hours"
        suffix="hrs"
        value={draft.hours}
        error={errors.hours}
        onChange={(hours) => onDraftChange({ ...draft, hours, activeField: 'hours' })}
      />
      <NumberField
        id="mth-minutes"
        label="Minutes"
        suffix="min"
        value={draft.minutes}
        error={errors.minutes}
        onChange={(minutes) => onDraftChange({ ...draft, minutes, activeField: 'minutes' })}
      />
      <NumberField
        id="mth-seconds"
        label="Seconds"
        suffix="sec"
        value={draft.seconds}
        error={errors.seconds}
        onChange={(seconds) => onDraftChange({ ...draft, seconds, activeField: 'seconds' })}
      />

      <fieldset className="space-y-1.5">
        <legend className={labelClass}>Time</legend>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mth-hms-hours"
              inputMode="numeric"
              autoComplete="off"
              className={inputClass}
              value={draft.negative && draft.hmsHours && !draft.hmsHours.startsWith('-') ? `-${draft.hmsHours}` : draft.hmsHours}
              placeholder="HH"
              aria-label="Duration hours"
              aria-invalid={Boolean(errors.hmsHours)}
              onChange={(event) => {
                const raw = event.target.value;
                const negative = raw.trim().startsWith('-');
                const hmsHours = raw.replace(/^\s*-/, '');
                onDraftChange({ ...draft, hmsHours, negative, activeField: 'hmsHours' });
              }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">:</span>
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mth-hms-minutes"
              inputMode="numeric"
              autoComplete="off"
              className={inputClass}
              value={draft.hmsMinutes}
              placeholder="MM"
              aria-label="Duration minutes"
              aria-invalid={Boolean(errors.hmsMinutes)}
              onChange={(event) =>
                onDraftChange({ ...draft, hmsMinutes: event.target.value, activeField: 'hmsMinutes' })
              }
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">:</span>
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mth-hms-seconds"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.hmsSeconds}
              placeholder="SS"
              aria-label="Duration seconds"
              aria-invalid={Boolean(errors.hmsSeconds)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  hmsSeconds: event.target.value,
                  activeField: 'hmsSeconds',
                })
              }
            />
          </div>
        </div>
        {errors.hmsHours || errors.hmsMinutes || errors.hmsSeconds ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.hmsHours ?? errors.hmsMinutes ?? errors.hmsSeconds}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Duration as HH : MM : SS (hours do not wrap at 24).</p>
        )}
      </fieldset>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
