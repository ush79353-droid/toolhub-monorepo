'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
import type {
  DividendDiscountModelFieldErrors,
  DividendDiscountModelInput,
  DividendDiscountModelResult,
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

interface DividendDiscountModelFormProps {
  input: DividendDiscountModelInput;
  errors: DividendDiscountModelFieldErrors;
  result: DividendDiscountModelResult | null;
  onChange: (input: DividendDiscountModelInput) => void;
  onReset: () => void;
}

export function DividendDiscountModelForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: DividendDiscountModelFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const dividendSymbol = getCurrencySymbol(input.dividendCurrency);
  const expectedDividendSymbol = getCurrencySymbol(input.expectedDividendCurrency);
  const stockValueSymbol = getCurrencySymbol(input.stockValueCurrency);

  const set = (patch: Partial<DividendDiscountModelInput>) => {
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

  /** Convert D₀ amount; leave result currencies and non-money fields alone. */
  const handleDividendCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.dividendCurrency) return;

    const amount = parseMoneyInput(input.dividendPerShare);
    if (!Number.isFinite(amount)) {
      if (
        (input.expectedDividendCurrency !== next &&
          !canConvertPair(next, input.expectedDividendCurrency)) ||
        (input.stockValueCurrency !== next && !canConvertPair(next, input.stockValueCurrency))
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, dividendCurrency: next });
      return;
    }

    if (!canConvertPair(input.dividendCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      (input.expectedDividendCurrency !== next &&
        !canConvertPair(next, input.expectedDividendCurrency)) ||
      (input.stockValueCurrency !== next && !canConvertPair(next, input.stockValueCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.dividendCurrency,
      to: next,
      rates: rates.rates,
    });

    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      dividendCurrency: next,
      dividendPerShare: moneyAmountToInputString(converted.amount),
    });
  };

  /** Display-only currency for D₁. */
  const handleExpectedDividendCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.expectedDividendCurrency) return;
    if (!canConvertPair(input.dividendCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, expectedDividendCurrency: next });
  };

  /** Display-only currency for P₀. */
  const handleStockValueCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.stockValueCurrency) return;
    if (!canConvertPair(input.dividendCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, stockValueCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Expected growth rate
        </legend>

        <div>
          <label className={labelClass} htmlFor="ddm-payout">
            <span>Dividend payout ratio</span>
            <InfoTooltip
              label="Dividend payout ratio"
              text="Share of earnings paid as dividends. Retention ratio is 1 − payout."
            />
          </label>
          <FieldShell error={errors.dividendPayoutRatioPercent}>
            <input
              id="ddm-payout"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.dividendPayoutRatioPercent}
              aria-invalid={Boolean(errors.dividendPayoutRatioPercent)}
              onChange={(e) => set({ dividendPayoutRatioPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.dividendPayoutRatioPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dividendPayoutRatioPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ddm-roe">
            <span>Return on equity</span>
            <InfoTooltip
              label="Return on equity"
              text="ROE used with retention to estimate sustainable dividend growth."
            />
          </label>
          <FieldShell error={errors.returnOnEquityPercent}>
            <input
              id="ddm-roe"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.returnOnEquityPercent}
              aria-invalid={Boolean(errors.returnOnEquityPercent)}
              onChange={(e) => set({ returnOnEquityPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.returnOnEquityPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.returnOnEquityPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ddm-growth">
            <span>Expected growth rate</span>
            <InfoTooltip
              label="Expected growth rate"
              text="g = ROE × (1 − payout). Percentages are never FX-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="ddm-growth"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedGrowthRatePercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Expected dividend
        </legend>

        <div>
          <label className={labelClass} htmlFor="ddm-d0">
            <span>Dividend per share</span>
            <InfoTooltip
              label="Dividend per share"
              text="Current annual dividend (D₀). Next year’s expected dividend is D₀ × (1 + g)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.dividendPerShare}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {dividendSymbol}
              </span>
              <input
                id="ddm-d0"
                className={inputClass}
                inputMode="decimal"
                value={input.dividendPerShare}
                aria-invalid={Boolean(errors.dividendPerShare)}
                onChange={(e) => set({ dividendPerShare: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ddm-d0-currency"
                value={input.dividendCurrency}
                onChange={handleDividendCurrencyChange}
                aria-label="Dividend per share currency"
              />
            </div>
          </div>
          {errors.dividendPerShare ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dividendPerShare}</p>
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
          <label className={labelClass} htmlFor="ddm-d1">
            <span>Expected dividend</span>
            <InfoTooltip
              label="Expected dividend"
              text="D₁ = D₀ × (1 + g). Changing this currency only re-expresses D₁ for display."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {expectedDividendSymbol}
              </span>
              <input
                id="ddm-d1"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedExpectedDividend : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ddm-d1-currency"
                value={input.expectedDividendCurrency}
                onChange={handleExpectedDividendCurrencyChange}
                aria-label="Expected dividend currency"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Cost of equity</legend>

        <div>
          <label className={labelClass} htmlFor="ddm-rf">
            <span>Risk-free rate</span>
            <InfoTooltip
              label="Risk-free rate"
              text="Rf in CAPM. Used as a percent; never FX-converted."
            />
          </label>
          <FieldShell error={errors.riskFreeRatePercent}>
            <input
              id="ddm-rf"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.riskFreeRatePercent}
              aria-invalid={Boolean(errors.riskFreeRatePercent)}
              onChange={(e) => set({ riskFreeRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.riskFreeRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.riskFreeRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ddm-mrp">
            <span>Market risk premium</span>
            <InfoTooltip
              label="Market risk premium"
              text="Equity market excess return over the risk-free rate (MRP)."
            />
          </label>
          <FieldShell error={errors.marketRiskPremiumPercent}>
            <input
              id="ddm-mrp"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.marketRiskPremiumPercent}
              aria-invalid={Boolean(errors.marketRiskPremiumPercent)}
              onChange={(e) => set({ marketRiskPremiumPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.marketRiskPremiumPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.marketRiskPremiumPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ddm-beta">
            <span>Beta</span>
            <InfoTooltip
              label="Beta"
              text="Stock’s systematic risk relative to the market. Dimensionless."
            />
          </label>
          <FieldShell error={errors.beta}>
            <input
              id="ddm-beta"
              className={inputClass}
              inputMode="decimal"
              value={input.beta}
              aria-invalid={Boolean(errors.beta)}
              onChange={(e) => set({ beta: e.target.value })}
            />
          </FieldShell>
          {errors.beta ? <p className="mt-1 text-xs text-rose-600">{errors.beta}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ddm-ke">
            <span>Cost of equity</span>
            <InfoTooltip
              label="Cost of equity"
              text="Ke = Rf + β × MRP. Must exceed growth rate for a valid Gordon Growth value."
            />
          </label>
          <FieldShell muted>
            <input
              id="ddm-ke"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedCostOfEquityPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          DDM stock value
        </legend>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          This is the stock value calculated based on the Dividend Discount Model.
        </p>

        <div>
          <label className={labelClass} htmlFor="ddm-p0">
            <span>Stock value</span>
            <InfoTooltip
              label="Stock value"
              text="P₀ = D₁ / (Ke − g). Changing this currency only re-expresses P₀ for display."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {stockValueSymbol}
              </span>
              <input
                id="ddm-p0"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedStockValue : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ddm-p0-currency"
                value={input.stockValueCurrency}
                onChange={handleStockValueCurrencyChange}
                aria-label="Stock value currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

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
          Reset
        </Button>
      </div>
    </form>
  );
}
