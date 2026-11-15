'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CustomerRetentionDraft } from './validation';
import type { CustomerRetentionFieldErrors } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

interface CustomerRetentionRateFormProps {
  draft: CustomerRetentionDraft;
  attritionDisplay: string;
  retentionDisplay: string;
  errors: CustomerRetentionFieldErrors;
  onDraftChange: (draft: CustomerRetentionDraft) => void;
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

export function CustomerRetentionRateForm({
  draft,
  attritionDisplay,
  retentionDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: CustomerRetentionRateFormProps) {
  const set = (patch: Partial<CustomerRetentionDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <FieldShell
        label="Existing customers"
        htmlFor="crr-existing"
        error={errors.existingCustomers}
        tip="Customers you already had at the start of the period (before new acquisitions)."
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="crr-existing"
            inputMode="decimal"
            className={inputClass}
            value={draft.existingCustomers}
            aria-invalid={Boolean(errors.existingCustomers)}
            onChange={(event) => set({ existingCustomers: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="New customers"
        htmlFor="crr-new"
        error={errors.newCustomers}
        tip="Customers acquired during the period."
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="crr-new"
            inputMode="decimal"
            className={inputClass}
            value={draft.newCustomers}
            aria-invalid={Boolean(errors.newCustomers)}
            onChange={(event) => set({ newCustomers: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Total customers"
        htmlFor="crr-total"
        error={errors.totalCustomers}
        tip="Customers at period end (existing retained + new)."
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="crr-total"
            inputMode="decimal"
            className={inputClass}
            value={draft.totalCustomers}
            aria-invalid={Boolean(errors.totalCustomers)}
            onChange={(event) => set({ totalCustomers: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Attrition rate" htmlFor="crr-attrition">
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="crr-attrition"
            readOnly
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            value={attritionDisplay}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Customer retention rate" htmlFor="crr-retention">
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="crr-retention"
            readOnly
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            value={retentionDisplay}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
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
