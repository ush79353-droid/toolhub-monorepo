'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type ContributionFrequency,
  type InvestmentMode,
  type MoneyMarketAccountFieldErrors,
  type MoneyMarketAccountInput,
  type MoneyMarketAccountResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface MoneyMarketAccountFormProps {
  input: MoneyMarketAccountInput;
  errors: MoneyMarketAccountFieldErrors;
  result: MoneyMarketAccountResult | null;
  onChange: (input: MoneyMarketAccountInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function MoneyMarketAccountForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: MoneyMarketAccountFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MoneyMarketAccountInput>) => onChange({ ...input, ...patch });
  const isSip = input.mode === 'sip';

  const moneyOutput = (
    id: string,
    label: string,
    tip: string,
    display: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <ReadOnlyShell>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="mma-investment-heading">
        <h3 id="mma-investment-heading" className={sectionTitleClass}>
          Investment form
        </h3>

        <fieldset>
          <legend className="sr-only">Investment type</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['sip', 'Systematic Investment Plan'],
                ['one-time', 'One-time investment'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="mma-mode"
                  className="h-4 w-4 border-border accent-primary"
                  checked={input.mode === value}
                  onChange={() => set({ mode: value as InvestmentMode })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="mma-starting" className={labelClass}>
            Starting balance
            <InfoTooltip
              label="Starting balance"
              text="Initial balance already in the money market account. Currency labels amounts only; it does not convert."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.startingBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="mma-starting"
                className={inputClass}
                inputMode="decimal"
                value={input.startingBalance}
                aria-invalid={Boolean(errors.startingBalance)}
                onChange={(e) => set({ startingBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mma-starting-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Starting balance currency"
              />
            </div>
          </div>
          {errors.startingBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startingBalance}</p>
          ) : null}
        </div>

        {isSip ? (
          <div>
            <label htmlFor="mma-recurring" className={labelClass}>
              Recurring investment
              <InfoTooltip
                label="Recurring investment"
                text="Amount added at the end of each contribution period. Frequency changes both deposit timing and compounding periods."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.recurringInvestment}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="mma-recurring"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.recurringInvestment}
                  aria-invalid={Boolean(errors.recurringInvestment)}
                  onChange={(e) => set({ recurringInvestment: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="mma-recurring-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label="Recurring investment currency"
                />
              </div>
              <select
                id="mma-frequency"
                className={`${selectClass} w-[88px]`}
                value={input.contributionFrequency}
                aria-label="Contribution frequency"
                onChange={(e) =>
                  set({
                    contributionFrequency: e.target.value as ContributionFrequency,
                  })
                }
              >
                {CONTRIBUTION_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.shortLabel}
                  </option>
                ))}
              </select>
            </div>
            {errors.recurringInvestment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.recurringInvestment}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="mma-return" className={labelClass}>
            Expected annual return
            <InfoTooltip
              label="Expected annual return"
              text="Nominal annual return as a percent. Compounded at the contribution frequency (monthly for one-time mode)."
            />
          </label>
          <FieldShell error={errors.annualReturnPercent}>
            <input
              id="mma-return"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualReturnPercent}
              aria-invalid={Boolean(errors.annualReturnPercent)}
              onChange={(e) => set({ annualReturnPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.annualReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualReturnPercent}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            Investment period
            <InfoTooltip
              label="Investment period"
              text="Length of the investment in whole years and months. Months of 12 or more are normalized into years."
            />
          </span>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.years}>
              <input
                id="mma-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.years}
                aria-label="Investment period years"
                aria-invalid={Boolean(errors.years)}
                onChange={(e) => set({ years: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
                yrs
              </span>
            </FieldShell>
            <FieldShell error={errors.months}>
              <input
                id="mma-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.months}
                aria-label="Investment period months"
                aria-invalid={Boolean(errors.months)}
                onChange={(e) => set({ months: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
                mos
              </span>
            </FieldShell>
          </div>
          {errors.years || errors.months ? (
            <p className="mt-1 text-xs text-rose-600">{errors.years || errors.months}</p>
          ) : null}
        </div>
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="mma-results-heading"
      >
        <h3 id="mma-results-heading" className={sectionTitleClass}>
          Results
        </h3>

        {moneyOutput(
          'mma-total-deposit',
          'Total deposit',
          'Starting balance plus the sum of all recurring contributions over the period.',
          result?.formattedTotalDeposit ?? ''
        )}
        {moneyOutput(
          'mma-total-interest',
          'Total interest',
          'Future value minus total deposit.',
          result?.formattedTotalInterest ?? ''
        )}
        {moneyOutput(
          'mma-future-value',
          'Future value of money market account',
          'Projected ending balance with end-of-period contributions and period compounding.',
          result?.formattedFutureValue ?? ''
        )}
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
