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
import { TAXES_INSURANCE_FEES_UNAVAILABLE_REASON } from './calculation';
import type {
  SimpleMortgageFieldErrors,
  SimpleMortgageInput,
  SimpleMortgageResult,
  TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface SimpleMortgageFormProps {
  input: SimpleMortgageInput;
  errors: SimpleMortgageFieldErrors;
  result: SimpleMortgageResult | null;
  onChange: (input: SimpleMortgageInput) => void;
}

export function SimpleMortgageForm({
  input,
  errors,
  result,
  onChange,
}: SimpleMortgageFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(input.monthlyPaymentCurrency);

  const set = (patch: Partial<SimpleMortgageInput>) => {
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

    const amount = parseMoneyInput(input.loanAmount);
    if (!Number.isFinite(amount)) {
      if (
        input.monthlyPaymentCurrency !== next &&
        !canConvertPair(next, input.monthlyPaymentCurrency)
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
      input.monthlyPaymentCurrency !== next &&
      !canConvertPair(next, input.monthlyPaymentCurrency)
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
      loanAmount: moneyAmountToInputString(converted.amount),
    });
  };

  const handlePaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.monthlyPaymentCurrency) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, monthlyPaymentCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="sm-amount">
          <span>Loan amount</span>
          <InfoTooltip
            label="Loan amount"
            text="Mortgage principal. Changing this currency converts the amount; monthly payment uses its own currency."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.loanAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {loanSymbol}
            </span>
            <input
              id="sm-amount"
              className={inputClass}
              inputMode="decimal"
              value={input.loanAmount}
              aria-invalid={Boolean(errors.loanAmount)}
              onChange={(e) => set({ loanAmount: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sm-amount-currency"
              value={input.loanCurrency}
              onChange={handleLoanCurrencyChange}
              aria-label="Loan amount currency"
            />
          </div>
        </div>
        {errors.loanAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="sm-rate">
          <span>Yearly interest rate</span>
        </label>
        <FieldShell error={errors.annualInterestRatePercent}>
          <input
            id="sm-rate"
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
        <label className={labelClass} htmlFor="sm-term">
          <span>Loan term</span>
          <InfoTooltip
            label="Loan term"
            text="Mortgage length in years or months. Rate and term are never converted with currency."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.loanTerm}>
            <input
              id="sm-term"
              className={inputClass}
              inputMode="decimal"
              value={input.loanTerm}
              aria-invalid={Boolean(errors.loanTerm)}
              onChange={(e) => set({ loanTerm: e.target.value })}
            />
          </FieldShell>
          <select
            className={unitSelectClass}
            value={input.termUnit}
            aria-label="Loan term unit"
            onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
          >
            <option value="yrs">yrs</option>
            <option value="mos">mos</option>
          </select>
        </div>
        {errors.loanTerm ? (
          <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="sm-payment">
          <span>Monthly payment</span>
          <InfoTooltip
            label="Monthly payment"
            text="Fixed-rate amortizing payment. Changing this currency only re-expresses the result."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {paymentSymbol}
            </span>
            <input
              id="sm-payment"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedMonthlyPayment : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sm-payment-currency"
              value={input.monthlyPaymentCurrency}
              onChange={handlePaymentCurrencyChange}
              aria-label="Monthly payment currency"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          id="sm-fees"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border"
          checked={input.includeTaxesInsuranceFees}
          onChange={(e) => set({ includeTaxesInsuranceFees: e.target.checked })}
        />
        <label htmlFor="sm-fees" className="text-[13px] font-medium text-accent">
          <span className="inline-flex items-center gap-1.5">
            Include taxes, insurance, and fees?
            <InfoTooltip
              label="Include taxes, insurance, and fees?"
              text={TAXES_INSURANCE_FEES_UNAVAILABLE_REASON}
            />
          </span>
        </label>
      </div>
      {input.includeTaxesInsuranceFees ? (
        <p className="text-xs text-amber-800">{TAXES_INSURANCE_FEES_UNAVAILABLE_REASON}</p>
      ) : null}

      {conversionError || ratesStatus.warning ? (
        <p className="text-xs text-amber-800">
          {conversionError ?? ratesStatus.warning}
        </p>
      ) : null}

      {errors.form && !input.includeTaxesInsuranceFees ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
