'use client';

import type { ReactNode } from 'react';
import { ACTIVITY_OPTIONS } from '../calorie/types';
import type {
  CarbCalculatorFieldErrors,
  CarbCalculatorInput,
  CarbCalculatorResult,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: CarbCalculatorInput;
  errors: CarbCalculatorFieldErrors;
  result: CarbCalculatorResult | null;
  onChange: (input: CarbCalculatorInput) => void;
}

export function CarbCalculatorForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<CarbCalculatorInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <select
            className={inputClass}
            value={input.sex}
            onChange={(e) => set({ sex: e.target.value as CarbCalculatorInput['sex'] })}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </fieldset>

        <Field label="Height" error={errors.heightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.heightText}
              inputMode="decimal"
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.heightUnit}
              onChange={(e) => set({ heightUnit: e.target.value as HeightUnit })}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </Field>

        <Field label="Weight" error={errors.weightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.weightText}
              inputMode="decimal"
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </Field>

        <Field label="Age" error={errors.ageYearsText}>
          <input
            className={inputClass}
            value={input.ageYearsText}
            inputMode="numeric"
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
        </Field>

        <Field label="Activity level">
          <select
            className={inputClass}
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as CarbCalculatorInput['activityId'] })
            }
          >
            {ACTIVITY_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Total calories" error={errors.totalKcalText} suffix="kcal/day">
          <input
            className={inputClass}
            value={input.totalKcalText}
            inputMode="decimal"
            onChange={(e) => set({ totalKcalText: e.target.value })}
          />
        </Field>

        <p className="text-xs text-muted-foreground">
          The recommended minimum intake of carbohydrate for an adult is{' '}
          <strong>{result?.rdaGrams ?? 130} grams</strong> ({result?.rdaKcal ?? 520} kcal) a day.
        </p>
      </section>

      {result?.carbRows.length ? (
        <section className={sectionClass}>
          <p className="text-sm text-muted-foreground">
            {result.tdeeSource
              ? `Energy base: ${Math.round(result.totalKcalPerDay ?? 0).toLocaleString('en-US')} kcal/day (${result.tdeeSource}).`
              : null}
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Carb %</th>
                <th className="pb-2">kcal/day</th>
                <th className="pb-2">g/day</th>
              </tr>
            </thead>
            <tbody>
              {result.carbRows.map((row) => (
                <tr key={row.sharePercent} className="border-t border-border">
                  <td className="py-2">{row.sharePercent}%</td>
                  <td className="py-2">{Math.round(row.carbKcalPerDay)}</td>
                  <td className="py-2">{Math.round(row.carbGramsPerDay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  suffix,
  children,
}: {
  label: string;
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {suffix ? <span className="ml-1 font-normal text-muted-foreground">{suffix}</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}