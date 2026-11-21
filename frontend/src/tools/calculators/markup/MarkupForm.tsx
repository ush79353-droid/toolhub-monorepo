'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarkupFieldErrors,
  MarkupInput,
  MarkupVariable,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface MarkupFormProps {
  input: MarkupInput;
  errors: MarkupFieldErrors;
  onFieldChange: (field: MarkupVariable, value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function MarkupForm({
  input,
  errors,
  onFieldChange,
  onCurrencyChange,
  onLoadExample,
}: MarkupFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const auth = new Set(input.authoritativeFields ?? []);

  const authHint = (field: MarkupVariable) =>
    auth.has(field) ? (
      <span className="ml-1 text-[10px] font-normal text-primary">input</span>
    ) : input.authoritativeFields ? (
      <span className="ml-1 text-[10px] font-normal text-muted-foreground">
        calculated
      </span>
    ) : null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Markup % = profit ÷ cost × 100. Cost is unit cost; revenue is unit
        selling price; profit is unit gross profit before other expenses. Enter
        any two compatible values; the other two are derived. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mu-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($50 · 40% markup → $70 revenue · $20 profit)
      </button>

      <div>
        <label htmlFor="mu-cost" className={labelClass}>
          Cost
          {authHint('cost')}
          <InfoTooltip
            label="Cost"
            text="The cost of purchasing or producing one unit."
          />
        </label>
        <FieldShell error={errors.cost}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="mu-cost"
            className={inputClass}
            inputMode="decimal"
            value={input.cost}
            onChange={(e) => onFieldChange('cost', e.target.value)}
            placeholder="50"
            aria-invalid={Boolean(errors.cost)}
            aria-describedby={errors.cost ? 'mu-cost-err' : undefined}
          />
        </FieldShell>
        {errors.cost ? (
          <p id="mu-cost-err" className="mt-1 text-xs text-rose-600">
            {errors.cost}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mu-pct" className={labelClass}>
          Markup
          {authHint('markupPercentage')}
          <InfoTooltip
            label="Markup"
            text="Profit added to cost, expressed as a percentage of cost (not of revenue)."
          />
        </label>
        <FieldShell error={errors.markupPercentage}>
          <input
            id="mu-pct"
            className={inputClass}
            inputMode="decimal"
            value={input.markupPercentage}
            onChange={(e) => onFieldChange('markupPercentage', e.target.value)}
            placeholder="40"
            aria-invalid={Boolean(errors.markupPercentage)}
            aria-describedby={
              errors.markupPercentage ? 'mu-pct-err' : undefined
            }
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.markupPercentage ? (
          <p id="mu-pct-err" className="mt-1 text-xs text-rose-600">
            {errors.markupPercentage}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mu-revenue" className={labelClass}>
          Revenue
          {authHint('revenue')}
          <InfoTooltip
            label="Revenue"
            text="The selling price or revenue generated from selling one unit."
          />
        </label>
        <FieldShell error={errors.revenue}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="mu-revenue"
            className={inputClass}
            inputMode="decimal"
            value={input.revenue}
            onChange={(e) => onFieldChange('revenue', e.target.value)}
            placeholder="70"
            aria-invalid={Boolean(errors.revenue)}
            aria-describedby={errors.revenue ? 'mu-revenue-err' : undefined}
          />
        </FieldShell>
        {errors.revenue ? (
          <p id="mu-revenue-err" className="mt-1 text-xs text-rose-600">
            {errors.revenue}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mu-profit" className={labelClass}>
          Profit
          {authHint('profit')}
          <InfoTooltip
            label="Profit"
            text="Unit selling price minus unit cost. Not necessarily company net profit after overhead."
          />
        </label>
        <FieldShell error={errors.profit}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="mu-profit"
            className={inputClass}
            inputMode="decimal"
            value={input.profit}
            onChange={(e) => onFieldChange('profit', e.target.value)}
            placeholder="20"
            aria-invalid={Boolean(errors.profit)}
            aria-describedby={errors.profit ? 'mu-profit-err' : undefined}
          />
        </FieldShell>
        {errors.profit ? (
          <p id="mu-profit-err" className="mt-1 text-xs text-rose-600">
            {errors.profit}
          </p>
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
