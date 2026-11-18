'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarginDiscountDriver,
  MarginWithDiscountFieldErrors,
  MarginWithDiscountInput,
  MarginWithDiscountResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const sectionTitleClass = 'text-[13px] font-semibold text-accent';

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

interface MarginWithDiscountFormProps {
  input: MarginWithDiscountInput;
  errors: MarginWithDiscountFieldErrors;
  result: MarginWithDiscountResult | null;
  onChange: (input: MarginWithDiscountInput) => void;
  onCostCurrencyChange: (next: SupportedCurrency) => void;
  onBaseRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onPriceAfterDiscountCurrencyChange: (next: SupportedCurrency) => void;
  onProfitCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function MarginWithDiscountForm({
  input,
  errors,
  result,
  onChange,
  onCostCurrencyChange,
  onBaseRevenueCurrencyChange,
  onPriceAfterDiscountCurrencyChange,
  onProfitCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MarginWithDiscountFormProps) {
  const costSymbol = getCurrencySymbol(input.costCurrency);
  const revenueSymbol = getCurrencySymbol(input.baseRevenueCurrency);
  const priceSymbol = getCurrencySymbol(input.priceAfterDiscountCurrency);
  const profitSymbol = getCurrencySymbol(input.profitCurrency);

  const set = (patch: Partial<MarginWithDiscountInput>) => {
    onChange({ ...input, ...patch });
  };

  const setDriver = (
    driver: MarginDiscountDriver,
    patch: Partial<MarginWithDiscountInput>
  ) => {
    onChange({ ...input, ...patch, driver });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Margin, markup, and revenue</h3>

        <div>
          <label className={labelClass} htmlFor="mwd-cost">
            <span>Cost before discount</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cost}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {costSymbol}
              </span>
              <input
                id="mwd-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.cost}
                aria-invalid={Boolean(errors.cost)}
                onChange={(e) => set({ cost: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mwd-cost-currency"
                value={input.costCurrency}
                onChange={onCostCurrencyChange}
                aria-label="Cost before discount currency"
              />
            </div>
          </div>
          {errors.cost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cost}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mwd-base-margin">
            <span>Base margin</span>
            <InfoTooltip
              label="Base margin"
              text="Target profit as a percent of base revenue (selling price). Must be less than 100%. Editing this field makes margin authoritative and syncs markup and revenue."
            />
          </label>
          <FieldShell error={errors.baseMargin}>
            <input
              id="mwd-base-margin"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.baseMargin}
              aria-invalid={Boolean(errors.baseMargin)}
              onChange={(e) => setDriver('margin', { baseMargin: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.baseMargin ? (
            <p className="mt-1 text-xs text-rose-600">{errors.baseMargin}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mwd-base-markup">
            <span>Base markup</span>
            <InfoTooltip
              label="Base markup"
              text="Target profit as a percent of cost. Editing this field makes markup authoritative and syncs margin and revenue."
            />
          </label>
          <FieldShell error={errors.baseMarkup}>
            <input
              id="mwd-base-markup"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.baseMarkup}
              aria-invalid={Boolean(errors.baseMarkup)}
              onChange={(e) => setDriver('markup', { baseMarkup: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.baseMarkup ? (
            <p className="mt-1 text-xs text-rose-600">{errors.baseMarkup}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mwd-base-revenue">
            <span>Base revenue</span>
            <InfoTooltip
              label="Base revenue"
              text="Selling price before discount. Derived from cost and margin or markup, or enter it directly to derive both percents. Changing currency converts this amount."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.baseRevenue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revenueSymbol}
              </span>
              <input
                id="mwd-base-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.baseRevenue}
                aria-invalid={Boolean(errors.baseRevenue)}
                onChange={(e) =>
                  setDriver('revenue', { baseRevenue: e.target.value })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mwd-base-revenue-currency"
                value={input.baseRevenueCurrency}
                onChange={onBaseRevenueCurrencyChange}
                aria-label="Base revenue currency"
              />
            </div>
          </div>
          {errors.baseRevenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.baseRevenue}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>How much discount is being applied?</h3>
        <div>
          <label className={labelClass} htmlFor="mwd-discount">
            <span>Discount</span>
          </label>
          <FieldShell error={errors.discountPercent}>
            <input
              id="mwd-discount"
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
      </div>

      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>How the discount affects you</h3>

        <div>
          <label className={labelClass} htmlFor="mwd-price-after">
            <span>Price after discount</span>
            <InfoTooltip
              label="Price after discount"
              text="Base revenue × (1 − discount/100), shown in the selected currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {priceSymbol}
              </span>
              <input
                id="mwd-price-after"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedPriceAfterDiscount ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mwd-price-after-currency"
                value={input.priceAfterDiscountCurrency}
                onChange={onPriceAfterDiscountCurrencyChange}
                aria-label="Price after discount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mwd-true-margin">
            <span>True margin</span>
          </label>
          <FieldShell muted>
            <input
              id="mwd-true-margin"
              className={`${inputClass} pr-8`}
              readOnly
              tabIndex={-1}
              value={result?.formattedTrueMargin ?? ''}
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

        <div>
          <label className={labelClass} htmlFor="mwd-true-markup">
            <span>True markup</span>
          </label>
          <FieldShell muted>
            <input
              id="mwd-true-markup"
              className={`${inputClass} pr-8`}
              readOnly
              tabIndex={-1}
              value={result?.formattedTrueMarkup ?? ''}
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

        <div>
          <label className={labelClass} htmlFor="mwd-profit">
            <span>Profit</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {profitSymbol}
              </span>
              <input
                id="mwd-profit"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedProfit ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mwd-profit-currency"
                value={input.profitCurrency}
                onChange={onProfitCurrencyChange}
                aria-label="Profit currency"
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
