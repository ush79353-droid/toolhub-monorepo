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
  ANNUITY_TYPE_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
  PAYOUT_MODE_OPTIONS,
  type AnnuityPayoutFieldErrors,
  type AnnuityPayoutInput,
  type AnnuityPayoutResult,
  type AnnuityType,
  type PayoutFrequency,
  type PayoutMode,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface AnnuityPayoutFormProps {
  input: AnnuityPayoutInput;
  errors: AnnuityPayoutFieldErrors;
  result: AnnuityPayoutResult | null;
  onChange: (input: AnnuityPayoutInput) => void;
}

export function AnnuityPayoutForm({
  input,
  errors,
  result,
  onChange,
}: AnnuityPayoutFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [specsOpen, setSpecsOpen] = React.useState(true);

  const balanceSymbol = getCurrencySymbol(input.initialBalanceCurrency);
  const paymentSymbol = getCurrencySymbol(input.paymentAmountCurrency);
  const finalSymbol = getCurrencySymbol(input.finalBalanceCurrency);

  const set = (patch: Partial<AnnuityPayoutInput>) => {
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

  const convertField = (
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

  const handleBalanceCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.initialBalanceCurrency) return;
    const nextAmount = convertField(
      input.initialBalance,
      input.initialBalanceCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      initialBalanceCurrency: next,
      initialBalance: nextAmount,
    });
  };

  const handlePaymentCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.paymentAmountCurrency) return;
    const nextAmount = convertField(
      input.paymentAmount,
      input.paymentAmountCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      paymentAmountCurrency: next,
      paymentAmount: nextAmount,
    });
  };

  const handleFinalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.finalBalanceCurrency) return;
    const nextAmount = convertField(
      input.finalBalance,
      input.finalBalanceCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      finalBalanceCurrency: next,
      finalBalance: nextAmount,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Annuity payout option
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Annuity payout option">
          {PAYOUT_MODE_OPTIONS.map((opt) => {
            const active = input.mode === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'border-primary/40 bg-primary/5 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:bg-muted/20'
                }`}
              >
                <input
                  type="radio"
                  name="annuity-payout-mode"
                  className="h-4 w-4 accent-primary"
                  checked={active}
                  onChange={() => set({ mode: opt.value as PayoutMode })}
                />
                <span className="font-medium text-accent">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-accent"
            aria-expanded={specsOpen}
            onClick={() => setSpecsOpen((open) => !open)}
          >
            <span
              className={`inline-block transition-transform ${specsOpen ? 'rotate-90' : ''}`}
              aria-hidden="true"
            >
              ▸
            </span>
            Main specifications
          </button>
        </legend>

        {specsOpen ? (
          <>
            <div>
              <label className={labelClass} htmlFor="ap-balance">
                <span>Initial balance</span>
                <InfoTooltip
                  label="Initial balance"
                  text="Present value of the annuity at the start. Changing currency converts this amount."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.initialBalance}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {balanceSymbol}
                  </span>
                  <input
                    id="ap-balance"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.initialBalance}
                    aria-invalid={Boolean(errors.initialBalance)}
                    onChange={(e) => set({ initialBalance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ap-balance-currency"
                    value={input.initialBalanceCurrency}
                    onChange={handleBalanceCurrencyChange}
                    aria-label="Initial balance currency"
                  />
                </div>
              </div>
              {errors.initialBalance ? (
                <p className="mt-1 text-xs text-rose-600">{errors.initialBalance}</p>
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
              <label className={labelClass} htmlFor="ap-frequency">
                <span>Payout frequency</span>
                <InfoTooltip
                  label="Payout frequency"
                  text="How often withdrawals are taken. Also sets the default period rate when advanced compounding is off."
                />
              </label>
              <select
                id="ap-frequency"
                className={selectClass}
                value={input.payoutFrequency}
                onChange={(e) =>
                  set({ payoutFrequency: e.target.value as PayoutFrequency })
                }
              >
                {PAYOUT_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="ap-type">
                <span>Type of annuity</span>
                <InfoTooltip
                  label="Type of annuity"
                  text="Ordinary = end of each period. Due = beginning of each period."
                />
              </label>
              <select
                id="ap-type"
                className={selectClass}
                value={input.annuityType}
                onChange={(e) =>
                  set({ annuityType: e.target.value as AnnuityType })
                }
              >
                {ANNUITY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {input.mode === 'fixedLength' ? (
              <div>
                <span className={labelClass}>
                  Length of annuity
                  <InfoTooltip
                    label="Length of annuity"
                    text="Withdrawal term in whole years and months (0–11)."
                  />
                </span>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <FieldShell error={errors.lengthYears}>
                      <input
                        id="ap-years"
                        className={`${inputClass} pr-12`}
                        inputMode="numeric"
                        value={input.lengthYears}
                        aria-label="Length years"
                        aria-invalid={Boolean(errors.lengthYears)}
                        onChange={(e) => set({ lengthYears: e.target.value })}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        yrs
                      </span>
                    </FieldShell>
                  </div>
                  <div className="min-w-0 flex-1">
                    <FieldShell error={errors.lengthMonths}>
                      <input
                        id="ap-months"
                        className={`${inputClass} pr-12`}
                        inputMode="numeric"
                        value={input.lengthMonths}
                        aria-label="Length months"
                        aria-invalid={Boolean(errors.lengthMonths)}
                        onChange={(e) => set({ lengthMonths: e.target.value })}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        mos
                      </span>
                    </FieldShell>
                  </div>
                </div>
                {errors.lengthYears ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.lengthYears}</p>
                ) : null}
                {errors.lengthMonths ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.lengthMonths}</p>
                ) : null}
              </div>
            ) : (
              <div>
                <label className={labelClass} htmlFor="ap-payment">
                  <span>Payment amount</span>
                  <InfoTooltip
                    label="Payment amount"
                    text="Fixed withdrawal each payout period. Changing currency converts this amount."
                  />
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.paymentAmount}>
                    <span
                      className="shrink-0 pl-3 text-sm text-muted-foreground"
                      aria-hidden="true"
                    >
                      {paymentSymbol}
                    </span>
                    <input
                      id="ap-payment"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.paymentAmount}
                      aria-invalid={Boolean(errors.paymentAmount)}
                      onChange={(e) => set({ paymentAmount: e.target.value })}
                    />
                  </FieldShell>
                  <div className="w-[110px] shrink-0 sm:w-[120px]">
                    <CurrencySelect
                      id="ap-payment-currency"
                      value={input.paymentAmountCurrency}
                      onChange={handlePaymentCurrencyChange}
                      aria-label="Payment amount currency"
                    />
                  </div>
                </div>
                {errors.paymentAmount ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.paymentAmount}</p>
                ) : null}
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="ap-rate">
                <span>Annuity rate</span>
                <InfoTooltip
                  label="Annuity rate"
                  text="Annual interest rate as a percent. Without advanced settings, period rate uses (1+i)^(1/k)−1."
                />
              </label>
              <FieldShell error={errors.annualRatePercent}>
                <input
                  id="ap-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.annualRatePercent}
                  aria-invalid={Boolean(errors.annualRatePercent)}
                  onChange={(e) => set({ annualRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualRatePercent}</p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-primary"
                checked={input.setAdvanced}
                onChange={(e) => set({ setAdvanced: e.target.checked })}
              />
              <span>Set final balance, growth and compounding</span>
            </label>

            {input.setAdvanced ? (
              <div className="space-y-3.5 border-t border-border pt-3.5">
                <div>
                  <label className={labelClass} htmlFor="ap-compounding">
                    <span>Compounding frequency</span>
                    <InfoTooltip
                      label="Compounding frequency"
                      text="When set, period rate uses (1 + i/m)^(m/k) − 1."
                    />
                  </label>
                  <select
                    id="ap-compounding"
                    className={selectClass}
                    value={input.compoundingFrequency}
                    onChange={(e) =>
                      set({
                        compoundingFrequency: e.target.value as PayoutFrequency,
                      })
                    }
                  >
                    {PAYOUT_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="ap-final">
                    <span>Final balance</span>
                    <InfoTooltip
                      label="Final balance"
                      text="Target ending balance after the last payout. Independent currency; converts on change."
                    />
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={errors.finalBalance}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden="true"
                      >
                        {finalSymbol}
                      </span>
                      <input
                        id="ap-final"
                        className={inputClass}
                        inputMode="decimal"
                        value={input.finalBalance}
                        aria-invalid={Boolean(errors.finalBalance)}
                        onChange={(e) => set({ finalBalance: e.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id="ap-final-currency"
                        value={input.finalBalanceCurrency}
                        onChange={handleFinalCurrencyChange}
                        aria-label="Final balance currency"
                      />
                    </div>
                  </div>
                  {errors.finalBalance ? (
                    <p className="mt-1 text-xs text-rose-600">{errors.finalBalance}</p>
                  ) : null}
                </div>

                {input.mode === 'fixedLength' ? (
                  <div>
                    <label className={labelClass} htmlFor="ap-growth">
                      <span>Annual growth rate</span>
                      <InfoTooltip
                        label="Annual growth rate"
                        text="Annual growth of the withdrawal amount. Converted to a periodic growth rate for the payout frequency."
                      />
                    </label>
                    <FieldShell error={errors.annualGrowthPercent}>
                      <input
                        id="ap-growth"
                        className={`${inputClass} pr-8`}
                        inputMode="decimal"
                        value={input.annualGrowthPercent}
                        aria-invalid={Boolean(errors.annualGrowthPercent)}
                        onChange={(e) =>
                          set({ annualGrowthPercent: e.target.value })
                        }
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </FieldShell>
                    {errors.annualGrowthPercent ? (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.annualGrowthPercent}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </fieldset>

      <fieldset className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <div className="space-y-2 text-sm leading-relaxed text-accent" aria-live="polite">
            <p>
              {result.mode === 'fixedLength' ? (
                <>
                  You can withdraw{' '}
                  <strong className="font-semibold">
                    {result.currency}
                    {result.formattedPayment}
                  </strong>{' '}
                  at the{' '}
                  <strong className="font-semibold">
                    {result.annuityType === 'due' ? 'beginning' : 'end'} of each{' '}
                    {
                      PAYOUT_FREQUENCY_OPTIONS.find(
                        (o) => o.value === result.payoutFrequency
                      )?.periodNoun
                    }
                  </strong>
                  {Math.abs(result.finalBalance) < 0.005
                    ? ' to deplete your initial balance.'
                    : `, leaving a final balance of ${result.currency}${result.formattedFinalBalance}.`}
                </>
              ) : (
                <>
                  Withdrawing{' '}
                  <strong className="font-semibold">
                    {result.currency}
                    {result.formattedPayment}
                  </strong>{' '}
                  at the{' '}
                  <strong className="font-semibold">
                    {result.annuityType === 'due' ? 'beginning' : 'end'} of each{' '}
                    {
                      PAYOUT_FREQUENCY_OPTIONS.find(
                        (o) => o.value === result.payoutFrequency
                      )?.periodNoun
                    }
                  </strong>
                  , your annuity lasts{' '}
                  <strong className="font-semibold">
                    {result.durationYears} yrs and {result.durationMonths} mos
                  </strong>
                  {Math.abs(result.finalBalance) < 0.005
                    ? '.'
                    : `, leaving ${result.currency}${result.formattedFinalBalance}.`}
                </>
              )}
            </p>
            <p>
              The <strong className="font-semibold">total interest</strong> earned on the
              annuity is{' '}
              <strong className="font-semibold">
                {result.currency}
                {result.formattedTotalInterest}
              </strong>
              .
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid inputs to see payout results.
          </p>
        )}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
