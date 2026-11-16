'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MortgageUkChart } from './MortgageUkChart';
import {
  MONTH_OPTIONS,
  type MortgageUkFieldErrors,
  type MortgageUkInput,
  type MortgageUkResult,
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

interface MortgageUkFormProps {
  input: MortgageUkInput;
  errors: MortgageUkFieldErrors;
  result: MortgageUkResult | null;
  onChange: (input: MortgageUkInput) => void;
  onReset: () => void;
}

export function MortgageUkForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MortgageUkFormProps) {
  const set = (patch: Partial<MortgageUkInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Mortgage details</legend>

        <div>
          <label className={labelClass} htmlFor="muk-home">
            <span>Home price</span>
            <InfoTooltip
              label="Home price"
              text="Purchase price in pounds sterling (£). Fixed GBP denomination — no currency selector."
            />
          </label>
          <FieldShell error={errors.homePrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              £
            </span>
            <input
              id="muk-home"
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
          <label className={labelClass} htmlFor="muk-deposit">
            <span>Mortgage deposit</span>
            <InfoTooltip
              label="Mortgage deposit"
              text="Deposit as a percent of home price. Loan amount = home price × (1 − deposit%/100)."
            />
          </label>
          <FieldShell error={errors.depositPercent}>
            <input
              id="muk-deposit"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.depositPercent}
              aria-invalid={Boolean(errors.depositPercent)}
              onChange={(e) => set({ depositPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.depositPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depositPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="muk-term">
            <span>Loan term</span>
          </label>
          <FieldShell error={errors.loanTermYears}>
            <input
              id="muk-term"
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
          <label className={labelClass} htmlFor="muk-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="muk-rate"
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
            id="muk-optionals"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.includeOptionals}
            onChange={(e) => set({ includeOptionals: e.target.checked })}
          />
          <label htmlFor="muk-optionals" className="text-[13px] font-medium text-accent">
            Include optionals below
          </label>
        </div>

        {input.includeOptionals ? (
          <div className="space-y-3.5 border-t border-border pt-3.5">
            <div>
              <label className={labelClass} htmlFor="muk-taxes">
                <span>Taxes</span>
                <InfoTooltip
                  label="Taxes"
                  text="Annual tax as a percent of home price. Monthly tax = (home price × taxes%) / 12."
                />
              </label>
              <FieldShell error={errors.taxesPercent}>
                <input
                  id="muk-taxes"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.taxesPercent}
                  aria-invalid={Boolean(errors.taxesPercent)}
                  onChange={(e) => set({ taxesPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.taxesPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.taxesPercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="muk-home-ins">
                <span>Home insurance</span>
              </label>
              <FieldShell error={errors.homeInsuranceAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  £
                </span>
                <input
                  id="muk-home-ins"
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
              <label className={labelClass} htmlFor="muk-mort-ins">
                <span>Mortgage insurance</span>
              </label>
              <FieldShell error={errors.mortgageInsuranceAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  £
                </span>
                <input
                  id="muk-mort-ins"
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
              <label className={labelClass} htmlFor="muk-other">
                <span>Other costs</span>
              </label>
              <FieldShell error={errors.otherCostsAnnual}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  £
                </span>
                <input
                  id="muk-other"
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
          </div>
        ) : null}

        <div>
          <span className={labelClass}>Start date</span>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="sr-only" htmlFor="muk-start-month">
                Start month
              </label>
              <select
                id="muk-start-month"
                className={selectClass}
                value={input.startMonth}
                aria-invalid={Boolean(errors.startMonth)}
                onChange={(e) => set({ startMonth: e.target.value })}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.startMonth ? (
                <p className="mt-1 text-xs text-rose-600">{errors.startMonth}</p>
              ) : null}
            </div>
            <div>
              <label className="sr-only" htmlFor="muk-start-year">
                Start year
              </label>
              <FieldShell error={errors.startYear}>
                <input
                  id="muk-start-year"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.startYear}
                  aria-invalid={Boolean(errors.startYear)}
                  onChange={(e) => set({ startYear: e.target.value })}
                />
              </FieldShell>
              {errors.startYear ? (
                <p className="mt-1 text-xs text-rose-600">{errors.startYear}</p>
              ) : null}
            </div>
          </div>
        </div>
      </fieldset>

      {result ? (
        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-brand-softTeal/50 px-3.5 py-3">
              <p className="text-xs font-medium text-muted-foreground">Interest only</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                £{result.formattedInterestOnlyMonthly}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-brand-softTeal/50 px-3.5 py-3">
              <p className="text-xs font-medium text-muted-foreground">Monthly repayment</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
                £{result.formattedMonthlyRepayment}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[280px] text-left text-sm text-accent">
              <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Item</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Monthly</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2.5">Mortgage payment</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    £{result.formattedMonthlyRepayment}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    £{result.formattedTotalMortgagePayments}
                  </td>
                </tr>
                {input.includeOptionals ? (
                  <>
                    <tr>
                      <td className="px-3 py-2.5">Taxes</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedTaxesMonthly}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedTaxesTotal}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5">Home insurance</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedHomeInsuranceMonthly}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedHomeInsuranceTotal}
                      </td>
                    </tr>
                    {result.mortgageInsuranceTotal > 0 ? (
                      <tr>
                        <td className="px-3 py-2.5">Mortgage insurance</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          £{result.formattedMortgageInsuranceMonthly}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          £{result.formattedMortgageInsuranceTotal}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td className="px-3 py-2.5">Other costs</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedOtherCostsMonthly}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        £{result.formattedOtherCostsTotal}
                      </td>
                    </tr>
                  </>
                ) : null}
                <tr className="bg-muted/40 font-semibold">
                  <td className="px-3 py-2.5">Total out-of-pocket</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    £{result.formattedOutOfPocketMonthly}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    £{result.formattedOutOfPocketTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid gap-2 text-sm text-accent sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-white px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Loan amount</p>
              <p className="mt-0.5 font-semibold tabular-nums">£{result.formattedLoanAmount}</p>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Mortgage deposit</p>
              <p className="mt-0.5 font-semibold tabular-nums">£{result.formattedDepositAmount}</p>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Total interest</p>
              <p className="mt-0.5 font-semibold tabular-nums">£{result.formattedTotalInterest}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Start {result.startLabel} · Payoff {result.payoffLabel} · {result.paymentCount}{' '}
            monthly payments · Fixed GBP (£)
          </p>

          <MortgageUkChart result={result} />
        </fieldset>
      ) : null}

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
