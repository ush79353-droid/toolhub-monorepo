'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PaymentFieldErrors,
  PaymentInput,
  PaymentMode,
  PaymentResult,
  ScheduleView,
} from './types';
import { formatPaymentUsd } from './calculation';
import { PaymentDonutChart, PaymentRepaymentChart } from './PaymentCharts';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface PaymentFormProps {
  input: PaymentInput;
  errors: PaymentFieldErrors;
  result: PaymentResult | null;
  scheduleView: ScheduleView;
  onChange: (input: PaymentInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onScheduleViewChange: (view: ScheduleView) => void;
}

export function PaymentForm({
  input,
  errors,
  result,
  scheduleView,
  onChange,
  onCalculate,
  onClear,
  onScheduleViewChange,
}: PaymentFormProps) {
  const set = (patch: Partial<PaymentInput>) => onChange({ ...input, ...patch });

  const setMode = (mode: PaymentMode) => set({ mode });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
          className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          noValidate
          autoComplete="off"
        >
          <div className="flex rounded-lg border border-border bg-white p-1">
            {(
              [
                { value: 'fixed-term', label: 'Fixed Term' },
                { value: 'fixed-payments', label: 'Fixed Payments' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                  input.mode === tab.value
                    ? 'bg-primary text-white'
                    : 'text-accent hover:bg-muted/40'
                }`}
                onClick={() => setMode(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            <label className={labelClass} htmlFor="pay-loan-amount">
              <span>Loan Amount</span>
              <InfoTooltip
                label="Loan Amount"
                text="Principal balance to amortize. Amounts are shown in USD."
              />
            </label>
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="pay-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            {errors.loanAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
            ) : null}
          </div>

          {input.mode === 'fixed-term' ? (
            <div>
              <label className={labelClass} htmlFor="pay-term">
                Loan Term
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanTermYears}>
                  <input
                    id="pay-term"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.loanTermYears}
                    aria-invalid={Boolean(errors.loanTermYears)}
                    onChange={(e) => set({ loanTermYears: e.target.value })}
                  />
                </FieldShell>
                <span className="flex h-11 items-center text-sm text-muted-foreground">
                  years
                </span>
              </div>
              {errors.loanTermYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanTermYears}</p>
              ) : null}
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="pay-fixed-pmt">
                <span>Monthly Payment</span>
                <InfoTooltip
                  label="Monthly Payment"
                  text="Fixed payment used to solve how long the loan takes to pay off."
                />
              </label>
              <FieldShell error={errors.monthlyPayment}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="pay-fixed-pmt"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.monthlyPayment}
                  aria-invalid={Boolean(errors.monthlyPayment)}
                  onChange={(e) => set({ monthlyPayment: e.target.value })}
                />
              </FieldShell>
              {errors.monthlyPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.monthlyPayment}</p>
              ) : null}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="pay-rate">
              Interest Rate
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.interestRatePercent}>
                <input
                  id="pay-rate"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.interestRatePercent}
                  aria-invalid={Boolean(errors.interestRatePercent)}
                  onChange={(e) => set({ interestRatePercent: e.target.value })}
                />
              </FieldShell>
              <span className="flex h-11 items-center text-sm text-muted-foreground">%</span>
            </div>
            {errors.interestRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
            ) : null}
          </div>

          {errors.form ? (
            <p className="text-xs text-rose-600" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" className="h-10 rounded-xl px-4 text-xs font-semibold">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4 text-xs font-semibold"
              onClick={onClear}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          {result ? (
            <>
              <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
                Monthly Payment: {result.formattedMonthlyPayment}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{result.summaryText}</p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <th className="px-3 py-2 text-left font-medium text-accent">
                        Total of {result.numberOfPayments} Payments
                      </th>
                      <td className="px-3 py-2 text-right tabular-nums text-accent">
                        {result.formattedTotalRepayment}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-accent">
                        Total Interest
                      </th>
                      <td className="px-3 py-2 text-right tabular-nums text-accent">
                        {result.formattedTotalInterest}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <PaymentDonutChart result={result} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter values and click Calculate to see the monthly payment, totals, and charts.
            </p>
          )}
        </div>
      </div>

      {result ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-3.5 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-accent">Amortization schedule</h3>
              <div className="flex gap-3 text-xs font-semibold">
                <button
                  type="button"
                  className={
                    scheduleView === 'annual'
                      ? 'text-primary underline'
                      : 'text-muted-foreground hover:text-accent'
                  }
                  onClick={() => onScheduleViewChange('annual')}
                >
                  Annual Schedule
                </button>
                <button
                  type="button"
                  className={
                    scheduleView === 'monthly'
                      ? 'text-primary underline'
                      : 'text-muted-foreground hover:text-accent'
                  }
                  onClick={() => onScheduleViewChange('monthly')}
                >
                  Monthly Schedule
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-auto rounded-lg border border-border">
              <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
                <thead className="sticky top-0 bg-muted/80 text-accent">
                  <tr>
                    <th className="px-2 py-2 font-semibold">
                      {scheduleView === 'annual' ? 'Year' : 'Month'}
                    </th>
                    <th className="px-2 py-2 font-semibold">Interest</th>
                    <th className="px-2 py-2 font-semibold">Principal</th>
                    <th className="px-2 py-2 font-semibold">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleView === 'annual'
                    ? result.annualSchedule.map((row) => (
                        <tr key={row.year} className="border-t border-border">
                          <td className="px-2 py-1.5 tabular-nums">{row.year}</td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.interest)}
                          </td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.principal)}
                          </td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.endingBalance)}
                          </td>
                        </tr>
                      ))
                    : result.monthlySchedule.map((row) => (
                        <tr key={row.period} className="border-t border-border">
                          <td className="px-2 py-1.5 tabular-nums">{row.period}</td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.interest)}
                          </td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.principal)}
                          </td>
                          <td className="px-2 py-1.5 tabular-nums">
                            {formatPaymentUsd(row.endingBalance)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
          <PaymentRepaymentChart points={result.chartPoints} />
        </div>
      ) : null}
    </div>
  );
}
