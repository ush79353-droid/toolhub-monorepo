'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { financingCents } from './calculation';
import {
  ADJUSTMENT_METHODS,
  ARM_STRUCTURES,
  COMPOUNDING_FREQUENCIES,
  structureTiming,
  type ArmMortgageInput,
  type BalanceMode,
  type CompoundingFrequency,
  type DownPaymentMode,
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

function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-8 shrink-0 items-center rounded-lg border border-border bg-muted/40 p-0.5"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-full rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ArmMortgageForm({ input, errors, onChange, onSubmit, onReset }: ArmMortgageFormProps) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const set = (patch: Partial<ArmMortgageInput>) => onChange({ ...input, ...patch });
  const financed = financingCents(input);
  const timing = structureTiming(input);
  const symbol = getCurrencySymbol(input.currency);

  const switchDown = (mode: DownPaymentMode) => {
    if (mode === input.downPaymentMode) return;
    const price = input.homePrice;
    if (!(price > 0) || !Number.isFinite(input.downPayment)) {
      set({ downPaymentMode: mode });
      return;
    }
    if (mode === 'percent') {
      set({
        downPaymentMode: mode,
        downPayment: Math.round((input.downPayment / price) * 10000) / 100,
      });
      return;
    }
    set({
      downPaymentMode: mode,
      downPayment: Math.round(price * input.downPayment) / 100,
    });
  };

  const switchBalanceMode = (mode: BalanceMode) => {
    if (mode === input.balanceMode) return;
    if (mode === 'balance') {
      const balance = financed.principalCents > 0 ? financed.principalCents / 100 : input.homePrice || 250000;
      set({ balanceMode: mode, mortgageBalance: balance });
    } else {
      const price = input.mortgageBalance || 250000;
      set({ balanceMode: mode, homePrice: price, downPayment: 0, downPaymentMode: 'amount' });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 p-2">
        <span className="text-xs font-medium text-accent">Loan entry mode:</span>
        <SegmentedToggle
          label="Loan entry mode"
          value={input.balanceMode}
          options={[
            { value: 'balance', label: 'Mortgage Balance' },
            { value: 'home-price', label: 'Home Price & Down Payment' },
          ]}
          onChange={switchBalanceMode}
        />
      </div>

      {input.balanceMode === 'balance' ? (
        <div>
          <FieldLabel
            htmlFor="arm-balance"
            label="Mortgage balance"
            tip="Total mortgage amount borrowed to be amortized over the loan term."
          />
          <div className="relative">
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
          {errors.mortgageBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageBalance}</p>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="arm-price"
              label="Home price"
              tip="Purchase price before the down payment. The loan amount is this price minus the down payment."
            />
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="arm-price"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.homePrice}
                aria-invalid={Boolean(errors.homePrice)}
                onChange={(e) => set({ homePrice: Number(e.target.value) })}
              />
            </div>
            {errors.homePrice ? <p className="mt-1 text-xs text-rose-600">{errors.homePrice}</p> : null}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <FieldLabel
                htmlFor="arm-down"
                label="Down payment"
                tip="Cash paid upfront. Switch between currency amount and percent of the home price."
                className="mb-0"
              />
              <SegmentedToggle
                label="Down payment mode"
                value={input.downPaymentMode}
                options={[
                  { value: 'amount', label: symbol },
                  { value: 'percent', label: '%' },
                ]}
                onChange={switchDown}
              />
            </div>
            <input
              id="arm-down"
              className={inputClass}
              inputMode="decimal"
              value={input.downPayment}
              aria-invalid={Boolean(errors.downPayment)}
              onChange={(e) => set({ downPayment: Number(e.target.value) })}
            />
            {errors.downPayment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Loan balance: {financed.principalCents > 0 ? formatCurrencyValue(financed.principalCents / 100, input.currency) : '—'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="arm-term"
            label="Mortgage term (years)"
            tip="Full repayment term. Common choices are 15, 20, and 30 years."
          />
          <input
            id="arm-term"
            className={inputClass}
            type="number"
            min={1}
            max={40}
            value={input.termYears}
            aria-invalid={Boolean(errors.termYears)}
            onChange={(e) => set({ termYears: Number(e.target.value) })}
          />
          {errors.termYears ? <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p> : null}
        </div>
        <div>
          <FieldLabel
            htmlFor="arm-rate"
            label="Initial interest rate (%)"
            tip="The introductory note rate used during the initial fixed period."
          />
          <input
            id="arm-rate"
            className={inputClass}
            inputMode="decimal"
            value={input.initialAnnualRate}
            aria-invalid={Boolean(errors.initialAnnualRate)}
            onChange={(e) => set({ initialAnnualRate: Number(e.target.value) })}
          />
          {errors.initialAnnualRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialAnnualRate}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div className={input.adjustmentMethod === 'expected-rate' ? '' : 'min-[420px]:col-span-2'}>
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

        {input.adjustmentMethod === 'expected-rate' ? (
          <div>
            <FieldLabel
              htmlFor="arm-expected-adj"
              label="Expected adjustment (%)"
              tip="Expected rate increase at each adjustment period after the fixed introductory term (e.g. 0.5% per reset)."
            />
            <input
              id="arm-expected-adj"
              className={inputClass}
              inputMode="decimal"
              value={input.expectedAdjustment}
              aria-invalid={Boolean(errors.expectedAdjustment)}
              onChange={(e) => set({ expectedAdjustment: Number(e.target.value) })}
            />
            {errors.expectedAdjustment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.expectedAdjustment}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {input.adjustmentMethod === 'expected-rate' ? (
        <div>
          <FieldLabel
            htmlFor="arm-rate-cap"
            label="Interest rate cap (%)"
            tip="Absolute maximum interest rate cap for this mortgage. The rate cannot adjust higher than this ceiling."
          />
          <input
            id="arm-rate-cap"
            className={inputClass}
            inputMode="decimal"
            value={input.rateCap}
            aria-invalid={Boolean(errors.rateCap)}
            onChange={(e) => set({ rateCap: Number(e.target.value) })}
          />
          {errors.rateCap ? <p className="mt-1 text-xs text-rose-600">{errors.rateCap}</p> : null}
        </div>
      ) : null}

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

      {/* Advanced Settings Drawer */}
      <div className="rounded-xl border border-border bg-background/50">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent hover:bg-muted/30"
          onClick={() => setAdvancedOpen((open) => !open)}
          aria-expanded={advancedOpen}
        >
          <span>Advanced settings & fees</span>
          <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            {advancedOpen ? 'Hide' : 'Configure method, caps, fees, compounding'}
            {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {advancedOpen ? (
          <div className="space-y-4 border-t border-border p-3.5">
            <div>
              <FieldLabel
                htmlFor="arm-adjustment-method"
                label="Adjustment configuration method"
                tip="Choose whether to enter a simple expected rate adjustment or model index + margin."
              />
              <select
                id="arm-adjustment-method"
                className={inputClass}
                value={input.adjustmentMethod}
                onChange={(e) => set({ adjustmentMethod: e.target.value as ArmMortgageInput['adjustmentMethod'] })}
              >
                {ADJUSTMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m === 'expected-rate' ? 'Manual expected rate adjustment (Reference)' : 'Index + margin scenario analysis'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
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
                  label={`Upfront fees & costs (${symbol})`}
                  tip="Closing costs, origination fees or points. Factored into APR finance charges and total additional costs."
                />
                <input
                  id="arm-upfront-fees"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.upfrontFees}
                  aria-invalid={Boolean(errors.upfrontFees)}
                  onChange={(e) => set({ upfrontFees: Number(e.target.value) })}
                />
                {errors.upfrontFees ? <p className="mt-1 text-xs text-rose-600">{errors.upfrontFees}</p> : null}
              </div>
            </div>

            {input.adjustmentMethod === 'expected-rate' ? (
              <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                <div>
                  <FieldLabel
                    htmlFor="arm-periodic-cap"
                    label="Periodic rate cap (%)"
                    tip="Maximum percentage point change permitted in any single adjustment period."
                  />
                  <input
                    id="arm-periodic-cap"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.periodicCap}
                    aria-invalid={Boolean(errors.periodicCap)}
                    onChange={(e) => set({ periodicCap: Number(e.target.value) })}
                  />
                  {errors.periodicCap ? <p className="mt-1 text-xs text-rose-600">{errors.periodicCap}</p> : null}
                </div>
                <div>
                  <FieldLabel
                    htmlFor="arm-rate-floor"
                    label="Interest rate floor (%)"
                    tip="Contractual minimum interest rate floor."
                  />
                  <input
                    id="arm-rate-floor"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.rateFloor}
                    aria-invalid={Boolean(errors.rateFloor)}
                    onChange={(e) => set({ rateFloor: Number(e.target.value) })}
                  />
                  {errors.rateFloor ? <p className="mt-1 text-xs text-rose-600">{errors.rateFloor}</p> : null}
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 rounded-lg border border-border bg-white p-3">
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
                  <div>
                    <FieldLabel
                      htmlFor="arm-scenario"
                      label="Later-rate assumption"
                      tip="Assumption path after first reset."
                    />
                    <select
                      id="arm-scenario"
                      className={inputClass}
                      value={input.scenario}
                      onChange={(e) => set({ scenario: e.target.value as ArmMortgageInput['scenario'] })}
                    >
                      <option value="constant">Hold index + margin</option>
                      <option value="rising">Rise by a fixed step</option>
                      <option value="falling">Fall by a fixed step</option>
                    </select>
                  </div>
                  {input.scenario !== 'constant' ? (
                    <div>
                      <FieldLabel
                        htmlFor="arm-step"
                        label="Step per later reset (pp)"
                        tip="Percentage points change per subsequent reset."
                      />
                      <input
                        id="arm-step"
                        className={inputClass}
                        inputMode="decimal"
                        value={input.scenarioStepPercent}
                        aria-invalid={Boolean(errors.scenarioStepPercent)}
                        onChange={(e) => set({ scenarioStepPercent: Number(e.target.value) })}
                      />
                      {errors.scenarioStepPercent ? (
                        <p className="mt-1 text-xs text-rose-600">{errors.scenarioStepPercent}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                  {(
                    [
                      ['initialCap', 'Initial adjustment cap (pp)', 'Max rate change at first reset.'],
                      ['subsequentCap', 'Later adjustment cap (pp)', 'Max rate change at each reset after the first.'],
                      ['lifetimeIncreaseCap', 'Lifetime increase cap (pp)', 'Max rise above initial rate.'],
                      ['lifetimeDecreaseCap', 'Lifetime decrease cap (pp)', 'Max fall below initial rate.'],
                    ] as const
                  ).map(([key, label, tip]) => (
                    <div key={key}>
                      <FieldLabel htmlFor={`arm-${key}`} label={label} tip={tip} />
                      <input
                        id={`arm-${key}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={input[key]}
                        aria-invalid={Boolean(errors[key])}
                        onChange={(e) => set({ [key]: Number(e.target.value) })}
                      />
                      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <FieldLabel
                htmlFor="arm-start"
                label="First payment date"
                tip="Date of the first monthly payment."
              />
              <input
                id="arm-start"
                type="date"
                className={`${inputClass} block`}
                value={input.startDate}
                aria-invalid={Boolean(errors.startDate)}
                onChange={(e) => set({ startDate: e.target.value })}
              />
              {errors.startDate ? <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p> : null}
            </div>

            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs font-semibold text-accent">Optional monthly housing costs</p>
              <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                {(
                  [
                    ['propertyTaxMonthly', 'Property tax / month', 'Monthly property tax escrow.'],
                    ['insuranceMonthly', 'Insurance / month', 'Homeowners insurance estimate.'],
                    ['hoaMonthly', 'HOA / month', 'Homeowner association dues.'],
                    ['mortgageInsuranceMonthly', 'PMI / month', 'Private mortgage insurance.'],
                  ] as const
                ).map(([key, label, tip]) => (
                  <div key={key}>
                    <FieldLabel htmlFor={`arm-${key}`} label={label} tip={tip} />
                    <input
                      id={`arm-${key}`}
                      className={inputClass}
                      inputMode="decimal"
                      value={input[key]}
                      aria-invalid={Boolean(errors[key])}
                      onChange={(e) => set({ [key]: Number(e.target.value) })}
                    />
                    {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

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
