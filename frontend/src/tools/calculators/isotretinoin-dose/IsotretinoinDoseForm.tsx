'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatFixed } from './calculation';
import type {
  IsotretinoinDoseFieldErrors,
  IsotretinoinDoseInput,
  IsotretinoinDoseResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const radioRow = 'flex flex-col gap-2 text-sm text-accent';

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
  input: IsotretinoinDoseInput;
  errors: IsotretinoinDoseFieldErrors;
  result: IsotretinoinDoseResult | null;
  onChange: (input: IsotretinoinDoseInput) => void;
}

export function IsotretinoinDoseForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<IsotretinoinDoseInput>) =>
    onChange({ ...input, ...patch });

  const durationReadonly = input.solveFor === 'duration';
  const dailyReadonly = input.solveFor === 'daily_dose';

  const durationDisplay = durationReadonly
    ? result?.durationWeeks != null
      ? formatFixed(result.durationWeeks, 2)
      : ''
    : input.durationValueText;

  const dailyDisplay = dailyReadonly
    ? result?.dailyDoseMg != null
      ? formatFixed(result.dailyDoseMg, 2)
      : ''
    : input.dailyDoseMgText;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Isotretinoin dose inputs">
        <div>
          <label className={labelClass} htmlFor="iso-weight">
            Your weight
            <InfoTooltip text="Body weight used to compute cumulative milligrams = kg × planned mg/kg." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightText}>
              <input
                id="iso-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
                aria-invalid={Boolean(errors.weightText)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as 'kg' | 'lb' })
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <fieldset className={radioRow}>
          <legend className={labelClass}>
            Do you know your exact cumulative dose?
            <InfoTooltip text="Mean 135 mg/kg is a screenshot teaching example — not an FDA-labeled target or prescription." />
          </legend>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="iso-cum"
              checked={input.cumulativeMode === 'mean_135'}
              onChange={() => set({ cumulativeMode: 'mean_135' })}
            />
            <span>No, use the mean cumulative dose of 135 mg/kg</span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="iso-cum"
              checked={input.cumulativeMode === 'exact'}
              onChange={() => set({ cumulativeMode: 'exact' })}
            />
            <span>Yes, I will input my exact cumulative dose</span>
          </label>
          {input.cumulativeMode === 'exact' ? (
            <FieldShell error={errors.exactCumulativeMgPerKgText}>
              <input
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.exactCumulativeMgPerKgText}
                onChange={(e) =>
                  set({ exactCumulativeMgPerKgText: e.target.value })
                }
                aria-label="Exact cumulative dose mg per kg"
              />
              <span className={unitFixed}>mg/kg</span>
            </FieldShell>
          ) : null}
        </fieldset>

        <fieldset className={radioRow}>
          <legend className={labelClass}>I want to calculate</legend>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="iso-solve"
              checked={input.solveFor === 'duration'}
              onChange={() => set({ solveFor: 'duration' })}
            />
            <span>my therapy&apos;s duration</span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="iso-solve"
              checked={input.solveFor === 'daily_dose'}
              onChange={() => set({ solveFor: 'daily_dose' })}
            />
            <span>my daily dose</span>
          </label>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="iso-daily">
            Daily dose
          </label>
          <FieldShell error={errors.dailyDoseMgText} muted={dailyReadonly}>
            <input
              id="iso-daily"
              type="text"
              inputMode="decimal"
              readOnly={dailyReadonly}
              className={inputClass}
              value={dailyDisplay}
              onChange={(e) =>
                dailyReadonly ? undefined : set({ dailyDoseMgText: e.target.value })
              }
            />
            <span className={unitFixed}>mg</span>
          </FieldShell>
          {errors.dailyDoseMgText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dailyDoseMgText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="iso-duration">
            Duration
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.durationValueText} muted={durationReadonly}>
              <input
                id="iso-duration"
                type="text"
                inputMode="decimal"
                readOnly={durationReadonly}
                className={inputClass}
                value={durationDisplay}
                onChange={(e) =>
                  durationReadonly
                    ? undefined
                    : set({ durationValueText: e.target.value })
                }
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={durationReadonly ? 'weeks' : input.durationUnit}
              disabled={durationReadonly}
              onChange={(e) =>
                set({ durationUnit: e.target.value as 'days' | 'weeks' })
              }
              aria-label="Duration unit"
            >
              <option value="weeks">wks</option>
              <option value="days">days</option>
            </select>
          </div>
          {errors.durationValueText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.durationValueText}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
