'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BusinessLoanFieldErrors,
  BusinessLoanInput,
  CompoundFrequency,
  KnownRateType,
  OriginationFeeRepayment,
  PaymentFrequency,
} from './types';

interface BusinessLoanFormProps {
  input: BusinessLoanInput;
  errors: BusinessLoanFieldErrors;
  onChange: (field: keyof BusinessLoanInput, value: unknown) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
          {label}
        </label>
      ) : (
        <span className="text-[13px] font-medium text-accent">{label}</span>
      )}
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function BusinessLoanForm({ input, errors, onChange, onCurrencyChange }: BusinessLoanFormProps) {
  const [specsOpen, setSpecsOpen] = React.useState(true);
  const [feesOpen, setFeesOpen] = React.useState(true);

  const symbol = getCurrencySymbol(input.currency);

  return (
    <div className="space-y-4">
      {/* 1. Main specifications */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 transition-all">
        <button
          type="button"
          onClick={() => setSpecsOpen(!specsOpen)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={specsOpen}
        >
          <span className="text-sm font-semibold text-accent">Main specifications</span>
          <span className="text-muted-foreground">
            {specsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {specsOpen ? (
          <div className="mt-4 space-y-4">
            {/* Known rate */}
            <div>
              <FieldLabel
                htmlFor="biz-known-rate"
                label="Known rate"
                tip="Select whether your stated interest rate is a nominal annual percentage rate or an effective annual rate."
              />
              <select
                id="biz-known-rate"
                className={selectClass}
                value={input.knownRate}
                onChange={(e) => onChange('knownRate', e.target.value as KnownRateType)}
              >
                <option value="nominal">Nominal interest rate</option>
                <option value="effective">Effective interest rate</option>
              </select>
            </div>

            {/* Interest rate */}
            <div>
              <FieldLabel
                htmlFor="biz-interest-rate"
                label="Interest rate"
                tip="The annual interest rate charged on the business loan."
              />
              <div className="relative">
                <input
                  id="biz-interest-rate"
                  type="text"
                  inputMode="decimal"
                  className={`${inputClass} pr-8`}
                  value={input.interestRate}
                  aria-invalid={Boolean(errors.interestRate)}
                  onChange={(e) => onChange('interestRate', e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  %
                </span>
              </div>
              {errors.interestRate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
              ) : null}
            </div>

            {/* Compound frequency */}
            <div>
              <FieldLabel
                htmlFor="biz-compound-freq"
                label="Compound frequency"
                tip="How frequently interest compounds on the outstanding loan balance."
              />
              <select
                id="biz-compound-freq"
                className={selectClass}
                value={input.compoundFrequency}
                onChange={(e) =>
                  onChange('compoundFrequency', e.target.value as CompoundFrequency)
                }
              >
                <option value="annually">Annually</option>
                <option value="semi-annually">Semi-annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Loan amount */}
            <div>
              <FieldLabel
                htmlFor="biz-loan-amount"
                label="Loan amount"
                tip="The requested principal loan amount."
              />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id="biz-loan-amount"
                    type="text"
                    inputMode="decimal"
                    className={`${inputClass} pl-8`}
                    value={input.loanAmount}
                    aria-invalid={Boolean(errors.loanAmount)}
                    onChange={(e) => onChange('loanAmount', e.target.value)}
                  />
                </div>
                <div className="w-[125px] shrink-0">
                  <CurrencySelect
                    id="biz-currency"
                    value={input.currency}
                    onChange={onCurrencyChange}
                  />
                </div>
              </div>
              {errors.loanAmount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
              ) : null}
            </div>

            {/* Loan term (Years & Months) */}
            <div>
              <FieldLabel
                label="Loan term"
                tip="The repayment duration of the business loan in years and months."
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    id="biz-term-years"
                    type="text"
                    inputMode="numeric"
                    className={`${inputClass} pr-10`}
                    value={input.termYears}
                    placeholder="0"
                    aria-invalid={Boolean(errors.termYears)}
                    onChange={(e) => onChange('termYears', e.target.value)}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    yrs
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="biz-term-months"
                    type="text"
                    inputMode="numeric"
                    className={`${inputClass} pr-10`}
                    value={input.termMonths}
                    placeholder="0"
                    aria-invalid={Boolean(errors.termMonths)}
                    onChange={(e) => onChange('termMonths', e.target.value)}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    mos
                  </span>
                </div>
              </div>
              {errors.termYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
              ) : errors.termMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
              ) : null}
            </div>

            {/* Payment frequency */}
            <div>
              <FieldLabel
                htmlFor="biz-payment-freq"
                label="Payment frequency"
                tip="How frequently you make scheduled amortized loan payments."
              />
              <select
                id="biz-payment-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) =>
                  onChange('paymentFrequency', e.target.value as PaymentFrequency)
                }
              >
                <option value="annually">Annually</option>
                <option value="semi-annually">Semi-annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Additional fees */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 transition-all">
        <button
          type="button"
          onClick={() => setFeesOpen(!feesOpen)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={feesOpen}
        >
          <span className="text-sm font-semibold text-accent">Additional fees</span>
          <span className="text-muted-foreground">
            {feesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {feesOpen ? (
          <div className="mt-4 space-y-4">
            {/* Prepaid fee */}
            <div>
              <FieldLabel
                htmlFor="biz-prepaid-fee"
                label="Prepaid fee"
                tip="Upfront administrative, application, or closing fees paid directly out of pocket at loan origination."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="biz-prepaid-fee"
                  type="text"
                  inputMode="decimal"
                  className={`${inputClass} pl-8`}
                  value={input.prepaidFee}
                  aria-invalid={Boolean(errors.prepaidFee)}
                  onChange={(e) => onChange('prepaidFee', e.target.value)}
                />
              </div>
              {errors.prepaidFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.prepaidFee}</p>
              ) : null}
            </div>

            {/* Loaned fee */}
            <div>
              <FieldLabel
                htmlFor="biz-loaned-fee"
                label="Loaned fee"
                tip="Third-party or closing costs financed directly into the loan principal and amortized over the loan term."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="biz-loaned-fee"
                  type="text"
                  inputMode="decimal"
                  className={`${inputClass} pl-8`}
                  value={input.loanedFee}
                  aria-invalid={Boolean(errors.loanedFee)}
                  onChange={(e) => onChange('loanedFee', e.target.value)}
                />
              </div>
              {errors.loanedFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanedFee}</p>
              ) : null}
            </div>

            {/* Origination fee (%) */}
            <div>
              <FieldLabel
                htmlFor="biz-orig-fee"
                label="Origination fee"
                tip="Lender origination charge stated as a percentage of the loan amount."
              />
              <div className="relative">
                <input
                  id="biz-orig-fee"
                  type="text"
                  inputMode="decimal"
                  className={`${inputClass} pr-8`}
                  value={input.originationFee}
                  aria-invalid={Boolean(errors.originationFee)}
                  onChange={(e) => onChange('originationFee', e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  %
                </span>
              </div>
              {errors.originationFee ? (
                <p className="mt-1 text-xs text-rose-600">{errors.originationFee}</p>
              ) : null}
            </div>

            {/* Origination fee repayment radio options */}
            <div>
              <FieldLabel
                label="Origination fee repayment"
                tip="How the lender origination fee is settled: deducted from the disbursed cash, rolled into the financed balance, or paid upfront out of pocket."
              />
              <div className="mt-2 space-y-2">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-muted/30">
                  <input
                    type="radio"
                    name="originationFeeRepayment"
                    value="from_loan"
                    checked={input.originationFeeRepayment === 'from_loan'}
                    onChange={(e) =>
                      onChange(
                        'originationFeeRepayment',
                        e.target.value as OriginationFeeRepayment
                      )
                    }
                    className="h-4 w-4 text-primary focus:ring-ring"
                  />
                  <span>From the loan amount</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-muted/30">
                  <input
                    type="radio"
                    name="originationFeeRepayment"
                    value="rolling"
                    checked={input.originationFeeRepayment === 'rolling'}
                    onChange={(e) =>
                      onChange(
                        'originationFeeRepayment',
                        e.target.value as OriginationFeeRepayment
                      )
                    }
                    className="h-4 w-4 text-primary focus:ring-ring"
                  />
                  <span>Rolling into the loan</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-muted/30">
                  <input
                    type="radio"
                    name="originationFeeRepayment"
                    value="out_of_pocket"
                    checked={input.originationFeeRepayment === 'out_of_pocket'}
                    onChange={(e) =>
                      onChange(
                        'originationFeeRepayment',
                        e.target.value as OriginationFeeRepayment
                      )
                    }
                    className="h-4 w-4 text-primary focus:ring-ring"
                  />
                  <span>Out of pocket</span>
                </label>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
