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
  amortizingMonthlyPayment,
  calculateNoiFromComponents,
  termToMonths,
} from './calculation';
import {
  MONEY_FREQUENCY_OPTIONS,
  TERM_UNIT_OPTIONS,
  type DebtServiceCoverageRatioFieldErrors,
  type DebtServiceCoverageRatioInput,
  type DebtServiceCoverageRatioResult,
  type MoneyFrequency,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-2 pr-7 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface DebtServiceCoverageRatioFormProps {
  input: DebtServiceCoverageRatioInput;
  errors: DebtServiceCoverageRatioFieldErrors;
  result: DebtServiceCoverageRatioResult | null;
  onChange: (input: DebtServiceCoverageRatioInput) => void;
}

export function DebtServiceCoverageRatioForm({
  input,
  errors,
  result,
  onChange,
}: DebtServiceCoverageRatioFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [debtOpen, setDebtOpen] = React.useState(true);

  const loanSymbol = getCurrencySymbol(input.totalLoanCurrency);
  const paymentSymbol = getCurrencySymbol(input.loanPaymentCurrency);
  const giSymbol = getCurrencySymbol(input.grossIncomeCurrency);
  const noiSymbol = getCurrencySymbol(input.noiCurrency);

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
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

  const syncPaymentFromLoan = (
    next: DebtServiceCoverageRatioInput
  ): DebtServiceCoverageRatioInput => {
    const principal = parseMoneyInput(next.totalLoan);
    const rate = Number(String(next.interestRatePercent).trim().replace(/,/g, ''));
    const term = Number(String(next.term).trim().replace(/,/g, ''));
    if (
      !Number.isFinite(principal) ||
      !(principal > 0) ||
      !Number.isFinite(rate) ||
      rate < 0 ||
      !Number.isFinite(term) ||
      !(term > 0)
    ) {
      return next;
    }
    const months = termToMonths(term, next.termUnit);
    if (months === null) return next;

    const monthly = amortizingMonthlyPayment({
      principal,
      annualRatePercent: rate,
      termMonths: months,
    });
    if (monthly === null) return next;

    // Express auto payment in the payment field's currency + frequency.
    let amountInPaymentCurrency = convertAmount(
      monthly,
      next.totalLoanCurrency,
      next.loanPaymentCurrency
    );
    if (amountInPaymentCurrency === null) return next;
    if (next.loanPaymentFrequency === 'yr') {
      amountInPaymentCurrency *= 12;
    }

    return {
      ...next,
      loanPayment: moneyAmountToInputString(amountInPaymentCurrency),
      paymentSource: 'auto',
    };
  };

  const syncNoiFromComponents = (
    next: DebtServiceCoverageRatioInput
  ): DebtServiceCoverageRatioInput => {
    const gi = parseMoneyInput(next.grossIncome);
    const expenses = Number(String(next.expensesPercent).trim().replace(/,/g, ''));
    const vacancy = Number(String(next.vacancyPercent).trim().replace(/,/g, ''));
    if (
      !Number.isFinite(gi) ||
      gi < 0 ||
      !Number.isFinite(expenses) ||
      expenses < 0 ||
      !Number.isFinite(vacancy) ||
      vacancy < 0
    ) {
      return next;
    }

    const noiInGi = calculateNoiFromComponents({
      grossIncome: gi,
      expensesPercent: expenses,
      vacancyPercent: vacancy,
    });
    if (noiInGi === null) return next;

    // Convert GI-period NOI into the NOI field currency/frequency.
    const monthlyNoi =
      next.grossIncomeFrequency === 'yr' ? noiInGi / 12 : noiInGi;
    let displayNoi = monthlyNoi;
    if (next.noiFrequency === 'yr') displayNoi = monthlyNoi * 12;

    const converted = convertAmount(
      displayNoi,
      next.grossIncomeCurrency,
      next.noiCurrency
    );
    if (converted === null) return next;

    return {
      ...next,
      noi: moneyAmountToInputString(converted),
      noiSource: 'calculated',
    };
  };

  const set = (patch: Partial<DebtServiceCoverageRatioInput>) => {
    setConversionError(null);
    let next: DebtServiceCoverageRatioInput = { ...input, ...patch };

    const amortizationDriversChanged =
      patch.interestRatePercent !== undefined ||
      patch.term !== undefined ||
      patch.termUnit !== undefined ||
      patch.totalLoan !== undefined ||
      patch.totalLoanCurrency !== undefined;

    // Loan drivers always re-auto payment (manual override replaced — no reverse-solve).
    // Frequency change re-autos only while still in auto mode.
    // Payment-currency changes convert in the dedicated handler and must not re-amortize.
    if (amortizationDriversChanged) {
      next = { ...next, paymentSource: 'auto' };
      next = syncPaymentFromLoan(next);
    } else if (
      patch.loanPaymentFrequency !== undefined &&
      next.paymentSource === 'auto'
    ) {
      next = syncPaymentFromLoan(next);
    }

    const noiTouched =
      patch.grossIncome !== undefined ||
      patch.grossIncomeCurrency !== undefined ||
      patch.grossIncomeFrequency !== undefined ||
      patch.expensesPercent !== undefined ||
      patch.vacancyPercent !== undefined;

    if (noiTouched) {
      next = syncNoiFromComponents(next);
    }

    onChange(next);
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.totalLoanCurrency) return;
    const amount = parseMoneyInput(input.totalLoan);
    if (!Number.isFinite(amount)) {
      set({ totalLoanCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.totalLoanCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      totalLoanCurrency: next,
      totalLoan: moneyAmountToInputString(converted),
    });
  };

  const handlePaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanPaymentCurrency) return;
    const amount = parseMoneyInput(input.loanPayment);
    if (!Number.isFinite(amount)) {
      set({ loanPaymentCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.loanPaymentCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      loanPaymentCurrency: next,
      loanPayment: moneyAmountToInputString(converted),
    });
  };

  const handleGiCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.grossIncomeCurrency) return;
    const amount = parseMoneyInput(input.grossIncome);
    if (!Number.isFinite(amount)) {
      set({ grossIncomeCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.grossIncomeCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      grossIncomeCurrency: next,
      grossIncome: moneyAmountToInputString(converted),
    });
  };

  const handleNoiCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.noiCurrency) return;
    const amount = parseMoneyInput(input.noi);
    if (!Number.isFinite(amount)) {
      set({ noiCurrency: next });
      return;
    }
    const converted = convertAmount(amount, input.noiCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      noiCurrency: next,
      noi: moneyAmountToInputString(converted),
      noiSource: 'direct',
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
        <legend className="sr-only">Debt service</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setDebtOpen((open) => !open)}
          aria-expanded={debtOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Debt service</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              debtOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {debtOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="dscr-rate">
                <span>Interest rate</span>
              </label>
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="dscr-rate"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.interestRatePercent}
                  aria-invalid={Boolean(errors.interestRatePercent)}
                  onChange={(e) => set({ interestRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %/yr
                </span>
              </FieldShell>
              {errors.interestRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="dscr-term">
                <span>Term</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.term}>
                  <input
                    id="dscr-term"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.term}
                    aria-invalid={Boolean(errors.term)}
                    onChange={(e) => set({ term: e.target.value })}
                  />
                </FieldShell>
                <div className="relative w-[96px] shrink-0">
                  <select
                    className={selectClass}
                    value={input.termUnit}
                    aria-label="Term unit"
                    onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
                  >
                    {TERM_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
              {errors.term ? (
                <p className="mt-1 text-xs text-rose-600">{errors.term}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="dscr-loan">
                <span>Total loan</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.totalLoan}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {loanSymbol}
                  </span>
                  <input
                    id="dscr-loan"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.totalLoan}
                    aria-invalid={Boolean(errors.totalLoan)}
                    onChange={(e) => set({ totalLoan: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="dscr-loan-currency"
                    value={input.totalLoanCurrency}
                    onChange={handleLoanCurrencyChange}
                    aria-label="Total loan currency"
                  />
                </div>
              </div>
              {errors.totalLoan ? (
                <p className="mt-1 text-xs text-rose-600">{errors.totalLoan}</p>
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
              <label className={labelClass} htmlFor="dscr-payment">
                <span>Loan payment</span>
                <InfoTooltip
                  label="Loan payment"
                  text="Auto-filled from amortizing payment when loan, rate, and term are set. You can override it; debt service for DSCR uses this field."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {paymentSymbol}
                  </span>
                  <input
                    id="dscr-payment"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanPayment}
                    aria-invalid={Boolean(errors.loanPayment)}
                    onChange={(e) =>
                      onChange({
                        ...input,
                        loanPayment: e.target.value,
                        paymentSource: 'manual',
                      })
                    }
                  />
                </FieldShell>
                <div className="w-[96px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="dscr-payment-currency"
                    value={input.loanPaymentCurrency}
                    onChange={handlePaymentCurrencyChange}
                    aria-label="Loan payment currency"
                  />
                </div>
                <div className="relative w-[88px] shrink-0">
                  <select
                    className={selectClass}
                    value={input.loanPaymentFrequency}
                    aria-label="Loan payment frequency"
                    onChange={(e) =>
                      set({
                        loanPaymentFrequency: e.target.value as MoneyFrequency,
                      })
                    }
                  >
                    {MONEY_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
              {errors.loanPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanPayment}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">NOI calculation</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ noiSectionOpen: !input.noiSectionOpen })}
          aria-expanded={input.noiSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">NOI calculation</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.noiSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.noiSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="dscr-gi">
                <span>Gross income</span>
                <InfoTooltip
                  label="Gross income"
                  text="Monthly (or annual) rent / gross income before vacancy and expenses."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.grossIncome}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {giSymbol}
                  </span>
                  <input
                    id="dscr-gi"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.grossIncome}
                    aria-invalid={Boolean(errors.grossIncome)}
                    onChange={(e) => set({ grossIncome: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[96px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="dscr-gi-currency"
                    value={input.grossIncomeCurrency}
                    onChange={handleGiCurrencyChange}
                    aria-label="Gross income currency"
                  />
                </div>
                <div className="relative w-[88px] shrink-0">
                  <select
                    className={selectClass}
                    value={input.grossIncomeFrequency}
                    aria-label="Gross income frequency"
                    onChange={(e) =>
                      set({
                        grossIncomeFrequency: e.target.value as MoneyFrequency,
                      })
                    }
                  >
                    {MONEY_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
              {errors.grossIncome ? (
                <p className="mt-1 text-xs text-rose-600">{errors.grossIncome}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="dscr-expenses">
                <span>Expenses</span>
              </label>
              <FieldShell error={errors.expensesPercent}>
                <input
                  id="dscr-expenses"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.expensesPercent}
                  aria-invalid={Boolean(errors.expensesPercent)}
                  onChange={(e) => set({ expensesPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.expensesPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.expensesPercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="dscr-vacancy">
                <span>Vacancy</span>
              </label>
              <FieldShell error={errors.vacancyPercent}>
                <input
                  id="dscr-vacancy"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.vacancyPercent}
                  aria-invalid={Boolean(errors.vacancyPercent)}
                  onChange={(e) => set({ vacancyPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.vacancyPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.vacancyPercent}</p>
              ) : null}
              <p className="mt-1 text-[11px] text-muted-foreground">
                NOI = (1 − expenses%) × (1 − vacancy%) × gross income
              </p>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Debt service coverage ratio
        </legend>

        <div>
          <label className={labelClass} htmlFor="dscr-noi">
            <span>NOI (Net operating income)</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.noi}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {noiSymbol}
              </span>
              <input
                id="dscr-noi"
                className={inputClass}
                inputMode="decimal"
                value={input.noi}
                aria-invalid={Boolean(errors.noi)}
                onChange={(e) =>
                  onChange({
                    ...input,
                    noi: e.target.value,
                    noiSource: 'direct',
                  })
                }
              />
            </FieldShell>
            <div className="w-[96px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="dscr-noi-currency"
                value={input.noiCurrency}
                onChange={handleNoiCurrencyChange}
                aria-label="NOI currency"
              />
            </div>
            <div className="relative w-[88px] shrink-0">
              <select
                className={selectClass}
                value={input.noiFrequency}
                aria-label="NOI frequency"
                onChange={(e) =>
                  set({ noiFrequency: e.target.value as MoneyFrequency })
                }
              >
                {MONEY_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
          {errors.noi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.noi}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dscr-result">
            <span>DSCR</span>
            <InfoTooltip
              label="DSCR"
              text="Debt service coverage ratio = monthly NOI ÷ monthly loan payment after converting both amounts into the total-loan currency. Dimensionless; shown with ×."
            />
          </label>
          <FieldShell muted>
            <input
              id="dscr-result"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedDscr : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              ×
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
