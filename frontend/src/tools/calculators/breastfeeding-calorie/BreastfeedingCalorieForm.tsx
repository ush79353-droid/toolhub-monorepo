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
import {
  ACTIVITY_OPTIONS,
  PHYSIOLOGICAL_STATES,
  type ActivityId,
  type BreastfeedingCalorieFieldErrors,
  type BreastfeedingCalorieInput,
  type BreastfeedingCalorieResult,
  type HeightUnit,
  type PhysiologicalStateId,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const selectClass =
  'h-11 w-full min-w-0 cursor-pointer bg-transparent px-3 text-sm font-semibold text-accent outline-none';

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
  input: BreastfeedingCalorieInput,
  nextUnit: HeightUnit,
): BreastfeedingCalorieInput {
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
  input: BreastfeedingCalorieInput,
  nextUnit: WeightUnit,
): BreastfeedingCalorieInput {
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

interface BreastfeedingCalorieFormProps {
  input: BreastfeedingCalorieInput;
  errors: BreastfeedingCalorieFieldErrors;
  result: BreastfeedingCalorieResult | null;
  onChange: (input: BreastfeedingCalorieInput) => void;
}

export function BreastfeedingCalorieForm({
  input,
  errors,
  result,
  onChange,
}: BreastfeedingCalorieFormProps) {
  const set = (patch: Partial<BreastfeedingCalorieInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational energy estimate — not medical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses the IOM/NAS Dietary Reference Intakes Estimated Energy Requirement
          (EER) for women, plus DRI pregnancy or lactation additions. Needs vary
          with milk volume, twins, and clinical context.
        </p>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <fieldset className="space-y-2.5">
        <legend className={labelClass}>
          <span>Your current state</span>
          <InfoTooltip
            label="Current state"
            text="Choose lactation (0–6 or >6 months) or pregnancy trimester. Energy additions follow the same IOM DRI tables used for the base EER."
          />
        </legend>
        <div
          className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5"
          role="radiogroup"
          aria-label="Your current state"
        >
          {PHYSIOLOGICAL_STATES.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="bfc-state"
                className="h-4 w-4 accent-primary"
                checked={input.state === opt.id}
                onChange={() =>
                  set({ state: opt.id as PhysiologicalStateId })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.state ? (
          <p className="text-xs text-rose-600">{errors.state}</p>
        ) : null}
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="bfc-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="DRI uses the adolescent girl equation for ages 14–18 and the adult woman equation for ages 19–70."
          />
        </label>
        <FieldShell error={errors.age}>
          <input
            id="bfc-age"
            className={inputClass}
            inputMode="decimal"
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
            aria-invalid={Boolean(errors.age)}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.age ? (
          <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bfc-height">
          Height
        </label>
        <FieldShell error={errors.height}>
          <input
            id="bfc-height"
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
              onChange(
                switchHeightUnit(input, e.target.value as HeightUnit),
              )
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
        <label className={labelClass} htmlFor="bfc-weight">
          Weight
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="bfc-weight"
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
                switchWeightUnit(input, e.target.value as WeightUnit),
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
        <label className={labelClass} htmlFor="bfc-activity">
          <span>Physical activity</span>
          <InfoTooltip
            label="Physical activity"
            text="Maps to IOM DRI physical-activity coefficients (PA): sedentary 1.00, low active 1.12/1.16, active 1.27/1.31, very active 1.45/1.56 (adult / adolescent)."
          />
        </label>
        <FieldShell error={errors.activity}>
          <select
            id="bfc-activity"
            className={selectClass}
            value={input.activity}
            aria-invalid={Boolean(errors.activity)}
            onChange={(e) =>
              set({ activity: e.target.value as ActivityId })
            }
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.activity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.activity}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bfc-energy">
          <span>Daily energy needs</span>
          <InfoTooltip
            label="Daily energy needs"
            text="Non-pregnant EER plus the DRI addition for your selected pregnancy trimester or lactation stage. Rounded to the nearest kilocalorie for display."
          />
        </label>
        <FieldShell muted>
          <output
            id="bfc-energy"
            htmlFor="bfc-age bfc-height bfc-weight bfc-activity"
            className="h-11 w-full min-w-0 px-3 text-sm font-semibold tabular-nums text-accent"
            aria-live="polite"
          >
            {result ? result.formattedDailyEnergyNeeds : '—'}
          </output>
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            kcal
          </span>
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Base EER ≈{' '}
            {Math.round(result.nonPregnantEerKcal).toLocaleString('en-US')} kcal
            + {result.energyAdditionKcal} kcal ({result.stateLabel}). PA ={' '}
            {result.paCoefficient.toFixed(2)}.
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter age, height, and weight to estimate daily kilocalories.
          </p>
        )}
      </div>
    </form>
  );
}
