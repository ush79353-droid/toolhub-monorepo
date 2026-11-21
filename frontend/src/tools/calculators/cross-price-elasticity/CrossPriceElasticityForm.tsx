'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CrossPriceElasticityFieldErrors,
  CrossPriceElasticityInput,
  CrossPriceElasticityResult,
  ElasticityMethod,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface CrossPriceElasticityFormProps {
  input: CrossPriceElasticityInput;
  errors: CrossPriceElasticityFieldErrors;
  result: CrossPriceElasticityResult | null;
  onChange: (input: CrossPriceElasticityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CrossPriceElasticityForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: CrossPriceElasticityFormProps) {
  const [t1Open, setT1Open] = useState(true);
  const [t2Open, setT2Open] = useState(true);
  const [eOpen, setEOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<CrossPriceElasticityInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Prices use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. Elasticity is
          dimensionless: E = %ΔQB / %ΔPA for the same products and units.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="cpe-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculation method</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cpe-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'initialValue'}
              onChange={() =>
                set({ method: 'initialValue' satisfies ElasticityMethod })
              }
            />
            Initial-value method
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="cpe-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'midpoint'}
              onChange={() =>
                set({ method: 'midpoint' satisfies ElasticityMethod })
              }
            />
            Midpoint (arc) method
          </label>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {input.method === 'midpoint'
            ? 'Midpoint percentages use averages of the two observations and are symmetric if you reverse the points.'
            : 'Initial-value percentages divide by time-point-1 values (reference default). Reversing observation order can change the coefficient.'}
        </p>
      </fieldset>

      <CollapsibleSection
        title="At time point 1"
        open={t1Open}
        onToggle={() => setT1Open((o) => !o)}
      >
        <div>
          <label htmlFor="cpe-p1" className={labelClass}>
            <span>Price of product A</span>
            <InfoTooltip
              label="Price of product A"
              text="Price of Product A during the initial observation period. Must be positive for the initial-value method."
            />
          </label>
          <FieldShell error={errors.initialPriceA}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cpe-p1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialPriceA}
              aria-invalid={errors.initialPriceA ? true : undefined}
              onChange={(e) => set({ initialPriceA: e.target.value })}
            />
          </FieldShell>
          {errors.initialPriceA ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialPriceA}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cpe-q1" className={labelClass}>
            <span>Demand for product B</span>
            <InfoTooltip
              label="Demand for product B"
              text="Quantity of Product B demanded at time point 1. Use the same quantity unit at both time points."
            />
          </label>
          <FieldShell error={errors.initialDemandB}>
            <input
              id="cpe-q1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialDemandB}
              aria-invalid={errors.initialDemandB ? true : undefined}
              onChange={(e) => set({ initialDemandB: e.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">units</span>
          </FieldShell>
          {errors.initialDemandB ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialDemandB}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="At time point 2"
        open={t2Open}
        onToggle={() => setT2Open((o) => !o)}
      >
        <div>
          <label htmlFor="cpe-p2" className={labelClass}>
            <span>Price of product A</span>
            <InfoTooltip
              label="Price of product A (time 2)"
              text="Price of the same Product A at time point 2, in the same currency."
            />
          </label>
          <FieldShell error={errors.finalPriceA}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cpe-p2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.finalPriceA}
              aria-invalid={errors.finalPriceA ? true : undefined}
              onChange={(e) => set({ finalPriceA: e.target.value })}
            />
          </FieldShell>
          {errors.finalPriceA ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalPriceA}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cpe-q2" className={labelClass}>
            <span>Demand for product B</span>
            <InfoTooltip
              label="Demand for product B (time 2)"
              text="Quantity of the same Product B demanded at time point 2, in the same units."
            />
          </label>
          <FieldShell error={errors.finalDemandB}>
            <input
              id="cpe-q2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.finalDemandB}
              aria-invalid={errors.finalDemandB ? true : undefined}
              onChange={(e) => set({ finalDemandB: e.target.value })}
            />
            <span className="pr-3 text-xs text-muted-foreground">units</span>
          </FieldShell>
          {errors.finalDemandB ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalDemandB}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Cross price elasticity"
        open={eOpen}
        onToggle={() => setEOpen((o) => !o)}
      >
        <div>
          <label htmlFor="cpe-e" className={labelClass}>
            <span>Elasticity</span>
            <InfoTooltip
              label="Cross-price elasticity"
              text="EBA = %ΔQB / %ΔPA. Dimensionless — no currency or % sign on the coefficient itself."
            />
          </label>
          <FieldShell muted>
            <input
              id="cpe-e"
              type="text"
              className={`${inputClass} font-semibold`}
              readOnly
              tabIndex={-1}
              value={result?.formattedElasticity ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
        {result ? (
          <dl className="space-y-1 text-xs text-muted-foreground sm:text-sm">
            <div className="flex justify-between gap-2">
              <dt>%Δ price A</dt>
              <dd className="tabular-nums text-accent">
                {result.formattedPriceChangePercentage}%
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>%Δ demand B</dt>
              <dd className="tabular-nums text-accent">
                {result.formattedDemandChangePercentage}%
              </dd>
            </div>
          </dl>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-amber-800" role="status">
            {errors.form}
          </p>
        ) : null}
      </CollapsibleSection>
    </form>
  );
}
