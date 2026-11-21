'use client';

import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMetric, formatRsi } from './calculation';
import type {
  RelativeStrengthIndexFieldErrors,
  RelativeStrengthIndexInput,
  RelativeStrengthIndexResult,
  RsiMethod,
  RsiPriceRow,
} from './types';
import {
  MAX_RSI_PRICES,
  MIN_RSI_PRICE_ROWS,
  createPriceRow,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface RelativeStrengthIndexFormProps {
  input: RelativeStrengthIndexInput;
  errors: RelativeStrengthIndexFieldErrors;
  result: RelativeStrengthIndexResult | null;
  onChange: (input: RelativeStrengthIndexInput) => void;
}

export function RelativeStrengthIndexForm({
  input,
  errors,
  result,
  onChange,
}: RelativeStrengthIndexFormProps) {
  const set = (patch: Partial<RelativeStrengthIndexInput>) =>
    onChange({ ...input, ...patch });

  const updatePrice = (id: string, patch: Partial<RsiPriceRow>) => {
    set({
      prices: input.prices.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const addPrice = () => {
    if (input.prices.length >= MAX_RSI_PRICES) return;
    set({ prices: [...input.prices, createPriceRow()] });
  };

  const removePrice = (id: string) => {
    if (input.prices.length <= MIN_RSI_PRICE_ROWS) return;
    set({ prices: input.prices.filter((p) => p.id !== id) });
  };

  const clearPrices = () => {
    set({
      prices: Array.from({ length: Math.max(5, MIN_RSI_PRICE_ROWS) }, () =>
        createPriceRow()
      ),
    });
  };

  const atMax = input.prices.length >= MAX_RSI_PRICES;
  const canRemove = input.prices.length > MIN_RSI_PRICE_ROWS;

  const rsiDisplay =
    result?.formattedRsi ??
    (result?.status === 'insufficient-data' ? 'Insufficient data' : '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        RSI = 100 − 100 / (1 + RS), where RS = average gain ÷ average loss over
        the lookback. A period of n needs at least n+1 closing prices (14 → 15).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is the Relative Strength Index?
        </a>
      </p>

      <div>
        <label htmlFor="rsi-period" className={labelClass}>
          RSI period
          <InfoTooltip
            label="RSI period"
            text="Lookback length in price changes. Standard is 14. Must be a positive whole number."
          />
        </label>
        <FieldShell error={errors.period}>
          <input
            id="rsi-period"
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={input.period}
            onChange={(e) => set({ period: e.target.value })}
            placeholder="14"
            aria-invalid={Boolean(errors.period)}
          />
        </FieldShell>
        {errors.period ? (
          <p className="mt-1 text-xs text-rose-600">{errors.period}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rsi-method" className={labelClass}>
          Calculation method
          <InfoTooltip
            label="Method"
            text="Wilder's RSI is the standard recursive smoother. Simple-average RSI recomputes a trailing mean each step and can differ after the first reading."
          />
        </label>
        <FieldShell>
          <select
            id="rsi-method"
            className={`${inputClass} cursor-pointer`}
            value={input.method}
            onChange={(e) => set({ method: e.target.value as RsiMethod })}
            aria-label="RSI calculation method"
          >
            <option value="wilder">Wilder&apos;s RSI (recommended)</option>
            <option value="simple">Simple-average RSI</option>
          </select>
        </FieldShell>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Closing price of security
        </legend>
        <p className="text-xs text-muted-foreground">
          Enter prices in chronological order (oldest → newest).
        </p>

        {input.prices.map((row, index) => {
          const rowErr = errors.prices?.[row.id];
          return (
            <div key={row.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`rsi-price-${row.id}`}
                  className={labelClass}
                >
                  Price {index + 1}
                </label>
                {canRemove ? (
                  <button
                    type="button"
                    onClick={() => removePrice(row.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-accent"
                    aria-label={`Remove price ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                ) : null}
              </div>
              <FieldShell error={rowErr}>
                <input
                  id={`rsi-price-${row.id}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={row.price}
                  onChange={(e) =>
                    updatePrice(row.id, { price: e.target.value })
                  }
                  placeholder={index === 0 ? '100' : ''}
                  aria-invalid={Boolean(rowErr)}
                />
              </FieldShell>
              {rowErr ? (
                <p className="text-xs text-rose-600">{rowErr}</p>
              ) : null}
            </div>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addPrice}
            disabled={atMax}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-accent hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add price
          </button>
          <button
            type="button"
            onClick={clearPrices}
            className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-3 text-xs font-semibold text-accent hover:bg-muted/30"
          >
            Clear prices
          </button>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="rsi-avg-gain" className={labelClass}>
              Average gain
            </label>
            <FieldShell muted>
              <input
                id="rsi-avg-gain"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result?.averageGain != null
                    ? formatMetric(result.averageGain)
                    : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
          <div>
            <label htmlFor="rsi-avg-loss" className={labelClass}>
              Average loss
            </label>
            <FieldShell muted>
              <input
                id="rsi-avg-loss"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result?.averageLoss != null
                    ? formatMetric(result.averageLoss)
                    : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </div>

        <div>
          <label htmlFor="rsi-rs" className={labelClass}>
            Relative strength (RS)
          </label>
          <FieldShell muted>
            <input
              id="rsi-rs"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedRs ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="rsi-value" className={labelClass}>
            RSI
          </label>
          <FieldShell muted>
            <input
              id="rsi-value"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={rsiDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
          {result?.status === 'valid' && result.rsi != null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Display {formatRsi(result.rsi)} (range 0–100)
            </p>
          ) : null}
          {result?.insufficientMessage ? (
            <p className="mt-1 text-xs text-amber-800" role="status">
              {result.insufficientMessage}
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
