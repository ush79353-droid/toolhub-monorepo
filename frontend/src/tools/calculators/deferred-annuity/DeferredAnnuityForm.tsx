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
import {
  DEFERRAL_MODE_OPTIONS,
  KNOW_MODE_OPTIONS,
  type DeferralMode,
  type DeferredAnnuityFieldErrors,
  type DeferredAnnuityInput,
  type DeferredAnnuityResult,
  type KnowMode,
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

interface DeferredAnnuityFormProps {
  input: DeferredAnnuityInput;
  errors: DeferredAnnuityFieldErrors;
  result: DeferredAnnuityResult | null;
  onChange: (input: DeferredAnnuityInput) => void;
  onReset: () => void;
}

export function DeferredAnnuityForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: DeferredAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const lumpSymbol = getCurrencySymbol(input.lumpSumCurrency);
  const contribSymbol = getCurrencySymbol(input.contributionCurrency);
  const withdrawalSymbol = getCurrencySymbol(input.withdrawalCurrency);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);

  const set = (patch: Partial<DeferredAnnuityInput>) => {
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

  const handleLumpCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.lumpSumCurrency) return;
    const nextAmount = convertFieldAmount(input.lumpSum, input.lumpSumCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.contributionCurrency !== next &&
        !canConvertPair(input.contributionCurrency, next)) ||
      (input.withdrawalCurrency !== next &&
        !canConvertPair(input.withdrawalCurrency, next)) ||
      (input.resultCurrency !== next && !canConvertPair(next, input.resultCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, lumpSumCurrency: next, lumpSum: nextAmount });
  };

  const handleContribCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.contributionCurrency) return;
    const nextAmount = convertFieldAmount(
      input.monthlyContribution,
      input.contributionCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      contributionCurrency: next,
      monthlyContribution: nextAmount,
    });
  };

  const handleWithdrawalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.withdrawalCurrency) return;
    const nextAmount = convertFieldAmount(
      input.fixedWithdrawal,
      input.withdrawalCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      withdrawalCurrency: next,
      fixedWithdrawal: nextAmount,
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.resultCurrency) return;
    if (!canConvertPair(input.lumpSumCurrency, next)) {
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
        <div>
          <label className={labelClass} htmlFor="da-know">
            <span>I&apos;d like to know...</span>
          </label>
          <div className="relative">
            <select
              id="da-know"
              className={selectClass}
              value={input.knowMode}
              onChange={(e) => set({ knowMode: e.target.value as KnowMode })}
            >
              {KNOW_MODE_OPTIONS.map((option) => (
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

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.showAdvanced}
            onChange={(e) => set({ showAdvanced: e.target.checked })}
          />
          <span>Show advanced settings</span>
        </label>
        {input.showAdvanced ? (
          <p className="text-xs text-muted-foreground">
            Advanced timing, contribution growth, and compounding options are not
 enabled on this page; calculations use ordinary end-of-month deposits
            and withdrawals with nominal monthly rates.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Deferral (accumulation) phase
        </legend>

        <div>
          <label className={labelClass} htmlFor="da-defer">
            <span>I&apos;d like to defer...</span>
          </label>
          <div className="relative">
            <select
              id="da-defer"
              className={selectClass}
              value={input.deferralMode}
              onChange={(e) => set({ deferralMode: e.target.value as DeferralMode })}
            >
              {DEFERRAL_MODE_OPTIONS.map((option) => (
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

        {input.deferralMode === 'until_date' ? (
          <div>
            <label className={labelClass} htmlFor="da-end">
              <span>End of deferral phase</span>
            </label>
            <FieldShell error={errors.deferralEndDate}>
              <input
                id="da-end"
                type="date"
                className={inputClass}
                value={input.deferralEndDate}
                aria-invalid={Boolean(errors.deferralEndDate)}
                onChange={(e) => set({ deferralEndDate: e.target.value })}
              />
            </FieldShell>
            {errors.deferralEndDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.deferralEndDate}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="da-defer-years">
              <span>Deferral period</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <FieldShell error={errors.deferralYears}>
                <input
                  id="da-defer-years"
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={input.deferralYears}
                  aria-label="Deferral years"
                  onChange={(e) => set({ deferralYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              <FieldShell error={errors.deferralMonths}>
                <input
                  id="da-defer-months"
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={input.deferralMonths}
                  aria-label="Deferral months"
                  onChange={(e) => set({ deferralMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
            {errors.deferralYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.deferralYears}</p>
            ) : null}
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="da-lump">
            <span>Lump sum payment</span>
            <InfoTooltip
              label="Lump sum payment"
              text="Opening balance at the start of the accumulation phase."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.lumpSum}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {lumpSymbol}
              </span>
              <input
                id="da-lump"
                className={inputClass}
                inputMode="decimal"
                value={input.lumpSum}
                aria-invalid={Boolean(errors.lumpSum)}
                onChange={(e) => set({ lumpSum: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="da-lump-currency"
                value={input.lumpSumCurrency}
                onChange={handleLumpCurrencyChange}
                aria-label="Lump sum currency"
              />
            </div>
          </div>
          {errors.lumpSum ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lumpSum}</p>
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
          <label className={labelClass} htmlFor="da-contrib">
            <span>Monthly contribution</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.monthlyContribution}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {contribSymbol}
              </span>
              <input
                id="da-contrib"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyContribution}
                aria-invalid={Boolean(errors.monthlyContribution)}
                onChange={(e) => set({ monthlyContribution: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="da-contrib-currency"
                value={input.contributionCurrency}
                onChange={handleContribCurrencyChange}
                aria-label="Monthly contribution currency"
              />
            </div>
          </div>
          {errors.monthlyContribution ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyContribution}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="da-acc-rate">
            <span>Expected rate of return</span>
          </label>
          <FieldShell error={errors.accumulationRatePercent}>
            <input
              id="da-acc-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.accumulationRatePercent}
              aria-invalid={Boolean(errors.accumulationRatePercent)}
              onChange={(e) => set({ accumulationRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.accumulationRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.accumulationRatePercent}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Payout phase (for withdrawals)
        </legend>

        {input.knowMode === 'withdraw_amount' ? (
          <div>
            <label className={labelClass} htmlFor="da-w-years">
              <span>Length of withdrawals</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <FieldShell error={errors.withdrawalYears}>
                <input
                  id="da-w-years"
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={input.withdrawalYears}
                  aria-label="Withdrawal years"
                  onChange={(e) => set({ withdrawalYears: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              <FieldShell error={errors.withdrawalMonths}>
                <input
                  id="da-w-months"
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={input.withdrawalMonths}
                  aria-label="Withdrawal months"
                  onChange={(e) => set({ withdrawalMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
            {errors.withdrawalYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.withdrawalYears}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="da-fixed-w">
              <span>Monthly withdrawal</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fixedWithdrawal}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {withdrawalSymbol}
                </span>
                <input
                  id="da-fixed-w"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fixedWithdrawal}
                  aria-invalid={Boolean(errors.fixedWithdrawal)}
                  onChange={(e) => set({ fixedWithdrawal: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="da-fixed-w-currency"
                  value={input.withdrawalCurrency}
                  onChange={handleWithdrawalCurrencyChange}
                  aria-label="Monthly withdrawal currency"
                />
              </div>
            </div>
            {errors.fixedWithdrawal ? (
              <p className="mt-1 text-xs text-rose-600">{errors.fixedWithdrawal}</p>
            ) : null}
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="da-pay-rate">
            <span>Expected rate of return</span>
          </label>
          <FieldShell error={errors.payoutRatePercent}>
            <input
              id="da-pay-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.payoutRatePercent}
              aria-invalid={Boolean(errors.payoutRatePercent)}
              onChange={(e) => set({ payoutRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.payoutRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.payoutRatePercent}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm leading-relaxed text-accent" aria-live="polite">
            {result?.summaryText ?? 'Enter values to see your deferred annuity results.'}
          </p>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="da-result-currency"
              value={input.resultCurrency}
              onChange={handleResultCurrencyChange}
              aria-label="Results currency"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              {(
                [
                  ['Balance at 1st withdrawal', result?.formattedBalanceAtFirstWithdrawal],
                  ['Monthly withdrawal', result?.formattedMonthlyWithdrawal],
                  ['Total withdrawal', result?.formattedTotalWithdrawal],
                  ['Total contribution', result?.formattedTotalContribution],
                  ['Total return', result?.formattedTotalReturn],
                  [
                    'Number of withdrawals',
                    result ? String(result.numberOfWithdrawals) : undefined,
                  ],
                  ['Last withdrawal on', result?.lastWithdrawalDateLabel],
                ] as const
              ).map(([label, value]) => (
                <tr key={label} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="bg-muted/30 px-3 py-2.5 text-left text-[13px] font-medium text-muted-foreground"
                  >
                    {label}
                  </th>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-accent">
                    {value
                      ? label.startsWith('Number') || label.startsWith('Last')
                        ? value
                        : `${resultSymbol}${value}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
