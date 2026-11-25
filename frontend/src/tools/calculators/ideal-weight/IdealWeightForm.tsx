'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  HeightUnit,
  IdealWeightFieldErrors,
  IdealWeightInput,
  IdealWeightResult,
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

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
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

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: IdealWeightInput;
  errors: IdealWeightFieldErrors;
  result: IdealWeightResult | null;
  onChange: (input: IdealWeightInput) => void;
}

export function IdealWeightForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<IdealWeightInput>) =>
    onChange({ ...input, ...patch });

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
      set({
        weightUnit: next,
        weightText: formatField(kgToWeight(kg, next), 4),
      });
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
      <section className={sectionClass} aria-label="About you">
        <p className="text-sm font-semibold text-accent">About you</p>
        <p className="text-xs text-muted-foreground">
          Enter your sex, height, and weight to see ideal weight estimates based
          on various formulas.
        </p>

        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {([
              ['female', 'Female'],
              ['male', 'Male'],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ibw-sex"
                  checked={input.sex === value}
                  onChange={() => set({ sex: value as Sex })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="ibw-height">
            Height
            <InfoTooltip text="Standing height. IBW formulas use inches over 5 ft (60 in)." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="ibw-height"
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
          <label className={labelClass} htmlFor="ibw-weight">
            Current weight
            <InfoTooltip text="Optional. Never changes IBW formula outputs — only comparison text." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="ibw-weight"
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

      <section className={sectionClass} aria-label="Ideal weight results">
        <p className="text-sm font-semibold text-accent">Ideal weight estimates</p>
        {result && result.estimates.length > 0 ? (
          <ul className="space-y-2">
            {result.estimates.map((est) => (
              <li
                key={est.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-sky-50/60 px-3 py-2 text-sm"
              >
                <span className="font-medium text-accent">{est.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {est.formattedDisplay}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">
            Estimates appear when height is valid.
          </p>
        )}
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
