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
  CashFlowToDebtRatioFieldErrors,
  CashFlowToDebtRatioInput,
  CashFlowToDebtRatioResult,
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

interface CashFlowToDebtRatioFormProps {
  input: CashFlowToDebtRatioInput;
  errors: CashFlowToDebtRatioFieldErrors;
  result: CashFlowToDebtRatioResult | null;
  onChange: (input: CashFlowToDebtRatioInput) => void;
}

export function CashFlowToDebtRatioForm({
  input,
  errors,
  result,
  onChange,
}: CashFlowToDebtRatioFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const ocfSymbol = getCurrencySymbol(input.ocfCurrency);
  const debtSymbol = getCurrencySymbol(input.totalDebtCurrency);
  const stSymbol = getCurrencySymbol(input.shortTermDebtCurrency);
  const ltSymbol = getCurrencySymbol(input.longTermDebtCurrency);

  const set = (patch: Partial<CashFlowToDebtRatioInput>) => {
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

  const handleOcfCurrency = (next: SupportedCurrency) => {
    if (next === input.ocfCurrency) return;
    const nextAmount = convertFieldAmount(
      input.operatingCashFlow,
      input.ocfCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.totalDebtCurrency !== next &&
      !canConvertPair(next, input.totalDebtCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, ocfCurrency: next, operatingCashFlow: nextAmount });
  };

  const handleTotalDebtCurrency = (next: SupportedCurrency) => {
    if (next === input.totalDebtCurrency) return;
    const nextAmount = convertFieldAmount(
      input.totalDebt,
      input.totalDebtCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.ocfCurrency !== next && !canConvertPair(input.ocfCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, totalDebtCurrency: next, totalDebt: nextAmount });
  };

  const handleStCurrency = (next: SupportedCurrency) => {
    if (next === input.shortTermDebtCurrency) return;
    const nextAmount = convertFieldAmount(
      input.shortTermDebt,
      input.shortTermDebtCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      shortTermDebtCurrency: next,
      shortTermDebt: nextAmount,
    });
  };

  const handleLtCurrency = (next: SupportedCurrency) => {
    if (next === input.longTermDebtCurrency) return;
    const nextAmount = convertFieldAmount(
      input.longTermDebt,
      input.longTermDebtCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      longTermDebtCurrency: next,
      longTermDebt: nextAmount,
    });
  };

  const totalDebtDisplay =
    input.debtComponentsOpen && result
      ? moneyAmountToInputString(result.totalDebtNormalized)
      : input.totalDebt;

  return (
    <div className="space-y-4">
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="cftd-ocf">
            <span>Operating cash flow</span>
            <InfoTooltip
              label="Operating cash flow"
              text="Annual operating cash flow. Negative values are allowed and produce a negative cash-flow-to-debt percentage."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.operatingCashFlow}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {ocfSymbol}
              </span>
              <input
                id="cftd-ocf"
                className={inputClass}
                inputMode="decimal"
                value={input.operatingCashFlow}
                onChange={(e) => set({ operatingCashFlow: e.target.value })}
                aria-invalid={Boolean(errors.operatingCashFlow)}
              />
            </FieldShell>
            <CurrencySelect
              id="cftd-ocf-currency"
              value={input.ocfCurrency}
              onChange={handleOcfCurrency}
              aria-label="Operating cash flow currency"
            />
          </div>
          {errors.operatingCashFlow ? (
            <p className="mt-1 text-xs text-rose-600">{errors.operatingCashFlow}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cftd-total-debt">
            <span>Total debt</span>
            <InfoTooltip
              label="Total debt"
              text="Consistently defined total debt balance. When debt components are open, total debt equals short-term + long-term (no double-counting)."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.totalDebt} muted={input.debtComponentsOpen}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {debtSymbol}
              </span>
              <input
                id="cftd-total-debt"
                className={inputClass}
                inputMode="decimal"
                value={totalDebtDisplay}
                readOnly={input.debtComponentsOpen}
                onChange={(e) => set({ totalDebt: e.target.value })}
                aria-invalid={Boolean(errors.totalDebt)}
              />
            </FieldShell>
            <CurrencySelect
              id="cftd-total-debt-currency"
              value={input.totalDebtCurrency}
              onChange={handleTotalDebtCurrency}
              aria-label="Total debt currency"
            />
          </div>
          {errors.totalDebt ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalDebt}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cftd-ratio">
            <span>Cash flow to debt ratio</span>
          </label>
          <FieldShell muted>
            <input
              id="cftd-ratio"
              className={inputClass}
              readOnly
              value={result ? result.formattedCashFlowToDebtPercent : ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {result?.cashFlowToDebtPercent === null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Undefined when total debt is zero (division by zero avoided).
            </p>
          ) : null}
          {result &&
          result.cashFlowToDebtPercent !== null &&
          result.cashFlowToDebtPercent < 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Negative ratio reflects negative operating cash flow.
            </p>
          ) : null}
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
        {conversionError ? (
          <p className="text-xs text-rose-600">{conversionError}</p>
        ) : null}
        {!ratesStatus.available ? (
          <p className="text-xs text-amber-700">{CURRENCY_CONVERSION_UNAVAILABLE_NOTE}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={input.debtToCashFlowOpen}
          onClick={() => set({ debtToCashFlowOpen: !input.debtToCashFlowOpen })}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.debtToCashFlowOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
          <span>Show debt to cash flow ratio</span>
        </button>
        {input.debtToCashFlowOpen ? (
          <div className="space-y-2 border-t border-border px-3.5 py-3">
            <label className={labelClass} htmlFor="cftd-debt-to-cf">
              <span>Debt to cash flow ratio</span>
              <InfoTooltip
                label="Debt to cash flow ratio"
                text="Total debt ÷ operating cash flow, shown as a dimensionless multiple. Undefined when operating cash flow is zero."
              />
            </label>
            <FieldShell muted>
              <input
                id="cftd-debt-to-cf"
                className={inputClass}
                readOnly
                value={result ? result.formattedDebtToCashFlowRatio : ''}
                aria-live="polite"
              />
              <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground" aria-hidden>
                x
              </span>
            </FieldShell>
            {result?.debtToCashFlowRatio === null ? (
              <p className="text-xs text-muted-foreground">
                Undefined when operating cash flow is zero.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={input.debtComponentsOpen}
          onClick={() => set({ debtComponentsOpen: !input.debtComponentsOpen })}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.debtComponentsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
          <span>Total debt components</span>
        </button>
        {input.debtComponentsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3">
            <p className="text-xs text-muted-foreground">
              Total debt = short-term debt + long-term debt (normalized into the total-debt
              currency). No other categories are included.
            </p>
            <div>
              <label className={labelClass} htmlFor="cftd-st-debt">
                <span>Short-term debt</span>
              </label>
              <div className="flex items-center gap-2">
                <FieldShell error={errors.shortTermDebt}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {stSymbol}
                  </span>
                  <input
                    id="cftd-st-debt"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.shortTermDebt}
                    onChange={(e) => set({ shortTermDebt: e.target.value })}
                  />
                </FieldShell>
                <CurrencySelect
                  id="cftd-st-currency"
                  value={input.shortTermDebtCurrency}
                  onChange={handleStCurrency}
                  aria-label="Short-term debt currency"
                />
              </div>
              {errors.shortTermDebt ? (
                <p className="mt-1 text-xs text-rose-600">{errors.shortTermDebt}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cftd-lt-debt">
                <span>Long-term debt</span>
              </label>
              <div className="flex items-center gap-2">
                <FieldShell error={errors.longTermDebt}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {ltSymbol}
                  </span>
                  <input
                    id="cftd-lt-debt"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.longTermDebt}
                    onChange={(e) => set({ longTermDebt: e.target.value })}
                  />
                </FieldShell>
                <CurrencySelect
                  id="cftd-lt-currency"
                  value={input.longTermDebtCurrency}
                  onChange={handleLtCurrency}
                  aria-label="Long-term debt currency"
                />
              </div>
              {errors.longTermDebt ? (
                <p className="mt-1 text-xs text-rose-600">{errors.longTermDebt}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
