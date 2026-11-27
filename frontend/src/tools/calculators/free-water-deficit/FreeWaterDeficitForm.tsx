'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatVolume,
  kgToWeight,
  parseNumber,
  TBW_FRACTION,
  weightToKg,
} from './calculation';
import type {
  AgeSexCategory,
  FreeWaterDeficitFieldErrors,
  FreeWaterDeficitInput,
  FreeWaterDeficitResult,
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

const CATEGORIES: { value: AgeSexCategory; label: string }[] = [
  { value: 'child', label: 'Child' },
  { value: 'adult_male', label: 'Adult male' },
  { value: 'adult_female', label: 'Adult female' },
  { value: 'elderly_male', label: 'Elderly male' },
  { value: 'elderly_female', label: 'Elderly female' },
];

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

const VOLUME_UNITS: { value: VolumeUnit; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
];

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

function formatWeightField(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(4)));
}

interface FormProps {
  input: FreeWaterDeficitInput;
  errors: FreeWaterDeficitFieldErrors;
  result: FreeWaterDeficitResult | null;
  onChange: (input: FreeWaterDeficitInput) => void;
}

export function FreeWaterDeficitForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<FreeWaterDeficitInput>) =>
    onChange({ ...input, ...patch });

  const changeWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightText);
    if (raw !== null && raw > 0) {
      const kg = weightToKg(raw, input.weightUnit);
      set({
        weightUnit: next,
        weightText: formatWeightField(kgToWeight(kg, next)),
      });
      return;
    }
    set({ weightUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Free water deficit inputs">
        <fieldset>
          <legend className={labelClass}>Age/sex category</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            {CATEGORIES.map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fwd-category"
                  checked={input.category === value}
                  onChange={() => set({ category: value })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            TBW fraction {TBW_FRACTION[input.category]} L/kg for this category.
          </p>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="fwd-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="fwd-weight"
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
              onChange={(e) => changeWeightUnit(e.target.value as WeightUnit)}
              aria-label="Weight unit"
            >
              {WEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fwd-sodium">
            Sodium level
            <InfoTooltip text="Measured serum sodium (mEq/L = mmol/L). Used with desired sodium in the free-water deficit ratio." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="fwd-sodium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sodiumText}
              onChange={(e) => set({ sodiumText: e.target.value })}
              aria-invalid={Boolean(errors.sodiumText)}
            />
            <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
              mEq/L
            </span>
          </FieldShell>
          {errors.sodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fwd-desired">
            Desired sodium
          </label>
          <FieldShell error={errors.desiredSodiumText}>
            <input
              id="fwd-desired"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.desiredSodiumText}
              onChange={(e) => set({ desiredSodiumText: e.target.value })}
              aria-invalid={Boolean(errors.desiredSodiumText)}
            />
            <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
              mEq/L
            </span>
          </FieldShell>
          {errors.desiredSodiumText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.desiredSodiumText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fwd-result">
            Free water deficit
            <InfoTooltip text="Educational volume estimate for pure water loss. Negative values mean free-water excess relative to the desired sodium — not a drip schedule." />
          </label>
          <FieldShell muted>
            <input
              id="fwd-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.formattedDeficit ??
                (result?.deficitDisplay != null
                  ? formatVolume(result.deficitDisplay, input.resultUnit)
                  : '')
              }
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as VolumeUnit })
              }
              aria-label="Free water deficit unit"
            >
              {VOLUME_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}
