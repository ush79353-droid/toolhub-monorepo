'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ARM_STRUCTURES,
  COMPOUNDING_FREQUENCIES,
  structureTiming,
  type ArmMortgageInput,
  type CompoundingFrequency,
} from './types';

interface ArmMortgageFormProps {
  input: ArmMortgageInput;
  errors: Record<string, string>;
  onChange: (input: ArmMortgageInput) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
  align = 'left',
  className = 'mb-1.5',
}: {
  htmlFor: string;
  label: string;
  tip: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align={align} />
    </div>
  );
}

export function ArmMortgageForm({ input, errors, onChange, onSubmit, onReset }: ArmMortgageFormProps) {
  const [showCompoundingAndFees, setShowCompoundingAndFees] = React.useState(
    input.compounding !== 'monthly' || input.upfrontFees > 0
  );

  const set = (patch: Partial<ArmMortgageInput>) => onChange({ ...input, ...patch });
  const timing = structureTiming(input);
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      {/* 1. Mortgage Balance with Currency Selection */}
      <div>
        <FieldLabel
          htmlFor="arm-balance"
          label="Mortgage balance"
          tip="Total mortgage amount borrowed to be amortized over the loan term."
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="arm-balance"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.mortgageBalance}
              aria-invalid={Boolean(errors.mortgageBalance)}
              onChange={(e) => set({ mortgageBalance: Number(e.target.value) })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="arm-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.mortgageBalance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.mortgageBalance}</p>
        ) : null}
      </div>

      {/* 2 & 3. Term and Initial Interest Rate */}
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="arm-term"
            label="Term"
            tip="Full mortgage repayment term in years. Default is 20 years."
          />
          <div className="relative">
            <input
              id="arm-term"
              className={`${inputClass} pr-14`}
              type="number"
              min={1}
              max={40}
              value={input.termYears}
              aria-invalid={Boolean(errors.termYears)}
              onChange={(e) => set({ termYears: Number(e.target.value) })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-normal text-muted-foreground">
              years
            </span>
          </div>
          {errors.termYears ? <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p> : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="arm-rate"
            label="Interest rate at beginning of term"
            tip="The introductory interest rate fixed during the first period of the mortgage."
          />
          <div className="relative">
            <input
              id="arm-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.initialAnnualRate}
              aria-invalid={Boolean(errors.initialAnnualRate)}
              onChange={(e) => set({ initialAnnualRate: Number(e.target.value) })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.initialAnnualRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialAnnualRate}</p>
          ) : null}
        </div>
      </div>

      {/* 4. Optional Checkbox: Adjust Compounding and Fees */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-accent">
          <input
            type="checkbox"
            checked={showCompoundingAndFees}
            onChange={(e) => {
              const checked = e.target.checked;
              setShowCompoundingAndFees(checked);
              if (!checked) {
                set({ compounding: 'monthly', upfrontFees: 0 });
              }
            }}
            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          />
          <span>Adjust compounding and fees</span>
        </label>

        {showCompoundingAndFees ? (
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 min-[420px]:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="arm-compounding"
                label="Compounding frequency"
                tip="Compounding standard. Monthly is US standard; Semi-Annual is Canadian standard."
              />
              <select
                id="arm-compounding"
                className={inputClass}
                value={input.compounding}
                onChange={(e) => set({ compounding: e.target.value as CompoundingFrequency })}
              >
                {COMPOUNDING_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f === 'monthly' ? 'Monthly (US standard)' : f === 'semi-annual' ? 'Semi-Annual (Canadian)' : 'Annual'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel
                htmlFor="arm-upfront-fees"
                label={`Upfront fees (${symbol})`}
                tip="Closing costs, loan origination points or upfront finance charges."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="arm-upfront-fees"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={input.upfrontFees}
                  aria-invalid={Boolean(errors.upfrontFees)}
                  onChange={(e) => set({ upfrontFees: Number(e.target.value) })}
                />
              </div>
              {errors.upfrontFees ? <p className="mt-1 text-xs text-rose-600">{errors.upfrontFees}</p> : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* 5. ARM Type */}
      <div>
        <FieldLabel
          htmlFor="arm-structure"
          label="ARM type"
          tip="The introductory fixed period in years, followed by the adjustment frequency. 10/1 ARM means 10 years fixed, then adjusting every 1 year."
        />
        <select
          id="arm-structure"
          className={inputClass}
          value={input.structure}
          aria-invalid={Boolean(errors.structure)}
          onChange={(e) => set({ structure: e.target.value as ArmMortgageInput['structure'] })}
        >
          {ARM_STRUCTURES.map((id) => (
            <option key={id} value={id}>
              {id === 'custom' ? 'Custom structure' : `${id} ARM`}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {timing.fixedMonths / 12} years ({timing.fixedMonths} mos) fixed, then resets every {timing.adjustEveryMonths} mos.
        </p>
        {errors.structure ? <p className="mt-1 text-xs text-rose-600">{errors.structure}</p> : null}
      </div>

      {/* Custom structure fields if selected */}
      {input.structure === 'custom' ? (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="arm-fixed-years"
              label="Initial fixed period (years)"
              tip="Whole years the initial rate stays in place."
            />
            <input
              id="arm-fixed-years"
              className={inputClass}
              type="number"
              min={0}
              max={40}
              value={input.customFixedYears}
              aria-invalid={Boolean(errors.customFixedYears)}
              onChange={(e) => set({ customFixedYears: Number(e.target.value) })}
            />
            {errors.customFixedYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.customFixedYears}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel
              htmlFor="arm-every"
              label="Adjustment frequency (months)"
              tip="Months between rate adjustments after the fixed period."
            />
            <input
              id="arm-every"
              className={inputClass}
              type="number"
              min={1}
              max={120}
              value={input.customAdjustMonths}
              aria-invalid={Boolean(errors.customAdjustMonths)}
              onChange={(e) => set({ customAdjustMonths: Number(e.target.value) })}
            />
            {errors.customAdjustMonths ? (
              <p className="mt-1 text-xs text-rose-600">{errors.customAdjustMonths}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 6. Adjustments by */}
      <div>
        <FieldLabel
          htmlFor="arm-adjustment-method"
          label="Adjustments by"
          tip="Select 'Manual setup' for straightforward expected rate adjustment and cap, or 'Index and margin' for benchmark modeling."
        />
        <select
          id="arm-adjustment-method"
          className={inputClass}
          value={input.adjustmentMethod}
          onChange={(e) => set({ adjustmentMethod: e.target.value as ArmMortgageInput['adjustmentMethod'] })}
        >
          <option value="expected-rate">Manual setup</option>
          <option value="index-margin">Index and margin</option>
        </select>
      </div>

      {/* 7 & 8. Expected adjustment and Interest rate cap (when Manual setup) */}
      {input.adjustmentMethod === 'expected-rate' ? (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="arm-expected-adj"
              label="Expected adjustment"
              tip="Expected rate increase at each adjustment period after the fixed introductory term (e.g. 0.5% per reset)."
            />
            <div className="relative">
              <input
                id="arm-expected-adj"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.expectedAdjustment}
                aria-invalid={Boolean(errors.expectedAdjustment)}
                onChange={(e) => set({ expectedAdjustment: Number(e.target.value) })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                %
              </span>
            </div>
            {errors.expectedAdjustment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.expectedAdjustment}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="arm-rate-cap"
              label="Interest rate cap"
              tip="Absolute maximum interest rate cap for this mortgage. The rate cannot adjust higher than this ceiling."
            />
            <div className="relative">
              <input
                id="arm-rate-cap"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.rateCap}
                aria-invalid={Boolean(errors.rateCap)}
                onChange={(e) => set({ rateCap: Number(e.target.value) })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                %
              </span>
            </div>
            {errors.rateCap ? <p className="mt-1 text-xs text-rose-600">{errors.rateCap}</p> : null}
          </div>
        </div>
      ) : (
        /* Index and Margin settings (only when Index and Margin is chosen) */
        <div className="space-y-3.5 rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold text-accent">Index & margin parameters</p>
          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="arm-index"
                label="Expected index rate (%)"
                tip="The benchmark index value assumed at reset."
              />
              <input
                id="arm-index"
                className={inputClass}
                inputMode="decimal"
                value={input.indexRate}
                aria-invalid={Boolean(errors.indexRate)}
                onChange={(e) => set({ indexRate: Number(e.target.value) })}
              />
              {errors.indexRate ? <p className="mt-1 text-xs text-rose-600">{errors.indexRate}</p> : null}
            </div>
            <div>
              <FieldLabel
                htmlFor="arm-margin"
                label="Lender margin (%)"
                tip="Percentage points added to the index."
              />
              <input
                id="arm-margin"
                className={inputClass}
                inputMode="decimal"
                value={input.margin}
                aria-invalid={Boolean(errors.margin)}
                onChange={(e) => set({ margin: Number(e.target.value) })}
              />
              {errors.margin ? <p className="mt-1 text-xs text-rose-600">{errors.margin}</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="arm-initial-cap"
                label="Initial cap (pp)"
                tip="Max rate change at first reset."
              />
              <input
                id="arm-initial-cap"
                className={inputClass}
                inputMode="decimal"
                value={input.initialCap}
                aria-invalid={Boolean(errors.initialCap)}
                onChange={(e) => set({ initialCap: Number(e.target.value) })}
              />
              {errors.initialCap ? <p className="mt-1 text-xs text-rose-600">{errors.initialCap}</p> : null}
            </div>
            <div>
              <FieldLabel
                htmlFor="arm-lifetime-cap"
                label="Lifetime increase cap (pp)"
                tip="Max rise above initial rate."
              />
              <input
                id="arm-lifetime-cap"
                className={inputClass}
                inputMode="decimal"
                value={input.lifetimeIncreaseCap}
                aria-invalid={Boolean(errors.lifetimeIncreaseCap)}
                onChange={(e) => set({ lifetimeIncreaseCap: Number(e.target.value) })}
              />
              {errors.lifetimeIncreaseCap ? (
                <p className="mt-1 text-xs text-rose-600">{errors.lifetimeIncreaseCap}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
