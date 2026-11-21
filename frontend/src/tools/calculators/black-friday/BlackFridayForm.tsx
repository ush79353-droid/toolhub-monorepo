'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BlackFridayFieldErrors,
  BlackFridayInput,
  BlackFridayResult,
  BlackFridaySolveTarget,
  DiscountKind,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOLVE_LABELS: Record<BlackFridaySolveTarget, string> = {
  finalPrice: 'Final price',
  originalPrice: 'Original price',
  discountPercent: 'Discount percentage',
  savings: 'Savings amount',
};

interface BlackFridayFormProps {
  input: BlackFridayInput;
  errors: BlackFridayFieldErrors;
  result: BlackFridayResult | null;
  onChange: (input: BlackFridayInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function BlackFridayForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: BlackFridayFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BlackFridayInput>) =>
    onChange({ ...input, ...patch });
  const forward = input.solveTarget === 'finalPrice';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Calculate Black Friday sale prices from original price and discount.
        Optional sales tax applies to the discounted price. Currency is
        denomination only (not FX). Stacked percentage discounts are sequential,
        not additive.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="bf-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="bf-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="bf-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as BlackFridaySolveTarget,
            })
          }
        >
          {(Object.keys(SOLVE_LABELS) as BlackFridaySolveTarget[]).map((t) => (
            <option key={t} value={t}>
              {SOLVE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($200 · 35% off · 8% tax → $140.40)
      </button>

      {(forward ||
        input.solveTarget === 'discountPercent' ||
        input.solveTarget === 'savings') && (
        <div>
          <label htmlFor="bf-orig" className={labelClass}>
            Original Price
            <InfoTooltip
              label="Original Price"
              text="The regular price of the item before any Black Friday discount is applied."
            />
          </label>
          <FieldShell error={errors.originalPrice}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="bf-orig"
              className={inputClass}
              inputMode="decimal"
              value={input.originalPrice}
              onChange={(e) => set({ originalPrice: e.target.value })}
              placeholder="200"
            />
          </FieldShell>
          {errors.originalPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalPrice}</p>
          ) : null}
        </div>
      )}

      {forward ? (
        <>
          <div>
            <label htmlFor="bf-kind" className={labelClass}>
              Discount type
            </label>
            <select
              id="bf-kind"
              className={selectClass}
              value={input.discountKind}
              onChange={(e) =>
                set({
                  discountKind: e.target.value as DiscountKind,
                  enableSecondDiscount:
                    e.target.value === 'fixed'
                      ? false
                      : input.enableSecondDiscount,
                })
              }
            >
              <option value="percentage">Percentage discount</option>
              <option value="fixed">Fixed amount discount</option>
            </select>
          </div>

          {input.discountKind === 'percentage' ? (
            <>
              <div>
                <label htmlFor="bf-disc" className={labelClass}>
                  Discount
                  <InfoTooltip
                    label="Discount"
                    text="The percentage reduction offered on the item's original price."
                  />
                </label>
                <FieldShell error={errors.discountPercentage}>
                  <input
                    id="bf-disc"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.discountPercentage}
                    onChange={(e) =>
                      set({ discountPercentage: e.target.value })
                    }
                    placeholder="35"
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.discountPercentage ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.discountPercentage}
                  </p>
                ) : null}
              </div>

              <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={input.enableSecondDiscount}
                  onChange={(e) =>
                    set({ enableSecondDiscount: e.target.checked })
                  }
                />
                Add a second successive percentage discount
              </label>
              {input.enableSecondDiscount ? (
                <div>
                  <label htmlFor="bf-disc2" className={labelClass}>
                    Second discount
                  </label>
                  <FieldShell error={errors.secondDiscountPercentage}>
                    <input
                      id="bf-disc2"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.secondDiscountPercentage}
                      onChange={(e) =>
                        set({ secondDiscountPercentage: e.target.value })
                      }
                      placeholder="20"
                    />
                    <span className="pr-3 text-sm text-muted-foreground">%</span>
                  </FieldShell>
                  {errors.secondDiscountPercentage ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.secondDiscountPercentage}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <div>
              <label htmlFor="bf-fixed" className={labelClass}>
                Fixed discount
                <InfoTooltip
                  label="Fixed discount"
                  text="A fixed currency amount off the original price. Cannot exceed the original price."
                />
              </label>
              <FieldShell error={errors.fixedDiscount}>
                <span className="pl-3 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="bf-fixed"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fixedDiscount}
                  onChange={(e) => set({ fixedDiscount: e.target.value })}
                  placeholder="25"
                />
              </FieldShell>
              {errors.fixedDiscount ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.fixedDiscount}
                </p>
              ) : null}
            </div>
          )}

          <fieldset className="space-y-2">
            <legend className={labelClass}>Is Sales Tax Applied?</legend>
            <div className="flex gap-4 text-sm text-accent">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bf-tax"
                  checked={input.applySalesTax}
                  onChange={() => set({ applySalesTax: true })}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bf-tax"
                  checked={!input.applySalesTax}
                  onChange={() =>
                    set({ applySalesTax: false, salesTaxRate: '' })
                  }
                />
                No
              </label>
            </div>
          </fieldset>

          {input.applySalesTax ? (
            <div>
              <label htmlFor="bf-tax-rate" className={labelClass}>
                Sales Tax Rate
                <InfoTooltip
                  label="Sales Tax Rate"
                  text="The applicable sales tax percentage. For the standard calculation, tax is applied to the discounted price. Rules vary by jurisdiction."
                />
              </label>
              <FieldShell error={errors.salesTaxRate}>
                <input
                  id="bf-tax-rate"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesTaxRate}
                  onChange={(e) => set({ salesTaxRate: e.target.value })}
                  placeholder="8"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.salesTaxRate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salesTaxRate}</p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      {input.solveTarget === 'originalPrice' ? (
        <>
          <div>
            <label htmlFor="bf-disc-rev" className={labelClass}>
              Discount
            </label>
            <FieldShell error={errors.discountPercentage}>
              <input
                id="bf-disc-rev"
                className={inputClass}
                inputMode="decimal"
                value={input.discountPercentage}
                onChange={(e) => set({ discountPercentage: e.target.value })}
                placeholder="20"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.discountPercentage ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.discountPercentage}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="bf-disc-price" className={labelClass}>
              Discounted price (pre-tax)
            </label>
            <FieldShell error={errors.discountedPrice}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="bf-disc-price"
                className={inputClass}
                inputMode="decimal"
                value={input.discountedPrice}
                onChange={(e) => set({ discountedPrice: e.target.value })}
                placeholder="80"
              />
            </FieldShell>
            {errors.discountedPrice ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.discountedPrice}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {(input.solveTarget === 'discountPercent' ||
        input.solveTarget === 'savings') && (
        <div>
          <label htmlFor="bf-disc-price2" className={labelClass}>
            Discounted price (pre-tax)
          </label>
          <FieldShell error={errors.discountedPrice}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="bf-disc-price2"
              className={inputClass}
              inputMode="decimal"
              value={input.discountedPrice}
              onChange={(e) => set({ discountedPrice: e.target.value })}
              placeholder="130"
            />
          </FieldShell>
          {errors.discountedPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountedPrice}</p>
          ) : null}
        </div>
      )}

      {result && forward ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/10 px-3 py-2 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Final price</span>
            <span className="tabular-nums font-semibold text-accent">
              {result.formattedFinal}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">You save (before tax)</span>
            <span className="tabular-nums font-medium text-accent">
              {result.formattedSavings}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Savings percentage</span>
            <span className="tabular-nums font-medium text-accent">
              {result.formattedSavingsPct}
            </span>
          </div>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
