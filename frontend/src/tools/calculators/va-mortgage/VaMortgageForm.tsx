'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { VaMortgageChart } from './VaMortgageChart';
import {
  VA_ELIGIBILITY_OPTIONS,
  type DownPaymentUnit,
  type FundingFeePayment,
  type VaEligibility,
  type VaMortgageFieldErrors,
  type VaMortgageInput,
  type VaMortgageResult,
  type YesNo,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function RadioRow({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold tabular-nums text-accent">{value}</span>
    </div>
  );
}

interface VaMortgageFormProps {
  input: VaMortgageInput;
  errors: VaMortgageFieldErrors;
  result: VaMortgageResult | null;
  onChange: (input: VaMortgageInput) => void;
  onReset: () => void;
}

export function VaMortgageForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: VaMortgageFormProps) {
  const set = (patch: Partial<VaMortgageInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan details</legend>

        <div>
          <label className={labelClass} htmlFor="va-home-price">
            <span>Home Price</span>
            <InfoTooltip
              label="Home Price"
              text="Purchase price in US dollars. Fixed USD formatting — no currency selectors in the reference."
            />
          </label>
          <FieldShell error={errors.homePrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="va-home-price"
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
          <label className={labelClass} htmlFor="va-down-payment">
            <span>Down Payment</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.downPayment}>
              {input.downPaymentUnit === 'amount' ? (
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
              ) : null}
              <input
                id="va-down-payment"
                className={`${inputClass} ${input.downPaymentUnit === 'percent' ? 'pr-2' : ''}`}
                inputMode="decimal"
                value={input.downPayment}
                aria-invalid={Boolean(errors.downPayment)}
                onChange={(e) => set({ downPayment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="va-down-payment-unit"
                className={selectClass}
                value={input.downPaymentUnit}
                onChange={(e) =>
                  set({ downPaymentUnit: e.target.value as DownPaymentUnit })
                }
                aria-label="Down payment unit"
              >
                <option value="percent">%</option>
                <option value="amount">$</option>
              </select>
            </div>
          </div>
          {errors.downPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="va-loan-term">
            <span>Loan Term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="va-loan-term"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
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
          <label className={labelClass} htmlFor="va-interest-rate">
            <span>Interest Rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="va-interest-rate"
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

        <RadioRow
          legend="VA Eligibility"
          name="va-eligibility"
          value={input.eligibility}
          options={VA_ELIGIBILITY_OPTIONS}
          onChange={(v) => set({ eligibility: v as VaEligibility })}
        />

        <RadioRow
          legend="Used VA Loan Before?"
          name="va-used-before"
          value={input.usedVaLoanBefore}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) => set({ usedVaLoanBefore: v as YesNo })}
        />

        <RadioRow
          legend="Service-Related Disability (10+%)"
          name="va-disability"
          value={input.serviceRelatedDisability}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onChange={(v) => set({ serviceRelatedDisability: v as YesNo })}
        />

        <RadioRow
          legend="VA Funding Fee"
          name="va-funding-fee-payment"
          value={input.fundingFeePayment}
          options={[
            { value: 'financed', label: 'Financed Into Loan' },
            { value: 'upfront', label: 'Paid Upfront' },
          ]}
          onChange={(v) => set({ fundingFeePayment: v as FundingFeePayment })}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        {result ? (
          <>
            <div className="rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white">
              Monthly Pay: ${result.formattedMonthlyPayment}
            </div>
            <div className="space-y-2">
              <SummaryRow label="House Price" value={`$${result.formattedHomePrice}`} />
              <SummaryRow
                label={
                  result.fundingFeeExempt
                    ? 'VA Funding Fee (exempt)'
                    : `VA Funding Fee (${result.formattedFundingFeeRatePercent}%)`
                }
                value={`$${result.formattedFundingFee}`}
              />
              <SummaryRow label="Down Payment" value={`$${result.formattedDownPayment}`} />
              <SummaryRow label="Loan Amount" value={`$${result.formattedLoanAmount}`} />
              <SummaryRow
                label={`Total of ${result.paymentCount} Mortgage Payments`}
                value={`$${result.formattedTotalOfPayments}`}
              />
              <SummaryRow label="Total Interest" value={`$${result.formattedTotalInterest}`} />
            </div>
            <VaMortgageChart result={result} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid loan details to estimate the VA mortgage payment.
          </p>
        )}
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
