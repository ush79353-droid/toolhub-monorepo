'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AccountingProfitFieldErrors,
  AccountingProfitInput,
  AccountingProfitResult,
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

interface AccountingProfitFormProps {
  input: AccountingProfitInput;
  errors: AccountingProfitFieldErrors;
  result: AccountingProfitResult | null;
  onChange: (input: AccountingProfitInput) => void;
  onTotalRevenueCurrencyChange: (next: SupportedCurrency) => void;
  onOperationExpensesCurrencyChange: (next: SupportedCurrency) => void;
  onInterestCurrencyChange: (next: SupportedCurrency) => void;
  onDepreciationCurrencyChange: (next: SupportedCurrency) => void;
  onTaxesCurrencyChange: (next: SupportedCurrency) => void;
  onTotalExplicitCostsCurrencyChange: (next: SupportedCurrency) => void;
  onAccountingProfitCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function AccountingProfitForm({
  input,
  errors,
  result,
  onChange,
  onTotalRevenueCurrencyChange,
  onOperationExpensesCurrencyChange,
  onInterestCurrencyChange,
  onDepreciationCurrencyChange,
  onTaxesCurrencyChange,
  onTotalExplicitCostsCurrencyChange,
  onAccountingProfitCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: AccountingProfitFormProps) {
  const revSymbol = getCurrencySymbol(input.totalRevenueCurrency);
  const opSymbol = getCurrencySymbol(input.operationExpensesCurrency);
  const intSymbol = getCurrencySymbol(input.interestCurrency);
  const depSymbol = getCurrencySymbol(input.depreciationCurrency);
  const taxSymbol = getCurrencySymbol(input.taxesCurrency);
  const costsSymbol = getCurrencySymbol(input.totalExplicitCostsCurrency);
  const profitSymbol = getCurrencySymbol(input.accountingProfitCurrency);

  const set = (patch: Partial<AccountingProfitInput>) => {
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
          <label className={labelClass} htmlFor="ap-revenue">
            <span>Total revenue</span>
            <InfoTooltip
              label="Total revenue"
              text="Sales and other recorded revenue for the period. Changing currency converts this amount with stored FX rates. Math runs in this currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalRevenue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {revSymbol}
              </span>
              <input
                id="ap-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRevenue}
                aria-invalid={Boolean(errors.totalRevenue)}
                onChange={(e) => set({ totalRevenue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-revenue-currency"
                value={input.totalRevenueCurrency}
                onChange={onTotalRevenueCurrencyChange}
                aria-label="Total revenue currency"
              />
            </div>
          </div>
          {errors.totalRevenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-op-expenses">
            <span>Operation expenses</span>
            <InfoTooltip
              label="Operation expenses"
              text="Explicit operating costs excluding interest, depreciation, and taxes (enter those separately to avoid double-counting)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.operationExpenses}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {opSymbol}
              </span>
              <input
                id="ap-op-expenses"
                className={inputClass}
                inputMode="decimal"
                value={input.operationExpenses}
                aria-invalid={Boolean(errors.operationExpenses)}
                onChange={(e) => set({ operationExpenses: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-op-expenses-currency"
                value={input.operationExpensesCurrency}
                onChange={onOperationExpensesCurrencyChange}
                aria-label="Operation expenses currency"
              />
            </div>
          </div>
          {errors.operationExpenses ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.operationExpenses}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-interest">
            <span>Interest</span>
            <InfoTooltip
              label="Interest"
              text="Interest expense for the period as a nonnegative cost amount. Do not also include it inside operation expenses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.interest}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {intSymbol}
              </span>
              <input
                id="ap-interest"
                className={inputClass}
                inputMode="decimal"
                value={input.interest}
                aria-invalid={Boolean(errors.interest)}
                onChange={(e) => set({ interest: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-interest-currency"
                value={input.interestCurrency}
                onChange={onInterestCurrencyChange}
                aria-label="Interest currency"
              />
            </div>
          </div>
          {errors.interest ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interest}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-depreciation">
            <span>Depreciation</span>
            <InfoTooltip
              label="Depreciation"
              text="Depreciation expense for the period as a nonnegative cost amount. Do not also include it inside operation expenses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.depreciation}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {depSymbol}
              </span>
              <input
                id="ap-depreciation"
                className={inputClass}
                inputMode="decimal"
                value={input.depreciation}
                aria-invalid={Boolean(errors.depreciation)}
                onChange={(e) => set({ depreciation: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-depreciation-currency"
                value={input.depreciationCurrency}
                onChange={onDepreciationCurrencyChange}
                aria-label="Depreciation currency"
              />
            </div>
          </div>
          {errors.depreciation ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depreciation}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-taxes">
            <span>Taxes</span>
            <InfoTooltip
              label="Taxes"
              text="Tax expense for the period as a nonnegative cost amount. Do not also include it inside operation expenses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.taxes}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {taxSymbol}
              </span>
              <input
                id="ap-taxes"
                className={inputClass}
                inputMode="decimal"
                value={input.taxes}
                aria-invalid={Boolean(errors.taxes)}
                onChange={(e) => set({ taxes: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-taxes-currency"
                value={input.taxesCurrency}
                onChange={onTaxesCurrencyChange}
                aria-label="Taxes currency"
              />
            </div>
          </div>
          {errors.taxes ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxes}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-explicit-costs">
            <span>Total explicit costs</span>
            <InfoTooltip
              label="Total explicit costs"
              text="Sum of operation expenses + interest + depreciation + taxes after normalizing into the revenue currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {costsSymbol}
              </span>
              <input
                id="ap-explicit-costs"
                className={`${inputClass} text-primary`}
                readOnly
                tabIndex={-1}
                value={result?.formattedTotalExplicitCosts ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-explicit-costs-currency"
                value={input.totalExplicitCostsCurrency}
                onChange={onTotalExplicitCostsCurrencyChange}
                aria-label="Total explicit costs currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-profit">
            <span>Accounting profit</span>
            <InfoTooltip
              label="Accounting profit"
              text="Total revenue minus total explicit costs. Negative values are losses. Opportunity costs are not subtracted."
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
                id="ap-profit"
                className={`${inputClass} text-primary`}
                readOnly
                tabIndex={-1}
                value={result?.formattedAccountingProfit ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ap-profit-currency"
                value={input.accountingProfitCurrency}
                onChange={onAccountingProfitCurrencyChange}
                aria-label="Accounting profit currency"
              />
            </div>
          </div>
        </div>
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
