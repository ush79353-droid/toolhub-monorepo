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
  FreeCashFlowFieldErrors,
  FreeCashFlowInput,
  FreeCashFlowResult,
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

interface FreeCashFlowFormProps {
  input: FreeCashFlowInput;
  errors: FreeCashFlowFieldErrors;
  result: FreeCashFlowResult | null;
  onChange: (input: FreeCashFlowInput) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function FreeCashFlowForm({
  input,
  errors,
  result,
  onChange,
  conversionError = null,
  ratesWarning = null,
}: FreeCashFlowFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [localConversionError, setLocalConversionError] = React.useState<
    string | null
  >(null);

  const ocfSymbol = getCurrencySymbol(input.operatingCashFlowCurrency);
  const capexSymbol = getCurrencySymbol(input.capexCurrency);
  const fcfSymbol = getCurrencySymbol(result?.currency ?? input.fcfCurrency);
  const stockSymbol = getCurrencySymbol(input.stockPriceCurrency);
  const marketCapSymbol = getCurrencySymbol(input.marketCapCurrency);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);

  const set = (patch: Partial<FreeCashFlowInput>) => {
    setLocalConversionError(null);
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
  ): { ok: true; text: string } | { ok: false } => {
    if (from === to) return { ok: true, text: raw };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, text: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const changeMoneyCurrency = (
    field: keyof Pick<
      FreeCashFlowInput,
      | 'operatingCashFlow'
      | 'capex'
      | 'stockPrice'
      | 'marketCap'
      | 'revenue'
    >,
    currencyField: keyof Pick<
      FreeCashFlowInput,
      | 'operatingCashFlowCurrency'
      | 'capexCurrency'
      | 'stockPriceCurrency'
      | 'marketCapCurrency'
      | 'revenueCurrency'
    >,
    next: SupportedCurrency
  ) => {
    const from = input[currencyField];
    if (next === from) return;
    const converted = convertFieldAmount(input[field], from, next);
    if (!converted.ok) {
      setLocalConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setLocalConversionError(null);
    onChange({
      ...input,
      [currencyField]: next,
      [field]: converted.text,
    });
  };

  const handleFcfCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.fcfCurrency) return;
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.operatingCashFlow, input.operatingCashFlowCurrency],
      [input.capex, input.capexCurrency],
      [input.stockPrice, input.stockPriceCurrency],
      [input.marketCap, input.marketCapCurrency],
      [input.revenue, input.revenueCurrency],
    ];
    for (const [raw, from] of pairs) {
      const amount = parseMoneyInput(raw);
      if (!Number.isFinite(amount)) continue;
      if (!canConvertPair(from, next)) {
        setLocalConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    setLocalConversionError(null);
    onChange({ ...input, fcfCurrency: next });
  };

  const displayConversionError = conversionError ?? localConversionError;
  const displayRatesWarning = ratesWarning ?? ratesStatus.warning;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.fcfOpen}
        onToggle={(event) => set({ fcfOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.fcfOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Free cash flow calculation</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fcf-ocf">
              <span>Operating cash flow</span>
              <InfoTooltip
                label="Operating cash flow"
                text="Cash from operations (CFO). Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.operatingCashFlow}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {ocfSymbol}
                </span>
                <input
                  id="fcf-ocf"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.operatingCashFlow}
                  aria-invalid={Boolean(errors.operatingCashFlow)}
                  onChange={(e) => set({ operatingCashFlow: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-ocf-currency"
                  value={input.operatingCashFlowCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency(
                      'operatingCashFlow',
                      'operatingCashFlowCurrency',
                      next
                    )
                  }
                  aria-label="Operating cash flow currency"
                />
              </div>
            </div>
            {errors.operatingCashFlow ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.operatingCashFlow}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-capex">
              <span>Capital expenditures</span>
              <InfoTooltip
                label="Capital expenditures"
                text="Enter CapEx as a positive spending amount (cash outflow). FCF = OCF − CapEx. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.capex}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {capexSymbol}
                </span>
                <input
                  id="fcf-capex"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.capex}
                  aria-invalid={Boolean(errors.capex)}
                  onChange={(e) => set({ capex: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-capex-currency"
                  value={input.capexCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency('capex', 'capexCurrency', next)
                  }
                  aria-label="Capital expenditures currency"
                />
              </div>
            </div>
            {errors.capex ? (
              <p className="mt-1 text-xs text-rose-600">{errors.capex}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-result">
              <span>Free cash flow</span>
              <InfoTooltip
                label="Free cash flow"
                text="Operating cash flow minus CapEx, shown in this display currency. Negative FCF is allowed."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {fcfSymbol}
                </span>
                <input
                  id="fcf-result"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedFcf ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-result-currency"
                  value={input.fcfCurrency}
                  onChange={handleFcfCurrencyChange}
                  aria-label="Free cash flow currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.perShareOpen}
        onToggle={(event) => set({ perShareOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.perShareOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Free cash flow per share</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fcf-shares">
              <span>Shares outstanding</span>
              <InfoTooltip
                label="Shares outstanding"
                text="Number of shares used for FCF per share. Must be greater than zero. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.sharesOutstanding}>
              <input
                id="fcf-shares"
                className={inputClass}
                inputMode="decimal"
                value={input.sharesOutstanding}
                aria-invalid={Boolean(errors.sharesOutstanding)}
                onChange={(e) => set({ sharesOutstanding: e.target.value })}
              />
            </FieldShell>
            {errors.sharesOutstanding ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.sharesOutstanding}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-per-share">
              <span>Free cash flow per share</span>
              <InfoTooltip
                label="Free cash flow per share"
                text="FCF ÷ shares outstanding, in the free cash flow currency. Empty until shares &gt; 0."
              />
            </label>
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {fcfSymbol}
              </span>
              <input
                id="fcf-per-share"
                className={`${inputClass} font-semibold`}
                readOnly
                tabIndex={-1}
                value={result?.formattedFcfPerShare ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.yieldOpen}
        onToggle={(event) => set({ yieldOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.yieldOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Free cash flow yield</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fcf-stock-price">
              <span>Stock price</span>
              <InfoTooltip
                label="Stock price"
                text="Optional price per share. Yield uses market capitalization, not stock price alone. When shares are also entered, a consistency note may appear if price × shares differs from market cap."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.stockPrice}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {stockSymbol}
                </span>
                <input
                  id="fcf-stock-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.stockPrice}
                  aria-invalid={Boolean(errors.stockPrice)}
                  onChange={(e) => set({ stockPrice: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-stock-price-currency"
                  value={input.stockPriceCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency(
                      'stockPrice',
                      'stockPriceCurrency',
                      next
                    )
                  }
                  aria-label="Stock price currency"
                />
              </div>
            </div>
            {errors.stockPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.stockPrice}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-market-cap">
              <span>Market capitalization</span>
              <InfoTooltip
                label="Market capitalization"
                text="Used for FCF yield = FCF ÷ market cap × 100. Must be greater than zero. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.marketCap}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {marketCapSymbol}
                </span>
                <input
                  id="fcf-market-cap"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.marketCap}
                  aria-invalid={Boolean(errors.marketCap)}
                  onChange={(e) => set({ marketCap: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-market-cap-currency"
                  value={input.marketCapCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency('marketCap', 'marketCapCurrency', next)
                  }
                  aria-label="Market capitalization currency"
                />
              </div>
            </div>
            {errors.marketCap ? (
              <p className="mt-1 text-xs text-rose-600">{errors.marketCap}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-yield">
              <span>Free cash flow yield</span>
              <InfoTooltip
                label="Free cash flow yield"
                text="FCF ÷ market capitalization × 100. Never FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="fcf-yield"
                className={`${inputClass} pr-8 font-semibold`}
                readOnly
                tabIndex={-1}
                value={result?.formattedFcfYieldPercent ?? ''}
                aria-live="polite"
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
          </div>

          {result?.consistencyNote ? (
            <p className="text-xs text-amber-700">{result.consistencyNote}</p>
          ) : null}
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.marginOpen}
        onToggle={(event) => set({ marginOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.marginOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Free cash flow margin</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="fcf-revenue">
              <span>Revenue</span>
              <InfoTooltip
                label="Revenue"
                text="Used for FCF margin = FCF ÷ revenue × 100. Must be greater than zero. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.revenue}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {revenueSymbol}
                </span>
                <input
                  id="fcf-revenue"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.revenue}
                  aria-invalid={Boolean(errors.revenue)}
                  onChange={(e) => set({ revenue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcf-revenue-currency"
                  value={input.revenueCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency('revenue', 'revenueCurrency', next)
                  }
                  aria-label="Revenue currency"
                />
              </div>
            </div>
            {errors.revenue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="fcf-margin">
              <span>Free cash flow margin</span>
              <InfoTooltip
                label="Free cash flow margin"
                text="FCF ÷ revenue × 100. Negative margins are allowed. Never FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="fcf-margin"
                className={`${inputClass} pr-8 font-semibold`}
                readOnly
                tabIndex={-1}
                value={result?.formattedFcfMarginPercent ?? ''}
                aria-live="polite"
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
          </div>
        </div>
      </details>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-center text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {displayConversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {displayConversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {displayRatesWarning && !displayConversionError ? (
        <p className="text-xs text-amber-700">{displayRatesWarning}</p>
      ) : null}
    </form>
  );
}
