'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
  BalloonAfterUnit,
  BalloonCompoundingMethod,
  BalloonPaymentFieldErrors,
  BalloonPaymentInput,
  BalloonPaymentResult,
} from './types';
import { COMPOUNDING_METHOD_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'shrink-0 border-l border-border px-2.5 text-xs font-medium text-muted-foreground';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface BalloonPaymentFormProps {
  input: BalloonPaymentInput;
  errors: BalloonPaymentFieldErrors;
  result: BalloonPaymentResult | null;
  onChange: (input: BalloonPaymentInput) => void;
}

export function BalloonPaymentForm({
  input,
  errors,
  result,
  onChange,
}: BalloonPaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const loanSymbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<BalloonPaymentInput>) => {
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

  /** Convert loan amount; leave rate and durations alone. */
  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, currency: next });
      return;
    }

    if (!canConvertPair(input.currency, next)) {
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

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Loan specifications
        </legend>

        <div>
          <label className={labelClass} htmlFor="bp-loan-amount">
            <span>Loan amount</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="bp-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bp-loan-currency"
                value={input.currency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan amount currency"
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
          <label className={labelClass} htmlFor="bp-amort-years">
            <span>Amortization period</span>
            <InfoTooltip
              label="Amortization period"
              text="Full loan term used to size the regular payment. Balloon timing cannot exceed this length."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.amortYears}>
              <input
                id="bp-amort-years"
                className={inputClass}
                inputMode="numeric"
                value={input.amortYears}
                aria-invalid={Boolean(errors.amortYears)}
                aria-label="Amortization years"
                onChange={(e) => set({ amortYears: e.target.value })}
              />
              <span className={unitBadgeClass}>yrs</span>
            </FieldShell>
            <FieldShell error={errors.amortMonths}>
              <input
                id="bp-amort-months"
                className={inputClass}
                inputMode="numeric"
                value={input.amortMonths}
                aria-invalid={Boolean(errors.amortMonths)}
                aria-label="Amortization months"
                onChange={(e) => set({ amortMonths: e.target.value })}
              />
              <span className={unitBadgeClass}>mos</span>
            </FieldShell>
          </div>
          {errors.amortYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amortYears}</p>
          ) : null}
          {errors.amortMonths ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amortMonths}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-balloon-after">
            <span>Balloon payment after</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.balloonAfter}>
              <input
                id="bp-balloon-after"
                className={inputClass}
                inputMode="decimal"
                value={input.balloonAfter}
                aria-invalid={Boolean(errors.balloonAfter)}
                onChange={(e) => set({ balloonAfter: e.target.value })}
              />
            </FieldShell>
            <div className="w-[88px] shrink-0 sm:w-[96px]">
              <select
                id="bp-balloon-unit"
                className={selectClass}
                value={input.balloonAfterUnit}
                aria-label="Balloon payment after unit"
                onChange={(e) =>
                  set({ balloonAfterUnit: e.target.value as BalloonAfterUnit })
                }
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.balloonAfter ? (
            <p className="mt-1 text-xs text-rose-600">{errors.balloonAfter}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-interest-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="bp-interest-rate"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className={unitBadgeClass}>%</span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bp-compounding">
            <span>Compounding method</span>
            <InfoTooltip
              label="Compounding method"
              text="Derives the effective monthly rate from the nominal annual rate. Payments stay monthly."
            />
          </label>
          <select
            id="bp-compounding"
            className={selectClass}
            value={input.compoundingMethod}
            onChange={(e) =>
              set({
                compoundingMethod: e.target.value as BalloonCompoundingMethod,
              })
            }
          >
            {COMPOUNDING_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <div className="space-y-3 text-sm leading-relaxed text-accent" aria-live="polite">
            <p>
              Your fixed <strong>monthly payment</strong> is{' '}
              <strong>
                {result.currency} {result.formattedMonthlyPayment}
              </strong>{' '}
              in the first <strong>{result.balloonAfterMonths} months</strong>, and then
              your <strong>last balloon payment</strong> will be{' '}
              <strong>
                {result.currency} {result.formattedBalloonPayment}
              </strong>
              .
            </p>
            <p>
              Thus, your <strong>total repayment amount</strong> is{' '}
              <strong>
                {result.currency} {result.formattedTotalRepayment}
              </strong>
              , from which the total monthly payment is{' '}
              <strong>
                {result.currency} {result.formattedTotalMonthlyPayments}
              </strong>
              , including a total <strong>interest payment</strong> of{' '}
              <strong>
                {result.currency} {result.formattedTotalInterest}
              </strong>
              .
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid loan specifications to see the payment summary.
          </p>
        )}
      </fieldset>
    </form>
  );
}
