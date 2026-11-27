'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  FLUID_COMPOSITION,
  kgToWeight,
  parseNumber,
  TBW_FRACTION,
  weightToKg,
} from './calculation';
import type {
  AgeSexCategory,
  FluidPreset,
  SodiumCorrectionRateFieldErrors,
  SodiumCorrectionRateInput,
  SodiumCorrectionRateResult,
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

const FLUIDS = Object.entries(FLUID_COMPOSITION) as [
  FluidPreset,
  (typeof FLUID_COMPOSITION)[FluidPreset],
][];

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
  input: SodiumCorrectionRateInput;
  errors: SodiumCorrectionRateFieldErrors;
  result: SodiumCorrectionRateResult | null;
  onChange: (input: SodiumCorrectionRateInput) => void;
}

export function SodiumCorrectionRateForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SodiumCorrectionRateInput>) =>
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

  const showAdvanced = Boolean(result?.showAdvanced);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Sodium correction rate inputs"
      >
        <fieldset>
          <legend className={labelClass}>Age/sex category</legend>
          <div className="flex flex-col gap-2 sm:gap-1.5">
            {CATEGORIES.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="scr-category"
                  className="h-4 w-4 accent-primary"
                  checked={input.category === opt.value}
                  onChange={() => set({ category: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            TBW fraction {TBW_FRACTION[input.category]} L/kg for this category.
          </p>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="scr-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="scr-weight"
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
          <label className={labelClass} htmlFor="scr-sodium">
            Serum sodium
            <InfoTooltip text="Measured serum sodium (mEq/L = mmol/L)." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="scr-sodium"
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

        <div
          className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs leading-relaxed text-amber-950"
          role="note"
        >
          Always double-check the calculations. Remember, this tool cannot
          replace clinical judgment and management guidelines and shouldn&apos;t
          be used independently to make clinical decisions.
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Many experts recommend sodium correction should not exceed 8 mmol/L/day.
          The initial rate for severe symptoms can be 1–2 mEq/L/hr for several
          hours while remaining within daily limits.
        </p>

        {showAdvanced ? (
          <>
            <div>
              <label className={labelClass} htmlFor="scr-fluid">
                Replacement fluid
                <InfoTooltip text="Infusate sodium (± potassium) from common crystalloid tables. ΔNa/L uses Na+K − serum Na." />
              </label>
              <select
                id="scr-fluid"
                className={fullSelectClass}
                value={input.fluid}
                onChange={(e) =>
                  set({ fluid: e.target.value as FluidPreset })
                }
              >
                {FLUIDS.map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label} (Na {meta.na}
                    {meta.k ? ` + K ${meta.k}` : ''})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="scr-aimed">
                Aimed change
                <InfoTooltip text="Desired serum sodium change per hour (mEq/L/h). Use a negative value when lowering sodium." />
              </label>
              <FieldShell error={errors.aimedChangeText}>
                <input
                  id="scr-aimed"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.aimedChangeText}
                  onChange={(e) => set({ aimedChangeText: e.target.value })}
                  aria-invalid={Boolean(errors.aimedChangeText)}
                />
                <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
                  mEq/L/h
                </span>
              </FieldShell>
              {errors.aimedChangeText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.aimedChangeText}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="scr-tbw">
                Total body water
              </label>
              <FieldShell muted>
                <input
                  id="scr-tbw"
                  type="text"
                  readOnly
                  tabIndex={0}
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedTbw ?? ''}
                  aria-live="polite"
                />
                <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
                  L
                </span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="scr-delta">
                Serum Na change per liter
                <InfoTooltip text="Adrogué–Madias predicted change after 1 L of the chosen fluid." />
              </label>
              <FieldShell muted>
                <input
                  id="scr-delta"
                  type="text"
                  readOnly
                  tabIndex={0}
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedChangePerLiter ?? ''}
                  aria-live="polite"
                />
                <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
                  mEq/L
                </span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="scr-flow">
                Correction flow rate
                <InfoTooltip text="Estimated infusion rate for the aimed hourly sodium change." />
              </label>
              <FieldShell muted>
                <input
                  id="scr-flow"
                  type="text"
                  readOnly
                  tabIndex={0}
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedFlow ?? ''}
                  aria-live="polite"
                />
                <span className="shrink-0 border-l border-border px-2 text-sm text-muted-foreground">
                  mL/h
                </span>
              </FieldShell>
            </div>
          </>
        ) : null}

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}
