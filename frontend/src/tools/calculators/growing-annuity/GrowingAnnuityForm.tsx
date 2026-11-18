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
  annualGrowthFromPeriodic,
  formatGrowingAnnuityPercent,
  periodicGrowthFromAnnual,
} from './calculation';
import {
  ANNUITY_TYPE_OPTIONS,
  DIRECTION_OPTIONS,
  FREQUENCY_OPTIONS,
  SOLVE_FOR_OPTIONS,
  TERM_UNIT_OPTIONS,
  type GrowingAnnuityFieldErrors,
  type GrowingAnnuityInput,
  type GrowingAnnuityResult,
  type AnnuityType,
  type Frequency,
  type PaymentDirection,
  type SolveFor,
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

interface GrowingAnnuityFormProps {
  input: GrowingAnnuityInput;
  errors: GrowingAnnuityFieldErrors;
  result: GrowingAnnuityResult | null;
  onChange: (input: GrowingAnnuityInput) => void;
}

export function GrowingAnnuityForm({ input, errors, result, onChange }: GrowingAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const openingSymbol = getCurrencySymbol(input.initialDepositCurrency);
  const paymentSymbol = getCurrencySymbol(input.annuityAmountCurrency);
  const targetSymbol = getCurrencySymbol(input.targetFinalBalanceCurrency);
  const calcSymbol = result
    ? getCurrencySymbol(result.calcCurrency)
    : openingSymbol;

  const set = (patch: Partial<GrowingAnnuityInput>) => {
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

  const handleCurrencyChange = (
    field: 'initialDeposit' | 'annuityAmount' | 'targetFinalBalance',
    next: SupportedCurrency
  ) => {
    const currencyKey =
      field === 'initialDeposit'
        ? 'initialDepositCurrency'
        : field === 'annuityAmount'
          ? 'annuityAmountCurrency'
          : 'targetFinalBalanceCurrency';
    const valueKey = field;
    if (next === input[currencyKey]) return;

    const amount = parseMoneyInput(input[valueKey]);
    if (!Number.isFinite(amount)) {
      set({ [currencyKey]: next } as Partial<GrowingAnnuityInput>);
      return;
    }
    const converted = convertFieldAmount(amount, input[currencyKey], next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      [currencyKey]: next,
      [valueKey]: moneyAmountToInputString(converted),
    } as Partial<GrowingAnnuityInput>);
  };

  const syncGrowthFromAnnual = (
    annualRaw: string,
    frequency: Frequency,
    extra: Partial<GrowingAnnuityInput> = {}
  ) => {
    const annual = Number(String(annualRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(annual)) {
      set({ ...extra, annualGrowthPercent: annualRaw, growthSource: 'annual' });
      return;
    }
    const periodic = periodicGrowthFromAnnual(annual, frequency);
    set({
      ...extra,
      annualGrowthPercent: annualRaw,
      growthSource: 'annual',
      periodicGrowthPercent:
        periodic === null
          ? input.periodicGrowthPercent
          : formatGrowingAnnuityPercent(periodic * 100),
    });
  };

  const syncGrowthFromPeriodic = (
    periodicRaw: string,
    frequency: Frequency,
    extra: Partial<GrowingAnnuityInput> = {}
  ) => {
    const periodic = Number(String(periodicRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(periodic)) {
      set({
        ...extra,
        periodicGrowthPercent: periodicRaw,
        growthSource: 'periodic',
      });
      return;
    }
    const annual = annualGrowthFromPeriodic(periodic, frequency);
    set({
      ...extra,
      periodicGrowthPercent: periodicRaw,
      growthSource: 'periodic',
      annualGrowthPercent:
        annual === null ? input.annualGrowthPercent : formatGrowingAnnuityPercent(annual),
    });
  };

  const paymentLabel =
    input.direction === 'deposit' ? 'deposit' : 'withdrawal';
  const freqLower = (
    FREQUENCY_OPTIONS.find((o) => o.value === input.paymentFrequency)?.label ??
    'Monthly'
  ).toLowerCase();

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Growing annuity configuration
        </legend>

        <div>
          <p className={labelClass}>
            <span>I&apos;d like to know the...</span>
            <InfoTooltip
              label="Solve for"
              text="Choose which value to solve for. The other main-specification fields are inputs."
            />
          </p>
          <div className="grid gap-2 sm:grid-cols-1">
            {SOLVE_FOR_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ga-solve-for"
                  checked={input.solveFor === opt.value}
                  onChange={() => set({ solveFor: opt.value as SolveFor })}
                  className="accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass}>
            <span>Direction of cash flows</span>
          </p>
          <div className="flex flex-wrap gap-4">
            {DIRECTION_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ga-direction"
                  checked={input.direction === opt.value}
                  onChange={() => set({ direction: opt.value as PaymentDirection })}
                  className="accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ga-pay-freq">
              Annuity payment frequency
            </label>
            <div className="relative">
              <select
                id="ga-pay-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) => {
                  const paymentFrequency = e.target.value as Frequency;
                  if (input.growthSource === 'annual') {
                    syncGrowthFromAnnual(
                      input.annualGrowthPercent,
                      paymentFrequency,
                      { paymentFrequency }
                    );
                  } else {
                    syncGrowthFromPeriodic(
                      input.periodicGrowthPercent,
                      paymentFrequency,
                      { paymentFrequency }
                    );
                  }
                }}
              >
                {FREQUENCY_OPTIONS.map((opt) => (
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

          <div>
            <label className={labelClass} htmlFor="annuity-type">
              Type of annuity
            </label>
            <div className="relative">
              <select
                id="annuity-type"
                className={selectClass}
                value={input.annuityType}
                onChange={(e) => set({ annuityType: e.target.value as AnnuityType })}
              >
                {ANNUITY_TYPE_OPTIONS.map((opt) => (
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

          <div>
            <label className={labelClass} htmlFor="annuity-compound">
              Compounding frequency
            </label>
            <div className="relative">
              <select
                id="annuity-compound"
                className={selectClass}
                value={input.compoundingFrequency}
                onChange={(e) =>
                  set({ compoundingFrequency: e.target.value as Frequency })
                }
              >
                {FREQUENCY_OPTIONS.map((opt) => (
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
        </div>

        <div>
          <label className={labelClass} htmlFor="annuity-start">
            First period starts from...
          </label>
          <FieldShell error={errors.startDate}>
            <input
              id="annuity-start"
              type="date"
              className={inputClass}
              value={input.startDate}
              aria-invalid={Boolean(errors.startDate)}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </FieldShell>
          {errors.startDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Main specifications
        </legend>

        {input.solveFor !== 'initialDeposit' ? (
          <div>
            <label className={labelClass} htmlFor="annuity-opening">
              Initial deposit
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.initialDeposit}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {openingSymbol}
                </span>
                <input
                  id="annuity-opening"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.initialDeposit}
                  aria-invalid={Boolean(errors.initialDeposit)}
                  onChange={(e) => set({ initialDeposit: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="annuity-opening-currency"
                  value={input.initialDepositCurrency}
                  onChange={(next) => handleCurrencyChange('initialDeposit', next)}
                  aria-label="Initial deposit currency"
                />
              </div>
            </div>
            {errors.initialDeposit ? (
              <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
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
        ) : null}

        {input.solveFor !== 'finalBalance' ? (
          <div>
            <label className={labelClass} htmlFor="annuity-target-fv">
              Final balance
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.targetFinalBalance}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {targetSymbol}
                </span>
                <input
                  id="annuity-target-fv"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.targetFinalBalance}
                  aria-invalid={Boolean(errors.targetFinalBalance)}
                  onChange={(e) => set({ targetFinalBalance: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="annuity-target-currency"
                  value={input.targetFinalBalanceCurrency}
                  onChange={(next) =>
                    handleCurrencyChange('targetFinalBalance', next)
                  }
                  aria-label="Final balance currency"
                />
              </div>
            </div>
            {errors.targetFinalBalance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetFinalBalance}</p>
            ) : null}
          </div>
        ) : null}

        {input.solveFor !== 'annuityAmount' ? (
          <div>
            <label className={labelClass} htmlFor="annuity-pmt">
              Annuity amount
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.annuityAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {paymentSymbol}
                </span>
                <input
                  id="annuity-pmt"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annuityAmount}
                  aria-invalid={Boolean(errors.annuityAmount)}
                  onChange={(e) => set({ annuityAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="annuity-pmt-currency"
                  value={input.annuityAmountCurrency}
                  onChange={(next) => handleCurrencyChange('annuityAmount', next)}
                  aria-label="Annuity amount currency"
                />
              </div>
            </div>
            {errors.annuityAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annuityAmount}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="ga-length">
            Length of annuity
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.length}>
              <input
                id="ga-length"
                className={inputClass}
                inputMode="decimal"
                value={input.length}
                aria-invalid={Boolean(errors.length)}
                onChange={(e) => set({ length: e.target.value })}
              />
            </FieldShell>
            <div className="relative w-[96px] shrink-0">
              <select
                className={selectClass}
                value={input.lengthUnit}
                aria-label="Length unit"
                onChange={(e) => set({ lengthUnit: e.target.value as TermUnit })}
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
          {errors.length ? (
            <p className="mt-1 text-xs text-rose-600">{errors.length}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ga-rate">
            Rate of return
          </label>
          <FieldShell error={errors.rateOfReturnPercent}>
            <input
              id="ga-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.rateOfReturnPercent}
              aria-invalid={Boolean(errors.rateOfReturnPercent)}
              onChange={(e) => set({ rateOfReturnPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.rateOfReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rateOfReturnPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="annuity-annual-growth">
            Annual growth rate
          </label>
          <FieldShell error={errors.annualGrowthPercent}>
            <input
              id="annuity-annual-growth"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualGrowthPercent}
              aria-invalid={Boolean(errors.annualGrowthPercent)}
              onChange={(e) =>
                syncGrowthFromAnnual(e.target.value, input.paymentFrequency)
              }
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualGrowthPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualGrowthPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="annuity-periodic-growth">
            Periodic growth rate
          </label>
          <FieldShell error={errors.periodicGrowthPercent}>
            <input
              id="annuity-periodic-growth"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.periodicGrowthPercent}
              aria-invalid={Boolean(errors.periodicGrowthPercent)}
              onChange={(e) =>
                syncGrowthFromPeriodic(e.target.value, input.paymentFrequency)
              }
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.periodicGrowthPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periodicGrowthPercent}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <>
            <p className="text-sm leading-relaxed text-accent">{result.summaryText}</p>
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted-foreground">Opening balance</td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {calcSymbol}
                      {result.formattedOpeningBalance}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-semibold text-accent">Final balance</td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-accent">
                      {calcSymbol}
                      {result.formattedFinalBalance}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted-foreground">
                      {result.paymentFrequencyLabel} {paymentLabel} initially
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {calcSymbol}
                      {result.formattedPeriodicPayment}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted-foreground">
                      Total {paymentLabel}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {calcSymbol}
                      {result.formattedTotalPayments}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted-foreground">Total return</td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {calcSymbol}
                      {result.formattedTotalReturn}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 text-muted-foreground">
                      Number of {paymentLabel}s
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {result.numberOfPayments}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground">
                      Last {paymentLabel} on
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-accent">
                      {result.lastPaymentDateLabel}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {freqLower} schedule · amounts normalized into the initial-deposit currency
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter the main specifications to see annuity results.
          </p>
        )}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
