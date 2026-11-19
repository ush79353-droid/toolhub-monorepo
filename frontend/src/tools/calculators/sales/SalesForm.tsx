'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SALES_PERIOD_OPTIONS,
  type SalesFieldErrors,
  type SalesInput,
  type SalesPeriod,
  type SalesResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

function PeriodSelect({
  id,
  value,
  onChange,
  'aria-label': ariaLabel,
}: {
  id: string;
  value: SalesPeriod;
  onChange: (next: SalesPeriod) => void;
  'aria-label': string;
}) {
  return (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as SalesPeriod)}
    >
      {SALES_PERIOD_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface SalesFormProps {
  input: SalesInput;
  errors: SalesFieldErrors;
  result: SalesResult | null;
  onChange: (input: SalesInput) => void;
  onProductPriceCurrencyChange: (next: SupportedCurrency) => void;
  onRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onAnnualRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onReturnsCurrencyChange: (next: SupportedCurrency) => void;
  onAllowancesCurrencyChange: (next: SupportedCurrency) => void;
  onDiscountsCurrencyChange: (next: SupportedCurrency) => void;
  onNetSalesCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function SalesForm({
  input,
  errors,
  result,
  onChange,
  onProductPriceCurrencyChange,
  onRevenueCurrencyChange,
  onAnnualRevenueCurrencyChange,
  onReturnsCurrencyChange,
  onAllowancesCurrencyChange,
  onDiscountsCurrencyChange,
  onNetSalesCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SalesFormProps) {
  const priceSymbol = getCurrencySymbol(input.productPriceCurrency);
  const revenueSymbol = getCurrencySymbol(input.revenueCurrency);
  const annualSymbol = getCurrencySymbol(input.annualRevenueCurrency);
  const returnsSymbol = getCurrencySymbol(input.salesReturnsCurrency);
  const allowancesSymbol = getCurrencySymbol(input.salesAllowancesCurrency);
  const discountsSymbol = getCurrencySymbol(input.salesDiscountsCurrency);
  const netSymbol = getCurrencySymbol(input.netSalesCurrency);

  const set = (patch: Partial<SalesInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5">
        <p className="text-[13px] font-semibold text-accent">Sales details</p>

        <div>
          <label className={labelClass} htmlFor="sales-product-price">
            <span>Product price</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.productPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {priceSymbol}
              </span>
              <input
                id="sales-product-price"
                className={inputClass}
                inputMode="decimal"
                value={input.productPrice}
                aria-invalid={Boolean(errors.productPrice)}
                onChange={(e) => set({ productPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sales-product-price-currency"
                value={input.productPriceCurrency}
                onChange={onProductPriceCurrencyChange}
                aria-label="Product price currency"
              />
            </div>
          </div>
          {errors.productPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.productPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sales-quantity">
            <span>Number of products sold</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.quantity}>
              <input
                id="sales-quantity"
                className={inputClass}
                inputMode="decimal"
                value={input.quantity}
                aria-invalid={Boolean(errors.quantity)}
                onChange={(e) => set({ quantity: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <PeriodSelect
                id="sales-quantity-period"
                value={input.quantityPeriod}
                onChange={(quantityPeriod) => set({ quantityPeriod })}
                aria-label="Sales quantity period"
              />
            </div>
          </div>
          {errors.quantity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sales-revenue">
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
                id="sales-revenue"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedRevenue ?? ''}
                aria-label="Revenue"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sales-revenue-currency"
                value={input.revenueCurrency}
                onChange={onRevenueCurrencyChange}
                aria-label="Revenue currency"
              />
            </div>
            <div className="w-[90px] shrink-0 sm:w-[100px]">
              <PeriodSelect
                id="sales-revenue-period"
                value={input.revenuePeriod}
                onChange={(revenuePeriod) => set({ revenuePeriod })}
                aria-label="Revenue period"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="sales-annual-revenue">
            <span>Annual revenue</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {annualSymbol}
              </span>
              <input
                id="sales-annual-revenue"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedAnnualRevenue ?? ''}
                aria-label="Annual revenue"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sales-annual-revenue-currency"
                value={input.annualRevenueCurrency}
                onChange={onAnnualRevenueCurrencyChange}
                aria-label="Annual revenue currency"
              />
            </div>
            <div className="w-[90px] shrink-0 sm:w-[100px]">
              <PeriodSelect
                id="sales-annual-revenue-period"
                value={input.annualRevenuePeriod}
                onChange={(annualRevenuePeriod) => set({ annualRevenuePeriod })}
                aria-label="Annual revenue period"
              />
            </div>
          </div>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.costsOpen}
        onToggle={(event) => set({ costsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.costsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Costs to be deducted</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Sales returns, allowances, and discounts only — not operating expenses or COGS.
            Amounts apply to the same sales period as quantity sold. Leave blank for zero.
          </p>

          <div>
            <label className={labelClass} htmlFor="sales-returns">
              <span>Sales returns</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.salesReturns}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {returnsSymbol}
                </span>
                <input
                  id="sales-returns"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesReturns}
                  aria-invalid={Boolean(errors.salesReturns)}
                  onChange={(e) => set({ salesReturns: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sales-returns-currency"
                  value={input.salesReturnsCurrency}
                  onChange={onReturnsCurrencyChange}
                  aria-label="Sales returns currency"
                />
              </div>
            </div>
            {errors.salesReturns ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesReturns}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sales-allowances">
              <span>Sales allowances</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.salesAllowances}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {allowancesSymbol}
                </span>
                <input
                  id="sales-allowances"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesAllowances}
                  aria-invalid={Boolean(errors.salesAllowances)}
                  onChange={(e) => set({ salesAllowances: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sales-allowances-currency"
                  value={input.salesAllowancesCurrency}
                  onChange={onAllowancesCurrencyChange}
                  aria-label="Sales allowances currency"
                />
              </div>
            </div>
            {errors.salesAllowances ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesAllowances}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sales-discounts">
              <span>Sales discounts</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.salesDiscounts}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {discountsSymbol}
                </span>
                <input
                  id="sales-discounts"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesDiscounts}
                  aria-invalid={Boolean(errors.salesDiscounts)}
                  onChange={(e) => set({ salesDiscounts: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sales-discounts-currency"
                  value={input.salesDiscountsCurrency}
                  onChange={onDiscountsCurrencyChange}
                  aria-label="Sales discounts currency"
                />
              </div>
            </div>
            {errors.salesDiscounts ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesDiscounts}</p>
            ) : null}
          </div>
        </div>
      </details>

      <div>
        <label className={labelClass} htmlFor="sales-net-sales">
          <span>Net sales</span>
          <InfoTooltip content="Net sales = gross sales − returns − allowances − discounts. Operating expenses are excluded." />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {netSymbol}
            </span>
            <input
              id="sales-net-sales"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedNetSales ?? ''}
              aria-label="Net sales"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sales-net-sales-currency"
              value={input.netSalesCurrency}
              onChange={onNetSalesCurrencyChange}
              aria-label="Net sales currency"
            />
          </div>
          <div className="w-[90px] shrink-0 sm:w-[100px]">
            <PeriodSelect
              id="sales-net-sales-period"
              value={input.netSalesPeriod}
              onChange={(netSalesPeriod) => set({ netSalesPeriod })}
              aria-label="Net sales period"
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
      {result ? (
        <p className="text-xs text-muted-foreground">{result.summaryText}</p>
      ) : null}
    </form>
  );
}
