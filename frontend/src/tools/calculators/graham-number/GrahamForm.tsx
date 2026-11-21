'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatGrahamMoney } from './calculation';
import type {
  GrahamNumberFieldErrors,
  GrahamNumberInput,
  GrahamNumberResult,
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

interface GrahamFormProps {
  input: GrahamNumberInput;
  errors: GrahamNumberFieldErrors;
  result: GrahamNumberResult | null;
  derivedEps: number | null;
  derivedBvps: number | null;
  onChange: (input: GrahamNumberInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onApplyEps: () => void;
  onApplyBvps: () => void;
}

export function GrahamForm({
  input,
  errors,
  result,
  derivedEps,
  derivedBvps,
  onChange,
  onCurrencyChange,
  onApplyEps,
  onApplyBvps,
}: GrahamFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Graham Number = √(22.5 × EPS × BVPS). Requires positive earnings and
        book value per share.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="gn-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for Graham Number amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 All money fields share one currency and scale (denomination only; no
        FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate Graham Number
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Per-share inputs
        </legend>

        <div>
          <label htmlFor="gn-bvps" className={labelClass}>
            Book value per share
            <InfoTooltip
              label="Book value per share"
              text="The accounting book value attributable to each outstanding common share."
            />
          </label>
          <FieldShell error={errors.bookValuePerShare}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gn-bvps"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bookValuePerShare}
              onChange={(e) =>
                onChange({ ...input, bookValuePerShare: e.target.value })
              }
              placeholder="20"
              aria-invalid={Boolean(errors.bookValuePerShare)}
            />
          </FieldShell>
          {errors.bookValuePerShare ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.bookValuePerShare}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="gn-eps" className={labelClass}>
            Earnings per share
            <InfoTooltip
              label="Earnings per share"
              text="The company's earnings attributable to each common share."
            />
          </label>
          <FieldShell error={errors.earningsPerShare}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gn-eps"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.earningsPerShare}
              onChange={(e) =>
                onChange({ ...input, earningsPerShare: e.target.value })
              }
              placeholder="5"
              aria-invalid={Boolean(errors.earningsPerShare)}
            />
          </FieldShell>
          {errors.earningsPerShare ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.earningsPerShare}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="gn-result" className={labelClass}>
            Graham number
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gn-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatGrahamMoney(result.grahamNumber, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result
                  ? `Graham number ${result.formattedGrahamNumber}`
                  : 'Graham number unavailable'
              }
            />
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Is it underpriced or overpriced?
        </legend>

        <div>
          <label htmlFor="gn-price" className={labelClass}>
            Current price
            <InfoTooltip
              label="Current price"
              text="The current market trading price of one share."
            />
          </label>
          <FieldShell error={errors.currentPrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="gn-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentPrice}
              onChange={(e) =>
                onChange({ ...input, currentPrice: e.target.value })
              }
              placeholder="40"
              aria-invalid={Boolean(errors.currentPrice)}
            />
          </FieldShell>
          {errors.currentPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentPrice}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="gn-valuation" className={labelClass}>
            Stock valuation
          </label>
          <FieldShell muted>
            <input
              id="gn-valuation"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-medium text-accent`}
              value={result?.valuationLabel ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="gn-diff" className={labelClass}>
            Price difference (vs Graham Number)
          </label>
          <FieldShell muted>
            <input
              id="gn-diff"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-medium text-accent`}
              value={
                result?.formattedPriceDifference
                  ? result.formattedPriceDifference.replace(/%$/, '')
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result?.formattedPriceDifference
                  ? `Price difference ${result.formattedPriceDifference}`
                  : 'Price difference unavailable'
              }
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          <p className="mt-1 text-[11px] text-muted-foreground">
            (GN − Price) ÷ GN × 100. Positive means price is below the Graham
            Number.
          </p>
        </div>
      </fieldset>

      <details
        className="rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        open={input.helperOpen}
        onToggle={(e) =>
          onChange({
            ...input,
            helperOpen: (e.target as HTMLDetailsElement).open,
          })
        }
      >
        <summary className="cursor-pointer text-[13px] font-semibold text-accent">
          Calculate per share values
        </summary>
        <div className="mt-3 space-y-4">
          <p className="text-xs text-muted-foreground">
            Derive EPS or BVPS from company figures, then apply them to the
            main fields. Manual inputs are not overwritten until you click
            Apply.
          </p>

          <fieldset className="space-y-3 rounded-lg border border-border bg-white/60 p-3">
            <legend className="px-1 text-xs font-semibold text-accent">
              Earnings per share
            </legend>
            {(
              [
                ['netIncome', 'Net income', 'gn-ni', errors.netIncome],
                [
                  'preferredDividends',
                  'Preferred dividends',
                  'gn-pref-div',
                  errors.preferredDividends,
                ],
                [
                  'weightedShares',
                  'Weighted average common shares',
                  'gn-wshares',
                  errors.weightedShares,
                ],
              ] as const
            ).map(([key, label, id, err]) => (
              <div key={key}>
                <label htmlFor={id} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={err}>
                  {key !== 'weightedShares' ? (
                    <span
                      className="pl-3 text-sm text-muted-foreground"
                      aria-hidden
                    >
                      {symbol}
                    </span>
                  ) : null}
                  <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) =>
                      onChange({ ...input, [key]: e.target.value })
                    }
                    aria-invalid={Boolean(err)}
                  />
                </FieldShell>
                {err ? (
                  <p className="mt-1 text-xs text-rose-600">{err}</p>
                ) : null}
              </div>
            ))}
            <div>
              <label htmlFor="gn-derived-eps" className={labelClass}>
                Calculated EPS
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="gn-derived-eps"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={
                    derivedEps != null && derivedEps > 0
                      ? formatGrahamMoney(derivedEps, input.currency)
                      : ''
                  }
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
              {errors.derivedEps ? (
                <p className="mt-1 text-xs text-rose-600">{errors.derivedEps}</p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={derivedEps == null || derivedEps <= 0}
              onClick={onApplyEps}
            >
              Use calculated EPS
            </Button>
          </fieldset>

          <fieldset className="space-y-3 rounded-lg border border-border bg-white/60 p-3">
            <legend className="px-1 text-xs font-semibold text-accent">
              Book value per share
            </legend>
            {(
              [
                [
                  'totalEquity',
                  "Total shareholders' equity",
                  'gn-equity',
                  errors.totalEquity,
                ],
                [
                  'preferredEquity',
                  'Preferred equity',
                  'gn-pref-eq',
                  errors.preferredEquity,
                ],
                [
                  'commonShares',
                  'Common shares outstanding',
                  'gn-cshares',
                  errors.commonShares,
                ],
              ] as const
            ).map(([key, label, id, err]) => (
              <div key={key}>
                <label htmlFor={id} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={err}>
                  {key !== 'commonShares' ? (
                    <span
                      className="pl-3 text-sm text-muted-foreground"
                      aria-hidden
                    >
                      {symbol}
                    </span>
                  ) : null}
                  <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) =>
                      onChange({ ...input, [key]: e.target.value })
                    }
                    aria-invalid={Boolean(err)}
                  />
                </FieldShell>
                {err ? (
                  <p className="mt-1 text-xs text-rose-600">{err}</p>
                ) : null}
              </div>
            ))}
            <div>
              <label htmlFor="gn-derived-bvps" className={labelClass}>
                Calculated BVPS
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="gn-derived-bvps"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={
                    derivedBvps != null && derivedBvps > 0
                      ? formatGrahamMoney(derivedBvps, input.currency)
                      : ''
                  }
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
              {errors.derivedBvps ? (
                <p className="mt-1 text-xs text-rose-600">{errors.derivedBvps}</p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={derivedBvps == null || derivedBvps <= 0}
              onClick={onApplyBvps}
            >
              Use calculated BVPS
            </Button>
          </fieldset>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
