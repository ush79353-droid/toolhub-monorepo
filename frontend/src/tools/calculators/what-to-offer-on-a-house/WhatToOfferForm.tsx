'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DiscountMode,
  WhatToOfferFieldErrors,
  WhatToOfferInput,
  WhatToOfferResult,
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

interface WhatToOfferFormProps {
  input: WhatToOfferInput;
  errors: WhatToOfferFieldErrors;
  result: WhatToOfferResult | null;
  onChange: (input: WhatToOfferInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function WhatToOfferForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: WhatToOfferFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<WhatToOfferInput>) => {
    onChange({ ...input, ...patch });
  };

  const setDiscountMode = (mode: DiscountMode) => {
    if (mode === input.discountMode) return;
    set({ discountMode: mode, desiredDiscount: '' });
  };

  const offerDisplay =
    result?.status === 'valid' && result.formattedActionableOfferAmount
      ? result.formattedActionableOfferAmount
      : result
        ? result.formattedRawOfferAmount
        : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. Blank
          renovation, discount, and profit fields default to zero.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="wto-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <div>
        <label htmlFor="wto-fmv" className={labelClass}>
          <span>Fair market value (FMV)</span>
          <InfoTooltip
            label="Fair market value (FMV)"
            text="Estimated price a property could command in an ordinary market transaction between informed, willing buyers and sellers. Use comps or another appropriate estimate — not necessarily the asking price or after-repair value."
          />
        </label>
        <FieldShell error={errors.fairMarketValue}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wto-fmv"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.fairMarketValue}
            aria-invalid={errors.fairMarketValue ? true : undefined}
            onChange={(e) => set({ fairMarketValue: e.target.value })}
          />
        </FieldShell>
        {errors.fairMarketValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fairMarketValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wto-cor" className={labelClass}>
          <span>Cost of renovation (CoR)</span>
          <InfoTooltip
            label="Cost of renovation (CoR)"
            text="Estimated cost of necessary renovations or repairs after purchase (roof, electrical, plumbing, kitchen, bathroom, structural work, etc.). Do not also fold the same costs into desired discount."
          />
        </label>
        <FieldShell error={errors.renovationCost}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wto-cor"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.renovationCost}
            placeholder="0"
            aria-invalid={errors.renovationCost ? true : undefined}
            onChange={(e) => set({ renovationCost: e.target.value })}
          />
        </FieldShell>
        {errors.renovationCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.renovationCost}</p>
        ) : null}
      </div>

      <div>
        <span className={labelClass}>
          <span>Desired discount (DD)</span>
          <InfoTooltip
            label="Desired discount (DD)"
            text="Additional negotiated reduction separate from renovation costs. Use a fixed amount, or a percentage of fair market value. Percentage base is FMV."
          />
        </span>
        <div className="mb-2 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="wto-discount-mode"
              className="h-4 w-4 accent-primary"
              checked={input.discountMode === 'amount'}
              onChange={() => setDiscountMode('amount')}
            />
            Amount
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="wto-discount-mode"
              className="h-4 w-4 accent-primary"
              checked={input.discountMode === 'percentage'}
              onChange={() => setDiscountMode('percentage')}
            />
            Percentage of FMV
          </label>
        </div>
        <FieldShell error={errors.desiredDiscount}>
          {input.discountMode === 'amount' ? (
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
          ) : null}
          <input
            id="wto-dd"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.desiredDiscount}
            placeholder="0"
            aria-invalid={errors.desiredDiscount ? true : undefined}
            onChange={(e) => set({ desiredDiscount: e.target.value })}
          />
          {input.discountMode === 'percentage' ? (
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          ) : null}
        </FieldShell>
        {errors.desiredDiscount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.desiredDiscount}</p>
        ) : null}
        {result && input.discountMode === 'percentage' ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Discount amount: {symbol}
            {result.formattedDiscountAmount}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wto-dp" className={labelClass}>
          <span>Desired profit (DP)</span>
          <InfoTooltip
            label="Desired profit (DP)"
            text="Investor profit allowance reserved in this simplified offer model — not guaranteed profit. For a personal home purchase, this may appropriately be zero. Actual returns depend on financing, holding costs, taxes, and resale."
          />
        </label>
        <FieldShell error={errors.desiredProfit}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wto-dp"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.desiredProfit}
            placeholder="0"
            aria-invalid={errors.desiredProfit ? true : undefined}
            onChange={(e) => set({ desiredProfit: e.target.value })}
          />
        </FieldShell>
        {errors.desiredProfit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.desiredProfit}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wto-offer" className={labelClass}>
          <span>Offer amount (O)</span>
          <InfoTooltip
            label="Offer amount (O)"
            text="O = FMV − CoR − DD − DP. Simplified negotiation/investment model — not an appraisal, legal valuation, or guaranteed acceptable offer."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wto-offer"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={offerDisplay}
            aria-live="polite"
          />
        </FieldShell>
        {result?.warningMessage ? (
          <p className="mt-1 text-xs text-amber-700" role="status">
            {result.warningMessage}
          </p>
        ) : null}
        {result?.status === 'negativeOffer' || result?.status === 'zeroOffer' ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Recommended actionable offer: unavailable (mathematical result shown
            above for explanation only).
          </p>
        ) : null}
      </div>
    </form>
  );
}
