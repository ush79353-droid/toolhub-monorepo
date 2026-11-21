'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CrossExchangeRateFieldErrors,
  CrossExchangeRateInput,
  CrossExchangeRateResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface CrossExchangeRateFormProps {
  input: CrossExchangeRateInput;
  errors: CrossExchangeRateFieldErrors;
  result: CrossExchangeRateResult | null;
  onChange: (input: CrossExchangeRateInput) => void;
  onLoadExample: () => void;
}

export function CrossExchangeRateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: CrossExchangeRateFormProps) {
  const set = (patch: Partial<CrossExchangeRateInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (A/C 1.10 · B/C 1.25 → A/B 0.88)
        </button>
      </p>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          First currency pair
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="cx-ac">
              <span>Exchange rate A/C</span>
              <InfoTooltip
                label="Exchange rate A/C"
                text="Units of currency C per one unit of currency A. Enter either A/C or C/A — not conflicting values for both."
              />
            </label>
            <FieldShell error={errors.rateAC}>
              <input
                id="cx-ac"
                className={inputClass}
                inputMode="decimal"
                value={input.rateAC}
                aria-invalid={Boolean(errors.rateAC)}
                onChange={(e) => set({ rateAC: e.target.value })}
              />
            </FieldShell>
            {errors.rateAC ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateAC}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cx-ca">
              <span>or exchange rate C/A</span>
              <InfoTooltip
                label="Exchange rate C/A"
                text="Units of currency A per one unit of currency C (the reciprocal of A/C)."
              />
            </label>
            <FieldShell error={errors.rateCA}>
              <input
                id="cx-ca"
                className={inputClass}
                inputMode="decimal"
                value={input.rateCA}
                aria-invalid={Boolean(errors.rateCA)}
                onChange={(e) => set({ rateCA: e.target.value })}
              />
            </FieldShell>
            {errors.rateCA ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateCA}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Second currency pair
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="cx-bc">
              <span>Exchange rate B/C</span>
              <InfoTooltip
                label="Exchange rate B/C"
                text="Units of currency C per one unit of currency B. Enter either B/C or C/B."
              />
            </label>
            <FieldShell error={errors.rateBC}>
              <input
                id="cx-bc"
                className={inputClass}
                inputMode="decimal"
                value={input.rateBC}
                aria-invalid={Boolean(errors.rateBC)}
                onChange={(e) => set({ rateBC: e.target.value })}
              />
            </FieldShell>
            {errors.rateBC ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateBC}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cx-cb">
              <span>or exchange rate C/B</span>
              <InfoTooltip
                label="Exchange rate C/B"
                text="Units of currency B per one unit of currency C (the reciprocal of B/C)."
              />
            </label>
            <FieldShell error={errors.rateCB}>
              <input
                id="cx-cb"
                className={inputClass}
                inputMode="decimal"
                value={input.rateCB}
                aria-invalid={Boolean(errors.rateCB)}
                onChange={(e) => set({ rateCB: e.target.value })}
              />
            </FieldShell>
            {errors.rateCB ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateCB}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Cross rate
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label className={labelClass} htmlFor="cx-ab">
              <span>Cross rate A/B</span>
              <InfoTooltip
                label="Cross rate A/B"
                text="Computed as (A/C) ÷ (B/C). Units of B per one unit of A."
              />
            </label>
            <FieldShell muted>
              <input
                id="cx-ab"
                className={inputClass}
                readOnly
                tabIndex={0}
                value={result?.formattedAB ?? ''}
                aria-label="Cross rate A/B result"
              />
            </FieldShell>
          </div>
          <div>
            <label className={labelClass} htmlFor="cx-ba">
              <span>or cross rate B/A</span>
              <InfoTooltip
                label="Cross rate B/A"
                text="Reciprocal of A/B: units of A per one unit of B."
              />
            </label>
            <FieldShell muted>
              <input
                id="cx-ba"
                className={inputClass}
                readOnly
                tabIndex={0}
                value={result?.formattedBA ?? ''}
                aria-label="Cross rate B/A result"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-950">
        Capital letters &apos;A&apos;, &apos;B&apos;, and &apos;C&apos; each
        represent different currencies. A currency pair can be expressed in two
        forms, but you only need to enter one for each pair.
      </p>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
