'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPivotPrice } from './calculation';
import type {
  PivotMethod,
  PivotPointFieldErrors,
  PivotPointInput,
  PivotPointResult,
} from './types';
import { PIVOT_METHOD_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const METHODS: PivotMethod[] = [
  'classic',
  'woodie',
  'camarilla',
  'fibonacci',
  'demark',
];

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

function ReadonlyLevel({
  id,
  label,
  value,
  symbol,
  currency,
}: {
  id: string;
  label: string;
  value: number | null | undefined;
  symbol: string;
  currency: SupportedCurrency;
}) {
  if (value === null || value === undefined) return null;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <FieldShell muted>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default font-semibold text-accent`}
          value={formatPivotPrice(value, currency)}
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface PivotPointFormProps {
  input: PivotPointInput;
  errors: PivotPointFieldErrors;
  result: PivotPointResult | null;
  onChange: (input: PivotPointInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PivotPointForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PivotPointFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PivotPointInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Pivot points from the prior period&apos;s high, low, and close. Choose a
        method to compute support and resistance. Open price is required for
        DeMark only.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="pp-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for pivot point prices"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency and scale (denomination only — no FX).
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Pivot points calculator for trading
        </legend>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>
            Method
            <InfoTooltip
              label="Pivot method"
              text="Classic, Woodie, Camarilla, Fibonacci, and DeMark use different formulas for the central pivot and support/resistance levels."
            />
          </legend>
          <div
            className="flex flex-col gap-2 text-sm text-accent"
            role="radiogroup"
            aria-label="Pivot point method"
          >
            {METHODS.map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pp-method"
                  value={method}
                  checked={input.method === method}
                  onChange={() => set({ method })}
                  className="h-4 w-4 accent-primary"
                />
                <span>{PIVOT_METHOD_LABELS[method]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="pp-high" className={labelClass}>
            High price
            <InfoTooltip
              label="High price"
              text="Previous period high."
            />
          </label>
          <FieldShell error={errors.high}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pp-high"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.high}
              onChange={(e) => set({ high: e.target.value })}
              placeholder="110"
              aria-invalid={Boolean(errors.high)}
            />
          </FieldShell>
          {errors.high ? (
            <p className="mt-1 text-xs text-rose-600">{errors.high}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pp-low" className={labelClass}>
            Low price
            <InfoTooltip label="Low price" text="Previous period low." />
          </label>
          <FieldShell error={errors.low}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pp-low"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.low}
              onChange={(e) => set({ low: e.target.value })}
              placeholder="90"
              aria-invalid={Boolean(errors.low)}
            />
          </FieldShell>
          {errors.low ? (
            <p className="mt-1 text-xs text-rose-600">{errors.low}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pp-close" className={labelClass}>
            Close price
            <InfoTooltip
              label="Close price"
              text="Previous period close. Must lie between low and high."
            />
          </label>
          <FieldShell error={errors.close}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pp-close"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.close}
              onChange={(e) => set({ close: e.target.value })}
              placeholder="100"
              aria-invalid={Boolean(errors.close)}
            />
          </FieldShell>
          {errors.close ? (
            <p className="mt-1 text-xs text-rose-600">{errors.close}</p>
          ) : null}
        </div>

        {input.method === 'demark' ? (
          <div>
            <label htmlFor="pp-open" className={labelClass}>
              Open price
              <InfoTooltip
                label="Open price"
                text="Required for DeMark. Compared with close to choose the conditional X formula."
              />
            </label>
            <FieldShell error={errors.open}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="pp-open"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.open}
                onChange={(e) => set({ open: e.target.value })}
                placeholder="95"
                aria-invalid={Boolean(errors.open)}
              />
            </FieldShell>
            {errors.open ? (
              <p className="mt-1 text-xs text-rose-600">{errors.open}</p>
            ) : null}
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        <ReadonlyLevel
          id="pp-r4"
          label="Resistance Level 4 (R4)"
          value={result?.r4}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-r3"
          label="Resistance Level 3 (R3)"
          value={result?.r3}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-r2"
          label="Resistance Level 2 (R2)"
          value={result?.r2}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-r1"
          label="Resistance Level 1 (R1)"
          value={result?.r1}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-pivot"
          label="Pivot Point (PP)"
          value={result?.pivot}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-s1"
          label="Support Level 1 (S1)"
          value={result?.s1}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-s2"
          label="Support Level 2 (S2)"
          value={result?.s2}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-s3"
          label="Support Level 3 (S3)"
          value={result?.s3}
          symbol={symbol}
          currency={input.currency}
        />
        <ReadonlyLevel
          id="pp-s4"
          label="Support Level 4 (S4)"
          value={result?.s4}
          symbol={symbol}
          currency={input.currency}
        />

        {!result ? (
          <p className="text-xs text-muted-foreground">
            Enter valid prices to see pivot, support, and resistance levels.
          </p>
        ) : null}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
