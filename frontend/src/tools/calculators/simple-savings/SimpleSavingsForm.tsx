'use client';

import type { FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  GOAL_MODE_OPTIONS,
  MONTH_OPTIONS,
  type CompoundFrequency,
  type DepositFrequency,
  type DepositTiming,
  type KnownRateKind,
  type SavingsDraft,
  type SavingsFieldErrors,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

interface SimpleSavingsFormProps {
  draft: SavingsDraft;
  errors: SavingsFieldErrors;
  mainOpen: boolean;
  depositsOpen: boolean;
  onMainOpen: (open: boolean) => void;
  onDepositsOpen: (open: boolean) => void;
  onChange: (draft: SavingsDraft) => void;
  onInitialCurrencyChange: (currency: SupportedCurrency) => void;
  onDepositCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
}

export function SimpleSavingsForm({
  draft,
  errors,
  mainOpen,
  depositsOpen,
  onMainOpen,
  onDepositsOpen,
  onChange,
  onInitialCurrencyChange,
  onDepositCurrencyChange,
  onSubmit,
}: SimpleSavingsFormProps) {
  const initialSymbol = getCurrencySymbol(draft.initialCurrency);
  const depositSymbol = getCurrencySymbol(draft.depositCurrency);
  const set = (patch: Partial<SavingsDraft>) => onChange({ ...draft, ...patch });
  const rateLabel =
    draft.knownRate === 'apy'
      ? 'Annual percentage yield (APY)'
      : 'Annual nominal interest rate';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={sectionClass}>
        <div>
          <label htmlFor="ss-goal" className={labelClass}>
            I would like to know my:
          </label>
          <select
            id="ss-goal"
            className={selectClass}
            value={draft.goalMode}
            onChange={(e) =>
              set({ goalMode: e.target.value as SavingsDraft['goalMode'] })
            }
          >
            {GOAL_MODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={labelClass}>Known rate</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {(
              [
                { value: 'interest-rate', label: 'Interest rate' },
                { value: 'apy', label: 'Annual percentage yield (APY)' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ss-known-rate"
                  className="h-4 w-4 accent-primary"
                  checked={draft.knownRate === opt.value}
                  onChange={() => set({ knownRate: opt.value as KnownRateKind })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={mainOpen}
          onClick={() => onMainOpen(!mainOpen)}
        >
          Main specifications
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${mainOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mainOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label htmlFor="ss-initial" className={labelClass}>
                Initial savings
              </label>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {initialSymbol}
                  </span>
                  <input
                    id="ss-initial"
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={draft.initialSavings}
                    aria-invalid={Boolean(errors.initialSavings)}
                    onChange={(e) => set({ initialSavings: e.target.value })}
                  />
                </div>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ss-initial-currency"
                    value={draft.initialCurrency}
                    onChange={onInitialCurrencyChange}
                  />
                </div>
              </div>
              {errors.initialSavings ? (
                <p className="mt-1 text-xs text-red-600">{errors.initialSavings}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ss-rate" className={labelClass}>
                {rateLabel}
              </label>
              <div className="relative">
                <input
                  id="ss-rate"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={draft.ratePercent}
                  aria-invalid={Boolean(errors.ratePercent)}
                  onChange={(e) => set({ ratePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
              {errors.ratePercent ? (
                <p className="mt-1 text-xs text-red-600">{errors.ratePercent}</p>
              ) : null}
            </div>

            <div>
              <span className={labelClass}>Time length</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    id="ss-years"
                    className={`${inputClass} pr-12`}
                    inputMode="numeric"
                    value={draft.termYears}
                    aria-label="Years"
                    aria-invalid={Boolean(errors.termYears)}
                    onChange={(e) => set({ termYears: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    yrs
                  </span>
                </div>
                <div className="relative">
                  <select
                    id="ss-months"
                    className={`${selectClass} appearance-none pr-12`}
                    value={draft.termMonths}
                    aria-label="Months"
                    aria-invalid={Boolean(errors.termMonths)}
                    onChange={(e) => set({ termMonths: e.target.value })}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={String(m)}>
                        {m} mos
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.termYears || errors.termMonths ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.termYears || errors.termMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ss-compound" className={labelClass}>
                <span>Compound frequency</span>
                <InfoTooltip
                  label="Compound frequency"
                  text="How often interest is credited to the balance each year."
                />
              </label>
              <select
                id="ss-compound"
                className={selectClass}
                value={draft.compounding}
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

            <label className="inline-flex cursor-pointer items-start gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-primary"
                checked={draft.adjustInflation}
                onChange={(e) => set({ adjustInflation: e.target.checked })}
              />
              <span>Adjust inflation and growth rate</span>
            </label>

            {draft.adjustInflation ? (
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ss-inflation" className={labelClass}>
                    <span>Expected inflation rate</span>
                    <InfoTooltip
                      label="Expected inflation rate"
                      text="Annual inflation used to estimate the real purchasing power of the final balance."
                    />
                  </label>
                  <div className="relative">
                    <input
                      id="ss-inflation"
                      className={`${inputClass} pr-10`}
                      inputMode="decimal"
                      value={draft.inflationPercent}
                      aria-invalid={Boolean(errors.inflationPercent)}
                      onChange={(e) => set({ inflationPercent: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                  {errors.inflationPercent ? (
                    <p className="mt-1 text-xs text-red-600">{errors.inflationPercent}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="ss-growth" className={labelClass}>
                    <span>Deposit growth rate</span>
                    <InfoTooltip
                      label="Deposit growth rate"
                      text="Annual rate at which recurring deposits increase over the savings horizon."
                    />
                  </label>
                  <div className="relative">
                    <input
                      id="ss-growth"
                      className={`${inputClass} pr-10`}
                      inputMode="decimal"
                      value={draft.depositGrowthPercent}
                      aria-invalid={Boolean(errors.depositGrowthPercent)}
                      onChange={(e) => set({ depositGrowthPercent: e.target.value })}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                  {errors.depositGrowthPercent ? (
                    <p className="mt-1 text-xs text-red-600">{errors.depositGrowthPercent}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={depositsOpen}
          onClick={() => onDepositsOpen(!depositsOpen)}
        >
          Additional deposits
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${depositsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {depositsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label htmlFor="ss-deposit" className={labelClass}>
                <span>How much?</span>
                <InfoTooltip
                  label="How much?"
                  text="Recurring deposit amount in its own currency. Mixed currencies are converted into the result currency before calculation."
                />
              </label>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    {depositSymbol}
                  </span>
                  <input
                    id="ss-deposit"
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={draft.depositAmount}
                    aria-invalid={Boolean(errors.depositAmount)}
                    onChange={(e) => set({ depositAmount: e.target.value })}
                  />
                </div>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ss-deposit-currency"
                    value={draft.depositCurrency}
                    onChange={onDepositCurrencyChange}
                  />
                </div>
              </div>
              {errors.depositAmount ? (
                <p className="mt-1 text-xs text-red-600">{errors.depositAmount}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ss-deposit-freq" className={labelClass}>
                <span>How often?</span>
                <InfoTooltip
                  label="How often?"
                  text="How frequently additional deposits are made."
                />
              </label>
              <select
                id="ss-deposit-freq"
                className={selectClass}
                value={draft.depositFrequency}
                onChange={(e) =>
                  set({ depositFrequency: e.target.value as DepositFrequency })
                }
              >
                {DEPOSIT_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className={labelClass}>
                <span>When?</span>
                <InfoTooltip
                  label="When?"
                  text="Beginning-of-period deposits earn interest in the same period; end-of-period deposits earn interest starting the next period."
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
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="ss-deposit-timing"
                      className="h-4 w-4 accent-primary"
                      checked={draft.depositTiming === opt.value}
                      onChange={() => set({ depositTiming: opt.value as DepositTiming })}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
      </div>

      {errors.currency || errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.currency || errors.form}
        </p>
      ) : null}
    </form>
  );
}
