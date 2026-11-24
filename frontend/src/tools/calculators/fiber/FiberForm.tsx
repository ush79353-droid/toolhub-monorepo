'use client';

import type { ReactNode } from 'react';
import { ACTIVITY_OPTIONS } from '../calorie/types';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EnergyUnit,
  FiberFieldErrors,
  FiberInput,
  FiberResult,
  FiberSex,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: FiberInput;
  errors: FiberFieldErrors;
  result: FiberResult | null;
  onChange: (input: FiberInput) => void;
}

export function FiberForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<FiberInput>) => onChange({ ...input, ...patch });

  const displayCalories =
    input.caloriesText.trim() !== ''
      ? input.caloriesText
      : result?.tdeeFromProfile != null
        ? formatEnergyDisplay(result.tdeeFromProfile, input.energyUnit)
        : '';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['male', 'female'] as const).map((sex) => (
              <label
                key={sex}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fiber-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex: sex as FiberSex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
          {errors.sex ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
          ) : null}
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="fiber-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="fiber-height"
              className={inputClass}
              inputMode="decimal"
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) => set({ heightUnit: e.target.value as HeightUnit })}
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fiber-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="fiber-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fiber-age">
            Age
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="fiber-age"
              className={inputClass}
              inputMode="numeric"
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">yr</span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fiber-activity">
            Activity
          </label>
          <select
            id="fiber-activity"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as FiberInput['activityId'] })
            }
          >
            {ACTIVITY_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="fiber-calories">
            Recommended daily calorie intake
          </label>
          <FieldShell error={errors.caloriesText}>
            <input
              id="fiber-calories"
              className={inputClass}
              inputMode="decimal"
              value={
                input.caloriesText.trim() !== '' ? input.caloriesText : displayCalories
              }
              onChange={(e) => set({ caloriesText: e.target.value })}
              onFocus={() => {
                if (
                  input.caloriesText.trim() === '' &&
                  result?.tdeeFromProfile != null
                ) {
                  set({
                    caloriesText: formatEnergyDisplay(
                      result.tdeeFromProfile,
                      input.energyUnit,
                    ),
                  });
                }
              }}
              aria-invalid={Boolean(errors.caloriesText)}
            />
            <select
              className={unitSelectClass}
              value={input.energyUnit}
              onChange={(e) =>
                set({ energyUnit: e.target.value as EnergyUnit })
              }
              aria-label="Energy unit"
            >
              <option value="kcal">kcal</option>
              <option value="kJ">kJ</option>
            </select>
          </FieldShell>
          {errors.caloriesText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.caloriesText}</p>
          ) : result?.tdeeSource && input.caloriesText.trim() === '' ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Estimated from {result.tdeeSource}. Edit to override.
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}

export function formatEnergyDisplay(kcal: number, unit: EnergyUnit): string {
  if (!Number.isFinite(kcal)) return '';
  if (unit === 'kcal') return String(Math.round(kcal));
  return String(Math.round(kcal * 4.184));
}

export function formatFiberGrams(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return '';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

/** Results panel label helper — InfoTooltip on recommended optimum. */
export function OptimumLabel() {
  return (
    <span className="inline-flex items-center gap-1.5">
      Recommended optimum
      <InfoTooltip
        label="recommended optimum"
        text="Energy-scaled total fiber: 14 g per 1,000 kcal (IOM DRI basis). Age/sex Adequate Intake is reported separately when sex and age are available."
      />
    </span>
  );
}
