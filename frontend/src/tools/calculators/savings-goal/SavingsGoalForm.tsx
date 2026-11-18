'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  CONTRIBUTION_TIMING_OPTIONS,
  GOAL_HORIZON_OPTIONS,
  type CompoundFrequency,
  type ContributionFrequency,
  type ContributionTiming,
  type GoalHorizonMode,
  type SavingsGoalFieldErrors,
  type SavingsGoalInput,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface SavingsGoalFormProps {
  input: SavingsGoalInput;
  errors: SavingsGoalFieldErrors;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: SavingsGoalInput) => void;
  onGoalCurrencyChange: (next: SupportedCurrency) => void;
  onStartingCurrencyChange: (next: SupportedCurrency) => void;
}

export function SavingsGoalForm({
  input,
  errors,
  conversionError,
  ratesWarning,
  onChange,
  onGoalCurrencyChange,
  onStartingCurrencyChange,
}: SavingsGoalFormProps) {
  const goalSymbol = getCurrencySymbol(input.goalCurrency);
  const startingSymbol = getCurrencySymbol(input.startingCurrency);

  const set = (patch: Partial<SavingsGoalInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.objectivesOpen}
        onToggle={(event) => set({ objectivesOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.objectivesOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Saving objectives</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="sg-goal">
              <span>Your goal</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.goalAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {goalSymbol}
                </span>
                <input
                  id="sg-goal"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.goalAmount}
                  aria-invalid={Boolean(errors.goalAmount)}
                  onChange={(e) => set({ goalAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sg-goal-currency"
                  value={input.goalCurrency}
                  onChange={onGoalCurrencyChange}
                  aria-label="Goal currency"
                />
              </div>
            </div>
            {errors.goalAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.goalAmount}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-horizon">
              <span>I would like to reach it…</span>
            </label>
            <select
              id="sg-horizon"
              className={selectClass}
              value={input.horizonMode}
              onChange={(e) =>
                set({ horizonMode: e.target.value as GoalHorizonMode })
              }
            >
              {GOAL_HORIZON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {input.horizonMode === 'at_age' ? (
            <>
              <div>
                <label className={labelClass} htmlFor="sg-current-age">
                  <span>Your age now</span>
                  <InfoTooltip
                    label="Your age now"
                    text="Your current age in whole years. Used with target age to set the savings horizon. Not FX-converted."
                  />
                </label>
                <FieldShell error={errors.currentAge}>
                  <input
                    id="sg-current-age"
                    className={`${inputClass} pr-14`}
                    inputMode="decimal"
                    value={input.currentAge}
                    aria-invalid={Boolean(errors.currentAge)}
                    onChange={(e) => set({ currentAge: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    years
                  </span>
                </FieldShell>
                {errors.currentAge ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
                ) : null}
              </div>

              <div>
                <label className={labelClass} htmlFor="sg-target-age">
                  <span>Your target age</span>
                </label>
                <FieldShell error={errors.targetAge}>
                  <input
                    id="sg-target-age"
                    className={`${inputClass} pr-14`}
                    inputMode="decimal"
                    value={input.targetAge}
                    aria-invalid={Boolean(errors.targetAge)}
                    onChange={(e) => set({ targetAge: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    years
                  </span>
                </FieldShell>
                {errors.targetAge ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.targetAge}</p>
                ) : null}
              </div>
            </>
          ) : (
            <div>
              <label className={labelClass} htmlFor="sg-years">
                <span>Years until goal</span>
                <InfoTooltip
                  label="Years until goal"
                  text="How many years from now you want to reach the goal. Not FX-converted."
                />
              </label>
              <FieldShell error={errors.yearsUntilGoal}>
                <input
                  id="sg-years"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.yearsUntilGoal}
                  aria-invalid={Boolean(errors.yearsUntilGoal)}
                  onChange={(e) => set({ yearsUntilGoal: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  years
                </span>
              </FieldShell>
              {errors.yearsUntilGoal ? (
                <p className="mt-1 text-xs text-rose-600">{errors.yearsUntilGoal}</p>
              ) : null}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="sg-starting">
              <span>Your starting savings</span>
              <InfoTooltip
                label="Your starting savings"
                text="Balance you already have. Compounds over the horizon before contributions are applied. Converted into the goal currency when currencies differ."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.startingSavings}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {startingSymbol}
                </span>
                <input
                  id="sg-starting"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.startingSavings}
                  aria-invalid={Boolean(errors.startingSavings)}
                  onChange={(e) => set({ startingSavings: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sg-starting-currency"
                  value={input.startingCurrency}
                  onChange={onStartingCurrencyChange}
                  aria-label="Starting savings currency"
                />
              </div>
            </div>
            {errors.startingSavings ? (
              <p className="mt-1 text-xs text-rose-600">{errors.startingSavings}</p>
            ) : null}
            {conversionError ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {conversionError}
              </p>
            ) : null}
            {ratesWarning && !conversionError ? (
              <p className="mt-1 text-xs text-amber-700">{ratesWarning}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.conditionsOpen}
        onToggle={(event) => set({ conditionsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.conditionsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Saving conditions</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="sg-rate">
              <span>Interest rate or return</span>
              <InfoTooltip
                label="Interest rate or return"
                text="Nominal annual rate before compounding. Zero is allowed. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.interestRatePercent}>
              <input
                id="sg-rate"
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
              <p className="mt-1 text-xs text-rose-600">
                {errors.interestRatePercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-compounding">
              <span>Compounding method</span>
              <InfoTooltip
                label="Compounding method"
                text="How often interest is compounded. Combined with contribution frequency to get the effective rate per contribution period."
              />
            </label>
            <select
              id="sg-compounding"
              className={selectClass}
              value={input.compounding}
              aria-invalid={Boolean(errors.compounding)}
              onChange={(e) =>
                set({ compounding: e.target.value as CompoundFrequency })
              }
            >
              {COMPOUNDING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.compounding ? (
              <p className="mt-1 text-xs text-rose-600">{errors.compounding}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-inflation">
              <span>Inflation rate</span>
              <InfoTooltip
                label="Inflation rate"
                text="Annual inflation. The goal is treated as today’s purchasing power and inflated to a nominal future target. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.inflationRatePercent}>
              <input
                id="sg-inflation"
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
              <p className="mt-1 text-xs text-rose-600">
                {errors.inflationRatePercent}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.contributionOpen}
        onToggle={(event) =>
          set({ contributionOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.contributionOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Periodic contribution</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="sg-how-often">
              <span>How often?</span>
            </label>
            <select
              id="sg-how-often"
              className={selectClass}
              value={input.contributionFrequency}
              aria-invalid={Boolean(errors.contributionFrequency)}
              onChange={(e) =>
                set({
                  contributionFrequency: e.target
                    .value as ContributionFrequency,
                })
              }
            >
              {CONTRIBUTION_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.contributionFrequency ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.contributionFrequency}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-when">
              <span>When?</span>
            </label>
            <select
              id="sg-when"
              className={selectClass}
              value={input.contributionTiming}
              aria-invalid={Boolean(errors.contributionTiming)}
              onChange={(e) =>
                set({
                  contributionTiming: e.target.value as ContributionTiming,
                })
              }
            >
              {CONTRIBUTION_TIMING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.contributionTiming ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.contributionTiming}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-annual-growth">
              <span>Annual growth rate</span>
              <InfoTooltip
                label="Annual growth rate"
                text="Yearly step-up of the contribution, converted to an equivalent per-period growth rate. Do not combine with periodic growth. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.annualGrowthPercent}>
              <input
                id="sg-annual-growth"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.annualGrowthPercent}
                aria-invalid={Boolean(errors.annualGrowthPercent)}
                onChange={(e) => set({ annualGrowthPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.annualGrowthPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.annualGrowthPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="sg-periodic-growth">
              <span>Periodic growth rate</span>
              <InfoTooltip
                label="Periodic growth rate"
                text="Growth applied each contribution period. Do not combine with annual growth. Not FX-converted."
              />
            </label>
            <FieldShell error={errors.periodicGrowthPercent}>
              <input
                id="sg-periodic-growth"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.periodicGrowthPercent}
                aria-invalid={Boolean(errors.periodicGrowthPercent)}
                onChange={(e) => set({ periodicGrowthPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.periodicGrowthPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.periodicGrowthPercent}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
