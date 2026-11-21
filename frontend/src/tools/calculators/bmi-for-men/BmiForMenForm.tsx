'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  BmiForMenFieldErrors,
  BmiForMenInput,
  BmiForMenResult,
  HeightUnit,
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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function switchHeightUnit(
  input: BmiForMenInput,
  nextUnit: HeightUnit,
): BmiForMenInput {
  if (nextUnit === input.heightUnit) return input;
  const val = parseNumber(input.height);
  if (val == null || val <= 0) {
    return { ...input, heightUnit: nextUnit };
  }
  const meters = heightToMeters(val, input.heightUnit);
  const converted = metersToHeight(meters, nextUnit);
  const digits = nextUnit === 'cm' || nextUnit === 'in' ? 1 : 3;
  return {
    ...input,
    heightUnit: nextUnit,
    height: Number(converted.toFixed(digits)).toString(),
  };
}

function switchWeightUnit(
  input: BmiForMenInput,
  nextUnit: WeightUnit,
): BmiForMenInput {
  if (nextUnit === input.weightUnit) return input;
  const val = parseNumber(input.weight);
  if (val == null || val <= 0) {
    return { ...input, weightUnit: nextUnit };
  }
  const kg = weightToKg(val, input.weightUnit);
  const converted = kgToWeight(kg, nextUnit);
  return {
    ...input,
    weightUnit: nextUnit,
    weight: Number(converted.toFixed(2)).toString(),
  };
}

interface BmiForMenFormProps {
  input: BmiForMenInput;
  errors: BmiForMenFieldErrors;
  result: BmiForMenResult | null;
  onChange: (input: BmiForMenInput) => void;
  onLoadExample: () => void;
}

export function BmiForMenForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: BmiForMenFormProps) {
  const set = (patch: Partial<BmiForMenInput>) =>
    onChange({ ...input, ...patch });

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
        <label className={labelClass} htmlFor="bmi-men-height">
          Height
        </label>
        <FieldShell error={errors.height}>
          <input
            id="bmi-men-height"
            className={inputClass}
            inputMode="decimal"
            value={input.height}
            onChange={(e) => set({ height: e.target.value })}
            aria-invalid={Boolean(errors.height)}
          />
          <select
            className={unitSelectClass}
            aria-label="Height unit"
            value={input.heightUnit}
            onChange={(e) =>
              onChange(switchHeightUnit(input, e.target.value as HeightUnit))
            }
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
            <option value="ft">ft</option>
          </select>
        </FieldShell>
        {errors.height ? (
          <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-men-weight">
          Weight
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="bmi-men-weight"
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
            <option value="st">st</option>
          </select>
        </FieldShell>
        {errors.weight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-men-bmi">
          BMI
          <InfoTooltip text="Body mass index = weight (kg) ÷ [height (m)]². Screening index only — not a diagnosis." />
        </label>
        <FieldShell muted>
          <input
            id="bmi-men-bmi"
            className={inputClass}
            readOnly
            value={result?.formattedBmi ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-men-prime">
          BMI Prime
          <InfoTooltip text="BMI Prime = BMI ÷ 25. A value of 1.00 matches the upper limit of the WHO adult normal BMI range." />
        </label>
        <FieldShell muted>
          <input
            id="bmi-men-prime"
            className={inputClass}
            readOnly
            value={result?.formattedBmiPrime ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-men-age">
          Age
          <InfoTooltip text="WHO adult BMI cut-offs apply for ages 20 and older. Under 20, use BMI-for-age percentiles instead of adult categories." />
        </label>
        <FieldShell error={errors.age}>
          <input
            id="bmi-men-age"
            className={inputClass}
            inputMode="decimal"
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
            aria-invalid={Boolean(errors.age)}
          />
          <span className="pr-3 text-xs text-muted-foreground">yrs</span>
        </FieldShell>
        {errors.age ? (
          <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
        ) : null}
      </div>

      {result ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-accent">
          {result.category ? (
            <p className="font-semibold">
              {result.category.label}{' '}
              <span className="font-normal text-muted-foreground">
                ({result.category.rangeLabel} kg/m²)
              </span>
            </p>
          ) : null}
          {result.formattedHealthyWeightRange ? (
            <p className="text-muted-foreground">
              Healthy weight for this height (BMI 18.5–24.9):{' '}
              {result.formattedHealthyWeightRange}
            </p>
          ) : null}
          {result.ageNote ? (
            <p
              className={
                result.ageInterpretation === 'under_adult'
                  ? 'text-amber-900'
                  : 'text-muted-foreground'
              }
            >
              {result.ageNote}
            </p>
          ) : null}
          <p className="text-muted-foreground">{result.disclaimer}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (80 kg · 2 m)
        </button>
      </div>
    </form>
  );
}
