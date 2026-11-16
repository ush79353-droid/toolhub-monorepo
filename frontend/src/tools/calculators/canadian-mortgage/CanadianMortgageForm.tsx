'use client';

import type { ReactNode } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CanadianMortgageResults } from './CanadianMortgageResults';
import { MONTH_OPTIONS, type CanadianMortgageFieldErrors, type CanadianMortgageInput, type CanadianMortgageResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface CanadianMortgageFormProps {
  input: CanadianMortgageInput;
  errors: CanadianMortgageFieldErrors;
  result: CanadianMortgageResult | null;
  onChange: (input: CanadianMortgageInput) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export function CanadianMortgageForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onReset,
}: CanadianMortgageFormProps) {
  const set = (patch: Partial<CanadianMortgageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Mortgage details</legend>

        <div>
          <label className={labelClass} htmlFor="cm-home-price">
            <span>Home Price</span>
            <InfoTooltip
              label="Home Price"
              text="Purchase price in dollars. Reference uses fixed $ formatting with no currency selectors."
            />
          </label>
          <FieldShell error={errors.homePrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="cm-home-price"
              className={inputClass}
              inputMode="decimal"
              value={input.homePrice}
              aria-invalid={Boolean(errors.homePrice)}
              onChange={(e) => set({ homePrice: e.target.value })}
            />
          </FieldShell>
          {errors.homePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.homePrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cm-down">
            <span>Down Payment</span>
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="cm-down"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.downPaymentPercent}
              aria-invalid={Boolean(errors.downPaymentPercent)}
              onChange={(e) => set({ downPaymentPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.downPaymentPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPaymentPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cm-term">
            <span>Loan Term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="cm-term"
              className={`${inputClass} pr-14`}
              inputMode="numeric"
              value={input.loanTermYears}
              aria-invalid={Boolean(errors.loanTermYears)}
              onChange={(e) => set({ loanTermYears: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.loanTermYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cm-rate">
            <span>Interest Rate</span>
            <InfoTooltip
              label="Interest Rate"
              text="Nominal annual mortgage rate compounded semi-annually (Canadian convention), not US monthly compounding."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="cm-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            id="cm-optionals"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.includeOptionals}
            onChange={(e) => set({ includeOptionals: e.target.checked })}
          />
          <label htmlFor="cm-optionals" className="text-[13px] font-medium text-accent">
            Include Optionals Below
          </label>
        </div>

        {input.includeOptionals ? (
          <>
            <div>
              <label className={labelClass} htmlFor="cm-tax">
                <span>Property Taxes</span>
                <InfoTooltip
                  label="Property Taxes"
                  text="Annual property tax as a percent of home price. Monthly = annual / 12."
                />
              </label>
              <FieldShell error={errors.propertyTaxPercent}>
                <input
                  id="cm-tax"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.propertyTaxPercent}
                  aria-invalid={Boolean(errors.propertyTaxPercent)}
                  onChange={(e) => set({ propertyTaxPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.propertyTaxPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.propertyTaxPercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cm-insurance">
                <span>Home Insurance</span>
              </label>
              <FieldShell error={errors.homeInsuranceAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cm-insurance"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.homeInsuranceAnnual}
                  aria-invalid={Boolean(errors.homeInsuranceAnnual)}
                  onChange={(e) => set({ homeInsuranceAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  /year
                </span>
              </FieldShell>
              {errors.homeInsuranceAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.homeInsuranceAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cm-mi">
                <span>Mortgage Insurance</span>
              </label>
              <FieldShell error={errors.mortgageInsuranceAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cm-mi"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.mortgageInsuranceAnnual}
                  aria-invalid={Boolean(errors.mortgageInsuranceAnnual)}
                  onChange={(e) => set({ mortgageInsuranceAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  /year
                </span>
              </FieldShell>
              {errors.mortgageInsuranceAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.mortgageInsuranceAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cm-hoa">
                <span>Condo/HOA Fee</span>
              </label>
              <FieldShell error={errors.condoHoaFeeAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cm-hoa"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.condoHoaFeeAnnual}
                  aria-invalid={Boolean(errors.condoHoaFeeAnnual)}
                  onChange={(e) => set({ condoHoaFeeAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  /year
                </span>
              </FieldShell>
              {errors.condoHoaFeeAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.condoHoaFeeAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cm-other">
                <span>Other Costs</span>
              </label>
              <FieldShell error={errors.otherCostsAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cm-other"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.otherCostsAnnual}
                  aria-invalid={Boolean(errors.otherCostsAnnual)}
                  onChange={(e) => set({ otherCostsAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  /year
                </span>
              </FieldShell>
              {errors.otherCostsAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.otherCostsAnnual}</p>
              ) : null}
            </div>
          </>
        ) : null}

        <div>
          <span className={labelClass}>Start Date</span>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.startMonth}>
              <select
                id="cm-start-month"
                className={`${inputClass} appearance-none pr-8`}
                value={input.startMonth}
                aria-label="Start month"
                aria-invalid={Boolean(errors.startMonth)}
                onChange={(e) => set({ startMonth: e.target.value })}
              >
                {MONTH_OPTIONS.map((month) => (
                  <option key={month.value} value={String(month.value)}>
                    {month.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            <FieldShell error={errors.startYear}>
              <input
                id="cm-start-year"
                className={inputClass}
                inputMode="numeric"
                value={input.startYear}
                aria-label="Start year"
                aria-invalid={Boolean(errors.startYear)}
                onChange={(e) => set({ startYear: e.target.value })}
              />
            </FieldShell>
          </div>
          {errors.startMonth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startMonth}</p>
          ) : null}
          {errors.startYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startYear}</p>
          ) : null}
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </Button>
      </div>

      {result ? (
        <CanadianMortgageResults result={result} includeOptionals={input.includeOptionals} />
      ) : null}
    </form>
  );
}
