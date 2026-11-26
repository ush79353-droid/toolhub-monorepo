'use client';

import type { ReactNode } from 'react';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  HeightUnit,
  PersonMode,
  PonderalFieldErrors,
  PonderalInput,
  PonderalResult,
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
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
];

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'lb', label: 'lb' },
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
  input: PonderalInput;
  errors: PonderalFieldErrors;
  result: PonderalResult | null;
  onChange: (input: PonderalInput) => void;
}

export function PonderalForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<PonderalInput>) => onChange({ ...input, ...patch });

  const changeHeightUnit = (next: HeightUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const meters = heightToMeters(raw, input.heightUnit);
      set({
        heightUnit: next,
        heightText: formatField(metersToHeight(meters, next), 4),
      });
      return;
    }
    set({ heightUnit: next });
  };

  const changeWeightUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.weightText);
    if (raw !== null && raw > 0) {
      const kg = weightToKg(raw, input.weightUnit);
      set({ weightUnit: next, weightText: formatField(kgToWeight(kg, next), 4) });
      return;
    }
    set({ weightUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Ponderal index inputs">
        <fieldset>
          <legend className={labelClass}>Child or adult?</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                { value: 'adult', label: 'Adult' },
                { value: 'neonate', label: 'Neonate, infant' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ponderal-mode"
                  checked={input.mode === opt.value}
                  onChange={() => set({ mode: opt.value as PersonMode })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="ponderal-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="ponderal-height"
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

        <div>
          <label className={labelClass} htmlFor="ponderal-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="ponderal-weight"
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
      </section>

      <section className={sectionClass} aria-label="Ponderal index result">
        <div>
          <label className={labelClass} htmlFor="ponderal-result">
            Ponderal index
          </label>
          <FieldShell muted>
            <input
              id="ponderal-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedIndex ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>{result?.unitLabel ?? 'kg/m³'}</span>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          {result?.disclaimer ??
            'Always double-check the calculations. The Ponderal Index has limitations, and the results should be interpreted by a health care provider.'}
        </p>
      </section>
    </form>
  );
}
