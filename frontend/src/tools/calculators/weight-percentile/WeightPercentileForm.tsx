'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AgeUnit,
  Sex,
  WeightPercentileFieldErrors,
  WeightPercentileInput,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface WeightPercentileFormProps {
  input: WeightPercentileInput;
  errors: WeightPercentileFieldErrors;
  onChange: (input: WeightPercentileInput) => void;
}

export function WeightPercentileForm({
  input,
  errors,
  onChange,
}: WeightPercentileFormProps) {
  const set = (patch: Partial<WeightPercentileInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4 rounded-2xl border border-border bg-white p-4 sm:p-5"
      noValidate
      autoComplete="off"
    >
      <div>
        <div className={labelClass}>
          Age
          <InfoTooltip
            label="Age"
            text="WHO Child Growth Standards weight-for-age cover 0–60 completed months (birth to 5 years). Ages outside this range are rejected — not extrapolated."
          />
        </div>
        <FieldShell error={errors.age}>
          <input
            type="text"
            inputMode="decimal"
            aria-label="Age"
            className={inputClass}
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
          />
          <select
            aria-label="Age unit"
            className={selectClass}
            value={input.ageUnit}
            onChange={(e) => set({ ageUnit: e.target.value as AgeUnit })}
          >
            <option value="mos">mos</option>
            <option value="yrs">yrs</option>
          </select>
        </FieldShell>
        {errors.age ? (
          <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>Is it a boy or a girl?</div>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Is it a boy or a girl?"
        >
          {(
            [
              ['girl', 'Girl', '♀'],
              ['boy', 'Boy', '♂'],
            ] as const
          ).map(([value, label, icon]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="wfa-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === value}
                onChange={() => set({ sex: value as Sex })}
              />
              <span>
                {label} <span aria-hidden>{icon}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className={labelClass}>Weight</div>
        <FieldShell error={errors.weight}>
          <input
            type="text"
            inputMode="decimal"
            aria-label="Weight"
            className={inputClass}
            value={input.weight}
            onChange={(e) => set({ weight: e.target.value })}
          />
          <select
            aria-label="Weight unit"
            className={selectClass}
            value={input.weightUnit}
            onChange={(e) =>
              set({ weightUnit: e.target.value as WeightUnit })
            }
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </FieldShell>
        {errors.weight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
