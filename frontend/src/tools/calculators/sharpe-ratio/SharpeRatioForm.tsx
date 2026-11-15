'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SharpeRatioFieldErrors,
  SharpeRatioInput,
  SharpeRatioResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface SharpeRatioFormProps {
  input: SharpeRatioInput;
  errors: SharpeRatioFieldErrors;
  result: SharpeRatioResult | null;
  riskPremiumDisplay: string;
  onChange: (input: SharpeRatioInput) => void;
  onReset: () => void;
}

export function SharpeRatioForm({
  input,
  errors,
  result,
  riskPremiumDisplay,
  onChange,
  onReset,
}: SharpeRatioFormProps) {
  const set = (patch: Partial<SharpeRatioInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Sharpe ratio</legend>

        <div>
          <label className={labelClass} htmlFor="sharpe-return">
            <span>Return on asset or investment</span>
            <InfoTooltip
              label="Return on asset or investment"
              text="Portfolio or asset return for the period, in percent. Negative returns are allowed."
            />
          </label>
          <FieldShell error={errors.investmentReturn}>
            <input
              id="sharpe-return"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.investmentReturn}
              aria-invalid={Boolean(errors.investmentReturn)}
              onChange={(e) => set({ investmentReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.investmentReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.investmentReturn}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sharpe-rf">
            <span>Risk free return</span>
            <InfoTooltip
              label="Risk free return"
              text="Risk-free rate for the same period, in percent. Zero and negatives are allowed."
            />
          </label>
          <FieldShell error={errors.riskFreeReturn}>
            <input
              id="sharpe-rf"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.riskFreeReturn}
              aria-invalid={Boolean(errors.riskFreeReturn)}
              onChange={(e) => set({ riskFreeReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.riskFreeReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.riskFreeReturn}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sharpe-premium">
            <span>Risk premium</span>
            <InfoTooltip
              label="Risk premium"
              text="Investment return − risk-free return, in percentage points."
            />
          </label>
          <FieldShell muted>
            <input
              id="sharpe-premium"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={riskPremiumDisplay}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="sharpe-sd">
            <span>Standard deviation</span>
            <InfoTooltip
              label="Standard deviation"
              text="Volatility of returns for the same period, in percent. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.standardDeviation}>
            <input
              id="sharpe-sd"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.standardDeviation}
              aria-invalid={Boolean(errors.standardDeviation)}
              onChange={(e) => set({ standardDeviation: e.target.value })}
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
          <label className={labelClass} htmlFor="sharpe-ratio">
            <span>Sharpe ratio</span>
            <InfoTooltip
              label="Sharpe ratio"
              text="Risk premium ÷ standard deviation. Unitless; negative values are allowed."
            />
          </label>
          <FieldShell muted>
            <input
              id="sharpe-ratio"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedSharpeRatio : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
