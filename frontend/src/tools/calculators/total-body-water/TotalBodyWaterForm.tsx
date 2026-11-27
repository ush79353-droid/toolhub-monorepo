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
  Sex,
  TotalBodyWaterFieldErrors,
  TotalBodyWaterInput,
  TotalBodyWaterResult,
  VolumeUnit,
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
  input: TotalBodyWaterInput;
  errors: TotalBodyWaterFieldErrors;
  result: TotalBodyWaterResult | null;
  onChange: (input: TotalBodyWaterInput) => void;
}

export function TotalBodyWaterForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<TotalBodyWaterInput>) =>
    onChange({ ...input, ...patch });

  const changeHeightUnit = (next: HeightUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.heightUnit);
      set({ heightUnit: next, heightText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ heightUnit: next });
  };

  const changeWeightUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.weightText);
    if (raw !== null && raw > 0) {
      const kg = toKg(raw, input.weightUnit);
      set({ weightUnit: next, weightText: formatField(fromKg(kg, next), 4) });
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
      <section className={sectionClass} aria-label="Your details">
        <h3 className="text-sm font-semibold text-accent">Your details</h3>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                ['female', 'Female'],
                ['male', 'Male'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="tbw-sex"
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
          <label className={labelClass} htmlFor="tbw-age">
            Age
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="tbw-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <span className={unitFixed}>yrs</span>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tbw-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="tbw-height"
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
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="tbw-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="tbw-weight"
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
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Total body water results">
        <h3 className="text-sm font-semibold text-accent">
          Total body water results
        </h3>

        <div>
          <label className={labelClass} htmlFor="tbw-vol">
            Total body water (volume)
          </label>
          <FieldShell muted>
            <input
              id="tbw-vol"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedVolume ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.volumeUnit}
              onChange={(e) =>
                set({ volumeUnit: e.target.value as VolumeUnit })
              }
              aria-label="TBW volume unit"
            >
              <option value="L">L</option>
              <option value="mL">mL</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="tbw-mass">
            Total body water (weight)
          </label>
          <FieldShell muted>
            <input
              id="tbw-mass"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMass ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.massUnit}
              onChange={(e) => set({ massUnit: e.target.value as WeightUnit })}
              aria-label="TBW mass unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="tbw-pct">
            Percentage of body weight
          </label>
          <FieldShell muted>
            <input
              id="tbw-pct"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedPercent ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>
            {result.statusDetail ? ` ${result.statusDetail}` : ''}
          </p>
        ) : null}
      </section>
    </form>
  );
}
