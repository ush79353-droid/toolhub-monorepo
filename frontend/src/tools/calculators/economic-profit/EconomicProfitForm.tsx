'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EconomicProfitFieldErrors,
  EconomicProfitInput,
  EconomicProfitResult,
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

interface EconomicProfitFormProps {
  input: EconomicProfitInput;
  errors: EconomicProfitFieldErrors;
  result: EconomicProfitResult | null;
  onChange: (input: EconomicProfitInput) => void;
  onRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onExplicitCostsCurrencyChange: (next: SupportedCurrency) => void;
  onImplicitCostsCurrencyChange: (next: SupportedCurrency) => void;
  onEconomicProfitCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function EconomicProfitForm({
  input,
  errors,
  result,
  onChange,
  onRevenueCurrencyChange,
  onExplicitCostsCurrencyChange,
  onImplicitCostsCurrencyChange,
  onEconomicProfitCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: EconomicProfitFormProps) {
  const revenueSymbol = getCurrencySymbol(input.totalRevenueCurrency);
  const explicitSymbol = getCurrencySymbol(input.explicitCostsCurrency);
  const implicitSymbol = getCurrencySymbol(input.implicitCostsCurrency);
  const profitSymbol = getCurrencySymbol(input.economicProfitCurrency);

  const set = (patch: Partial<EconomicProfitInput>) => {
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
          <label className={labelClass} htmlFor="econ-profit-revenue">
            <span>Total revenue</span>
            <InfoTooltip
              label="Total revenue"
              text="Sales and other income for the period. Changing currency converts this amount with stored FX rates. Other costs normalize into this currency for the profit math."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalRevenue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revenueSymbol}
              </span>
              <input
                id="econ-profit-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRevenue}
                onChange={(e) => set({ totalRevenue: e.target.value })}
                aria-invalid={Boolean(errors.totalRevenue)}
              />
            </FieldShell>
            <CurrencySelect
              id="econ-profit-revenue-currency"
              value={input.totalRevenueCurrency}
              onChange={onRevenueCurrencyChange}
              aria-label="Total revenue currency"
            />
          </div>
          {errors.totalRevenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="econ-profit-explicit">
            <span>Explicit costs</span>
            <InfoTooltip
              label="Explicit costs"
              text="Direct monetary business expenses such as wages paid, rent, materials, and utilities. Do not also list these under implicit costs."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.explicitCosts}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {explicitSymbol}
              </span>
              <input
                id="econ-profit-explicit"
                className={inputClass}
                inputMode="decimal"
                value={input.explicitCosts}
                onChange={(e) => set({ explicitCosts: e.target.value })}
                aria-invalid={Boolean(errors.explicitCosts)}
              />
            </FieldShell>
            <CurrencySelect
              id="econ-profit-explicit-currency"
              value={input.explicitCostsCurrency}
              onChange={onExplicitCostsCurrencyChange}
              aria-label="Explicit costs currency"
            />
          </div>
          {errors.explicitCosts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.explicitCosts}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="econ-profit-implicit">
            <span>Implicit costs</span>
            <InfoTooltip
              label="Implicit costs"
              text="Opportunity costs of resources used in the business, such as forgone salary or returns. Keep these separate from explicit cash expenses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.implicitCosts}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {implicitSymbol}
              </span>
              <input
                id="econ-profit-implicit"
                className={inputClass}
                inputMode="decimal"
                value={input.implicitCosts}
                onChange={(e) => set({ implicitCosts: e.target.value })}
                aria-invalid={Boolean(errors.implicitCosts)}
              />
            </FieldShell>
            <CurrencySelect
              id="econ-profit-implicit-currency"
              value={input.implicitCostsCurrency}
              onChange={onImplicitCostsCurrencyChange}
              aria-label="Implicit costs currency"
            />
          </div>
          {errors.implicitCosts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.implicitCosts}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="econ-profit-result">
            <span>Economic profit</span>
            <InfoTooltip
              label="Economic profit"
              text="Total revenue minus explicit costs minus implicit costs. Changing this currency converts the displayed result only."
            />
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
                id="econ-profit-result"
                className={inputClass}
                readOnly
                value={result ? result.formattedEconomicProfit : ''}
                aria-live="polite"
              />
            </FieldShell>
            <CurrencySelect
              id="econ-profit-result-currency"
              value={input.economicProfitCurrency}
              onChange={onEconomicProfitCurrencyChange}
              aria-label="Economic profit currency"
            />
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
        {conversionError ? (
          <p className="text-xs text-rose-600">{conversionError}</p>
        ) : null}
        {ratesWarning ? (
          <p className="text-xs text-amber-700">{ratesWarning}</p>
        ) : null}
      </div>
    </form>
  );
}
