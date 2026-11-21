'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { StockFieldErrors, StockInput, StockResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';

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

interface StockFormProps {
  input: StockInput;
  errors: StockFieldErrors;
  result: StockResult | null;
  onChange: (input: StockInput) => void;
  onBuyingPriceCurrencyChange: (next: SupportedCurrency) => void;
  onBuyingCommissionAmountCurrencyChange: (next: SupportedCurrency) => void;
  onNetBuyingPriceCurrencyChange: (next: SupportedCurrency) => void;
  onSellingPriceCurrencyChange: (next: SupportedCurrency) => void;
  onSellingCommissionAmountCurrencyChange: (next: SupportedCurrency) => void;
  onNetSellingPriceCurrencyChange: (next: SupportedCurrency) => void;
  onProfitCurrencyChange: (next: SupportedCurrency) => void;
  onBreakEvenCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function StockForm({
  input,
  errors,
  result,
  onChange,
  onBuyingPriceCurrencyChange,
  onBuyingCommissionAmountCurrencyChange,
  onNetBuyingPriceCurrencyChange,
  onSellingPriceCurrencyChange,
  onSellingCommissionAmountCurrencyChange,
  onNetSellingPriceCurrencyChange,
  onProfitCurrencyChange,
  onBreakEvenCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: StockFormProps) {
  const buySymbol = getCurrencySymbol(input.buyingPriceCurrency);
  const buyCommSymbol = getCurrencySymbol(input.buyingCommissionAmountCurrency);
  const netBuySymbol = getCurrencySymbol(input.netBuyingPriceCurrency);
  const sellSymbol = getCurrencySymbol(input.sellingPriceCurrency);
  const sellCommSymbol = getCurrencySymbol(
    input.sellingCommissionAmountCurrency
  );
  const netSellSymbol = getCurrencySymbol(input.netSellingPriceCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);
  const breakEvenSymbol = getCurrencySymbol(
    input.breakEvenSellingPriceCurrency
  );

  const set = (patch: Partial<StockInput>) => {
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
          <label className={labelClass} htmlFor="stock-shares">
            <span>Number of shares</span>
            <InfoTooltip
              label="Number of shares"
              text="How many shares you bought and are selling. Must be greater than zero. This quantity is never currency-converted."
            />
          </label>
          <FieldShell error={errors.numberOfShares}>
            <input
              id="stock-shares"
              className={inputClass}
              inputMode="decimal"
              value={input.numberOfShares}
              aria-invalid={Boolean(errors.numberOfShares)}
              onChange={(e) => set({ numberOfShares: e.target.value })}
            />
          </FieldShell>
          {errors.numberOfShares ? (
            <p className="mt-1 text-xs text-rose-600">{errors.numberOfShares}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Purchase of shares</h3>

        <div>
          <label className={labelClass} htmlFor="stock-buying-price">
            <span>Buying price</span>
            <InfoTooltip
              label="Buying price"
              text="Purchase price per share. Changing currency converts this amount with stored FX rates. Totals are calculated from this price × shares."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.buyingPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {buySymbol}
              </span>
              <input
                id="stock-buying-price"
                className={inputClass}
                inputMode="decimal"
                value={input.buyingPrice}
                aria-invalid={Boolean(errors.buyingPrice)}
                onChange={(e) => set({ buyingPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-buying-price-currency"
                value={input.buyingPriceCurrency}
                onChange={onBuyingPriceCurrencyChange}
                aria-label="Buying price currency"
              />
            </div>
          </div>
          {errors.buyingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buyingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-buying-commission">
            <span>Buying commission</span>
            <InfoTooltip
              label="Buying commission"
              text="Brokerage commission as a percent of gross purchase cost (shares × buying price). Never FX-converted. Allowed range 0–100%."
            />
          </label>
          <FieldShell error={errors.buyingCommissionPercent}>
            <input
              id="stock-buying-commission"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.buyingCommissionPercent}
              aria-invalid={Boolean(errors.buyingCommissionPercent)}
              onChange={(e) => set({ buyingCommissionPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.buyingCommissionPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.buyingCommissionPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-buying-commission-amount">
            <span>Buying commission amount</span>
            <InfoTooltip
              label="Buying commission amount"
              text="Total commission paid on the purchase: gross purchase cost × buying commission %. Display currency is independent."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {buyCommSymbol}
              </span>
              <input
                id="stock-buying-commission-amount"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedBuyingCommissionAmount ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-buying-commission-amount-currency"
                value={input.buyingCommissionAmountCurrency}
                onChange={onBuyingCommissionAmountCurrencyChange}
                aria-label="Buying commission amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-net-buying-price">
            <span>Net buying price</span>
            <InfoTooltip
              label="Net buying price"
              text="Total net buying cost for the whole position: gross purchase cost + buying commission. Not a per-share price."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {netBuySymbol}
              </span>
              <input
                id="stock-net-buying-price"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedNetBuyingCost ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-net-buying-price-currency"
                value={input.netBuyingPriceCurrency}
                onChange={onNetBuyingPriceCurrencyChange}
                aria-label="Net buying price currency"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Selling shares</h3>

        <div>
          <label className={labelClass} htmlFor="stock-selling-price">
            <span>Selling price</span>
            <InfoTooltip
              label="Selling price"
              text="Sale price per share. Changing currency converts this amount with stored FX rates before trade math runs in the buying-price currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.sellingPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {sellSymbol}
              </span>
              <input
                id="stock-selling-price"
                className={inputClass}
                inputMode="decimal"
                value={input.sellingPrice}
                aria-invalid={Boolean(errors.sellingPrice)}
                onChange={(e) => set({ sellingPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-selling-price-currency"
                value={input.sellingPriceCurrency}
                onChange={onSellingPriceCurrencyChange}
                aria-label="Selling price currency"
              />
            </div>
          </div>
          {errors.sellingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sellingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-selling-commission">
            <span>Selling commission</span>
            <InfoTooltip
              label="Selling commission"
              text="Brokerage commission as a percent of gross sale proceeds (shares × selling price). Never FX-converted. Allowed range 0–100%."
            />
          </label>
          <FieldShell error={errors.sellingCommissionPercent}>
            <input
              id="stock-selling-commission"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.sellingCommissionPercent}
              aria-invalid={Boolean(errors.sellingCommissionPercent)}
              onChange={(e) =>
                set({ sellingCommissionPercent: e.target.value })
              }
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.sellingCommissionPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sellingCommissionPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="stock-selling-commission-amount"
          >
            <span>Selling commission amount</span>
            <InfoTooltip
              label="Selling commission amount"
              text="Total commission paid on the sale: gross sale proceeds × selling commission %. Display currency is independent."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {sellCommSymbol}
              </span>
              <input
                id="stock-selling-commission-amount"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedSellingCommissionAmount ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-selling-commission-amount-currency"
                value={input.sellingCommissionAmountCurrency}
                onChange={onSellingCommissionAmountCurrencyChange}
                aria-label="Selling commission amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-net-selling-price">
            <span>Net selling price</span>
            <InfoTooltip
              label="Net selling price"
              text="Total net sale proceeds for the whole position: gross sale proceeds − selling commission. Not a per-share price."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {netSellSymbol}
              </span>
              <input
                id="stock-net-selling-price"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedNetSellingProceeds ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-net-selling-price-currency"
                value={input.netSellingPriceCurrency}
                onChange={onNetSellingPriceCurrencyChange}
                aria-label="Net selling price currency"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Investment performance</h3>

        <div>
          <label className={labelClass} htmlFor="stock-profit">
            <span>Profit</span>
            <InfoTooltip
              label="Profit"
              text="Net selling proceeds minus net buying cost for the whole position. Negative values are losses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {profitSymbol}
              </span>
              <input
                id="stock-profit"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedProfit ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-profit-currency"
                value={input.profitCurrency}
                onChange={onProfitCurrencyChange}
                aria-label="Profit currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-roi">
            <span>Return on investment (ROI)</span>
            <InfoTooltip
              label="Return on investment (ROI)"
              text="Profit ÷ net buying cost × 100. Shown as a percent and never currency-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="stock-roi"
              className={`${inputClass} pr-8 text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedRoiPercent ?? ''}
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

        <div>
          <label className={labelClass} htmlFor="stock-break-even">
            <span>Break-even selling price</span>
            <InfoTooltip
              label="Break-even selling price"
              text="Per-share selling price needed so net sale proceeds equal net buying cost after selling commission. Undefined when selling commission is 100%."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {breakEvenSymbol}
              </span>
              <input
                id="stock-break-even"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedBreakEvenSellingPrice ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="stock-break-even-currency"
                value={input.breakEvenSellingPriceCurrency}
                onChange={onBreakEvenCurrencyChange}
                aria-label="Break-even selling price currency"
              />
            </div>
          </div>
        </div>
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
