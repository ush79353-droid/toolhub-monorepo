'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PLAN_FREQUENCY_OPTIONS,
  periodUnits,
  type PlanFrequency,
  type PlanMode,
  type SavingsPlanFieldErrors,
  type SavingsPlanInput,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
  unit,
}: {
  error?: string;
  children: ReactNode;
  unit?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {unit ? (
        <span className="shrink-0 pr-3 text-xs text-muted-foreground" aria-hidden="true">
          {unit}
        </span>
      ) : null}
    </div>
  );
}

interface SavingsPlanFormProps {
  input: SavingsPlanInput;
  errors: SavingsPlanFieldErrors;
  conversionError: string | null;
  ratesWarning: string | null;
  onChange: (input: SavingsPlanInput) => void;
  onDepositCurrencyChange: (currency: SupportedCurrency) => void;
  onIncreaseCurrencyChange: (currency: SupportedCurrency) => void;
  onTargetCurrencyChange: (currency: SupportedCurrency) => void;
}

export function SavingsPlanForm({
  input,
  errors,
  conversionError,
  ratesWarning,
  onChange,
  onDepositCurrencyChange,
  onIncreaseCurrencyChange,
  onTargetCurrencyChange,
}: SavingsPlanFormProps) {
  const units = periodUnits(input.frequency);
  const depositSymbol = getCurrencySymbol(input.depositCurrency);
  const increaseSymbol = getCurrencySymbol(input.increaseCurrency);
  const targetSymbol = getCurrencySymbol(input.targetCurrency);
  const isDepositMode = input.mode === 'deposit';

  const set = (patch: Partial<SavingsPlanInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-accent">Your savings plan&apos;s target</h3>

        <div>
          <label className={labelClass} htmlFor="sp-frequency">
            I&apos;d like to make a
          </label>
          <select
            id="sp-frequency"
            className={selectClass}
            value={input.frequency}
            onChange={(e) => set({ frequency: e.target.value as PlanFrequency })}
          >
            {PLAN_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="sp-periods">
            Planning for
          </label>
          <FieldShell error={errors.periods} unit={units.plural}>
            <input
              id="sp-periods"
              className={inputClass}
              inputMode="numeric"
              value={input.periods}
              aria-invalid={Boolean(errors.periods)}
              onChange={(e) => set({ periods: e.target.value })}
            />
          </FieldShell>
          {errors.periods ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periods}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>I&apos;d like to plan with a</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
            {(
              [
                { value: 'deposit', label: 'fixed or growing deposit' },
                { value: 'target', label: 'given final balance' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="sp-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.mode === opt.value}
                  onChange={() => set({ mode: opt.value as PlanMode })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {isDepositMode ? (
          <div>
            <label className={labelClass} htmlFor="sp-deposit">
              I&apos;m planning to put aside
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.depositAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {depositSymbol}
                </span>
                <input
                  id="sp-deposit"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.depositAmount}
                  aria-invalid={Boolean(errors.depositAmount)}
                  onChange={(e) => set({ depositAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sp-deposit-currency"
                  value={input.depositCurrency}
                  onChange={onDepositCurrencyChange}
                  aria-label="Deposit currency"
                />
              </div>
            </div>
            {errors.depositAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.depositAmount}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="sp-target">
              I&apos;d like a final balance of
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.targetBalance}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {targetSymbol}
                </span>
                <input
                  id="sp-target"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.targetBalance}
                  aria-invalid={Boolean(errors.targetBalance)}
                  onChange={(e) => set({ targetBalance: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="sp-target-currency"
                  value={input.targetCurrency}
                  onChange={onTargetCurrencyChange}
                  aria-label="Target balance currency"
                />
              </div>
            </div>
            {errors.targetBalance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetBalance}</p>
            ) : null}
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="sp-increase">
            <span>Repeatedly increased by</span>
            <InfoTooltip
              label="Repeatedly increased by"
              text="Each period’s deposit grows by this fixed amount. Period 1 uses the starting deposit A; period 2 uses A+G; period 3 uses A+2G. Use 0 for a fixed deposit every period. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.increaseAmount}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {increaseSymbol}
              </span>
              <input
                id="sp-increase"
                className={inputClass}
                inputMode="decimal"
                value={input.increaseAmount}
                aria-invalid={Boolean(errors.increaseAmount)}
                onChange={(e) => set({ increaseAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sp-increase-currency"
                value={input.increaseCurrency}
                onChange={onIncreaseCurrencyChange}
                aria-label="Increase currency"
              />
            </div>
          </div>
          {errors.increaseAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.increaseAmount}</p>
          ) : null}
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {errors.currency ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.currency}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
