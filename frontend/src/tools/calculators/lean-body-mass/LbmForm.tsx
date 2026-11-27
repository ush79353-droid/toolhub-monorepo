'use client';

import type { ReactNode } from 'react';
import {
  fromCm,
  fromKg,
  parseNumber,
  toCm,
  toKg,
} from './calculation';
import type {
  HeightUnit,
  LbmFieldErrors,
  LbmInput,
  LbmResult,
  Sex,
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

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
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

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: LbmInput;
  errors: LbmFieldErrors;
  result: LbmResult | null;
  onChange: (input: LbmInput) => void;
  onExampleMale: () => void;
  onExampleFemale: () => void;
}

export function LbmForm({
  input,
  errors,
  result,
  onChange,
  onExampleMale,
  onExampleFemale,
}: FormProps) {
  const set = (patch: Partial<LbmInput>) => onChange({ ...input, ...patch });

  const changeWeightUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.weightText);
    if (raw !== null && raw > 0) {
      const kg = toKg(raw, input.weightUnit);
      set({ weightUnit: next, weightText: formatField(fromKg(kg, next), 4) });
      return;
    }
    set({ weightUnit: next });
  };

  const changeHeightUnit = (next: HeightUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.heightUnit);
      set({ heightUnit: next, heightText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ heightUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Lean body mass inputs">
        <fieldset>
          <legend className={labelClass}>Sex</legend>
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
                  name="lbm-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as Sex })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="lbm-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="lbm-weight"
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
              onChange={(e) => changeWeightUnit(e.target.value as WeightUnit)}
              aria-label="Weight unit"
            >
              {WEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lbm-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="lbm-height"
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
              onChange={(e) => changeHeightUnit(e.target.value as HeightUnit)}
              aria-label="Height unit"
            >
              {HEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Lean body mass result">
        <div>
          <label className={labelClass} htmlFor="lbm-result">
            Lean body mass
          </label>
          <FieldShell muted>
            <input
              id="lbm-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedLean ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) => set({ resultUnit: e.target.value as WeightUnit })}
              aria-label="Lean body mass unit"
            >
              {WEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Check our examples:{' '}
          <button
            type="button"
            className="text-primary underline-offset-2 hover:underline"
            onClick={onExampleMale}
          >
            Example 1 (Male lean mass)
          </button>
          {' · '}
          <button
            type="button"
            className="text-primary underline-offset-2 hover:underline"
            onClick={onExampleFemale}
          >
            Example 2 (Female lean mass)
          </button>
        </p>
      </section>
    </form>
  );
}
