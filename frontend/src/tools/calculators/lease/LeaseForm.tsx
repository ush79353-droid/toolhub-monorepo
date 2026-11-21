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
  LeaseFieldErrors,
  LeaseInput,
  LeaseResult,
  ResidualMode,
  TermUnit,
} from './types';

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

function syncResidualFromPercent(
  productValue: string,
  percentRaw: string
): string {
  const product = parseMoneyInput(productValue);
  const percent = Number(percentRaw.trim().replace(/,/g, ''));
  if (!Number.isFinite(product) || product < 0) return '';
  if (!Number.isFinite(percent) || percent < 0) return '';
  return moneyAmountToInputString((product * percent) / 100);
}

function syncResidualPercentFromAmount(
  productValue: string,
  amountRaw: string,
  amountCurrency: SupportedCurrency,
  productCurrency: SupportedCurrency,
  rates: ReturnType<typeof useCurrencyRates>
): string {
  const product = parseMoneyInput(productValue);
  const amount = parseMoneyInput(amountRaw);
  if (!Number.isFinite(product) || !(product > 0)) return '';
  if (!Number.isFinite(amount) || amount < 0) return '';

  let residualInProduct = amount;
  if (amountCurrency !== productCurrency) {
    if (!rates.available) return '';
    const converted = convertCurrency({
      amount,
      from: amountCurrency,
      to: productCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) return '';
    residualInProduct = converted.amount;
  }
  const percent = (residualInProduct / product) * 100;
  if (!Number.isFinite(percent)) return '';
  return moneyAmountToInputString(percent);
}

interface LeaseFormProps {
  input: LeaseInput;
  errors: LeaseFieldErrors;
  result: LeaseResult | null;
  onChange: (input: LeaseInput) => void;
}

export function LeaseForm({ input, errors, result, onChange }: LeaseFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const productSymbol = getCurrencySymbol(input.productCurrency);
  const residualSymbol = getCurrencySymbol(input.residualCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);
  const monthlySymbol = getCurrencySymbol(input.monthlyPaymentCurrency);
  const totalPaySymbol = getCurrencySymbol(input.totalPaymentsCurrency);
  const interestSymbol = getCurrencySymbol(input.totalInterestCurrency);
  const costSymbol = getCurrencySymbol(input.totalCostCurrency);

  const set = (patch: Partial<LeaseInput>) => {
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

  const convertAmountString = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; value: string } | { ok: false } => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, value: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, value: moneyAmountToInputString(converted.amount) };
  };

  const handleProductCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.productCurrency) return;
    const converted = convertAmountString(
      input.productValue,
      input.productCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextInput: LeaseInput = {
      ...input,
      productCurrency: next,
      productValue: converted.value,
    };
    if (input.residualMode === 'percent' && input.residualPercent.trim() !== '') {
      nextInput.residualAmount = syncResidualFromPercent(
        nextInput.productValue,
        input.residualPercent
      );
      nextInput.residualCurrency = next;
    }
    setConversionError(null);
    onChange(nextInput);
  };

  const handleResidualCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.residualCurrency) return;
    const converted = convertAmountString(
      input.residualAmount,
      input.residualCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const nextInput: LeaseInput = {
      ...input,
      residualCurrency: next,
      residualAmount: converted.value,
      residualMode: 'amount',
    };
    nextInput.residualPercent = syncResidualPercentFromAmount(
      nextInput.productValue,
      nextInput.residualAmount,
      next,
      nextInput.productCurrency,
      rates
    );
    setConversionError(null);
    onChange(nextInput);
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;
    const converted = convertAmountString(
      input.downPayment,
      input.downPaymentCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      downPaymentCurrency: next,
      downPayment: converted.value,
    });
  };

  const handleResultCurrencyChange = (
    key:
      | 'monthlyPaymentCurrency'
      | 'totalPaymentsCurrency'
      | 'totalInterestCurrency'
      | 'totalCostCurrency',
    next: SupportedCurrency
  ) => {
    if (input[key] === next) return;
    if (!canConvertPair(input.productCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  const handleProductValueChange = (raw: string) => {
    const next: LeaseInput = { ...input, productValue: raw };
    if (input.residualMode === 'percent' && input.residualPercent.trim() !== '') {
      next.residualAmount = syncResidualFromPercent(raw, input.residualPercent);
      next.residualCurrency = input.productCurrency;
    } else if (input.residualAmount.trim() !== '') {
      next.residualPercent = syncResidualPercentFromAmount(
        raw,
        input.residualAmount,
        input.residualCurrency,
        input.productCurrency,
        rates
      );
    }
    setConversionError(null);
    onChange(next);
  };

  const handleResidualAmountChange = (raw: string) => {
    const percent = syncResidualPercentFromAmount(
      input.productValue,
      raw,
      input.residualCurrency,
      input.productCurrency,
      rates
    );
    set({
      residualAmount: raw,
      residualMode: 'amount' as ResidualMode,
      residualPercent: percent,
    });
  };

  const handleResidualPercentChange = (raw: string) => {
    set({
      residualPercent: raw,
      residualMode: 'percent' as ResidualMode,
      residualAmount: syncResidualFromPercent(input.productValue, raw),
      residualCurrency: input.productCurrency,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        This lease calculator helps you estimate the monthly payments, total interest and total
        costs of any lease. Optionally, you can include down payments to reduce the total cost of
        owning the assets and lower the monthly instalments.
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Basic information
        </legend>

        <div>
          <label className={labelClass} htmlFor="lease-product-value">
            <span>Product value</span>
            <InfoTooltip
              label="Product value"
              text="Asset or product price being leased. Changing this currency converts the amount and becomes the calculation currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.productValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {productSymbol}
              </span>
              <input
                id="lease-product-value"
                className={inputClass}
                inputMode="decimal"
                value={input.productValue}
                aria-invalid={Boolean(errors.productValue)}
                onChange={(e) => handleProductValueChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lease-product-currency"
                value={input.productCurrency}
                onChange={handleProductCurrencyChange}
                aria-label="Product value currency"
              />
            </div>
          </div>
          {errors.productValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.productValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-residual-amount">
            <span>Residual value</span>
            <InfoTooltip
              label="Residual value"
              text="Expected end-of-lease buyout. Enter money or percent of product value; the other field updates when product value is known."
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex gap-2">
              <FieldShell error={errors.residualAmount}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {residualSymbol}
                </span>
                <input
                  id="lease-residual-amount"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.residualAmount}
                  aria-invalid={Boolean(errors.residualAmount)}
                  onChange={(e) => handleResidualAmountChange(e.target.value)}
                />
              </FieldShell>
              <div className="w-[96px] shrink-0 sm:w-[110px]">
                <CurrencySelect
                  id="lease-residual-currency"
                  value={input.residualCurrency}
                  onChange={handleResidualCurrencyChange}
                  aria-label="Residual value currency"
                />
              </div>
            </div>
            <div>
              <FieldShell error={errors.residualPercent}>
                <input
                  id="lease-residual-percent"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.residualPercent}
                  aria-label="Residual value percent"
                  aria-invalid={Boolean(errors.residualPercent)}
                  onChange={(e) => handleResidualPercentChange(e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.residualAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.residualAmount}</p>
          ) : null}
          {errors.residualPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.residualPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-term">
            <span>Lease term</span>
            <InfoTooltip
              label="Lease term"
              text="Lease length. Converted to months for the payment formula (years × 12, or months as entered)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.leaseTerm}>
              <input
                id="lease-term"
                className={inputClass}
                inputMode="decimal"
                placeholder="yrs"
                value={input.leaseTerm}
                aria-invalid={Boolean(errors.leaseTerm)}
                onChange={(e) => set({ leaseTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="lease-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Lease term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.leaseTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.leaseTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual lease rate with monthly compounding in the payment formula. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.annualInterestRatePercent}>
            <input
              id="lease-rate"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.annualInterestRatePercent}
              aria-invalid={Boolean(errors.annualInterestRatePercent)}
              onChange={(e) => set({ annualInterestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %/yr
            </span>
          </FieldShell>
          {errors.annualInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              checked={input.includeDownPayment}
              onChange={(e) => set({ includeDownPayment: e.target.checked })}
            />
            <span>Include down payment</span>
          </label>
          {input.includeDownPayment ? (
            <div>
              <label className={labelClass} htmlFor="lease-down-payment">
                <span>Down payment</span>
                <InfoTooltip
                  label="Down payment"
                  text="Upfront payment that reduces financed amount. Converted into product currency before calculation."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.downPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {downSymbol}
                  </span>
                  <input
                    id="lease-down-payment"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.downPayment}
                    aria-invalid={Boolean(errors.downPayment)}
                    onChange={(e) => set({ downPayment: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="lease-down-currency"
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
          ) : null}
        </div>

        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="lease-monthly-payment">
            <span>Monthly payment</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {monthlySymbol}
              </span>
              <input
                id="lease-monthly-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lease-monthly-currency"
                value={input.monthlyPaymentCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('monthlyPaymentCurrency', next)
                }
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-total-payments">
            <span>Total payments</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalPaySymbol}
              </span>
              <input
                id="lease-total-payments"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPayments : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lease-total-payments-currency"
                value={input.totalPaymentsCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('totalPaymentsCurrency', next)
                }
                aria-label="Total payments currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-total-interest">
            <span>Total interest</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {interestSymbol}
              </span>
              <input
                id="lease-total-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lease-total-interest-currency"
                value={input.totalInterestCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('totalInterestCurrency', next)
                }
                aria-label="Total interest currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="lease-total-cost">
            <span>Total cost to own</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {costSymbol}
              </span>
              <input
                id="lease-total-cost"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalCostToOwn : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="lease-total-cost-currency"
                value={input.totalCostCurrency}
                onChange={(next) => handleResultCurrencyChange('totalCostCurrency', next)}
                aria-label="Total cost to own currency"
              />
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
