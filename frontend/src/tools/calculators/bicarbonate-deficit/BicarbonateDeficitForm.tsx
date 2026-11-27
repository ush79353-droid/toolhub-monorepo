'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatWeight,
  parseNumber,
  weightFromKg,
  weightToKg,
} from './calculation';
import type {
  BicarbonateDeficitFieldErrors,
  BicarbonateDeficitInput,
  BicarbonateDeficitResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitStaticClass =
  'flex h-11 shrink-0 items-center border-l border-border px-3 text-sm text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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

interface FormProps {
  input: BicarbonateDeficitInput;
  errors: BicarbonateDeficitFieldErrors;
  result: BicarbonateDeficitResult | null;
  onChange: (input: BicarbonateDeficitInput) => void;
}

export function BicarbonateDeficitForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<BicarbonateDeficitInput>) =>
    onChange({ ...input, ...patch });

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const n = parseNumber(input.weightText);
    if (n == null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(n, input.weightUnit);
    const converted = weightFromKg(kg, next);
    set({
      weightUnit: next,
      weightText: formatWeight(converted, next),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Bicarbonate deficit inputs">
        <div>
          <label className={labelClass} htmlFor="bicarb-def-weight">
            Patient&apos;s weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="bicarb-def-weight"
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
              aria-label="Patient weight unit"
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
          <label className={labelClass} htmlFor="bicarb-def-actual">
            Actual bicarbonate level
            <InfoTooltip text="Measured serum/plasma HCO₃ in mmol/L (≡ mEq/L)." />
          </label>
          <FieldShell error={errors.actualBicarbText}>
            <input
              id="bicarb-def-actual"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.actualBicarbText}
              onChange={(e) => set({ actualBicarbText: e.target.value })}
              aria-invalid={Boolean(errors.actualBicarbText)}
            />
            <span className={unitStaticClass} aria-hidden="true">
              mmol/L
            </span>
          </FieldShell>
          {errors.actualBicarbText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.actualBicarbText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bicarb-def-desired">
            Desired bicarbonate level
          </label>
          <FieldShell error={errors.desiredBicarbText}>
            <input
              id="bicarb-def-desired"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.desiredBicarbText}
              onChange={(e) => set({ desiredBicarbText: e.target.value })}
              aria-invalid={Boolean(errors.desiredBicarbText)}
            />
            <span className={unitStaticClass} aria-hidden="true">
              mmol/L
            </span>
          </FieldShell>
          {errors.desiredBicarbText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.desiredBicarbText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bicarb-def-result">
            Bicarbonate deficit
            <InfoTooltip text="Estimated amount in mmol (gap × kg × 0.5 L/kg). Distinct from the concentration gap in mmol/L. Not an infusion order." />
          </label>
          <FieldShell muted>
            <input
              id="bicarb-def-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedDeficit ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitStaticClass} aria-hidden="true">
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
