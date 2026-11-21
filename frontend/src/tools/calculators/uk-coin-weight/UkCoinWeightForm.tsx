'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  UK_COIN_IDS,
  UK_COIN_LABELS,
  UK_COIN_MASS_GRAMS,
  type UkCoinId,
} from './constants';
import type {
  UkCoinWeightFieldErrors,
  UkCoinWeightInput,
  UkCoinWeightResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface UkCoinWeightFormProps {
  input: UkCoinWeightInput;
  errors: UkCoinWeightFieldErrors;
  result: UkCoinWeightResult | null;
  onChange: (input: UkCoinWeightInput) => void;
  onLoadExample: () => void;
}

export function UkCoinWeightForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: UkCoinWeightFormProps) {
  const set = (patch: Partial<UkCoinWeightInput>) =>
    onChange({ ...input, ...patch });

  const weightDisplay =
    result != null
      ? result.displayWeight.toLocaleString('en-GB', {
          maximumFractionDigits: input.weightUnit === 'kg' ? 6 : 4,
        })
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimates total mass from Royal Mint standard weights for circulating UK
        coins. Enter whole-number counts (0 allowed). Switching g/kg only changes
        how the total is displayed.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (100 of each → 5,418 g)
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {UK_COIN_IDS.map((id: UkCoinId) => (
          <div key={id}>
            <label htmlFor={`ukcw-${id}`} className={labelClass}>
              {UK_COIN_LABELS[id]}
              <InfoTooltip
                label={UK_COIN_LABELS[id]}
                text={`Royal Mint standard mass: ${UK_COIN_MASS_GRAMS[id]} g per coin (current circulating specification).`}
              />
            </label>
            <FieldShell error={errors[id]}>
              <input
                id={`ukcw-${id}`}
                className={inputClass}
                inputMode="numeric"
                value={input[id]}
                onChange={(e) => set({ [id]: e.target.value })}
                placeholder="0"
                aria-label={UK_COIN_LABELS[id]}
              />
            </FieldShell>
            {errors[id] ? (
              <p className="mt-1 text-xs text-rose-600">{errors[id]}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="ukcw-weight" className={labelClass}>
          Weight
          <InfoTooltip
            label="Weight"
            text="Total estimated mass of the entered coin counts. Choose grams or kilograms; the underlying gram total is unchanged."
          />
        </label>
        <FieldShell muted>
          <input
            id="ukcw-weight"
            className={inputClass}
            readOnly
            aria-readonly="true"
            value={weightDisplay}
            placeholder="0"
          />
          <select
            className={selectClass}
            value={input.weightUnit}
            aria-label="Weight unit"
            onChange={(e) =>
              set({ weightUnit: e.target.value as WeightUnit })
            }
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
          </select>
        </FieldShell>
        {errors.weightUnit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightUnit}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
