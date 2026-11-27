'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromKg, fromMeters, parseNumber, toKg, toMeters } from './calculation';
import type {
  HeightUnit,
  PlasmaVolumeFieldErrors,
  PlasmaVolumeInput,
  PlasmaVolumeResult,
  VolumeUnit,
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

function fmt(n: number, d = 4): string {
  return String(Number(n.toFixed(d)));
}

interface FormProps {
  input: PlasmaVolumeInput;
  errors: PlasmaVolumeFieldErrors;
  result: PlasmaVolumeResult | null;
  onChange: (input: PlasmaVolumeInput) => void;
}

export function PlasmaVolumeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<PlasmaVolumeInput>) =>
    onChange({ ...input, ...patch });

  const changeWeightUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.weightText);
    if (raw !== null && raw > 0) {
      const kg = toKg(raw, input.weightUnit);
      set({ weightUnit: next, weightText: fmt(fromKg(kg, next)) });
      return;
    }
    set({ weightUnit: next });
  };

  const changeHeightUnit = (next: HeightUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const m = toMeters(raw, input.heightUnit);
      set({ heightUnit: next, heightText: fmt(fromMeters(m, next)) });
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
      <section className={sectionClass} aria-label="Plasma volume inputs">
        <div>
          <label className={labelClass} htmlFor="pv-wt">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="pv-wt"
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

        <div>
          <label className={labelClass} htmlFor="pv-hct">
            Hematocrit
            <InfoTooltip text="Hematocrit as a percentage. Plasma fraction = 1 − Hct/100." />
          </label>
          <FieldShell error={errors.hematocritText}>
            <input
              id="pv-hct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hematocritText}
              onChange={(e) => set({ hematocritText: e.target.value })}
              aria-invalid={Boolean(errors.hematocritText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.hematocritText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hematocritText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pv-f">
            Plasma volume for females
            <InfoTooltip text="Weight-only TBV = 65 mL/kg × (1 − Hct/100)." />
          </label>
          <FieldShell muted>
            <input
              id="pv-f"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedFemale ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.volumeUnit}
              onChange={(e) =>
                set({ volumeUnit: e.target.value as VolumeUnit })
              }
              aria-label="Volume unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="pv-m">
            Plasma volume for males
            <InfoTooltip text="Weight-only TBV = 70 mL/kg × (1 − Hct/100)." />
          </label>
          <FieldShell muted>
            <input
              id="pv-m"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMale ?? ''}
              aria-live="polite"
            />
            <span className={unitFixed}>{input.volumeUnit}</span>
          </FieldShell>
        </div>

        <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs leading-relaxed text-accent">
          Optional — fill in height if you want to calculate plasma volume using
          other methods.
        </p>

        <div>
          <label className={labelClass} htmlFor="pv-ht">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="pv-ht"
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
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        {result?.hasHeightMethods ? (
          <div className="space-y-3 border-t border-border pt-3">
            <p className="text-xs font-semibold text-accent">
              Height-based methods
            </p>
            <ReadOnly
              id="pv-fn"
              label={`Nadler female (${input.volumeUnit})`}
              value={result.formattedFemaleNadler}
            />
            <ReadOnly
              id="pv-mn"
              label={`Nadler male (${input.volumeUnit})`}
              value={result.formattedMaleNadler}
            />
            <ReadOnly
              id="pv-fl"
              label={`Lemmens female (${input.volumeUnit})`}
              value={result.formattedFemaleLemmens}
            />
            <ReadOnly
              id="pv-ml"
              label={`Lemmens male (${input.volumeUnit})`}
              value={result.formattedMaleLemmens}
            />
          </div>
        ) : null}

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

function ReadOnly({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <FieldShell muted>
        <input
          id={id}
          type="text"
          readOnly
          className={`${inputClass} text-muted-foreground`}
          value={value}
        />
      </FieldShell>
    </div>
  );
}
