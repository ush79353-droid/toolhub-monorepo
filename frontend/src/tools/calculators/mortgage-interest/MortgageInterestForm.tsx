'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
import { formatMortgageInterestMoney } from './calculation';
import { MortgageInterestChart } from './MortgageInterestChart';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  MORTGAGE_TYPE_OPTIONS,
  REPAYMENT_PRESENTATION_OPTIONS,
  TERM_UNIT_OPTIONS,
  type CompoundingFrequency,
  type MortgageInterestFieldErrors,
  type MortgageInterestInput,
  type MortgageInterestResult,
  type MortgageType,
  type RepaymentPresentation,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface MortgageInterestFormProps {
  input: MortgageInterestInput;
  errors: MortgageInterestFieldErrors;
  result: MortgageInterestResult | null;
  onChange: (input: MortgageInterestInput) => void;
  onReset: () => void;
}

export function MortgageInterestForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MortgageInterestFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const principalSymbol = getCurrencySymbol(input.principalCurrency);
  const feeSymbol = getCurrencySymbol(input.upfrontFeeCurrency);
  const annualSymbol = getCurrencySymbol(input.annualFeeCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentCurrency);
  const interestSymbol = getCurrencySymbol(input.interestCurrency);
  const totalSymbol = getCurrencySymbol(input.totalCurrency);

  const showChart =
    input.repaymentPresentation === 'chart' || input.repaymentPresentation === 'both';
  const showSchedule =
    input.repaymentPresentation === 'schedule' ||
    input.repaymentPresentation === 'both';

  const set = (patch: Partial<MortgageInterestInput>) => {
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

  const handlePrincipalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.principalCurrency) return;
    const nextAmount = convertFieldAmount(
      input.principal,
      input.principalCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.upfrontFeeCurrency !== next &&
        !canConvertPair(input.upfrontFeeCurrency, next)) ||
      (input.annualFeeCurrency !== next &&
        !canConvertPair(input.annualFeeCurrency, next)) ||
      (input.paymentCurrency !== next && !canConvertPair(next, input.paymentCurrency)) ||
      (input.interestCurrency !== next &&
        !canConvertPair(next, input.interestCurrency)) ||
      (input.totalCurrency !== next && !canConvertPair(next, input.totalCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, principalCurrency: next, principal: nextAmount });
  };

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.upfrontFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.upfrontFee,
      input.upfrontFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, upfrontFeeCurrency: next, upfrontFee: nextAmount });
  };

  const handleAnnualCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.annualFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.annualFee,
      input.annualFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, annualFeeCurrency: next, annualFee: nextAmount });
  };

  const handleResultCurrencyChange = (
    field: 'paymentCurrency' | 'interestCurrency' | 'totalCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.principalCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Inputs</legend>

        <div>
          <label className={labelClass} htmlFor="mi-principal">
            <span>Mortgage principal</span>
            <InfoTooltip
              label="Mortgage principal"
              text="Outstanding mortgage principal used for payment, interest, and APR calculations."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.principal}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {principalSymbol}
              </span>
              <input
                id="mi-principal"
                className={inputClass}
                inputMode="decimal"
                value={input.principal}
                aria-invalid={Boolean(errors.principal)}
                onChange={(e) => set({ principal: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mi-principal-currency"
                value={input.principalCurrency}
                onChange={handlePrincipalCurrencyChange}
                aria-label="Mortgage principal currency"
              />
            </div>
          </div>
          {errors.principal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
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
          <label className={labelClass} htmlFor="mi-term">
            <span>Mortgage term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageTerm}>
              <input
                id="mi-term"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageTerm}
                aria-invalid={Boolean(errors.mortgageTerm)}
                onChange={(e) => set({ mortgageTerm: e.target.value })}
              />
            </FieldShell>
            <div className="relative w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="mi-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Mortgage term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                {TERM_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
          {errors.mortgageTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate. Converted to a monthly period rate using the selected compounding frequency. Not FX-converted."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="mi-rate"
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
          <span className={labelClass} id="mi-compounding-label">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="How the lender compounds the annual rate into the monthly period rate used for payments."
            />
          </span>
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-labelledby="mi-compounding-label"
          >
            {COMPOUNDING_FREQUENCY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="mi-compounding"
                  className="h-4 w-4 accent-primary"
                  checked={input.compounding === option.value}
                  onChange={() =>
                    set({ compounding: option.value as CompoundingFrequency })
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
              checked={input.addFees}
              onChange={(e) => set({ addFees: e.target.checked })}
            />
            I want to add more applicable fees
          </label>
        </div>

        {input.addFees ? (
          <div className="space-y-3.5 rounded-lg border border-border bg-white/70 p-3">
            <div>
              <label className={labelClass} htmlFor="mi-points">
                <span>Mortgage points</span>
                <InfoTooltip
                  label="Mortgage points"
                  text="Upfront cost as a percent of principal. Points cost = principal × points% / 100."
                />
              </label>
              <FieldShell error={errors.mortgagePointsPercent}>
                <input
                  id="mi-points"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.mortgagePointsPercent}
                  aria-invalid={Boolean(errors.mortgagePointsPercent)}
                  onChange={(e) => set({ mortgagePointsPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.mortgagePointsPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.mortgagePointsPercent}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="mi-upfront">
                <span>Up-front fee</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.upfrontFee}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {feeSymbol}
                  </span>
                  <input
                    id="mi-upfront"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.upfrontFee}
                    aria-invalid={Boolean(errors.upfrontFee)}
                    onChange={(e) => set({ upfrontFee: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mi-upfront-currency"
                    value={input.upfrontFeeCurrency}
                    onChange={handleFeeCurrencyChange}
                    aria-label="Up-front fee currency"
                  />
                </div>
              </div>
              {errors.upfrontFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.upfrontFee}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="mi-annual">
                <span>Annual fee</span>
                <InfoTooltip
                  label="Annual fee"
                  text="Yearly mortgage cost spread monthly into the payment and fee-adjusted APR."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.annualFee}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {annualSymbol}
                  </span>
                  <input
                    id="mi-annual"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.annualFee}
                    aria-invalid={Boolean(errors.annualFee)}
                    onChange={(e) => set({ annualFee: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mi-annual-currency"
                    value={input.annualFeeCurrency}
                    onChange={handleAnnualCurrencyChange}
                    aria-label="Annual fee currency"
                  />
                </div>
              </div>
              {errors.annualFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualFee}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="mi-type">
            <span>Mortgage type</span>
            <InfoTooltip
              label="Mortgage type"
              text="Fixed-rate only. Adjustable-rate formulas are not invented on this page."
            />
          </label>
          <div className="relative">
            <select
              id="mi-type"
              className={selectClass}
              value={input.mortgageType}
              onChange={(e) =>
                set({ mortgageType: e.target.value as MortgageType })
              }
            >
              {MORTGAGE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="mi-payment">
            <span>Monthly payment</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {paymentSymbol}
              </span>
              <input
                id="mi-payment"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mi-payment-currency"
                value={input.paymentCurrency}
                onChange={(next) => handleResultCurrencyChange('paymentCurrency', next)}
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-interest">
            <span>Mortgage interest</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {interestSymbol}
              </span>
              <input
                id="mi-interest"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMortgageInterest : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mi-interest-currency"
                value={input.interestCurrency}
                onChange={(next) => handleResultCurrencyChange('interestCurrency', next)}
                aria-label="Mortgage interest currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-apr">
            <span>APR (Annual percentage rate)</span>
            <InfoTooltip
              label="APR (Annual percentage rate)"
              text="Fee-adjusted annual percentage rate from net loan proceeds versus monthly cash flows. Not the same as the nominal interest rate when fees apply."
            />
          </label>
          <FieldShell muted>
            <input
              id="mi-apr"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedApr : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-total">
            <span>Total payments</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalSymbol}
              </span>
              <input
                id="mi-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPayments : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mi-total-currency"
                value={input.totalCurrency}
                onChange={(next) => handleResultCurrencyChange('totalCurrency', next)}
                aria-label="Total payments currency"
              />
            </div>
          </div>
        </div>

        <div>
          <span className={labelClass} id="mi-presentation-label">
            Represent…
          </span>
          <div
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4"
            role="radiogroup"
            aria-labelledby="mi-presentation-label"
          >
            {REPAYMENT_PRESENTATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="mi-presentation"
                  className="h-4 w-4 accent-primary"
                  checked={input.repaymentPresentation === option.value}
                  onChange={() =>
                    set({
                      repaymentPresentation: option.value as RepaymentPresentation,
                    })
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mi-schedule-from">
            <span>Schedule from…</span>
          </label>
          <FieldShell error={errors.scheduleFrom}>
            <input
              id="mi-schedule-from"
              type="date"
              className={inputClass}
              value={input.scheduleFrom}
              aria-invalid={Boolean(errors.scheduleFrom)}
              onChange={(e) => set({ scheduleFrom: e.target.value })}
            />
          </FieldShell>
          {errors.scheduleFrom ? (
            <p className="mt-1 text-xs text-rose-600">{errors.scheduleFrom}</p>
          ) : null}
        </div>

        {result && showChart ? (
          <MortgageInterestChart
            points={result.chartPoints}
            currency={result.loanCurrency}
          />
        ) : null}

        {result && showSchedule ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-accent">Amortization schedule</h3>
            <div className="brand-scroll max-h-[320px] overflow-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="sticky top-0 bg-muted/90 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                  <tr>
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Payment</th>
                    <th className="px-3 py-2 font-medium">Principal</th>
                    <th className="px-3 py-2 font-medium">Interest</th>
                    <th className="px-3 py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr
                      key={row.paymentNumber}
                      className="border-t border-border/70 hover:bg-muted/30"
                    >
                      <td className="px-3 py-2 tabular-nums text-accent">
                        {row.paymentNumber}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-accent">{row.date}</td>
                      <td className="px-3 py-2 tabular-nums text-accent">
                        {formatMortgageInterestMoney(row.payment, result.loanCurrency)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-accent">
                        {formatMortgageInterestMoney(row.principal, result.loanCurrency)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-accent">
                        {formatMortgageInterestMoney(row.interest, result.loanCurrency)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-accent">
                        {formatMortgageInterestMoney(row.balance, result.loanCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!result ? (
          <p className="text-sm text-muted-foreground">
            Enter valid mortgage inputs to see payment, interest, APR, and repayment charts.
          </p>
        ) : null}
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
