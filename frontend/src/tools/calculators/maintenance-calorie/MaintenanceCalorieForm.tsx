'use client';

import type { ReactNode } from 'react';
import { MaintenanceCalorieResults } from './MaintenanceCalorieResults';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type EnergyUnit,
  type HeightUnit,
  type MaintenanceCalorieFieldErrors,
  type MaintenanceCalorieInput,
  type MaintenanceCalorieResult,
  type Sex,
  type WeightUnit,
} from './types';
import {
  convertHeightValue,
  convertWeightValue,
  parseLoose,
} from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/40 px-2 text-sm font-medium text-accent outline-none';

function FieldShell({
  error,
  unitSelect,
  children,
}: {
  error?: string;
  unitSelect?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {unitSelect}
    </div>
  );
}

function fmt(n: number, d = 2): string {
  return String(Number(n.toFixed(d)));
}

interface Props {
  input: MaintenanceCalorieInput;
  errors: MaintenanceCalorieFieldErrors;
  result: MaintenanceCalorieResult | null;
  onChange: (input: MaintenanceCalorieInput) => void;
}

export function MaintenanceCalorieForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<MaintenanceCalorieInput>) =>
    onChange({ ...input, ...patch });

  const setHeightUnit = (heightUnit: HeightUnit) => {
    const raw = parseLoose(input.heightValue);
    if (raw === null || input.heightUnit === heightUnit) {
      set({ heightUnit });
      return;
    }
    const next = convertHeightValue(raw, input.heightUnit, heightUnit);
    set({ heightUnit, heightValue: next == null ? input.heightValue : fmt(next) });
  };

  const setWeightUnit = (weightUnit: WeightUnit) => {
    const raw = parseLoose(input.weightValue);
    if (raw === null || input.weightUnit === weightUnit) {
      set({ weightUnit });
      return;
    }
    const next = convertWeightValue(raw, input.weightUnit, weightUnit);
    set({ weightUnit, weightValue: next == null ? input.weightValue : fmt(next) });
  };

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          About you
        </legend>
        <p className="text-xs text-muted-foreground">
          Estimate how much energy and nutrients your body needs to maintain
          your current weight.
        </p>

        <div>
          <p className={labelClass}>Sex</p>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {([
              ['female', 'Female'],
              ['male', 'Male'],
            ] as const).map(([id, label]) => (
              <label key={id} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="maint-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === id}
                  onChange={() => set({ sex: id as Sex })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="maint-height" className={labelClass}>
            Height
          </label>
          <FieldShell
            error={errors.heightValue}
            unitSelect={
              <select
                className={selectClass}
                value={input.heightUnit}
                aria-label="Height unit"
                onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            }
          >
            <input
              id="maint-height"
              className={inputClass}
              inputMode="decimal"
              value={input.heightValue}
              onChange={(e) => set({ heightValue: e.target.value })}
            />
          </FieldShell>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="maint-weight" className={labelClass}>
            Weight
          </label>
          <FieldShell
            error={errors.weightValue}
            unitSelect={
              <select
                className={selectClass}
                value={input.weightUnit}
                aria-label="Weight unit"
                onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="st">st</option>
              </select>
            }
          >
            <input
              id="maint-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weightValue}
              onChange={(e) => set({ weightValue: e.target.value })}
            />
          </FieldShell>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="maint-age" className={labelClass}>
            Age
          </label>
          <FieldShell
            error={errors.ageYears}
            unitSelect={
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                yrs
              </span>
            }
          >
            <input
              id="maint-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className={labelClass}>Physical activity level</p>
          <div className="space-y-2" role="radiogroup" aria-label="Activity">
            {ACTIVITY_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="maint-activity"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  checked={input.activityId === opt.id}
                  onChange={() => set({ activityId: opt.id as ActivityId })}
                />
                <span className="text-sm text-accent">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Display as</span>
          <select
            className="h-9 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.energyUnit}
            aria-label="Energy unit"
            onChange={(e) =>
              set({ energyUnit: e.target.value as EnergyUnit })
            }
          >
            <option value="kcal">kcal</option>
            <option value="kJ">kJ</option>
          </select>
        </div>

        <MaintenanceCalorieResults
          result={result}
          showMacroPercent={input.showMacroPercent}
          showMacroKcal={input.showMacroKcal}
          showIdealWeight={input.showIdealWeight}
          showChangeWeight={input.showChangeWeight}
        />

        <div className="space-y-2 border-t border-border pt-3">
          {(
            [
              ['showMacroPercent', 'Check calories distribution (%)'],
              ['showMacroKcal', 'Check calories distribution (kcal)'],
              ['showIdealWeight', 'Check my ideal weight'],
              ['showChangeWeight', 'I want to change my weight'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input[key]}
                onChange={(e) => set({ [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </div>

        {input.showMacroPercent || input.showMacroKcal ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ['proteinPct', 'Protein %', errors.proteinPct],
                ['carbPct', 'Carbs %', errors.carbPct],
                ['fatPct', 'Fat %', errors.fatPct],
              ] as const
            ).map(([key, label, err]) => (
              <div key={key}>
                <label className={labelClass} htmlFor={`maint-${key}`}>
                  {label}
                </label>
                <FieldShell error={err}>
                  <input
                    id={`maint-${key}`}
                    className={inputClass}
                    inputMode="decimal"
                    value={input[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                  />
                </FieldShell>
                {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
              </div>
            ))}
          </div>
        ) : null}

        {input.showChangeWeight ? (
          <div className="space-y-3 rounded-lg border border-dashed border-border bg-white/70 p-3">
            <div className="flex flex-wrap gap-4">
              {(['lose', 'gain'] as const).map((dir) => (
                <label key={dir} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="maint-dir"
                    className="h-4 w-4 accent-primary"
                    checked={input.changeDirection === dir}
                    onChange={() => set({ changeDirection: dir })}
                  />
                  {dir === 'lose' ? 'Lose weight' : 'Gain weight'}
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="maint-goal" className={labelClass}>
                Goal weight
              </label>
              <FieldShell
                error={errors.goalWeightValue}
                unitSelect={
                  <select
                    className={selectClass}
                    value={input.goalWeightUnit}
                    aria-label="Goal weight unit"
                    onChange={(e) =>
                      set({ goalWeightUnit: e.target.value as WeightUnit })
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="st">st</option>
                  </select>
                }
              >
                <input
                  id="maint-goal"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.goalWeightValue}
                  onChange={(e) => set({ goalWeightValue: e.target.value })}
                />
              </FieldShell>
              {errors.goalWeightValue ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.goalWeightValue}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="maint-weekly" className={labelClass}>
                Weekly change (kg)
              </label>
              <FieldShell error={errors.weeklyChangeKg}>
                <input
                  id="maint-weekly"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.weeklyChangeKg}
                  onChange={(e) => set({ weeklyChangeKg: e.target.value })}
                />
              </FieldShell>
              {errors.weeklyChangeKg ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.weeklyChangeKg}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
      </fieldset>
    </div>
  );
}
