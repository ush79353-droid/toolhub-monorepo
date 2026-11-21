'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatIvMoney } from './calculation';
import type {
  IntrinsicValueFieldErrors,
  IntrinsicValueInput,
  IntrinsicValueResult,
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

interface IntrinsicValueFormProps {
  input: IntrinsicValueInput;
  errors: IntrinsicValueFieldErrors;
  result: IntrinsicValueResult | null;
  onChange: (input: IntrinsicValueInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function IntrinsicValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: IntrinsicValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        V = EPS × (8.5 + 2g) × 4.4 ÷ Y. Enter growth and bond yield as
        percentage points (6 means 6%, 4.4 means 4.4%).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="iv-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for intrinsic value amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 All money fields share one currency and scale (denomination only; no
        FX). Bond yield is your input, not a live market rate.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate the intrinsic value of a stock
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Valuation inputs
        </legend>

        <div>
          <label htmlFor="iv-eps" className={labelClass}>
            Earnings per share (EPS)
            <InfoTooltip
              label="Earnings per share"
              text="The company's earnings attributable to each outstanding common share."
            />
          </label>
          <FieldShell error={errors.earningsPerShare}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="iv-eps"
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
          <label htmlFor="iv-g" className={labelClass}>
            Expected annual growth rate (g)
            <InfoTooltip
              label="Expected growth rate"
              text="The expected annual percentage growth rate of earnings used in the valuation model."
            />
          </label>
          <FieldShell error={errors.expectedGrowthRate}>
            <input
              id="iv-g"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.expectedGrowthRate}
              onChange={(e) =>
                onChange({ ...input, expectedGrowthRate: e.target.value })
              }
              placeholder="6"
              aria-invalid={Boolean(errors.expectedGrowthRate)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.expectedGrowthRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.expectedGrowthRate}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="iv-y" className={labelClass}>
            Corporate bond yield (Y)
            <InfoTooltip
              label="Corporate bond yield"
              text="The current high-grade corporate bond yield, expressed as a percentage, used to adjust the Graham valuation."
            />
          </label>
          <FieldShell error={errors.corporateBondYield}>
            <input
              id="iv-y"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.corporateBondYield}
              onChange={(e) =>
                onChange({ ...input, corporateBondYield: e.target.value })
              }
              placeholder="4.4"
              aria-invalid={Boolean(errors.corporateBondYield)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.corporateBondYield ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.corporateBondYield}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="iv-cmp" className={labelClass}>
            Current market price (CMP)
            <InfoTooltip
              label="Current market price"
              text="The current market price of one share, used to compare market price with estimated intrinsic value."
            />
          </label>
          <FieldShell error={errors.currentMarketPrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="iv-cmp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentMarketPrice}
              onChange={(e) =>
                onChange({ ...input, currentMarketPrice: e.target.value })
              }
              placeholder="80"
              aria-invalid={Boolean(errors.currentMarketPrice)}
            />
          </FieldShell>
          {errors.currentMarketPrice ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.currentMarketPrice}
            </p>
          ) : null}
          <p className="mt-1 text-[11px] text-muted-foreground">
            Optional for intrinsic value; required for margin of safety.
          </p>
        </div>

        <div>
          <label htmlFor="iv-v" className={labelClass}>
            Intrinsic value per share (V)
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="iv-v"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatIvMoney(result.intrinsicValue, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result
                  ? `Intrinsic value ${result.formattedIntrinsicValue}`
                  : 'Intrinsic value unavailable'
              }
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="iv-ms" className={labelClass}>
            Margin of safety (MS)
          </label>
          <FieldShell muted>
            <input
              id="iv-ms"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-medium text-accent`}
              value={
                result?.formattedMarginOfSafety
                  ? result.formattedMarginOfSafety.replace(/%$/, '')
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result?.formattedMarginOfSafety
                  ? `Margin of safety ${result.formattedMarginOfSafety}`
                  : 'Margin of safety unavailable'
              }
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          <p className="mt-1 text-[11px] text-muted-foreground">
            MS = (V − CMP) ÷ V × 100. Positive means price is below estimated
            intrinsic value.
          </p>
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
