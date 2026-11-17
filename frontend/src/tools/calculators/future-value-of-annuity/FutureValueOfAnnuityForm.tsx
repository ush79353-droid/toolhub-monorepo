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
import {
  ANNUITY_KIND_OPTIONS,
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  TERM_UNIT_OPTIONS,
  type FutureValueOfAnnuityFieldErrors,
  type FutureValueOfAnnuityInput,
  type FutureValueOfAnnuityResult,
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

interface FutureValueOfAnnuityFormProps {
  input: FutureValueOfAnnuityInput;
  errors: FutureValueOfAnnuityFieldErrors;
  result: FutureValueOfAnnuityResult | null;
  onChange: (input: FutureValueOfAnnuityInput) => void;
}

export function FutureValueOfAnnuityForm({
  input,
  errors,
  result,
  onChange,
}: FutureValueOfAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);

  const set = (patch: Partial<FutureValueOfAnnuityInput>) => {
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

  const handlePaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.paymentCurrency) return;

    const amount = parseMoneyInput(input.paymentAmount);
    if (!Number.isFinite(amount)) {
      if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, paymentCurrency: next });
      return;
    }

    if (!canConvertPair(input.paymentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.paymentCurrency,
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
      paymentCurrency: next,
      paymentAmount: moneyAmountToInputString(converted.amount),
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.resultCurrency) return;
    if (!canConvertPair(input.paymentCurrency, next)) {
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
          Future Value of Annuity
        </legend>

        <div>
          <label className={labelClass} htmlFor="fva-payment">
            Payment amount
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.paymentAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {paymentSymbol}
              </span>
              <input
                id="fva-payment"
                className={inputClass}
                inputMode="decimal"
                value={input.paymentAmount}
                aria-invalid={Boolean(errors.paymentAmount)}
                onChange={(e) => set({ paymentAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fva-payment-ccy"
                value={input.paymentCurrency}
                onChange={handlePaymentCurrencyChange}
                aria-label="Payment amount currency"
              />
            </div>
          </div>
          {errors.paymentAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paymentAmount}</p>
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
          <label className={labelClass} htmlFor="fva-rate">
            Interest rate
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="fva-rate"
              className={`${inputClass} pr-10`}
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
          <label className={labelClass} htmlFor="fva-term">
            Annuity term
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.termLength}>
              <input
                id="fva-term"
                className={inputClass}
                inputMode="decimal"
                placeholder={input.termUnit === 'yrs' ? 'yrs' : 'mos'}
                value={input.termLength}
                aria-invalid={Boolean(errors.termLength)}
                onChange={(e) => set({ termLength: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="fva-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Annuity term unit"
                onChange={(e) =>
                  set({ termUnit: e.target.value as FutureValueOfAnnuityInput['termUnit'] })
                }
              >
                {TERM_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.termLength ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termLength}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fva-compounding">
            Compounding frequency
          </label>
          <select
            id="fva-compounding"
            className={selectClass}
            value={input.compoundingFrequency}
            onChange={(e) =>
              set({
                compoundingFrequency: e.target
                  .value as FutureValueOfAnnuityInput['compoundingFrequency'],
              })
            }
          >
            {COMPOUNDING_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="fva-payment-freq">
            Payment frequency
          </label>
          <select
            id="fva-payment-freq"
            className={selectClass}
            value={input.paymentFrequency}
            onChange={(e) =>
              set({
                paymentFrequency: e.target
                  .value as FutureValueOfAnnuityInput['paymentFrequency'],
              })
            }
          >
            {PAYMENT_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className={labelClass}>
            <span>Type of annuity</span>
            <InfoTooltip
              label="Type of annuity"
              text="Ordinary annuity pays at the end of each period. Annuity due pays at the beginning, so each payment earns one extra period of interest."
            />
          </p>
          <div className="space-y-2">
            {ANNUITY_KIND_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fva-kind"
                  className="h-4 w-4 accent-primary"
                  checked={input.annuityKind === option.value}
                  onChange={() => set({ annuityKind: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="fva-result">
            Future value of annuity
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {resultSymbol}
              </span>
              <input
                id="fva-result"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedFutureValue : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fva-result-ccy"
                value={input.resultCurrency}
                onChange={handleResultCurrencyChange}
                aria-label="Future value currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          <span>Advanced parameters</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {advancedOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
            <div>
              <label className={labelClass} htmlFor="fva-growth">
                <span>Growth rate of the annuity</span>
                <InfoTooltip
                  label="Growth rate of the annuity"
                  text="Percent increase applied to each successive payment (growing annuity). Use 0 for level payments."
                />
              </label>
              <FieldShell error={errors.growthRatePercent}>
                <input
                  id="fva-growth"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.growthRatePercent}
                  aria-invalid={Boolean(errors.growthRatePercent)}
                  onChange={(e) => set({ growthRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.growthRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.growthRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fva-periods">
                Number of periods
              </label>
              <FieldShell muted>
                <input
                  id="fva-periods"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedNumberOfPeriods : ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="fva-equiv">
                <span>Equivalent interest rate</span>
                <InfoTooltip
                  label="Equivalent interest rate"
                  text="Effective annual rate implied by the payment-period rate when compounding and payment frequencies differ."
                />
              </label>
              <FieldShell muted>
                <input
                  id="fva-equiv"
                  className={`${inputClass} pr-10 font-semibold`}
                  readOnly
                  value={result ? result.formattedEquivalentRate : ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="fva-periodic">
                <span>Periodic equivalent interest rate</span>
                <InfoTooltip
                  label="Periodic equivalent interest rate"
                  text="Effective interest rate per payment period after converting the nominal annual rate for the selected compounding frequency."
                />
              </label>
              <FieldShell muted>
                <input
                  id="fva-periodic"
                  className={`${inputClass} pr-10 font-semibold`}
                  readOnly
                  value={result ? result.formattedPeriodicRate : ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
