'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MarkdownFieldErrors,
  MarkdownInput,
  MarkdownVariable,
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

interface MarkdownFormProps {
  input: MarkdownInput;
  errors: MarkdownFieldErrors;
  onFieldChange: (field: MarkdownVariable, value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function MarkdownForm({
  input,
  errors,
  onFieldChange,
  onCurrencyChange,
  onLoadExample,
}: MarkdownFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const auth = new Set(input.authoritativeFields ?? []);

  const authHint = (field: MarkdownVariable) =>
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
        Retail markdown = original selling price − actual selling price.
        Markdown % uses the original price as the denominator. Enter any two
        compatible values; the other two are derived. This is not a Markdown
        text formatter. Currency is denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="md-currency"
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
        Load example ($100 → $75 · $25 markdown · 25%)
      </button>

      <div>
        <label htmlFor="md-original" className={labelClass}>
          Original selling price
          {authHint('originalPrice')}
          <InfoTooltip
            label="Original selling price"
            text="The established list or ticket price before the markdown."
          />
        </label>
        <FieldShell error={errors.originalPrice}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="md-original"
            className={inputClass}
            inputMode="decimal"
            value={input.originalPrice}
            onChange={(e) => onFieldChange('originalPrice', e.target.value)}
            placeholder="100"
          />
        </FieldShell>
        {errors.originalPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.originalPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="md-actual" className={labelClass}>
          Actual selling price
          {authHint('actualPrice')}
          <InfoTooltip
            label="Actual selling price"
            text="The reduced price after applying the markdown."
          />
        </label>
        <FieldShell error={errors.actualPrice}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="md-actual"
            className={inputClass}
            inputMode="decimal"
            value={input.actualPrice}
            onChange={(e) => onFieldChange('actualPrice', e.target.value)}
            placeholder="75"
          />
        </FieldShell>
        {errors.actualPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.actualPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="md-amount" className={labelClass}>
          Markdown
          {authHint('markdownAmount')}
          <InfoTooltip
            label="Markdown"
            text="Dollar (currency) amount removed from the original selling price."
          />
        </label>
        <FieldShell error={errors.markdownAmount}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="md-amount"
            className={inputClass}
            inputMode="decimal"
            value={input.markdownAmount}
            onChange={(e) => onFieldChange('markdownAmount', e.target.value)}
            placeholder="25"
          />
        </FieldShell>
        {errors.markdownAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.markdownAmount}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="md-pct" className={labelClass}>
          Markdown percent
          {authHint('markdownPercentage')}
          <InfoTooltip
            label="Markdown percent"
            text="Markdown ÷ original selling price × 100. Not based on the actual selling price."
          />
        </label>
        <FieldShell error={errors.markdownPercentage}>
          <input
            id="md-pct"
            className={inputClass}
            inputMode="decimal"
            value={input.markdownPercentage}
            onChange={(e) =>
              onFieldChange('markdownPercentage', e.target.value)
            }
            placeholder="25"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.markdownPercentage ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.markdownPercentage}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
