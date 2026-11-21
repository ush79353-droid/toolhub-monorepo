'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHeightValue,
  convertWeightValue,
} from './calculation';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type CalorieIntakeSimpleFieldErrors,
  type CalorieIntakeSimpleInput,
  type CalorieIntakeSimpleResult,
  type HeightUnit,
  type Sex,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';

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

interface Props {
  input: CalorieIntakeSimpleInput;
  errors: CalorieIntakeSimpleFieldErrors;
  result: CalorieIntakeSimpleResult | null;
  onChange: (input: CalorieIntakeSimpleInput) => void;
  onLoadExample: () => void;
}

export function CalorieIntakeSimpleForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const tdeeDisplay = result ? result.formattedTdee : '';

  const switchHeight = (next: HeightUnit) => {
    const raw = Number(input.heightValue.trim().replace(/,/g, ''));
    let heightValue = input.heightValue;
    if (Number.isFinite(raw) && raw > 0) {
      const converted = convertHeightValue(raw, input.heightUnit, next);
      if (converted != null) {
        heightValue = converted.toLocaleString('en-US', {
          maximumFractionDigits: 4,
          useGrouping: false,
        });
      }
    }
    onChange({ ...input, heightUnit: next, heightValue });
  };

  const switchWeight = (next: WeightUnit) => {
    const raw = Number(input.weightValue.trim().replace(/,/g, ''));
    let weightValue = input.weightValue;
    if (Number.isFinite(raw) && raw > 0) {
      const converted = convertWeightValue(raw, input.weightUnit, next);
      if (converted != null) {
        weightValue = converted.toLocaleString('en-US', {
          maximumFractionDigits: 4,
          useGrouping: false,
        });
      }
    }
    onChange({ ...input, weightUnit: next, weightValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational maintenance estimate using Mifflin–St Jeor BMR × activity
        factor. Not medical advice. Entries stay in your browser.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (female · 50y · 165 cm · 65 kg · light → ≈1,778 kcal/day)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Sex</span>
          <InfoTooltip
            label="Sex"
            text="Used by the Mifflin–St Jeor equation (+5 for male, −161 for female)."
          />
        </legend>
        <div className="flex flex-wrap gap-4">
          {(['female', 'male'] as const).map((sex) => (
            <label
              key={sex}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="cis-sex"
                checked={input.sex === sex}
                onChange={() => onChange({ ...input, sex: sex as Sex })}
              />
              <span className="capitalize">{sex}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="cis-age">
          <span>Age</span>
          <InfoTooltip label="Age" text="Whole years used in Mifflin–St Jeor." />
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="cis-age"
            className={inputClass}
            inputMode="numeric"
            value={input.ageYears}
            aria-invalid={Boolean(errors.ageYears)}
            onChange={(e) =>
              onChange({ ...input, ageYears: e.target.value })
            }
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">yrs</span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="cis-height">
          <span>Height</span>
          <InfoTooltip
            label="Height"
            text="Converted to centimetres before BMR. Switching units preserves physical height."
          />
        </label>
        <FieldShell error={errors.heightValue}>
          <input
            id="cis-height"
            className={inputClass}
            inputMode="decimal"
            value={input.heightValue}
            aria-invalid={Boolean(errors.heightValue)}
            onChange={(e) =>
              onChange({ ...input, heightValue: e.target.value })
            }
          />
          <select
            className={selectClass}
            aria-label="Height unit"
            value={input.heightUnit}
            onChange={(e) => switchHeight(e.target.value as HeightUnit)}
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="ft">ft</option>
            <option value="in">in</option>
          </select>
        </FieldShell>
        {errors.heightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="cis-weight">
          <span>Weight</span>
          <InfoTooltip
            label="Weight"
            text="Converted to kilograms before BMR. Switching units preserves physical mass."
          />
        </label>
        <FieldShell error={errors.weightValue}>
          <input
            id="cis-weight"
            className={inputClass}
            inputMode="decimal"
            value={input.weightValue}
            aria-invalid={Boolean(errors.weightValue)}
            onChange={(e) =>
              onChange({ ...input, weightValue: e.target.value })
            }
          />
          <select
            className={selectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) => switchWeight(e.target.value as WeightUnit)}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="st">st</option>
          </select>
        </FieldShell>
        {errors.weightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Activity</span>
          <InfoTooltip
            label="Activity"
            text="Physical activity level (PAL) multiplier applied to BMR."
          />
        </legend>
        <div className="space-y-2">
          {ACTIVITY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-start gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="cis-activity"
                className="mt-0.5"
                checked={input.activityId === opt.id}
                onChange={() =>
                  onChange({
                    ...input,
                    activityId: opt.id as ActivityId,
                  })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="cis-tdee">
          <span>Calories to maintain weight</span>
          <InfoTooltip
            label="Calories to maintain weight"
            text="Estimated total daily energy expenditure (TDEE) = BMR × PAL."
          />
        </label>
        <FieldShell muted>
          <input
            id="cis-tdee"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={tdeeDisplay}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">
            kcal/day
          </span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
