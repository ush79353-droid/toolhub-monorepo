'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  TIMEFRAME_UNIT_OPTIONS,
  VAR_PRESET_OPTIONS,
  type TimeframeUnit,
  type ValueAtRiskFieldErrors,
  type ValueAtRiskInput,
  type ValueAtRiskResult,
  type VarPreset,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface ValueAtRiskFormProps {
  input: ValueAtRiskInput;
  errors: ValueAtRiskFieldErrors;
  result: ValueAtRiskResult | null;
  onChange: (input: ValueAtRiskInput) => void;
  onReset: () => void;
}

export function ValueAtRiskForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: ValueAtRiskFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ValueAtRiskInput>) => onChange({ ...input, ...patch });
  const showCustom = input.varPreset === 'other';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Your portfolio</legend>

        <div>
          <label className={labelClass} htmlFor="var-portfolio">
            <span>Portfolio value</span>
            <InfoTooltip label="Portfolio value" text="Current market value of the portfolio." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.portfolioValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="var-portfolio"
                className={inputClass}
                inputMode="decimal"
                value={input.portfolioValue}
                aria-invalid={Boolean(errors.portfolioValue)}
                onChange={(event) => set({ portfolioValue: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="var-portfolio-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Portfolio currency"
              />
            </div>
          </div>
          {errors.portfolioValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.portfolioValue}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="var-sigma">
              <span>Standard deviation</span>
              <InfoTooltip
                label="Standard deviation"
                text="Daily return volatility as a percent. Must be consistent with expected return."
              />
            </label>
            <FieldShell error={errors.standardDeviation}>
              <input
                id="var-sigma"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.standardDeviation}
                aria-invalid={Boolean(errors.standardDeviation)}
                onChange={(event) => set({ standardDeviation: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.standardDeviation ? (
              <p className="mt-1 text-xs text-rose-600">{errors.standardDeviation}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="var-mu">
              <span>Expected return</span>
              <InfoTooltip
                label="Expected return"
                text="Daily expected return as a percent. Default is 0%."
              />
            </label>
            <FieldShell error={errors.expectedReturn}>
              <input
                id="var-mu"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.expectedReturn}
                aria-invalid={Boolean(errors.expectedReturn)}
                onChange={(event) => set({ expectedReturn: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.expectedReturn ? (
              <p className="mt-1 text-xs text-rose-600">{errors.expectedReturn}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="var-timeframe">
            <span>Timeframe</span>
            <InfoTooltip
              label="Timeframe"
              text="Horizon for VaR. Standard deviation and expected return are treated as daily rates; the horizon converts to days."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.timeframe}>
              <input
                id="var-timeframe"
                className={inputClass}
                inputMode="decimal"
                value={input.timeframe}
                aria-invalid={Boolean(errors.timeframe)}
                onChange={(event) => set({ timeframe: event.target.value })}
              />
            </FieldShell>
            <div className="w-[120px] shrink-0">
              <select
                className={selectClass}
                value={input.timeframeUnit}
                aria-label="Timeframe unit"
                onChange={(event) =>
                  set({ timeframeUnit: event.target.value as TimeframeUnit })
                }
              >
                {TIMEFRAME_UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.timeframe ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeframe}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Value at risk (VaR)</legend>

        <fieldset className="space-y-2">
          <legend className={labelClass}>
            <span>Which VaR are you calculating?</span>
            <InfoTooltip
              label="VaR probability"
              text="Tail probability for the loss threshold. 5% VaR uses the 95% one-sided normal quantile."
            />
          </legend>
          <div className="flex flex-col gap-2">
            {VAR_PRESET_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="var-preset"
                  className="h-4 w-4 accent-primary"
                  checked={input.varPreset === opt.value}
                  onChange={() => set({ varPreset: opt.value as VarPreset })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {showCustom ? (
          <div>
            <label className={labelClass} htmlFor="var-custom">
              <span>Custom VaR probability</span>
              <InfoTooltip
                label="Custom VaR probability"
                text="Tail probability between 0% and 50% (exclusive)."
              />
            </label>
            <FieldShell error={errors.customTailPercent}>
              <input
                id="var-custom"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.customTailPercent}
                aria-invalid={Boolean(errors.customTailPercent)}
                onChange={(event) => set({ customTailPercent: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.customTailPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.customTailPercent}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="var-result">
            <span>VaR</span>
            <InfoTooltip
              label="VaR"
              text="Parametric loss amount: Portfolio × max(0, Z×σ×√t − μ×t) with daily σ and μ. Not the maximum possible loss."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="var-result"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedVar : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="var-result-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="VaR currency"
              />
            </div>
          </div>
        </div>
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
