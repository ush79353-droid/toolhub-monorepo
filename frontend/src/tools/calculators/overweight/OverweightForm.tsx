'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HeightUnit,
  OverweightFieldErrors,
  OverweightInput,
  OverweightResult,
  SexSelection,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'm', label: 'm' },
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
];

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
  { value: 'st', label: 'st' },
];

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: OverweightInput;
  errors: OverweightFieldErrors;
  result: OverweightResult | null;
  onChange: (input: OverweightInput) => void;
}

export function OverweightForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<OverweightInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Insert your data">
        <div>
          <h3 className="text-sm font-semibold text-accent">Insert your data</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Information relative to your BMI and ponderal index will appear
            below.
          </p>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary"
            checked={input.childMode}
            onChange={(e) =>
              set({
                childMode: e.target.checked,
                sex: '',
                ageText: '',
              })
            }
          />
          <span>
            The calculation concerns a child or adolescent{' '}
            <span className="font-medium">up to the age of 19</span>.
          </span>
        </label>

        {input.childMode ? (
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ow-sex">
                Sex
                <InfoTooltip text="Required for CDC BMI-for-age percentiles (ages 2–19)." />
              </label>
              <select
                id="ow-sex"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.sex}
                onChange={(e) =>
                  set({ sex: e.target.value as SexSelection })
                }
                aria-invalid={Boolean(errors.sex)}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              {errors.sex ? (
                <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="ow-age">
                Age
                <InfoTooltip text="Age in years (2–19 inclusive) for pediatric BMI-for-age." />
              </label>
              <FieldShell error={errors.ageText}>
                <input
                  id="ow-age"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.ageText}
                  onChange={(e) => set({ ageText: e.target.value })}
                  aria-invalid={Boolean(errors.ageText)}
                />
                <span className="shrink-0 pr-3 font-mono text-xs text-primary">
                  years
                </span>
              </FieldShell>
              {errors.ageText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="ow-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="ow-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit })
              }
              aria-label="Weight unit"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ow-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="ow-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
              aria-label="Height unit"
            >
              {HEIGHT_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        {(result?.formattedBmi || result?.formattedPonderal) && (
          <div className="space-y-2 rounded-lg border border-sky-100 bg-sky-50/70 px-3 py-3 text-sm">
            {result.formattedBmi ? (
              <p>
                <span className="font-medium text-accent">BMI:</span>{' '}
                {result.formattedBmi} kg/m²
              </p>
            ) : null}
            {result.formattedPonderal ? (
              <p>
                <span className="font-medium text-accent">Ponderal index:</span>{' '}
                {result.formattedPonderal} kg/m³
              </p>
            ) : null}
            {result.category ? (
              <p>
                <span className="font-medium text-accent">Category:</span>{' '}
                {result.category.label} ({result.category.rangeLabel})
              </p>
            ) : null}
            {result.formattedPercentile ? (
              <p>
                <span className="font-medium text-accent">
                  BMI-for-age percentile:
                </span>{' '}
                {result.formattedPercentile}
              </p>
            ) : null}
          </div>
        )}

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">
              {result.statusHeadline}
            </span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        {result?.disclaimer ??
          'The ponderal index and BMI results can differ. Always consult a physician if any health condition bothers you.'}
      </p>
    </form>
  );
}
