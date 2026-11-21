'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  deriveTargetFields,
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  syncTargetInputStrings,
  weightToKg,
} from './calculation';
import type {
  BmiWeightLossFieldErrors,
  BmiWeightLossInput,
  BmiWeightLossResult,
  HeightUnit,
  Sex,
  TargetEditField,
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function switchHeightUnit(
  input: BmiWeightLossInput,
  nextUnit: HeightUnit,
): BmiWeightLossInput {
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
  input: BmiWeightLossInput,
  nextUnit: WeightUnit,
  field: 'weight' | 'targetWeight',
): BmiWeightLossInput {
  if (field === 'weight') {
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
  if (nextUnit === input.targetWeightUnit) return input;
  const val = parseNumber(input.targetWeight);
  if (val == null || val <= 0) {
    return { ...input, targetWeightUnit: nextUnit };
  }
  const kg = weightToKg(val, input.targetWeightUnit);
  return {
    ...input,
    targetWeightUnit: nextUnit,
    targetWeight: Number(kgToWeight(kg, nextUnit).toFixed(3)).toString(),
  };
}

function applyTargetEdit(
  input: BmiWeightLossInput,
  field: TargetEditField,
  raw: string,
): BmiWeightLossInput {
  const next: BmiWeightLossInput = {
    ...input,
    lastTargetEdit: field,
    targetBmi: field === 'bmi' ? raw : input.targetBmi,
    targetPrime: field === 'prime' ? raw : input.targetPrime,
    targetWeight: field === 'weight' ? raw : input.targetWeight,
  };

  const heightVal = parseNumber(next.height);
  if (heightVal == null || heightVal <= 0) return next;
  const meters = heightToMeters(heightVal, next.heightUnit);
  if (!(meters > 0)) return next;

  const derived = deriveTargetFields(meters, next);
  if (derived.targetBmi == null && !derived.rejected) return next;
  return { ...next, ...syncTargetInputStrings(next, derived) };
}

interface BmiWeightLossFormProps {
  input: BmiWeightLossInput;
  errors: BmiWeightLossFieldErrors;
  result: BmiWeightLossResult | null;
  currentOpen: boolean;
  percentileOpen: boolean;
  onToggleCurrent: () => void;
  onTogglePercentile: () => void;
  onChange: (input: BmiWeightLossInput) => void;
  onLoadExample: () => void;
}

export function BmiWeightLossForm({
  input,
  errors,
  result,
  currentOpen,
  percentileOpen,
  onToggleCurrent,
  onTogglePercentile,
  onChange,
  onLoadExample,
}: BmiWeightLossFormProps) {
  const set = (patch: Partial<BmiWeightLossInput>) =>
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

      <CollapsibleSection
        title="Current BMI"
        open={currentOpen}
        onToggle={onToggleCurrent}
      >
        <div>
          <label className={labelClass} htmlFor="bmi-wl-height">
            Height
          </label>
          <FieldShell error={errors.height}>
            <input
              id="bmi-wl-height"
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
          <label className={labelClass} htmlFor="bmi-wl-weight">
            Weight
          </label>
          <FieldShell error={errors.weight}>
            <input
              id="bmi-wl-weight"
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
                onChange(
                  switchWeightUnit(input, e.target.value as WeightUnit, 'weight'),
                )
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
          <label className={labelClass} htmlFor="bmi-wl-bmi">
            BMI
            <InfoTooltip text="Body mass index = weight (kg) ÷ [height (m)]². Screening index only — not a diagnosis." />
          </label>
          <FieldShell muted>
            <input
              id="bmi-wl-bmi"
              className={inputClass}
              readOnly
              value={result?.formattedBmi ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="bmi-wl-prime">
            BMI Prime
            <InfoTooltip text="BMI Prime = BMI ÷ 25. A value of 1.00 matches the upper limit of the WHO adult normal BMI range." />
          </label>
          <FieldShell muted>
            <input
              id="bmi-wl-prime"
              className={inputClass}
              readOnly
              value={result?.formattedBmiPrime ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result?.category ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-accent">
              {result.category.label}
            </span>{' '}
            ({result.category.rangeLabel} kg/m²)
          </p>
        ) : null}
      </CollapsibleSection>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Target BMI and weight loss
        </legend>

        <div>
          <label className={labelClass} htmlFor="bmi-wl-target-bmi">
            Target BMI
          </label>
          <FieldShell error={errors.targetBmi}>
            <input
              id="bmi-wl-target-bmi"
              className={inputClass}
              inputMode="decimal"
              value={input.targetBmi}
              onChange={(e) =>
                onChange(applyTargetEdit(input, 'bmi', e.target.value))
              }
              aria-invalid={Boolean(errors.targetBmi)}
            />
          </FieldShell>
          {errors.targetBmi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetBmi}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bmi-wl-target-prime">
            Target BMI prime
            <InfoTooltip text="Target BMI Prime = Target BMI ÷ 25. Editing this updates target BMI and target weight." />
          </label>
          <FieldShell error={errors.targetPrime}>
            <input
              id="bmi-wl-target-prime"
              className={inputClass}
              inputMode="decimal"
              value={input.targetPrime}
              onChange={(e) =>
                onChange(applyTargetEdit(input, 'prime', e.target.value))
              }
              aria-invalid={Boolean(errors.targetPrime)}
            />
          </FieldShell>
          {errors.targetPrime ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetPrime}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bmi-wl-target-weight">
            Target weight
          </label>
          <FieldShell error={errors.targetWeight}>
            <input
              id="bmi-wl-target-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.targetWeight}
              onChange={(e) =>
                onChange(applyTargetEdit(input, 'weight', e.target.value))
              }
              aria-invalid={Boolean(errors.targetWeight)}
            />
            <select
              className={unitSelectClass}
              aria-label="Target weight unit"
              value={input.targetWeightUnit}
              onChange={(e) =>
                onChange(
                  switchWeightUnit(
                    input,
                    e.target.value as WeightUnit,
                    'targetWeight',
                  ),
                )
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </FieldShell>
          {errors.targetWeight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetWeight}</p>
          ) : null}
        </div>

        {result?.formattedWeightChange ? (
          <p className="text-sm font-semibold text-accent">
            {result.formattedWeightChange}
          </p>
        ) : null}

        {result?.targetSafetyNote ? (
          <p
            className={`text-xs leading-relaxed ${
              result.targetSafety === 'severe_thinness_reject'
                ? 'text-rose-700'
                : 'text-amber-900'
            }`}
            role="status"
          >
            {result.targetSafetyNote}
          </p>
        ) : null}
      </fieldset>

      <CollapsibleSection
        title="Check your BMI percentile"
        open={percentileOpen}
        onToggle={onTogglePercentile}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          For ages 2–19, BMI status uses CDC BMI-for-age percentiles (same LMS
          tables as the BMI Calculator for Kids). Adults keep WHO categories
          above.
        </p>
        <div>
          <label className={labelClass} htmlFor="bmi-wl-sex">
            Sex
          </label>
          <FieldShell error={errors.sex}>
            <select
              id="bmi-wl-sex"
              className={`${inputClass} cursor-pointer`}
              value={input.sex}
              onChange={(e) => set({ sex: e.target.value as Sex | '' })}
              aria-invalid={Boolean(errors.sex)}
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </FieldShell>
          {errors.sex ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="bmi-wl-age">
            Age
          </label>
          <FieldShell error={errors.age}>
            <input
              id="bmi-wl-age"
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
        {result?.percentileNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.formattedPercentile
              ? `Percentile: ${result.formattedPercentile}. `
              : null}
            {result.percentileNote}
          </p>
        ) : null}
      </CollapsibleSection>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (175 cm · 85 kg · target BMI 22)
        </button>
      </div>
    </form>
  );
}
