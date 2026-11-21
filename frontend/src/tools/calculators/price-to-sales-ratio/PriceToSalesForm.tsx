'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PriceToSalesFieldErrors,
  PriceToSalesInput,
  PriceToSalesResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface PriceToSalesFormProps {
  input: PriceToSalesInput;
  errors: PriceToSalesFieldErrors;
  result: PriceToSalesResult | null;
  onChange: (input: PriceToSalesInput) => void;
  onSalesCurrencyChange: (next: SupportedCurrency) => void;
  onSalesPerShareCurrencyChange: (next: SupportedCurrency) => void;
  onPricePerShareCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function PriceToSalesForm({
  input,
  errors,
  result,
  onChange,
  onSalesCurrencyChange,
  onSalesPerShareCurrencyChange,
  onPricePerShareCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: PriceToSalesFormProps) {
  const salesSymbol = getCurrencySymbol(input.salesCurrency);
  const spsSymbol = getCurrencySymbol(
    result?.salesPerShareCurrency ?? input.salesPerShareCurrency
  );
  const priceSymbol = getCurrencySymbol(input.pricePerShareCurrency);

  const set = (patch: Partial<PriceToSalesInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.revenuePerShareOpen}
        onToggle={(event) =>
          set({ revenuePerShareOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.revenuePerShareOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Revenue per share</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ps-sales">
              <span>Sales</span>
              <InfoTooltip
                label="Sales"
                text="Total revenue / sales for the same reporting period as shares outstanding. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.sales}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {salesSymbol}
                </span>
                <input
                  id="ps-sales"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sales}
                  aria-invalid={Boolean(errors.sales)}
                  onChange={(e) => set({ sales: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ps-sales-currency"
                  value={input.salesCurrency}
                  onChange={onSalesCurrencyChange}
                  aria-label="Sales currency"
                />
              </div>
            </div>
            {errors.sales ? (
              <p className="mt-1 text-xs text-rose-600">{errors.sales}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-shares">
              <span>Number of shares outstanding</span>
              <InfoTooltip
                label="Shares outstanding"
                text="Share count for the same period as sales. Must be greater than zero. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.sharesOutstanding}>
              <input
                id="ps-shares"
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
            <label className={labelClass} htmlFor="ps-sps">
              <span>Sales per share</span>
              <InfoTooltip
                label="Sales per share"
                text="Sales ÷ shares outstanding. Shown in this display currency. Not entered manually."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {spsSymbol}
                </span>
                <input
                  id="ps-sps"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedSalesPerShare ?? ''}
                  aria-label="Sales per share result"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ps-sps-currency"
                  value={input.salesPerShareCurrency}
                  onChange={onSalesPerShareCurrencyChange}
                  aria-label="Sales per share currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.priceToSalesOpen}
        onToggle={(event) =>
          set({ priceToSalesOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.priceToSalesOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Price to sales ratio</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ps-price">
              <span>Price per share</span>
              <InfoTooltip
                label="Price per share"
                text="Current market price for one share (same share unit as the share count). Nonnegative; zero is allowed. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.pricePerShare}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {priceSymbol}
                </span>
                <input
                  id="ps-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.pricePerShare}
                  aria-invalid={Boolean(errors.pricePerShare)}
                  onChange={(e) => set({ pricePerShare: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ps-price-currency"
                  value={input.pricePerShareCurrency}
                  onChange={onPricePerShareCurrencyChange}
                  aria-label="Price per share currency"
                />
              </div>
            </div>
            {errors.pricePerShare ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.pricePerShare}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-ratio">
              <span>Price to sales ratio</span>
              <InfoTooltip
                label="Price to sales ratio"
                text="Price per share ÷ sales per share. Dimensionless multiple (×). Never FX-converted. Undefined when sales per share is zero."
              />
            </label>
            <FieldShell muted>
              <input
                id="ps-ratio"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={
                  result?.ratioUndefined
                    ? 'undefined'
                    : (result?.formattedPriceToSalesRatio ?? '')
                }
                aria-label="Price to sales ratio result"
              />
              <span
                className="shrink-0 pr-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                x
              </span>
            </FieldShell>
            {result?.negativeRatioNote ? (
              <p className="mt-1 text-xs text-amber-700">
                {result.negativeRatioNote}
              </p>
            ) : null}
            {result?.ratioUndefined ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Ratio is undefined when sales per share is zero (not Infinity).
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
