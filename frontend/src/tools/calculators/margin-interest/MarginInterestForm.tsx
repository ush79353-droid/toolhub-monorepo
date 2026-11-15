'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MARGIN_INTEREST_DAY_BASIS } from './calculation';
import type {
  MarginInterestFieldErrors,
  MarginInterestInput,
  MarginInterestResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface MarginInterestFormProps {
  input: MarginInterestInput;
  errors: MarginInterestFieldErrors;
  result: MarginInterestResult | null;
  onChange: (input: MarginInterestInput) => void;
  onReset: () => void;
}

export function MarginInterestForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MarginInterestFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MarginInterestInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Margin Interest Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="mi-amount">
            <span>Amount borrowed</span>
            <InfoTooltip
              label="Amount borrowed"
              text="Debit balance or cash borrowed on margin for the period."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.amountBorrowed}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="mi-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.amountBorrowed}
                aria-invalid={Boolean(errors.amountBorrowed)}
                onChange={(e) => set({ amountBorrowed: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mi-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Currency"
              />
            </div>
          </div>
          {errors.amountBorrowed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amountBorrowed}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Annual margin interest rate as a percent (not compounded in this tool)."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="mi-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-days">
            <span>Number of days</span>
            <InfoTooltip
              label="Number of days"
              text={`Days the margin loan is outstanding. Interest uses a ${MARGIN_INTEREST_DAY_BASIS}-day year.`}
            />
          </label>
          <FieldShell error={errors.numberOfDays}>
            <input
              id="mi-days"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.numberOfDays}
              aria-invalid={Boolean(errors.numberOfDays)}
              onChange={(e) => set({ numberOfDays: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              days
            </span>
          </FieldShell>
          {errors.numberOfDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.numberOfDays}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-result">
            <span>Margin interest</span>
            <InfoTooltip
              label="Margin interest"
              text={`Simple interest = amount × rate/100 × days/${MARGIN_INTEREST_DAY_BASIS}.`}
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="mi-result"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedMarginInterest : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
