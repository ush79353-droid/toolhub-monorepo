'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { EpsGrowthFieldErrors, EpsGrowthInput } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface EpsGrowthFormProps {
  input: EpsGrowthInput;
  errors: EpsGrowthFieldErrors;
  onChange: (input: EpsGrowthInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EpsGrowthForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: EpsGrowthFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Compare initial and final EPS to get total percentage growth and the
        compound (annualized) growth rate over the number of periods.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="epsg-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for EPS growth amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 EPS amounts share one currency label (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the EPS growth calculator
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Earnings per share growth
        </legend>

        <div>
          <label htmlFor="epsg-initial" className={labelClass}>
            Initial EPS
            <InfoTooltip
              label="Initial EPS"
              text="The earnings per share at the beginning of the comparison period."
            />
          </label>
          <FieldShell error={errors.initialEps}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="epsg-initial"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialEps}
              onChange={(e) =>
                onChange({ ...input, initialEps: e.target.value })
              }
              placeholder="2.50"
              aria-invalid={Boolean(errors.initialEps)}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
              /share
            </span>
          </FieldShell>
          {errors.initialEps ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialEps}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="epsg-final" className={labelClass}>
            Final EPS
            <InfoTooltip
              label="Final EPS"
              text="The earnings per share at the end of the comparison period."
            />
          </label>
          <FieldShell error={errors.finalEps}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="epsg-final"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.finalEps}
              onChange={(e) =>
                onChange({ ...input, finalEps: e.target.value })
              }
              placeholder="4.00"
              aria-invalid={Boolean(errors.finalEps)}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
              /share
            </span>
          </FieldShell>
          {errors.finalEps ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalEps}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="epsg-periods" className={labelClass}>
            Number of periods
            <InfoTooltip
              label="Number of periods"
              text="Enter the number of years or equal-length periods between the initial and final EPS values."
            />
          </label>
          <FieldShell error={errors.numberOfPeriods}>
            <input
              id="epsg-periods"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.numberOfPeriods}
              onChange={(e) =>
                onChange({ ...input, numberOfPeriods: e.target.value })
              }
              placeholder="3"
              aria-invalid={Boolean(errors.numberOfPeriods)}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
              Years
            </span>
          </FieldShell>
          {errors.numberOfPeriods ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.numberOfPeriods}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Use elapsed intervals (e.g. 2021→2025 is 4 years), not the count
              of annual observations.
            </p>
          )}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
