'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
import type {
  TrueCostRealEstateCommissionFieldErrors,
  TrueCostRealEstateCommissionInput,
  TrueCostRealEstateCommissionResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

type DisplayCurrencyField =
  | 'loanAmountCurrency'
  | 'loanCommissionCurrency'
  | 'monthlyPaymentCurrency'
  | 'monthlyCommissionCurrency'
  | 'totalPaymentsCurrency'
  | 'apparentCommissionCurrency'
  | 'commissionAmountCurrency'
  | 'realCommissionCostCurrency';

interface TrueCostRealEstateCommissionFormProps {
  input: TrueCostRealEstateCommissionInput;
  errors: TrueCostRealEstateCommissionFieldErrors;
  result: TrueCostRealEstateCommissionResult | null;
  onChange: (input: TrueCostRealEstateCommissionInput) => void;
}

export function TrueCostRealEstateCommissionForm({
  input,
  errors,
  result,
  onChange,
}: TrueCostRealEstateCommissionFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<TrueCostRealEstateCommissionInput>) => {
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

  const displayCurrencyFields: DisplayCurrencyField[] = [
    'loanAmountCurrency',
    'loanCommissionCurrency',
    'monthlyPaymentCurrency',
    'monthlyCommissionCurrency',
    'totalPaymentsCurrency',
    'apparentCommissionCurrency',
    'commissionAmountCurrency',
    'realCommissionCostCurrency',
  ];

  const ensureDisplayReachable = (calcCurrency: SupportedCurrency) => {
    for (const field of displayCurrencyFields) {
      if (input[field] !== calcCurrency && !canConvertPair(calcCurrency, input[field])) {
        return false;
      }
    }
    return true;
  };

  const handlePropertyCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.propertyPriceCurrency) return;

    const amount = parseMoneyInput(input.propertyPrice);
    const hasAmount = Number.isFinite(amount);

    if (!hasAmount) {
      if (
        (input.downPaymentCurrency !== next &&
          !canConvertPair(input.downPaymentCurrency, next)) ||
        !ensureDisplayReachable(next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, propertyPriceCurrency: next });
      return;
    }

    if (!canConvertPair(input.propertyPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.downPaymentCurrency !== next &&
        !canConvertPair(input.downPaymentCurrency, next)) ||
      !ensureDisplayReachable(next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.propertyPriceCurrency,
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
      propertyPriceCurrency: next,
      propertyPrice: moneyAmountToInputString(converted.amount),
    });
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;

    const amount = parseMoneyInput(input.downPayment);
    const hasAmount = Number.isFinite(amount);

    if (!hasAmount) {
      if (
        next !== input.propertyPriceCurrency &&
        !canConvertPair(next, input.propertyPriceCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, downPaymentCurrency: next });
      return;
    }

    if (!canConvertPair(input.downPaymentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      next !== input.propertyPriceCurrency &&
      !canConvertPair(next, input.propertyPriceCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.downPaymentCurrency,
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
      downPaymentCurrency: next,
      downPayment: moneyAmountToInputString(converted.amount),
    });
  };

  const handleDisplayCurrencyChange = (
    field: DisplayCurrencyField,
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.propertyPriceCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const moneyOutput = (
    id: string,
    label: string,
    tip: string,
    formatted: string | undefined,
    currency: SupportedCurrency,
    currencyField: DisplayCurrencyField,
    currencyAria: string
  ) => {
    const symbol = getCurrencySymbol(currency);
    return (
      <div>
        <label className={labelClass} htmlFor={id}>
          <span>{label}</span>
          <InfoTooltip label={label} text={tip} />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id={id}
              className={`${inputClass} font-semibold`}
              readOnly
              value={formatted ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id={`${id}-currency`}
              value={currency}
              onChange={(next) => handleDisplayCurrencyChange(currencyField, next)}
              aria-label={currencyAria}
            />
          </div>
        </div>
      </div>
    );
  };

  const propertySymbol = getCurrencySymbol(input.propertyPriceCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.propertySectionOpen}
        onToggle={(event) =>
          set({ propertySectionOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.propertySectionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Property purchase details</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="tcrc-property-price">
              <span>Property price</span>
              <InfoTooltip
                label="Property price"
                text="Sale price of the property. Changing currency converts this amount. Calculation currency for normalizing down payment and results."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.propertyPrice}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {propertySymbol}
                </span>
                <input
                  id="tcrc-property-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.propertyPrice}
                  aria-invalid={Boolean(errors.propertyPrice)}
                  onChange={(e) => set({ propertyPrice: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="tcrc-property-currency"
                  value={input.propertyPriceCurrency}
                  onChange={handlePropertyCurrencyChange}
                  aria-label="Property price currency"
                />
              </div>
            </div>
            {errors.propertyPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.propertyPrice}</p>
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
            <label className={labelClass} htmlFor="tcrc-down-payment">
              <span>Down payment</span>
              <InfoTooltip
                label="Down payment"
                text="Cash paid at purchase. Must be less than property price. Converted into property currency before calculating the loan."
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
                  id="tcrc-down-payment"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.downPayment}
                  aria-invalid={Boolean(errors.downPayment)}
                  onChange={(e) => set({ downPayment: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="tcrc-down-currency"
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
            <label className={labelClass} htmlFor="tcrc-seller-commission">
              <span>Seller’s commission</span>
              <InfoTooltip
                label="Seller’s commission"
                text="Listing-agent commission as a percent of property price. Default 6%. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.sellerCommissionPercent}>
              <input
                id="tcrc-seller-commission"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.sellerCommissionPercent}
                aria-invalid={Boolean(errors.sellerCommissionPercent)}
                onChange={(e) => set({ sellerCommissionPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.sellerCommissionPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.sellerCommissionPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tcrc-buyer-commission">
              <span>Buyer’s commission</span>
              <InfoTooltip
                label="Buyer’s commission"
                text="Buyer-agent commission as a percent of property price. Default 0%. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.buyerCommissionPercent}>
              <input
                id="tcrc-buyer-commission"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.buyerCommissionPercent}
                aria-invalid={Boolean(errors.buyerCommissionPercent)}
                onChange={(e) => set({ buyerCommissionPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.buyerCommissionPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.buyerCommissionPercent}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.mortgageSectionOpen}
        onToggle={(event) =>
          set({ mortgageSectionOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.mortgageSectionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Mortgage</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {moneyOutput(
            'tcrc-loan-amount',
            'Loan amount',
            'Property price minus down payment (after FX normalize).',
            result?.formattedLoanAmount,
            input.loanAmountCurrency,
            'loanAmountCurrency',
            'Loan amount currency'
          )}

          {moneyOutput(
            'tcrc-loan-commission',
            '…of which the commission is',
            'Commission amount × (loan amount ÷ property price): the financed share of commission.',
            result?.formattedLoanCommission,
            input.loanCommissionCurrency,
            'loanCommissionCurrency',
            'Loan commission currency'
          )}

          <div>
            <label className={labelClass} htmlFor="tcrc-term-years">
              <span>Term</span>
              <InfoTooltip
                label="Term"
                text="Mortgage term in years and months (0–11). Number of payments = years×12 + months. Not FX-converted."
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <FieldShell error={errors.termYears}>
                <input
                  id="tcrc-term-years"
                  className={`${inputClass} pr-10`}
                  inputMode="numeric"
                  value={input.termYears}
                  aria-invalid={Boolean(errors.termYears)}
                  onChange={(e) => set({ termYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              <div className="relative">
                <select
                  id="tcrc-term-months"
                  className={selectClass}
                  value={input.termMonths}
                  aria-invalid={Boolean(errors.termMonths)}
                  aria-label="Term months"
                  onChange={(e) => set({ termMonths: e.target.value })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i)}>
                      {i} mos
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.termYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
            ) : errors.termMonths ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="tcrc-interest-rate">
              <span>Interest rate</span>
              <InfoTooltip
                label="Interest rate"
                text="Nominal annual mortgage rate. Monthly rate = annual ÷ 12. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.interestRatePercent}>
              <input
                id="tcrc-interest-rate"
                className={`${inputClass} pr-12`}
                inputMode="decimal"
                value={input.interestRatePercent}
                aria-invalid={Boolean(errors.interestRatePercent)}
                onChange={(e) => set({ interestRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                %/yr
              </span>
            </FieldShell>
            {errors.interestRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
            ) : null}
          </div>

          {moneyOutput(
            'tcrc-monthly-payment',
            'Monthly payment',
            'Fixed-rate amortizing payment on the full loan amount.',
            result?.formattedMonthlyPayment,
            input.monthlyPaymentCurrency,
            'monthlyPaymentCurrency',
            'Monthly payment currency'
          )}

          {moneyOutput(
            'tcrc-monthly-commission',
            '…of which the commission is',
            'Amortizing payment calculated only on the financed commission principal.',
            result?.formattedMonthlyCommission,
            input.monthlyCommissionCurrency,
            'monthlyCommissionCurrency',
            'Monthly commission currency'
          )}

          {moneyOutput(
            'tcrc-total-payments',
            'Total payments',
            'Monthly payment × number of payments over the full term.',
            result?.formattedTotalPayments,
            input.totalPaymentsCurrency,
            'totalPaymentsCurrency',
            'Total payments currency'
          )}
        </div>
      </details>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Commission cost
        </legend>

        {moneyOutput(
          'tcrc-apparent-commission',
          'Apparent commission',
          'Property price × buyer’s commission %. The buyer-side fee alone; not the full embedded cost.',
          result?.formattedApparentCommission,
          input.apparentCommissionCurrency,
          'apparentCommissionCurrency',
          'Apparent commission currency'
        )}

        {moneyOutput(
          'tcrc-commission-amount',
          'Commission amount',
          'Property price × (seller’s % + buyer’s %). Cash commission embedded in the transaction.',
          result?.formattedCommissionAmount,
          input.commissionAmountCurrency,
          'commissionAmountCurrency',
          'Commission amount currency'
        )}

        {moneyOutput(
          'tcrc-real-commission-cost',
          'Real commission cost',
          'Non-financed commission plus all payments on the financed commission share (principal + interest).',
          result?.formattedRealCommissionCost,
          input.realCommissionCostCurrency,
          'realCommissionCostCurrency',
          'Real commission cost currency'
        )}
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
