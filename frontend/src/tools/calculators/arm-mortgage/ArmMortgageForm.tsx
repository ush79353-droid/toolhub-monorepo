'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { financingCents } from './calculation';
import {
  ARM_STRUCTURES,
  structureTiming,
  type ArmMortgageInput,
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
      className="inline-flex h-7 shrink-0 items-center rounded-lg border border-border bg-background p-0.5"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-full rounded-md px-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
  const [housingOpen, setHousingOpen] = React.useState(false);
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

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="arm-price"
            label="Home price"
            tip="Purchase price before the down payment. The loan amount is this price minus the down payment."
          />
          <input
            id="arm-price"
            className={inputClass}
            inputMode="decimal"
            value={input.homePrice}
            aria-invalid={Boolean(errors.homePrice)}
            onChange={(e) => set({ homePrice: Number(e.target.value) })}
          />
          {errors.homePrice ? <p className="mt-1 text-xs text-rose-600">{errors.homePrice}</p> : null}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <FieldLabel
              htmlFor="arm-down"
              label="Down payment"
              tip="Cash paid upfront. Switch between a currency amount and a percent of the home price. Zero is allowed."
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
              Loan amount {financed.principalCents > 0 ? formatCurrencyValue(financed.principalCents / 100, input.currency) : '—'}
            </p>
          )}
        </div>
        <div>
          <FieldLabel
            htmlFor="arm-term"
            label="Loan term (years)"
            tip="Full repayment term. Resets do not restart this term. Common choices are 15, 20, and 30 years."
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
            tip="The note rate during the fixed period. This is the rate used until the first scheduled reset."
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
        <div>
          <FieldLabel
            htmlFor="arm-structure"
            label="ARM structure"
            tip="The first number is fixed years. A /1 resets every 12 months after that. A /6 resets every 6 months. Custom lets you enter another valid pair."
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
                {id === 'custom' ? 'Custom' : `${id} ARM`}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            {timing.fixedMonths} months fixed, then every {timing.adjustEveryMonths} months.
          </p>
          {errors.structure ? <p className="mt-1 text-xs text-rose-600">{errors.structure}</p> : null}
        </div>
        <div>
          <FieldLabel
            htmlFor="arm-start"
            label="First payment date"
            tip="Date of the first monthly payment. Later dates, including resets and payoff, are counted from here."
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
      </div>

      {input.structure === 'custom' ? (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <FieldLabel
              htmlFor="arm-fixed-years"
              label="Initial fixed period (years)"
              tip="Whole years the initial rate stays in place. Zero means the first payment already uses a reset rate."
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
              label="Rate adjustment frequency (months)"
              tip="How many months pass between resets after the fixed period. A 5/1 ARM uses 12. A 5/6 ARM uses 6."
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

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="arm-index"
            label="Expected index rate (%)"
            tip="The index value you want to assume at the first reset. This is not a live quote and is not a prediction."
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
            tip="Percentage points the note adds to the index. The uncapped target at the first reset is index plus margin."
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
            tip="After the first reset, hold the fully indexed rate, step it up, or step it down. Each path is an assumption you chose."
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
        {input.scenario === 'constant' ? (
          <div className="flex items-end">
            <p className="pb-2 text-xs leading-relaxed text-muted-foreground">
              First reset targets {(input.indexRate + input.margin).toFixed(3)}% before caps. That sum is your assumption, not a forecast.
            </p>
          </div>
        ) : (
          <div>
            <FieldLabel
              htmlFor="arm-step"
              label="Step per later reset (pp)"
              tip="Added to or subtracted from the fully indexed rate at each reset after the first. Caps can stop the full step."
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
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        {(
          [
            ['initialCap', 'Initial adjustment cap (pp)', 'Largest rate change, up or down, at the first reset.'],
            ['subsequentCap', 'Later adjustment cap (pp)', 'Largest rate change, up or down, at each reset after the first.'],
            ['lifetimeIncreaseCap', 'Lifetime increase cap (pp)', 'How far the rate may rise above the initial note rate over the life of the loan.'],
            ['lifetimeDecreaseCap', 'Lifetime decrease cap (pp)', 'How far the rate may fall below the initial note rate. The floor is never below 0%.'],
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

      <div className="rounded-xl border border-border bg-background/50">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => setHousingOpen((open) => !open)}
          aria-expanded={housingOpen}
        >
          Property tax, insurance, HOA, PMI
          <span className="text-xs font-normal text-muted-foreground">Optional monthly costs</span>
        </button>
        {housingOpen ? (
          <div className="grid grid-cols-1 gap-3.5 border-t border-border p-3.5 min-[420px]:grid-cols-2">
            {(
              [
                ['propertyTaxMonthly', 'Property tax / month', 'Monthly tax set aside. Added to the housing payment. Not part of loan interest.'],
                ['insuranceMonthly', 'Insurance / month', 'Homeowners insurance estimate. Held constant. Not financed.'],
                ['hoaMonthly', 'HOA / month', 'Association dues, if any. Added to housing cost only.'],
                ['mortgageInsuranceMonthly', 'PMI / month', 'Mortgage insurance premium you enter. This calculator does not decide when PMI ends.'],
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
