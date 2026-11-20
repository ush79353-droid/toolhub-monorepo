'use client';

import type { ReactNode } from 'react';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CostMode, DownPaymentMode } from './types';

export const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
export const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
export const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

export function MoneyOrPercentField({
  id,
  label,
  tip,
  currency,
  mode,
  value,
  error,
  onModeChange,
  onValueChange,
  modes,
}: {
  id: string;
  label: string;
  tip: string;
  currency: SupportedCurrency;
  mode: CostMode | DownPaymentMode;
  value: string;
  error?: string;
  onModeChange: (mode: string) => void;
  onValueChange: (value: string) => void;
  modes: Array<{ value: string; label: string }>;
}) {
  const symbol = getCurrencySymbol(currency);
  const isPercent =
    mode === 'percentage' || mode === 'annualPercentage';

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          {!isPercent ? (
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden
            >
              {symbol}
            </span>
          ) : null}
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValueChange(e.target.value)}
          />
          {isPercent ? (
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          ) : null}
        </FieldShell>
        <select
          className={`${selectClass} min-w-[132px]`}
          aria-label={`${label} unit`}
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
        >
          {modes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export const COST_MODES = [
  { value: 'annualPercentage', label: '% / year' },
  { value: 'annualAmount', label: '$ / year' },
  { value: 'monthlyAmount', label: '$ / month' },
] as const;

export const DOWN_PAYMENT_MODES = [
  { value: 'percentage', label: '% of price' },
  { value: 'amount', label: 'fixed $' },
] as const;
