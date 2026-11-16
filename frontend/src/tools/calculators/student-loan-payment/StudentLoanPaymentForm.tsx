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
import {
  COMPOUND_FREQUENCY_OPTIONS,
  KNOWN_RATE_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type KnownRateType,
  type OriginationFeeRepayment,
  type PaymentFrequency,
  type StudentLoanPaymentFieldErrors,
  type StudentLoanPaymentInput,
  type StudentLoanPaymentResult,
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

interface StudentLoanPaymentFormProps {
  input: StudentLoanPaymentInput;
  errors: StudentLoanPaymentFieldErrors;
  result: StudentLoanPaymentResult | null;
  onChange: (input: StudentLoanPaymentInput) => void;
}

export function StudentLoanPaymentForm({
  input,
  errors,
  result,
  onChange,
}: StudentLoanPaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [specsOpen, setSpecsOpen] = React.useState(true);
  const [feesOpen, setFeesOpen] = React.useState(true);

  const set = (patch: Partial<StudentLoanPaymentInput>) => {
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

  const convertFieldCurrency = (
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    if (from === to) return amountRaw;
    if (!canConvertPair(from, to)) return null;
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? moneyAmountToInputString(converted.amount) : null;
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldCurrency(
      input.loanAmount,
      input.loanCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    set({ loanCurrency: next, loanAmount: converted });
  };

  const handlePrepaidCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.prepaidFeeCurrency) return;
    if (!canConvertPair(input.prepaidFeeCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldCurrency(
      input.prepaidFee,
      input.prepaidFeeCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    set({ prepaidFeeCurrency: next, prepaidFee: converted });
  };

  const handleLoanedCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanedFeeCurrency) return;
    if (!canConvertPair(input.loanedFeeCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldCurrency(
      input.loanedFee,
      input.loanedFeeCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    set({ loanedFeeCurrency: next, loanedFee: converted });
  };

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const prepaidSymbol = getCurrencySymbol(input.prepaidFeeCurrency);
  const loanedSymbol = getCurrencySymbol(input.loanedFeeCurrency);

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="flex w-full items-center justify-between px-1">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
            aria-expanded={specsOpen}
            onClick={() => setSpecsOpen((v) => !v)}
          >
            <span>Loan specifications</span>
            <span className="text-muted-foreground">{specsOpen ? '▾' : '▸'}</span>
          </button>
        </legend>

        {specsOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="slp-known-rate">
                <span>What interest rate do you know?</span>
                <InfoTooltip
                  label="What interest rate do you know?"
                  text="Nominal rate is quoted with a compounding frequency. Effective rate is already annualized."
                />
              </label>
              <select
                id="slp-known-rate"
                className={selectClass}
                value={input.knownRate}
                onChange={(e) => set({ knownRate: e.target.value as KnownRateType })}
              >
                {KNOWN_RATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-rate">
                <span>Interest rate</span>
              </label>
              <FieldShell error={errors.interestRate}>
                <input
                  id="slp-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.interestRate}
                  aria-invalid={Boolean(errors.interestRate)}
                  onChange={(e) => set({ interestRate: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.interestRate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-compound">
                <span>Compound frequency</span>
              </label>
              <select
                id="slp-compound"
                className={selectClass}
                value={input.compoundFrequency}
                onChange={(e) =>
                  set({ compoundFrequency: e.target.value as CompoundFrequency })
                }
              >
                {COMPOUND_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-amount">
                <span>Loan amount</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanAmount}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {loanSymbol}
                  </span>
                  <input
                    id="slp-amount"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanAmount}
                    aria-invalid={Boolean(errors.loanAmount)}
                    onChange={(e) => set({ loanAmount: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="slp-amount-currency"
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
              <span className={labelClass}>Loan term</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <FieldShell error={errors.termYears}>
                    <input
                      id="slp-years"
                      className={`${inputClass} pr-12`}
                      inputMode="numeric"
                      value={input.termYears}
                      aria-invalid={Boolean(errors.termYears)}
                      onChange={(e) => set({ termYears: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      yrs
                    </span>
                  </FieldShell>
                </div>
                <div>
                  <FieldShell error={errors.termMonths}>
                    <input
                      id="slp-months"
                      className={`${inputClass} pr-12`}
                      inputMode="numeric"
                      value={input.termMonths}
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
                  {errors.termYears ?? errors.termMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-pay-freq">
                <span>Payment frequency</span>
              </label>
              <select
                id="slp-pay-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) =>
                  set({ paymentFrequency: e.target.value as PaymentFrequency })
                }
              >
                {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="flex w-full items-center justify-between px-1">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
            aria-expanded={feesOpen}
            onClick={() => setFeesOpen((v) => !v)}
          >
            <span>Additional fees</span>
            <span className="text-muted-foreground">{feesOpen ? '▾' : '▸'}</span>
          </button>
        </legend>

        {feesOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="slp-prepaid">
                <span>Prepaid fee</span>
                <InfoTooltip
                  label="Prepaid fee"
                  text="Paid upfront out of pocket; not added to the financed balance."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.prepaidFee}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {prepaidSymbol}
                  </span>
                  <input
                    id="slp-prepaid"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.prepaidFee}
                    aria-invalid={Boolean(errors.prepaidFee)}
                    onChange={(e) => set({ prepaidFee: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="slp-prepaid-currency"
                    value={input.prepaidFeeCurrency}
                    onChange={handlePrepaidCurrencyChange}
                    aria-label="Prepaid fee currency"
                  />
                </div>
              </div>
              {errors.prepaidFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.prepaidFee}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-loaned">
                <span>Loaned fee</span>
                <InfoTooltip
                  label="Loaned fee"
                  text="Financed into the loan balance and repaid with interest."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanedFee}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {loanedSymbol}
                  </span>
                  <input
                    id="slp-loaned"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanedFee}
                    aria-invalid={Boolean(errors.loanedFee)}
                    onChange={(e) => set({ loanedFee: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="slp-loaned-currency"
                    value={input.loanedFeeCurrency}
                    onChange={handleLoanedCurrencyChange}
                    aria-label="Loaned fee currency"
                  />
                </div>
              </div>
              {errors.loanedFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanedFee}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="slp-origination">
                <span>Origination fee</span>
              </label>
              <FieldShell error={errors.originationFee}>
                <input
                  id="slp-origination"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.originationFee}
                  aria-invalid={Boolean(errors.originationFee)}
                  onChange={(e) => set({ originationFee: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.originationFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.originationFee}</p>
              ) : null}
            </div>

            <div>
              <span className={labelClass}>Origination fee repayment</span>
              <div className="space-y-2">
                {(
                  [
                    ['from_loan', 'From the loan amount'],
                    ['rolling', 'Rolling into the loan'],
                    ['out_of_pocket', 'Out of pocket'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-[13px] text-accent"
                  >
                    <input
                      type="radio"
                      name="slp-origination-repayment"
                      className="h-4 w-4 border-border"
                      checked={input.originationFeeRepayment === value}
                      onChange={() =>
                        set({
                          originationFeeRepayment: value as OriginationFeeRepayment,
                        })
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </fieldset>

      {conversionError || ratesStatus.warning ? (
        <p className="text-xs text-amber-800">
          {conversionError ?? ratesStatus.warning}
        </p>
      ) : null}

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      {result ? (
        <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
          <div className="space-y-3 text-sm leading-relaxed text-accent" aria-live="polite">
            {result.summaryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
