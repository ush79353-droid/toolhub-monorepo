'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  TEEN_AGE_MAX,
  TEEN_AGE_MIN,
  weightToKg,
} from './calculation';
import type {
  BmiTeensFieldErrors,
  BmiTeensInput,
  BmiTeensResult,
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

function convertHeight(
  input: BmiTeensInput,
  nextUnit: HeightUnit,
): BmiTeensInput {
  if (input.heightUnit === nextUnit) return input;
  const n = parseNumber(input.height);
  if (n == null || n <= 0) return { ...input, heightUnit: nextUnit };
  const meters = heightToMeters(n, input.heightUnit);
  const converted = metersToHeight(meters, nextUnit);
  return {
    ...input,
    heightUnit: nextUnit,
    height: Number.isFinite(converted)
      ? String(
          Math.round(converted * 1e6) / 1e6,
        )
      : input.height,
  };
}

function convertWeight(
  input: BmiTeensInput,
  nextUnit: WeightUnit,
): BmiTeensInput {
  if (input.weightUnit === nextUnit) return input;
  const n = parseNumber(input.weight);
  if (n == null || n <= 0) return { ...input, weightUnit: nextUnit };
  const kg = weightToKg(n, input.weightUnit);
  const converted = kgToWeight(kg, nextUnit);
  return {
    ...input,
    weightUnit: nextUnit,
    weight: Number.isFinite(converted)
      ? String(Math.round(converted * 1e6) / 1e6)
      : input.weight,
  };
}

interface BmiTeensFormProps {
  input: BmiTeensInput;
  errors: BmiTeensFieldErrors;
  result: BmiTeensResult | null;
  onChange: (input: BmiTeensInput) => void;
}

export function BmiTeensForm({
  input,
  errors,
  result,
  onChange,
}: BmiTeensFormProps) {
  const set = (patch: Partial<BmiTeensInput>) =>
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
        title="Calculate your BMI"
        open={input.calculateOpen}
        onToggle={() => set({ calculateOpen: !input.calculateOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="bmi-teens-height">
            Height
          </label>
          <FieldShell error={errors.height}>
            <input
              id="bmi-teens-height"
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
                  convertHeight(input, e.target.value as HeightUnit),
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
          <label className={labelClass} htmlFor="bmi-teens-weight">
            Weight
            <InfoTooltip text="Use current body weight. Units convert before BMI is calculated; physical mass is preserved when you switch units." />
          </label>
          <FieldShell error={errors.weight}>
            <input
              id="bmi-teens-weight"
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
                  convertWeight(input, e.target.value as WeightUnit),
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
          <label className={labelClass} htmlFor="bmi-teens-bmi">
            BMI
            <InfoTooltip text="Body mass index = weight (kg) ÷ height (m)². Screening index only." />
          </label>
          <FieldShell muted>
            <input
              id="bmi-teens-bmi"
              className={inputClass}
              readOnly
              value={result?.formattedBmi ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="bmi-teens-prime">
            BMI Prime
            <InfoTooltip text="BMI Prime = BMI ÷ 25. For teens, weight status uses CDC percentiles—not BMI Prime." />
          </label>
          <FieldShell muted>
            <input
              id="bmi-teens-prime"
              className={inputClass}
              readOnly
              value={result?.formattedBmiPrime ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="How healthy is your BMI?"
        open={input.healthOpen}
        onToggle={() => set({ healthOpen: !input.healthOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Sex</span>
          </div>
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="Sex"
          >
            {(
              [
                ['female', 'Female'],
                ['male', 'Male'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
                  input.sex === value
                    ? 'border-primary bg-primary/5 text-accent'
                    : 'border-border bg-white text-muted-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="bmi-teens-sex"
                  value={value}
                  checked={input.sex === value}
                  onChange={() => set({ sex: value })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          {errors.sex ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bmi-teens-age">
            Age ({TEEN_AGE_MIN} to {TEEN_AGE_MAX} years old)
          </label>
          <FieldShell error={errors.age}>
            <input
              id="bmi-teens-age"
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

        {result?.interpretationNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.interpretationNote}
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Select sex and enter age ({TEEN_AGE_MIN}–{TEEN_AGE_MAX}) to place
            BMI on CDC BMI-for-age percentiles. Adult WHO cut-offs and BMI
            Prime are not used for teen weight categories.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
