'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatFireMoney, formatFirePercent, parseOptionalNumber } from './calculation';
import { FireProjectionChart } from './FireChart';
import {
  FIRE_METHOD_OPTIONS,
  type FireFieldErrors,
  type FireInput,
  type FireResult,
  type FireStatus,
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

function statusClass(status: FireStatus): string {
  switch (status) {
    case 'financially-independent':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'on-track':
      return 'border-sky-200 bg-sky-50 text-sky-800';
    case 'almost-there':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'below-target':
      return 'border-orange-200 bg-orange-50 text-orange-900';
    case 'not-achievable':
      return 'border-rose-200 bg-rose-50 text-rose-800';
  }
}

interface FireFormProps {
  input: FireInput;
  errors: FireFieldErrors;
  result: FireResult | null;
  onChange: (next: FireInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function FireForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: FireFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FireInput>) => onChange({ ...input, ...patch });
  const money = (v: number) => `${symbol}${formatFireMoney(v, input.currency)}`;

  const currentAge = parseOptionalNumber(input.currentAge);
  const retirementAge = parseOptionalNumber(input.retirementAge);
  const lifeExpectancy = parseOptionalNumber(input.lifeExpectancy);
  const yearsSaving =
    currentAge !== null && retirementAge !== null && retirementAge > currentAge
      ? retirementAge - currentAge
      : null;
  const yearsRetired =
    retirementAge !== null &&
    lifeExpectancy !== null &&
    lifeExpectancy > retirementAge
      ? lifeExpectancy - retirementAge
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
          Estimate your FIRE number, required savings rate, and path to financial independence.
          Returns are assumptions, not guarantees.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="fire-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="fire-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      {/* Card 1 */}
      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Retirement planning inputs</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className={labelClass}>
              <label htmlFor="fire-current-age">Current age</label>
            </div>
            <FieldShell error={errors.currentAge}>
              <input
                id="fire-current-age"
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
              <label htmlFor="fire-retire-age">Age of retiring</label>
            </div>
            <FieldShell error={errors.retirementAge}>
              <input
                id="fire-retire-age"
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
            <span>Years of saving</span>
            <InfoTooltip
              label="Years of saving"
              text="Automatically calculated as retirement age minus current age."
              align="left"
            />
          </div>
          <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/30 px-3 text-sm tabular-nums text-accent">
            {yearsSaving !== null ? `${yearsSaving} years` : '—'}
          </div>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="fire-income">Current income</label>
            <InfoTooltip
              label="Current income"
              text="Annual income used for the required savings-rate percentage."
              align="left"
            />
          </div>
          <FieldShell error={errors.annualIncome}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="fire-income"
              className={inputClass}
              inputMode="decimal"
              value={input.annualIncome}
              onChange={(e) => set({ annualIncome: e.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">/ year</span>
          </FieldShell>
          {errors.annualIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualIncome}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="fire-expenses">Expenses</label>
            <InfoTooltip
              label="Expenses"
              text="Living expenses that drive your FIRE number. Switch monthly/annual as needed."
              align="left"
            />
          </div>
          <div className="flex gap-2">
            <FieldShell error={errors.expenses}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="fire-expenses"
                className={inputClass}
                inputMode="decimal"
                value={input.expenses}
                onChange={(e) => set({ expenses: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.expenseFrequency}
              aria-label="Expense frequency"
              onChange={(e) =>
                set({
                  expenseFrequency: e.target.value as FireInput['expenseFrequency'],
                })
              }
            >
              <option value="annual">/ year</option>
              <option value="monthly">/ month</option>
            </select>
          </div>
          {errors.expenses ? (
            <p className="mt-1 text-xs text-rose-600">{errors.expenses}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="fire-savings">Current savings</label>
          </div>
          <FieldShell error={errors.currentSavings}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="fire-savings"
              className={inputClass}
              inputMode="decimal"
              value={input.currentSavings}
              onChange={(e) => set({ currentSavings: e.target.value })}
            />
          </FieldShell>
          {errors.currentSavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentSavings}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className={labelClass}>
              <label htmlFor="fire-return">Savings rate of return</label>
              <InfoTooltip
                label="Investment return"
                text="Assumed annual portfolio return. Not a guarantee."
                align="left"
              />
            </div>
            <FieldShell error={errors.investmentReturnPercent}>
              <input
                id="fire-return"
                className={inputClass}
                inputMode="decimal"
                value={input.investmentReturnPercent}
                onChange={(e) => set({ investmentReturnPercent: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.investmentReturnPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.investmentReturnPercent}</p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <label htmlFor="fire-inflation">Expense inflation</label>
            </div>
            <FieldShell error={errors.expenseInflationPercent}>
              <input
                id="fire-inflation"
                className={inputClass}
                inputMode="decimal"
                value={input.expenseInflationPercent}
                onChange={(e) => set({ expenseInflationPercent: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.expenseInflationPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.expenseInflationPercent}</p>
            ) : null}
          </div>
        </div>

        <details className="rounded-lg border border-border bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-accent">
            <span>Additional options</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
          </summary>
          <div className="space-y-3 border-t border-border px-3 py-3">
            <div>
              <div className={labelClass}>
                <label htmlFor="fire-salary-growth">Salary growth rate</label>
                <InfoTooltip
                  label="Salary growth"
                  text="Used when estimating the required savings percentage with growing income. Independent from expense inflation."
                  align="left"
                />
              </div>
              <FieldShell error={errors.salaryGrowthPercent}>
                <input
                  id="fire-salary-growth"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salaryGrowthPercent}
                  onChange={(e) => set({ salaryGrowthPercent: e.target.value })}
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.salaryGrowthPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salaryGrowthPercent}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="fire-method">
                FIRE calculation method
              </label>
              <select
                id="fire-method"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.method}
                onChange={(e) =>
                  set({ method: e.target.value as FireInput['method'] })
                }
              >
                {FIRE_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {input.method !== 'traditional-fire' &&
            input.method !== 'retirement-duration' ? (
              <div>
                <div className={labelClass}>
                  <label htmlFor="fire-swr">Safe withdrawal rate</label>
                </div>
                <FieldShell error={errors.safeWithdrawalRatePercent}>
                  <input
                    id="fire-swr"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.safeWithdrawalRatePercent}
                    onChange={(e) =>
                      set({ safeWithdrawalRatePercent: e.target.value })
                    }
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.safeWithdrawalRatePercent ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.safeWithdrawalRatePercent}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </details>
      </section>

      {/* Card 2 */}
      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">
          Amount required for financial independence
        </h3>
        <div>
          <div className={labelClass}>
            <label htmlFor="fire-life">Your life expectancy</label>
          </div>
          <FieldShell error={errors.lifeExpectancy}>
            <input
              id="fire-life"
              className={inputClass}
              inputMode="numeric"
              value={input.lifeExpectancy}
              onChange={(e) => set({ lifeExpectancy: e.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.lifeExpectancy ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lifeExpectancy}</p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Years on retirement</span>
          </div>
          <div className="flex h-11 items-center rounded-lg border border-dashed border-border bg-muted/30 px-3 text-sm tabular-nums text-accent">
            {yearsRetired !== null ? `${yearsRetired} years` : '—'}
          </div>
        </div>
        <div>
          <div className={labelClass}>
            <span>Total amount required</span>
          </div>
          <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
            {result ? money(result.fireNumber) : '—'}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {input.method === 'traditional-fire'
              ? 'Uses the 4% rule on inflation-adjusted retirement expenses.'
              : input.method === 'custom-withdrawal'
                ? 'Uses your custom safe withdrawal rate on inflation-adjusted expenses.'
                : 'Present value of retirement expenses over the retirement duration at an estimated real return.'}
          </p>
        </div>
      </section>

      {/* Card 3 */}
      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">
          To achieve financial independence
        </h3>
        <div>
          <div className={labelClass}>
            <span>Do you need to save yearly?</span>
          </div>
          <div className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-semibold tabular-nums text-primary">
            {result
              ? result.alreadyFundedByExistingSavings
                ? 'No additional annual savings required based on these assumptions.'
                : money(result.requiredAnnualSavings)
              : '—'}
          </div>
          {result && !result.alreadyFundedByExistingSavings ? (
            <p className="mt-1 text-xs text-muted-foreground">
              About {money(result.requiredMonthlySavings)} per month with monthly compounding.
            </p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Which is your required savings percentage of income?</span>
          </div>
          <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
            {result
              ? `${formatFirePercent(result.requiredSavingsRatePercent)}%`
              : '—'}
          </div>
          {result && result.requiredSavingsRatePercent > 100 ? (
            <p className="mt-1 text-xs text-rose-600">
 Required savings exceed 100% of income; this target may not be achievable with the
              current assumptions.
            </p>
          ) : null}
        </div>
      </section>

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
          <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${statusClass(result.status)}`}>
            {result.statusLabel}
          </div>
          <h3 className="text-sm font-semibold text-accent">Your FIRE number</h3>
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {money(result.fireNumber)}
          </p>
          <p className="text-sm text-muted-foreground">{result.summaryText}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Years until retirement</dt>
              <dd className="tabular-nums">{result.yearsUntilRetirement}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Retirement duration</dt>
              <dd className="tabular-nums">{result.retirementDuration}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Expenses at retirement</dt>
              <dd className="tabular-nums">{money(result.annualExpensesAtRetirement)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">FV of current savings</dt>
              <dd className="tabular-nums">{money(result.futureValueOfCurrentSavings)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Projected at retirement</dt>
              <dd className="tabular-nums">{money(result.projectedSavingsAtRetirement)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Surplus / shortfall</dt>
              <dd className="tabular-nums">
                {result.portfolioSurplusOrShortfall < 0 ? '−' : ''}
                {money(result.portfolioSurplusOrShortfall)}
              </dd>
            </div>
            <div className="flex justify-between gap-2 py-1.5 sm:col-span-2">
              <dt className="text-muted-foreground">Estimated FI age</dt>
              <dd className="tabular-nums">
                {result.estimatedFiAge ?? 'Not before retirement age'}
              </dd>
            </div>
          </dl>

          <FireProjectionChart
            points={result.projection}
            currency={result.currency}
            retirementAge={parseOptionalNumber(input.retirementAge) ?? 0}
            fiAge={result.estimatedFiAge}
          />

          <details className="rounded-lg border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-accent">
              <span>Explore different scenarios</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            </summary>
            <div className="overflow-x-auto border-t border-border">
              <table className="w-full min-w-[520px] border-collapse text-left text-xs sm:text-sm">
                <thead className="bg-muted/60 text-accent">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Scenario</th>
                    <th className="px-3 py-2 font-semibold">Return</th>
                    <th className="px-3 py-2 font-semibold">FIRE #</th>
                    <th className="px-3 py-2 font-semibold">Annual save</th>
                    <th className="px-3 py-2 font-semibold">FI age</th>
                    <th className="px-3 py-2 font-semibold">Surplus</th>
                  </tr>
                </thead>
                <tbody>
                  {result.scenarios.map((s) => (
                    <tr key={s.name} className="odd:bg-muted/20">
                      <td className="border-t border-border/60 px-3 py-2">{s.name}</td>
                      <td className="border-t border-border/60 px-3 py-2 tabular-nums">
                        {s.annualReturnPercent}%
                      </td>
                      <td className="border-t border-border/60 px-3 py-2 tabular-nums">
                        {money(s.fireNumber)}
                      </td>
                      <td className="border-t border-border/60 px-3 py-2 tabular-nums">
                        {money(s.requiredAnnualSavings)}
                      </td>
                      <td className="border-t border-border/60 px-3 py-2 tabular-nums">
                        {s.estimatedFiAge ?? '—'}
                      </td>
                      <td className="border-t border-border/60 px-3 py-2 tabular-nums">
                        {s.surplusOrShortfall < 0 ? '−' : ''}
                        {money(s.surplusOrShortfall)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 text-[11px] text-muted-foreground">
                Scenario returns are editable planning assumptions, not forecasts.
              </p>
            </div>
          </details>
        </section>
      ) : null}
    </form>
  );
}
