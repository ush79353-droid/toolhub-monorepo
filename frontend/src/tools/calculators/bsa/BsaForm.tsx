'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatHeight,
  formatWeight,
  heightFromCm,
  heightToCm,
  parseNumber,
  weightFromKg,
  weightToKg,
} from './calculation';
import type {
  BsaFieldErrors,
  BsaInput,
  BsaResult,
  BsaUnit,
  HeightUnit,
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
const BSA_UNITS: { value: BsaUnit; label: string }[] = [
  { value: 'm2', label: 'm²' },
  { value: 'ft2', label: 'ft²' },
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
  input: BsaInput;
  errors: BsaFieldErrors;
  result: BsaResult | null;
  onChange: (input: BsaInput) => void;
}

export function BsaForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<BsaInput>) => onChange({ ...input, ...patch });

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
      weightText: formatWeight(weightFromKg(kg, next), next),
    });
  };

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const n = parseNumber(input.heightText);
    if (n == null) {
      set({ heightUnit: next });
      return;
    }
    const cm = heightToCm(n, input.heightUnit);
    set({
      heightUnit: next,
      heightText: formatHeight(heightFromCm(cm, next), next),
    });
  };

  const unitLabel = input.resultUnit === 'ft2' ? 'ft²' : 'm²';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="BSA inputs">
        <div>
          <label className={labelClass} htmlFor="bsa-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="bsa-weight"
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
              {WEIGHT_UNITS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bsa-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="bsa-height"
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
              {HEIGHT_UNITS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bsa-result">
            BSA
            <InfoTooltip text="Primary Du Bois body surface area." />
          </label>
          <FieldShell muted>
            <input
              id="bsa-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedPrimary ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) => set({ resultUnit: e.target.value as BsaUnit })}
              aria-label="BSA unit"
            >
              {BSA_UNITS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>

      <section className={sectionClass} aria-label="Additional BSA calculations">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm font-semibold text-accent"
          aria-expanded={input.showAdditional}
          onClick={() => set({ showAdditional: !input.showAdditional })}
        >
          Additional BSA calculations
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              input.showAdditional ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.showAdditional ? (
          <div className="space-y-2 text-sm text-accent">
            {(
              [
                ['Mosteller', result?.formattedAdditional?.mosteller],
                ['Fujimoto', result?.formattedAdditional?.fujimoto],
                ['Gehan & George', result?.formattedAdditional?.gehanGeorge],
                ['Haycock', result?.formattedAdditional?.haycock],
              ] as const
            ).map(([name, value]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="text-muted-foreground">{name}</span>
                <span className="tabular-nums font-medium">
                  {value ? `${value} ${unitLabel}` : '—'}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </form>
  );
}
