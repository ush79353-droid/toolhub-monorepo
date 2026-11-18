'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CapmFieldErrors, CapmInput, CapmResult } from './types';

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

interface CapmFormProps {
  input: CapmInput;
  errors: CapmFieldErrors;
  result: CapmResult | null;
  onChange: (input: CapmInput) => void;
  onReset: () => void;
}

export function CapmForm({ input, errors, result, onChange, onReset }: CapmFormProps) {
  const set = (patch: Partial<CapmInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">CAPM</legend>

        <div>
          <label className={labelClass} htmlFor="capm-rf">
            <span>Risk-free interest rate (Rf)</span>
            <InfoTooltip
              label="Risk-free interest rate"
              text="Risk-free rate for the period, in percent. Zero and negatives are allowed."
            />
          </label>
          <FieldShell error={errors.riskFreeRate}>
            <input
              id="capm-rf"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.riskFreeRate}
              aria-invalid={Boolean(errors.riskFreeRate)}
              onChange={(e) => set({ riskFreeRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.riskFreeRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.riskFreeRate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="capm-rm">
            <span>Broad market return (Rm)</span>
            <InfoTooltip
              label="Broad market return"
              text="Expected market return for the same period, in percent. May be below the risk-free rate."
            />
          </label>
          <FieldShell error={errors.marketReturn}>
            <input
              id="capm-rm"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.marketReturn}
              aria-invalid={Boolean(errors.marketReturn)}
              onChange={(e) => set({ marketReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.marketReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.marketReturn}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="capm-beta">
            <span>Beta</span>
            <InfoTooltip
              label="Beta"
              text="Unitless systematic risk coefficient. Positive, zero, and negative values are allowed."
            />
          </label>
          <FieldShell error={errors.beta}>
            <input
              id="capm-beta"
              className={inputClass}
              inputMode="decimal"
              value={input.beta}
              aria-invalid={Boolean(errors.beta)}
              onChange={(e) => set({ beta: e.target.value })}
            />
          </FieldShell>
          {errors.beta ? <p className="mt-1 text-xs text-rose-600">{errors.beta}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="capm-premium">
            <span>Risk premium of the asset</span>
            <InfoTooltip
              label="Risk premium of the asset"
              text="Beta × (Rm − Rf), in percentage points."
            />
          </label>
          <FieldShell muted>
            <input
              id="capm-premium"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedAssetRiskPremium : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="capm-expected">
            <span>Expected rate of return (R)</span>
            <InfoTooltip
              label="Expected rate of return"
              text="Rf + Beta × (Rm − Rf), in percent."
            />
          </label>
          <FieldShell muted>
            <input
              id="capm-expected"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedExpectedReturn : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
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
