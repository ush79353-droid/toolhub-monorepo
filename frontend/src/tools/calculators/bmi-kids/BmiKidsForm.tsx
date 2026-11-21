'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BmiKidsFieldErrors,
  BmiKidsInput,
  BmiKidsResult,
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
        className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span>{title}</span>
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface BmiKidsFormProps {
  input: BmiKidsInput;
  errors: BmiKidsFieldErrors;
  result: BmiKidsResult | null;
  onChange: (input: BmiKidsInput) => void;
}

export function BmiKidsForm({
  input,
  errors,
  result,
  onChange,
}: BmiKidsFormProps) {
  const set = (patch: Partial<BmiKidsInput>) =>
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
        <label className={labelClass} htmlFor="bmi-kids-height">
          Height
        </label>
        <FieldShell error={errors.height}>
          <input
            id="bmi-kids-height"
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
              set({ heightUnit: e.target.value as HeightUnit })
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
        <label className={labelClass} htmlFor="bmi-kids-weight">
          Weight
          <InfoTooltip text="Enter the child’s current weight. Values convert to kilograms before BMI is calculated." />
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="bmi-kids-weight"
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
              set({ weightUnit: e.target.value as WeightUnit })
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
        <label className={labelClass} htmlFor="bmi-kids-bmi">
          BMI (body mass index)
        </label>
        <FieldShell muted>
          <input
            id="bmi-kids-bmi"
            className={inputClass}
            readOnly
            value={result?.formattedBmi ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-kids-prime">
          BMI Prime
          <InfoTooltip text="BMI Prime = BMI ÷ 25. For children it is informational only — child weight status uses CDC BMI-for-age percentiles, never BMI Prime." />
        </label>
        <FieldShell muted>
          <input
            id="bmi-kids-prime"
            className={inputClass}
            readOnly
            value={result?.formattedBmiPrime ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <CollapsibleSection
        title="How healthy is this BMI?"
        open={input.healthOpen}
        onToggle={() => set({ healthOpen: !input.healthOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="bmi-kids-age">
            Age
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="bmi-kids-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
              aria-invalid={Boolean(errors.ageYears)}
              placeholder="years"
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

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
                  name="bmi-kids-sex"
                  value={value}
                  checked={input.sex === value}
                  onChange={() => set({ sex: value })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {result ? (
          <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2.5 text-xs leading-relaxed text-accent">
            {result.category && result.formattedPercentile ? (
              <p className="font-semibold">
                {result.category.label}{' '}
                <span className="font-normal text-muted-foreground">
                  (~{result.formattedPercentile}th percentile ·{' '}
                  {result.category.rangeLabel})
                </span>
              </p>
            ) : null}
            <p className="text-muted-foreground">{result.healthNote}</p>
            <p className="text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter height and weight first, then exact age and sex. Classification
            uses CDC BMI-for-age LMS percentiles (ages 2 to under 20) — not adult
            WHO cut-offs or BMI Prime.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
