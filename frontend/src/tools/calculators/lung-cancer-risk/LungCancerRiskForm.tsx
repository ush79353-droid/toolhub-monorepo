'use client';

import type {
  LungCancerRiskFieldErrors,
  LungCancerRiskInput,
  LungCancerRiskResult,
  HeightUnit,
  WeightUnit,
  YesNo,
} from './types';
import { HEIGHT_UNITS, WEIGHT_UNITS } from './types';
import { DISCLAIMER } from './content';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const sectionClass =
  'space-y-3 rounded-xl border border-border p-3.5';
const sectionLegend = 'px-1 text-sm font-semibold text-accent';

interface Props {
  input: LungCancerRiskInput;
  errors: LungCancerRiskFieldErrors;
  result: LungCancerRiskResult | null;
  previewBmi: number | null;
  onChange: (input: LungCancerRiskInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatPreviewBmi(bmi: number): string {
  return `${Math.round(bmi * 10) / 10}`;
}

export function LungCancerRiskForm({
  input,
  errors,
  result,
  previewBmi,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<LungCancerRiskInput>) =>
    onChange({ ...input, ...patch });

  const bmiDisplay =
    result?.formattedBmi ??
    (previewBmi != null ? formatPreviewBmi(previewBmi) : '—');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {DISCLAIMER} Share uses this page URL only — never your entries or risk
        percentages.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (male · 65 y · 40 pack-years · current smoker)
        </button>
      </p>

      <fieldset className={sectionClass}>
        <legend className={sectionLegend}>About you</legend>

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
          <label className={labelClass} htmlFor="lcr-age">
            Age
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.ageYears ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears ?? ''}
              onChange={(e) => set({ ageYears: parseOptional(e.target.value) })}
            />
            <span className={unitFixed}>years</span>
          </div>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-destructive">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lcr-weight">
            Weight
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.weight ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weight ?? ''}
              onChange={(e) => set({ weight: parseOptional(e.target.value) })}
            />
            <select
              className={selectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit })
              }
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          {errors.weight ? (
            <p className="mt-1 text-xs text-destructive">{errors.weight}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lcr-height">
            Height
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.height ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height ?? ''}
              onChange={(e) => set({ height: parseOptional(e.target.value) })}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
            >
              {HEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          {errors.height ? (
            <p className="mt-1 text-xs text-destructive">{errors.height}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>BMI</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {bmiDisplay}
            </div>
            <span className={unitFixed}>kg/m²</span>
          </div>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={sectionLegend}>Smoking habits</legend>

        <div>
          <label className={labelClass} htmlFor="lcr-smoking-years">
            Smoking years
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.smokingYears ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-smoking-years"
              className={inputClass}
              inputMode="decimal"
              value={input.smokingYears ?? ''}
              onChange={(e) =>
                set({ smokingYears: parseOptional(e.target.value) })
              }
            />
            <span className={unitFixed}>years</span>
          </div>
          {errors.smokingYears ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.smokingYears}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lcr-cigs">
            Cigarettes per day
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.cigarettesPerDay ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-cigs"
              className={inputClass}
              inputMode="decimal"
              value={input.cigarettesPerDay ?? ''}
              onChange={(e) =>
                set({ cigarettesPerDay: parseOptional(e.target.value) })
              }
            />
            <span className={unitFixed}>(2–35)</span>
          </div>
          {errors.cigarettesPerDay ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.cigarettesPerDay}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lcr-quit">
            Years since quitting
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.yearsSinceQuitting ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-quit"
              className={inputClass}
              inputMode="decimal"
              value={input.yearsSinceQuitting ?? ''}
              onChange={(e) =>
                set({ yearsSinceQuitting: parseOptional(e.target.value) })
              }
            />
            <span className={unitFixed}>(0–45)</span>
          </div>
          {errors.yearsSinceQuitting ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.yearsSinceQuitting}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lcr-smoke-hours">
            Hours in smoke-filled rooms
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.smokeRoomHours ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="lcr-smoke-hours"
              className={inputClass}
              inputMode="decimal"
              value={input.smokeRoomHours ?? ''}
              onChange={(e) =>
                set({ smokeRoomHours: parseOptional(e.target.value) })
              }
            />
            <span className={unitFixed}>(0–24)</span>
          </div>
          {errors.smokeRoomHours ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.smokeRoomHours}
            </p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Daily cough</legend>
          {(['no', 'yes'] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                className="h-4 w-4 accent-primary"
                checked={input.dailyCough === value}
                onChange={() => set({ dailyCough: value as YesNo })}
              />
              {value === 'yes' ? 'Yes' : 'No'}
            </label>
          ))}
        </fieldset>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <fieldset className={`${sectionClass} bg-muted/10`}>
        <legend className={sectionLegend}>Lung cancer risk results</legend>

        <div>
          <div className={labelClass}>Risk after 6 years</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result ? result.formattedRisk6 : '—'}
            </div>
            <span className={unitFixed}>%</span>
          </div>
        </div>

        <div>
          <div className={labelClass}>Risk after 16 years</div>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
            <div
              className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
              aria-live="polite"
            >
              {result ? result.formattedRisk16 : '—'}
            </div>
            <span className={unitFixed}>%</span>
          </div>
        </div>

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}