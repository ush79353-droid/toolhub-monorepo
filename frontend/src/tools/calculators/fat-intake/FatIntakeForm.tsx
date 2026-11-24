'use client';

import type { ReactNode } from 'react';
import { ACTIVITY_OPTIONS } from '../calorie/types';
import type {
  FatIntakeFieldErrors,
  FatIntakeInput,
  FatIntakeResult,
  FatSex,
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
  input: FatIntakeInput;
  errors: FatIntakeFieldErrors;
  result: FatIntakeResult | null;
  onChange: (input: FatIntakeInput) => void;
}

export function FatIntakeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<FatIntakeInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
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
                  name="fat-intake-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex: sex as FatSex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="fat-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="fat-height"
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
          <label className={labelClass} htmlFor="fat-weight">
            Current weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="fat-weight"
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
          <label className={labelClass} htmlFor="fat-age">
            Age
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="fat-age"
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
          <label className={labelClass} htmlFor="fat-activity">
            Activity level
          </label>
          <select
            id="fat-activity"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as FatIntakeInput['activityId'] })
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
          <label className={labelClass} htmlFor="fat-calories">
            Calories
          </label>
          <FieldShell error={errors.caloriesText}>
            <input
              id="fat-calories"
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
      </section>

      {result?.fatRows.length ? (
        <section className={sectionClass} aria-live="polite">
          <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
          <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
          {result.tdeeSource ? (
            <p className="text-xs text-muted-foreground">
              Energy base: {Math.round(result.totalKcalPerDay ?? 0).toLocaleString('en-US')}{' '}
              kcal/day ({result.tdeeSource}).
            </p>
          ) : null}
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Total fat %</th>
                <th className="pb-2">kcal/day</th>
                <th className="pb-2">g/day</th>
              </tr>
            </thead>
            <tbody>
              {result.fatRows.map((row) => (
                <tr key={row.sharePercent} className="border-t border-border">
                  <td className="py-2">{row.sharePercent}%</td>
                  <td className="py-2">{Math.round(row.fatKcalPerDay)}</td>
                  <td className="py-2">{formatGrams(row.fatGramsPerDay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.saturatedFatMaxGrams != null ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Saturated fat upper guidance (&lt;{result.saturatedSharePercent}% of
              energy):{' '}
              <strong className="text-accent">
                {formatGrams(result.saturatedFatMaxGrams)} g/day
              </strong>{' '}
              ({Math.round(result.saturatedFatMaxKcal ?? 0)} kcal/day). Distinct from
              total-fat AMDR rows.
            </p>
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
