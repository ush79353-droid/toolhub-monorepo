'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PercentOffFieldErrors,
  PercentOffInput,
  PercentOffSolveMode,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

const MODE_LABELS: Record<PercentOffSolveMode, string> = {
  finalPrice: 'Calculate final price',
  originalPrice: 'Find original price',
  discountPercent: 'Find discount percentage',
};

interface PercentOffFormProps {
  input: PercentOffInput;
  errors: PercentOffFieldErrors;
  onChange: (next: PercentOffInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function PercentOffForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: PercentOffFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PercentOffInput>) =>
    onChange({ ...input, ...patch });
  const forward = input.solveMode === 'finalPrice';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Percent off reduces price by a percentage of the current amount.
        Stacked discounts are sequential (20% then 10% ≠ 30%). Optional sales
        tax applies to the discounted price. Currency is denomination only
        (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="po-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="po-mode" className={labelClass}>
          Calculation Mode
        </label>
        <select
          id="po-mode"
          className={selectClass}
          value={input.solveMode}
          onChange={(e) =>
            set({
              solveMode: e.target.value as PercentOffSolveMode,
              enableAdditionalDiscount:
                e.target.value === 'finalPrice'
                  ? input.enableAdditionalDiscount
                  : false,
            })
          }
        >
          {(Object.keys(MODE_LABELS) as PercentOffSolveMode[]).map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($200 · 25% off → $150)
      </button>

      {(forward || input.solveMode === 'discountPercent') && (
        <div>
          <label htmlFor="po-orig" className={labelClass}>
            Original Price
            <InfoTooltip
              label="Original Price"
              text="The price of an item before any discount is applied."
            />
          </label>
          <FieldShell error={errors.originalPrice}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="po-orig"
              className={inputClass}
              inputMode="decimal"
              value={input.originalPrice}
              onChange={(e) => set({ originalPrice: e.target.value })}
              placeholder="200"
              aria-invalid={Boolean(errors.originalPrice)}
            />
          </FieldShell>
          {errors.originalPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalPrice}</p>
          ) : null}
        </div>
      )}

      {(forward || input.solveMode === 'originalPrice') && (
        <div>
          <label htmlFor="po-pct" className={labelClass}>
            Percent Off
            <InfoTooltip
              label="Percent Off"
              text="Percentage discount from 0% to 100%."
            />
          </label>
          <FieldShell error={errors.discountPercent}>
            <input
              id="po-pct"
              className={inputClass}
              inputMode="decimal"
              value={input.discountPercent}
              onChange={(e) => set({ discountPercent: e.target.value })}
              placeholder="25"
              aria-invalid={Boolean(errors.discountPercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.discountPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.discountPercent}
            </p>
          ) : null}
        </div>
      )}

      {!forward && (
        <div>
          <label htmlFor="po-sale" className={labelClass}>
            {input.solveMode === 'originalPrice'
              ? 'Final / Sale Price'
              : 'Sale Price'}
          </label>
          <FieldShell error={errors.salePrice}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="po-sale"
              className={inputClass}
              inputMode="decimal"
              value={input.salePrice}
              onChange={(e) => set({ salePrice: e.target.value })}
              placeholder="150"
              aria-invalid={Boolean(errors.salePrice)}
            />
          </FieldShell>
          {errors.salePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.salePrice}</p>
          ) : null}
        </div>
      )}

      {forward ? (
        <>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="mt-1"
              checked={input.enableAdditionalDiscount}
              onChange={(e) =>
                set({ enableAdditionalDiscount: e.target.checked })
              }
            />
            <span>
              Add another percentage discount
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                Applied to the price remaining after the first discount — not
                added to the first percentage.
              </span>
            </span>
          </label>
          {input.enableAdditionalDiscount ? (
            <div>
              <label htmlFor="po-addl" className={labelClass}>
                Additional Discount
              </label>
              <FieldShell error={errors.additionalDiscountPercent}>
                <input
                  id="po-addl"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.additionalDiscountPercent}
                  onChange={(e) =>
                    set({ additionalDiscountPercent: e.target.value })
                  }
                  placeholder="10"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.additionalDiscountPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.additionalDiscountPercent}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-accent"
          onClick={() =>
            set({
              showSalesTaxSection: !input.showSalesTaxSection,
              applySalesTax: !input.showSalesTaxSection
                ? input.applySalesTax
                : false,
            })
          }
          aria-expanded={input.showSalesTaxSection}
        >
          <span>Sales Tax</span>
          <span className="text-xs text-muted-foreground">
            {input.showSalesTaxSection ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showSalesTaxSection ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                checked={input.applySalesTax}
                onChange={(e) => set({ applySalesTax: e.target.checked })}
              />
              Include sales tax
            </label>
            {input.applySalesTax ? (
              <div>
                <label htmlFor="po-tax" className={labelClass}>
                  Sales Tax Rate
                  <InfoTooltip
                    label="Sales tax"
                    text="Applied to the discounted price by default. Tax rules vary by jurisdiction."
                  />
                </label>
                <FieldShell error={errors.salesTaxRate}>
                  <input
                    id="po-tax"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.salesTaxRate}
                    onChange={(e) => set({ salesTaxRate: e.target.value })}
                    placeholder="8"
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.salesTaxRate ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.salesTaxRate}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
