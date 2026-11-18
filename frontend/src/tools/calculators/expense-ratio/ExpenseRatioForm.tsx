'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ExpenseRatioFieldErrors,
  ExpenseRatioInput,
  ExpenseRatioResult,
} from './types';

interface ExpenseRatioFormProps {
  input: ExpenseRatioInput;
  errors: ExpenseRatioFieldErrors;
  result: ExpenseRatioResult | null;
  onChange: (input: ExpenseRatioInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function ExpenseRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: ExpenseRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ExpenseRatioInput>) => onChange({ ...input, ...patch });
  const [netOpen, setNetOpen] = React.useState(false);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="er-initial"
          label="Initial investment"
          tip="Starting balance before growth. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="er-initial"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.initialInvestment}
              aria-invalid={Boolean(errors.initialInvestment)}
              onChange={(e) => set({ initialInvestment: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="er-initial-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.initialInvestment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="er-yearly"
          label="Yearly investment"
          tip="Contribution added at the end of each year. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="er-yearly"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.yearlyInvestment}
              aria-invalid={Boolean(errors.yearlyInvestment)}
              onChange={(e) => set({ yearlyInvestment: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="er-yearly-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.yearlyInvestment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.yearlyInvestment}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="er-duration"
          label="Duration"
          tip="Investment horizon in whole years."
        />
        <div className="relative">
          <input
            id="er-duration"
            className={`${inputClass} pr-12`}
            inputMode="numeric"
            value={input.durationYears}
            aria-invalid={Boolean(errors.durationYears)}
            onChange={(e) => set({ durationYears: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            yrs
          </span>
        </div>
        {errors.durationYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationYears}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="er-return"
          label="Expected return"
          tip="Nominal annual investment return before expense-ratio fees."
        />
        <div className="relative">
          <input
            id="er-return"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.expectedReturn}
            aria-invalid={Boolean(errors.expectedReturn)}
            onChange={(e) => set({ expectedReturn: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.expectedReturn ? (
          <p className="mt-1 text-xs text-rose-600">{errors.expectedReturn}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="er-expense"
          label="Expense ratio"
          tip="Annual ETF expense ratio charged on the post-return balance each year."
        />
        <div className="relative">
          <input
            id="er-expense"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.expenseRatio}
            aria-invalid={Boolean(errors.expenseRatio)}
            onChange={(e) => set({ expenseRatio: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
        {errors.expenseRatio ? (
          <p className="mt-1 text-xs text-rose-600">{errors.expenseRatio}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="er-gross-fv"
          label="Future value of total investment"
          tip="Gross future value of initial investment plus yearly contributions, before ETF fees."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="er-gross-fv"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              value={result ? result.formattedGrossFutureValue : ''}
              aria-live="polite"
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="er-gross-fv-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel
          htmlFor="er-etf-cost"
          label="Total cost of ETF"
          tip="Sum of actual annual expense-ratio fees charged on the post-return balance."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="er-etf-cost"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              value={result ? result.formattedTotalEtfCost : ''}
              aria-live="polite"
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="er-etf-cost-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={netOpen}
          onClick={() => setNetOpen((open) => !open)}
        >
          Total future value with ETF&apos;s expense ratio
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${netOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {netOpen ? (
          <div className="border-t border-border px-3.5 py-3.5 sm:px-4">
            <FieldLabel
              htmlFor="er-net-fv"
              label="Net future value"
              tip="Investment value after annual expense-ratio fees, including their compounding effect."
            />
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="er-net-fv"
                  type="text"
                  readOnly
                  className={`${inputClass} bg-muted/20 pl-8 font-semibold text-accent`}
                  value={result ? result.formattedNetFutureValue : ''}
                  aria-live="polite"
                />
              </div>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="er-net-fv-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
