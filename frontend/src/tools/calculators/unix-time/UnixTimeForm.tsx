'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UNIT_LABELS, type UnixFieldErrors, type UnixUnit } from './types';

export interface UnixTimeDraft {
  unixText: string;
  unit: UnixUnit;
  utcDate: string;
  utcTime: string;
  live: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface UnixTimeFormProps {
  draft: UnixTimeDraft;
  errors: UnixFieldErrors;
  referenceOpen: boolean;
  onToggleReference: () => void;
  onUnixChange: (value: string) => void;
  onUnitChange: (unit: UnixUnit) => void;
  onUtcDateChange: (value: string) => void;
  onUtcTimeChange: (value: string) => void;
  onUseCurrent: () => void;
  onLiveChange: (live: boolean) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function UnixTimeForm({
  draft,
  errors,
  referenceOpen,
  onToggleReference,
  onUnixChange,
  onUnitChange,
  onUtcDateChange,
  onUtcTimeChange,
  onUseCurrent,
  onLiveChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: UnixTimeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 bg-muted/35 px-4 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={referenceOpen}
          onClick={onToggleReference}
        >
          <span>Reference Time</span>
          <span className="text-xs font-medium text-muted-foreground">
            {referenceOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {referenceOpen ? (
          <div className="space-y-4 px-4 py-4">
            <div className="space-y-1.5">
              <label htmlFor="unix-timestamp" className={labelClass}>
                Unix Time
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="unix-timestamp"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.unixText}
                    placeholder="e.g. 0"
                    aria-invalid={Boolean(errors.unix)}
                    onChange={(event) => onUnixChange(event.target.value)}
                  />
                </div>
                <select
                  id="unix-unit"
                  className={selectClass}
                  value={draft.unit}
                  aria-label="Unix time unit"
                  onChange={(event) => onUnitChange(event.target.value as UnixUnit)}
                >
                  {(Object.keys(UNIT_LABELS) as UnixUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {UNIT_LABELS[unit]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.unix ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.unix}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Epoch: 1970-01-01 00:00:00 UTC. Negative values are allowed for earlier dates.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="unix-utc-date" className={labelClass}>
                  UTC Date
                </label>
                <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="unix-utc-date"
                    type="date"
                    className={inputClass}
                    value={draft.utcDate}
                    aria-invalid={Boolean(errors.utcDate)}
                    onChange={(event) => onUtcDateChange(event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="unix-utc-time" className={labelClass}>
                  UTC Time
                </label>
                <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="unix-utc-time"
                    type="time"
                    step={1}
                    className={inputClass}
                    value={draft.utcTime}
                    aria-invalid={Boolean(errors.utcTime)}
                    onChange={(event) => onUtcTimeChange(event.target.value)}
                  />
                </div>
              </div>
            </div>
            {errors.utcDate ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.utcDate}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Date and time are interpreted as Coordinated Universal Time (UTC).
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="h-10" onClick={onUseCurrent}>
                Use current time
              </Button>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={draft.live}
                  onChange={(event) => onLiveChange(event.target.checked)}
                />
                Live clock (updates every second)
              </label>
            </div>
          </div>
        ) : null}
      </div>

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
