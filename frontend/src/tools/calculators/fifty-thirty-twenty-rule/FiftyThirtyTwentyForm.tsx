'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import { FiftyThirtyTwentyResults } from './FiftyThirtyTwentyResults';
import type {
  BudgetView,
  FiftyThirtyTwentyFieldErrors,
  FiftyThirtyTwentyInput,
  FiftyThirtyTwentyResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface FiftyThirtyTwentyFormProps {
  input: FiftyThirtyTwentyInput;
  errors: FiftyThirtyTwentyFieldErrors;
  result: FiftyThirtyTwentyResult | null;
  onChange: (next: FiftyThirtyTwentyInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
  onBudgetViewChange: (view: BudgetView) => void;
}

export function FiftyThirtyTwentyForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
  onBudgetViewChange,
}: FiftyThirtyTwentyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FiftyThirtyTwentyInput>) =>
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
      <section aria-labelledby="budget-income-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 id="budget-income-heading" className="text-sm font-semibold text-accent">
              Your monthly after-tax income
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter take-home pay after taxes and mandatory deductions. The calculator splits it
              50/30/20.
            </p>
          </div>
          <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
            Load example
          </Button>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="budget-income">Monthly after-tax income</label>
            <InfoTooltip
              label="Monthly after-tax income"
              text="Enter your monthly take-home income after taxes and mandatory deductions. The calculator will divide this amount according to the 50/30/20 budgeting rule."
              align="left"
            />
          </div>
          <div className="flex gap-2">
            <FieldShell error={errors.monthlyAfterTaxIncome}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="budget-income"
                className={inputClass}
                inputMode="decimal"
                placeholder="Enter your monthly income"
                value={input.monthlyAfterTaxIncome}
                aria-invalid={Boolean(errors.monthlyAfterTaxIncome)}
                onChange={(event) => set({ monthlyAfterTaxIncome: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="budget-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.monthlyAfterTaxIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyAfterTaxIncome}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
          )}
        </div>
      </section>

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

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.distributionOpen}
        onToggle={(event) => set({ distributionOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.distributionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Your 50/30/20 distribution</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {(
            [
              {
                key: 'necessities' as const,
                label: 'Necessities (50%)',
                tip: 'Use this portion for essential expenses that you need to maintain your everyday life.',
              },
              {
                key: 'wants' as const,
                label: 'Wants (30%)',
                tip: 'Use this portion for lifestyle choices, entertainment, hobbies, and other non-essential spending.',
              },
              {
                key: 'savings' as const,
                label: 'Savings (20%)',
                tip: 'Use this portion to build savings, invest for the future, prepare for emergencies, and achieve long-term financial goals.',
              },
            ] as const
          ).map((field) => {
            const amount = result ? result[field.key].monthlyAmount : null;
            return (
              <div key={field.key}>
                <div className={labelClass}>
                  <label htmlFor={`budget-${field.key}`}>{field.label}</label>
                  <InfoTooltip label={field.label} text={field.tip} align="left" />
                </div>
                <FieldShell>
                  <input
                    id={`budget-${field.key}`}
                    className={`${inputClass} bg-muted/10 font-semibold`}
                    readOnly
                    value={amount === null ? '' : formatMoney(amount, input.currency)}
                    aria-live="polite"
                  />
                </FieldShell>
              </div>
            );
          })}
          {!result ? (
            <p className="text-xs text-muted-foreground">
              Enter income and Calculate to see the three suggested allocations.
            </p>
          ) : null}
        </div>
      </details>

      {result ? (
        <FiftyThirtyTwentyResults
          result={result}
          budgetView={input.budgetView}
          onBudgetViewChange={onBudgetViewChange}
        />
      ) : null}
    </form>
  );
}
