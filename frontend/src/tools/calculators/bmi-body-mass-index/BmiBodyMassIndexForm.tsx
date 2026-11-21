'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BmiBodyMassIndexFieldErrors,
  BmiBodyMassIndexInput,
  BmiBodyMassIndexResult,
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

interface BmiBodyMassIndexFormProps {
  input: BmiBodyMassIndexInput;
  errors: BmiBodyMassIndexFieldErrors;
  result: BmiBodyMassIndexResult | null;
  onChange: (input: BmiBodyMassIndexInput) => void;
  onLoadExample: () => void;
}

export function BmiBodyMassIndexForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: BmiBodyMassIndexFormProps) {
  const set = (patch: Partial<BmiBodyMassIndexInput>) =>
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
                name="bmi-sex"
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

      <div>
        <label className={labelClass} htmlFor="bmi-height">
          Height
        </label>
        <FieldShell error={errors.height}>
          <input
            id="bmi-height"
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
        <label className={labelClass} htmlFor="bmi-weight">
          Weight
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="bmi-weight"
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
        <label className={labelClass} htmlFor="bmi-bmi">
          BMI
        </label>
        <FieldShell muted>
          <input
            id="bmi-bmi"
            className={inputClass}
            readOnly
            value={result?.formattedBmi ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="bmi-prime">
          BMI Prime
          <InfoTooltip text="BMI Prime = BMI ÷ 25. A value of 1.00 matches the upper limit of the WHO adult normal BMI range." />
        </label>
        <FieldShell muted>
          <input
            id="bmi-prime"
            className={inputClass}
            readOnly
            value={result?.formattedBmiPrime ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      {result ? (
        <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-accent">
          <p className="font-semibold">
            {result.category.label}{' '}
            <span className="font-normal text-muted-foreground">
              ({result.category.rangeLabel} kg/m²)
            </span>
          </p>
          <p className="mt-1 text-muted-foreground">
            Healthy weight for this height (BMI 18.5–24.9):{' '}
            {result.formattedHealthyWeightRange}
          </p>
        </div>
      ) : null}

      <CollapsibleSection
        title="BMI percentile and athletes."
        open={input.advancedOpen}
        onToggle={() => set({ advancedOpen: !input.advancedOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="bmi-age">
            Age
          </label>
          <FieldShell error={errors.age}>
            <input
              id="bmi-age"
              className={inputClass}
              inputMode="decimal"
              value={input.age}
              onChange={(e) => set({ age: e.target.value })}
              aria-invalid={Boolean(errors.age)}
              placeholder="years"
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.age ? (
            <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.athlete}
            onChange={(e) => set({ athlete: e.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          Athlete / high muscle mass
        </label>

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.percentileNote}
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter height and weight first. Age chooses childhood vs adult
            classification path; athletes get an extra caution about muscle
            mass.
          </p>
        )}

        {result?.athleteNote ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
            {result.athleteNote}
          </p>
        ) : null}
      </CollapsibleSection>

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
