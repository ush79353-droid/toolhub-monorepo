'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ageToYears,
  kgToWeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  AgeUnit,
  ParacetamolDosageFieldErrors,
  ParacetamolDosageInput,
  ParacetamolDosageResult,
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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function switchAgeUnit(
  input: ParacetamolDosageInput,
  nextUnit: AgeUnit,
): ParacetamolDosageInput {
  if (nextUnit === input.ageUnit) return input;
  const val = parseNumber(input.age);
  if (val == null || val < 0) {
    return { ...input, ageUnit: nextUnit };
  }
  const years = ageToYears(val, input.ageUnit);
  const next =
    nextUnit === 'mos'
      ? Number((years * 12).toFixed(1)).toString()
      : Number(years.toFixed(2)).toString();
  return { ...input, ageUnit: nextUnit, age: next };
}

function switchWeightUnit(
  input: ParacetamolDosageInput,
  nextUnit: WeightUnit,
): ParacetamolDosageInput {
  if (nextUnit === input.weightUnit) return input;
  const val = parseNumber(input.weight);
  if (val == null || val <= 0) {
    return { ...input, weightUnit: nextUnit };
  }
  const kg = weightToKg(val, input.weightUnit);
  return {
    ...input,
    weightUnit: nextUnit,
    weight: Number(kgToWeight(kg, nextUnit).toFixed(2)).toString(),
  };
}

interface ParacetamolDosageFormProps {
  input: ParacetamolDosageInput;
  errors: ParacetamolDosageFieldErrors;
  result: ParacetamolDosageResult;
  onChange: (input: ParacetamolDosageInput) => void;
  onLoadExample: () => void;
}

export function ParacetamolDosageForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: ParacetamolDosageFormProps) {
  const set = (patch: Partial<ParacetamolDosageInput>) =>
    onChange({ ...input, ...patch });

  const showDose =
    result.status === 'ready' || result.status === 'capped';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="para-age">
          Child&apos;s age
        </label>
        <FieldShell error={errors.age}>
          <input
            id="para-age"
            className={inputClass}
            inputMode="decimal"
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
            aria-invalid={Boolean(errors.age)}
          />
          <select
            className={unitSelectClass}
            aria-label="Age unit"
            value={input.ageUnit}
            onChange={(e) =>
              onChange(switchAgeUnit(input, e.target.value as AgeUnit))
            }
          >
            <option value="yrs">yrs</option>
            <option value="mos">mos</option>
          </select>
        </FieldShell>
        {errors.age ? (
          <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="para-weight">
          Child&apos;s weight
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="para-weight"
            className={inputClass}
            inputMode="decimal"
            value={input.weight}
            onChange={(e) => set({ weight: e.target.value })}
            aria-invalid={Boolean(errors.weight)}
          />
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) =>
              onChange(switchWeightUnit(input, e.target.value as WeightUnit))
            }
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </FieldShell>
        {errors.weight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
        ) : null}
      </div>

      <div
        className="space-y-2 rounded-lg border border-border bg-muted/20 px-3.5 py-3 text-sm leading-relaxed text-accent"
        aria-live="polite"
      >
        {showDose ? (
          <>
            <p>
              Maximum <strong>single dose</strong> of paracetamol is{' '}
              <strong>{result.formattedSingleDose} mg</strong>.
            </p>
            <p>
              Maximum <strong>daily dose</strong> of paracetamol is{' '}
              <strong>{result.formattedDailyDose} mg</strong>.
            </p>
            <p className="text-muted-foreground">
              {result.frequencyNote} {result.intervalNote}
            </p>
          </>
        ) : result.status === 'too_young' ? (
          <p className="text-amber-900" role="status">
            {result.statusNote}
          </p>
        ) : (
          <p className="text-muted-foreground">
            {result.statusNote ??
              'Enter age and weight to see educational maximum single and daily amounts.'}
          </p>
        )}

        {result.statusNote && showDose ? (
          <p className="text-xs text-amber-900">{result.statusNote}</p>
        ) : null}

        <p className="text-xs text-muted-foreground">
          If you want to calculate doses based on the most used forms of
          paracetamol, go to{' '}
          <Link
            href={result.infantTylenolHref}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            infant tylenol dosage calculator
          </Link>
          .
        </p>

        <p className="text-xs italic text-muted-foreground">
          {result.disclaimer}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (8 yrs · 21 kg)
        </button>
      </div>
    </form>
  );
}
