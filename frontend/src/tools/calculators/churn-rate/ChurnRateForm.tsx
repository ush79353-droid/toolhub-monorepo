'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { ChurnRateFieldErrors } from './types';

export interface ChurnRateDraft {
  startingCustomers: string;
  customersLost: string;
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): ChurnRateDraft {
  return { startingCustomers: '', customersLost: '' };
}

interface ChurnRateFormProps {
  draft: ChurnRateDraft;
  churnRateDisplay: string;
  lifetimeDisplay: string;
  errors: ChurnRateFieldErrors;
  onDraftChange: (draft: ChurnRateDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  tip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tip?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChurnRateForm({
  draft,
  churnRateDisplay,
  lifetimeDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: ChurnRateFormProps) {
  const set = (patch: Partial<ChurnRateDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Customers at start of a period"
        htmlFor="churn-start"
        error={errors.startingCustomers}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="churn-start"
            inputMode="decimal"
            className={inputClass}
            value={draft.startingCustomers}
            placeholder=""
            aria-invalid={Boolean(errors.startingCustomers)}
            onChange={(event) => set({ startingCustomers: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Customers lost during period"
        htmlFor="churn-lost"
        error={errors.customersLost}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="churn-lost"
            inputMode="decimal"
            className={inputClass}
            value={draft.customersLost}
            placeholder=""
            aria-invalid={Boolean(errors.customersLost)}
            onChange={(event) => set({ customersLost: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Churn rate" htmlFor="churn-rate">
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="churn-rate"
            readOnly
            tabIndex={0}
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            value={churnRateDisplay}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Customer lifetime"
        htmlFor="churn-lifetime"
        tip="Estimated periods until a customer churns if the churn rate stays constant: starting customers ÷ customers lost. Shows “No finite estimate” when no customers are lost."
      >
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="churn-lifetime"
            readOnly
            tabIndex={0}
            className={`${inputClass} cursor-default pr-20 font-semibold text-accent`}
            value={lifetimeDisplay}
            placeholder="—"
            aria-live="polite"
          />
          {lifetimeDisplay && lifetimeDisplay !== 'No finite estimate' ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              periods
            </span>
          ) : null}
        </div>
      </FieldShell>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
