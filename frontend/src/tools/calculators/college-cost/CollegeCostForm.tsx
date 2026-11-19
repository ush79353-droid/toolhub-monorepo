'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import {
  COLLEGE_TYPE_PRESETS,
  type CollegeCostFieldErrors,
  type CollegeCostInput,
  type CollegeCostResult,
  type CollegeTypePreset,
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

interface CollegeCostFormProps {
  input: CollegeCostInput;
  errors: CollegeCostFieldErrors;
  result: CollegeCostResult | null;
  onChange: (next: CollegeCostInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onLoadExample: () => void;
}

export function CollegeCostForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onLoadExample,
}: CollegeCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CollegeCostInput>) =>
    onChange({ ...input, ...patch });

  const applyPreset = (preset: CollegeTypePreset) => {
    if (preset === 'custom') {
      set({ collegeType: 'custom' });
      return;
    }
    const found = COLLEGE_TYPE_PRESETS.find((p) => p.id === preset);
    if (!found) return;
    set({
      collegeType: preset,
      annualCollegeCost: String(found.annualCost),
    });
  };

  const maxBar = result
    ? Math.max(...result.annualCostBreakdown.map((r) => r.projectedAnnualCost), 1)
    : 1;

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
          Project future college costs with inflation, then compare your savings target to projected
          balances (after-tax return).
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load defaults
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="cc-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="cc-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className={labelClass}>
            <label htmlFor="annual-cost">Today&apos;s annual college costs</label>
            <InfoTooltip
              label="Today's annual college costs"
              text="Current annual tuition, fees, and living costs. Presets are College Board 2025–2026 U.S. averages — not school-specific guarantees."
              align="left"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <FieldShell error={errors.annualCollegeCost}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="annual-cost"
                className={inputClass}
                inputMode="decimal"
                value={input.annualCollegeCost}
                aria-invalid={Boolean(errors.annualCollegeCost)}
                onChange={(event) =>
                  set({
                    annualCollegeCost: event.target.value,
                    collegeType: 'custom',
                  })
                }
              />
            </FieldShell>
            <div>
              <label className="sr-only" htmlFor="college-type">
                Or select a college type
              </label>
              <select
                id="college-type"
                className={selectClass}
                value={input.collegeType}
                onChange={(event) =>
                  applyPreset(event.target.value as CollegeTypePreset)
                }
              >
                <option value="custom">Custom amount</option>
                {COLLEGE_TYPE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Or select a college type (reference averages)
              </p>
            </div>
          </div>
          {errors.annualCollegeCost ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualCollegeCost}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="inflation">College cost increase rate</label>
            <InfoTooltip
              label="College cost increase rate"
              text="Annual percentage increase applied to each academic year. 5% is a common planning assumption."
              align="left"
            />
          </div>
          <FieldShell error={errors.collegeCostIncreaseRate}>
            <input
              id="inflation"
              className={inputClass}
              inputMode="decimal"
              value={input.collegeCostIncreaseRate}
              aria-invalid={Boolean(errors.collegeCostIncreaseRate)}
              onChange={(event) => set({ collegeCostIncreaseRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          <p className="mt-1 text-[11px] text-muted-foreground">5% recommended</p>
          {errors.collegeCostIncreaseRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.collegeCostIncreaseRate}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="duration">Expected college attendance duration</label>
            <InfoTooltip
              label="Expected college attendance duration"
              text="Number of academic years to fund (for example 2 or 4)."
              align="left"
            />
          </div>
          <FieldShell error={errors.attendanceDuration}>
            <input
              id="duration"
              className={inputClass}
              inputMode="numeric"
              value={input.attendanceDuration}
              aria-invalid={Boolean(errors.attendanceDuration)}
              onChange={(event) => set({ attendanceDuration: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.attendanceDuration ? (
            <p className="mt-1 text-xs text-rose-600">{errors.attendanceDuration}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="pct-savings">Percent of costs from savings</label>
            <InfoTooltip
              label="Percent of costs from savings"
              text="Share of projected college costs you plan to cover with savings. The rest may come from aid, loans, or family support."
              align="left"
            />
          </div>
          <FieldShell error={errors.percentFromSavings}>
            <input
              id="pct-savings"
              className={inputClass}
              inputMode="decimal"
              value={input.percentFromSavings}
              aria-invalid={Boolean(errors.percentFromSavings)}
              onChange={(event) => set({ percentFromSavings: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          {errors.percentFromSavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.percentFromSavings}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="savings-now">College savings balance now</label>
            <InfoTooltip
              label="College savings balance now"
              text="Amount already saved toward college. It grows at the after-tax return until college begins."
              align="left"
            />
          </div>
          <FieldShell error={errors.currentSavingsBalance}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="savings-now"
              className={inputClass}
              inputMode="decimal"
              value={input.currentSavingsBalance}
              aria-invalid={Boolean(errors.currentSavingsBalance)}
              onChange={(event) => set({ currentSavingsBalance: event.target.value })}
            />
          </FieldShell>
          {errors.currentSavingsBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentSavingsBalance}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="return-rate">Interest or investment return rate</label>
            <InfoTooltip
              label="Interest or investment return rate"
              text="Expected annual return on college savings before applying the tax rate on earnings."
              align="left"
            />
          </div>
          <FieldShell error={errors.investmentReturnRate}>
            <input
              id="return-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.investmentReturnRate}
              aria-invalid={Boolean(errors.investmentReturnRate)}
              onChange={(event) => set({ investmentReturnRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          {errors.investmentReturnRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.investmentReturnRate}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="tax-rate">Tax rate on interest or investment return</label>
            <InfoTooltip
              label="Tax rate on interest or investment return"
              text="Estimated tax on investment earnings only — not on principal. Use 0% for eligible 529 plan savings."
              align="left"
            />
          </div>
          <FieldShell error={errors.taxRate}>
            <input
              id="tax-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.taxRate}
              aria-invalid={Boolean(errors.taxRate)}
              onChange={(event) => set({ taxRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Including federal, state, and local tax. Use 0% for eligible 529 plan savings.
          </p>
          {errors.taxRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxRate}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="years-until">College will start in</label>
            <InfoTooltip
              label="College will start in"
              text="Years until enrollment. Costs inflate and savings grow over this period."
              align="left"
            />
          </div>
          <FieldShell error={errors.yearsUntilCollege}>
            <input
              id="years-until"
              className={inputClass}
              inputMode="numeric"
              value={input.yearsUntilCollege}
              aria-invalid={Boolean(errors.yearsUntilCollege)}
              onChange={(event) => set({ yearsUntilCollege: event.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.yearsUntilCollege ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yearsUntilCollege}</p>
          ) : null}
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear
        </Button>
      </div>

      {result ? (
        <div className="space-y-4">
          <section
            aria-labelledby="cc-results-heading"
            className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          >
            <h3 id="cc-results-heading" className="text-sm font-semibold text-accent">
              Results
            </h3>
            <div>
              <p className="text-xs text-muted-foreground">Total projected college cost</p>
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-accent">
                {formatMoney(result.totalProjectedCollegeCost, result.currency)}
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">First-year college cost</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.firstYearFutureCost, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Savings-funded target</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.savingsFundedTarget, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Projected college savings</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.projectedCurrentSavings, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {result.savingsSurplus > 0 ? 'Savings surplus' : 'Additional savings required'}
                </dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(
                    result.savingsSurplus > 0 ? result.savingsSurplus : result.fundingGap,
                    result.currency,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Required monthly savings</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.requiredMonthlySavings, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Required annual savings (est.)</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.requiredAnnualSavings, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Savings coverage</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {result.savingsCoveragePercentage.toFixed(2)}%
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Other funding requirement</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(result.otherFundingTarget, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">After-tax return</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {result.afterTaxInvestmentReturnPercent.toFixed(2)}%
                </dd>
              </div>
            </dl>
            <div
              className={`rounded-lg px-3 py-2.5 text-sm ${
                result.financialStatus === 'additional-savings-required'
                  ? 'bg-amber-100 text-amber-950'
                  : 'bg-emerald-100 text-emerald-950'
              }`}
            >
              <p className="font-semibold">
                {result.financialStatus === 'fully-funded'
                  ? 'Savings target fully covered'
                  : result.financialStatus === 'savings-surplus'
                    ? 'Savings exceed the target'
                    : 'Additional savings required'}
              </p>
              <p className="mt-1 text-xs opacity-90">{result.explanation}</p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Monthly/annual contribution estimates assume end-of-period deposits and a constant
              after-tax return.
            </p>
          </section>

          <section
            aria-labelledby="cc-breakdown-heading"
            className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4"
          >
            <h3 id="cc-breakdown-heading" className="text-sm font-semibold text-accent">
              Projected college costs by year
            </h3>
            <div
              className="flex h-36 items-end gap-2"
              role="img"
              aria-label="Bar chart of projected annual college costs"
            >
              {result.annualCostBreakdown.map((row) => (
                <div key={row.academicYear} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[48px] rounded-t bg-primary/80"
                    style={{
                      height: `${Math.max(8, (row.projectedAnnualCost / maxBar) * 100)}%`,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">Y{row.academicYear}</span>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Academic year</th>
                    <th className="px-3 py-2 text-right font-medium">Projected annual cost</th>
                    <th className="px-3 py-2 text-right font-medium">Savings-funded</th>
                    <th className="px-3 py-2 text-right font-medium">Other funding</th>
                  </tr>
                </thead>
                <tbody>
                  {result.annualCostBreakdown.map((row) => (
                    <tr key={row.academicYear} className="border-t border-border">
                      <td className="px-3 py-1.5">Year {row.academicYear}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {formatMoney(row.projectedAnnualCost, result.currency)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {formatMoney(row.savingsFundedAmount, result.currency)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {formatMoney(row.otherFundingAmount, result.currency)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-border bg-muted/30 font-medium">
                    <td className="px-3 py-1.5">Total</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMoney(result.totalProjectedCollegeCost, result.currency)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMoney(result.savingsFundedTarget, result.currency)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMoney(result.otherFundingTarget, result.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter your college cost assumptions, then Calculate to project expenses and savings needs.
        </p>
      )}
    </form>
  );
}
