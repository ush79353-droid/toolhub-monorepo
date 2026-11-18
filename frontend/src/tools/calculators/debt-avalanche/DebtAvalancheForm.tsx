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
import type {
  DebtAvalancheFieldErrors,
  DebtAvalancheInput,
  DebtAvalancheResult,
  DebtCount,
  DebtInputRow,
} from './types';
import { DEBT_COUNT_OPTIONS, ensureDebtRows } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface DebtAvalancheFormProps {
  input: DebtAvalancheInput;
  errors: DebtAvalancheFieldErrors;
  result: DebtAvalancheResult | null;
  onChange: (input: DebtAvalancheInput) => void;
}

export function DebtAvalancheForm({
  input,
  errors,
  result,
  onChange,
}: DebtAvalancheFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [openDebts, setOpenDebts] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const debts = ensureDebtRows(input.debts, input.debtCount);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const set = (patch: Partial<DebtAvalancheInput>) => {
    setConversionError(null);
    onChange({ ...input, debts, ...patch });
  };

  const updateDebt = (index: number, patch: Partial<DebtInputRow>) => {
    setConversionError(null);
    const next = debts.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange({ ...input, debts: next });
  };

  const convertField = (
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

  const handleDebtCountChange = (count: DebtCount) => {
    const nextDebts = ensureDebtRows(debts, count);
    setOpenDebts((prev) => {
      const open = { ...prev };
      for (let i = 0; i < count; i += 1) {
        if (open[i] === undefined) open[i] = true;
      }
      return open;
    });
    set({ debtCount: count, debts: nextDebts });
  };

  const handleBalanceCurrency = (index: number, next: SupportedCurrency) => {
    const row = debts[index]!;
    if (next === row.balanceCurrency) return;
    const converted = convertField(row.balance, row.balanceCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    updateDebt(index, { balanceCurrency: next, balance: converted });
  };

  const handlePaymentCurrency = (index: number, next: SupportedCurrency) => {
    const row = debts[index]!;
    if (next === row.paymentCurrency) return;
    const converted = convertField(row.payment, row.paymentCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    updateDebt(index, { paymentCurrency: next, payment: converted });
  };

  const handleResultCurrency = (next: SupportedCurrency) => {
    if (next === input.resultCurrency) return;
    // Result currency only relabels/re-expresses calculated money; inputs stay as entered.
    // Still require a usable path from any input currency into the result currency.
    for (let i = 0; i < input.debtCount; i += 1) {
      const row = debts[i]!;
      if (
        !canConvertPair(row.balanceCurrency, next) ||
        !canConvertPair(row.paymentCurrency, next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    setConversionError(null);
    onChange({ ...input, debts, resultCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="da-count">
          <span>How many debts do you have?</span>
        </label>
        <select
          id="da-count"
          className={selectClass}
          value={input.debtCount}
          onChange={(e) => handleDebtCountChange(Number(e.target.value) as DebtCount)}
        >
          {DEBT_COUNT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}

      {debts.slice(0, input.debtCount).map((row, index) => {
        const balSymbol = getCurrencySymbol(row.balanceCurrency);
        const paySymbol = getCurrencySymbol(row.paymentCurrency);
        const rowErrors = errors.debts?.[index];
        const open = openDebts[index] !== false;

        return (
          <div
            key={index}
            className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              onClick={() =>
                setOpenDebts((prev) => ({ ...prev, [index]: !open }))
              }
              aria-expanded={open}
            >
              <span className="text-[13px] font-semibold text-accent">
                Debt #{index + 1}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>

            {open ? (
              <div className="mt-3.5 space-y-3.5">
                <div>
                  <label className={labelClass} htmlFor={`da-bal-${index}`}>
                    <span>Balance #{index + 1}</span>
                    <InfoTooltip
                      label={`Balance ${index + 1}`}
                      text="Outstanding principal. Changing currency converts this amount."
                    />
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.balance}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        {balSymbol}
                      </span>
                      <input
                        id={`da-bal-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.balance}
                        aria-invalid={Boolean(rowErrors?.balance)}
                        onChange={(e) =>
                          updateDebt(index, { balance: e.target.value })
                        }
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`da-bal-cur-${index}`}
                        value={row.balanceCurrency}
                        onChange={(c) => handleBalanceCurrency(index, c)}
                        aria-label={`Balance ${index + 1} currency`}
                      />
                    </div>
                  </div>
                  {rowErrors?.balance ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErrors.balance}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`da-rate-${index}`}>
                    <span>Interest rate #{index + 1}</span>
                    <InfoTooltip
                      label={`Interest rate ${index + 1}`}
                      text="Nominal annual percentage rate. Never converted with FX."
                    />
                  </label>
                  <FieldShell error={rowErrors?.interestRatePercent}>
                    <input
                      id={`da-rate-${index}`}
                      className={`${inputClass} pr-8`}
                      inputMode="decimal"
                      value={row.interestRatePercent}
                      aria-invalid={Boolean(rowErrors?.interestRatePercent)}
                      onChange={(e) =>
                        updateDebt(index, { interestRatePercent: e.target.value })
                      }
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </FieldShell>
                  {rowErrors?.interestRatePercent ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {rowErrors.interestRatePercent}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`da-pay-${index}`}>
                    <span>Payment #{index + 1}</span>
                    <InfoTooltip
                      label={`Payment ${index + 1}`}
                      text="Minimum monthly payment. Converted into the total-debt currency before amortization when currencies differ."
                    />
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.payment}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        {paySymbol}
                      </span>
                      <input
                        id={`da-pay-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.payment}
                        aria-invalid={Boolean(rowErrors?.payment)}
                        onChange={(e) =>
                          updateDebt(index, { payment: e.target.value })
                        }
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`da-pay-cur-${index}`}
                        value={row.paymentCurrency}
                        onChange={(c) => handlePaymentCurrency(index, c)}
                        aria-label={`Payment ${index + 1} currency`}
                      />
                    </div>
                  </div>
                  {rowErrors?.payment ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErrors.payment}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Avalanche method effect</h3>

        <div>
          <label className={labelClass} htmlFor="da-total">
            <span>Total debt</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {resultSymbol}
              </span>
              <input
                id="da-total"
                className={inputClass}
                readOnly
                value={result ? result.formattedTotalDebt : ''}
                aria-label="Total debt"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="da-total-currency"
                value={input.resultCurrency}
                onChange={handleResultCurrency}
                aria-label="Total debt currency"
              />
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-2 text-sm leading-relaxed text-accent">
            <p>
              If you turn to the <strong>avalanche repayment method</strong>, you can{' '}
              <strong>
                save {resultSymbol}
                {result.formattedInterestSavings}
              </strong>{' '}
              on interest, and you will pay off your debts{' '}
              <strong>
                {result.monthsSaved} month{result.monthsSaved === 1 ? '' : 's'} earlier
              </strong>{' '}
              than otherwise.
            </p>
            <p>
              To do so, keep the total monthly payment constant by{' '}
              <strong>reallocating the payment amount</strong> to the{' '}
              <strong>debt with the highest interest rate</strong> after paying off one of
              your debts.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter debt balances, rates, and payments to compare avalanche vs. current
            repayment.
          </p>
        )}

        {result ? (
          <div className="space-y-2">
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium" />
                    <th className="px-3 py-2 font-medium">Total current debt</th>
                    <th className="px-3 py-2 font-medium">
                      Total debt [avalanche] method
                    </th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  <tr className="border-b border-border/70">
                    <td className="px-3 py-2 text-muted-foreground">APR</td>
                    <td className="px-3 py-2 text-accent">
                      {result.baseline.formattedApr}
                    </td>
                    <td className="px-3 py-2 text-accent">
                      {result.avalanche.formattedApr}
                    </td>
                  </tr>
                  <tr className="border-b border-border/70">
                    <td className="px-3 py-2 text-muted-foreground">Monthly payment</td>
                    <td className="px-3 py-2 text-accent">
                      {result.baseline.formattedMonthlyPayment}
                    </td>
                    <td className="px-3 py-2 text-accent">
                      {resultSymbol}
                      {result.avalanche.formattedMonthlyPayment}
                    </td>
                  </tr>
                  <tr className="border-b border-border/70">
                    <td className="px-3 py-2 text-muted-foreground">Payoff term</td>
                    <td className="px-3 py-2 text-accent">
                      {result.baseline.formattedPayoffTerm}
                    </td>
                    <td className="px-3 py-2 text-accent">
                      {result.avalanche.formattedPayoffTerm}
                    </td>
                  </tr>
                  <tr className="border-b border-border/70">
                    <td className="px-3 py-2 text-muted-foreground">Total payable</td>
                    <td className="px-3 py-2 text-accent">
                      {resultSymbol}
                      {result.baseline.formattedTotalPayable}
                    </td>
                    <td className="px-3 py-2 text-accent">
                      {resultSymbol}
                      {result.avalanche.formattedTotalPayable}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground">Total interest</td>
                    <td className="px-3 py-2 text-accent">
                      {resultSymbol}
                      {result.baseline.formattedTotalInterest}
                    </td>
                    <td className="px-3 py-2 text-accent">
                      {resultSymbol}
                      {result.avalanche.formattedTotalInterest}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              * For your current debt, without avalanche acceleration, the APR is estimated
              by the weighted average procedure.
            </p>
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </div>
    </form>
  );
}
