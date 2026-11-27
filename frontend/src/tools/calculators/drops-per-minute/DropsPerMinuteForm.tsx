'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromMinutes,
  fromMl,
  parseNumber,
  toMinutes,
  toMl,
} from './calculation';
import type {
  DropsPerMinuteFieldErrors,
  DropsPerMinuteInput,
  DropsPerMinuteResult,
  TimeUnit,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: DropsPerMinuteInput;
  errors: DropsPerMinuteFieldErrors;
  result: DropsPerMinuteResult | null;
  onChange: (input: DropsPerMinuteInput) => void;
}

export function DropsPerMinuteForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<DropsPerMinuteInput>) =>
    onChange({ ...input, ...patch });

  const changeVolumeUnit = (next: VolumeUnit) => {
    const raw = parseNumber(input.volumeText);
    if (raw !== null && raw > 0) {
      const ml = toMl(raw, input.volumeUnit);
      set({ volumeUnit: next, volumeText: formatField(fromMl(ml, next)) });
      return;
    }
    set({ volumeUnit: next });
  };

  const changeTimeUnit = (next: TimeUnit) => {
    const raw = parseNumber(input.timeText);
    if (raw !== null && raw > 0) {
      const min = toMinutes(raw, input.timeUnit);
      set({ timeUnit: next, timeText: formatField(fromMinutes(min, next)) });
      return;
    }
    set({ timeUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Drops per minute inputs">
        <div>
          <label className={labelClass} htmlFor="dpm-volume">
            Volume
          </label>
          <FieldShell error={errors.volumeText}>
            <input
              id="dpm-volume"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.volumeText}
              onChange={(e) => set({ volumeText: e.target.value })}
              aria-invalid={Boolean(errors.volumeText)}
            />
            <select
              className={unitSelectClass}
              value={input.volumeUnit}
              onChange={(e) => changeVolumeUnit(e.target.value as VolumeUnit)}
              aria-label="Volume unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.volumeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.volumeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpm-time">
            Time
            <InfoTooltip text="Infusion duration. Converted to minutes before math." />
          </label>
          <FieldShell error={errors.timeText}>
            <input
              id="dpm-time"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.timeText}
              onChange={(e) => set({ timeText: e.target.value })}
              aria-invalid={Boolean(errors.timeText)}
            />
            <select
              className={unitSelectClass}
              value={input.timeUnit}
              onChange={(e) => changeTimeUnit(e.target.value as TimeUnit)}
              aria-label="Time unit"
            >
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </FieldShell>
          {errors.timeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpm-factor">
            Drop factor
            <InfoTooltip text="Tubing calibration in drops per millilitre (gtts/mL). Screenshot default 15." />
          </label>
          <FieldShell error={errors.dropFactorText}>
            <input
              id="dpm-factor"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.dropFactorText}
              onChange={(e) => set({ dropFactorText: e.target.value })}
              aria-invalid={Boolean(errors.dropFactorText)}
            />
            <span className={unitFixed}>gtts/mL</span>
          </FieldShell>
          {errors.dropFactorText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dropFactorText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpm-result">
            Drops per minute
          </label>
          <FieldShell muted>
            <input
              id="dpm-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedDropsPerMinute ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>gtts/min</span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-label="Additional metrics">
        <p className="text-sm font-semibold text-accent">Additional metrics</p>
        <div>
          <label className={labelClass} htmlFor="dpm-hour">
            Drops per hour
          </label>
          <FieldShell muted>
            <input
              id="dpm-hour"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedDropsPerHour ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>gtts/h</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="dpm-rate">
            Drip rate
          </label>
          <FieldShell muted>
            <input
              id="dpm-rate"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMlPerHour ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mL/h</span>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
