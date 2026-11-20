'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPegMoney, formatPercent, formatRatio } from './calculation';
import type { PegRatioFieldErrors, PegRatioInput, PegRatioResult } from './types';

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

interface PegRatioFormProps {
  input: PegRatioInput;
  errors: PegRatioFieldErrors;
  result: PegRatioResult | null;
  onChange: (input: PegRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PegRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PegRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PegRatioInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        PEG = (P/E) ÷ earnings growth %, where growth % = (retention % × ROE %)
        / 100. Use growth in percentage points (e.g. 4.8), not 0.048.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="peg-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for PEG monetary inputs"
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
          What is PEG ratio?
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          P/E ratio
        </legend>

        <div>
          <label htmlFor="peg-price" className={labelClass}>
            Price per share
            <InfoTooltip
              label="Price per share"
              text="Current market price of one share."
            />
          </label>
          <FieldShell error={errors.pricePerShare}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="peg-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pricePerShare}
              onChange={(e) => set({ pricePerShare: e.target.value })}
              placeholder="250"
              aria-invalid={Boolean(errors.pricePerShare)}
            />
          </FieldShell>
          {errors.pricePerShare ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pricePerShare}</p>
          ) : null}
        </div>

        {!input.calculateEps ? (
          <div>
            <label htmlFor="peg-eps" className={labelClass}>
              Earnings per share (EPS)
              <InfoTooltip
                label="EPS"
                text="Earnings attributable to each outstanding share."
              />
            </label>
            <FieldShell error={errors.earningsPerShare}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="peg-eps"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.earningsPerShare}
                onChange={(e) => set({ earningsPerShare: e.target.value })}
                placeholder="15.50"
                aria-invalid={Boolean(errors.earningsPerShare)}
              />
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
            checked={input.calculateEps}
            onChange={(e) => set({ calculateEps: e.target.checked })}
          />
          <span>Calculate earnings per share</span>
        </label>

        {input.calculateEps ? (
          <div className="space-y-3.5 rounded-lg border border-border bg-white/70 p-3">
            <div>
              <label htmlFor="peg-net" className={labelClass}>
                Net earnings
                <InfoTooltip
                  label="Net earnings"
                  text="Total earnings used to derive EPS when this option is enabled."
                />
              </label>
              <FieldShell error={errors.netEarnings}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="peg-net"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.netEarnings}
                  onChange={(e) => set({ netEarnings: e.target.value })}
                  placeholder="15,500,000"
                  aria-invalid={Boolean(errors.netEarnings)}
                />
              </FieldShell>
              {errors.netEarnings ? (
                <p className="mt-1 text-xs text-rose-600">{errors.netEarnings}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="peg-shares" className={labelClass}>
                Number of outstanding shares
                <InfoTooltip
                  label="Outstanding shares"
                  text="Share count used as the EPS denominator. Must be greater than zero."
                />
              </label>
              <FieldShell error={errors.outstandingShares}>
                <input
                  id="peg-shares"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.outstandingShares}
                  onChange={(e) => set({ outstandingShares: e.target.value })}
                  placeholder="1,000,000"
                  aria-invalid={Boolean(errors.outstandingShares)}
                />
                <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                  shares
                </span>
              </FieldShell>
              {errors.outstandingShares ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.outstandingShares}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="peg-calc-eps" className={labelClass}>
                Calculated EPS
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="peg-calc-eps"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-semibold text-accent`}
                  value={
                    result?.earningsPerShare != null
                      ? formatPegMoney(result.earningsPerShare, input.currency)
                      : ''
                  }
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="peg-pe" className={labelClass}>
            P/E ratio
          </label>
          <FieldShell muted>
            <input
              id="peg-pe"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result?.peRatio != null ? formatRatio(result.peRatio) : ''
              }
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
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Earnings growth
        </legend>

        <div>
          <label htmlFor="peg-retention" className={labelClass}>
            Retention rate
            <InfoTooltip
              label="Retention rate"
              text="Share of earnings retained (not paid as dividends), as a percent from 0 to 100."
            />
          </label>
          <FieldShell error={errors.retentionRate}>
            <input
              id="peg-retention"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.retentionRate}
              onChange={(e) => set({ retentionRate: e.target.value })}
              placeholder="60"
              aria-invalid={Boolean(errors.retentionRate)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.retentionRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.retentionRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="peg-roe" className={labelClass}>
            Return on equity (ROE)
            <InfoTooltip
              label="ROE"
              text="Return on equity as a percent. Combined with retention to estimate sustainable growth."
            />
          </label>
          <FieldShell error={errors.returnOnEquity}>
            <input
              id="peg-roe"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.returnOnEquity}
              onChange={(e) => set({ returnOnEquity: e.target.value })}
              placeholder="8"
              aria-invalid={Boolean(errors.returnOnEquity)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.returnOnEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.returnOnEquity}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="peg-growth" className={labelClass}>
            Earnings growth
          </label>
          <FieldShell muted>
            <input
              id="peg-growth"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result?.earningsGrowthPercent != null
                  ? formatPercent(result.earningsGrowthPercent)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          PEG ratio
        </legend>
        <div>
          <label htmlFor="peg-result" className={labelClass}>
            PEG ratio
          </label>
          <FieldShell muted>
            <input
              id="peg-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result?.pegRatio != null ? formatRatio(result.pegRatio) : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              ×
            </span>
          </FieldShell>
          {result?.pegUnavailableReason ? (
            <p className="mt-1 text-xs text-amber-800" role="status">
              {result.pegUnavailableReason}
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
