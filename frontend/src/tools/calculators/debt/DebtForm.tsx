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
  formatDebtApr,
  formatDebtMoney,
  formatPayoffMonths,
} from './calculation';
import {
  DEBT_COUNT_OPTIONS,
  createDefaultInput,
  emptyDebtRow,
  type DebtCalculatorFieldErrors,
  type DebtCalculatorInput,
  type DebtCalculatorResult,
  type DebtRowInput,
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

interface DebtFormProps {
  input: DebtCalculatorInput;
  errors: DebtCalculatorFieldErrors;
  result: DebtCalculatorResult | null;
  onChange: (input: DebtCalculatorInput) => void;
  onReset: () => void;
}

export function DebtForm({ input, errors, result, onChange, onReset }: DebtFormProps) {
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
    consolidation: true,
  });
  const defaults = createDefaultInput();

  const set = (patch: Partial<DebtCalculatorInput>) => {
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

  const updateDebt = (index: number, patch: Partial<DebtRowInput>) => {
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

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.prepaidFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.prepaidFee,
      input.prepaidFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ prepaidFeeCurrency: next, prepaidFee: nextAmount });
  };

  const handleResultCurrencyChange = (
    field: 'totalDebtCurrency' | 'monthlyPaymentCurrency',
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
      debts.push(emptyDebtRow(input.debts[0]?.balanceCurrency ?? 'PKR'));
    }
    set({ debtCount: count, debts });
  };

  const dirty =
    JSON.stringify(input) !== JSON.stringify(defaults);

  const calcSymbol = getCurrencySymbol(result?.calcCurrency ?? input.debts[0]?.balanceCurrency ?? 'PKR');
  const totalSymbol = getCurrencySymbol(input.totalDebtCurrency);
  const monthlySymbol = getCurrencySymbol(input.monthlyPaymentCurrency);

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="debt-count">
          Number of debts
        </label>
        <select
          id="debt-count"
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
                  <label className={labelClass} htmlFor={`debt-bal-${index}`}>
                    Balance #{index + 1}
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.balance}>
                      <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                        {balSymbol}
                      </span>
                      <input
                        id={`debt-bal-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.balance}
                        aria-invalid={Boolean(rowErrors?.balance)}
                        onChange={(e) => updateDebt(index, { balance: e.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`debt-bal-ccy-${index}`}
                        value={row.balanceCurrency}
                        onChange={(next) =>
                          handleDebtCurrencyChange(index, 'balanceCurrency', 'balance', next)
                        }
                        aria-label={`Balance #${index + 1} currency`}
                      />
                    </div>
                  </div>
                  {rowErrors?.balance ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErrors.balance}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`debt-rate-${index}`}>
                    Interest rate #{index + 1}
                  </label>
                  <FieldShell error={rowErrors?.interestRatePercent}>
                    <input
                      id={`debt-rate-${index}`}
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
                  <label className={labelClass} htmlFor={`debt-pay-${index}`}>
                    Payment #{index + 1}
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={rowErrors?.payment}>
                      <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                        {paySymbol}
                      </span>
                      <input
                        id={`debt-pay-${index}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={row.payment}
                        aria-invalid={Boolean(rowErrors?.payment)}
                        onChange={(e) => updateDebt(index, { payment: e.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`debt-pay-ccy-${index}`}
                        value={row.paymentCurrency}
                        onChange={(next) =>
                          handleDebtCurrencyChange(index, 'paymentCurrency', 'payment', next)
                        }
                        aria-label={`Payment #${index + 1} currency`}
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

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={open.consolidation !== false}
          onClick={() => toggle('consolidation')}
        >
          <span>Consolidation loan</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              open.consolidation !== false ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {open.consolidation !== false ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
            <div>
              <label className={labelClass} htmlFor="debt-consol-rate">
                <span>Interest rate</span>
                <InfoTooltip
                  label="Consolidation interest rate"
                  text="Nominal annual rate on the consolidation loan that replaces the listed debts."
                />
              </label>
              <FieldShell error={errors.consolidationRatePercent}>
                <input
                  id="debt-consol-rate"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.consolidationRatePercent}
                  aria-invalid={Boolean(errors.consolidationRatePercent)}
                  onChange={(e) => set({ consolidationRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.consolidationRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.consolidationRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="debt-fee">
                <span>Prepaid fee</span>
                <InfoTooltip
                  label="Prepaid fee"
                  text="Upfront fee paid to originate the consolidation loan. It reduces net funds advanced for APR and is not added again to principal."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.prepaidFee}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {getCurrencySymbol(input.prepaidFeeCurrency)}
                  </span>
                  <input
                    id="debt-fee"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.prepaidFee}
                    aria-invalid={Boolean(errors.prepaidFee)}
                    onChange={(e) => set({ prepaidFee: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="debt-fee-ccy"
                    value={input.prepaidFeeCurrency}
                    onChange={handleFeeCurrencyChange}
                    aria-label="Prepaid fee currency"
                  />
                </div>
              </div>
              {errors.prepaidFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.prepaidFee}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {conversionError || ratesStatus.warning ? (
        <p className="text-xs text-amber-700" role="status">
          {conversionError || ratesStatus.warning}
        </p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Debt summary</legend>

        <div>
          <label className={labelClass} htmlFor="debt-total">
            Total debt
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalSymbol}
              </span>
              <input
                id="debt-total"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalDebt : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="debt-total-ccy"
                value={input.totalDebtCurrency}
                onChange={(next) => handleResultCurrencyChange('totalDebtCurrency', next)}
                aria-label="Total debt currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="debt-monthly">
            <span>Monthly payment</span>
            <InfoTooltip
              label="Monthly payment"
              text="Sum of the scheduled payments across your debts. Strategies keep this combined budget constant and redirect freed amounts when a debt is paid off."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {monthlySymbol}
              </span>
              <input
                id="debt-monthly"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyPayment : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="debt-monthly-ccy"
                value={input.monthlyPaymentCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('monthlyPaymentCurrency', next)
                }
                aria-label="Monthly payment currency"
              />
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-2">
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="min-w-[28rem] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[12px] text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Method</th>
                    <th className="px-3 py-2 font-medium">APR</th>
                    <th className="px-3 py-2 font-medium">Interest</th>
                    <th className="px-3 py-2 font-medium">Payoff</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.method} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5 font-medium text-accent">{row.label}</td>
                      <td className="px-3 py-2.5 tabular-nums text-accent">
                        {row.ok && row.aprPercent !== null
                          ? `${formatDebtApr(row.aprPercent)}${row.aprIsWeightedEstimate ? '*' : ''}`
                          : '—'}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-accent">
                        {row.ok
                          ? `${calcSymbol}${formatDebtMoney(row.interest, result.calcCurrency)}`
                          : '—'}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-accent">
                        {row.ok && row.payoffMonths !== null
                          ? formatPayoffMonths(row.payoffMonths)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              * We estimate APR for the minimum payment method with the{' '}
              <span className="underline underline-offset-2">weighted average procedure</span>.
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
