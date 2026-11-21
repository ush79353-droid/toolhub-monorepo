'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXAMPLE_NEW_BED,
  EXAMPLE_NEW_DRESS,
  type PercentageDiscountFieldErrors,
  type PercentageDiscountInput,
  type PercentageDiscountResult,
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

interface PercentageDiscountFormProps {
  input: PercentageDiscountInput;
  errors: PercentageDiscountFieldErrors;
  result: PercentageDiscountResult | null;
  onChange: (input: PercentageDiscountInput) => void;
  onPriceBeforeCurrencyChange: (next: SupportedCurrency) => void;
  onPriceAfterCurrencyChange: (next: SupportedCurrency) => void;
  onYouSaveCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function PercentageDiscountForm({
  input,
  errors,
  result,
  onChange,
  onPriceBeforeCurrencyChange,
  onPriceAfterCurrencyChange,
  onYouSaveCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: PercentageDiscountFormProps) {
  const beforeSymbol = getCurrencySymbol(input.priceBeforeCurrency);
  const afterSymbol = getCurrencySymbol(input.priceAfterCurrency);
  const saveSymbol = getCurrencySymbol(input.youSaveCurrency);

  const set = (patch: Partial<PercentageDiscountInput>) => {
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
          <label className={labelClass} htmlFor="pd-price-before">
            <span>Price before discount</span>
            <InfoTooltip
              label="Price before discount"
              text="List or sticker price before the percent-off discount. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.priceBefore}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {beforeSymbol}
              </span>
              <input
                id="pd-price-before"
                className={inputClass}
                inputMode="decimal"
                value={input.priceBefore}
                aria-invalid={Boolean(errors.priceBefore)}
                onChange={(e) => set({ priceBefore: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pd-price-before-currency"
                value={input.priceBeforeCurrency}
                onChange={onPriceBeforeCurrencyChange}
                aria-label="Price before discount currency"
              />
            </div>
          </div>
          {errors.priceBefore ? (
            <p className="mt-1 text-xs text-rose-600">{errors.priceBefore}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pd-discount">
            <span>Discount</span>
          </label>
          <FieldShell error={errors.discountPercent}>
            <input
              id="pd-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.discountPercent}
              aria-invalid={Boolean(errors.discountPercent)}
              onChange={(e) => set({ discountPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.discountPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pd-price-after">
            <span>Price after discount</span>
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
                id="pd-price-after"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedPriceAfter ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pd-price-after-currency"
                value={input.priceAfterCurrency}
                onChange={onPriceAfterCurrencyChange}
                aria-label="Price after discount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="pd-you-save">
            <span>You save</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {saveSymbol}
              </span>
              <input
                id="pd-you-save"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedYouSave ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pd-you-save-currency"
                value={input.youSaveCurrency}
                onChange={onYouSaveCurrencyChange}
                aria-label="You save currency"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out the{' '}
        <Link
          href="/tools/discount-calculator"
          className="font-semibold text-primary underline underline-offset-2"
        >
          advanced version
        </Link>{' '}
        of this discount calculator.
      </div>

      <div className="rounded-xl border border-border bg-white px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
        <p className="font-medium text-accent">Check our examples:</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_NEW_DRESS,
                  priceBeforeCurrency: input.priceBeforeCurrency,
                  priceAfterCurrency: input.priceAfterCurrency,
                  youSaveCurrency: input.youSaveCurrency,
                })
              }
            >
 Example 1: new dress with 20% discount
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_NEW_BED,
                  priceBeforeCurrency: input.priceBeforeCurrency,
                  priceAfterCurrency: input.priceAfterCurrency,
                  youSaveCurrency: input.youSaveCurrency,
                })
              }
            >
 Example 2: new bed with 15% discount
            </button>
          </li>
        </ul>
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
