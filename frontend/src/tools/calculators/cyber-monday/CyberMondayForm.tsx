'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEAL_TYPE_LABELS,
  type CouponOrder,
  type CyberMondayDealType,
  type CyberMondayFieldErrors,
  type CyberMondayInput,
  type CyberMondayResult,
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

interface CyberMondayFormProps {
  input: CyberMondayInput;
  errors: CyberMondayFieldErrors;
  result: CyberMondayResult | null;
  onChange: (input: CyberMondayInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CyberMondayForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CyberMondayFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CyberMondayInput>) =>
    onChange({ ...input, ...patch });
  const t = input.dealType;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Evaluate a Cyber Monday offer: enter the unit price, choose a deal type,
        then add tax and shipping. Currency is denomination only (not FX). Tax
        and free-shipping rules vary by retailer and location.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="cm-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($200 · 25% · tax 8% · ship $10 → $172)
      </button>

      <h3 className="text-sm font-semibold text-accent">What is the deal?</h3>

      <div>
        <label htmlFor="cm-deal" className={labelClass}>
          Deal type
        </label>
        <select
          id="cm-deal"
          className={selectClass}
          value={input.dealType}
          onChange={(e) =>
            set({ dealType: e.target.value as CyberMondayDealType })
          }
        >
          {(Object.keys(DEAL_TYPE_LABELS) as CyberMondayDealType[]).map(
            (key) => (
              <option key={key} value={key}>
                {DEAL_TYPE_LABELS[key]}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label htmlFor="cm-price" className={labelClass}>
          Original / unit price
          <InfoTooltip
            label="Original price"
            text="Unit price before the Cyber Monday promotion. Multiplied by quantity for order subtotals."
          />
        </label>
        <FieldShell error={errors.originalPrice}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="cm-price"
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

      <div>
        <label htmlFor="cm-qty" className={labelClass}>
          Quantity
        </label>
        <FieldShell error={errors.quantity}>
          <input
            id="cm-qty"
            className={inputClass}
            inputMode="numeric"
            value={input.quantity}
            onChange={(e) => set({ quantity: e.target.value })}
            placeholder="1"
          />
        </FieldShell>
        {errors.quantity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
        ) : null}
      </div>

      {(t === 'percentage' ||
        t === 'double' ||
        t === 'triple' ||
        t === 'percentage-plus-coupon') && (
        <div>
          <label htmlFor="cm-pct" className={labelClass}>
            {t === 'double' || t === 'triple'
              ? 'First discount %'
              : 'Discount %'}
          </label>
          <FieldShell error={errors.discountPercentage}>
            <input
              id="cm-pct"
              className={inputClass}
              inputMode="decimal"
              value={input.discountPercentage}
              onChange={(e) => set({ discountPercentage: e.target.value })}
              placeholder="25"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.discountPercentage ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.discountPercentage}
            </p>
          ) : null}
        </div>
      )}

      {(t === 'double' || t === 'triple') && (
        <div>
          <label htmlFor="cm-pct2" className={labelClass}>
            Second discount %
          </label>
          <FieldShell error={errors.secondDiscountPercentage}>
            <input
              id="cm-pct2"
              className={inputClass}
              inputMode="decimal"
              value={input.secondDiscountPercentage}
              onChange={(e) =>
                set({ secondDiscountPercentage: e.target.value })
              }
              placeholder="10"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.secondDiscountPercentage ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.secondDiscountPercentage}
            </p>
          ) : null}
        </div>
      )}

      {t === 'triple' && (
        <div>
          <label htmlFor="cm-pct3" className={labelClass}>
            Third discount %
          </label>
          <FieldShell error={errors.thirdDiscountPercentage}>
            <input
              id="cm-pct3"
              className={inputClass}
              inputMode="decimal"
              value={input.thirdDiscountPercentage}
              onChange={(e) =>
                set({ thirdDiscountPercentage: e.target.value })
              }
              placeholder="5"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.thirdDiscountPercentage ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.thirdDiscountPercentage}
            </p>
          ) : null}
        </div>
      )}

      {t === 'fixed' && (
        <div>
          <label htmlFor="cm-fixed" className={labelClass}>
            Fixed amount off
          </label>
          <FieldShell error={errors.fixedDiscount}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="cm-fixed"
              className={inputClass}
              inputMode="decimal"
              value={input.fixedDiscount}
              onChange={(e) => set({ fixedDiscount: e.target.value })}
              placeholder="30"
            />
          </FieldShell>
          {errors.fixedDiscount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fixedDiscount}</p>
          ) : null}
        </div>
      )}

      {t === 'bogo-discounted' && (
        <div>
          <label htmlFor="cm-second" className={labelClass}>
            Second item discount
          </label>
          <FieldShell error={errors.secondItemDiscountPercentage}>
            <input
              id="cm-second"
              className={inputClass}
              inputMode="decimal"
              value={input.secondItemDiscountPercentage}
              onChange={(e) =>
                set({ secondItemDiscountPercentage: e.target.value })
              }
              placeholder="50"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.secondItemDiscountPercentage ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.secondItemDiscountPercentage}
            </p>
          ) : null}
        </div>
      )}

      {(t === 'buy-x-get-y-free' || t === 'buy-x-pay-y') && (
        <div>
          <label htmlFor="cm-buyx" className={labelClass}>
            Buy quantity (X)
          </label>
          <FieldShell error={errors.buyQuantity}>
            <input
              id="cm-buyx"
              className={inputClass}
              inputMode="numeric"
              value={input.buyQuantity}
              onChange={(e) => set({ buyQuantity: e.target.value })}
              placeholder="2"
            />
          </FieldShell>
          {errors.buyQuantity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buyQuantity}</p>
          ) : null}
        </div>
      )}

      {t === 'buy-x-get-y-free' && (
        <div>
          <label htmlFor="cm-freey" className={labelClass}>
            Free quantity (Y)
          </label>
          <FieldShell error={errors.freeQuantity}>
            <input
              id="cm-freey"
              className={inputClass}
              inputMode="numeric"
              value={input.freeQuantity}
              onChange={(e) => set({ freeQuantity: e.target.value })}
              placeholder="1"
            />
          </FieldShell>
          {errors.freeQuantity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.freeQuantity}</p>
          ) : null}
        </div>
      )}

      {t === 'buy-x-pay-y' && (
        <div>
          <label htmlFor="cm-payy" className={labelClass}>
            Items charged (Y)
          </label>
          <FieldShell error={errors.payQuantity}>
            <input
              id="cm-payy"
              className={inputClass}
              inputMode="numeric"
              value={input.payQuantity}
              onChange={(e) => set({ payQuantity: e.target.value })}
              placeholder="2"
            />
          </FieldShell>
          {errors.payQuantity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.payQuantity}</p>
          ) : null}
        </div>
      )}

      {t === 'percentage-plus-coupon' && (
        <>
          <div>
            <label htmlFor="cm-coupon" className={labelClass}>
              Fixed coupon
            </label>
            <FieldShell error={errors.couponAmount}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cm-coupon"
                className={inputClass}
                inputMode="decimal"
                value={input.couponAmount}
                onChange={(e) => set({ couponAmount: e.target.value })}
                placeholder="10"
              />
            </FieldShell>
            {errors.couponAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.couponAmount}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cm-order" className={labelClass}>
              Apply order
            </label>
            <select
              id="cm-order"
              className={selectClass}
              value={input.couponOrder}
              onChange={(e) =>
                set({ couponOrder: e.target.value as CouponOrder })
              }
            >
              <option value="percent-then-fixed">
                Percentage then coupon
              </option>
              <option value="fixed-then-percent">
                Coupon then percentage
              </option>
            </select>
          </div>
        </>
      )}

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.applySalesTax}
          onChange={(e) =>
            set({
              applySalesTax: e.target.checked,
              salesTaxRate: e.target.checked ? input.salesTaxRate : '',
            })
          }
        />
        Apply sales tax
      </label>

      {input.applySalesTax ? (
        <>
          <div>
            <label htmlFor="cm-tax" className={labelClass}>
              Sales tax rate
            </label>
            <FieldShell error={errors.salesTaxRate}>
              <input
                id="cm-tax"
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
          <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.taxIncluded}
              onChange={(e) => set({ taxIncluded: e.target.checked })}
            />
            Tax is included in the price
          </label>
        </>
      ) : null}

      <div>
        <label htmlFor="cm-ship" className={labelClass}>
          Shipping cost
        </label>
        <FieldShell error={errors.shippingCost}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="cm-ship"
            className={inputClass}
            inputMode="decimal"
            value={input.shippingCost}
            onChange={(e) => set({ shippingCost: e.target.value })}
            placeholder="0"
          />
        </FieldShell>
        {errors.shippingCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.shippingCost}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useFreeShippingThreshold}
          onChange={(e) =>
            set({ useFreeShippingThreshold: e.target.checked })
          }
        />
        Free shipping threshold (after discount)
      </label>
      {input.useFreeShippingThreshold ? (
        <div>
          <label htmlFor="cm-threshold" className={labelClass}>
            Threshold
          </label>
          <FieldShell error={errors.freeShippingThreshold}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="cm-threshold"
              className={inputClass}
              inputMode="decimal"
              value={input.freeShippingThreshold}
              onChange={(e) =>
                set({ freeShippingThreshold: e.target.value })
              }
              placeholder="75"
            />
          </FieldShell>
          {errors.freeShippingThreshold ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.freeShippingThreshold}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.compareBlackFriday}
          onChange={(e) => set({ compareBlackFriday: e.target.checked })}
        />
        Compare with a Black Friday checkout total
      </label>
      {input.compareBlackFriday ? (
        <div>
          <label htmlFor="cm-bf" className={labelClass}>
            Black Friday checkout total
          </label>
          <FieldShell error={errors.blackFridayCheckoutTotal}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="cm-bf"
              className={inputClass}
              inputMode="decimal"
              value={input.blackFridayCheckoutTotal}
              onChange={(e) =>
                set({ blackFridayCheckoutTotal: e.target.value })
              }
              placeholder="190"
            />
          </FieldShell>
          {errors.blackFridayCheckoutTotal ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.blackFridayCheckoutTotal}
            </p>
          ) : null}
        </div>
      ) : null}

      <h3 className="pt-1 text-sm font-semibold text-accent">Your deal</h3>
      <div>
        <label htmlFor="cm-final" className={labelClass}>
          Final amount to pay
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="cm-final"
            className={inputClass}
            readOnly
            value={
              result
                ? result.finalCheckoutAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ''
            }
            placeholder="—"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
