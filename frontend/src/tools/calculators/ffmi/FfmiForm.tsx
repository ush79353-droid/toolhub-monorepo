'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatMeasure,
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  FfmiFieldErrors,
  FfmiInput,
  FfmiResult,
  HeightUnit,
  MassUnit,
  Sex,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
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

const MASS_UNITS: { value: MassUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
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

interface FormProps {
  input: FfmiInput;
  errors: FfmiFieldErrors;
  result: FfmiResult | null;
  onChange: (input: FfmiInput) => void;
}

export function FfmiForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<FfmiInput>) => onChange({ ...input, ...patch });

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const n = parseNumber(input.heightText);
    if (n == null) {
      set({ heightUnit: next });
      return;
    }
    const m = heightToMeters(n, input.heightUnit);
    set({
      heightUnit: next,
      heightText: formatMeasure(metersToHeight(m, next), 4),
    });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const n = parseNumber(input.weightText);
    if (n == null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(n, input.weightUnit);
    set({
      weightUnit: next,
      weightText: formatMeasure(kgToWeight(kg, next), 4),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="FFMI inputs">
        <h3 className="text-sm font-semibold text-accent">Input data</h3>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ffmi-sex"
                  value={opt.value}
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
          <label className={labelClass} htmlFor="ffmi-height">
            Height
            <InfoTooltip text="Stature used for FFMI = FFM ÷ height² (meters)." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="ffmi-height"
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
              onChange={(e) => switchHeight(e.target.value as HeightUnit)}
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

        <div>
          <label className={labelClass} htmlFor="ffmi-weight">
            Weight
            <InfoTooltip text="Body mass used with body-fat % to derive fat-free mass." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="ffmi-weight"
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
              onChange={(e) => switchWeight(e.target.value as WeightUnit)}
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
          <label className={labelClass} htmlFor="ffmi-bf">
            Body fat
            <InfoTooltip text="Body fat percentage. FFM = weight × (1 − fat%/100)." />
          </label>
          <FieldShell error={errors.bodyFatText}>
            <input
              id="ffmi-bf"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bodyFatText}
              onChange={(e) => set({ bodyFatText: e.target.value })}
              aria-invalid={Boolean(errors.bodyFatText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.bodyFatText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bodyFatText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="FFMI results">
        <h3 className="text-sm font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="ffmi-ffmi">
            FFMI
            <InfoTooltip text="Fat-free mass index in kg/m²." />
          </label>
          <FieldShell muted>
            <input
              id="ffmi-ffmi"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedFfmi ?? ''}
              aria-live="polite"
            />
            <span className={unitFixed}>kg/m²</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ffmi-norm">
            Normalized FFMI
            <InfoTooltip text="FFMI + 6.1 × (1.8 − height_m), adjusted to a 1.8 m reference height." />
          </label>
          <FieldShell muted>
            <input
              id="ffmi-norm"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedNormalizedFfmi ?? ''}
              aria-live="polite"
            />
            <span className={unitFixed}>kg/m²</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ffmi-ffm">
            Fat-free mass
            <InfoTooltip text="Lean mass = weight × (1 − body fat % / 100)." />
          </label>
          <FieldShell muted>
            <input
              id="ffmi-ffm"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedFfm ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.ffmUnit}
              onChange={(e) => set({ ffmUnit: e.target.value as MassUnit })}
              aria-label="Fat-free mass unit"
            >
              {MASS_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ffmi-fat">
            Total body fat
            <InfoTooltip text="Fat mass = weight × body fat % / 100." />
          </label>
          <FieldShell muted>
            <input
              id="ffmi-fat"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedFatMass ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.fatMassUnit}
              onChange={(e) =>
                set({ fatMassUnit: e.target.value as MassUnit })
              }
              aria-label="Total body fat unit"
            >
              {MASS_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">
              {result.statusHeadline}
            </span>
            {result.statusDetail ? ` ${result.statusDetail}` : ''}
          </p>
        ) : null}
      </section>
    </form>
  );
}
