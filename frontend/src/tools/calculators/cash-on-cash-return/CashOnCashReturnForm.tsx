'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CashOnCashFieldErrors,
  CashOnCashInput,
  CashOnCashResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface CashOnCashReturnFormProps {
  input: CashOnCashInput;
  errors: CashOnCashFieldErrors;
  result: CashOnCashResult | null;
  onChange: (input: CashOnCashInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CashOnCashReturnForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: CashOnCashReturnFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<CashOnCashInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="coc-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="coc-investment">
          <span>Total cash investment</span>
          <InfoTooltip
            label="Total cash investment"
            text="Out-of-pocket cash: down payment, closing costs, initial renovations, and other upfront cash. Not necessarily the full purchase price."
          />
        </label>
        <FieldShell error={errors.totalCashInvestment}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="coc-investment"
            className={inputClass}
            inputMode="decimal"
            value={input.totalCashInvestment}
            aria-invalid={Boolean(errors.totalCashInvestment)}
            onChange={(e) => set({ totalCashInvestment: e.target.value })}
          />
        </FieldShell>
        {errors.totalCashInvestment ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.totalCashInvestment}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="coc-gross-rent">
          <span>Gross annual rental income (100% occupancy)</span>
          <InfoTooltip
            label="Gross annual rent"
            text="Potential annual rent at full occupancy, before vacancy loss."
          />
        </label>
        <FieldShell error={errors.grossAnnualRentalIncome}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="coc-gross-rent"
            className={inputClass}
            inputMode="decimal"
            value={input.grossAnnualRentalIncome}
            aria-invalid={Boolean(errors.grossAnnualRentalIncome)}
            onChange={(e) => set({ grossAnnualRentalIncome: e.target.value })}
          />
        </FieldShell>
        {errors.grossAnnualRentalIncome ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.grossAnnualRentalIncome}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="coc-vacancy">
          <span>Vacancy rate</span>
          <InfoTooltip
            label="Vacancy rate"
            text="Share of potential rent lost to vacancy or uncollected rent. Example: 60,000 × 5% = 3,000 vacancy loss."
          />
        </label>
        <FieldShell error={errors.vacancyRate}>
          <input
            id="coc-vacancy"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.vacancyRate}
            aria-invalid={Boolean(errors.vacancyRate)}
            onChange={(e) => set({ vacancyRate: e.target.value })}
          />
          <span
            className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %
          </span>
        </FieldShell>
        {errors.vacancyRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vacancyRate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="coc-expenses">
          <span>Annual expenses for this property</span>
          <InfoTooltip
            label="Annual expenses"
            text="Taxes, insurance, repairs, management, owner-paid utilities, and similar operating costs. Do not include mortgage principal and interest — enter those as monthly loan payment."
          />
        </label>
        <FieldShell error={errors.annualOperatingExpenses}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="coc-expenses"
            className={inputClass}
            inputMode="decimal"
            value={input.annualOperatingExpenses}
            aria-invalid={Boolean(errors.annualOperatingExpenses)}
            onChange={(e) => set({ annualOperatingExpenses: e.target.value })}
          />
        </FieldShell>
        {errors.annualOperatingExpenses ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualOperatingExpenses}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="coc-loan">
          <span>Monthly loan payment</span>
          <InfoTooltip
            label="Monthly loan payment"
            text="Usually principal and interest. Avoid double-counting taxes or insurance if they are already in annual expenses. Annual debt service = monthly × 12."
          />
        </label>
        <FieldShell error={errors.monthlyLoanPayment}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="coc-loan"
            className={inputClass}
            inputMode="decimal"
            value={input.monthlyLoanPayment}
            aria-invalid={Boolean(errors.monthlyLoanPayment)}
            onChange={(e) => set({ monthlyLoanPayment: e.target.value })}
          />
        </FieldShell>
        {errors.monthlyLoanPayment ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.monthlyLoanPayment}
          </p>
        ) : null}
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

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
