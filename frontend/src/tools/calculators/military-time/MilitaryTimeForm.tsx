'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DIRECTION_LABELS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  type ConversionDirection,
  type DayPeriod,
  type MilitaryFieldErrors,
} from './types';

export interface MilitaryTimeDraft {
  direction: ConversionDirection;
  militaryText: string;
  hour: number;
  minute: number;
  period: DayPeriod;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(): MilitaryTimeDraft {
  return {
    direction: 'military-to-standard',
    militaryText: '1830',
    hour: 6,
    minute: 30,
    period: 'PM',
  };
}

export function emptyDraft(): MilitaryTimeDraft {
  return {
    direction: 'military-to-standard',
    militaryText: '',
    hour: 12,
    minute: 0,
    period: 'AM',
  };
}

interface MilitaryTimeFormProps {
  draft: MilitaryTimeDraft;
  errors: MilitaryFieldErrors;
  onDirectionChange: (direction: ConversionDirection) => void;
  onMilitaryChange: (value: string) => void;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onPeriodChange: (period: DayPeriod) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MilitaryTimeForm({
  draft,
  errors,
  onDirectionChange,
  onMilitaryChange,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MilitaryTimeFormProps) {
  const militaryMode = draft.direction === 'military-to-standard';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Military time uses a 24-hour clock and is usually written as four digits without a colon.
        Examples: 1:00 PM = 1300, 6:30 PM = 1830, midnight = 0000.
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Conversion</legend>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          {(['military-to-standard', 'standard-to-military'] as const).map((direction) => (
            <label
              key={direction}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="military-time-direction"
                className="h-4 w-4 accent-primary"
                checked={draft.direction === direction}
                onChange={() => onDirectionChange(direction)}
              />
              <span>{DIRECTION_LABELS[direction]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {militaryMode ? (
        <div className="space-y-1.5">
          <label htmlFor="military-time-input" className={labelClass}>
            Military time
          </label>
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="military-time-input"
              inputMode="numeric"
              autoComplete="off"
              className={inputClass}
              value={draft.militaryText}
              placeholder="e.g. 1830 or 18:30"
              aria-invalid={Boolean(errors.military)}
              onChange={(event) => onMilitaryChange(event.target.value)}
            />
          </div>
          {errors.military ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.military}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Accepted range: 0000–2359.</p>
          )}
        </div>
      ) : (
        <fieldset className="space-y-2">
          <legend className={labelClass}>Standard time</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="military-hour" className={labelClass}>
                Hour
              </label>
              <select
                id="military-hour"
                className={selectClass}
                value={draft.hour}
                aria-invalid={Boolean(errors.hour)}
                onChange={(event) => onHourChange(Number(event.target.value))}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="military-minute" className={labelClass}>
                Minute
              </label>
              <select
                id="military-minute"
                className={selectClass}
                value={draft.minute}
                aria-invalid={Boolean(errors.minute)}
                onChange={(event) => onMinuteChange(Number(event.target.value))}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <option key={minute} value={minute}>
                    {String(minute).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="military-period" className={labelClass}>
                Period
              </label>
              <select
                id="military-period"
                className={selectClass}
                value={draft.period}
                onChange={(event) => onPeriodChange(event.target.value as DayPeriod)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          {errors.hour || errors.minute ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.hour ?? errors.minute}
            </p>
          ) : null}
        </fieldset>
      )}

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
