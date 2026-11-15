'use client';

import * as React from 'react';
import { MoreHorizontal, RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AverageFixedCostFieldErrors,
  AverageFixedCostInput,
  AverageFixedCostResult,
} from './types';

interface AverageFixedCostFormProps {
  input: AverageFixedCostInput;
  errors: AverageFixedCostFieldErrors;
  result: AverageFixedCostResult | null;
  copied: boolean;
  onChange: (input: AverageFixedCostInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
  onShare: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
          {label}
        </label>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <span className="text-muted-foreground/50" aria-hidden="true">
        <MoreHorizontal className="h-4 w-4" />
      </span>
    </div>
  );
}

export function AverageFixedCostForm({
  input,
  errors,
  result,
  copied,
  onChange,
  onCurrencyChange,
  onReset,
  onShare,
}: AverageFixedCostFormProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<AverageFixedCostInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="afc-total-fixed-cost"
          label="Total fixed cost"
          tip="All fixed costs for the period that do not change with output volume (rent, salaries, insurance, etc.)."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="afc-total-fixed-cost"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.totalFixedCost}
              placeholder=""
              aria-invalid={Boolean(errors.totalFixedCost)}
              onChange={(event) => set({ totalFixedCost: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="afc-total-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.totalFixedCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalFixedCost}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="afc-units"
          label="Number of units"
          tip="Units produced or sold in the same period. Must be greater than zero."
        />
        <input
          id="afc-units"
          className={inputClass}
          inputMode="decimal"
          value={input.numberOfUnits}
          placeholder=""
          aria-invalid={Boolean(errors.numberOfUnits)}
          onChange={(event) => set({ numberOfUnits: event.target.value })}
        />
        {errors.numberOfUnits ? (
          <p className="mt-1 text-xs text-rose-600">{errors.numberOfUnits}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="afc-average"
          label="Average fixed cost"
          tip="Total fixed cost divided by the number of units. Shown per unit in the selected currency."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="afc-average"
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              readOnly
              value={result?.formattedAverage ?? ''}
              placeholder=""
              aria-live="polite"
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="afc-average-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Average fixed cost currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="border-t border-border/80 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Link Copied!' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-center text-xs font-normal text-muted-foreground hover:text-foreground"
              onClick={onReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
