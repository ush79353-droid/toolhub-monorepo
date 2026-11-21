'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  TripleDiscountFieldErrors,
  TripleDiscountInput,
  TripleDiscountResult,
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

interface TripleDiscountFormProps {
  input: TripleDiscountInput;
  errors: TripleDiscountFieldErrors;
  result: TripleDiscountResult | null;
  onChange: (input: TripleDiscountInput) => void;
  onOriginalPriceCurrencyChange: (next: SupportedCurrency) => void;
  onFinalPriceCurrencyChange: (next: SupportedCurrency) => void;
  onPriceDifferenceCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function TripleDiscountForm({
  input,
  errors,
  result,
  onChange,
  onOriginalPriceCurrencyChange,
  onFinalPriceCurrencyChange,
  onPriceDifferenceCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: TripleDiscountFormProps) {
  const priceSymbol = getCurrencySymbol(input.originalPriceCurrency);
  const finalSymbol = getCurrencySymbol(input.finalPriceCurrency);
  const diffSymbol = getCurrencySymbol(input.priceDifferenceCurrency);

  const set = (patch: Partial<TripleDiscountInput>) => {
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
          <label className={labelClass} htmlFor="td-original-price">
            <span>Original price</span>
            <InfoTooltip
              label="Original price"
              text="List or sticker price before any percent-off discount. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.originalPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {priceSymbol}
              </span>
              <input
                id="td-original-price"
                className={inputClass}
                inputMode="decimal"
                value={input.originalPrice}
                aria-invalid={Boolean(errors.originalPrice)}
                onChange={(e) => set({ originalPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="td-original-price-currency"
                value={input.originalPriceCurrency}
                onChange={onOriginalPriceCurrencyChange}
                aria-label="Original price currency"
              />
            </div>
          </div>
          {errors.originalPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="td-first-discount">
            <span>1st discount</span>
          </label>
          <FieldShell error={errors.firstDiscountPercent}>
            <input
              id="td-first-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.firstDiscountPercent}
              aria-invalid={Boolean(errors.firstDiscountPercent)}
              onChange={(e) => set({ firstDiscountPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.firstDiscountPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.firstDiscountPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="td-second-discount">
            <span>2nd discount</span>
            <InfoTooltip
              label="2nd discount"
              text="Applied after the 1st discount, on the already-reduced price; not added to the first percent. Defaults to 0%."
            />
          </label>
          <FieldShell error={errors.secondDiscountPercent}>
            <input
              id="td-second-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.secondDiscountPercent}
              aria-invalid={Boolean(errors.secondDiscountPercent)}
              onChange={(e) => set({ secondDiscountPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.secondDiscountPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.secondDiscountPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="td-third-discount">
            <span>3rd discount</span>
            <InfoTooltip
              label="3rd discount"
              text="Applied after the 2nd discount, on the twice-reduced price; not added to the prior percents. Defaults to 0%."
            />
          </label>
          <FieldShell error={errors.thirdDiscountPercent}>
            <input
              id="td-third-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.thirdDiscountPercent}
              aria-invalid={Boolean(errors.thirdDiscountPercent)}
              onChange={(e) => set({ thirdDiscountPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.thirdDiscountPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.thirdDiscountPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="td-final-price">
            <span>Final price</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {finalSymbol}
              </span>
              <input
                id="td-final-price"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedFinalPrice ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="td-final-price-currency"
                value={input.finalPriceCurrency}
                onChange={onFinalPriceCurrencyChange}
                aria-label="Final price currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="td-price-difference">
            <span>Price difference</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {diffSymbol}
              </span>
              <input
                id="td-price-difference"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedPriceDifference ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="td-price-difference-currency"
                value={input.priceDifferenceCurrency}
                onChange={onPriceDifferenceCurrencyChange}
                aria-label="Price difference currency"
              />
            </div>
          </div>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.effectiveOpen}
        onToggle={(event) => set({ effectiveOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.effectiveOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Effective discount</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="td-effective-discount">
              <span>Effective discount</span>
              <InfoTooltip
                label="Effective discount"
                text="Single combined percent equal to all three sequential discounts: [1 − (1−D1/100)(1−D2/100)(1−D3/100)] × 100. Never FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="td-effective-discount"
                className={`${inputClass} pr-8`}
                readOnly
                tabIndex={-1}
                value={result?.formattedEffectiveDiscountPercent ?? ''}
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
        </div>
      </details>

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
