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
import type { LtvDriver, LtvFieldErrors, LtvInput } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface LtvFormProps {
  input: LtvInput;
  errors: LtvFieldErrors;
  onChange: (input: LtvInput) => void;
  onReset: () => void;
}

export function LtvForm({ input, errors, onChange, onReset }: LtvFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const purchaseSymbol = getCurrencySymbol(input.purchaseCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);
  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);

  const set = (patch: Partial<LtvInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const editDependent = (driver: LtvDriver, patch: Partial<LtvInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch, driver });
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
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
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

  const handlePurchaseCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.purchaseCurrency) return;
    for (const other of [input.downPaymentCurrency, input.loanAmountCurrency]) {
      if (other !== next && !canConvertPair(next, other)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    const nextPrice = convertFieldAmount(
      input.purchasePrice,
      input.purchaseCurrency,
      next
    );
    if (nextPrice === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      purchaseCurrency: next,
      purchasePrice: nextPrice,
    });
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;
    if (
      input.purchaseCurrency !== next &&
      !canConvertPair(input.purchaseCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextDown = convertFieldAmount(
      input.downPayment,
      input.downPaymentCurrency,
      next
    );
    if (nextDown === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      downPaymentCurrency: next,
      downPayment: nextDown,
    });
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanAmountCurrency) return;
    if (
      input.purchaseCurrency !== next &&
      !canConvertPair(input.purchaseCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextLoan = convertFieldAmount(
      input.loanAmount,
      input.loanAmountCurrency,
      next
    );
    if (nextLoan === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      loanAmountCurrency: next,
      loanAmount: nextLoan,
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
          LTV Calculator (Loan to Value)
        </legend>

        <div>
          <label className={labelClass} htmlFor="ltv-purchase">
            <span>Purchase price</span>
            <InfoTooltip
              label="Purchase price"
              text="Property or purchase value. Canonical calculation currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.purchasePrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {purchaseSymbol}
              </span>
              <input
                id="ltv-purchase"
                className={inputClass}
                inputMode="decimal"
                value={input.purchasePrice}
                aria-invalid={Boolean(errors.purchasePrice)}
                onChange={(e) => set({ purchasePrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ltv-purchase-currency"
                value={input.purchaseCurrency}
                onChange={handlePurchaseCurrencyChange}
                aria-label="Purchase price currency"
              />
            </div>
          </div>
          {errors.purchasePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
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
          <label className={labelClass} htmlFor="ltv-down">
            <span>Down payment</span>
            <InfoTooltip
              label="Down payment"
              text="Amount paid upfront. Editing this recalculates loan amount and LTV."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {downSymbol}
              </span>
              <input
                id="ltv-down"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) =>
                  editDependent('downPayment', { downPayment: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ltv-down-currency"
                value={input.downPaymentCurrency}
                onChange={handleDownCurrencyChange}
                aria-label="Down payment currency"
              />
            </div>
          </div>
          {errors.downPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ltv-loan">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Financed amount. Editing this recalculates down payment and LTV."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {loanSymbol}
              </span>
              <input
                id="ltv-loan"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) =>
                  editDependent('loanAmount', { loanAmount: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ltv-loan-currency"
                value={input.loanAmountCurrency}
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
          <label className={labelClass} htmlFor="ltv-ratio">
            <span>LTV (loan to value)</span>
            <InfoTooltip
              label="LTV (loan to value)"
              text="Loan ÷ purchase price × 100. Editing this recalculates loan amount and down payment. Never FX-converted."
            />
          </label>
          <FieldShell error={errors.ltvPercent}>
            <input
              id="ltv-ratio"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.ltvPercent}
              aria-invalid={Boolean(errors.ltvPercent)}
              onChange={(e) =>
                editDependent('ltv', { ltvPercent: e.target.value })
              }
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.ltvPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ltvPercent}</p>
          ) : null}
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
