'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { cmToHeightUnit, heightToCm } from './calculation';
import type {
  HeightUnit,
  Sex,
  VitalCapacityFieldErrors,
  VitalCapacityInput,
  VitalCapacityResult,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
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

function parseOptional(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

interface FormProps {
  input: VitalCapacityInput;
  errors: VitalCapacityFieldErrors;
  result: VitalCapacityResult | null;
  onChange: (input: VitalCapacityInput) => void;
}

export function VitalCapacityForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<VitalCapacityInput>) =>
    onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit || input.height == null) {
      set({ heightUnit: next });
      return;
    }
    const cm = heightToCm(input.height, input.heightUnit);
    set({
      heightUnit: next,
      height: Math.round(cmToHeightUnit(cm, next) * 1000) / 1000,
    });
  };

  const hasVc = result?.vcLiters != null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Predicted vital capacity inputs">
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
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
                  name="vc-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as Sex })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="vc-age">
            Age
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="vc-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears ?? ''}
              onChange={(e) => set({ ageYears: parseOptional(e.target.value) })}
              aria-invalid={Boolean(errors.ageYears)}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="vc-height">
            Height
          </label>
          <FieldShell error={errors.height}>
            <input
              id="vc-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height ?? ''}
              onChange={(e) => set({ height: parseOptional(e.target.value) })}
              aria-invalid={Boolean(errors.height)}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) => switchHeightUnit(e.target.value as HeightUnit)}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.height ? (
            <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Predicted vital capacity result">
        <div>
          <div className={labelClass}>
            Vital capacity
            <InfoTooltip text="Anthropometric predicted VC (liters). Not measured spirometry." />
          </div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={hasVc ? result.formattedVc.replace(/ (L|mL)$/, '') : ''}
              aria-label="Vital capacity"
            />
            <select
              className={selectClass}
              aria-label="Vital capacity unit"
              value={input.volumeUnit}
              onChange={(e) =>
                set({ volumeUnit: e.target.value as VolumeUnit })
              }
            >
              <option value="L">L</option>
              <option value="mL">mL</option>
            </select>
          </FieldShell>
        </div>
        {errors.form ? (
          <p className="text-xs text-muted-foreground">{errors.form}</p>
        ) : null}
        {hasVc ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}