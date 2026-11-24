'use client';

import {
  ACTIVITY_OPTIONS,
  type EnergyUnit,
  type HeightUnit,
  type TdeeFieldErrors,
  type TdeeInput,
  type TdeeResult,
  type WeightUnit,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

interface Props {
  input: TdeeInput;
  errors: TdeeFieldErrors;
  result: TdeeResult | null;
  onChange: (input: TdeeInput) => void;
}

export function TdeeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<TdeeInput>) => onChange({ ...input, ...patch });
  const energyLabel = input.energyUnit === 'kJ' ? 'kJ' : 'kcal';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <p className="text-sm text-muted-foreground">
        Discover your daily energy needs. Enter your height, weight, age, and physical activity level
        to see your TDEE and BMR in seconds!
      </p>

      <fieldset className="space-y-3 rounded-xl border border-border p-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">About you</legend>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Sex</legend>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              className="h-4 w-4 accent-primary"
              checked={input.sex === 'male'}
              onChange={() => set({ sex: 'male' })}
            />
            Male
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              className="h-4 w-4 accent-primary"
              checked={input.sex === 'female'}
              onChange={() => set({ sex: 'female' })}
            />
            Female
          </label>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="tdee-age">
            Age (18-120)
          </label>
          <div
            className={`flex h-11 items-center rounded-lg border ${
              errors.ageYearsText ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="tdee-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
            />
            <span className={unitFixed}>years</span>
          </div>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tdee-height">
            Height
          </label>
          <div
            className={`flex h-11 items-center rounded-lg border ${
              errors.heightText ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="tdee-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) => set({ heightUnit: e.target.value as HeightUnit })}
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tdee-weight">
            Weight
          </label>
          <div
            className={`flex h-11 items-center rounded-lg border ${
              errors.weightText ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="tdee-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tdee-pal">
            Physical activity level (PAL)
          </label>
          <select
            id="tdee-pal"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none"
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as TdeeInput['activityId'] })
            }
          >
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <div className="space-y-3 rounded-xl border border-border p-3.5">
        <div className="text-sm font-semibold text-accent">Results</div>
        <div>
          <label className={labelClass} htmlFor="tdee-out">
            Total daily energy expenditure (TDEE)
          </label>
          <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60">
            <input
              id="tdee-out"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.tdeeDisplay ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.energyUnit}
              onChange={(e) => set({ energyUnit: e.target.value as EnergyUnit })}
              aria-label="Energy unit"
            >
              <option value="kcal">kcal</option>
              <option value="kJ">kJ</option>
            </select>
            <span className={unitFixed}>/day</span>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="tdee-bmr">
            Basal metabolic rate (BMR)
          </label>
          <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60">
            <input
              id="tdee-bmr"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.bmrDisplay ?? ''}
              aria-live="polite"
            />
            <span className={unitFixed}>
              {energyLabel} /day
            </span>
          </div>
        </div>
        {result?.statusDetail ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </div>
    </form>
  );
}
