'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
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
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  MORTGAGE_TYPE_OPTIONS,
  TERM_UNIT_OPTIONS,
  type CompoundingFrequency,
  type MortgageRateFieldErrors,
  type MortgageRateInput,
  type MortgageRateResult,
  type MortgageType,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface MortgageRateFormProps {
  input: MortgageRateInput;
  errors: MortgageRateFieldErrors;
  result: MortgageRateResult | null;
  onChange: (input: MortgageRateInput) => void;
  onReset: () => void;
}

export function MortgageRateForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MortgageRateFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const feeSymbol = getCurrencySymbol(input.upfrontFeeCurrency);
  const annualSymbol = getCurrencySymbol(input.annualFeeCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const interestSymbol = getCurrencySymbol(input.interestCurrency);
  const totalSymbol = getCurrencySymbol(input.totalCurrency);

  const set = (patch: Partial<MortgageRateInput>) => {
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

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    const nextAmount = convertFieldAmount(input.loanBalance, input.loanCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.upfrontFeeCurrency !== next &&
        !canConvertPair(input.upfrontFeeCurrency, next)) ||
      (input.annualFeeCurrency !== next &&
        !canConvertPair(input.annualFeeCurrency, next)) ||
      (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) ||
      (input.interestCurrency !== next &&
        !canConvertPair(next, input.interestCurrency)) ||
      (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, loanCurrency: next, loanBalance: nextAmount });
  };

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.upfrontFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.upfrontFee,
      input.upfrontFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, upfrontFeeCurrency: next, upfrontFee: nextAmount });
  };

  const handleAnnualCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.annualFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.annualFee,
      input.annualFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, annualFeeCurrency: next, annualFee: nextAmount });
  };

  const handleResultCurrencyChange = (
    field: 'paymentCurrency' | 'interestCurrency' | 'totalCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
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
          Main configuration
        </legend>

        <div>
          <label className={labelClass} htmlFor="mr-loan">
            <span>Loan balance</span>
            <InfoTooltip
              label="Loan balance"
              text="Outstanding mortgage principal used for payment and APR calculations."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="mr-loan"
                className={inputClass}
                inputMode="decimal"
                value={input.loanBalance}
                aria-invalid={Boolean(errors.loanBalance)}
                onChange={(e) => set({ loanBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-loan-currency"
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

        <div>
          <label className={labelClass} htmlFor="mr-term">
            <span>Mortgage term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageTerm}>
              <input
                id="mr-term"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageTerm}
                aria-invalid={Boolean(errors.mortgageTerm)}
                onChange={(e) => set({ mortgageTerm: e.target.value })}
              />
            </FieldShell>
            <div className="relative w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="mr-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Mortgage term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                {TERM_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
          {errors.mortgageTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-rate">
            <span>Mortgage rate</span>
          </label>
          <FieldShell error={errors.mortgageRatePercent}>
            <input
              id="mr-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.mortgageRatePercent}
              aria-invalid={Boolean(errors.mortgageRatePercent)}
              onChange={(e) => set({ mortgageRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.mortgageRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-compounding">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="How the lender compounds the annual rate into the monthly period rate used for payments."
            />
          </label>
          <div className="relative">
            <select
              id="mr-compounding"
              className={selectClass}
              value={input.compounding}
              onChange={(e) =>
                set({ compounding: e.target.value as CompoundingFrequency })
              }
            >
              {COMPOUNDING_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-type">
            <span>Mortgage type</span>
            <InfoTooltip
              label="Mortgage type"
              text="Fixed-rate only. Adjustable-rate formulas are not invented on this page."
            />
          </label>
          <div className="relative">
            <select
              id="mr-type"
              className={selectClass}
              value={input.mortgageType}
              onChange={(e) =>
                set({ mortgageType: e.target.value as MortgageType })
              }
            >
              {MORTGAGE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Mortgage fees
        </legend>

        <div>
          <label className={labelClass} htmlFor="mr-points">
            <span>Mortgage points</span>
            <InfoTooltip
              label="Mortgage points"
              text="Upfront cost as a percent of loan balance. Points cost = loan × points% / 100."
            />
          </label>
          <FieldShell error={errors.mortgagePointsPercent}>
            <input
              id="mr-points"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.mortgagePointsPercent}
              aria-invalid={Boolean(errors.mortgagePointsPercent)}
              onChange={(e) => set({ mortgagePointsPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.mortgagePointsPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgagePointsPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-upfront">
            <span>Up-front fee</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.upfrontFee}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {feeSymbol}
              </span>
              <input
                id="mr-upfront"
                className={inputClass}
                inputMode="decimal"
                value={input.upfrontFee}
                aria-invalid={Boolean(errors.upfrontFee)}
                onChange={(e) => set({ upfrontFee: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-upfront-currency"
                value={input.upfrontFeeCurrency}
                onChange={handleFeeCurrencyChange}
                aria-label="Up-front fee currency"
              />
            </div>
          </div>
          {errors.upfrontFee ? (
            <p className="mt-1 text-xs text-rose-600">{errors.upfrontFee}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-annual">
            <span>Annual fee</span>
            <InfoTooltip
              label="Annual fee"
              text="Yearly mortgage cost spread monthly into the payment and fee-adjusted APR."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualFee}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {annualSymbol}
              </span>
              <input
                id="mr-annual"
                className={inputClass}
                inputMode="decimal"
                value={input.annualFee}
                aria-invalid={Boolean(errors.annualFee)}
                onChange={(e) => set({ annualFee: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-annual-currency"
                value={input.annualFeeCurrency}
                onChange={handleAnnualCurrencyChange}
                aria-label="Annual fee currency"
              />
            </div>
          </div>
          {errors.annualFee ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualFee}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="mr-payment">
            <span>Monthly payment</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              <input
                id="mr-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-payment-currency"
                value={input.paymentCurrency}
                onChange={(next) => handleResultCurrencyChange('paymentCurrency', next)}
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-apr">
            <span>Adjusted mortgage rate (APR)</span>
            <InfoTooltip
              label="Adjusted mortgage rate (APR)"
              text="Fee-adjusted annual percentage rate from net loan proceeds versus monthly cash flows (points, up-front, and annual fees)."
            />
          </label>
          <FieldShell muted>
            <input
              id="mr-apr"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedApr : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-interest">
            <span>Paid interest</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {interestSymbol}
              </span>
              <input
                id="mr-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPaidInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-interest-currency"
                value={input.interestCurrency}
                onChange={(next) => handleResultCurrencyChange('interestCurrency', next)}
                aria-label="Paid interest currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mr-total">
            <span>Total payments</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalSymbol}
              </span>
              <input
                id="mr-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPayments : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mr-total-currency"
                value={input.totalCurrency}
                onChange={(next) => handleResultCurrencyChange('totalCurrency', next)}
                aria-label="Total payments currency"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

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
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
