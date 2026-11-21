'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GoodwillFieldErrors,
  GoodwillInput,
  GoodwillResult,
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

interface GoodwillFormProps {
  input: GoodwillInput;
  errors: GoodwillFieldErrors;
  result: GoodwillResult | null;
  onChange: (input: GoodwillInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function GoodwillForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: GoodwillFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const isBargain = result?.status === 'potentialBargainPurchase';

  const set = (patch: Partial<GoodwillInput>) => {
    onChange({ ...input, ...patch });
  };

  const goodwillDisplay = result
    ? isBargain
      ? '0.00'
      : result.formattedGoodwill
    : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for acquisition amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Simplified model: Goodwill = Purchase price − (Assets −
        Liabilities).
      </p>

      <div>
        <label htmlFor="gw-purchase" className={labelClass}>
          Purchase price
          <InfoTooltip
            label="Purchase price"
            text="Acquisition consideration in the simplified model. Do not add assumed liabilities here — they are already reflected in net identifiable assets."
          />
        </label>
        <FieldShell error={errors.purchasePrice}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="gw-purchase"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.purchasePrice}
            onChange={(e) => set({ purchasePrice: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.purchasePrice)}
          />
        </FieldShell>
        {errors.purchasePrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gw-assets" className={labelClass}>
          Fair value of the assets
          <InfoTooltip
            label="Fair value of the assets"
            text="Fair value of identifiable assets acquired — cash, receivables, inventory, PP&E, identifiable intangibles. Exclude the goodwill being calculated."
          />
        </label>
        <FieldShell error={errors.fairValueOfAssets}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="gw-assets"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.fairValueOfAssets}
            onChange={(e) => set({ fairValueOfAssets: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.fairValueOfAssets)}
          />
        </FieldShell>
        {errors.fairValueOfAssets ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.fairValueOfAssets}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gw-liabilities" className={labelClass}>
          Fair value of the liabilities
          <InfoTooltip
            label="Fair value of the liabilities"
            text="Fair value of identifiable liabilities assumed — borrowings, payables, accruals, provisions, lease liabilities, and similar obligations."
          />
        </label>
        <FieldShell error={errors.fairValueOfLiabilities}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="gw-liabilities"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.fairValueOfLiabilities}
            onChange={(e) => set({ fairValueOfLiabilities: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.fairValueOfLiabilities)}
          />
        </FieldShell>
        {errors.fairValueOfLiabilities ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.fairValueOfLiabilities}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="gw-goodwill" className={labelClass}>
          Goodwill
          <InfoTooltip
            label="Goodwill"
            text="Purchase price minus net identifiable assets (assets − liabilities). Negative residuals are shown as potential bargain purchases — not negative goodwill assets."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="gw-goodwill"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={goodwillDisplay}
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
