'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { ACTIVITY_OPTIONS } from '../calorie/types';
import type {
  HeightUnit,
  ProteinFieldErrors,
  ProteinInput,
  ProteinMode,
  ProteinResult,
  ProteinSex,
  SportFocus,
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
  input: ProteinInput;
  errors: ProteinFieldErrors;
  result: ProteinResult | null;
  onChange: (input: ProteinInput) => void;
}

export function ProteinForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<ProteinInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <p className="text-sm text-muted-foreground">
        Tell us your height, weight, and age, and find out the recommended protein
        intake for your daily diet. We also offer specific information for
        physically active people.
      </p>

      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['female', 'male'] as const).map((sex) => (
              <label
                key={sex}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="protein-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex: sex as ProteinSex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="protein-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="protein-height"
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
          <label className={labelClass} htmlFor="protein-weight">
            Current weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="protein-weight"
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
          <label className={labelClass} htmlFor="protein-age">
            Age
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="protein-age"
              className={inputClass}
              inputMode="numeric"
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              years old
            </span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="protein-activity">
            Activity level
          </label>
          <select
            id="protein-activity"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as ProteinInput['activityId'] })
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
          <div className="mb-1.5 flex items-center gap-1.5">
            <label className="text-[13px] font-medium text-accent" htmlFor="protein-calories">
              Calories
            </label>
            <InfoTooltip text="Optional. Enter kcal/day for AMDR protein grams (10–35% ÷ 4 kcal/g). Leave blank to estimate maintenance from sex, age, height, weight, and activity (Mifflin–St Jeor × PAL)." />
          </div>
          <FieldShell error={errors.caloriesText}>
            <input
              id="protein-calories"
              className={inputClass}
              inputMode="decimal"
              value={input.caloriesText}
              onChange={(e) => set({ caloriesText: e.target.value })}
              aria-invalid={Boolean(errors.caloriesText)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
          {errors.caloriesText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.caloriesText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Show protein intake</legend>
          <div
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4"
            role="radiogroup"
            aria-label="Protein recommendation mode"
          >
            <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="protein-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === 'general'}
                onChange={() => set({ mode: 'general' as ProteinMode })}
              />
              General recommendations
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="protein-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === 'sport'}
                onChange={() => set({ mode: 'sport' as ProteinMode })}
              />
              Recommendations for sport
            </label>
          </div>
        </fieldset>

        {input.mode === 'sport' ? (
          <fieldset>
            <legend className={labelClass}>Training focus</legend>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label="Sport training focus"
            >
              {(
                [
                  { id: 'endurance', label: 'Endurance (1.2–1.4 g/kg)' },
                  { id: 'strength', label: 'Strength / power (1.6–1.7 g/kg)' },
                  { id: 'athletic', label: 'Broad athletic (1.2–2.0 g/kg)' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="protein-sport-focus"
                    className="h-4 w-4 accent-primary"
                    checked={input.sportFocus === opt.id}
                    onChange={() => set({ sportFocus: opt.id as SportFocus })}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </section>

      {result && (result.amdrRows.length > 0 || result.rdaGramsPerDay != null || result.sportBand) ? (
        <section className={sectionClass} aria-live="polite">
          <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
          <p className="text-sm text-muted-foreground">{result.statusDetail}</p>

          {result.rdaGramsPerDay != null && result.rdaGPerKg != null ? (
            <p className="mt-2 text-sm text-muted-foreground">
              IOM RDA:{' '}
              <strong className="text-accent">
                {formatGrams(result.rdaGramsPerDay)} g/day
              </strong>{' '}
              ({formatFixed(result.rdaGPerKg, 2)} g/kg ×{' '}
              {formatGrams(result.weightKg ?? 0)} kg).
            </p>
          ) : null}

          {result.sportBand ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {result.sportBand.label}:{' '}
              <strong className="text-accent">
                {formatGrams(result.sportBand.minGramsPerDay)}–
                {formatGrams(result.sportBand.maxGramsPerDay)} g/day
              </strong>{' '}
              ({result.sportBand.minGPerKg}–{result.sportBand.maxGPerKg} g/kg ·{' '}
              {result.sportBand.sourceLabel}).
            </p>
          ) : null}

          {result.amdrRows.length > 0 ? (
            <>
              {result.tdeeSource ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Energy base:{' '}
                  {Math.round(result.totalKcalPerDay ?? 0).toLocaleString('en-US')}{' '}
                  kcal/day ({result.tdeeSource}).
                </p>
              ) : null}
              <table className="mt-2 w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">Protein %</th>
                    <th className="pb-2">kcal/day</th>
                    <th className="pb-2">g/day</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amdrRows.map((row) => (
                    <tr key={row.sharePercent} className="border-t border-border">
                      <td className="py-2">{row.sharePercent}%</td>
                      <td className="py-2">{Math.round(row.proteinKcalPerDay)}</td>
                      <td className="py-2">{formatGrams(row.proteinGramsPerDay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}

          <p className="mt-2 text-xs text-muted-foreground">{result.disclaimer}</p>
        </section>
      ) : result?.statusHeadline ? (
        <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
      ) : null}
    </form>
  );
}

function formatGrams(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatFixed(n: number, digits: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
