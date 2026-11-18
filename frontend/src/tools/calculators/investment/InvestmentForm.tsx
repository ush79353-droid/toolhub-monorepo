'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_FREQUENCY_OPTIONS,
  INVESTMENT_GOAL_OPTIONS,
  type ContributionFrequency,
  type InvestmentFieldErrors,
  type InvestmentInput,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface InvestmentFormProps {
  input: InvestmentInput;
  errors: InvestmentFieldErrors;
  onChange: (input: InvestmentInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function InvestmentForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onReset,
}: InvestmentFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<InvestmentInput>) => onChange({ ...input, ...patch });
  const showContrib = input.contributionFrequency !== 'never';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Calculation selection</legend>
        <div>
          <label className={labelClass} htmlFor="inv-goal">
            <span>I would like to know…</span>
            <InfoTooltip
              label="Calculation goal"
              text="This calculator projects the final investment balance from the inputs below."
            />
          </label>
          <select
            id="inv-goal"
            className={selectClass}
            value={input.goal}
            onChange={(event) =>
              set({ goal: event.target.value as InvestmentInput['goal'] })
            }
          >
            {INVESTMENT_GOAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Main features</legend>

        <div>
          <label className={labelClass} htmlFor="inv-initial">
            <span>Initial investment</span>
            <InfoTooltip label="Initial investment" text="Starting principal invested today." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialInvestment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="inv-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.initialInvestment}
                aria-invalid={Boolean(errors.initialInvestment)}
                onChange={(event) => set({ initialInvestment: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="inv-initial-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Initial investment currency"
              />
            </div>
          </div>
          {errors.initialInvestment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inv-rate">
            <span>Rate of return</span>
            <InfoTooltip
              label="Rate of return"
              text="Annual nominal rate of return before compounding frequency is applied."
            />
          </label>
          <FieldShell error={errors.rateOfReturn}>
            <input
              id="inv-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.rateOfReturn}
              aria-invalid={Boolean(errors.rateOfReturn)}
              onChange={(event) => set({ rateOfReturn: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.rateOfReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rateOfReturn}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inv-term">
            <span>Term</span>
            <InfoTooltip label="Term" text="Investment length in years. Must be greater than zero." />
          </label>
          <FieldShell error={errors.termYears}>
            <input
              id="inv-term"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.termYears}
              aria-invalid={Boolean(errors.termYears)}
              onChange={(event) => set({ termYears: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.termYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inv-compound">
            <span>Compound frequency</span>
            <InfoTooltip
              label="Compound frequency"
              text="How often interest is compounded each year."
            />
          </label>
          <select
            id="inv-compound"
            className={selectClass}
            value={input.compounding}
            onChange={(event) =>
              set({ compounding: event.target.value as InvestmentInput['compounding'] })
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
          <label className={labelClass} htmlFor="inv-inflation">
            <span>Annual inflation rate</span>
            <InfoTooltip
              label="Annual inflation rate"
              text="Used only to show an inflation-adjusted final balance. Leave at 0 to skip."
            />
          </label>
          <FieldShell error={errors.inflationRate}>
            <input
              id="inv-inflation"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.inflationRate}
              aria-invalid={Boolean(errors.inflationRate)}
              onChange={(event) => set({ inflationRate: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.inflationRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationRate}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Additional contributions
        </legend>

        <div>
          <label className={labelClass} htmlFor="inv-contrib-freq">
            <span>How often?</span>
            <InfoTooltip
              label="Contribution frequency"
              text="How often you add money. Choose Never for a single lump-sum investment."
            />
          </label>
          <select
            id="inv-contrib-freq"
            className={selectClass}
            value={input.contributionFrequency}
            onChange={(event) =>
              set({
                contributionFrequency: event.target.value as ContributionFrequency,
              })
            }
          >
            {CONTRIBUTION_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {showContrib ? (
          <>
            <div>
              <label className={labelClass} htmlFor="inv-contrib-amount">
                <span>Contribution amount</span>
                <InfoTooltip
                  label="Contribution amount"
                  text="Amount added each contribution period."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.contributionAmount}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                    {symbol}
                  </span>
                  <input
                    id="inv-contrib-amount"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.contributionAmount}
                    aria-invalid={Boolean(errors.contributionAmount)}
                    onChange={(event) => set({ contributionAmount: event.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="inv-contrib-currency"
                    value={input.currency}
                    onChange={onCurrencyChange}
                    aria-label="Contribution currency"
                  />
                </div>
              </div>
              {errors.contributionAmount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.contributionAmount}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="inv-contrib-timing">
                <span>Contribute at</span>
                <InfoTooltip
                  label="Contribution timing"
                  text="Whether each contribution is added at the beginning or end of the compounding period."
                />
              </label>
              <select
                id="inv-contrib-timing"
                className={selectClass}
                value={input.contributionTiming}
                onChange={(event) =>
                  set({
                    contributionTiming: event.target
                      .value as InvestmentInput['contributionTiming'],
                  })
                }
              >
                <option value="end">End of period</option>
                <option value="beginning">Beginning of period</option>
              </select>
            </div>
          </>
        ) : null}
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
