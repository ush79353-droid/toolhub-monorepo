'use client';

import type { ReactNode } from 'react';
import {
  gramsToWeight,
  parseOptionalNumber,
  weightToGrams,
} from './calculation';
import { BirthWeightPercentileChart } from './BirthWeightPercentileChart';
import type {
  BirthWeightPercentileFieldErrors,
  BirthWeightPercentileInput,
  BirthWeightPercentileResult,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function formatDisplayWeight(grams: number, unit: WeightUnit): string {
  const value = gramsToWeight(grams, unit);
  if (unit === 'g') return String(Math.round(value));
  if (unit === 'kg') {
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
  }
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

interface BirthWeightPercentileFormProps {
  input: BirthWeightPercentileInput;
  errors: BirthWeightPercentileFieldErrors;
  result: BirthWeightPercentileResult | null;
  onChange: (next: BirthWeightPercentileInput) => void;
}

export function BirthWeightPercentileForm({
  input,
  errors,
  result,
  onChange,
}: BirthWeightPercentileFormProps) {
  const set = (patch: Partial<BirthWeightPercentileInput>) => {
    onChange({ ...input, ...patch });
  };

  const switchWeightUnit = (unit: WeightUnit) => {
    if (unit === input.weightUnit) return;
    const parsed = parseOptionalNumber(input.weight);
    if (parsed === null) {
      set({ weightUnit: unit });
      return;
    }
    const grams = weightToGrams(parsed, input.weightUnit);
    set({
      weightUnit: unit,
      weight: formatDisplayWeight(grams, unit),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="bw-ga-weeks">
            Gestational age
          </label>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={Boolean(errors.weeks)}>
              <input
                id="bw-ga-weeks"
                className={inputClass}
                inputMode="numeric"
                autoComplete="off"
                value={input.weeks}
                aria-invalid={Boolean(errors.weeks)}
                aria-describedby={errors.weeks ? 'bw-ga-weeks-err' : undefined}
                onChange={(e) => set({ weeks: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                wks
              </span>
            </FieldShell>
            <FieldShell error={Boolean(errors.days)}>
              <input
                id="bw-ga-days"
                className={inputClass}
                inputMode="numeric"
                autoComplete="off"
                value={input.days}
                aria-invalid={Boolean(errors.days)}
                aria-describedby={errors.days ? 'bw-ga-days-err' : undefined}
                onChange={(e) => set({ days: e.target.value })}
              />
              <select
                className={selectClass}
                aria-label="Gestational age day unit"
                value={input.dayUnit}
                onChange={() => set({ dayUnit: 'days' })}
              >
                <option value="days">days</option>
              </select>
            </FieldShell>
          </div>
          {errors.weeks ? (
            <p id="bw-ga-weeks-err" className="mt-1 text-xs text-rose-600">
              {errors.weeks}
            </p>
          ) : null}
          {errors.days ? (
            <p id="bw-ga-days-err" className="mt-1 text-xs text-rose-600">
              {errors.days}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bw-weight">
            Weight
          </label>
          <FieldShell error={Boolean(errors.weight)}>
            <input
              id="bw-weight"
              className={inputClass}
              inputMode="decimal"
              autoComplete="off"
              value={input.weight}
              aria-invalid={Boolean(errors.weight)}
              aria-describedby={errors.weight ? 'bw-weight-err' : undefined}
              onChange={(e) => set({ weight: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
              }
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weight ? (
            <p id="bw-weight-err" className="mt-1 text-xs text-rose-600">
              {errors.weight}
            </p>
          ) : null}
        </div>

        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>

      {result ? <BirthWeightPercentileChart result={result} /> : null}
    </div>
  );
}
