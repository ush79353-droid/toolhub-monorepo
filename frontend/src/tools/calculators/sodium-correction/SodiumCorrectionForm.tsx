'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatGlucose,
  glucoseFromMgDl,
  glucoseToMgDl,
  parseNumber,
} from './calculation';
import type {
  GlucoseUnit,
  SodiumCorrectionFieldErrors,
  SodiumCorrectionInput,
  SodiumCorrectionResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixedClass =
  'flex h-11 shrink-0 items-center border-l border-border px-2.5 text-sm text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const GLUCOSE_UNITS: { value: GlucoseUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
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
  input: SodiumCorrectionInput;
  errors: SodiumCorrectionFieldErrors;
  result: SodiumCorrectionResult | null;
  onChange: (input: SodiumCorrectionInput) => void;
}

export function SodiumCorrectionForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SodiumCorrectionInput>) =>
    onChange({ ...input, ...patch });

  const switchGlucoseUnit = (next: GlucoseUnit) => {
    if (next === input.glucoseUnit) return;
    const n = parseNumber(input.glucoseText);
    if (n == null) {
      set({ glucoseUnit: next });
      return;
    }
    const mgDl = glucoseToMgDl(n, input.glucoseUnit);
    const converted = glucoseFromMgDl(mgDl, next);
    set({
      glucoseUnit: next,
      glucoseText: formatGlucose(converted, next),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sodium correction inputs">
        <div>
          <label className={labelClass} htmlFor="sc-sodium">
            Patient&apos;s sodium
            <InfoTooltip text="Measured serum sodium in mEq/L (numerically equal to mmol/L for Na⁺)." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="sc-sodium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sodiumText}
              onChange={(e) => set({ sodiumText: e.target.value })}
              aria-invalid={Boolean(errors.sodiumText)}
            />
            <span className={unitFixedClass} aria-hidden>
              mEq/L
            </span>
          </FieldShell>
          {errors.sodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sc-glucose">
            Serum glucose
            <InfoTooltip text="Serum glucose. Formulas use mg/dL; mmol/L is converted ×18.0182 before math." />
          </label>
          <FieldShell error={errors.glucoseText}>
            <input
              id="sc-glucose"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.glucoseText}
              onChange={(e) => set({ glucoseText: e.target.value })}
              aria-invalid={Boolean(errors.glucoseText)}
            />
            <select
              className={unitSelectClass}
              value={input.glucoseUnit}
              onChange={(e) =>
                switchGlucoseUnit(e.target.value as GlucoseUnit)
              }
              aria-label="Serum glucose unit"
            >
              {GLUCOSE_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.glucoseText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.glucoseText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sc-corrected">
            Corrected sodium
            <InfoTooltip text="Hillier 1999 estimate: Na + 0.024 × (glucose mg/dL − 100). Not a treatment target." />
          </label>
          <FieldShell muted>
            <input
              id="sc-corrected"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedHillier ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixedClass} aria-hidden>
              mEq/L
            </span>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>

      <section
        className={sectionClass}
        aria-label="Corrected sodium older version"
      >
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          aria-expanded={input.showOlderVersion}
          onClick={() => set({ showOlderVersion: !input.showOlderVersion })}
        >
          Corrected sodium (older version)
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              input.showOlderVersion ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.showOlderVersion ? (
          <div>
            <label className={labelClass} htmlFor="sc-katz">
              Corrected sodium (Katz 1.6)
              <InfoTooltip text="Katz 1973: Na + 0.016 × (glucose mg/dL − 100)." />
            </label>
            <FieldShell muted>
              <input
                id="sc-katz"
                type="text"
                readOnly
                tabIndex={0}
                className={`${inputClass} text-muted-foreground`}
                value={result?.formattedKatz ?? ''}
                aria-live="polite"
                aria-readonly="true"
              />
              <span className={unitFixedClass} aria-hidden>
                mEq/L
              </span>
            </FieldShell>
          </div>
        ) : null}
      </section>
    </form>
  );
}
