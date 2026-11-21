'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPeMoney, formatRatio } from './calculation';
import type {
  PriceToEarningsFieldErrors,
  PriceToEarningsInput,
  PriceToEarningsResult,
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

interface PriceToEarningsFormProps {
  input: PriceToEarningsInput;
  errors: PriceToEarningsFieldErrors;
  result: PriceToEarningsResult | null;
  onChange: (input: PriceToEarningsInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PriceToEarningsForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PriceToEarningsFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PriceToEarningsInput>) =>
    onChange({ ...input, ...patch });

  const peDisplay =
    result?.peRatio != null
      ? formatRatio(result.peRatio)
      : result?.status === 'undefined'
        ? 'Not defined'
        : result?.status === 'not-meaningful'
          ? 'N/M'
          : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        P/E = price per share ÷ earnings per share when EPS is positive. Zero
        EPS is undefined; negative EPS is not a meaningful conventional
        multiple.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="pe-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for P/E monetary inputs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency and scale (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is the price to earnings ratio?
        </a>
      </p>

      <div>
        <label htmlFor="pe-price" className={labelClass}>
          Price per share
          <InfoTooltip
            label="Price per share"
            text="Current market price of one common share. Must be zero or positive."
          />
        </label>
        <FieldShell error={errors.pricePerShare}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="pe-price"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.pricePerShare}
            onChange={(e) => set({ pricePerShare: e.target.value })}
            placeholder="120"
            aria-invalid={Boolean(errors.pricePerShare)}
          />
        </FieldShell>
        {errors.pricePerShare ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pricePerShare}</p>
        ) : null}
      </div>

      {!input.showEpsCalculator ? (
        <div>
          <label htmlFor="pe-eps" className={labelClass}>
            Earnings per share (EPS)
            <InfoTooltip
              label="EPS"
              text="Earnings attributable to each common share for the selected period. May be positive, zero, or negative."
            />
          </label>
          <FieldShell error={errors.earningsPerShare}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pe-eps"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.earningsPerShare}
              onChange={(e) => set({ earningsPerShare: e.target.value })}
              placeholder="10"
              aria-invalid={Boolean(errors.earningsPerShare)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              /share
            </span>
          </FieldShell>
          {errors.earningsPerShare ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.earningsPerShare}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={input.showEpsCalculator}
          onChange={(e) => set({ showEpsCalculator: e.target.checked })}
        />
        <span>Calculate earnings per share</span>
      </label>

      {input.showEpsCalculator ? (
        <div className="space-y-3.5 rounded-lg border border-border bg-muted/15 p-3">
          <p className="text-xs text-muted-foreground">
            EPS = (net income − preferred dividends) ÷ weighted-average common
            shares. Enabling this uses calculated EPS for P/E; your manual EPS
            field is not overwritten.
          </p>
          <div>
            <label htmlFor="pe-net" className={labelClass}>
              Net income
              <InfoTooltip
                label="Net income"
                text="Net income available before subtracting preferred dividends for basic EPS."
              />
            </label>
            <FieldShell error={errors.netIncome}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="pe-net"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.netIncome}
                onChange={(e) => set({ netIncome: e.target.value })}
                placeholder="1,000,000"
                aria-invalid={Boolean(errors.netIncome)}
              />
            </FieldShell>
            {errors.netIncome ? (
              <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="pe-pref" className={labelClass}>
              Preferred dividends
              <InfoTooltip
                label="Preferred dividends"
                text="Dividends on preferred stock subtracted when computing EPS for common shares. Use 0 if none."
              />
            </label>
            <FieldShell error={errors.preferredDividends}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="pe-pref"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.preferredDividends}
                onChange={(e) => set({ preferredDividends: e.target.value })}
                placeholder="100,000"
                aria-invalid={Boolean(errors.preferredDividends)}
              />
            </FieldShell>
            {errors.preferredDividends ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.preferredDividends}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="pe-shares" className={labelClass}>
              Weighted-average common shares
              <InfoTooltip
                label="Shares outstanding"
                text="Weighted-average common shares outstanding. Must be greater than zero."
              />
            </label>
            <FieldShell error={errors.weightedAverageShares}>
              <input
                id="pe-shares"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightedAverageShares}
                onChange={(e) =>
                  set({ weightedAverageShares: e.target.value })
                }
                placeholder="100,000"
                aria-invalid={Boolean(errors.weightedAverageShares)}
              />
              <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                shares
              </span>
            </FieldShell>
            {errors.weightedAverageShares ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.weightedAverageShares}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="pe-calc-eps" className={labelClass}>
              Calculated EPS
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="pe-calc-eps"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result?.earningsPerShare != null
                    ? formatPeMoney(result.earningsPerShare, input.currency)
                    : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
              <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                /share
              </span>
            </FieldShell>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="pe-ratio" className={labelClass}>
          P/E ratio
        </label>
        <FieldShell muted>
          <input
            id="pe-ratio"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={peDisplay}
            placeholder="—"
            aria-readonly="true"
          />
          <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
            ×
          </span>
        </FieldShell>
        {result?.peUnavailableReason ? (
          <p className="mt-1 text-xs text-amber-800" role="status">
            {result.peUnavailableReason}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
