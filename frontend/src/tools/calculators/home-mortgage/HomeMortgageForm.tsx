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
import { formatDisplayDate } from './calculation';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';
import {
  INTEREST_METHOD_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type HomeMortgageFieldErrors,
  type HomeMortgageInput,
  type HomeMortgageResult,
  type InterestMethod,
  type PaymentFrequency,
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

interface HomeMortgageFormProps {
  input: HomeMortgageInput;
  errors: HomeMortgageFieldErrors;
  result: HomeMortgageResult | null;
  onChange: (input: HomeMortgageInput) => void;
  onReset: () => void;
}

export function HomeMortgageForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: HomeMortgageFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<HomeMortgageInput>) => {
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

  const handleHomeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.homeValueCurrency) return;
    const nextHome = convertFieldAmount(
      input.homeValue,
      input.homeValueCurrency,
      next
    );
    if (nextHome === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      homeValueCurrency: next,
      homeValue: nextHome,
    });
  };

  const handleDownCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.downPaymentCurrency) return;
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
    setConversionError(null);
    onChange({ ...input, loanAmountCurrency: next });
  };

  const handlePaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.paymentCurrency) return;
    setConversionError(null);
    onChange({ ...input, paymentCurrency: next });
  };

  const handleOtherCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.otherCostsCurrency) return;
    const nextOther = convertFieldAmount(
      input.otherCosts,
      input.otherCostsCurrency,
      next
    );
    if (nextOther === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      otherCostsCurrency: next,
      otherCosts: nextOther,
    });
  };

  const onDownAmountEdit = (value: string) => {
    set({ downPayment: value, downPaymentSource: 'amount' });
  };

  const onDownPercentEdit = (value: string) => {
    set({ downPaymentPercent: value, downPaymentSource: 'percent' });
  };

  const homeSymbol = getCurrencySymbol(input.homeValueCurrency);
  const downSymbol = getCurrencySymbol(input.downPaymentCurrency);
  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);
  const paySymbol = getCurrencySymbol(input.paymentCurrency);
  const otherSymbol = getCurrencySymbol(input.otherCostsCurrency);
  const summarySymbol = getCurrencySymbol(input.paymentCurrency);

  const dirty =
    input.homeValue !== '150000' ||
    input.downPayment !== '15000' ||
    input.downPaymentPercent !== '10' ||
    input.interestRatePercent !== '4.5' ||
    input.loanTermYears !== '30' ||
    input.interestMethod !== 'monthly_us_uk' ||
    input.paymentFrequency !== 'monthly' ||
    input.annualPmiPercent !== '0.5' ||
    input.otherCosts !== '0' ||
    input.showFurtherSpecs ||
    input.homeValueCurrency !== 'PKR' ||
    input.downPaymentCurrency !== 'PKR' ||
    input.loanAmountCurrency !== 'PKR' ||
    input.paymentCurrency !== 'PKR' ||
    input.otherCostsCurrency !== 'PKR';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Home Mortgage
        </legend>

        <div>
          <label className={labelClass} htmlFor="hl-home">
            <span>Home value</span>
            <InfoTooltip label="Home value" text="Purchase price or property value. Calculation currency." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.homeValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {homeSymbol}
              </span>
              <input
                id="hl-home"
                className={inputClass}
                inputMode="decimal"
                value={input.homeValue}
                aria-invalid={Boolean(errors.homeValue)}
                onChange={(e) => set({ homeValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hl-home-currency"
                value={input.homeValueCurrency}
                onChange={handleHomeCurrencyChange}
                aria-label="Home value currency"
              />
            </div>
          </div>
          {errors.homeValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.homeValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-down">
            <span>Down payment</span>
            <InfoTooltip label="Down payment" text="Amount paid upfront. Synced with the percentage field." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {downSymbol}
              </span>
              <input
                id="hl-down"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) => onDownAmountEdit(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hl-down-currency"
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
          <label className={labelClass} htmlFor="hl-down-pct">
            <span>Down payment in percentage</span>
            <InfoTooltip label="Down payment %" text="Down payment ÷ home value × 100." />
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="hl-down-pct"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.downPaymentPercent}
              aria-invalid={Boolean(errors.downPaymentPercent)}
              onChange={(e) => onDownPercentEdit(e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.downPaymentPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPaymentPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-loan">
            <span>Loan amount</span>
            <InfoTooltip label="Loan amount" text="Home value − down payment (calculated)." />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {loanSymbol}
              </span>
              <input
                id="hl-loan"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedLoanAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hl-loan-currency"
                value={input.loanAmountCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-rate">
            <span>Interest rate</span>
            <InfoTooltip label="Interest rate" text="Nominal annual interest rate." />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="hl-rate"
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
          <label className={labelClass} htmlFor="hl-term">
            <span>Loan term</span>
            <InfoTooltip label="Loan term" text="Amortization length in years." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanTermYears}>
              <input
                id="hl-term"
                className={inputClass}
                inputMode="decimal"
                value={input.loanTermYears}
                aria-invalid={Boolean(errors.loanTermYears)}
                onChange={(e) => set({ loanTermYears: e.target.value })}
              />
            </FieldShell>
            <div className="flex h-11 w-[90px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
              yrs
            </div>
          </div>
          {errors.loanTermYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-method">
            <span>Interest calculation method</span>
            <InfoTooltip
              label="Interest calculation method"
              text="Monthly (US & UK) uses APR÷12. Semi-annually (Canada) uses semi-annual compounding."
            />
          </label>
          <select
            id="hl-method"
            className={selectClass}
            value={input.interestMethod}
            onChange={(e) =>
              set({ interestMethod: e.target.value as InterestMethod })
            }
          >
            {INTEREST_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-freq">
            <span>Payment frequency</span>
            <InfoTooltip
              label="Payment frequency"
              text="How often payments are made. Accelerated schedules use half/quarter of the monthly payment more often."
            />
          </label>
          <select
            id="hl-freq"
            className={selectClass}
            value={input.paymentFrequency}
            onChange={(e) =>
              set({ paymentFrequency: e.target.value as PaymentFrequency })
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
          <label className={labelClass} htmlFor="hl-first">
            <span>First day</span>
            <InfoTooltip label="First day" text="Date of the first payment; used for payoff and PMI end dates." />
          </label>
          <FieldShell error={errors.firstDay}>
            <input
              id="hl-first"
              type="date"
              className={inputClass}
              value={input.firstDay}
              aria-invalid={Boolean(errors.firstDay)}
              onChange={(e) => set({ firstDay: e.target.value })}
            />
          </FieldShell>
          {errors.firstDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.firstDay}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hl-payment">
            <span>Payment</span>
            <InfoTooltip label="Payment" text="Calculated periodic principal and interest payment." />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {paySymbol}
              </span>
              <input
                id="hl-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPeriodicPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hl-payment-currency"
                value={input.paymentCurrency}
                onChange={handlePaymentCurrencyChange}
                aria-label="Payment currency"
              />
            </div>
          </div>
        </div>

        {conversionError || ratesStatus.warning ? (
          <p className="text-xs text-amber-700" role="status">
            {conversionError || ratesStatus.warning}
          </p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={input.showFurtherSpecs}
          onClick={() => set({ showFurtherSpecs: !input.showFurtherSpecs })}
        >
          <span>Further specifications</span>
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-xs transition-transform ${
              input.showFurtherSpecs ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            ▾
          </span>
        </button>
        {input.showFurtherSpecs ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
            <div>
              <label className={labelClass} htmlFor="hl-pmi">
                <span>Annual PMI rate</span>
                <InfoTooltip
                  label="Annual PMI rate"
                  text="Private mortgage insurance as a percent of the original loan per year. Charged while post-payment LTV stays above 80%. Default 0.5%."
                />
              </label>
              <FieldShell error={errors.annualPmiPercent}>
                <input
                  id="hl-pmi"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.annualPmiPercent}
                  aria-invalid={Boolean(errors.annualPmiPercent)}
                  onChange={(e) => set({ annualPmiPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualPmiPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualPmiPercent}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="hl-other">
                <span>Other costs (per payment)</span>
                <InfoTooltip
                  label="Other costs"
                  text="Additional periodic costs (taxes, insurance, HOA, etc.) added to the total-with-costs figure and pie chart."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.otherCosts}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {otherSymbol}
                  </span>
                  <input
                    id="hl-other"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.otherCosts}
                    aria-invalid={Boolean(errors.otherCosts)}
                    onChange={(e) => set({ otherCosts: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hl-other-currency"
                    value={input.otherCostsCurrency}
                    onChange={handleOtherCurrencyChange}
                    aria-label="Other costs currency"
                  />
                </div>
              </div>
              {errors.otherCosts ? (
                <p className="mt-1 text-xs text-rose-600">{errors.otherCosts}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {result ? (
        <section
          className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          aria-label="Mortgage summary"
        >
          <h3 className="text-[13px] font-semibold text-accent">Mortgage Summary</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-accent">
            <p>
              Your mortgage payoff date is{' '}
              <strong>{formatDisplayDate(result.payoffDate)}</strong>.
            </p>
            <p>
              The total of the <strong>{result.paymentCount}</strong> mortgage payments is{' '}
              <strong>
                {summarySymbol}
                {result.formattedTotalPayments}
              </strong>
              . From that, the total interest payment is{' '}
              <strong>
                {summarySymbol}
                {result.formattedTotalInterest}
              </strong>
              .
            </p>
            {result.totalPmi > 0 && result.pmiUntilDate ? (
              <p>
                The total payable <strong>Private Mortgage Insurance (PMI)</strong> is{' '}
                <strong>
                  {summarySymbol}
                  {result.formattedTotalPmi}
                </strong>
                , with a{' '}
                <strong>
                  {summarySymbol}
                  {result.formattedPeriodicPmi}
                </strong>{' '}
                periodic contribution, that needs to be paid until{' '}
                <strong>{formatDisplayDate(result.pmiUntilDate)}</strong>.
              </p>
            ) : (
              <p>No Private Mortgage Insurance (PMI) applies for this down payment and PMI rate.</p>
            )}
            <p>
              Your total payment with all additional costs is{' '}
              <strong>
                {summarySymbol}
                {result.formattedTotalWithCosts}
              </strong>
              .
            </p>
          </div>
          <PaymentBreakdownChart result={result} />
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          disabled={!dirty}
          onClick={onReset}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
