'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  LATE_DEDUCTION_RATE_PERCENT,
  LATE_FILING_FEE_PER_DAY,
  LATE_PAYMENT_RATE_PERCENT,
} from './calculation';
import type {
  TdsInterestFieldErrors,
  TdsInterestInput,
  TdsInterestMode,
  TdsInterestResult,
  TdsQuarter,
} from './types';
import { TDS_MODE_OPTIONS, TDS_QUARTER_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

/** FY start years for the return-filing dropdown (234E from FY 2012-13 Q2). */
function filingYearOptions(): number[] {
  const end = new Date().getUTCFullYear() + 5;
  const years: number[] = [];
  for (let y = 2012; y <= end; y += 1) years.push(y);
  return years;
}

interface TdsInterestFormProps {
  input: TdsInterestInput;
  errors: TdsInterestFieldErrors;
  result: TdsInterestResult | null;
  onChange: (input: TdsInterestInput) => void;
  onReset: () => void;
  dirty: boolean;
}

export function TdsInterestForm({
  input,
  errors,
  result,
  onChange,
  onReset,
  dirty,
}: TdsInterestFormProps) {
  const set = (patch: Partial<TdsInterestInput>) => onChange({ ...input, ...patch });

  const modeInfo =
    input.mode === 'late_deduction'
      ? {
          title: '(Section 201(1A))',
          body: `Interest for delaying TDS deduction. Charged at ${LATE_DEDUCTION_RATE_PERCENT}% for every month or part of a month from the date tax was deductible (transaction / credit) until it is actually deducted.`,
        }
      : input.mode === 'late_payment'
        ? {
            title: '(Section 201(1A))',
            body: `Interest for delaying deposit of deducted TDS. Charged at ${LATE_PAYMENT_RATE_PERCENT}% for every month or part of a month from the deduction date to the deposit date when payment is after the Rule 30 due date (7th of next month; March → 30 April for non-government deductors).`,
          }
        : {
            title: '(Section 234E)',
            body: `This is a fee for not filing the TDS return on time. Charged at ₹${LATE_FILING_FEE_PER_DAY} per day from the due date until the return is filed. Maximum fee cannot exceed the TDS amount.`,
          };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          I&apos;d like to know the…
        </legend>

        <div className="space-y-2" role="radiogroup" aria-label="TDS interest calculation type">
          {TDS_MODE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="tds-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === option.value}
                onChange={() => set({ mode: option.value as TdsInterestMode })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-sky-200 bg-sky-50/90 px-3.5 py-3 text-sm text-accent">
          <p className="font-semibold">{modeInfo.title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">{modeInfo.body}</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="tds-tax">
            <span>Tax amount</span>
          </label>
          <FieldShell error={errors.taxAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              ₹
            </span>
            <input
              id="tds-tax"
              className={inputClass}
              inputMode="decimal"
              value={input.taxAmount}
              aria-invalid={Boolean(errors.taxAmount)}
              onChange={(e) => set({ taxAmount: e.target.value })}
            />
          </FieldShell>
          {errors.taxAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxAmount}</p>
          ) : null}
        </div>

        {input.mode === 'late_deduction' ? (
          <>
            <div>
              <label className={labelClass} htmlFor="tds-txn">
                <span>Date of transaction</span>
                <InfoTooltip
                  label="Date of transaction"
                  text="Date tax was deductible; payment or credit date, whichever is earlier."
                />
              </label>
              <FieldShell error={errors.transactionDate}>
                <input
                  id="tds-txn"
                  type="date"
                  className={inputClass}
                  value={input.transactionDate}
                  aria-invalid={Boolean(errors.transactionDate)}
                  onChange={(e) => set({ transactionDate: e.target.value })}
                />
              </FieldShell>
              {errors.transactionDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.transactionDate}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tds-ded">
                <span>Date of TDS deduction</span>
              </label>
              <FieldShell error={errors.deductionDate}>
                <input
                  id="tds-ded"
                  type="date"
                  className={inputClass}
                  value={input.deductionDate}
                  aria-invalid={Boolean(errors.deductionDate)}
                  onChange={(e) => set({ deductionDate: e.target.value })}
                />
              </FieldShell>
              {errors.deductionDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.deductionDate}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {input.mode === 'late_payment' ? (
          <>
            <div>
              <label className={labelClass} htmlFor="tds-ded-pay">
                <span>Date of TDS deduction</span>
              </label>
              <FieldShell error={errors.deductionDate}>
                <input
                  id="tds-ded-pay"
                  type="date"
                  className={inputClass}
                  value={input.deductionDate}
                  aria-invalid={Boolean(errors.deductionDate)}
                  onChange={(e) => set({ deductionDate: e.target.value })}
                />
              </FieldShell>
              {errors.deductionDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.deductionDate}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="tds-pay">
                <span>Date of TDS payment</span>
                <InfoTooltip
                  label="Date of TDS payment"
                  text="Challan deposit date to the Central Government account."
                />
              </label>
              <FieldShell error={errors.paymentDate}>
                <input
                  id="tds-pay"
                  type="date"
                  className={inputClass}
                  value={input.paymentDate}
                  aria-invalid={Boolean(errors.paymentDate)}
                  onChange={(e) => set({ paymentDate: e.target.value })}
                />
              </FieldShell>
              {errors.paymentDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.paymentDate}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {input.mode === 'late_filing' ? (
          <>
            <div>
              <label className={labelClass} htmlFor="tds-quarter">
                <span>Quarter of return filing</span>
              </label>
              <div className="relative">
                <select
                  id="tds-quarter"
                  className={selectClass}
                  value={input.quarter}
                  onChange={(e) =>
                    set({ quarter: Number(e.target.value) as TdsQuarter })
                  }
                >
                  {TDS_QUARTER_OPTIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="tds-year">
                <span>Year of return filing</span>
                <InfoTooltip
                  label="Year of return filing"
                  text="Financial-year start year (April). Example: 2027 means FY 2027-28; Q1 due 31 Jul 2027."
                />
              </label>
              <div className="relative">
                <select
                  id="tds-year"
                  className={selectClass}
                  value={input.filingYear}
                  aria-invalid={Boolean(errors.filingYear)}
                  onChange={(e) => set({ filingYear: e.target.value })}
                >
                  {filingYearOptions().map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              {errors.filingYear ? (
                <p className="mt-1 text-xs text-rose-600">{errors.filingYear}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="tds-filing">
                <span>Date of return filing</span>
                <InfoTooltip
                  label="Date of return filing"
                  text="Actual or intended date the quarterly TDS statement is filed."
                />
              </label>
              <FieldShell error={errors.filingDate}>
                <input
                  id="tds-filing"
                  type="date"
                  className={inputClass}
                  value={input.filingDate}
                  aria-invalid={Boolean(errors.filingDate)}
                  onChange={(e) => set({ filingDate: e.target.value })}
                />
              </FieldShell>
              {errors.filingDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.filingDate}</p>
              ) : null}
            </div>
          </>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <p className="text-sm leading-relaxed text-accent" aria-live="polite">
            {result.message}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter the fields above to estimate TDS interest or late-filing fees.
          </p>
        )}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          disabled={!dirty}
          onClick={onReset}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
