'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CommissionFieldErrors, CommissionInput, CommissionResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CommissionFormProps {
  input: CommissionInput;
  errors: CommissionFieldErrors;
  result: CommissionResult | null;
  onChange: (input: CommissionInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CommissionForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: CommissionFormProps) {
  const set = (patch: Partial<CommissionInput>) => onChange({ ...input, ...patch });

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-foreground/90">
        Leave exactly one of Sales Price, Commission Rate, or Commission blank to solve for that
        value. Amounts are in USD.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
          className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          noValidate
          autoComplete="off"
        >
          <div>
            <label className={labelClass} htmlFor="commission-sales-price">
              <span>Sales Price</span>
              <InfoTooltip
                label="Sales Price"
                text="Transaction or sales amount in USD. Leave blank to solve for sales price."
              />
            </label>
            <FieldShell error={errors.salesPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="commission-sales-price"
                className={inputClass}
                inputMode="decimal"
                value={input.salesPrice}
                placeholder="Leave blank to solve"
                aria-invalid={Boolean(errors.salesPrice)}
                onChange={(e) => set({ salesPrice: e.target.value })}
              />
            </FieldShell>
            {errors.salesPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesPrice}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="commission-rate">
              <span>Commission Rate</span>
              <InfoTooltip
                label="Commission Rate"
                text="Flat commission as a percent of sales price. Leave blank to solve for the rate."
              />
            </label>
            <FieldShell error={errors.commissionRate}>
              <input
                id="commission-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.commissionRate}
                placeholder="Leave blank to solve"
                aria-invalid={Boolean(errors.commissionRate)}
                onChange={(e) => set({ commissionRate: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.commissionRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.commissionRate}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="commission-amount">
              <span>Commission</span>
              <InfoTooltip
                label="Commission"
                text="Commission amount in USD. Leave blank to solve for commission."
              />
            </label>
            <FieldShell error={errors.commission}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="commission-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.commission}
                placeholder="Leave blank to solve"
                aria-invalid={Boolean(errors.commission)}
                onChange={(e) => set({ commission: e.target.value })}
              />
            </FieldShell>
            {errors.commission ? (
              <p className="mt-1 text-xs text-rose-600">{errors.commission}</p>
            ) : null}
          </div>

          {errors.form ? (
            <p className="text-xs text-rose-600" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" className="h-10 rounded-xl px-4 text-xs font-semibold">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4 text-xs font-semibold"
              onClick={onClear}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
            Results
          </div>
          {result ? (
            <p className="text-sm leading-relaxed text-foreground/90">
              {result.summaryLead}{' '}
              <strong className="font-semibold text-accent">{result.summaryValue}</strong>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter any two fields (leave one blank) and click Calculate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
