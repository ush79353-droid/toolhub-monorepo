'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AverageVariableCostFieldErrors,
  AverageVariableCostInput,
  AverageVariableCostResult,
  AvcCalculationMode,
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

interface AverageVariableCostFormProps {
  input: AverageVariableCostInput;
  errors: AverageVariableCostFieldErrors;
  result: AverageVariableCostResult | null;
  onChange: (input: AverageVariableCostInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function AverageVariableCostForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: AverageVariableCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const vcReadOnly = input.mode === 'variableCosts';
  const qReadOnly = input.mode === 'totalOutput';
  const avcReadOnly = input.mode === 'averageVariableCost';

  const set = (patch: Partial<AverageVariableCostInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: AvcCalculationMode) => {
    if (mode === input.mode) return;
    set({ mode });
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
          Amounts use one display currency (denomination). Switching currency
 changes the symbol only; it does not convert values. AVC = VC / Q for
          the same production period.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="avc-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="avc-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'averageVariableCost'}
              onChange={() => setMode('averageVariableCost')}
            />
            Average variable cost
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="avc-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'variableCosts'}
              onChange={() => setMode('variableCosts')}
            />
            Variable costs
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="avc-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'totalOutput'}
              onChange={() => setMode('totalOutput')}
            />
            Total output
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="avc-vc" className={labelClass}>
          <span>Variable Costs (VC)</span>
          <InfoTooltip
            label="Variable Costs (VC)"
            text="Production expenses that change with output for the selected period; e.g. direct materials, piece-rate labor, variable packaging, output-dependent utilities. Classification depends on the business."
          />
        </label>
        <FieldShell error={errors.variableCosts} muted={vcReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="avc-vc"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={vcReadOnly}
            tabIndex={vcReadOnly ? -1 : undefined}
            value={
              vcReadOnly
                ? (result?.formattedVariableCosts ?? '')
                : input.variableCosts
            }
            aria-invalid={errors.variableCosts ? true : undefined}
            aria-live={vcReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ variableCosts: e.target.value })}
          />
        </FieldShell>
        {errors.variableCosts ? (
          <p className="mt-1 text-xs text-rose-600">{errors.variableCosts}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="avc-q" className={labelClass}>
          <span>Total Output (Q)</span>
          <InfoTooltip
            label="Total Output (Q)"
            text="Quantity produced in the same period as the entered variable costs. Must be positive to compute AVC."
          />
        </label>
        <FieldShell error={errors.totalOutput} muted={qReadOnly}>
          <input
            id="avc-q"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={qReadOnly}
            tabIndex={qReadOnly ? -1 : undefined}
            value={
              qReadOnly ? (result?.formattedTotalOutput ?? '') : input.totalOutput
            }
            aria-invalid={errors.totalOutput ? true : undefined}
            aria-live={qReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ totalOutput: e.target.value })}
          />
          <span className="pr-3 text-xs text-muted-foreground">units</span>
        </FieldShell>
        {errors.totalOutput ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalOutput}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="avc-avc" className={labelClass}>
          <span>Average Variable Cost (AVC)</span>
          <InfoTooltip
            label="Average Variable Cost (AVC)"
            text="AVC = VC / Q. Cost per unit of output for variable production expenses only; distinct from AFC, ATC, and marginal cost."
          />
        </label>
        <FieldShell error={errors.averageVariableCost} muted={avcReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="avc-avc"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={avcReadOnly}
            tabIndex={avcReadOnly ? -1 : undefined}
            value={
              avcReadOnly
                ? (result?.formattedAverageVariableCost ?? '')
                : input.averageVariableCost
            }
            aria-invalid={errors.averageVariableCost ? true : undefined}
            aria-live={avcReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ averageVariableCost: e.target.value })}
          />
          <span className="pr-3 text-xs text-muted-foreground">/unit</span>
        </FieldShell>
        {errors.averageVariableCost ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.averageVariableCost}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-amber-700" role="status">
            {errors.form}
          </p>
        ) : null}
      </div>
    </form>
  );
}
