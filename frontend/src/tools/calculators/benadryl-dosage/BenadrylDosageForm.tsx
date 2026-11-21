'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { productOptions } from './products';
import type {
  BenadrylDosageFieldErrors,
  BenadrylDosageInput,
  BenadrylProductId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface BenadrylDosageFormProps {
  input: BenadrylDosageInput;
  errors: BenadrylDosageFieldErrors;
  onChange: (input: BenadrylDosageInput) => void;
}

export function BenadrylDosageForm({
  input,
  errors,
  onChange,
}: BenadrylDosageFormProps) {
  const set = (patch: Partial<BenadrylDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <div>
        <label htmlFor="benadryl-age" className={labelClass}>
          Age
          <InfoTooltip text="Enter age in whole years. Label dosing bands use completed years (for example, 6 to under 12). Leave blank to review product uses and 24-hour limits only. This tool does not store or share the age you enter." />
        </label>
        <FieldShell error={errors.ageYearsText}>
          <input
            id="benadryl-age"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder=""
            aria-invalid={Boolean(errors.ageYearsText)}
            aria-describedby={
              errors.ageYearsText ? 'benadryl-age-error' : undefined
            }
            className={inputClass}
            value={input.ageYearsText}
            onChange={(event) => set({ ageYearsText: event.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
            yrs
          </span>
        </FieldShell>
        {errors.ageYearsText ? (
          <p id="benadryl-age-error" className="mt-1 text-xs text-rose-600">
            {errors.ageYearsText}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="benadryl-product" className={labelClass}>
          Medication type
          <InfoTooltip text="US OTC Benadryl® (diphenhydramine HCl) oral products with published Drug Facts age bands. Confirm the exact carton in hand — formulations and markets differ." />
        </label>
        <FieldShell error={errors.productId}>
          <select
            id="benadryl-product"
            className={`${inputClass} cursor-pointer appearance-none pr-8`}
            value={input.productId}
            aria-invalid={Boolean(errors.productId)}
            onChange={(event) =>
              set({ productId: event.target.value as BenadrylProductId })
            }
          >
            {productOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.productId ? (
          <p className="mt-1 text-xs text-rose-600">{errors.productId}</p>
        ) : null}
      </div>
    </form>
  );
}
