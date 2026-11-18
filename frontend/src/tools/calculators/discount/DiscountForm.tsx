'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DISCOUNT_TYPE_OPTIONS,
  type DiscountFieldErrors,
  type DiscountInput,
  type DiscountResult,
  type DiscountType,
  type TaxIncluded,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
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

interface DiscountFormProps {
  input: DiscountInput;
  errors: DiscountFieldErrors;
  result: DiscountResult | null;
  onChange: (input: DiscountInput) => void;
  onOriginalPriceCurrencyChange: (next: SupportedCurrency) => void;
  onYouPayCurrencyChange: (next: SupportedCurrency) => void;
  onYouSaveCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function DiscountForm({
  input,
  errors,
  result,
  onChange,
  onOriginalPriceCurrencyChange,
  onYouPayCurrencyChange,
  onYouSaveCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: DiscountFormProps) {
  const priceSymbol = getCurrencySymbol(input.originalPriceCurrency);
  const paySymbol = getCurrencySymbol(input.youPayCurrency);
  const saveSymbol = getCurrencySymbol(input.youSaveCurrency);

  const set = (patch: Partial<DiscountInput>) => {
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
          <label className={labelClass} htmlFor="disc-type">
            <span>What type of discount?</span>
          </label>
          <select
            id="disc-type"
            className={selectClass}
            value={input.discountType}
            onChange={(e) =>
              set({ discountType: e.target.value as DiscountType })
            }
          >
            {DISCOUNT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="disc-original-price">
            <span>Original price</span>
            <InfoTooltip
              label="Original price"
              text="List or sticker price before the percent-off discount. Changing currency converts this amount with stored FX rates."
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
                id="disc-original-price"
                className={inputClass}
                inputMode="decimal"
                value={input.originalPrice}
                aria-invalid={Boolean(errors.originalPrice)}
                onChange={(e) => set({ originalPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="disc-original-price-currency"
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
          <label className={labelClass} htmlFor="disc-percent">
            <span>Discount</span>
          </label>
          <FieldShell error={errors.discountPercent}>
            <input
              id="disc-percent"
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

        <fieldset>
          <legend className={labelClass}>
            <span>Tax included?</span>
            <InfoTooltip
              label="Tax included"
              text="Yes means the original price already includes tax; No means it excludes tax. No tax rate is applied — this is a label only."
            />
          </legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="disc-tax-included"
                  className="h-4 w-4 accent-primary"
                  checked={input.taxIncluded === option.value}
                  onChange={() =>
                    set({ taxIncluded: option.value as TaxIncluded })
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <h3 className="text-[15px] font-semibold text-accent">After discount</h3>

        <div>
          <label className={labelClass} htmlFor="disc-you-pay">
            <span>You pay</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {paySymbol}
              </span>
              <input
                id="disc-you-pay"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedYouPay ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="disc-you-pay-currency"
                value={input.youPayCurrency}
                onChange={onYouPayCurrencyChange}
                aria-label="You pay currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="disc-you-save">
            <span>You&apos;re saving</span>
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
                id="disc-you-save"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedYouSave ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="disc-you-save-currency"
                value={input.youSaveCurrency}
                onChange={onYouSaveCurrencyChange}
                aria-label="You're saving currency"
              />
            </div>
          </div>
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
