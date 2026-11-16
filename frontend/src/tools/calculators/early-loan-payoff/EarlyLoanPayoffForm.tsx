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
  CompoundingFrequency,
  EarlyLoanPayoffFieldErrors,
  EarlyLoanPayoffInput,
  EarlyLoanPayoffResult,
} from './types';
import { COMPOUNDING_FREQUENCY_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface EarlyLoanPayoffFormProps {
  input: EarlyLoanPayoffInput;
  errors: EarlyLoanPayoffFieldErrors;
  result: EarlyLoanPayoffResult | null;
  onChange: (input: EarlyLoanPayoffInput) => void;
  onReset: () => void;
}

export function EarlyLoanPayoffForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: EarlyLoanPayoffFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const extraSymbol = getCurrencySymbol(input.extraPaymentCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const set = (patch: Partial<EarlyLoanPayoffInput>) => {
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
    if (next === input.loanCurrency) return;
    const amount = parseMoneyInput(input.loanBalance);
    if (!Number.isFinite(amount)) {
      if (
        input.extraPaymentCurrency !== next &&
        !canConvertPair(next, input.extraPaymentCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, loanCurrency: next });
      return;
    }
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.extraPaymentCurrency !== next &&
      !canConvertPair(next, input.extraPaymentCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.loanCurrency,
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
      loanCurrency: next,
      loanBalance: moneyAmountToInputString(converted.amount),
    });
  };

  const handleExtraCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.extraPaymentCurrency) return;
    const amount = parseMoneyInput(input.extraMonthlyPayment);
    if (!Number.isFinite(amount)) {
      if (input.loanCurrency !== next && !canConvertPair(input.loanCurrency, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, extraPaymentCurrency: next });
      return;
    }
    if (!canConvertPair(input.extraPaymentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.loanCurrency !== next && !canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.extraPaymentCurrency,
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
      extraPaymentCurrency: next,
      extraMonthlyPayment: moneyAmountToInputString(converted.amount),
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan specifications</legend>

        <div>
          <label className={labelClass} htmlFor="elp-balance">
            <span>Loan balance</span>
            <InfoTooltip label="Loan balance" text="Outstanding principal. Changing currency converts this amount." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {loanSymbol}
              </span>
              <input
                id="elp-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.loanBalance}
                aria-invalid={Boolean(errors.loanBalance)}
                onChange={(e) => set({ loanBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="elp-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan balance currency"
              />
            </div>
          </div>
          {errors.loanBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanBalance}</p>
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

        <label className="flex items-center gap-2 text-[13px] text-accent">
          <input
            type="checkbox"
            className="size-4 rounded border-border"
            checked={input.useDecreasingPayments}
            onChange={(e) => set({ useDecreasingPayments: e.target.checked })}
          />
          <span>Use decreasing monthly payments</span>
          <InfoTooltip
            label="Decreasing monthly payments"
            text="Equal principal each month plus interest on the remaining balance (declining payment). Unchecked uses a fixed level payment."
          />
        </label>

        <div>
          <span className={labelClass}>Loan term</span>
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <FieldShell error={errors.termYears}>
                <input
                  id="elp-years"
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
                  id="elp-months"
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
          <label className={labelClass} htmlFor="elp-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual rate. Effective monthly rate depends on compound frequency."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="elp-rate"
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
          <label className={labelClass} htmlFor="elp-compound">
            <span>Compound frequency</span>
          </label>
          <select
            id="elp-compound"
            className={selectClass}
            value={input.compoundingFrequency}
            onChange={(e) =>
              set({ compoundingFrequency: e.target.value as CompoundingFrequency })
            }
          >
            {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-accent">
          <input
            type="checkbox"
            className="size-4 rounded border-border"
            checked={input.balloonPayments}
            onChange={(e) => set({ balloonPayments: e.target.checked })}
          />
          <span>Balloon payments</span>
          <InfoTooltip
            label="Balloon payments"
            text="Shown in the reference UI. A residual balloon amount is not defined here, so results are blocked while this is checked."
          />
        </label>

        <div>
          <label className={labelClass} htmlFor="elp-extra">
            <span>Extra monthly payment</span>
            <InfoTooltip
              label="Extra monthly payment"
              text="Additional principal each month. Converted into the loan currency before amortization when currencies differ."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.extraMonthlyPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {extraSymbol}
              </span>
              <input
                id="elp-extra"
                className={inputClass}
                inputMode="decimal"
                value={input.extraMonthlyPayment}
                aria-invalid={Boolean(errors.extraMonthlyPayment)}
                onChange={(e) => set({ extraMonthlyPayment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="elp-extra-currency"
                value={input.extraPaymentCurrency}
                onChange={handleExtraCurrencyChange}
                aria-label="Extra monthly payment currency"
              />
            </div>
          </div>
          {errors.extraMonthlyPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.extraMonthlyPayment}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Early loan payoff</legend>
        <p className="text-xs font-medium text-muted-foreground">
          {result?.hasExtraPayments ? 'With extra payments' : 'No extra payments'}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Monthly repayment</p>
            <p className="text-sm font-semibold tabular-nums text-accent">
              {result
                ? `${resultSymbol}${result.formattedMonthlyRepayment}`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total repayment amount</p>
            <p className="text-sm font-semibold tabular-nums text-accent">
              {result ? `${resultSymbol}${result.formattedTotalRepayment}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Interest</p>
            <p className="text-sm font-semibold tabular-nums text-accent">
              {result ? `${resultSymbol}${result.formattedTotalInterest}` : '—'}
            </p>
          </div>
        </div>
        {result?.hasExtraPayments ? (
          <div className="grid gap-3 border-t border-border/70 pt-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Payoff in</p>
              <p className="text-sm font-semibold text-accent">
                {result.actualPayments} mo
                {result.timeSavedLabel ? ` (${result.timeSavedLabel} sooner)` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interest savings</p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {resultSymbol}
                {result.formattedInterestSavings}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Baseline monthly</p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {resultSymbol}
                {result.formattedBaselineMonthlyRepayment}
              </p>
            </div>
          </div>
        ) : null}
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
