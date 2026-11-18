'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CLOSING_COSTS_UNAVAILABLE_REASON } from './calculation';
import { HomeEquityLoanChart } from './HomeEquityLoanChart';
import type {
  HomeEquityLoanFieldErrors,
  HomeEquityLoanInput,
  HomeEquityLoanResult,
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

interface HomeEquityLoanFormProps {
  input: HomeEquityLoanInput;
  errors: HomeEquityLoanFieldErrors;
  result: HomeEquityLoanResult | null;
  onChange: (input: HomeEquityLoanInput) => void;
  onReset: () => void;
}

export function HomeEquityLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: HomeEquityLoanFormProps) {
  const set = (patch: Partial<HomeEquityLoanInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan details</legend>

        <div>
          <label className={labelClass} htmlFor="hel-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Home equity loan principal in US dollars. Results use fixed $ formatting (no FX selectors in the reference)."
            />
          </label>
          <FieldShell error={errors.loanAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="hel-amount"
              className={inputClass}
              inputMode="decimal"
              value={input.loanAmount}
              aria-invalid={Boolean(errors.loanAmount)}
              onChange={(e) => set({ loanAmount: e.target.value })}
            />
          </FieldShell>
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hel-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="hel-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualInterestRatePercent}
              aria-invalid={Boolean(errors.annualInterestRatePercent)}
              onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hel-term">
            <span>Loan term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="hel-term"
              className={`${inputClass} pr-14`}
              inputMode="numeric"
              value={input.loanTermYears}
              aria-invalid={Boolean(errors.loanTermYears)}
              onChange={(e) => set({ loanTermYears: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.loanTermYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            id="hel-closing"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.includeClosingCosts}
            onChange={(e) => set({ includeClosingCosts: e.target.checked })}
          />
          <label htmlFor="hel-closing" className="text-[13px] font-medium text-accent">
            <span className="inline-flex items-center gap-1.5">
              Include closing costs
              <InfoTooltip
                label="Include closing costs"
                text={CLOSING_COSTS_UNAVAILABLE_REASON}
              />
            </span>
          </label>
        </div>
        {input.includeClosingCosts ? (
          <p className="text-xs text-amber-800">{CLOSING_COSTS_UNAVAILABLE_REASON}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="hel-monthly">
            <span>Monthly pay</span>
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="hel-monthly"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedMonthlyPayment : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="hel-total">
            <span>
              {result
                ? `Total of ${result.paymentCount} loan payments`
                : 'Total of loan payments'}
            </span>
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="hel-total"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedTotalOfPayments : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="hel-interest">
            <span>Total interest</span>
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="hel-interest"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedTotalInterest : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result ? (
          <div className="pt-1">
            <HomeEquityLoanChart result={result} />
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Clear
        </Button>
      </div>
    </form>
  );
}
