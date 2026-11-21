'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMarketCapMoney } from './calculation';
import type {
  MarketCapitalizationFieldErrors,
  MarketCapitalizationInput,
  MarketCapitalizationResult,
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

interface MarketCapFormProps {
  input: MarketCapitalizationInput;
  errors: MarketCapitalizationFieldErrors;
  result: MarketCapitalizationResult | null;
  onChange: (input: MarketCapitalizationInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function MarketCapForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: MarketCapFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Market capitalization = share price × outstanding shares. Use outstanding
        shares (not float or authorized shares).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mcap-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for market capitalization amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#formula"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market capitalization formula
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Market cap inputs
        </legend>

        <div>
          <label htmlFor="mcap-price" className={labelClass}>
            Price of a single share
            <InfoTooltip
              label="Share price"
              text="The current market price of one outstanding share of the company."
            />
          </label>
          <FieldShell error={errors.sharePrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="mcap-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sharePrice}
              onChange={(e) =>
                onChange({ ...input, sharePrice: e.target.value })
              }
              placeholder="100"
              aria-invalid={Boolean(errors.sharePrice)}
            />
          </FieldShell>
          {errors.sharePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sharePrice}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mcap-shares" className={labelClass}>
            Number of outstanding shares
            <InfoTooltip
              label="Outstanding shares"
              text="The total number of company shares currently outstanding, excluding treasury shares."
            />
          </label>
          <FieldShell error={errors.outstandingShares}>
            <input
              id="mcap-shares"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.outstandingShares}
              onChange={(e) =>
                onChange({ ...input, outstandingShares: e.target.value })
              }
              placeholder="10,000,000"
              aria-invalid={Boolean(errors.outstandingShares)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              shares
            </span>
          </FieldShell>
          {errors.outstandingShares ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.outstandingShares}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mcap-result" className={labelClass}>
            Market capitalization
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="mcap-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatMarketCapMoney(
                      result.marketCapitalization,
                      input.currency
                    )
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result
                  ? `Market capitalization ${result.formattedMarketCap}`
                  : 'Market capitalization unavailable'
              }
            />
          </FieldShell>
          {result ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Compact:{' '}
              <span className="font-semibold tabular-nums text-accent">
                {result.compactMarketCap}
              </span>
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
