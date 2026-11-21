'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPbMoney, formatRatio } from './calculation';
import type {
  PriceToBookFieldErrors,
  PriceToBookInput,
  PriceToBookResult,
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

interface PriceToBookFormProps {
  input: PriceToBookInput;
  errors: PriceToBookFieldErrors;
  result: PriceToBookResult | null;
  onChange: (input: PriceToBookInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PriceToBookForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PriceToBookFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PriceToBookInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Common book equity = total equity − preferred. BVPS = common equity ÷
        shares. P/B = share price ÷ BVPS (when BVPS &gt; 0). Expand tangible book
        to exclude goodwill and other intangibles.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="pb-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for price-to-book amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is-pb"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is the price-to-book ratio?
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Price to book ratio
        </legend>

        <div>
          <label htmlFor="pb-equity" className={labelClass}>
            Total stockholder equity
            <InfoTooltip
              label="Total stockholder equity"
              text="Reported shareholders' equity from the balance sheet."
            />
          </label>
          <FieldShell error={errors.totalStockholderEquity}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pb-equity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalStockholderEquity}
              onChange={(e) => set({ totalStockholderEquity: e.target.value })}
              placeholder="500,000"
              aria-invalid={Boolean(errors.totalStockholderEquity)}
            />
          </FieldShell>
          {errors.totalStockholderEquity ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.totalStockholderEquity}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pb-preferred" className={labelClass}>
            Preferred equity
            <InfoTooltip
              label="Preferred equity"
              text="Preferred shareholders' equity deducted to obtain common book equity. Use 0 if none."
            />
          </label>
          <FieldShell error={errors.preferredEquity}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pb-preferred"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.preferredEquity}
              onChange={(e) => set({ preferredEquity: e.target.value })}
              placeholder="0.00"
              aria-invalid={Boolean(errors.preferredEquity)}
            />
          </FieldShell>
          {errors.preferredEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.preferredEquity}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pb-shares" className={labelClass}>
            Number of shares outstanding
            <InfoTooltip
              label="Shares outstanding"
              text="Common shares outstanding. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.commonSharesOutstanding}>
            <input
              id="pb-shares"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.commonSharesOutstanding}
              onChange={(e) =>
                set({ commonSharesOutstanding: e.target.value })
              }
              placeholder="10,000"
              aria-invalid={Boolean(errors.commonSharesOutstanding)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              shares
            </span>
          </FieldShell>
          {errors.commonSharesOutstanding ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.commonSharesOutstanding}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pb-price" className={labelClass}>
            Share price
            <InfoTooltip
              label="Share price"
              text="Current market price per common share."
            />
          </label>
          <FieldShell error={errors.sharePrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pb-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sharePrice}
              onChange={(e) => set({ sharePrice: e.target.value })}
              placeholder="90"
              aria-invalid={Boolean(errors.sharePrice)}
            />
          </FieldShell>
          {errors.sharePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sharePrice}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pb-bvps" className={labelClass}>
            Book value per share
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pb-bvps"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatPbMoney(result.bookValuePerShare, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="pb-ratio" className={labelClass}>
            Price to book value ratio
          </label>
          <FieldShell muted>
            <input
              id="pb-ratio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result?.priceToBookRatio != null
                  ? formatRatio(result.priceToBookRatio)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              ×
            </span>
          </FieldShell>
          {result?.pbUnavailableReason ? (
            <p className="mt-1 text-xs text-amber-800" role="status">
              {result.pbUnavailableReason}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={input.showTangible}
          onClick={() => set({ showTangible: !input.showTangible })}
        >
          <span>Price to tangible book</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.showTangible ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {input.showTangible ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
            <div>
              <label htmlFor="pb-goodwill" className={labelClass}>
                Goodwill
                <InfoTooltip
                  label="Goodwill"
                  text="Goodwill deducted when computing tangible common equity."
                />
              </label>
              <FieldShell error={errors.goodwill}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="pb-goodwill"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.goodwill}
                  onChange={(e) => set({ goodwill: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.goodwill)}
                />
              </FieldShell>
              {errors.goodwill ? (
                <p className="mt-1 text-xs text-rose-600">{errors.goodwill}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="pb-intangibles" className={labelClass}>
                Other intangible assets
                <InfoTooltip
                  label="Other intangibles"
                  text="Other intangible assets excluded from tangible book value."
                />
              </label>
              <FieldShell error={errors.otherIntangibleAssets}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="pb-intangibles"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.otherIntangibleAssets}
                  onChange={(e) =>
                    set({ otherIntangibleAssets: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.otherIntangibleAssets)}
                />
              </FieldShell>
              {errors.otherIntangibleAssets ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.otherIntangibleAssets}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="pb-tbvps" className={labelClass}>
                Tangible book value per share
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="pb-tbvps"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold text-accent`}
                  value={
                    result?.tangibleBookValuePerShare != null
                      ? formatPbMoney(
                          result.tangibleBookValuePerShare,
                          input.currency
                        )
                      : ''
                  }
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
            </div>

            <div>
              <label htmlFor="pb-ptb" className={labelClass}>
                Price to tangible book ratio
              </label>
              <FieldShell muted>
                <input
                  id="pb-ptb"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold text-accent`}
                  value={
                    result?.priceToTangibleBookRatio != null
                      ? formatRatio(result.priceToTangibleBookRatio)
                      : ''
                  }
                  placeholder="—"
                  aria-readonly="true"
                />
                <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                  ×
                </span>
              </FieldShell>
              {result?.ptbUnavailableReason ? (
                <p className="mt-1 text-xs text-amber-800" role="status">
                  {result.ptbUnavailableReason}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
