'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { InterestBreakdownChart } from './InterestBreakdownChart';
import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type ContributionTiming,
  type InterestFieldErrors,
  type InterestInput,
  type InterestResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface InterestFormProps {
  input: InterestInput;
  errors: InterestFieldErrors;
  result: InterestResult | null;
  onChange: (input: InterestInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function InterestForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: InterestFormProps) {
  const set = (patch: Partial<InterestInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="grid gap-4 lg:grid-cols-2">
        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Inputs</legend>

          <div>
            <label className={labelClass} htmlFor="int-initial">
              <span>Initial investment</span>
            </label>
            <FieldShell error={errors.initialInvestment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                $
              </span>
              <input
                id="int-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.initialInvestment}
                aria-invalid={Boolean(errors.initialInvestment)}
                onChange={(e) => set({ initialInvestment: e.target.value })}
              />
            </FieldShell>
            {errors.initialInvestment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="int-annual">
              <span>Annual contribution</span>
            </label>
            <FieldShell error={errors.annualContribution}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                $
              </span>
              <input
                id="int-annual"
                className={inputClass}
                inputMode="decimal"
                value={input.annualContribution}
                aria-invalid={Boolean(errors.annualContribution)}
                onChange={(e) => set({ annualContribution: e.target.value })}
              />
            </FieldShell>
            {errors.annualContribution ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualContribution}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="int-monthly">
              <span>Monthly contribution</span>
            </label>
            <FieldShell error={errors.monthlyContribution}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                $
              </span>
              <input
                id="int-monthly"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyContribution}
                aria-invalid={Boolean(errors.monthlyContribution)}
                onChange={(e) => set({ monthlyContribution: e.target.value })}
              />
            </FieldShell>
            {errors.monthlyContribution ? (
              <p className="mt-1 text-xs text-rose-600">{errors.monthlyContribution}</p>
            ) : null}
          </div>

          <div>
            <span className={labelClass}>
              <span>Contribute at the</span>
              <InfoTooltip
                label="Contribution timing"
                text="Beginning deposits earn interest in the same compounding period; end deposits start earning in the next period."
              />
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-accent">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="int-timing"
                  className="h-4 w-4 border-border"
                  checked={input.contributionTiming === 'beginning'}
                  onChange={() => set({ contributionTiming: 'beginning' as ContributionTiming })}
                />
                beginning
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="int-timing"
                  className="h-4 w-4 border-border"
                  checked={input.contributionTiming === 'end'}
                  onChange={() => set({ contributionTiming: 'end' as ContributionTiming })}
                />
                end
              </label>
              <span className="text-muted-foreground">of each compounding period.</span>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="int-rate">
              <span>Interest rate</span>
            </label>
            <FieldShell error={errors.interestRatePercent}>
              <input
                id="int-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.interestRatePercent}
                aria-invalid={Boolean(errors.interestRatePercent)}
                onChange={(e) => set({ interestRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.interestRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="int-compound">
              <span>Compound</span>
            </label>
            <select
              id="int-compound"
              className={selectClass}
              value={input.compounding}
              onChange={(e) =>
                set({ compounding: e.target.value as CompoundFrequency })
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
            <span className={labelClass}>
              <span>Investment length</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldShell error={errors.termYears}>
                  <input
                    id="int-years"
                    className={`${inputClass} pr-14`}
                    inputMode="numeric"
                    aria-label="Years"
                    value={input.termYears}
                    aria-invalid={Boolean(errors.termYears)}
                    onChange={(e) => set({ termYears: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    years
                  </span>
                </FieldShell>
              </div>
              <div>
                <FieldShell error={errors.termMonths}>
                  <input
                    id="int-months"
                    className={`${inputClass} pr-16`}
                    inputMode="numeric"
                    aria-label="Months"
                    value={input.termMonths}
                    aria-invalid={Boolean(errors.termMonths)}
                    onChange={(e) => set({ termMonths: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    months
                  </span>
                </FieldShell>
              </div>
            </div>
            {errors.termYears || errors.termMonths ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.termYears || errors.termMonths}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="int-tax">
              <span>Tax rate</span>
              <InfoTooltip
                label="Tax rate"
                text="Applied as an after-tax rate: nominal × (1 − tax/100). Ordinary income tax treatment varies; this is a simplified model."
              />
            </label>
            <FieldShell error={errors.taxRatePercent}>
              <input
                id="int-tax"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.taxRatePercent}
                aria-invalid={Boolean(errors.taxRatePercent)}
                onChange={(e) => set({ taxRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.taxRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.taxRatePercent}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="int-inflation">
              <span>Inflation rate</span>
            </label>
            <FieldShell error={errors.inflationRatePercent}>
              <input
                id="int-inflation"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.inflationRatePercent}
                aria-invalid={Boolean(errors.inflationRatePercent)}
                onChange={(e) => set({ inflationRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.inflationRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.inflationRatePercent}</p>
            ) : null}
          </div>

          {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button type="submit" className="h-11 font-medium">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 font-medium"
              onClick={onReset}
            >
              Clear
            </Button>
          </div>
        </fieldset>

        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

          {result ? (
            <>
              <div className="space-y-1.5 text-sm text-accent">
                <p>
                  Ending balance:{' '}
                  <strong className="tabular-nums">${result.formattedEndingBalance}</strong>
                </p>
                <p>
                  Total principal:{' '}
                  <span className="tabular-nums">${result.formattedTotalPrincipal}</span>
                </p>
                <p>
                  Total contributions:{' '}
                  <span className="tabular-nums">${result.formattedTotalContributions}</span>
                </p>
                <p>
                  Total interest:{' '}
                  <strong className="tabular-nums">${result.formattedTotalInterest}</strong>
                </p>
                <p>
                  Interest of initial investment:{' '}
                  <span className="tabular-nums">${result.formattedInterestOnInitial}</span>
                </p>
                <p>
                  Interest of the contributions:{' '}
                  <span className="tabular-nums">
                    ${result.formattedInterestOnContributions}
                  </span>
                </p>
                <p>
                  Buying power of the end balance after inflation adjustment:{' '}
                  <span className="tabular-nums">
                    ${result.formattedInflationAdjustedBalance}
                  </span>
                </p>
              </div>
              <InterestBreakdownChart result={result} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter valid inputs and calculate to see ending balance, interest split, and
              inflation-adjusted buying power.
            </p>
          )}
        </fieldset>
      </div>
    </form>
  );
}
