'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertHeightValue, convertWeightValue } from './calculation';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type CalorieFieldErrors,
  type CalorieInput,
  type CalorieResult,
  type CalorieSex,
  type HeightUnit,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <span className="shrink-0 pr-3 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

interface CalorieFormProps {
  input: CalorieInput;
  errors: CalorieFieldErrors;
  result: CalorieResult | null;
  onChange: (input: CalorieInput) => void;
}

export function CalorieForm({
  input,
  errors,
  result,
  onChange,
}: CalorieFormProps) {
  const changeHeightUnit = (next: HeightUnit) => {
    const n = Number(input.heightValue.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const converted = convertHeightValue(n, input.heightUnit, next);
      if (converted != null) {
        onChange({
          ...input,
          heightUnit: next,
          heightValue: String(
            Number(converted.toPrecision(8)).toString()
          ),
        });
        return;
      }
    }
    onChange({ ...input, heightUnit: next });
  };

  const changeWeightUnit = (next: WeightUnit) => {
    const n = Number(input.weightValue.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const converted = convertWeightValue(n, input.weightUnit, next);
      if (converted != null) {
        onChange({
          ...input,
          weightUnit: next,
          weightValue: String(Number(converted.toPrecision(8)).toString()),
        });
        return;
      }
    }
    onChange({ ...input, weightUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate your daily caloric intake with our simple calculator. Input
        your sex, age, height, and weight, and find out how many calories
        you&apos;d need in a day. Educational Mifflin–St Jeor estimate — not
        medical advice. Macronutrient split is not shown here.
      </p>

      <div>
        <div className={labelClass}>
          Sex
          <InfoTooltip
            label="Sex"
            text="Used only for the Mifflin–St Jeor sex constant (+5 male / −161 female)."
          />
        </div>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Sex">
          {(
            [
              ['female', 'Female'],
              ['male', 'Male'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="cal-sex"
                value={value}
                checked={input.sex === value}
                onChange={() =>
                  onChange({ ...input, sex: value as CalorieSex })
                }
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="cal-age" className={labelClass}>
          Age
          <InfoTooltip label="Age" text="Age in whole or decimal years." />
        </label>
        <FieldShell error={errors.ageYears} suffix="yrs">
          <input
            id="cal-age"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ageYears}
            onChange={(e) => onChange({ ...input, ageYears: e.target.value })}
            aria-invalid={Boolean(errors.ageYears)}
          />
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cal-height" className={labelClass}>
          Height
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.heightValue}>
            <input
              id="cal-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightValue}
              onChange={(e) =>
                onChange({ ...input, heightValue: e.target.value })
              }
              aria-invalid={Boolean(errors.heightValue)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[5.5rem]`}
            value={input.heightUnit}
            onChange={(e) => changeHeightUnit(e.target.value as HeightUnit)}
            aria-label="Height unit"
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
            <option value="ft">ft</option>
          </select>
        </div>
        {errors.heightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cal-weight" className={labelClass}>
          Weight
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.weightValue}>
            <input
              id="cal-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightValue}
              onChange={(e) =>
                onChange({ ...input, weightValue: e.target.value })
              }
              aria-invalid={Boolean(errors.weightValue)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[5.5rem]`}
            value={input.weightUnit}
            onChange={(e) => changeWeightUnit(e.target.value as WeightUnit)}
            aria-label="Weight unit"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="st">st</option>
          </select>
        </div>
        {errors.weightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cal-activity" className={labelClass}>
          Activity
          <InfoTooltip
            label="Activity"
            text="Physical activity level (PAL) multiplier applied to BMR. Default matches light exercise 1–2 times per week (PAL 1.4)."
          />
        </label>
        <select
          id="cal-activity"
          className={`${selectClass} w-full`}
          value={input.activityId}
          onChange={(e) =>
            onChange({
              ...input,
              activityId: e.target.value as ActivityId,
            })
          }
        >
          {ACTIVITY_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cal-calories" className={labelClass}>
          Calories
        </label>
        <FieldShell suffix="kcal/day">
          <input
            id="cal-calories"
            type="text"
            readOnly
            className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
            value={result?.formattedTdee ?? ''}
            placeholder="—"
            aria-live="polite"
          />
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
