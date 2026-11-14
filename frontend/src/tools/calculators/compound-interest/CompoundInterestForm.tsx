'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  type CompoundInterestDraft,
  type CompoundInterestFieldErrors,
  type CompoundInterestResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface CompoundInterestFormProps {
  draft: CompoundInterestDraft;
  errors: CompoundInterestFieldErrors;
  result: CompoundInterestResult | null;
  depositsOpen: boolean;
  onDepositsOpen: (open: boolean) => void;
  onChange: (draft: CompoundInterestDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function CompoundInterestForm({
  draft,
  errors,
  result,
  depositsOpen,
  onDepositsOpen,
  onChange,
  onSubmit,
  onReset,
}: CompoundInterestFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<CompoundInterestDraft>) => onChange({ ...draft, ...patch });
  const showDepositFields = draft.depositFrequency !== 'never';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label htmlFor="ci-initial" className={labelClass}>
            <span>Initial balance</span>
            <InfoTooltip
              label="Initial balance"
              text="Starting principal. Currency labels amounts only; it does not convert."
            />
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ci-initial"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={draft.initialBalance}
                aria-invalid={Boolean(errors.initialBalance)}
                onChange={(e) => set({ initialBalance: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ci-currency"
                value={draft.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.initialBalance ? (
            <p className="mt-1 text-xs text-red-600">{errors.initialBalance}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ci-rate" className={labelClass}>
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Annual nominal interest rate as a percent (for example 8 for 8%)."
            />
          </label>
          <div className="relative">
            <input
              id="ci-rate"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={draft.interestRate}
              aria-invalid={Boolean(errors.interestRate)}
              onChange={(e) => set({ interestRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-red-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            <span>Term</span>
            <InfoTooltip label="Term" text="Investment length in whole years and months." />
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                id="ci-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={draft.termYears}
                aria-label="Term years"
                aria-invalid={Boolean(errors.termYears)}
                onChange={(e) => set({ termYears: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                yrs
              </span>
            </div>
            <div className="relative">
              <input
                id="ci-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={draft.termMonths}
                aria-label="Term months"
                aria-invalid={Boolean(errors.termMonths)}
                onChange={(e) => set({ termMonths: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                mos
              </span>
            </div>
          </div>
          {errors.termYears || errors.termMonths ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.termYears || errors.termMonths}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ci-compound" className={labelClass}>
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="How often interest is added to the balance each year."
            />
          </label>
          <select
            id="ci-compound"
            className={selectClass}
            value={draft.compounding}
            onChange={(e) =>
              set({ compounding: e.target.value as CompoundInterestDraft['compounding'] })
            }
          >
            {COMPOUNDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={depositsOpen}
          onClick={() => onDepositsOpen(!depositsOpen)}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${depositsOpen ? 'rotate-180' : ''}`}
          />
          Additional deposits
        </button>
        {depositsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label htmlFor="ci-deposit-freq" className={labelClass}>
                <span>How often?</span>
                <InfoTooltip
                  label="How often?"
                  text="Choose Never for a single initial balance, or a recurring deposit schedule."
                />
              </label>
              <select
                id="ci-deposit-freq"
                className={selectClass}
                value={draft.depositFrequency}
                onChange={(e) =>
                  set({
                    depositFrequency: e.target
                      .value as CompoundInterestDraft['depositFrequency'],
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

            {showDepositFields ? (
              <>
                <div>
                  <label htmlFor="ci-deposit-amount" className={labelClass}>
                    Deposit amount
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      {symbol}
                    </span>
                    <input
                      id="ci-deposit-amount"
                      className={`${inputClass} pl-8`}
                      inputMode="decimal"
                      value={draft.depositAmount}
                      aria-invalid={Boolean(errors.depositAmount)}
                      onChange={(e) => set({ depositAmount: e.target.value })}
                    />
                  </div>
                  {errors.depositAmount ? (
                    <p className="mt-1 text-xs text-red-600">{errors.depositAmount}</p>
                  ) : null}
                </div>
                <fieldset>
                  <legend className={labelClass}>Deposit timing</legend>
                  <div className="flex flex-wrap gap-4">
                    {(
                      [
                        ['end', 'End of period'],
                        ['beginning', 'Beginning of period'],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 text-sm text-accent">
                        <input
                          type="radio"
                          name="ci-deposit-timing"
                          className="h-4 w-4 border-border"
                          checked={draft.depositTiming === value}
                          onChange={() => set({ depositTiming: value })}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-1 rounded-xl border border-border bg-muted/20 px-3.5 py-3 text-sm text-foreground/90">
          <p>
            The final balance is{' '}
            <strong className="text-accent">{result.formattedFinalBalance}</strong>.
          </p>
          <p>
            The total compound interest is{' '}
            <strong className="text-accent">{result.formattedInterest}</strong>.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
