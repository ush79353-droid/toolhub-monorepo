'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
import { LoanInterestChart } from './LoanInterestChart';
import {
  FREQUENCY_OPTIONS,
  TERM_UNIT_OPTIONS,
  createDefaultInput,
  type Frequency,
  type LoanInterestFieldErrors,
  type LoanInterestInput,
  type LoanInterestResult,
  type TermUnit,
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

interface LoanInterestFormProps {
  input: LoanInterestInput;
  errors: LoanInterestFieldErrors;
  result: LoanInterestResult | null;
  onChange: (input: LoanInterestInput) => void;
  onReset: () => void;
}

export function LoanInterestForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: LoanInterestFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(true);
  const defaults = createDefaultInput();

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const interestSymbol = getCurrencySymbol(input.interestCurrency);
  const totalSymbol = getCurrencySymbol(input.totalCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);

  const set = (patch: Partial<LoanInterestInput>) => {
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

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    const nextBalance = convertFieldAmount(
      input.loanBalance,
      input.loanCurrency,
      next
    );
    if (nextBalance === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      loanCurrency: next,
      loanBalance: nextBalance,
    });
  };

  const handleResultCurrencyChange = (
    field: 'interestCurrency' | 'totalCurrency' | 'paymentCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (next !== input.loanCurrency && !canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const dirty =
    input.loanBalance !== defaults.loanBalance ||
    input.loanTerm !== defaults.loanTerm ||
    input.termUnit !== defaults.termUnit ||
    input.interestRatePercent !== defaults.interestRatePercent ||
    input.paymentFrequency !== defaults.paymentFrequency ||
    input.compoundingFrequency !== defaults.compoundingFrequency ||
    input.loanCurrency !== defaults.loanCurrency ||
    input.interestCurrency !== defaults.interestCurrency ||
    input.totalCurrency !== defaults.totalCurrency ||
    input.paymentCurrency !== defaults.paymentCurrency;

  const paymentLabel = result?.paymentLabel ?? 'Monthly payment';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((open) => !open)}
        >
          <span>Loan details</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>

        {detailsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
            <div>
              <label className={labelClass} htmlFor="li-balance">
                <span>Loan balance</span>
                <InfoTooltip
                  label="Loan balance"
                  text="Outstanding principal used for amortization. Calculation currency."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanBalance}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {loanSymbol}
                  </span>
                  <input
                    id="li-balance"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanBalance}
                    aria-invalid={Boolean(errors.loanBalance)}
                    onChange={(e) => set({ loanBalance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="li-balance-currency"
                    value={input.loanCurrency}
                    onChange={handleLoanCurrencyChange}
                    aria-label="Loan balance currency"
                  />
                </div>
              </div>
              {errors.loanBalance ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanBalance}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="li-term">
                <span>Loan term</span>
                <InfoTooltip
                  label="Loan term"
                  text="Amortization length in years or months."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanTerm}>
                  <input
                    id="li-term"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanTerm}
                    aria-invalid={Boolean(errors.loanTerm)}
                    onChange={(e) => set({ loanTerm: e.target.value })}
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[90px] shrink-0`}
                  value={input.termUnit}
                  aria-label="Loan term unit"
                  onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
                >
                  {TERM_UNIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.loanTerm ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="li-rate">
                <span>Interest rate</span>
                <InfoTooltip
                  label="Interest rate"
                  text="Nominal annual interest rate. Not converted when currencies change."
                />
              </label>
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="li-rate"
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
              <label className={labelClass} htmlFor="li-pay-freq">
                <span>Payment frequency</span>
                <InfoTooltip
                  label="Payment frequency"
                  text="How often payments are made. Controls payment count and the repayment label."
                />
              </label>
              <select
                id="li-pay-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) =>
                  set({ paymentFrequency: e.target.value as Frequency })
                }
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="li-comp-freq">
                <span>Compounding frequency</span>
                <InfoTooltip
                  label="Compounding frequency"
                  text="How often interest compounds. Combined with payment frequency into the periodic rate."
                />
              </label>
              <select
                id="li-comp-freq"
                className={selectClass}
                value={input.compoundingFrequency}
                onChange={(e) =>
                  set({ compoundingFrequency: e.target.value as Frequency })
                }
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {conversionError || ratesStatus.warning ? (
              <p className="text-xs text-amber-700" role="status">
                {conversionError || ratesStatus.warning}
              </p>
            ) : null}
            {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
          </div>
        ) : null}
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="li-interest">
            <span>Interest to be paid</span>
            <InfoTooltip
              label="Interest to be paid"
              text="Total interest over the full amortization (full precision, then display-rounded)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {interestSymbol}
              </span>
              <input
                id="li-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="li-interest-currency"
                value={input.interestCurrency}
                onChange={(next) => handleResultCurrencyChange('interestCurrency', next)}
                aria-label="Interest currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="li-total">
            <span>Total payment</span>
            <InfoTooltip
              label="Total payment"
              text="Principal plus interest over the full term."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalSymbol}
              </span>
              <input
                id="li-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="li-total-currency"
                value={input.totalCurrency}
                onChange={(next) => handleResultCurrencyChange('totalCurrency', next)}
                aria-label="Total payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="li-payment">
            <span>{paymentLabel}</span>
            <InfoTooltip
              label={paymentLabel}
              text="Periodic principal-and-interest installment for the selected payment frequency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {paymentSymbol}
              </span>
              <input
                id="li-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPeriodicPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="li-payment-currency"
                value={input.paymentCurrency}
                onChange={(next) => handleResultCurrencyChange('paymentCurrency', next)}
                aria-label="Payment currency"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {result ? (
        <section className="space-y-2" aria-label="Balances">
          <h3 className="text-[13px] font-semibold text-accent">Balances</h3>
          <LoanInterestChart points={result.chartPoints} currency={input.loanCurrency} />
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
