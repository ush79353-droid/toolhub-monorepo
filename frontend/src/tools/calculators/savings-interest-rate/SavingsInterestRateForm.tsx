'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  type DepositTiming,
  type SavingsInterestRateFieldErrors,
  type SavingsInterestRateInput,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
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

interface SavingsInterestRateFormProps {
  input: SavingsInterestRateInput;
  errors: SavingsInterestRateFieldErrors;
  onChange: (input: SavingsInterestRateInput) => void;
  onReset: () => void;
}

export function SavingsInterestRateForm({
  input,
  errors,
  onChange,
  onReset,
}: SavingsInterestRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SavingsInterestRateInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Main specifications</legend>

        <div>
          <label className={labelClass} htmlFor="sir-goal">
            <span>Your savings goal</span>
            <InfoTooltip label="Your savings goal" text="Target balance you want to reach (PKR)." />
          </label>
          <FieldShell error={errors.savingsGoal}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="sir-goal"
              className={inputClass}
              inputMode="decimal"
              value={input.savingsGoal}
              aria-invalid={Boolean(errors.savingsGoal)}
              onChange={(event) => set({ savingsGoal: event.target.value })}
            />
          </FieldShell>
          {errors.savingsGoal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.savingsGoal}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sir-initial">
            <span>Initial savings balance</span>
            <InfoTooltip
              label="Initial savings balance"
              text="Amount already saved in PKR. Zero is allowed."
            />
          </label>
          <FieldShell error={errors.initialBalance}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="sir-initial"
              className={inputClass}
              inputMode="decimal"
              value={input.initialBalance}
              aria-invalid={Boolean(errors.initialBalance)}
              onChange={(event) => set({ initialBalance: event.target.value })}
            />
          </FieldShell>
          {errors.initialBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialBalance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sir-term">
            <span>Length of your savings</span>
            <InfoTooltip
              label="Length of your savings"
              text="How long you will save, in years. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.termYears}>
            <input
              id="sir-term"
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
          <label className={labelClass} htmlFor="sir-compound">
            <span>Compounding method</span>
            <InfoTooltip
              label="Compounding method"
              text="How often interest is compounded each year."
            />
          </label>
          <select
            id="sir-compound"
            className={selectClass}
            value={input.compounding}
            onChange={(event) =>
              set({ compounding: event.target.value as SavingsInterestRateInput['compounding'] })
            }
          >
            {COMPOUNDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Additional deposit</legend>

        <div>
          <label className={labelClass} htmlFor="sir-deposit">
            <span>How much?</span>
            <InfoTooltip
              label="Deposit amount"
              text="Recurring deposit amount in PKR. Zero is allowed if you rely on the starting balance only."
            />
          </label>
          <FieldShell error={errors.depositAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="sir-deposit"
              className={inputClass}
              inputMode="decimal"
              value={input.depositAmount}
              aria-invalid={Boolean(errors.depositAmount)}
              onChange={(event) => set({ depositAmount: event.target.value })}
            />
          </FieldShell>
          {errors.depositAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depositAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sir-deposit-freq">
            <span>How often?</span>
            <InfoTooltip
              label="Deposit frequency"
              text="How often the additional deposit is made."
            />
          </label>
          <select
            id="sir-deposit-freq"
            className={selectClass}
            value={input.depositFrequency}
            onChange={(event) =>
              set({
                depositFrequency: event.target
                  .value as SavingsInterestRateInput['depositFrequency'],
              })
            }
          >
            {DEPOSIT_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>
            <span>When?</span>
            <InfoTooltip
              label="Deposit timing"
              text="Whether each deposit is added at the beginning or end of the compounding period."
            />
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {(
              [
                { value: 'beginning', label: 'Beginning of period' },
                { value: 'end', label: 'End of period' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="sir-deposit-timing"
                  className="h-4 w-4 accent-primary"
                  checked={input.depositTiming === opt.value}
                  onChange={() => set({ depositTiming: opt.value as DepositTiming })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
