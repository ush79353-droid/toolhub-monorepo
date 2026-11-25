'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatBalanceMl,
  formatMeasure,
  formatRate,
  parseNumber,
  timeFromHours,
  timeToHours,
  volumeFromMl,
  volumeToMl,
  weightFromKg,
  weightToKg,
} from './calculation';
import type {
  TimeUnit,
  UrineOutputFieldErrors,
  UrineOutputInput,
  UrineOutputResult,
  VolumeUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
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

interface FormProps {
  input: UrineOutputInput;
  errors: UrineOutputFieldErrors;
  result: UrineOutputResult | null;
  onChange: (input: UrineOutputInput) => void;
}

export function UrineOutputForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<UrineOutputInput>) =>
    onChange({ ...input, ...patch });

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const n = parseNumber(input.weightText);
    if (n === null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(n, input.weightUnit);
    set({ weightUnit: next, weightText: formatMeasure(weightFromKg(kg, next), 4) });
  };

  const switchTimeUnit = (next: TimeUnit) => {
    if (next === input.timeUnit) return;
    const n = parseNumber(input.timeText);
    if (n === null) {
      set({ timeUnit: next });
      return;
    }
    const hrs = timeToHours(n, input.timeUnit);
    set({ timeUnit: next, timeText: formatMeasure(timeFromHours(hrs, next), 4) });
  };

  const switchVolume = (
    field: 'urineText' | 'intakeText',
    unitField: 'urineUnit' | 'intakeUnit',
    next: VolumeUnit,
    currentUnit: VolumeUnit,
  ) => {
    if (next === currentUnit) return;
    const n = parseNumber(input[field]);
    if (n === null) {
      set({ [unitField]: next });
      return;
    }
    const ml = volumeToMl(n, currentUnit);
    set({
      [unitField]: next,
      [field]: formatMeasure(volumeFromMl(ml, next), 4),
    });
  };

  const rateDisplay =
    result?.rateMlKgHr != null ? formatRate(result.rateMlKgHr) : '';
  const balanceDisplay =
    result?.fluidBalanceMl != null
      ? formatBalanceMl(result.fluidBalanceMl)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Input data">
        <h3 className="text-sm font-semibold text-accent">Input data</h3>

        <div>
          <p className={labelClass}>Your patient&apos;s age</p>
          <fieldset className="space-y-2.5">
            <legend className="sr-only">Patient age group</legend>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
              <input
                type="radio"
                name="urine-age"
                className="h-4 w-4 accent-primary"
                checked={input.ageGroup === 'adult'}
                onChange={() => set({ ageGroup: 'adult' })}
              />
              ≥18 years
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
              <input
                type="radio"
                name="urine-age"
                className="h-4 w-4 accent-primary"
                checked={input.ageGroup === 'pediatric'}
                onChange={() => set({ ageGroup: 'pediatric' })}
              />
              &lt;18 years
            </label>
          </fieldset>
        </div>

        <div>
          <label className={labelClass} htmlFor="uo-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="uo-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uo-time">
            Time
            <InfoTooltip text="Collection interval — typically 24 hours for daily urine output." />
          </label>
          <FieldShell error={errors.timeText}>
            <input
              id="uo-time"
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
              onChange={(e) => switchTimeUnit(e.target.value as TimeUnit)}
              aria-label="Time unit"
            >
              <option value="hrs">hrs</option>
              <option value="days">days</option>
            </select>
          </FieldShell>
          {errors.timeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uo-urine">
            Urine volume
            <InfoTooltip text="Total measured urine over the selected interval." />
          </label>
          <FieldShell error={errors.urineText}>
            <input
              id="uo-urine"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineText}
              onChange={(e) => set({ urineText: e.target.value })}
              aria-invalid={Boolean(errors.urineText)}
            />
            <select
              className={unitSelectClass}
              value={input.urineUnit}
              onChange={(e) =>
                switchVolume(
                  'urineText',
                  'urineUnit',
                  e.target.value as VolumeUnit,
                  input.urineUnit,
                )
              }
              aria-label="Urine volume unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.urineText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.urineText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uo-intake">
            Fluid intake
            <InfoTooltip text="Optional. Used only for intake minus urine balance — not required for the rate." />
          </label>
          <FieldShell error={errors.intakeText}>
            <input
              id="uo-intake"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.intakeText}
              onChange={(e) => set({ intakeText: e.target.value })}
              aria-invalid={Boolean(errors.intakeText)}
            />
            <select
              className={unitSelectClass}
              value={input.intakeUnit}
              onChange={(e) =>
                switchVolume(
                  'intakeText',
                  'intakeUnit',
                  e.target.value as VolumeUnit,
                  input.intakeUnit,
                )
              }
              aria-label="Fluid intake unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.intakeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.intakeText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Results">
        <h3 className="text-sm font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="uo-rate">
            Urine output rate
            <InfoTooltip text="mL/kg/h = urine ÷ (weight × hours)." />
          </label>
          <FieldShell muted>
            <input
              id="uo-rate"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={rateDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
            <span
              className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              mL/kg/h
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="uo-balance">
            Fluid balance
            <InfoTooltip text="Intake minus urine when intake is entered. Omits insensible and other unmeasured losses." />
          </label>
          <FieldShell muted>
            <input
              id="uo-balance"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={balanceDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
            <span
              className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              mL
            </span>
          </FieldShell>
          {result?.balanceNote && input.intakeText.trim() !== '' ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.balanceNote}
            </p>
          ) : input.intakeText.trim() === '' ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Enter fluid intake to estimate balance.
            </p>
          ) : null}
        </div>

        {result?.rateMlKgHr != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}

        <p className="text-sm">
          <a
            href="#rate-formula"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Check out <strong>how to use this calculator!</strong>
          </a>
        </p>
      </section>
    </form>
  );
}