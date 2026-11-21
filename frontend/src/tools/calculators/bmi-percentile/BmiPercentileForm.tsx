'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AgeUnit,
  BmiPercentileFieldErrors,
  BmiPercentileInput,
  HeightUnit,
  Sex,
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

interface BmiPercentileFormProps {
  input: BmiPercentileInput;
  errors: BmiPercentileFieldErrors;
  onChange: (input: BmiPercentileInput) => void;
}

export function BmiPercentileForm({
  input,
  errors,
  onChange,
}: BmiPercentileFormProps) {
  const set = (patch: Partial<BmiPercentileInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4 rounded-2xl border border-border bg-white p-4 sm:p-5"
      noValidate
      autoComplete="off"
    >
      <div className="flex items-center gap-2">
        <span className="text-primary" aria-hidden>
          ▲
        </span>
        <h3 className="text-[15px] font-semibold text-accent">
          Child&apos;s details
        </h3>
      </div>

      <div>
        <div className={labelClass}>
          Age
          <InfoTooltip
            label="Age"
            text="WHO Child Growth Standards BMI-for-age cover 0–60 completed months (birth to 5 years). Switch between months and years; years are converted as age × 12. Ages outside this range are rejected — they are not extrapolated."
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
        <div className={labelClass}>
          Is it a boy or a girl?
          <InfoTooltip
            label="Sex"
            text="WHO BMI-for-age LMS tables are sex-specific. Choose boy or girl to select the matching reference."
          />
        </div>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Is it a boy or a girl?"
        >
          {(
            [
              ['boy', 'Boy', '♂'],
              ['girl', 'Girl', '♀'],
            ] as const
          ).map(([value, label, icon]) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bmi-pct-sex"
                value={value}
                checked={input.sex === value}
                onChange={() => set({ sex: value as Sex })}
                className="h-4 w-4 accent-primary"
              />
              <span
                className={value === 'boy' ? 'text-primary' : 'text-rose-500'}
                aria-hidden
              >
                {icon}
              </span>
              {label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-primary"
          checked={input.knowBmi}
          onChange={(e) => set({ knowBmi: e.target.checked })}
        />
        <span>I know the child&apos;s BMI (uncheck to calculate BMI)</span>
      </label>

      {input.knowBmi ? (
        <div>
          <div className={labelClass}>
            BMI
            <InfoTooltip
              label="BMI"
              text="Body mass index in kg/m². If you do not know BMI, uncheck the box above and enter height and weight instead."
            />
          </div>
          <FieldShell error={errors.bmi}>
            <input
              type="text"
              inputMode="decimal"
              aria-label="BMI"
              className={inputClass}
              value={input.bmi}
              onChange={(e) => set({ bmi: e.target.value })}
            />
          </FieldShell>
          {errors.bmi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bmi}</p>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className={labelClass}>Height</div>
            <FieldShell error={errors.height}>
              <input
                type="text"
                inputMode="decimal"
                aria-label="Height"
                className={inputClass}
                value={input.height}
                onChange={(e) => set({ height: e.target.value })}
              />
              <select
                aria-label="Height unit"
                className={selectClass}
                value={input.heightUnit}
                onChange={(e) =>
                  set({ heightUnit: e.target.value as HeightUnit })
                }
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </FieldShell>
            {errors.height ? (
              <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
            ) : null}
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
        </div>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
