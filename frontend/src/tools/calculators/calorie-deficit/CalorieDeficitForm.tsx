'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHeightValue,
  convertWeightValue,
} from '../calorie/calculation';
import { CalorieDeficitResults } from './CalorieDeficitResults';
import type {
  CalorieDeficitFieldErrors,
  CalorieDeficitInput,
  CalorieDeficitResult,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: ReactNode;
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
        <div className="shrink-0 pr-2 text-xs text-muted-foreground">
          {suffix}
        </div>
      ) : null}
    </div>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: CalorieDeficitInput;
  errors: CalorieDeficitFieldErrors;
  result: CalorieDeficitResult | null;
  onChange: (input: CalorieDeficitInput) => void;
}

export function CalorieDeficitForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<CalorieDeficitInput>) =>
    onChange({ ...input, ...patch });

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Personal details
        </legend>

        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4">
            {(['female', 'male'] as const).map((sex) => (
              <label
                key={sex}
                className="inline-flex items-center gap-2 text-sm capitalize text-accent"
              >
                <input
                  type="radio"
                  name="calorie-deficit-sex"
                  checked={input.sex === sex}
                  onChange={() => set({ sex })}
                  className="h-4 w-4 accent-primary"
                />
                {sex}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="cd-age" className={labelClass}>
            Age
            <InfoTooltip
              label="Age"
              text="Used for Mifflin–St Jeor BMR in the intake plan. Adult range 15–100 years."
            />
          </label>
          <FieldShell error={errors.ageYears} suffix="yrs">
            <input
              id="cd-age"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
              aria-invalid={Boolean(errors.ageYears)}
            />
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cd-height" className={labelClass}>
            Height
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.heightValue}>
              <input
                id="cd-height"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightValue}
                onChange={(e) => set({ heightValue: e.target.value })}
                aria-invalid={Boolean(errors.heightValue)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => {
                const unit = e.target.value as HeightUnit;
                const v = parseLoose(input.heightValue);
                if (v != null && v > 0) {
                  const next = convertHeightValue(v, input.heightUnit, unit);
                  set({
                    heightUnit: unit,
                    heightValue:
                      next == null ? input.heightValue : formatField(next, 4),
                  });
                } else {
                  set({ heightUnit: unit });
                }
              }}
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
          <label htmlFor="cd-current-weight" className={labelClass}>
            Current weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentWeightValue}>
              <input
                id="cd-current-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.currentWeightValue}
                onChange={(e) => set({ currentWeightValue: e.target.value })}
                aria-invalid={Boolean(errors.currentWeightValue)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.currentWeightUnit}
              aria-label="Current weight unit"
              onChange={(e) => {
                const unit = e.target.value as WeightUnit;
                const v = parseLoose(input.currentWeightValue);
                if (v != null && v > 0) {
                  const next = convertWeightValue(
                    v,
                    input.currentWeightUnit,
                    unit
                  );
                  set({
                    currentWeightUnit: unit,
                    currentWeightValue:
                      next == null
                        ? input.currentWeightValue
                        : formatField(next, 4),
                  });
                } else {
                  set({ currentWeightUnit: unit });
                }
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.currentWeightValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.currentWeightValue}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cd-target-weight" className={labelClass}>
            Target weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.targetWeightValue}>
              <input
                id="cd-target-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.targetWeightValue}
                onChange={(e) => set({ targetWeightValue: e.target.value })}
                aria-invalid={Boolean(errors.targetWeightValue)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.targetWeightUnit}
              aria-label="Target weight unit"
              onChange={(e) => {
                const unit = e.target.value as WeightUnit;
                const v = parseLoose(input.targetWeightValue);
                if (v != null && v > 0) {
                  const next = convertWeightValue(
                    v,
                    input.targetWeightUnit,
                    unit
                  );
                  set({
                    targetWeightUnit: unit,
                    targetWeightValue:
                      next == null
                        ? input.targetWeightValue
                        : formatField(next, 4),
                  });
                } else {
                  set({ targetWeightUnit: unit });
                }
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.targetWeightValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetWeightValue}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cd-target-date" className={labelClass}>
            Target date
            <InfoTooltip
              label="Target date"
              text="Must be after today. Calendar days = target date − today (UTC date-only)."
            />
          </label>
          <FieldShell error={errors.targetDate}>
            <input
              id="cd-target-date"
              type="date"
              className={inputClass}
              value={input.targetDate}
              onChange={(e) => set({ targetDate: e.target.value })}
              aria-invalid={Boolean(errors.targetDate)}
            />
          </FieldShell>
          {errors.targetDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetDate}</p>
          ) : null}
        </div>

        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </fieldset>

      <CalorieDeficitResults result={result} showPlanPlaceholder={!result} />
    </div>
  );
}
