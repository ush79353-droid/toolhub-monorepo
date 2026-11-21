'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ProfitFieldErrors,
  ProfitInput,
  ProfitResult,
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

interface ProfitFormProps {
  input: ProfitInput;
  errors: ProfitFieldErrors;
  result: ProfitResult | null;
  onChange: (input: ProfitInput) => void;
  onCostCurrencyChange: (next: SupportedCurrency) => void;
  onPriceCurrencyChange: (next: SupportedCurrency) => void;
  onTotalCostCurrencyChange: (next: SupportedCurrency) => void;
  onRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onTotalProfitCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function ProfitForm({
  input,
  errors,
  result,
  onChange,
  onCostCurrencyChange,
  onPriceCurrencyChange,
  onTotalCostCurrencyChange,
  onRevenueCurrencyChange,
  onTotalProfitCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: ProfitFormProps) {
  const costSymbol = getCurrencySymbol(input.costCurrency);
  const priceSymbol = getCurrencySymbol(input.priceCurrency);
  const totalCostSymbol = getCurrencySymbol(input.totalCostCurrency);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const profitSymbol = getCurrencySymbol(input.totalProfitCurrency);

  const set = (patch: Partial<ProfitInput>) => {
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
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={input.buyingCostOpen}
          onClick={() => set({ buyingCostOpen: !input.buyingCostOpen })}
        >
          <h3 className="text-[13px] font-semibold text-accent">Buying cost</h3>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.buyingCostOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.buyingCostOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="profit-cost">
                <span>Cost</span>
                <InfoTooltip
                  label="Buying cost"
                  text="Total amount paid for the units in “per”. Changing currency converts this amount with stored FX rates."
                />
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
                    id="profit-cost"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.cost}
                    aria-invalid={Boolean(errors.cost)}
                    onChange={(e) => set({ cost: e.target.value })}
                  />
                </FieldShell>
                <CurrencySelect
                  id="profit-cost-currency"
                  value={input.costCurrency}
                  onChange={onCostCurrencyChange}
                  aria-label="Buying cost currency"
                />
              </div>
              {errors.cost ? (
                <p className="mt-1 text-xs text-rose-600">{errors.cost}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="profit-cost-per">
                <span>per</span>
              </label>
              <FieldShell error={errors.costPer}>
                <input
                  id="profit-cost-per"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.costPer}
                  aria-invalid={Boolean(errors.costPer)}
                  onChange={(e) => set({ costPer: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">
                  unit(s)
                </span>
              </FieldShell>
              {errors.costPer ? (
                <p className="mt-1 text-xs text-rose-600">{errors.costPer}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={input.sellingPriceOpen}
          onClick={() => set({ sellingPriceOpen: !input.sellingPriceOpen })}
        >
          <h3 className="text-[13px] font-semibold text-accent">Selling price</h3>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              input.sellingPriceOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.sellingPriceOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="profit-price">
                <span>Price</span>
                <InfoTooltip
                  label="Selling price"
                  text="Total amount received for the units in “per” before the revenue discount. Changing currency converts this amount with stored FX rates."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.price}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {priceSymbol}
                  </span>
                  <input
                    id="profit-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.price}
                    aria-invalid={Boolean(errors.price)}
                    onChange={(e) => set({ price: e.target.value })}
                  />
                </FieldShell>
                <CurrencySelect
                  id="profit-price-currency"
                  value={input.priceCurrency}
                  onChange={onPriceCurrencyChange}
                  aria-label="Selling price currency"
                />
              </div>
              {errors.price ? (
                <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="profit-price-per">
                <span>per</span>
              </label>
              <FieldShell error={errors.pricePer}>
                <input
                  id="profit-price-per"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.pricePer}
                  aria-invalid={Boolean(errors.pricePer)}
                  onChange={(e) => set({ pricePer: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">
                  unit(s)
                </span>
              </FieldShell>
              {errors.pricePer ? (
                <p className="mt-1 text-xs text-rose-600">{errors.pricePer}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <h3 className="text-[13px] font-semibold text-accent">Profit</h3>

        <div>
          <label className={labelClass} htmlFor="profit-quantity">
            <span>Quantity</span>
            <InfoTooltip
              label="Quantity"
              text="Number of units sold. Total cost and revenue scale from unit cost and unit price by this quantity."
            />
          </label>
          <FieldShell error={errors.quantity}>
            <input
              id="profit-quantity"
              className={inputClass}
              inputMode="decimal"
              value={input.quantity}
              aria-invalid={Boolean(errors.quantity)}
              onChange={(e) => set({ quantity: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              unit(s)
            </span>
          </FieldShell>
          {errors.quantity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="profit-discount">
            <span>Discount</span>
          </label>
          <FieldShell error={errors.discountPercent}>
            <input
              id="profit-discount"
              className={inputClass}
              inputMode="decimal"
              value={input.discountPercent}
              aria-invalid={Boolean(errors.discountPercent)}
              onChange={(e) => set({ discountPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-primary">%</span>
          </FieldShell>
          {errors.discountPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="profit-total-cost">
            <span>Total cost</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {totalCostSymbol}
              </span>
              <input
                id="profit-total-cost"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedTotalCost ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="profit-total-cost-currency"
              value={input.totalCostCurrency}
              onChange={onTotalCostCurrencyChange}
              aria-label="Total cost currency"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="profit-revenue">
            <span>Revenue</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revenueSymbol}
              </span>
              <input
                id="profit-revenue"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedRevenue ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="profit-revenue-currency"
              value={input.revenueCurrency}
              onChange={onRevenueCurrencyChange}
              aria-label="Revenue currency"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="profit-total-profit">
            <span>Total profit</span>
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
                id="profit-total-profit"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedTotalProfit ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="profit-total-profit-currency"
              value={input.totalProfitCurrency}
              onChange={onTotalProfitCurrencyChange}
              aria-label="Total profit currency"
            />
          </div>
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
