'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  QUANTITY_UNITS,
  type MarginalCostFieldErrors,
  type MarginalCostInput,
  type MarginalCostResult,
  type QuantityUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface MarginalCostFormProps {
  input: MarginalCostInput;
  errors: MarginalCostFieldErrors;
  result: MarginalCostResult | null;
  onChange: (input: MarginalCostInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function MarginalCostForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: MarginalCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const unitShort =
    QUANTITY_UNITS.find((u) => u.value === input.quantityUnit)?.short ?? 'unit';

  const set = (patch: Partial<MarginalCostInput>) => {
    onChange({ ...input, ...patch });
  };

  const mcDisplay = result?.formattedMarginalCost ?? '';
  const blocked =
    result?.status === 'zeroQuantityChange' ||
    result?.status === 'indeterminate';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for cost amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Costs share one currency label (no FX conversion). Quantity unit is a
        label for ΔQ and the MC denominator — changing it does not convert
        values.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <div>
        <label htmlFor="mc-dtc" className={labelClass}>
          Change in total cost
          <InfoTooltip
            label="Change in total cost"
            text="ΔTC = final total cost − initial total cost. May be positive, zero, or negative."
          />
        </label>
        <FieldShell error={errors.changeInTotalCost}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="mc-dtc"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.changeInTotalCost}
            onChange={(e) => set({ changeInTotalCost: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.changeInTotalCost)}
          />
        </FieldShell>
        {errors.changeInTotalCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.changeInTotalCost}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mc-dq" className={labelClass}>
          Change in quantity
          <InfoTooltip
            label="Change in quantity"
            text="ΔQ = final quantity − initial quantity. Must be nonzero to compute marginal cost."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.changeInQuantity}>
            <input
              id="mc-dq"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.changeInQuantity}
              onChange={(e) => set({ changeInQuantity: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.changeInQuantity)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[7.5rem] shrink-0`}
            value={input.quantityUnit}
            onChange={(e) =>
              set({ quantityUnit: e.target.value as QuantityUnit })
            }
            aria-label="Quantity unit"
          >
            {QUANTITY_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.changeInQuantity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.changeInQuantity}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mc-result" className={labelClass}>
          Marginal cost
          <InfoTooltip
            label="Marginal cost"
            text={`MC = ΔTC ÷ ΔQ. Displayed as currency per ${unitShort} (discrete incremental cost).`}
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="mc-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={blocked ? '' : mcDisplay}
            placeholder="—"
            aria-readonly="true"
            aria-live="polite"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            /{unitShort}
          </span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
