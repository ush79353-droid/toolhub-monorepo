'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoneyWithSymbol } from './calculation';
import { MillionaireChart } from './MillionaireChart';
import type {
  CompoundFrequency,
  DepositTiming,
  MillionaireFieldErrors,
  MillionaireInput,
  MillionaireResult,
} from './types';
import { COMPOUNDING_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface MillionaireFormProps {
  input: MillionaireInput;
  errors: MillionaireFieldErrors;
  result: MillionaireResult | null;
  onChange: (next: MillionaireInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function MillionaireForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: MillionaireFormProps) {
  const [specsOpen, setSpecsOpen] = React.useState(true);
  const [inflationOpen, setInflationOpen] = React.useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const money = (v: number) => formatMoneyWithSymbol(v, input.currency);

  const set = (patch: Partial<MillionaireInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Estimate how long it takes to reach a savings goal with compound
          interest, periodic deposits, and inflation-adjusted purchasing power.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-xs"
          onClick={onLoadExample}
        >
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="mil-currency">
          Display currency
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="mil-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {CURRENCY_DENOMINATION_NOTE}
        </p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="mil-target">How much do you want?</label>
        </div>
        <FieldShell error={errors.targetAmount}>
          <span className="pl-3 text-sm font-medium text-muted-foreground">
            {symbol}
          </span>
          <input
            id="mil-target"
            className={inputClass}
            inputMode="decimal"
            value={input.targetAmount}
            onChange={(e) => set({ targetAmount: e.target.value })}
          />
        </FieldShell>
        {errors.targetAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.targetAmount}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          onClick={() => setSpecsOpen((o) => !o)}
          aria-expanded={specsOpen}
        >
          <span>Main specifications</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${specsOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {specsOpen ? (
          <div className="space-y-3.5 border-t border-border bg-muted/15 p-3.5 sm:p-4">
            <div>
              <div className={labelClass}>
                <label htmlFor="mil-initial">Initial savings</label>
              </div>
              <FieldShell error={errors.initialSavings}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="mil-initial"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.initialSavings}
                  onChange={(e) => set({ initialSavings: e.target.value })}
                />
              </FieldShell>
              {errors.initialSavings ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.initialSavings}
                </p>
              ) : null}
            </div>

            <div>
              <div className={labelClass}>
                <label htmlFor="mil-rate">Annual interest rate</label>
              </div>
              <FieldShell error={errors.annualInterestRate}>
                <input
                  id="mil-rate"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualInterestRate}
                  onChange={(e) => set({ annualInterestRate: e.target.value })}
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.annualInterestRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualInterestRate}
                </p>
              ) : null}
            </div>

            <div>
              <div className={labelClass}>
                <label htmlFor="mil-compound">Compound frequency</label>
                <InfoTooltip
                  label="Compound frequency"
                  text="How often interest compounds. Additional deposits are applied once per compounding period. Continuously uses monthly deposits with a continuous period rate."
                  align="left"
                />
              </div>
              <select
                id="mil-compound"
                className={selectClass}
                value={input.compoundFrequency}
                onChange={(e) =>
                  set({
                    compoundFrequency: e.target.value as CompoundFrequency,
                  })
                }
              >
                {COMPOUNDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className={labelClass}>
                <label htmlFor="mil-deposit">Additional deposits</label>
              </div>
              <FieldShell error={errors.additionalDeposit}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="mil-deposit"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.additionalDeposit}
                  onChange={(e) => set({ additionalDeposit: e.target.value })}
                />
              </FieldShell>
              {errors.additionalDeposit ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.additionalDeposit}
                </p>
              ) : null}
            </div>

            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-accent">
                Additional deposits made at the
              </legend>
              <div className="flex flex-wrap gap-4 text-sm text-accent">
                {(
                  [
                    { value: 'end', label: 'End of period' },
                    { value: 'beginning', label: 'Beginning of period' },
                  ] as const
                ).map((opt) => (
                  <label key={opt.value} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="mil-timing"
                      checked={input.depositTiming === opt.value}
                      onChange={() =>
                        set({ depositTiming: opt.value as DepositTiming })
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <div className={labelClass}>
                <span>Duration to reach goal</span>
              </div>
              <div className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-semibold text-primary">
                {result?.goalReachable
                  ? result.goalAlreadyAchieved
                    ? 'Already reached'
                    : result.durationLabel
                  : result
                    ? 'Unreachable'
                    : '—'}
              </div>
              {result?.goalReachable && !result.goalAlreadyAchieved ? (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {result.yearsToGoal} years · {result.monthsToGoal} months ·{' '}
                  {result.totalMonths} total months
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <section className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <p
            className={`text-sm font-medium ${
              result.goalReachable ? 'text-accent' : 'text-rose-700'
            }`}
          >
            {result.statusMessage}
          </p>
          {result.goalReachable ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">
                  Total contributions
                </p>
                <p className="text-sm font-semibold tabular-nums text-accent">
                  {money(result.totalContributions)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">
                  Interest earned
                </p>
                <p className="text-sm font-semibold tabular-nums text-accent">
                  {money(result.totalInterest)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-brand-softTeal/30 px-3 py-2 sm:col-span-2">
                <p className="text-[11px] text-muted-foreground">
                  Final savings
                </p>
                <p className="text-sm font-semibold tabular-nums text-primary">
                  {money(result.finalSavings)}
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-accent">
              Savings Growth Over Time
            </h3>
            <MillionaireChart result={result} />
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          onClick={() => setInflationOpen((o) => !o)}
          aria-expanded={inflationOpen}
        >
          <span>Effect of Inflation</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${inflationOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {inflationOpen ? (
          <div className="space-y-3 border-t border-border bg-muted/15 p-3.5 sm:p-4">
            <div>
              <div className={labelClass}>
                <label htmlFor="mil-inflation">Inflation rate (%)</label>
              </div>
              <FieldShell error={errors.inflationRate}>
                <input
                  id="mil-inflation"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.inflationRate}
                  onChange={(e) => set({ inflationRate: e.target.value })}
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.inflationRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.inflationRate}
                </p>
              ) : null}
            </div>
            <div>
              <div className={labelClass}>
                <span>Future worth of money in today&apos;s dollars</span>
              </div>
              <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
                {result?.goalReachable
                  ? money(result.inflationAdjustedValue)
                  : '—'}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Inflation reduces the purchasing power of money over time. Your
              future savings balance may reach your nominal goal, but its
              purchasing power could be significantly lower than that amount
              today.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-10">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={onReload}
        >
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-10" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
