'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  StockAverageFieldErrors,
  StockAverageInput,
  StockAverageResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface StockAverageFormProps {
  input: StockAverageInput;
  errors: StockAverageFieldErrors;
  result: StockAverageResult | null;
  onChange: (input: StockAverageInput) => void;
  onCurrentPriceCurrencyChange: (next: SupportedCurrency) => void;
  onFirstBuyPriceCurrencyChange: (next: SupportedCurrency) => void;
  onSecondBuyPriceCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function StockAverageForm({
  input,
  errors,
  result,
  onChange,
  onCurrentPriceCurrencyChange,
  onFirstBuyPriceCurrencyChange,
  onSecondBuyPriceCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: StockAverageFormProps) {
  const currentSymbol = getCurrencySymbol(input.currentPriceCurrency);
  const firstPriceSymbol = getCurrencySymbol(input.firstBuyPriceCurrency);
  const secondPriceSymbol = getCurrencySymbol(input.secondBuyPriceCurrency);
  const resultSymbol = getCurrencySymbol(
    result?.resultCurrency ?? input.firstBuyPriceCurrency
  );

  const set = (patch: Partial<StockAverageInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="sa-current-price">
            <span>Current stock price (optional)</span>
            <InfoTooltip
              label="Current stock price"
              text="Optional market price per share. When provided, market value and unrealized profit/loss appear. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {currentSymbol}
              </span>
              <input
                id="sa-current-price"
                className={inputClass}
                inputMode="decimal"
                value={input.currentPrice}
                aria-invalid={Boolean(errors.currentPrice)}
                onChange={(e) => set({ currentPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sa-current-price-currency"
                value={input.currentPriceCurrency}
                onChange={onCurrentPriceCurrencyChange}
                aria-label="Current stock price currency"
              />
            </div>
          </div>
          {errors.currentPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentPrice}</p>
          ) : null}
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.purchasesOpen}
        onToggle={(event) => set({ purchasesOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.purchasesOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Number of shares bought and their prices</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="sa-first-buy-shares">
                <span>1st buy #</span>
                <InfoTooltip
                  label="1st buy shares"
                  text="Number of shares in the first purchase. Must be greater than zero. Never currency-converted."
                />
              </label>
              <FieldShell error={errors.firstBuyShares}>
                <input
                  id="sa-first-buy-shares"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.firstBuyShares}
                  aria-invalid={Boolean(errors.firstBuyShares)}
                  onChange={(e) => set({ firstBuyShares: e.target.value })}
                />
              </FieldShell>
              {errors.firstBuyShares ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.firstBuyShares}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="sa-first-buy-price">
                <span>1st buy price</span>
                <InfoTooltip
                  label="1st buy price"
                  text="Price per share for the first purchase. Totals are calculated in this currency after converting the other money fields."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.firstBuyPrice}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {firstPriceSymbol}
                  </span>
                  <input
                    id="sa-first-buy-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.firstBuyPrice}
                    aria-invalid={Boolean(errors.firstBuyPrice)}
                    onChange={(e) => set({ firstBuyPrice: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="sa-first-buy-price-currency"
                    value={input.firstBuyPriceCurrency}
                    onChange={onFirstBuyPriceCurrencyChange}
                    aria-label="1st buy price currency"
                  />
                </div>
              </div>
              {errors.firstBuyPrice ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.firstBuyPrice}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="sa-second-buy-shares">
                <span>2nd buy #</span>
                <InfoTooltip
                  label="2nd buy shares"
                  text="Number of shares in the second purchase. Must be greater than zero. Never currency-converted."
                />
              </label>
              <FieldShell error={errors.secondBuyShares}>
                <input
                  id="sa-second-buy-shares"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.secondBuyShares}
                  aria-invalid={Boolean(errors.secondBuyShares)}
                  onChange={(e) => set({ secondBuyShares: e.target.value })}
                />
              </FieldShell>
              {errors.secondBuyShares ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.secondBuyShares}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="sa-second-buy-price">
                <span>2nd buy price</span>
                <InfoTooltip
                  label="2nd buy price"
                  text="Price per share for the second purchase. Converted into the 1st buy price currency before the weighted average."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.secondBuyPrice}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {secondPriceSymbol}
                  </span>
                  <input
                    id="sa-second-buy-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.secondBuyPrice}
                    aria-invalid={Boolean(errors.secondBuyPrice)}
                    onChange={(e) => set({ secondBuyPrice: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="sa-second-buy-price-currency"
                    value={input.secondBuyPriceCurrency}
                    onChange={onSecondBuyPriceCurrencyChange}
                    aria-label="2nd buy price currency"
                  />
                </div>
              </div>
              {errors.secondBuyPrice ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.secondBuyPrice}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </details>

      {result ? (
        <div className={`${sectionClass} space-y-3`}>
          <h3 className="text-sm font-semibold text-accent">Results</h3>
          <dl className="grid gap-2.5 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-white px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">Total shares</dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                {result.formattedTotalShares}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">
                Total investment cost ({resultSymbol})
              </dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                {resultSymbol}
                {result.formattedTotalCost}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2.5 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">
                Weighted average buying price ({resultSymbol}/share)
              </dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                {resultSymbol}
                {result.formattedAveragePrice}
              </dd>
            </div>
            {result.formattedMarketValue !== null ? (
              <div className="rounded-lg border border-border bg-white px-3 py-2.5">
                <dt className="text-xs text-muted-foreground">
                  Current market value ({resultSymbol})
                </dt>
                <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                  {resultSymbol}
                  {result.formattedMarketValue}
                </dd>
              </div>
            ) : null}
            {result.formattedProfitLoss !== null ? (
              <div className="rounded-lg border border-border bg-white px-3 py-2.5">
                <dt className="text-xs text-muted-foreground">
                  Unrealized profit/loss ({resultSymbol})
                </dt>
                <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                  {resultSymbol}
                  {result.formattedProfitLoss}
                </dd>
              </div>
            ) : null}
            {result.formattedReturnPercent !== null ? (
              <div className="rounded-lg border border-border bg-white px-3 py-2.5 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Return</dt>
                <dd className="mt-0.5 text-base font-semibold tabular-nums text-accent">
                  {result.formattedReturnPercent}%
                </dd>
              </div>
            ) : result.marketValueCanonical !== null &&
              result.totalCostCanonical === 0 ? (
              <div className="rounded-lg border border-border bg-white px-3 py-2.5 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Return</dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">
                  Undefined when total investment cost is zero.
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 text-sm text-accent sm:px-4">
          Enter at least the{' '}
          <span className="font-semibold">first two</span> buys (number of shares
          and price).
        </div>
      )}

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
