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
import {
  applicationFeeFromPercent,
  applicationFeePercentFromAmount,
} from './calculation';
import { HomeImprovementLoanChart } from './HomeImprovementLoanChart';
import type {
  ApplicationFeeSource,
  HomeImprovementLoanFieldErrors,
  HomeImprovementLoanInput,
  HomeImprovementLoanResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface HomeImprovementLoanFormProps {
  input: HomeImprovementLoanInput;
  errors: HomeImprovementLoanFieldErrors;
  result: HomeImprovementLoanResult | null;
  onChange: (input: HomeImprovementLoanInput) => void;
  onReset: () => void;
}

export function HomeImprovementLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: HomeImprovementLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [inputsOpen, setInputsOpen] = React.useState(true);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const feeSymbol = getCurrencySymbol(input.applicationFeeCurrency);
  const homeFeeSymbol = getCurrencySymbol(input.homeLoanFeesCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const set = (patch: Partial<HomeImprovementLoanInput>) => {
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

  const convertAmount = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number | null => {
    if (from === to) return amount;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? converted.amount : null;
  };

  /** Sync application fee amount ↔ % without circular updates. */
  const syncApplicationFee = (
    next: HomeImprovementLoanInput,
    source: ApplicationFeeSource
  ): HomeImprovementLoanInput => {
    const loan = parseMoneyInput(next.loanAmount);
    if (!Number.isFinite(loan) || !(loan > 0)) {
      return { ...next, applicationFeeSource: source };
    }

    if (source === 'percent') {
      const pct = parseMoneyInput(next.applicationFeePercent);
      if (!Number.isFinite(pct) || pct < 0) {
        return { ...next, applicationFeeSource: source };
      }
      const feeInLoan = applicationFeeFromPercent(loan, pct);
      const feeInFeeCurrency = convertAmount(
        feeInLoan,
        next.loanCurrency,
        next.applicationFeeCurrency
      );
      if (feeInFeeCurrency === null) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return { ...next, applicationFeeSource: source };
      }
      return {
        ...next,
        applicationFeeSource: source,
        applicationFee: moneyAmountToInputString(feeInFeeCurrency),
      };
    }

    const feeAmt = parseMoneyInput(next.applicationFee);
    if (!Number.isFinite(feeAmt) || feeAmt < 0) {
      return { ...next, applicationFeeSource: source };
    }
    const feeInLoan = convertAmount(
      feeAmt,
      next.applicationFeeCurrency,
      next.loanCurrency
    );
    if (feeInLoan === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return { ...next, applicationFeeSource: source };
    }
    const pct = applicationFeePercentFromAmount(loan, feeInLoan);
    if (pct === null) return { ...next, applicationFeeSource: source };
    return {
      ...next,
      applicationFeeSource: source,
      applicationFeePercent: moneyAmountToInputString(pct),
    };
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    const nextAmount = convertFieldAmount(input.loanAmount, input.loanCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.applicationFeeCurrency !== next &&
        !canConvertPair(input.applicationFeeCurrency, next)) ||
      (input.homeLoanFeesCurrency !== next &&
        !canConvertPair(input.homeLoanFeesCurrency, next))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const patched: HomeImprovementLoanInput = {
      ...input,
      loanCurrency: next,
      loanAmount: nextAmount,
    };
    onChange(syncApplicationFee(patched, input.applicationFeeSource));
  };

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.applicationFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.applicationFee,
      input.applicationFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      applicationFeeCurrency: next,
      applicationFee: nextAmount,
      applicationFeeSource: 'amount',
    });
  };

  const handleHomeFeesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.homeLoanFeesCurrency) return;
    const nextAmount = convertFieldAmount(
      input.homeLoanFees,
      input.homeLoanFeesCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      homeLoanFeesCurrency: next,
      homeLoanFees: nextAmount,
    });
  };

  const handleLoanAmountChange = (raw: string) => {
    setConversionError(null);
    const patched = { ...input, loanAmount: raw };
    onChange(syncApplicationFee(patched, input.applicationFeeSource));
  };

  const handleFeePercentChange = (raw: string) => {
    setConversionError(null);
    onChange(
      syncApplicationFee(
        { ...input, applicationFeePercent: raw },
        'percent'
      )
    );
  };

  const handleFeeAmountChange = (raw: string) => {
    setConversionError(null);
    onChange(
      syncApplicationFee({ ...input, applicationFee: raw }, 'amount')
    );
  };

  const summaryRows = result
    ? [
        {
          key: 'monthly',
          label: 'Monthly payment',
          value: `${resultSymbol}${result.formattedMonthlyPayment}`,
          highlight: false,
        },
        {
          key: 'apr',
          label: 'Annual Percentage Rate (APR)',
          value: `${result.formattedApr}%`,
          highlight: true,
        },
        {
          key: 'term',
          label: 'Loan term',
          value: result.formattedLoanTerm,
          highlight: false,
        },
        {
          key: 'principal',
          label: 'Loan principal',
          value: `${resultSymbol}${result.formattedLoanPrincipal}`,
          highlight: false,
        },
        {
          key: 'interest',
          label: 'Total interest payable',
          value: `${resultSymbol}${result.formattedTotalInterest}`,
          highlight: false,
        },
        {
          key: 'fees',
          label: 'Loan fees',
          value: `${resultSymbol}${result.formattedLoanFees}`,
          highlight: false,
        },
        {
          key: 'total',
          label: 'Total payments',
          value: `${resultSymbol}${result.formattedTotalPayments}`,
          highlight: false,
        },
      ]
    : [];

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Loan inputs</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={inputsOpen}
          onClick={() => setInputsOpen((open) => !open)}
        >
          <span className="text-[13px] font-semibold text-accent">Loan inputs</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              inputsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {inputsOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="hil-loan">
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
                    id="hil-loan"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanAmount}
                    aria-invalid={Boolean(errors.loanAmount)}
                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hil-loan-currency"
                    value={input.loanCurrency}
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
              <span className={labelClass}>
                <span>Loan term</span>
                <InfoTooltip
                  label="Loan term"
                  text="Years and months. Payment count n = years × 12 + months. Not FX-converted."
                />
              </span>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <FieldShell error={errors.termYears}>
                    <input
                      id="hil-term-years"
                      className={`${inputClass} pr-14`}
                      inputMode="numeric"
                      value={input.termYears}
                      aria-label="Loan term years"
                      aria-invalid={Boolean(errors.termYears)}
                      onChange={(e) => set({ termYears: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      years
                    </span>
                  </FieldShell>
                </div>
                <div className="min-w-0 flex-1">
                  <FieldShell error={errors.termMonths}>
                    <input
                      id="hil-term-months"
                      className={`${inputClass} pr-12`}
                      inputMode="numeric"
                      value={input.termMonths}
                      aria-label="Loan term months"
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
                  {errors.termYears || errors.termMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="hil-rate">
                <span>Interest rate</span>
                <InfoTooltip
                  label="Interest rate"
                  text="Nominal annual interest rate. Monthly rate r = rate / 1200. Not FX-converted."
                />
              </label>
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="hil-rate"
                  className={`${inputClass} pr-8`}
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="hil-fee-pct">
                  <span>Application fee %</span>
                  <InfoTooltip
                    label="Application fee %"
                    text="Application fee = loan amount × fee% / 100. Syncs with the fee amount without double-counting."
                  />
                </label>
                <FieldShell error={errors.applicationFeePercent}>
                  <input
                    id="hil-fee-pct"
                    className={`${inputClass} pr-8`}
                    inputMode="decimal"
                    value={input.applicationFeePercent}
                    aria-invalid={Boolean(errors.applicationFeePercent)}
                    onChange={(e) => handleFeePercentChange(e.target.value)}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </FieldShell>
                {errors.applicationFeePercent ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.applicationFeePercent}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={labelClass} htmlFor="hil-fee">
                  <span>Application fee</span>
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.applicationFee}>
                    <span
                      className="shrink-0 pl-3 text-sm text-muted-foreground"
                      aria-hidden="true"
                    >
                      {feeSymbol}
                    </span>
                    <input
                      id="hil-fee"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.applicationFee}
                      aria-invalid={Boolean(errors.applicationFee)}
                      onChange={(e) => handleFeeAmountChange(e.target.value)}
                    />
                  </FieldShell>
                  <div className="w-[96px] shrink-0 sm:w-[110px]">
                    <CurrencySelect
                      id="hil-fee-currency"
                      value={input.applicationFeeCurrency}
                      onChange={handleFeeCurrencyChange}
                      aria-label="Application fee currency"
                    />
                  </div>
                </div>
                {errors.applicationFee ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.applicationFee}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="hil-home-fees">
                <span>Home loan fees</span>
                <InfoTooltip
                  label="Home loan fees"
                  text="Additional up-front fees. Added once to loan fees and APR net proceeds; never double-counted."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.homeLoanFees}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {homeFeeSymbol}
                  </span>
                  <input
                    id="hil-home-fees"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.homeLoanFees}
                    aria-invalid={Boolean(errors.homeLoanFees)}
                    onChange={(e) => set({ homeLoanFees: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hil-home-fees-currency"
                    value={input.homeLoanFeesCurrency}
                    onChange={handleHomeFeesCurrencyChange}
                    aria-label="Home loan fees currency"
                  />
                </div>
              </div>
              {errors.homeLoanFees ? (
                <p className="mt-1 text-xs text-rose-600">{errors.homeLoanFees}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Payment summary
        </legend>

        {result ? (
          <>
            <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
              {summaryRows.map((row) => (
                <div
                  key={row.key}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm ${
                    row.highlight ? 'bg-brand-softTeal/50' : ''
                  }`}
                >
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-semibold tabular-nums text-accent">{row.value}</dd>
                </div>
              ))}
            </dl>

            <HomeImprovementLoanChart
              points={result.chartPoints}
              currency={result.currency}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid loan inputs to see the payment summary.
          </p>
        )}
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
