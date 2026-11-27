'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BicarbUnit,
  PressureUnit,
  WintersFormulaFieldErrors,
  WintersFormulaInput,
  WintersFormulaResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const BICARB_UNITS: { value: BicarbUnit; label: string }[] = [
  { value: 'mmol_l', label: 'mmol/L' },
  { value: 'meq_l', label: 'mEq/L' },
];

const PRESSURE_UNITS: { value: PressureUnit; label: string }[] = [
  { value: 'kPa', label: 'kPa' },
  { value: 'mmHg', label: 'mmHg' },
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
  input: WintersFormulaInput;
  errors: WintersFormulaFieldErrors;
  result: WintersFormulaResult | null;
  onChange: (input: WintersFormulaInput) => void;
}

export function WintersFormulaForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<WintersFormulaInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Winters formula inputs">
        <div>
          <label className={labelClass} htmlFor="wf-hco3">
            HCO₃
            <InfoTooltip text="Serum bicarbonate (or total CO₂ as used locally). mmol/L equals mEq/L numerically." />
          </label>
          <FieldShell error={errors.bicarbonateText}>
            <input
              id="wf-hco3"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bicarbonateText}
              onChange={(e) => set({ bicarbonateText: e.target.value })}
              aria-invalid={Boolean(errors.bicarbonateText)}
            />
            <select
              className={unitSelectClass}
              value={input.bicarbonateUnit}
              onChange={(e) =>
                set({ bicarbonateUnit: e.target.value as BicarbUnit })
              }
              aria-label="HCO₃ unit"
            >
              {BICARB_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.bicarbonateText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.bicarbonateText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wf-pco2">
            pCO₂
            <InfoTooltip text="Expected compensatory pCO₂ from Winters' formula — not a measured arterial pCO₂." />
          </label>
          <FieldShell muted>
            <input
              id="wf-pco2"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedExpected ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as PressureUnit })
              }
              aria-label="Expected pCO₂ unit"
            >
              {PRESSURE_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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

      <section className={sectionClass} aria-label="Range limits">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          aria-expanded={input.showRangeLimits}
          onClick={() => set({ showRangeLimits: !input.showRangeLimits })}
        >
          Range limits
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              input.showRangeLimits ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.showRangeLimits ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="wf-lower">
                Lower limit
              </label>
              <FieldShell muted>
                <input
                  id="wf-lower"
                  type="text"
                  readOnly
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedLower ?? ''}
                  aria-readonly="true"
                />
              </FieldShell>
            </div>
            <div>
              <label className={labelClass} htmlFor="wf-upper">
                Upper limit
              </label>
              <FieldShell muted>
                <input
                  id="wf-upper"
                  type="text"
                  readOnly
                  className={`${inputClass} text-muted-foreground`}
                  value={result?.formattedUpper ?? ''}
                  aria-readonly="true"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </section>
    </form>
  );
}
