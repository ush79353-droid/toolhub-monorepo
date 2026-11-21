'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { lbToWeight, parseNumber, weightToLb } from './calculation';
import { PRODUCT_OPTIONS } from './products';
import type {
  AgeUnit,
  InfantTylenolDosageFieldErrors,
  InfantTylenolDosageInput,
  InfantTylenolProductId,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function switchWeightUnit(
  input: InfantTylenolDosageInput,
  next: WeightUnit,
): InfantTylenolDosageInput {
  if (next === input.weightUnit) return input;
  const val = parseNumber(input.weightText);
  if (val == null || val <= 0) {
    return { ...input, weightUnit: next };
  }
  const lb = weightToLb(val, input.weightUnit);
  const converted = lbToWeight(lb, next);
  return {
    ...input,
    weightUnit: next,
    weightText: Number(converted.toFixed(2)).toString(),
  };
}

interface InfantTylenolDosageFormProps {
  input: InfantTylenolDosageInput;
  errors: InfantTylenolDosageFieldErrors;
  onChange: (input: InfantTylenolDosageInput) => void;
}

export function InfantTylenolDosageForm({
  input,
  errors,
  onChange,
}: InfantTylenolDosageFormProps) {
  const set = (patch: Partial<InfantTylenolDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => e.preventDefault()}
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="infant-tylenol-age" className={labelClass}>
          Child&apos;s age
          <InfoTooltip text="Labels prefer weight over age. Age is collected for context; dosing bands in this tool are weight-based from Drug Facts charts." />
        </label>
        <FieldShell error={errors.ageText}>
          <input
            id="infant-tylenol-age"
            className={inputClass}
            inputMode="decimal"
            value={input.ageText}
            onChange={(e) => set({ ageText: e.target.value })}
            aria-invalid={Boolean(errors.ageText)}
          />
          <select
            className={unitSelectClass}
            aria-label="Age unit"
            value={input.ageUnit}
            onChange={(e) => set({ ageUnit: e.target.value as AgeUnit })}
          >
            <option value="yrs">yrs</option>
            <option value="mos">mos</option>
          </select>
        </FieldShell>
        {errors.ageText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="infant-tylenol-weight" className={labelClass}>
          Child&apos;s weight
          <InfoTooltip text="If possible, use weight to dose. Switching kg/lb preserves the physical weight." />
        </label>
        <FieldShell error={errors.weightText}>
          <input
            id="infant-tylenol-weight"
            className={inputClass}
            inputMode="decimal"
            value={input.weightText}
            onChange={(e) => set({ weightText: e.target.value })}
            aria-invalid={Boolean(errors.weightText)}
          />
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) =>
              onChange(
                switchWeightUnit(input, e.target.value as WeightUnit),
              )
            }
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </FieldShell>
        {errors.weightText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          Medication type
          <InfoTooltip text="US OTC Tylenol® (acetaminophen) pediatric products at 160 mg strength. Confirm the carton in hand." />
        </legend>
        <div
          className="space-y-2"
          role="radiogroup"
          aria-label="Medication type"
        >
          {PRODUCT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                input.productId === opt.id
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="infant-tylenol-product"
                value={opt.id}
                checked={input.productId === opt.id}
                onChange={() =>
                  set({ productId: opt.id as InfantTylenolProductId })
                }
                className="h-4 w-4 accent-primary"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.productId ? (
          <p className="mt-1 text-xs text-rose-600">{errors.productId}</p>
        ) : null}
      </fieldset>
    </form>
  );
}
