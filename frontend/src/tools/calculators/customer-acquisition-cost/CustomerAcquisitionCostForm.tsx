'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CustomerAcquisitionCostFieldErrors,
  CustomerAcquisitionCostInput,
  CustomerAcquisitionCostResult,
} from './types';

interface CustomerAcquisitionCostFormProps {
  input: CustomerAcquisitionCostInput;
  errors: CustomerAcquisitionCostFieldErrors;
  result: CustomerAcquisitionCostResult | null;
  onChange: (input: CustomerAcquisitionCostInput) => void;
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
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function CustomerAcquisitionCostForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: CustomerAcquisitionCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CustomerAcquisitionCostInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="cac-marketing"
          label="Cost of marketing"
          tip="Total marketing spend for the same period as the new-customer count (ads, creative, campaigns)."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cac-marketing"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.costOfMarketing}
              aria-invalid={Boolean(errors.costOfMarketing)}
              onChange={(event) => set({ costOfMarketing: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="cac-marketing-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.costOfMarketing ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfMarketing}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cac-sales"
          label="Cost of sales"
          tip="Sales spend for the same period (people, commissions, CRM, closing tools)."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cac-sales"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.costOfSales}
              aria-invalid={Boolean(errors.costOfSales)}
              onChange={(event) => set({ costOfSales: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="cac-sales-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.costOfSales ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfSales}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cac-customers"
          label="Number of new customers"
          tip="Customers acquired in the same period as the marketing and sales costs. Must be greater than zero."
        />
        <input
          id="cac-customers"
          className={inputClass}
          inputMode="decimal"
          value={input.newCustomers}
          aria-invalid={Boolean(errors.newCustomers)}
          onChange={(event) => set({ newCustomers: event.target.value })}
        />
        {errors.newCustomers ? (
          <p className="mt-1 text-xs text-rose-600">{errors.newCustomers}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="cac-result"
          label="Customer acquisition cost (CAC)"
          tip="(Marketing + sales) ÷ new customers. Shown in the selected currency denomination."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="cac-result"
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              readOnly
              value={result?.formattedCac ?? ''}
              placeholder=""
              aria-live="polite"
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="cac-result-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="CAC currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
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
