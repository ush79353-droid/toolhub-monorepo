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
  formatDebtSnowballApr,
  formatDebtSnowballMoney,
  formatPayoffMonths,
  methodLabel,
} from './calculation';
import {
  AIM_OPTIONS,
  COMPARE_OPTIONS,
  DEBT_COUNT_OPTIONS,
  type DebtSnowballFieldErrors,
  type DebtSnowballInput,
  type DebtSnowballMethod,
  type DebtSnowballResult,
  type DebtSnowballRowInput,
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

interface DebtSnowballFormProps {
  input: DebtSnowballInput;
  errors: DebtSnowballFieldErrors;
  result: DebtSnowballResult | null;
  onChange: (input: DebtSnowballInput) => void;
}

function moneyCell(
  amount: number,
  currency: SupportedCurrency,
  ok: boolean
): string {
  if (!ok) return '—';
  return `${getCurrencySymbol(currency)}${formatDebtSnowballMoney(amount, currency)}`;
}

export function DebtSnowballForm({
  input,
  errors,
  result,
  onChange,
}: DebtSnowballFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<Record<string, boolean>>({
    debt1: true,
    debt2: true,
    debt3: true,
    debt4: true,
    debt5: true,
    debt6: true,
  });
  const tableRef = React.useRef<HTMLDivElement>(null);

  const set = (patch: Partial<DebtSnowballInput>) => {
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

  const updateDebt = (index: number, patch: Partial<DebtSnowballRowInput>) => {
    const debts = input.debts.map((row, i) => (i === index ? { ...row, ...patch } : row));
    set({ debts });
  };

  const handleDebtCurrencyChange = (
    index: number,
    field: 'balanceCurrency' | 'paymentCurrency',
    amountField: 'balance' | 'payment',
    next: SupportedCurrency
  ) => {
    const row = input.debts[index]!;
    if (next === row[field]) return;
    const nextAmount = convertFieldAmount(row[amountField], row[field], next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    updateDebt(index, { [field]: next, [amountField]: nextAmount });
  };

  const handleIncreaseCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.paymentIncreaseCurrency) return;
    const nextAmount = convertFieldAmount(
      input.paymentIncrease,
      input.paymentIncreaseCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ paymentIncreaseCurrency: next, paymentIncrease: nextAmount });
  };

  const handleDisplayCurrencyChange = (
    field: 'totalDebtCurrency' | 'totalPaymentCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    const calcCurrency = input.debts[0]?.balanceCurrency ?? 'PKR';
    if (next !== calcCurrency && !canConvertPair(calcCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    set({ [field]: next });
  };

  const handleDebtCountChange = (count: number) => {
    const debts = [...input.debts];
    while (debts.length < 6) {
      debts.push(emptyDebtRowSafe(input.debts[0]?.balanceCurrency ?? 'PKR'));
    }
    set({ debtCount: count, debts });
  };

  const calcCurrency = result?.calcCurrency ?? input.debts[0]?.balanceCurrency ?? 'PKR';
  const calcSymbol = getCurrencySymbol(calcCurrency);

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const scrollTable = (dir: -1 | 1) => {
    const el = tableRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: 'smooth' });
  };

  const tableMethods: DebtSnowballMethod[] = (() => {
    if (!result) return ['min', 'snowball', 'avalanche'];
    const ordered: DebtSnowballMethod[] = [result.compareWith];
    if (!ordered.includes(result.aimMethod)) ordered.push(result.aimMethod);
    for (const m of ['min', 'snowball', 'avalanche'] as const) {
      if (!ordered.includes(m)) ordered.push(m);
    }
    return ordered;
  })();

  const tableRows = result
    ? tableMethods
        .map((method) => result.rows.find((row) => row.method === method))
        .filter((row): row is NonNullable<typeof row> => Boolean(row))
    : [];

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ds-debt-count">
          Number of debts
        </label>
        <select
          id="ds-debt-count"
          className={selectClass}
          value={input.debtCount}
          onChange={(e) => handleDebtCountChange(Number(e.target.value))}
        >
          {DEBT_COUNT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {input.debts.slice(0, input.debtCount).map((row, index) => {
        const key = `debt${index + 1}`;
        const rowErrors = errors.debts?.[index];
        const balSymbol = getCurrencySymbol(row.balanceCurrency);
        const paySymbol = getCurrencySymbol(row.paymentCurrency);
        const isOpen = open[key] !== false;
        return (
          <div key={key} className="rounded-xl border border-border bg-muted/15">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
              aria-expanded={isOpen}
              onClick={() => toggle(key)}
            >
              <span>Debt #{index + 1}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
                <div>
                  <label className={labelClass} htmlFor={`ds-bal-${index}`}>
                    Balance
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.balance}>
                      <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                        {balSymbol}
                      </span>
                      <input
                        id={`ds-bal-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.balance}
                        aria-invalid={Boolean(rowErrors?.balance)}
                        onChange={(e) => updateDebt(index, { balance: e.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`ds-bal-ccy-${index}`}
                        value={row.balanceCurrency}
                        onChange={(next) =>
                          handleDebtCurrencyChange(index, 'balanceCurrency', 'balance', next)
                        }
                        aria-label={`Debt #${index + 1} balance currency`}
                      />
                    </div>
                  </div>
                  {rowErrors?.balance ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErrors.balance}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`ds-rate-${index}`}>
                    Interest rate
                  </label>
                  <FieldShell error={rowErrors?.interestRatePercent}>
                    <input
                      id={`ds-rate-${index}`}
                      className={`${inputClass} pr-10`}
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
                    <p className="mt-1 text-xs text-rose-600">{rowErrors.interestRatePercent}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`ds-pay-${index}`}>
                    Payment
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.payment}>
                      <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                        {paySymbol}
                      </span>
                      <input
                        id={`ds-pay-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.payment}
                        aria-invalid={Boolean(rowErrors?.payment)}
                        onChange={(e) => updateDebt(index, { payment: e.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`ds-pay-ccy-${index}`}
                        value={row.paymentCurrency}
                        onChange={(next) =>
                          handleDebtCurrencyChange(index, 'paymentCurrency', 'payment', next)
                        }
                        aria-label={`Debt #${index + 1} payment currency`}
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

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Repayment specification
        </legend>

        <div>
          <label className={labelClass} htmlFor="ds-aim">
            <span>My aim</span>
            <InfoTooltip
              label="My aim"
              text="Chooses your primary payoff strategy. Snowball attacks the smallest balance first; avalanche attacks the highest rate; minimum pays only scheduled amounts."
            />
          </label>
          <select
            id="ds-aim"
            className={selectClass}
            value={input.aim}
            onChange={(e) =>
              set({ aim: e.target.value as DebtSnowballInput['aim'] })
            }
          >
            {AIM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ds-total-debt">
            Total debt
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.totalDebtCurrency)}
              </span>
              <input
                id="ds-total-debt"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalDebt : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ds-total-debt-ccy"
                value={input.totalDebtCurrency}
                onChange={(next) => handleDisplayCurrencyChange('totalDebtCurrency', next)}
                aria-label="Total debt currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ds-total-min">
            Total current monthly payment
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.totalPaymentCurrency)}
              </span>
              <input
                id="ds-total-min"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalCurrentMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ds-total-min-ccy"
                value={input.totalPaymentCurrency}
                onChange={(next) => handleDisplayCurrencyChange('totalPaymentCurrency', next)}
                aria-label="Total monthly payment currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ds-increase">
            <span>I can increase the monthly payment by...</span>
            <InfoTooltip
              label="Payment increase"
              text="Extra amount added to the sum of minimums for snowball and avalanche. Minimum-payment comparison still uses only the scheduled minimums."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.paymentIncrease}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.paymentIncreaseCurrency)}
              </span>
              <input
                id="ds-increase"
                className={inputClass}
                inputMode="decimal"
                value={input.paymentIncrease}
                aria-invalid={Boolean(errors.paymentIncrease)}
                onChange={(e) => set({ paymentIncrease: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ds-increase-ccy"
                value={input.paymentIncreaseCurrency}
                onChange={handleIncreaseCurrencyChange}
                aria-label="Payment increase currency"
              />
            </div>
          </div>
          {errors.paymentIncrease ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paymentIncrease}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ds-new-monthly">
            New monthly payment
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.totalPaymentCurrency)}
              </span>
              <input
                id="ds-new-monthly"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedNewMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ds-new-monthly-ccy"
                value={input.totalPaymentCurrency}
                onChange={(next) => handleDisplayCurrencyChange('totalPaymentCurrency', next)}
                aria-label="New monthly payment currency"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {conversionError || ratesStatus.warning ? (
        <p className="text-xs text-amber-700" role="status">
          {conversionError || ratesStatus.warning}
        </p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Payoff summary</legend>

        <div>
          <p className={labelClass}>Compare results with...</p>
          <div className="space-y-2">
            {COMPARE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ds-compare"
                  className="h-4 w-4 accent-primary"
                  checked={input.compareWith === option.value}
                  onChange={() => set({ compareWith: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {result && tableRows.length > 0 ? (
          <div className="space-y-2">
            <div
              ref={tableRef}
              className="overflow-x-auto rounded-lg border border-border bg-white"
            >
              <table className="min-w-[28rem] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[12px] text-muted-foreground">
                    <th className="sticky left-0 z-[1] bg-muted/40 px-3 py-2 font-medium">
                      Metric
                    </th>
                    {tableRows.map((row) => (
                      <th
                        key={row.method}
                        className="px-3 py-2 font-medium whitespace-nowrap"
                      >
                        {methodLabel(row.method)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 font-medium text-accent">
                      APR
                    </td>
                    {tableRows.map((row) => (
                      <td key={`apr-${row.method}`} className="px-3 py-2.5 tabular-nums text-accent">
                        {row.ok && row.aprPercent !== null
                          ? `${formatDebtSnowballApr(row.aprPercent)}${
                              row.aprIsWeightedEstimate ? '*' : ''
                            }`
                          : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 font-medium text-accent">
                      Monthly payment
                    </td>
                    {tableRows.map((row) => (
                      <td
                        key={`pay-${row.method}`}
                        className="px-3 py-2.5 tabular-nums text-accent"
                      >
                        {row.ok
                          ? `${moneyCell(row.monthlyPayment, calcCurrency, true)}${
                              row.method === 'min' ? '**' : ''
                            }`
                          : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 font-medium text-accent">
                      Payoff term
                    </td>
                    {tableRows.map((row) => (
                      <td
                        key={`term-${row.method}`}
                        className="px-3 py-2.5 tabular-nums text-accent"
                      >
                        {row.ok && row.payoffMonths !== null
                          ? formatPayoffMonths(row.payoffMonths)
                          : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 font-medium text-accent">
                      Total payable
                    </td>
                    {tableRows.map((row) => (
                      <td
                        key={`total-${row.method}`}
                        className="px-3 py-2.5 tabular-nums text-accent"
                      >
                        {moneyCell(row.totalPayable, calcCurrency, row.ok)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 font-medium text-accent">
                      Total interest
                    </td>
                    {tableRows.map((row) => (
                      <td
                        key={`int-${row.method}`}
                        className="px-3 py-2.5 tabular-nums text-accent"
                      >
                        {moneyCell(row.totalInterest, calcCurrency, row.ok)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-md border border-border bg-white px-2 py-1 text-xs text-accent hover:bg-muted/30"
                onClick={() => scrollTable(-1)}
                aria-label="Scroll comparison table left"
              >
                ←
              </button>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/2 rounded-full bg-muted-foreground/40" />
              </div>
              <button
                type="button"
                className="rounded-md border border-border bg-white px-2 py-1 text-xs text-accent hover:bg-muted/30"
                onClick={() => scrollTable(1)}
                aria-label="Scroll comparison table right"
              >
                →
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              *We estimate APR using weighted average procedure.
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              **The total monthly payment gradually decreases as the debts are being paid off.
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Comparison amounts use {calcSymbol} (debt #1 balance currency) at full schedule
              precision.
            </p>

            {result.rows.some((row) => !row.ok && row.message) ? (
              <ul className="space-y-1 text-xs text-amber-700">
                {result.rows
                  .filter((row) => !row.ok && row.message)
                  .map((row) => (
                    <li key={row.method}>
                      {row.label}: {row.message}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}

function emptyDebtRowSafe(currency: SupportedCurrency): DebtSnowballRowInput {
  return {
    balance: '',
    balanceCurrency: currency,
    interestRatePercent: '',
    payment: '',
    paymentCurrency: currency,
  };
}
