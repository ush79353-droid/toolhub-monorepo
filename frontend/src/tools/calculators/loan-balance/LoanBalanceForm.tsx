'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LoanBalanceFieldErrors,
  LoanBalanceInput,
  LoanBalanceResult,
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

interface LoanBalanceFormProps {
  input: LoanBalanceInput;
  errors: LoanBalanceFieldErrors;
  result: LoanBalanceResult | null;
  onChange: (input: LoanBalanceInput) => void;
  onReset: () => void;
}

export function LoanBalanceForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: LoanBalanceFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.currency);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);

  const set = (patch: Partial<LoanBalanceInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, currency: next });
      return;
    }

    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.currency,
      to: next,
      rates: rates.rates,
    });

    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      currency: next,
      loanAmount: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.resultCurrency) return;

    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({ ...input, resultCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Loan Balance Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="lb-loan">
            <span>Loan</span>
            <InfoTooltip
              label="Loan"
              text="Original loan principal. Changing currency converts this amount using stored exchange rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="lb-loan"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lb-loan-currency"
                value={input.currency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan currency"
              />
            </div>
          </div>
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
          {conversionError ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {conversionError}
            </p>
          ) : null}
          {ratesStatus.warning && !conversionError ? (
            <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lb-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate for a standard monthly amortizing loan. Not currency-converted."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="lb-rate"
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
          <span className={labelClass}>Loan term</span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.termYears}>
                <input
                  id="lb-term-years"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.termYears}
                  aria-label="Loan term years"
                  aria-invalid={Boolean(errors.termYears)}
                  onChange={(e) => set({ termYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
            </div>
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.termMonths}>
                <input
                  id="lb-term-months"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.termMonths}
                  aria-label="Loan term months"
                  aria-invalid={Boolean(errors.termMonths)}
                  onChange={(e) => set({ termMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.termYears || errors.termMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.termYears || errors.termMonths}
            </p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            Period
            <InfoTooltip
              label="Period"
              text="Elapsed repayment time. Remaining balance is calculated after this many scheduled monthly payments."
            />
          </span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.periodYears}>
                <input
                  id="lb-period-years"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.periodYears}
                  aria-label="Period years"
                  aria-invalid={Boolean(errors.periodYears)}
                  onChange={(e) => set({ periodYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
            </div>
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.periodMonths}>
                <input
                  id="lb-period-months"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.periodMonths}
                  aria-label="Period months"
                  aria-invalid={Boolean(errors.periodMonths)}
                  onChange={(e) => set({ periodMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.periodYears || errors.periodMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.periodYears || errors.periodMonths}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lb-remaining">
            <span>Loan remaining</span>
            <InfoTooltip
              label="Loan remaining"
              text="Outstanding principal after the elapsed period. Changing this currency only re-expresses the calculated balance."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {resultSymbol}
              </span>
              <input
                id="lb-remaining"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanRemaining : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lb-remaining-currency"
                value={input.resultCurrency}
                onChange={handleResultCurrencyChange}
                aria-label="Loan remaining currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
