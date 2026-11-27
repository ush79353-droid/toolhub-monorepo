'use client';

import type { ReactNode } from 'react';
import type {
  AgeUnit,
  PersonMode,
  Sex,
  WaterIntakeFieldErrors,
  WaterIntakeInput,
  WaterIntakeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
  input: WaterIntakeInput;
  errors: WaterIntakeFieldErrors;
  result: WaterIntakeResult | null;
  onChange: (input: WaterIntakeInput) => void;
}

export function WaterIntakeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<WaterIntakeInput>) =>
    onChange({ ...input, ...patch });

  const beverageLine =
    result?.beverageLiters != null && result.beverageCups != null
      ? `${result.formattedBeverages} L (≈ ${result.beverageCups} cups) / day`
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Water intake inputs">
        <fieldset>
          <legend className={labelClass}>Child or adult?</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                { value: 'adult', label: 'Adult' },
                { value: 'child', label: 'Child' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="water-mode"
                  checked={input.mode === opt.value}
                  onChange={() => set({ mode: opt.value as PersonMode })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Male or female?</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="water-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as Sex })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {input.mode === 'child' ? (
          <div>
            <label className={labelClass} htmlFor="water-age">
              Age
            </label>
            <FieldShell error={errors.ageText}>
              <input
                id="water-age"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.ageText}
                onChange={(e) => set({ ageText: e.target.value })}
                aria-invalid={Boolean(errors.ageText)}
              />
              <select
                className={unitSelectClass}
                value={input.ageUnit}
                onChange={(e) => set({ ageUnit: e.target.value as AgeUnit })}
                aria-label="Age unit"
              >
                <option value="years">years</option>
                <option value="months">months</option>
              </select>
            </FieldShell>
            {errors.ageText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={sectionClass} aria-label="Water intake results">
        <div>
          <p className={labelClass}>Total water (incl. water in food)</p>
          <FieldShell muted>
            <input
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.totalLiters != null
                  ? `≈ ${result.formattedTotal} L / day`
                  : ''
              }
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        <div>
          <p className={labelClass}>Water from beverages</p>
          <FieldShell muted>
            <input
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={beverageLine}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
        <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-950">
          {result?.disclaimer}
        </p>
      </section>
    </form>
  );
}
