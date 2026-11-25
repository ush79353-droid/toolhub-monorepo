'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  metersToWaist,
  parseNumber,
  waistToMeters,
  weightToKg,
} from './calculation';
import type {
  AbsiFieldErrors,
  AbsiInput,
  AbsiResult,
  HeightUnit,
  Sex,
  WaistUnit,
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
  { value: 'lb', label: 'lb' },
  { value: 'st', label: 'st' },
];

const WAIST_UNITS: { value: WaistUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
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
  input: AbsiInput;
  errors: AbsiFieldErrors;
  result: AbsiResult | null;
  onChange: (input: AbsiInput) => void;
}

export function AbsiForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<AbsiInput>) => onChange({ ...input, ...patch });

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

  const changeWaistUnit = (next: WaistUnit) => {
    const raw = parseNumber(input.waistText);
    if (raw !== null && raw > 0) {
      const meters = waistToMeters(raw, input.waistUnit);
      set({
        waistUnit: next,
        waistText: formatField(metersToWaist(meters, next), 4),
      });
      return;
    }
    set({ waistUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="ABSI input data">
        <p className="text-sm font-semibold text-accent">Input data</p>

        <fieldset>
          <legend className={labelClass}>
            Sex
            <InfoTooltip text="Used with age for the NHANES ABSI z-score reference. Does not change the raw ABSI index." />
          </legend>
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
                  name="absi-sex"
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
          <label className={labelClass} htmlFor="absi-age">
            Age
            <InfoTooltip text="Whole years for Table S1 lookup (ages 2–85+). Required for the z-score; raw ABSI still computes without age." />
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="absi-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <span className={unitFixed}>years</span>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="absi-height">
            Height
            <InfoTooltip text="Standing height. Converted to meters before BMI and ABSI." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="absi-height"
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
          <label className={labelClass} htmlFor="absi-weight">
            Weight
            <InfoTooltip text="Body mass. Converted to kilograms before BMI and ABSI." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="absi-weight"
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
          <label className={labelClass} htmlFor="absi-waist">
            Waist circumference
            <InfoTooltip text="Waist circumference converted to meters. Higher ABSI means a larger waist for a given height and weight." />
          </label>
          <FieldShell error={errors.waistText}>
            <input
              id="absi-waist"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.waistText}
              onChange={(e) => set({ waistText: e.target.value })}
              aria-invalid={Boolean(errors.waistText)}
            />
            <select
              className={unitSelectClass}
              value={input.waistUnit}
              onChange={(e) => changeWaistUnit(e.target.value as WaistUnit)}
              aria-label="Waist circumference unit"
            >
              {WAIST_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.waistText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.waistText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="ABSI results">
        <p className="text-sm font-semibold text-accent">Results</p>

        <div>
          <label className={labelClass} htmlFor="absi-result">
            ABSI
            <InfoTooltip text="A Body Shape Index (m^(11/6)·kg^(−2/3)). Independent of BMI by construction." />
          </label>
          <FieldShell muted>
            <input
              id="absi-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedAbsi ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="absi-z">
            ABSI z-score
            <InfoTooltip text="(ABSI − age/sex NHANES mean) ÷ SD. Zero means average for that age and sex in the reference sample." />
          </label>
          <FieldShell muted>
            <input
              id="absi-z"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedZScore ?? ''}
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
      </section>
    </form>
  );
}
