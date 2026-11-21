'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COUPON_FREQUENCY_OPTIONS,
  type CouponFrequency,
  type YieldToMaturityFieldErrors,
  type YieldToMaturityInput,
  type YieldToMaturityResult,
  type YieldToMaturitySolveTarget,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOLVE_LABELS: Record<YieldToMaturitySolveTarget, string> = {
  ytm: 'Yield to maturity (YTM)',
  bondPrice: 'Bond price',
  faceValue: 'Face value',
  couponRate: 'Annual coupon rate',
};

interface YieldToMaturityFormProps {
  input: YieldToMaturityInput;
  errors: YieldToMaturityFieldErrors;
  result: YieldToMaturityResult | null;
  onChange: (input: YieldToMaturityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function YieldToMaturityForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: YieldToMaturityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<YieldToMaturityInput>) =>
    onChange({ ...input, ...patch });
  const solving = input.solveTarget;

  const faceDisplay =
    solving === 'faceValue'
      ? (result?.faceValue.toLocaleString('en-US', {
          maximumFractionDigits: 6,
        }) ?? '')
      : input.faceValue;
  const priceDisplay =
    solving === 'bondPrice'
      ? (result?.bondPrice.toLocaleString('en-US', {
          maximumFractionDigits: 6,
        }) ?? '')
      : input.bondPrice;
  const couponDisplay =
    solving === 'couponRate'
      ? (result?.formattedCouponRate.replace(/%$/, '') ?? '')
      : input.annualCouponRatePercent;
  const ytmDisplay =
    solving === 'ytm'
      ? (result?.formattedYtm.replace(/%$/, '') ?? '')
      : input.yieldToMaturityPercent;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Yield to maturity is the discount rate that equates the bond&apos;s
        price with the present value of remaining coupons and principal. Solved
        numerically (bisection); not the simplified approximate YTM formula.
        Currency is denomination only (not FX). Years × frequency must be a
        whole number of coupon periods.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ytm-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="ytm-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="ytm-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as YieldToMaturitySolveTarget,
            })
          }
        >
          {(Object.keys(SOLVE_LABELS) as YieldToMaturitySolveTarget[]).map(
            (t) => (
              <option key={t} value={t}>
                {SOLVE_LABELS[t]}
              </option>
            ),
          )}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($1,000 face · $950 price · 5% · annual · 10y → ≈5.67%)
      </button>

      <div>
        <label htmlFor="ytm-face" className={labelClass}>
          Face Value
          <InfoTooltip
            label="Face Value"
            text="The principal amount the bond issuer promises to repay at maturity, assuming the issuer meets its obligations."
          />
        </label>
        <FieldShell error={errors.faceValue} muted={solving === 'faceValue'}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="ytm-face"
            className={inputClass}
            inputMode="decimal"
            value={faceDisplay}
            readOnly={solving === 'faceValue'}
            aria-readonly={solving === 'faceValue'}
            onChange={(e) => set({ faceValue: e.target.value })}
            placeholder="1000"
          />
        </FieldShell>
        {errors.faceValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytm-price" className={labelClass}>
          Bond Price
          <InfoTooltip
            label="Bond Price"
            text="The current purchase price or present value of the bond's remaining cash flows. Market quotes may be clean prices; a full settlement PV generally uses a dirty price including accrued interest."
          />
        </label>
        <FieldShell error={errors.bondPrice} muted={solving === 'bondPrice'}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="ytm-price"
            className={inputClass}
            inputMode="decimal"
            value={priceDisplay}
            readOnly={solving === 'bondPrice'}
            aria-readonly={solving === 'bondPrice'}
            onChange={(e) => set({ bondPrice: e.target.value })}
            placeholder="950"
          />
        </FieldShell>
        {errors.bondPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bondPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytm-coupon" className={labelClass}>
          Annual Coupon Rate
          <InfoTooltip
            label="Annual Coupon Rate"
            text="The annual coupon interest paid by the bond as a percentage of its face value. Periodic coupon = Face × Rate / Frequency."
          />
        </label>
        <FieldShell
          error={errors.annualCouponRatePercent}
          muted={solving === 'couponRate'}
        >
          <input
            id="ytm-coupon"
            className={inputClass}
            inputMode="decimal"
            value={couponDisplay}
            readOnly={solving === 'couponRate'}
            aria-readonly={solving === 'couponRate'}
            onChange={(e) => set({ annualCouponRatePercent: e.target.value })}
            placeholder="5"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.annualCouponRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualCouponRatePercent}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytm-freq" className={labelClass}>
          Coupon Frequency
          <InfoTooltip
            label="Coupon Frequency"
            text="How many coupon payments occur per year. Treated as a mathematical cash-flow convention — not every real bond supports every frequency."
          />
        </label>
        <select
          id="ytm-freq"
          className={selectClass}
          value={input.couponFrequency}
          onChange={(e) =>
            set({
              couponFrequency: Number(e.target.value) as CouponFrequency,
            })
          }
        >
          {COUPON_FREQUENCY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.couponFrequency ? (
          <p className="mt-1 text-xs text-rose-600">{errors.couponFrequency}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytm-years" className={labelClass}>
          Years to Maturity
          <InfoTooltip
            label="Years to Maturity"
            text="The remaining time until the bond's principal is scheduled to be repaid. For this periodic model, years × frequency must be a whole number of coupon periods."
          />
        </label>
        <FieldShell error={errors.yearsToMaturity}>
          <input
            id="ytm-years"
            className={inputClass}
            inputMode="decimal"
            value={input.yearsToMaturity}
            onChange={(e) => set({ yearsToMaturity: e.target.value })}
            placeholder="10"
          />
          <span className="pr-3 text-sm text-muted-foreground">years</span>
        </FieldShell>
        {errors.yearsToMaturity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.yearsToMaturity}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytm-out" className={labelClass}>
          Yield to Maturity (YTM)
          <InfoTooltip
            label="Yield to Maturity (YTM)"
            text="The nominal annual yield compounded according to the selected coupon frequency that equates price with the PV of remaining cash flows."
          />
        </label>
        <FieldShell
          error={errors.yieldToMaturityPercent}
          muted={solving === 'ytm'}
        >
          <input
            id="ytm-out"
            className={inputClass}
            inputMode="decimal"
            value={ytmDisplay}
            readOnly={solving === 'ytm'}
            aria-readonly={solving === 'ytm'}
            onChange={(e) => set({ yieldToMaturityPercent: e.target.value })}
            placeholder="5.67"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.yieldToMaturityPercent ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.yieldToMaturityPercent}
          </p>
        ) : null}
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Reverse solve for years to maturity is not offered: remaining payments
        must stay on the coupon schedule, and fractional periods need a
        settlement-aware cash-flow model.
      </p>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
