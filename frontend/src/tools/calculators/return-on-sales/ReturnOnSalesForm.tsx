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
import type {
  ReturnOnSalesFieldErrors,
  ReturnOnSalesInput,
  ReturnOnSalesResult,
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

interface ReturnOnSalesFormProps {
  input: ReturnOnSalesInput;
  errors: ReturnOnSalesFieldErrors;
  result: ReturnOnSalesResult | null;
  onChange: (input: ReturnOnSalesInput) => void;
}

export function ReturnOnSalesForm({
  input,
  errors,
  result,
  onChange,
}: ReturnOnSalesFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const profitSymbol = getCurrencySymbol(input.operatingProfitCurrency);
  const salesSymbol = getCurrencySymbol(input.netSalesCurrency);

  const set = (patch: Partial<ReturnOnSalesInput>) => {
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

  const handleProfitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.operatingProfitCurrency) return;

    const amount = parseMoneyInput(input.operatingProfit);
    if (!Number.isFinite(amount)) {
      if (
        input.netSalesCurrency !== next &&
        !canConvertPair(next, input.netSalesCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, operatingProfitCurrency: next });
      return;
    }

    if (!canConvertPair(input.operatingProfitCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.operatingProfitCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      operatingProfitCurrency: next,
      operatingProfit: moneyAmountToInputString(converted),
    });
  };

  const handleSalesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.netSalesCurrency) return;

    const amount = parseMoneyInput(input.netSales);
    if (!Number.isFinite(amount)) {
      if (
        input.operatingProfitCurrency !== next &&
        !canConvertPair(input.operatingProfitCurrency, next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, netSalesCurrency: next });
      return;
    }

    if (!canConvertPair(input.netSalesCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertFieldAmount(amount, input.netSalesCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      netSalesCurrency: next,
      netSales: moneyAmountToInputString(converted),
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5">
        <div>
          <label className={labelClass} htmlFor="ros-operating-profit">
            <span>Operating profit</span>
            <InfoTooltip
              label="Operating profit"
              text="Earnings after operating expenses for the period, before interest and taxes in many presentations. Distinct from net profit. Negative values are allowed and produce a negative ROS."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.operatingProfit}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {profitSymbol}
              </span>
              <input
                id="ros-operating-profit"
                className={inputClass}
                inputMode="decimal"
                value={input.operatingProfit}
                aria-invalid={Boolean(errors.operatingProfit)}
                onChange={(e) => set({ operatingProfit: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ros-operating-profit-currency"
                value={input.operatingProfitCurrency}
                onChange={handleProfitCurrencyChange}
                aria-label="Operating profit currency"
              />
            </div>
          </div>
          {errors.operatingProfit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.operatingProfit}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ros-net-sales">
            <span>Net sales</span>
            <InfoTooltip
              label="Net sales"
              text="Period sales after returns and allowances. Must be greater than zero. Operating profit is normalized into this currency before dividing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.netSales}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {salesSymbol}
              </span>
              <input
                id="ros-net-sales"
                className={inputClass}
                inputMode="decimal"
                value={input.netSales}
                aria-invalid={Boolean(errors.netSales)}
                onChange={(e) => set({ netSales: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ros-net-sales-currency"
                value={input.netSalesCurrency}
                onChange={handleSalesCurrencyChange}
                aria-label="Net sales currency"
              />
            </div>
          </div>
          {errors.netSales ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netSales}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ros-percent">
            <span>Return on sales (ROS)</span>
            <InfoTooltip
              label="Return on sales (ROS)"
              text="(Operating profit ÷ Net sales) × 100. Distinct from net profit margin. The percentage is never currency-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="ros-percent"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedRosPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-primary">
              %
            </span>
          </FieldShell>
        </div>

        {conversionError || ratesStatus.warning ? (
          <p
            className={`text-xs ${conversionError ? 'text-rose-600' : 'text-amber-700'}`}
            role="status"
          >
            {conversionError || ratesStatus.warning}
          </p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </div>
    </form>
  );
}
