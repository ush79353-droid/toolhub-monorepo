'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import type {
  CarAffordabilityFieldErrors,
  CarAffordabilityInput,
  CarAffordabilityResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function MoneyField({
  id,
  label,
  tip,
  symbol,
  value,
  error,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className={labelClass}>
        <label htmlFor={id}>{label}</label>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <FieldShell error={error}>
        <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface CarAffordabilityFormProps {
  input: CarAffordabilityInput;
  errors: CarAffordabilityFieldErrors;
  result: CarAffordabilityResult | null;
  onChange: (next: CarAffordabilityInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function CarAffordabilityForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: CarAffordabilityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CarAffordabilityInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Estimates the maximum vehicle price from your monthly payment budget, cash, trade-in,
 rate, and term; not a lender approval.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="car-aff-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="car-aff-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <MoneyField
          id="monthly-payment"
          label="Monthly payment you can afford"
          tip="Maximum comfortable monthly car-loan payment: the primary affordability constraint."
          symbol={symbol}
          value={input.monthlyPayment}
          error={errors.monthlyPayment}
          placeholder="Enter monthly payment"
          onChange={(value) => set({ monthlyPayment: value })}
        />
        <MoneyField
          id="money-you-have"
          label="Money you have"
          tip="Cash available for down payment and other upfront purchase costs."
          symbol={symbol}
          value={input.availableMoney}
          error={errors.availableMoney}
          placeholder="Enter available money"
          onChange={(value) => set({ availableMoney: value })}
        />
        <MoneyField
          id="trade-in"
          label="Current car trade-in value"
          tip="Estimated trade-in contribution toward the new purchase. Subtract any remaining loan on the old car yourself if you have negative equity."
          symbol={symbol}
          value={input.tradeInValue}
          error={errors.tradeInValue}
          placeholder="Enter trade-in value"
          onChange={(value) => set({ tradeInValue: value })}
        />
        <div>
          <div className={labelClass}>
            <label htmlFor="interest-rate">Interest rate</label>
            <InfoTooltip
              label="Interest rate"
              text="Annual loan interest rate as a percent (for example 6 or 7.25)."
              align="left"
            />
          </div>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="interest-rate"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter annual interest rate"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(event) => set({ annualInterestRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
          ) : null}
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="loan-term-enabled">Loan term</label>
          <InfoTooltip
            label="Loan term"
            text="Choose Yes and enter the financing duration. A loan term is required for this affordability calculation."
            align="left"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <select
            id="loan-term-enabled"
            className={selectClass}
            value={input.loanTermEnabled ? 'yes' : 'no'}
            aria-invalid={Boolean(errors.loanTermEnabled)}
            onChange={(event) =>
              set({ loanTermEnabled: event.target.value === 'yes' })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {input.loanTermEnabled ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldShell error={errors.loanTermYears}>
                  <input
                    id="loan-term-years"
                    className={inputClass}
                    inputMode="numeric"
                    aria-label="Loan term years"
                    placeholder="Years"
                    value={input.loanTermYears}
                    aria-invalid={Boolean(errors.loanTermYears)}
                    onChange={(event) => set({ loanTermYears: event.target.value })}
                  />
                  <span className="pr-3 text-xs text-muted-foreground">yrs</span>
                </FieldShell>
                {errors.loanTermYears ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
                ) : null}
              </div>
              <div>
                <FieldShell error={errors.loanTermMonths}>
                  <input
                    id="loan-term-months"
                    className={inputClass}
                    inputMode="numeric"
                    aria-label="Loan term months"
                    placeholder="Months"
                    value={input.loanTermMonths}
                    aria-invalid={Boolean(errors.loanTermMonths)}
                    onChange={(event) => set({ loanTermMonths: event.target.value })}
                  />
                  <span className="pr-3 text-xs text-muted-foreground">mo</span>
                </FieldShell>
                {errors.loanTermMonths ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.loanTermMonths}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="flex items-center text-xs text-muted-foreground">
              Select Yes and enter a loan duration to calculate affordability.
            </p>
          )}
        </div>
        {errors.loanTermEnabled ? (
          <p className="mt-1 text-xs text-rose-600">{errors.loanTermEnabled}</p>
        ) : null}
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.additionalOpen}
        onToggle={(event) => set({ additionalOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.additionalOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Additional options</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Optional tax and fees reduce the maximum sticker price so your budget still covers
 acquisition costs. Down payment allocates money you have; it is never added on top.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className={labelClass}>
                <label htmlFor="sales-tax">Sales tax</label>
                <InfoTooltip
                  label="Sales tax"
                  text="Percent sales tax on the vehicle price. Maximum sticker price = (budget − fixed fees) ÷ (1 + tax rate)."
                  align="left"
                />
              </div>
              <FieldShell error={errors.salesTaxRate}>
                <input
                  id="sales-tax"
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="0"
                  value={input.salesTaxRate}
                  aria-invalid={Boolean(errors.salesTaxRate)}
                  onChange={(event) => set({ salesTaxRate: event.target.value })}
                />
                <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
              </FieldShell>
              {errors.salesTaxRate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salesTaxRate}</p>
              ) : null}
            </div>
            <MoneyField
              id="dealer-fees"
              label="Dealer fees"
              tip="Documentation, prep, or processing fees paid upfront."
              symbol={symbol}
              value={input.dealerFees}
              error={errors.dealerFees}
              onChange={(value) => set({ dealerFees: value })}
            />
            <MoneyField
              id="registration-fees"
              label="Registration and title fees"
              tip="Government or administrative registration and title fees."
              symbol={symbol}
              value={input.registrationFees}
              error={errors.registrationFees}
              onChange={(value) => set({ registrationFees: value })}
            />
            <MoneyField
              id="other-upfront"
              label="Additional upfront costs"
              tip="Other purchase-related expenses paid at signing."
              symbol={symbol}
              value={input.otherUpfrontCosts}
              error={errors.otherUpfrontCosts}
              onChange={(value) => set({ otherUpfrontCosts: value })}
            />
            <MoneyField
              id="down-payment"
              label="Down payment"
              tip="Optional: how much of money you have to put down. Replaces the full available-cash contribution; never added twice."
              symbol={symbol}
              value={input.downPayment}
              error={errors.downPayment}
              onChange={(value) => set({ downPayment: value })}
            />
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="car-aff-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="car-aff-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div>
            <p className="text-xs text-muted-foreground">Maximum car value</p>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-accent">
              {formatMoney(result.maximumCarValue, result.currency)}
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Loan amount</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.loanAmount, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Interest paid</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalInterestPaid, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cash toward purchase</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.cashContribution, result.currency)}
                {result.usedDownPaymentAllocation ? ' (down payment)' : ''}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Trade-in</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.tradeInValue, result.currency)}
              </dd>
            </div>
            {result.totalUpfrontCosts > 0 ? (
              <>
                <div>
                  <dt className="text-xs text-muted-foreground">Tax & fees (est.)</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatMoney(result.totalUpfrontCosts, result.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Total acquisition cost</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatMoney(result.totalPurchaseCost, result.currency)}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>
          <p className="text-xs text-muted-foreground">
            Based on {formatMoney(result.monthlyPayment, result.currency)}/mo for{' '}
            {result.loanTermMonths} months at {result.annualInterestRate}% APR. Insurance, fuel, and
            maintenance are not included.
          </p>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter your payment budget and loan details, then Calculate to see how much car you can
          afford.
        </p>
      )}
    </form>
  );
}
