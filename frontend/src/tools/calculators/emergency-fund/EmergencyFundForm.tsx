'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import type {
  EmergencyFundFieldErrors,
  EmergencyFundInput,
  EmergencyFundResult,
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

interface EmergencyFundFormProps {
  input: EmergencyFundInput;
  errors: EmergencyFundFieldErrors;
  result: EmergencyFundResult | null;
  onChange: (next: EmergencyFundInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function EmergencyFundForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: EmergencyFundFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EmergencyFundInput>) =>
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
          Emergency fund = monthly expenses × months of coverage. A common starting range is 3–6
          months of essentials.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="ef-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="ef-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="monthly-expenses">Average monthly expenses</label>
          <InfoTooltip
            label="Average monthly expenses"
            text="Essential monthly living costs: housing, food, utilities, transport, insurance, debt payments, and other necessities."
            align="left"
          />
        </div>
        <FieldShell error={errors.monthlyExpenses}>
          <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
          <input
            id="monthly-expenses"
            className={inputClass}
            inputMode="decimal"
            placeholder="Enter monthly expenses"
            value={input.monthlyExpenses}
            aria-invalid={Boolean(errors.monthlyExpenses)}
            onChange={(event) => set({ monthlyExpenses: event.target.value })}
          />
        </FieldShell>
        {errors.monthlyExpenses ? (
          <p className="mt-1 text-xs text-rose-600">{errors.monthlyExpenses}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="months-desired">Months of savings desired</label>
          <InfoTooltip
            label="Months of savings desired"
            text="How many months of expenses you want the fund to cover. 3–6 months is a common guideline, not a universal rule."
            align="left"
          />
        </div>
        <FieldShell error={errors.monthsDesired}>
          <input
            id="months-desired"
            className={inputClass}
            inputMode="decimal"
            placeholder="Enter months"
            value={input.monthsDesired}
            aria-invalid={Boolean(errors.monthsDesired)}
            onChange={(event) => set({ monthsDesired: event.target.value })}
          />
          <span className="pr-3 text-xs text-muted-foreground">months</span>
        </FieldShell>
        {errors.monthsDesired ? (
          <p className="mt-1 text-xs text-rose-600">{errors.monthsDesired}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Emergency fund</span>
          <InfoTooltip
            label="Emergency fund"
            text="Recommended savings target = monthly expenses × months of coverage."
            align="left"
          />
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-3 text-lg font-semibold tabular-nums text-accent">
          {result ? formatMoney(result.emergencyFund, result.currency) : '—'}
        </div>
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
        <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <div className={labelClass}>
              <label htmlFor="current-savings">Current emergency savings</label>
              <InfoTooltip
                label="Current emergency savings"
                text="Optional: money already set aside for emergencies. Used only for progress, not for changing the fund formula."
                align="left"
              />
            </div>
            <FieldShell error={errors.currentSavings}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="current-savings"
                className={inputClass}
                inputMode="decimal"
                placeholder="0"
                value={input.currentSavings}
                aria-invalid={Boolean(errors.currentSavings)}
                onChange={(event) => set({ currentSavings: event.target.value })}
              />
            </FieldShell>
            {errors.currentSavings ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentSavings}</p>
            ) : null}
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
          aria-labelledby="ef-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="ef-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Average monthly expenses</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.monthlyExpenses, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Desired savings coverage</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.monthsDesired} month{result.monthsDesired === 1 ? '' : 's'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Required emergency fund</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.emergencyFund, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Annual living expenses</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.annualExpenses, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Daily living expenses (≈30-day)</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.dailyExpenses, result.currency)}
              </dd>
            </div>
          </dl>
          {result.progress ? (
            <div className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm">
              <p className="font-medium text-accent">
                {result.progress.isGoalAchieved
                  ? 'Goal achieved'
                  : `Savings in progress · ${result.progress.progressPercentage.toFixed(1)}%`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Remaining:{' '}
                {formatMoney(result.progress.remainingAmount, result.currency)} of{' '}
                {formatMoney(result.emergencyFund, result.currency)}
              </p>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">{result.explanation}</p>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter your average monthly expenses and desired savings period to calculate your emergency
          fund.
        </p>
      )}
    </form>
  );
}
