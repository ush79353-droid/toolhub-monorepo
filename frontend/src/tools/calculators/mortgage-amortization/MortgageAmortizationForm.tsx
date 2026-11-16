'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { PaymentBreakdownChart } from './PaymentBreakdownChart';
import {
  MONTH_OPTIONS,
  type MortgageAmortizationFieldErrors,
  type MortgageAmortizationInput,
  type MortgageAmortizationResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface MortgageAmortizationFormProps {
  input: MortgageAmortizationInput;
  errors: MortgageAmortizationFieldErrors;
  result: MortgageAmortizationResult | null;
  onChange: (input: MortgageAmortizationInput) => void;
  onReset: () => void;
}

export function MortgageAmortizationForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MortgageAmortizationFormProps) {
  const set = (patch: Partial<MortgageAmortizationInput>) =>
    onChange({ ...input, ...patch });

  const showOptionals = input.includeOptionals;

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
          <label className={labelClass} htmlFor="ma-home">
            <span>Home Price</span>
          </label>
          <FieldShell error={errors.homePrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="ma-home"
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
          <label className={labelClass} htmlFor="ma-down">
            <span>Down Payment</span>
          </label>
          <FieldShell error={errors.downPaymentPercent}>
            <input
              id="ma-down"
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
          <label className={labelClass} htmlFor="ma-term">
            <span>Loan Term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="ma-term"
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
          <label className={labelClass} htmlFor="ma-rate">
            <span>Interest Rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="ma-rate"
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
            id="ma-optionals"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.includeOptionals}
            onChange={(e) => set({ includeOptionals: e.target.checked })}
          />
          <label htmlFor="ma-optionals" className="text-[13px] font-medium text-accent">
            Include Optionals Below
          </label>
        </div>

        {showOptionals ? (
          <div className="space-y-3.5 border-t border-border pt-3.5">
            <div>
              <label className={labelClass} htmlFor="ma-tax">
                <span>Property Taxes</span>
              </label>
              <FieldShell error={errors.propertyTaxPercent}>
                <input
                  id="ma-tax"
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
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Annual % of home price, shown monthly as home × rate ÷ 12.
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="ma-ins">
                <span>Home Insurance</span>
              </label>
              <FieldShell error={errors.homeInsuranceAnnual}>
                <input
                  id="ma-ins"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.homeInsuranceAnnual}
                  aria-invalid={Boolean(errors.homeInsuranceAnnual)}
                  onChange={(e) => set({ homeInsuranceAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  $/year
                </span>
              </FieldShell>
              {errors.homeInsuranceAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.homeInsuranceAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ma-pmi">
                <span>PMI Insurance</span>
              </label>
              <FieldShell error={errors.pmiInsuranceAnnual}>
                <input
                  id="ma-pmi"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.pmiInsuranceAnnual}
                  aria-invalid={Boolean(errors.pmiInsuranceAnnual)}
                  onChange={(e) => set({ pmiInsuranceAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  $/year
                </span>
              </FieldShell>
              {errors.pmiInsuranceAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.pmiInsuranceAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ma-hoa">
                <span>HOA Fee</span>
              </label>
              <FieldShell error={errors.hoaFeeAnnual}>
                <input
                  id="ma-hoa"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.hoaFeeAnnual}
                  aria-invalid={Boolean(errors.hoaFeeAnnual)}
                  onChange={(e) => set({ hoaFeeAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  $/year
                </span>
              </FieldShell>
              {errors.hoaFeeAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.hoaFeeAnnual}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ma-other">
                <span>Other Costs</span>
              </label>
              <FieldShell error={errors.otherCostsAnnual}>
                <input
                  id="ma-other"
                  className={`${inputClass} pr-14`}
                  inputMode="decimal"
                  value={input.otherCostsAnnual}
                  aria-invalid={Boolean(errors.otherCostsAnnual)}
                  onChange={(e) => set({ otherCostsAnnual: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  $/year
                </span>
              </FieldShell>
              {errors.otherCostsAnnual ? (
                <p className="mt-1 text-xs text-rose-600">{errors.otherCostsAnnual}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="ma-start-month">
            <span>Start Date</span>
            <InfoTooltip
              label="Start Date"
              text="First payment month/year. Payoff date advances by the loan term in years."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              id="ma-start-month"
              className={selectClass}
              value={input.startMonth}
              onChange={(e) => set({ startMonth: Number(e.target.value) })}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <FieldShell error={errors.startYear}>
              <input
                id="ma-start-year"
                className={inputClass}
                inputMode="numeric"
                value={input.startYear}
                aria-invalid={Boolean(errors.startYear)}
                onChange={(e) => set({ startYear: e.target.value })}
              />
            </FieldShell>
          </div>
          {errors.startYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startYear}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        <div>
          <label className={labelClass} htmlFor="ma-monthly">
            <span>Monthly Pay</span>
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              id="ma-monthly"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedMonthlyMortgage : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium">Monthly</th>
                    <th className="px-3 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-3 py-1.5">Mortgage Payment</td>
                    <td className="px-3 py-1.5 tabular-nums">
                      ${result.formattedMonthlyMortgage}
                    </td>
                    <td className="px-3 py-1.5 tabular-nums">
                      ${result.formattedTotalMortgagePayments}
                    </td>
                  </tr>
                  {showOptionals ? (
                    <>
                      <tr className="border-t border-border">
                        <td className="px-3 py-1.5">Property Tax</td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedMonthlyPropertyTax}
                        </td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedTotalPropertyTax}
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-3 py-1.5">Home Insurance</td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedMonthlyHomeInsurance}
                        </td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedTotalHomeInsurance}
                        </td>
                      </tr>
                      {result.monthlyPmi > 0 ? (
                        <tr className="border-t border-border">
                          <td className="px-3 py-1.5">PMI Insurance</td>
                          <td className="px-3 py-1.5 tabular-nums">
                            ${result.formattedMonthlyPmi}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums">
                            ${result.formattedTotalPmi}
                          </td>
                        </tr>
                      ) : null}
                      {result.monthlyHoa > 0 ? (
                        <tr className="border-t border-border">
                          <td className="px-3 py-1.5">HOA Fee</td>
                          <td className="px-3 py-1.5 tabular-nums">
                            ${result.formattedMonthlyHoa}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums">
                            ${result.formattedTotalHoa}
                          </td>
                        </tr>
                      ) : null}
                      <tr className="border-t border-border">
                        <td className="px-3 py-1.5">Other Costs</td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedMonthlyOtherCosts}
                        </td>
                        <td className="px-3 py-1.5 tabular-nums">
                          ${result.formattedTotalOtherCosts}
                        </td>
                      </tr>
                    </>
                  ) : null}
                  <tr className="border-t border-border font-medium">
                    <td className="px-3 py-1.5">Total Out-of-Pocket</td>
                    <td className="px-3 py-1.5 tabular-nums">
                      ${result.formattedMonthlyOutOfPocket}
                    </td>
                    <td className="px-3 py-1.5 tabular-nums">
                      ${result.formattedTotalOutOfPocket}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <PaymentBreakdownChart result={result} />

            <div className="space-y-1.5 text-sm text-accent">
              <p>
                House Price: <strong>${result.formattedHomePrice}</strong>
              </p>
              <p>
                Loan Amount: <strong>${result.formattedLoanAmount}</strong>
              </p>
              <p>
                Down Payment: <strong>${result.formattedDownPayment}</strong>
              </p>
              <p>
                Total of {result.paymentCount} Mortgage Payments:{' '}
                <strong>${result.formattedTotalMortgagePayments}</strong>
              </p>
              <p>
                Total Interest: <strong>${result.formattedTotalInterest}</strong>
              </p>
              <p>
                Mortgage Payoff Date: <strong>{result.payoffLabel}</strong>
              </p>
            </div>
          </>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Clear
        </Button>
      </div>
    </form>
  );
}
