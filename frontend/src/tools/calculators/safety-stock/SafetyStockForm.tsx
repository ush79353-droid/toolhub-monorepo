'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SafetyStockFieldErrors, SafetyStockInput, SafetyStockResult } from './types';

interface SafetyStockFormProps {
  input: SafetyStockInput;
  errors: SafetyStockFieldErrors;
  result: SafetyStockResult | null;
  statisticalOpen: boolean;
  onStatisticalOpenChange: (open: boolean) => void;
  onChange: (input: SafetyStockInput) => void;
  onReset: () => void;
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
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} />
    </div>
  );
}

function UnitsInput({
  id,
  value,
  error,
  unit,
  onChange,
  readOnly,
}: {
  id: string;
  value: string;
  error?: string;
  unit: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <>
      <div className="relative">
        <input
          id={id}
          className={`${inputClass} pr-14 ${readOnly ? 'bg-muted/30 font-semibold text-accent' : ''}`}
          inputMode="decimal"
          value={value}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-live={readOnly ? 'polite' : undefined}
          onChange={
            readOnly || !onChange ? undefined : (event) => onChange(event.target.value)
          }
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </>
  );
}

export function SafetyStockForm({
  input,
  errors,
  result,
  statisticalOpen,
  onStatisticalOpenChange,
  onChange,
  onReset,
}: SafetyStockFormProps) {
  const set = (patch: Partial<SafetyStockInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/20">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          Basic safety stock
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <div>
            <FieldLabel
              htmlFor="ss-max-usage"
              label="Max daily usage"
              tip="Highest expected daily demand in units during the lead-time window."
            />
            <UnitsInput
              id="ss-max-usage"
              value={input.maxDailyUsage}
              error={errors.maxDailyUsage}
              unit="units"
              onChange={(maxDailyUsage) => set({ maxDailyUsage })}
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="ss-max-lead"
              label="Max lead time"
              tip="Longest expected supplier lead time in days. Both lead times use days."
            />
            <UnitsInput
              id="ss-max-lead"
              value={input.maxLeadTime}
              error={errors.maxLeadTime}
              unit="days"
              onChange={(maxLeadTime) => set({ maxLeadTime })}
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="ss-avg-usage"
              label="Average daily usage"
              tip="Typical daily demand in units over the same planning period."
            />
            <UnitsInput
              id="ss-avg-usage"
              value={input.averageDailyUsage}
              error={errors.averageDailyUsage}
              unit="units"
              onChange={(averageDailyUsage) => set({ averageDailyUsage })}
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="ss-avg-lead"
              label="Average lead time"
              tip="Typical supplier lead time in days. Must use the same day unit as max lead time."
            />
            <UnitsInput
              id="ss-avg-lead"
              value={input.averageLeadTime}
              error={errors.averageLeadTime}
              unit="days"
              onChange={(averageLeadTime) => set({ averageLeadTime })}
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="ss-safety"
              label="Safety stock"
              tip="max(0, max usage × max lead − average usage × average lead), rounded up to whole units."
            />
            <UnitsInput
              id="ss-safety"
              value={result?.formattedSafetyStock ?? ''}
              unit="units"
              readOnly
            />
          </div>
          <div>
            <FieldLabel
              htmlFor="ss-rop"
              label="Reorder point"
              tip="Average demand during lead time plus safety stock, rounded up to whole units."
            />
            <UnitsInput
              id="ss-rop"
              value={result?.formattedReorderPoint ?? ''}
              unit="units"
              readOnly
            />
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={statisticalOpen}
        onToggle={(event) => onStatisticalOpenChange(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Statistical safety stock</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              statisticalOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          No separate statistical inputs are configured for this calculator. Use the basic max–min
          method above for safety stock and reorder point.
        </div>
      </details>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
