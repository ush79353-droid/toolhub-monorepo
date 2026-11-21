'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHeightValue,
  convertWeightValue,
} from '../maintenance-calorie/calculation';
import type { ActivityId, HeightUnit, Sex, WeightUnit } from '../maintenance-calorie/types';
import {
  ACTIVITY_OPTIONS,
  MEALS_PER_DAY_OPTIONS,
  type MealCalorieFieldErrors,
  type MealCalorieInput,
  type MealCalorieResult,
  type MealsPerDay,
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
  input: MealCalorieInput;
  errors: MealCalorieFieldErrors;
  result: MealCalorieResult | null;
  onChange: (input: MealCalorieInput) => void;
  onLoadFixture: () => void;
}

export function MealCalorieForm({
  input,
  errors,
  result,
  onChange,
  onLoadFixture,
}: Props) {
  const dailyDisplay =
    result != null
      ? result.formattedDaily
      : input.calculateRequiredCalories
        ? ''
        : input.caloriesPerDay;

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
        Split a daily kcal budget across meals using common percentage bands.
        Optional maintenance mode uses Mifflin–St Jeor from the Maintenance
        Calorie tool. Educational only—not medical advice.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadFixture}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load fixture (2,000 kcal · three meals → B 650, L 750, D 600)
        </button>
      </p>

      <label className="flex items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={input.calculateRequiredCalories}
          onChange={(e) =>
            onChange({
              ...input,
              calculateRequiredCalories: e.target.checked,
            })
          }
        />
        <span>
          <span className="font-medium">Calculate required calories</span>
          <span className="block text-xs text-muted-foreground">
            Estimates daily kcal from sex, age, height, weight, and activity
            (Mifflin–St Jeor × PAL).
          </span>
        </span>
      </label>

      {!input.calculateRequiredCalories ? (
        <div>
          <label className={labelClass} htmlFor="mc-daily">
            <span>Calories per day</span>
            <InfoTooltip
              label="Calories per day"
              text="Total daily energy to split across meals."
            />
          </label>
          <FieldShell error={errors.caloriesPerDay}>
            <input
              id="mc-daily"
              className={inputClass}
              inputMode="numeric"
              value={input.caloriesPerDay}
              aria-invalid={Boolean(errors.caloriesPerDay)}
              onChange={(e) =>
                onChange({ ...input, caloriesPerDay: e.target.value })
              }
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              kcal
            </span>
          </FieldShell>
          {errors.caloriesPerDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.caloriesPerDay}</p>
          ) : null}
        </div>
      ) : (
        <MaintenanceFieldsPanel
          input={input}
          errors={errors}
          dailyDisplay={dailyDisplay}
          onChange={onChange}
          switchHeight={switchHeight}
          switchWeight={switchWeight}
        />
      )}

      <fieldset>
        <legend className={labelClass}>
          <span>Meals per day</span>
          <InfoTooltip
            label="Meals per day"
            text="Three: breakfast, lunch, dinner. Four adds a morning snack. Five adds an afternoon snack."
          />
        </legend>
        <div className="flex flex-wrap gap-4">
          {MEALS_PER_DAY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="mc-meals"
                checked={input.mealsPerDay === opt.id}
                onChange={() =>
                  onChange({ ...input, mealsPerDay: opt.id as MealsPerDay })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}

function MaintenanceFieldsPanel({
  input,
  errors,
  dailyDisplay,
  onChange,
  switchHeight,
  switchWeight,
}: {
  input: MealCalorieInput;
  errors: MealCalorieFieldErrors;
  dailyDisplay: string;
  onChange: (input: MealCalorieInput) => void;
  switchHeight: (unit: HeightUnit) => void;
  switchWeight: (unit: WeightUnit) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/10 p-3">
      <fieldset>
        <legend className={labelClass}>
          <span>Sex</span>
          <InfoTooltip
            label="Sex"
            text="Mifflin–St Jeor uses +5 for male and −161 for female."
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
                name="mc-sex"
                checked={input.sex === sex}
                onChange={() => onChange({ ...input, sex: sex as Sex })}
              />
              <span className="capitalize">{sex}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="mc-age">
          <span>Age</span>
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="mc-age"
            className={inputClass}
            inputMode="numeric"
            value={input.ageYears}
            aria-invalid={Boolean(errors.ageYears)}
            onChange={(e) => onChange({ ...input, ageYears: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">
            yrs
          </span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mc-height">
          <span>Height</span>
        </label>
        <FieldShell error={errors.heightValue}>
          <input
            id="mc-height"
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
        <label className={labelClass} htmlFor="mc-weight">
          <span>Weight</span>
        </label>
        <FieldShell error={errors.weightValue}>
          <input
            id="mc-weight"
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
            text="PAL multiplier from the Maintenance Calorie calculator."
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
                name="mc-activity"
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
        <label className={labelClass} htmlFor="mc-maint-daily">
          <span>Required calories (maintenance)</span>
        </label>
        <FieldShell muted>
          <input
            id="mc-maint-daily"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={dailyDisplay}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">
            kcal/day
          </span>
        </FieldShell>
      </div>
    </div>
  );
}