'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatLifetimeMoney,
  formatLifetimePercent,
  parseOptionalNumber,
} from './calculation';
import type {
  LifetimeEarningsFieldErrors,
  LifetimeEarningsInput,
  LifetimeEarningsResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface LifetimeEarningsFormProps {
  input: LifetimeEarningsInput;
  errors: LifetimeEarningsFieldErrors;
  result: LifetimeEarningsResult | null;
  onChange: (next: LifetimeEarningsInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function LifetimeEarningsForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: LifetimeEarningsFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<LifetimeEarningsInput>) =>
    onChange({ ...input, ...patch });
  const money = (v: number) =>
    `${symbol}${formatLifetimeMoney(v, input.currency)}`;

  const currentAge = parseOptionalNumber(input.currentAge);
  const retirementAge = parseOptionalNumber(input.retirementAge);
  const yearsLeft =
    currentAge !== null &&
    retirementAge !== null &&
    Number.isInteger(currentAge) &&
    Number.isInteger(retirementAge) &&
    retirementAge > currentAge
      ? retirementAge - currentAge
      : null;

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
          Estimate cumulative gross career earnings from current salary, annual raises, and years
          until retirement.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="le-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="le-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4">
          <span>Number of years left to work</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className={labelClass}>
                <label htmlFor="le-current-age">Current age</label>
              </div>
              <FieldShell error={errors.currentAge}>
                <input
                  id="le-current-age"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.currentAge}
                  onChange={(e) => set({ currentAge: e.target.value })}
                />
              </FieldShell>
              {errors.currentAge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
              ) : null}
            </div>
            <div>
              <div className={labelClass}>
                <label htmlFor="le-retire-age">Retirement age</label>
              </div>
              <FieldShell error={errors.retirementAge}>
                <input
                  id="le-retire-age"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.retirementAge}
                  onChange={(e) => set({ retirementAge: e.target.value })}
                />
              </FieldShell>
              {errors.retirementAge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
              ) : null}
            </div>
          </div>
          <div>
            <div className={labelClass}>
              <span>Working years left</span>
              <InfoTooltip
                label="Working years left"
                text="Automatically calculated as retirement age minus current age."
                align="left"
              />
            </div>
            <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/30 px-3 text-sm tabular-nums text-accent">
              {yearsLeft !== null ? `${yearsLeft} years` : '—'}
            </div>
          </div>
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4">
          <span>Lifetime earnings</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
          <div>
            <div className={labelClass}>
              <label htmlFor="le-salary">Current salary</label>
              <InfoTooltip
                label="Current salary"
                text="Annual gross salary for year 1 of the projection; not monthly pay."
                align="left"
              />
            </div>
            <FieldShell error={errors.currentSalary}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="le-salary"
                className={inputClass}
                inputMode="decimal"
                value={input.currentSalary}
                onChange={(e) => set({ currentSalary: e.target.value })}
              />
              <span className="pr-3 text-xs text-muted-foreground">/ year</span>
            </FieldShell>
            {errors.currentSalary ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentSalary}</p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <label htmlFor="le-growth">Expected salary increase per year</label>
            </div>
            <FieldShell error={errors.annualSalaryIncrease}>
              <input
                id="le-growth"
                className={inputClass}
                inputMode="decimal"
                value={input.annualSalaryIncrease}
                onChange={(e) => set({ annualSalaryIncrease: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.annualSalaryIncrease ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualSalaryIncrease}</p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <span>Lifetime earnings</span>
            </div>
            <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
              {result ? money(result.lifetimeEarnings) : '—'}
            </div>
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Lifetime earnings</h3>
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {money(result.lifetimeEarnings)}
          </p>
          <p className="text-sm text-muted-foreground">{result.summaryText}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Current age</dt>
              <dd className="tabular-nums">{result.currentAge}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Retirement age</dt>
              <dd className="tabular-nums">{result.retirementAge}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Working years left</dt>
              <dd className="tabular-nums">{result.workingYearsLeft}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Current annual salary</dt>
              <dd className="tabular-nums">{money(result.currentSalary)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Annual salary increase</dt>
              <dd className="tabular-nums">
                {formatLifetimePercent(result.salaryGrowthRatePercent)}%
              </dd>
            </div>
            <div className="flex justify-between gap-2 py-1.5">
              <dt className="text-muted-foreground">Final-year salary</dt>
              <dd className="tabular-nums">{money(result.finalYearSalary)}</dd>
            </div>
          </dl>

          <details className="rounded-lg border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-accent">
              <span>Annual salary projection</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </summary>
            <div className="max-h-[360px] overflow-auto border-t border-border">
              <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:text-sm">
                <thead className="sticky top-0 bg-muted/90 text-accent">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Year</th>
                    <th className="px-3 py-2 font-semibold">Age</th>
                    <th className="px-3 py-2 font-semibold">Annual salary</th>
                    <th className="px-3 py-2 font-semibold">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projection.map((row) => (
                    <tr key={row.year} className="odd:bg-muted/20">
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {row.year}
                      </td>
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {row.age}
                      </td>
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {money(row.annualSalary)}
                      </td>
                      <td className="border-t border-border/60 px-3 py-1.5 tabular-nums">
                        {money(row.cumulativeEarnings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      ) : null}
    </form>
  );
}
