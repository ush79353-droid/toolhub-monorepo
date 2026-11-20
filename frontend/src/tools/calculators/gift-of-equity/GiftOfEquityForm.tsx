'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GiftOfEquityFieldErrors,
  GiftOfEquityInput,
  GiftOfEquityMode,
  GiftOfEquityResult,
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

interface GiftOfEquityFormProps {
  input: GiftOfEquityInput;
  errors: GiftOfEquityFieldErrors;
  result: GiftOfEquityResult | null;
  onChange: (input: GiftOfEquityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function GiftOfEquityForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: GiftOfEquityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const marketReadOnly = input.mode === 'marketValue';
  const salesReadOnly = input.mode === 'salesPrice';
  const giftReadOnly = input.mode === 'gift';

  const set = (patch: Partial<GiftOfEquityInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: GiftOfEquityMode) => {
    if (mode === input.mode) return;
    set({ mode });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="goe-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="goe-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'gift'}
              onChange={() => setMode('gift')}
            />
            Gift of equity
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="goe-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'salesPrice'}
              onChange={() => setMode('salesPrice')}
            />
            Sales price
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="goe-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'marketValue'}
              onChange={() => setMode('marketValue')}
            />
            Market value
          </label>
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="goe-market-value">
          <span>Market value</span>
          <InfoTooltip
            label="Market value"
            text="Estimated amount a property could sell for under normal market conditions. Ideally supported by a reliable valuation or appraisal when required for a transaction. Example: Market value = $600,000."
          />
        </label>
        <FieldShell error={errors.marketValue} muted={marketReadOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="goe-market-value"
            className={inputClass}
            inputMode="decimal"
            readOnly={marketReadOnly}
            tabIndex={marketReadOnly ? -1 : undefined}
            value={
              marketReadOnly
                ? (result?.formattedMarketValue ?? '')
                : input.marketValue
            }
            aria-invalid={Boolean(errors.marketValue)}
            aria-live={marketReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ marketValue: e.target.value })}
          />
        </FieldShell>
        {errors.marketValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.marketValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="goe-sales-price">
          <span>Sales price</span>
          <InfoTooltip
            label="Sales price"
            text="Amount the buyer agrees to pay the seller. In a gift-of-equity transaction, the agreed sales price may be lower than market value. Example: Sales price = $500,000."
          />
        </label>
        <FieldShell error={errors.salesPrice} muted={salesReadOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="goe-sales-price"
            className={inputClass}
            inputMode="decimal"
            readOnly={salesReadOnly}
            tabIndex={salesReadOnly ? -1 : undefined}
            value={
              salesReadOnly
                ? (result?.formattedSalesPrice ?? '')
                : input.salesPrice
            }
            aria-invalid={Boolean(errors.salesPrice)}
            aria-live={salesReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ salesPrice: e.target.value })}
          />
        </FieldShell>
        {errors.salesPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.salesPrice}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="goe-gift">
          <span>Gift of equity</span>
          <InfoTooltip
            label="Gift of equity"
            text="Difference between market value and sales price (Market value − Sales price). A negative result means sales price exceeds market value and is not a positive gift."
          />
        </label>
        <FieldShell error={errors.giftOfEquity} muted={giftReadOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="goe-gift"
            className={inputClass}
            inputMode="decimal"
            readOnly={giftReadOnly}
            tabIndex={giftReadOnly ? -1 : undefined}
            value={
              giftReadOnly
                ? (result?.formattedGiftOfEquity ?? '')
                : input.giftOfEquity
            }
            aria-invalid={Boolean(errors.giftOfEquity)}
            aria-live={giftReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ giftOfEquity: e.target.value })}
          />
        </FieldShell>
        {errors.giftOfEquity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.giftOfEquity}</p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
