'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RevenueDraft,
  RevenueFieldErrors,
  RevenueResult,
  RevenueSolveTarget,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface RevenueFormProps {
  draft: RevenueDraft;
  errors: RevenueFieldErrors;
  result: RevenueResult | null;
  onChange: (draft: RevenueDraft) => void;
  onPriceCurrencyChange: (next: SupportedCurrency) => void;
  onTotalRevenueCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RevenueForm({
  draft,
  errors,
  result,
  onChange,
  onPriceCurrencyChange,
  onTotalRevenueCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: RevenueFormProps) {
  const priceSymbol = getCurrencySymbol(draft.priceCurrency);
  const totalSymbol = getCurrencySymbol(draft.totalRevenueCurrency);

  const setField = (field: RevenueSolveTarget, value: string) => {
    onChange({
      ...draft,
      [field]: value,
      lastEdited: field,
      solveFor: field === 'price' ? 'price' : field === 'quantity' ? 'quantity' : 'totalRevenue',
    });
  };

  const priceDisplay =
    result?.solvedField === 'price' ? result.formattedPrice : draft.price;
  const quantityDisplay =
    result?.solvedField === 'quantity' ? result.formattedQuantity : draft.quantity;
  const totalDisplay =
    result?.solvedField === 'totalRevenue'
      ? result.formattedTotalRevenue
      : draft.totalRevenue;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-foreground/90">
        Enter any two of Price, Quantity, and Total revenue — leave exactly one blank to solve.
        Zero is a filled value.
      </p>

      <div>
        <label className={labelClass} htmlFor="rev-price">
          <span>Price</span>
          <InfoTooltip
            label="Price"
            text="Unit price. Leave blank to solve for price from total revenue and quantity."
          />
        </label>
        <FieldShell error={errors.price}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {priceSymbol}
          </span>
          <input
            id="rev-price"
            className={inputClass}
            inputMode="decimal"
            value={priceDisplay}
            placeholder="Leave blank to solve"
            aria-invalid={Boolean(errors.price)}
            onChange={(e) => setField('price', e.target.value)}
          />
          <CurrencySelect
            id="rev-price-currency"
            value={draft.priceCurrency}
            onChange={onPriceCurrencyChange}
            className="mr-1"
          />
        </FieldShell>
        {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rev-quantity">
          <span>Quantity</span>
          <InfoTooltip
            label="Quantity"
            text="Units sold. Not currency-converted. Leave blank to solve for quantity."
          />
        </label>
        <FieldShell error={errors.quantity}>
          <input
            id="rev-quantity"
            className={inputClass}
            inputMode="decimal"
            value={quantityDisplay}
            placeholder="Leave blank to solve"
            aria-invalid={Boolean(errors.quantity)}
            onChange={(e) => setField('quantity', e.target.value)}
          />
        </FieldShell>
        {errors.quantity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rev-total">
          <span>Total revenue</span>
          <InfoTooltip
            label="Total revenue"
            text="Price × Quantity. Leave blank to solve for total revenue."
          />
        </label>
        <FieldShell error={errors.totalRevenue}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {totalSymbol}
          </span>
          <input
            id="rev-total"
            className={inputClass}
            inputMode="decimal"
            value={totalDisplay}
            placeholder="Leave blank to solve"
            aria-invalid={Boolean(errors.totalRevenue)}
            onChange={(e) => setField('totalRevenue', e.target.value)}
          />
          <CurrencySelect
            id="rev-total-currency"
            value={draft.totalRevenueCurrency}
            onChange={onTotalRevenueCurrencyChange}
            className="mr-1"
          />
        </FieldShell>
        {errors.totalRevenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      {conversionError ? <p className="text-xs text-rose-600">{conversionError}</p> : null}
      {ratesWarning ? <p className="text-xs text-amber-700">{ratesWarning}</p> : null}
      {result ? (
        <p className="text-sm text-foreground/90" aria-live="polite">
          {result.summaryText}
        </p>
      ) : null}
    </form>
  );
}
