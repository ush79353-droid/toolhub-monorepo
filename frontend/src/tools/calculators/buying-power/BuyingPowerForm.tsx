'use client';

import type { ReactNode } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BuyingPowerFieldErrors,
  BuyingPowerInput,
  BuyingPowerResult,
} from './types';
import {
  listUsCpiYearsDescending,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
} from './us-cpi-u-annual';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none bg-transparent px-3 text-sm text-accent outline-none';

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

interface BuyingPowerFormProps {
  input: BuyingPowerInput;
  errors: BuyingPowerFieldErrors;
  result: BuyingPowerResult | null;
  onChange: (input: BuyingPowerInput) => void;
  onSwapYears: () => void;
}

export function BuyingPowerForm({
  input,
  errors,
  result,
  onChange,
  onSwapYears,
}: BuyingPowerFormProps) {
  const years = listUsCpiYearsDescending();
  const set = (patch: Partial<BuyingPowerInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Adjusted value = Amount × (Target CPI ÷ Reference CPI) using US CPI-U
        annual averages ({US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR}, BLS CUUR0000SA0).
      </p>

      <div>
        <label htmlFor="bp-amount" className={labelClass}>
          Amount
          <InfoTooltip
            label="Amount"
            text="Enter the amount of money whose purchasing power you want to compare between two years."
          />
        </label>
        <FieldShell error={errors.amount}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="bp-amount"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.amount}
            onChange={(e) => set({ amount: e.target.value })}
            placeholder="1,000"
            aria-invalid={Boolean(errors.amount)}
          />
        </FieldShell>
        {errors.amount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="bp-reference-year" className={labelClass}>
          Reference Year
          <InfoTooltip
            label="Reference Year"
            text="Select the year in which your original amount of money had its stated purchasing power."
          />
        </label>
        <FieldShell error={errors.referenceYear}>
          <select
            id="bp-reference-year"
            className={selectClass}
            value={input.referenceYear}
            onChange={(e) => set({ referenceYear: e.target.value })}
            aria-invalid={Boolean(errors.referenceYear)}
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={`ref-${y}`} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.referenceYear ? (
          <p className="mt-1 text-xs text-rose-600">{errors.referenceYear}</p>
        ) : null}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-lg border-border text-xs font-semibold text-accent hover:bg-muted/30"
          onClick={onSwapYears}
          disabled={!input.referenceYear && !input.targetYear}
          aria-label="Swap reference and target years"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap years
        </Button>
      </div>

      <div>
        <label htmlFor="bp-target-year" className={labelClass}>
          Target Year
          <InfoTooltip
            label="Target Year"
            text="Select the year whose purchasing power you want to compare with the reference year."
          />
        </label>
        <FieldShell error={errors.targetYear}>
          <select
            id="bp-target-year"
            className={selectClass}
            value={input.targetYear}
            onChange={(e) => set({ targetYear: e.target.value })}
            aria-invalid={Boolean(errors.targetYear)}
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={`tgt-${y}`} value={String(y)}>
                {y}
                {y === US_CPI_MAX_YEAR ? ' (latest final annual)' : ''}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.targetYear ? (
          <p className="mt-1 text-xs text-rose-600">{errors.targetYear}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Default target is {US_CPI_MAX_YEAR}, the latest fully published
            annual-average CPI year in this dataset (not a partial current-year
            figure).
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bp-dollar-value" className={labelClass}>
          Dollar Value
          <InfoTooltip
            label="Dollar Value"
            text="The equivalent value of the original amount in the target year, calculated using the ratio of Consumer Price Index values."
          />
        </label>
        <FieldShell muted>
          <input
            id="bp-dollar-value"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={result?.formattedAdjustedAmount ?? ''}
            placeholder="—"
            aria-readonly="true"
          />
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
