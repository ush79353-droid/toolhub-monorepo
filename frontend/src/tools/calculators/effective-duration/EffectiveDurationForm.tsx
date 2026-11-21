'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BOND_FREQUENCY_OPTIONS,
  type BondCouponFrequency,
  type EffectiveDurationFieldErrors,
  type EffectiveDurationInput,
  type EffectiveDurationMode,
  type EffectiveDurationResult,
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

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        {title}
        <span className="font-normal text-muted-foreground">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface EffectiveDurationFormProps {
  input: EffectiveDurationInput;
  errors: EffectiveDurationFieldErrors;
  result: EffectiveDurationResult | null;
  onChange: (input: EffectiveDurationInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function EffectiveDurationForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: EffectiveDurationFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EffectiveDurationInput>) =>
    onChange({ ...input, ...patch });
  const [openCoupon, setOpenCoupon] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openDur, setOpenDur] = useState(true);
  const standard = input.mode === 'standard';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        D<sub>eff</sub> = (P− − P+) / (2 × P₀ × Δy). Standard mode reprices
        fixed contractual cash flows (option-free estimate). Scenario mode uses
        external prices for option-aware effective duration. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ed-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div
        role="tablist"
        aria-label="Calculation mode"
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/30 p-1"
      >
        {(
          [
            ['standard', 'Standard Bond'],
            ['scenario', 'Scenario-Based'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={input.mode === id}
            className={`h-10 rounded-md text-xs font-semibold transition-colors ${
              input.mode === id
                ? 'bg-white text-accent shadow-sm'
                : 'text-muted-foreground hover:text-accent'
            }`}
            onClick={() => set({ mode: id as EffectiveDurationMode })}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($10,000 · 8% · 3y → ≈2.58 years)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {standard ? (
        <>
          <Section
            title="Coupon per Period"
            open={openCoupon}
            onToggle={() => setOpenCoupon((v) => !v)}
          >
            <div>
              <label htmlFor="ed-face" className={labelClass}>
                Face Value
                <InfoTooltip
                  label="Face Value"
                  text="The principal amount of the bond that the issuer is expected to repay at maturity, subject to the bond's contractual terms and credit risk."
                />
              </label>
              <FieldShell error={errors.faceValue}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ed-face"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.faceValue}
                  onChange={(e) => set({ faceValue: e.target.value })}
                  placeholder="10000"
                />
              </FieldShell>
              {errors.faceValue ? (
                <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ed-coupon" className={labelClass}>
                Annual Coupon Rate
                <InfoTooltip
                  label="Annual Coupon Rate"
                  text="The annual coupon payment expressed as a percentage of the bond's face value. Zero-coupon bonds are allowed."
                />
              </label>
              <FieldShell error={errors.annualCouponRatePercent}>
                <input
                  id="ed-coupon"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualCouponRatePercent}
                  onChange={(e) =>
                    set({ annualCouponRatePercent: e.target.value })
                  }
                  placeholder="8"
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
              <label htmlFor="ed-freq" className={labelClass}>
                Coupon Frequency
              </label>
              <select
                id="ed-freq"
                className={selectClass}
                value={input.frequency}
                onChange={(e) =>
                  set({
                    frequency: e.target.value as BondCouponFrequency,
                  })
                }
              >
                {BOND_FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.frequency ? (
                <p className="mt-1 text-xs text-rose-600">{errors.frequency}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ed-cp" className={labelClass}>
                Coupon per Period
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ed-cp"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.mode === 'standard'
                      ? String(result.couponPerPeriod)
                      : ''
                  }
                  placeholder="—"
                />
              </FieldShell>
            </div>

            <div>
              <label htmlFor="ed-ca" className={labelClass}>
                Annual Coupon
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ed-ca"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.mode === 'standard'
                      ? String(result.annualCoupon)
                      : ''
                  }
                  placeholder="—"
                />
              </FieldShell>
            </div>
          </Section>

          <Section
            title="Bond Price"
            open={openPrice}
            onToggle={() => setOpenPrice((v) => !v)}
          >
            <div>
              <label htmlFor="ed-years" className={labelClass}>
                Years to Maturity
                <InfoTooltip
                  label="Years to Maturity"
                  text="The remaining time until the bond's contractual maturity date. Maturity × coupon frequency must be a whole number of periods."
                />
              </label>
              <FieldShell error={errors.yearsToMaturity}>
                <input
                  id="ed-years"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.yearsToMaturity}
                  onChange={(e) => set({ yearsToMaturity: e.target.value })}
                  placeholder="3"
                />
                <span className="pr-3 text-sm text-muted-foreground">years</span>
              </FieldShell>
              {errors.yearsToMaturity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.yearsToMaturity}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ed-ytm" className={labelClass}>
                Yield to Maturity (YTM)
                <InfoTooltip
                  label="Yield to Maturity (YTM)"
                  text="The annualized yield used to discount the bond's remaining contractual coupon payments and principal."
                />
              </label>
              <FieldShell error={errors.yieldToMaturityPercent}>
                <input
                  id="ed-ytm"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.yieldToMaturityPercent}
                  onChange={(e) =>
                    set({ yieldToMaturityPercent: e.target.value })
                  }
                  placeholder="8"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.yieldToMaturityPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.yieldToMaturityPercent}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ed-p0" className={labelClass}>
                Bond Price
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ed-p0"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.mode === 'standard' ? String(result.basePrice) : ''
                  }
                  placeholder="—"
                />
              </FieldShell>
            </div>
          </Section>
        </>
      ) : (
        <div className="space-y-3 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            Enter scenario prices from a consistent valuation model. For
            option-embedded bonds, prices must reflect yield-dependent cash
            flows.
          </p>
          <div>
            <label htmlFor="ed-s-p0" className={labelClass}>
              Initial bond price (P₀)
            </label>
            <FieldShell error={errors.basePrice}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ed-s-p0"
                className={inputClass}
                inputMode="decimal"
                value={input.basePrice}
                onChange={(e) => set({ basePrice: e.target.value })}
                placeholder="1000"
              />
            </FieldShell>
            {errors.basePrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.basePrice}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ed-s-pd" className={labelClass}>
              Price after yield decrease (P−)
            </label>
            <FieldShell error={errors.priceYieldDown}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ed-s-pd"
                className={inputClass}
                inputMode="decimal"
                value={input.priceYieldDown}
                onChange={(e) => set({ priceYieldDown: e.target.value })}
                placeholder="1050"
              />
            </FieldShell>
            {errors.priceYieldDown ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.priceYieldDown}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ed-s-pu" className={labelClass}>
              Price after yield increase (P+)
            </label>
            <FieldShell error={errors.priceYieldUp}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ed-s-pu"
                className={inputClass}
                inputMode="decimal"
                value={input.priceYieldUp}
                onChange={(e) => set({ priceYieldUp: e.target.value })}
                placeholder="950"
              />
            </FieldShell>
            {errors.priceYieldUp ? (
              <p className="mt-1 text-xs text-rose-600">{errors.priceYieldUp}</p>
            ) : null}
          </div>
        </div>
      )}

      <Section
        title="Effective Duration"
        open={openDur}
        onToggle={() => setOpenDur((v) => !v)}
      >
        <div>
          <label htmlFor="ed-dy" className={labelClass}>
            Yield Differential
            <InfoTooltip
              label="Yield Differential"
              text="The change in annualized yield used to reprice the bond upward and downward. A value of 1% means a one-percentage-point shift (100 basis points)."
            />
          </label>
          <FieldShell error={errors.yieldDifferentialPercent}>
            <input
              id="ed-dy"
              className={inputClass}
              inputMode="decimal"
              value={input.yieldDifferentialPercent}
              onChange={(e) =>
                set({ yieldDifferentialPercent: e.target.value })
              }
              placeholder="1"
            />
            <span className="pr-3 text-sm text-muted-foreground">pp %</span>
          </FieldShell>
          {errors.yieldDifferentialPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.yieldDifferentialPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ed-out" className={labelClass}>
            Effective Duration
          </label>
          <FieldShell muted>
            <input
              id="ed-out"
              className={inputClass}
              readOnly
              aria-readonly
              value={result ? String(result.effectiveDuration) : ''}
              placeholder="—"
            />
            <span className="pr-3 text-sm text-muted-foreground">years</span>
          </FieldShell>
        </div>
      </Section>
    </form>
  );
}
