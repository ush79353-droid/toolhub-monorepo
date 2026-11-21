'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  StockSplitFieldErrors,
  StockSplitInput,
  StockSplitResult,
} from './types';

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

interface StockSplitFormProps {
  input: StockSplitInput;
  errors: StockSplitFieldErrors;
  result: StockSplitResult | null;
  onChange: (input: StockSplitInput) => void;
  onSharePriceBeforeCurrencyChange: (next: SupportedCurrency) => void;
  onSharePriceAfterCurrencyChange: (next: SupportedCurrency) => void;
  onPortfolioValueCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function StockSplitForm({
  input,
  errors,
  result,
  onChange,
  onSharePriceBeforeCurrencyChange,
  onSharePriceAfterCurrencyChange,
  onPortfolioValueCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: StockSplitFormProps) {
  const beforeSymbol = getCurrencySymbol(input.sharePriceBeforeCurrency);
  const afterSymbol = getCurrencySymbol(input.sharePriceAfterCurrency);
  const portfolioSymbol = getCurrencySymbol(input.portfolioValueCurrency);

  const set = (patch: Partial<StockSplitInput>) => {
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
        <h3 className={sectionTitleClass}>Before stock split</h3>

        <div>
          <label className={labelClass} htmlFor="ss-shares-before">
            <span>Number of shares</span>
            <InfoTooltip
              label="Number of shares"
              text="Shares you hold before the split. Must be positive. Quantity is never FX-converted."
            />
          </label>
          <FieldShell error={errors.sharesBefore}>
            <input
              id="ss-shares-before"
              className={inputClass}
              inputMode="decimal"
              value={input.sharesBefore}
              aria-invalid={Boolean(errors.sharesBefore)}
              onChange={(e) => set({ sharesBefore: e.target.value })}
            />
          </FieldShell>
          {errors.sharesBefore ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sharesBefore}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ss-price-before">
            <span>Share price</span>
            <InfoTooltip
              label="Share price"
              text="Per-share price before the split. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.sharePriceBefore}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {beforeSymbol}
              </span>
              <input
                id="ss-price-before"
                className={inputClass}
                inputMode="decimal"
                value={input.sharePriceBefore}
                aria-invalid={Boolean(errors.sharePriceBefore)}
                onChange={(e) => set({ sharePriceBefore: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ss-price-before-currency"
                value={input.sharePriceBeforeCurrency}
                onChange={onSharePriceBeforeCurrencyChange}
                aria-label="Share price before currency"
              />
            </div>
          </div>
          {errors.sharePriceBefore ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sharePriceBefore}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Stock split ratio</h3>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          A stock split ratio determines the number of new shares given per existing
 share, for example, a 2-for-1 split gives two new shares for every one old
          share. Reverse splits such as 1-for-5 are supported the same way.
        </p>
        <div>
          <label className={labelClass} htmlFor="ss-ratio-a">
            <span>A-for-B ratio</span>
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.ratioA}>
              <input
                id="ss-ratio-a"
                className={inputClass}
                inputMode="decimal"
                value={input.ratioA}
                aria-label="Ratio A (new shares)"
                aria-invalid={Boolean(errors.ratioA)}
                onChange={(e) => set({ ratioA: e.target.value })}
              />
            </FieldShell>
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              -for-
            </span>
            <FieldShell error={errors.ratioB}>
              <input
                id="ss-ratio-b"
                className={inputClass}
                inputMode="decimal"
                value={input.ratioB}
                aria-label="Ratio B (old shares)"
                aria-invalid={Boolean(errors.ratioB)}
                onChange={(e) => set({ ratioB: e.target.value })}
              />
            </FieldShell>
          </div>
          {errors.ratioA ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ratioA}</p>
          ) : null}
          {errors.ratioB ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ratioB}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>After stock split</h3>

        <div>
          <label className={labelClass} htmlFor="ss-shares-after">
            <span>Number of shares</span>
          </label>
          <FieldShell muted>
            <input
              id="ss-shares-after"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedSharesAfter ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ss-price-after">
            <span>Share price</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {afterSymbol}
              </span>
              <input
                id="ss-price-after"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedSharePriceAfter ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ss-price-after-currency"
                value={input.sharePriceAfterCurrency}
                onChange={onSharePriceAfterCurrencyChange}
                aria-label="Share price after currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ss-portfolio-before">
            <span>Portfolio value before</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {portfolioSymbol}
              </span>
              <input
                id="ss-portfolio-before"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedPortfolioValueBefore ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ss-portfolio-currency"
                value={input.portfolioValueCurrency}
                onChange={onPortfolioValueCurrencyChange}
                aria-label="Portfolio value currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ss-portfolio-after">
            <span>Portfolio value after</span>
            <InfoTooltip
              label="Portfolio value after"
              text="Theoretically equal to portfolio value before. Uses the same currency selector as portfolio value before."
            />
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {portfolioSymbol}
            </span>
            <input
              id="ss-portfolio-after"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedPortfolioValueAfter ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
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
