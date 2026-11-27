'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  kgToWeight,
  parseNumber,
  TBW_FRACTION,
  weightToKg,
} from './calculation';
import type {
  AgeSexCategory,
  SodiumDeficitFieldErrors,
  SodiumDeficitInput,
  SodiumDeficitResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const fullSelectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
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
  input: SodiumDeficitInput;
  errors: SodiumDeficitFieldErrors;
  result: SodiumDeficitResult | null;
  onChange: (input: SodiumDeficitInput) => void;
}

export function SodiumDeficitForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SodiumDeficitInput>) =>
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
      <section className={sectionClass} aria-label="Sodium deficit inputs">
        <div>
          <label className={labelClass} htmlFor="nad-category">
            Age/sex category
          </label>
          <select
            id="nad-category"
            className={fullSelectClass}
            value={input.category}
            onChange={(e) =>
              set({ category: e.target.value as AgeSexCategory })
            }
          >
            {CATEGORIES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            TBW fraction {TBW_FRACTION[input.category]} L/kg for this category.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="nad-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="nad-weight"
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
          <label className={labelClass} htmlFor="nad-sodium">
            Serum sodium
            <InfoTooltip text="Measured serum sodium (mEq/L = mmol/L). Hyponatremia teaching uses values below the desired target." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="nad-sodium"
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
          <label className={labelClass} htmlFor="nad-desired">
            Desired sodium
            <InfoTooltip text="Target serum sodium for the estimate. Default teaching target is 140 mEq/L." />
          </label>
          <FieldShell error={errors.desiredSodiumText}>
            <input
              id="nad-desired"
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
          <label className={labelClass} htmlFor="nad-result">
            Sodium deficit
            <InfoTooltip text="Estimated mmol of sodium relative to the desired concentration × TBW. Not a saline prescription or infusion rate." />
          </label>
          <FieldShell muted>
            <input
              id="nad-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedDeficit ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
              mmol
            </span>
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
