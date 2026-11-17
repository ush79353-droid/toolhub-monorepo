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
import { formatCurrencyLabel, formatTermLabel } from './calculation';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  ESTIMATION_MODE_OPTIONS,
  INTEREST_TREATMENT_OPTIONS,
  REPAYMENT_TYPE_OPTIONS,
  type CompoundingFrequency,
  type DeferredPaymentLoanFieldErrors,
  type DeferredPaymentLoanInput,
  type DeferredPaymentLoanResult,
  type EstimationMode,
  type InterestTreatment,
  type RepaymentType,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-accent">
      <ChevronDown className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

interface DeferredPaymentLoanFormProps {
  input: DeferredPaymentLoanInput;
  errors: DeferredPaymentLoanFieldErrors;
  result: DeferredPaymentLoanResult | null;
  onChange: (input: DeferredPaymentLoanInput) => void;
}

export function DeferredPaymentLoanForm({
  input,
  errors,
  result,
  onChange,
}: DeferredPaymentLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);

  const set = (patch: Partial<DeferredPaymentLoanInput>) => {
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
      if (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) {
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
    if (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) {
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
    if (next === input.paymentCurrency) return;

    if (input.estimationMode === 'monthly_payment') {
      const amount = parseMoneyInput(input.originalMonthlyPayment);
      if (Number.isFinite(amount)) {
        if (!canConvertPair(input.paymentCurrency, next)) {
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
          originalMonthlyPayment: moneyAmountToInputString(converted.amount),
        });
        return;
      }
    }

    if (!canConvertPair(input.loanCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, paymentCurrency: next });
  };

  const scrollTable = (dir: -1 | 1) => {
    const el = tableRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: 'smooth' });
  };

  const money = (amount: number) =>
    formatCurrencyLabel(amount, result?.loanCurrency ?? input.loanCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={sectionClass}>
        <legend className="sr-only">Loan inputs</legend>
        <SectionTitle>Loan inputs</SectionTitle>

        <div>
          <p className={labelClass}>Estimation based on...</p>
          <div className="flex flex-wrap gap-4">
            {ESTIMATION_MODE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="dpl-estimation"
                  className="h-4 w-4 accent-primary"
                  checked={input.estimationMode === opt.value}
                  onChange={() => set({ estimationMode: opt.value as EstimationMode })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="dpl-loan-amount">
            <span>Loan amount</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="dpl-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dpl-loan-currency"
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
          <label className={labelClass} htmlFor="dpl-balance-date">
            Date of balance
          </label>
          <FieldShell error={errors.balanceDate}>
            <input
              id="dpl-balance-date"
              type="date"
              className={inputClass}
              value={input.balanceDate}
              aria-invalid={Boolean(errors.balanceDate)}
              onChange={(e) => set({ balanceDate: e.target.value })}
            />
          </FieldShell>
          {errors.balanceDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.balanceDate}</p>
          ) : null}
        </div>

        {input.estimationMode === 'loan_term' ? (
          <div>
            <label className={labelClass} htmlFor="dpl-term-years">
              Loan term
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.termYears}>
                <input
                  id="dpl-term-years"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.termYears}
                  aria-invalid={Boolean(errors.termYears)}
                  onChange={(e) => set({ termYears: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">yrs</span>
              </FieldShell>
              <FieldShell error={errors.termYears}>
                <input
                  id="dpl-term-months"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.termMonths}
                  aria-label="Loan term months"
                  onChange={(e) => set({ termMonths: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">mos</span>
              </FieldShell>
            </div>
            {errors.termYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="dpl-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate. Not FX-converted. Combined with compounding frequency to get the equivalent monthly rate."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="dpl-rate"
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

        <div>
          <label className={labelClass} htmlFor="dpl-compounding">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="How often interest compounds on the principal. Converted to an equivalent monthly rate for amortization."
            />
          </label>
          <select
            id="dpl-compounding"
            className={selectClass}
            value={input.compoundingFrequency}
            onChange={(e) =>
              set({ compoundingFrequency: e.target.value as CompoundingFrequency })
            }
          >
            {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="dpl-original-payment">
            Original monthly payment
          </label>
          <div className="flex gap-2">
            <FieldShell
              error={errors.originalMonthlyPayment}
              muted={input.estimationMode === 'loan_term'}
            >
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              {input.estimationMode === 'loan_term' ? (
                <input
                  id="dpl-original-payment"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedOriginalMonthlyPayment : ''}
                  aria-live="polite"
                />
              ) : (
                <input
                  id="dpl-original-payment"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.originalMonthlyPayment}
                  aria-invalid={Boolean(errors.originalMonthlyPayment)}
                  onChange={(e) => set({ originalMonthlyPayment: e.target.value })}
                />
              )}
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dpl-payment-currency"
                value={input.paymentCurrency}
                onChange={handlePaymentCurrencyChange}
                aria-label="Original monthly payment currency"
              />
            </div>
          </div>
          {errors.originalMonthlyPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalMonthlyPayment}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="sr-only">Loan deferment</legend>
        <SectionTitle>Loan deferment</SectionTitle>

        <div>
          <label className={labelClass} htmlFor="dpl-interest-treatment">
            Interest treatment
          </label>
          <select
            id="dpl-interest-treatment"
            className={selectClass}
            value={input.interestTreatment}
            onChange={(e) =>
              set({ interestTreatment: e.target.value as InterestTreatment })
            }
          >
            {INTEREST_TREATMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="dpl-repayment-type">
            Repayment by...
          </label>
          <select
            id="dpl-repayment-type"
            className={selectClass}
            value={input.repaymentType}
            onChange={(e) => set({ repaymentType: e.target.value as RepaymentType })}
          >
            {REPAYMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="dpl-deferment-from">
            Deferment from
          </label>
          <FieldShell error={errors.defermentFrom}>
            <input
              id="dpl-deferment-from"
              type="date"
              className={inputClass}
              value={input.defermentFrom}
              aria-invalid={Boolean(errors.defermentFrom)}
              onChange={(e) => set({ defermentFrom: e.target.value })}
            />
          </FieldShell>
          {errors.defermentFrom ? (
            <p className="mt-1 text-xs text-rose-600">{errors.defermentFrom}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpl-deferred-months">
            Payments deferred for...
          </label>
          <FieldShell error={errors.deferredMonths}>
            <input
              id="dpl-deferred-months"
              className={inputClass}
              inputMode="numeric"
              value={input.deferredMonths}
              aria-invalid={Boolean(errors.deferredMonths)}
              onChange={(e) => set({ deferredMonths: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">months</span>
          </FieldShell>
          {errors.deferredMonths ? (
            <p className="mt-1 text-xs text-rose-600">{errors.deferredMonths}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="sr-only">Payment summary</legend>
        <SectionTitle>Payment summary</SectionTitle>

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}

        {result ? (
          <>
            <p className="text-sm leading-relaxed text-foreground/90">
              The loan balance is{' '}
              <strong className="font-semibold text-accent">
                {formatCurrencyLabel(
                  result.balanceAtDefermentStart,
                  result.loanCurrency
                )}
              </strong>{' '}
              at the beginning, which will become{' '}
              <strong className="font-semibold text-accent">
                {formatCurrencyLabel(
                  result.balanceAfterDeferment,
                  result.loanCurrency
                )}
              </strong>{' '}
              at the end of the deferment. The accumulated interest during the deferment is{' '}
              <strong className="font-semibold text-accent">
                {formatCurrencyLabel(result.deferredInterest, result.loanCurrency)}
              </strong>
              .
            </p>

            <div className="space-y-2">
              <div
                ref={tableRef}
                className="overflow-x-auto rounded-lg border border-border"
              >
                <table className="min-w-[28rem] w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[12px] text-muted-foreground">
                      <th className="px-3 py-2 font-medium" />
                      <th className="px-3 py-2 font-medium">w/o def.</th>
                      <th className="px-3 py-2 font-medium">Deferment*</th>
                      <th className="px-3 py-2 font-medium">Diff.</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums text-accent">
                    <tr className="border-b border-border/70">
                      <td className="px-3 py-2 text-muted-foreground">Monthly</td>
                      <td className="px-3 py-2">{money(result.without.monthlyPayment)}</td>
                      <td className="px-3 py-2">{money(result.withDefer.monthlyPayment)}</td>
                      <td className="px-3 py-2">{money(result.diffMonthly)}</td>
                    </tr>
                    <tr className="border-b border-border/70">
                      <td className="px-3 py-2 text-muted-foreground">Interest</td>
                      <td className="px-3 py-2">{money(result.without.interest)}</td>
                      <td className="px-3 py-2">{money(result.withDefer.interest)}</td>
                      <td className="px-3 py-2">{money(result.diffInterest)}</td>
                    </tr>
                    <tr className="border-b border-border/70">
                      <td className="px-3 py-2 text-muted-foreground">Total paid</td>
                      <td className="px-3 py-2">{money(result.without.totalPaid)}</td>
                      <td className="px-3 py-2">{money(result.withDefer.totalPaid)}</td>
                      <td className="px-3 py-2">{money(result.diffTotalPaid)}</td>
                    </tr>
                    <tr className="border-b border-border/70">
                      <td className="px-3 py-2 text-muted-foreground">Term</td>
                      <td className="px-3 py-2">
                        {formatTermLabel(result.without.termMonths)}
                      </td>
                      <td className="px-3 py-2">
                        {formatTermLabel(result.withDefer.termMonths)}
                      </td>
                      <td className="px-3 py-2">
                        {formatTermLabel(Math.abs(result.diffTermMonths))}
                      </td>
                    </tr>
                    <tr className="border-b border-border/70">
                      <td className="px-3 py-2 text-muted-foreground"># pmts</td>
                      <td className="px-3 py-2">{result.without.paymentCount}</td>
                      <td className="px-3 py-2">{result.withDefer.paymentCount}</td>
                      <td className="px-3 py-2">{result.diffPaymentCount}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground">Payoff date</td>
                      <td className="px-3 py-2">{result.without.payoffDate}</td>
                      <td className="px-3 py-2">{result.withDefer.payoffDate}</td>
                      <td className="px-3 py-2">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-accent hover:bg-muted/40"
                  aria-label="Scroll comparison table left"
                  onClick={() => scrollTable(-1)}
                >
                  ‹
                </button>
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div className="h-1.5 w-1/3 rounded-full bg-primary/70" />
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-accent hover:bg-muted/40"
                  aria-label="Scroll comparison table right"
                  onClick={() => scrollTable(1)}
                >
                  ›
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                * Figures refer to the post-deferment period. Scroll horizontally to see all of
                the table.
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid loan and deferment details to see the payment summary.
          </p>
        )}
      </fieldset>
    </form>
  );
}
