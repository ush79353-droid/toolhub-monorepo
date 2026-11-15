'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calculator, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type AmortizationFieldErrors,
  type AmortizationInput,
  type CompoundingFrequency,
  type PaymentFrequency,
  type SupportedCurrency,
} from './types';
import { getCurrencySymbol } from './calculation';
import { resolveScheduledPeriods } from './validation';

export interface AmortizationDraft {
  loanAmount: string;
  termYears: string;
  termMonths: string;
  interestRate: string;
  compoundingFrequency: CompoundingFrequency;
  paymentFrequency: PaymentFrequency;
  extraPayment: string;
  recurringExtraStartPeriod: string;
  recurringExtraEndPeriod: string;
  oneTimeExtraAmount: string;
  oneTimeExtraPeriod: string;
  startDate: string;
  currency: SupportedCurrency;
}

export function inputToDraft(input: AmortizationInput): AmortizationDraft {
  return {
    loanAmount: String(input.loanAmount),
    termYears: String(input.termYears),
    termMonths: String(input.termMonths),
    interestRate: String(input.interestRate),
    compoundingFrequency: input.compoundingFrequency,
    paymentFrequency: input.paymentFrequency,
    extraPayment: input.extraPayment > 0 ? String(input.extraPayment) : '0',
    recurringExtraStartPeriod: String(input.recurringExtraStartPeriod),
    recurringExtraEndPeriod:
      input.recurringExtraEndPeriod !== null ? String(input.recurringExtraEndPeriod) : '',
    oneTimeExtraAmount:
      input.oneTimeExtraAmount > 0 ? String(input.oneTimeExtraAmount) : '0',
    oneTimeExtraPeriod: String(input.oneTimeExtraPeriod),
    startDate: input.startDate,
    currency: input.currency,
  };
}

export function draftToInput(draft: AmortizationDraft): AmortizationInput {
  const loanAmount = Math.max(0, Number(draft.loanAmount) || 0);
  const termYears = Math.max(0, parseInt(draft.termYears, 10) || 0);
  const termMonths = Math.max(0, parseInt(draft.termMonths, 10) || 0);
  const interestRate = Math.max(0, Number(draft.interestRate) || 0);
  const extraPayment = Math.max(0, Number(draft.extraPayment) || 0);
  const recurringExtraStartPeriod = Math.max(1, parseInt(draft.recurringExtraStartPeriod, 10) || 1);
  const recurringExtraEndPeriod = draft.recurringExtraEndPeriod.trim()
    ? Math.max(1, parseInt(draft.recurringExtraEndPeriod, 10) || 1)
    : null;
  const oneTimeExtraAmount = Math.max(0, Number(draft.oneTimeExtraAmount) || 0);
  const oneTimeExtraPeriod = Math.max(1, parseInt(draft.oneTimeExtraPeriod, 10) || 1);

  return {
    loanAmount,
    termYears,
    termMonths,
    interestRate,
    compoundingFrequency: draft.compoundingFrequency,
    paymentFrequency: draft.paymentFrequency,
    extraPayment,
    recurringExtraStartPeriod,
    recurringExtraEndPeriod,
    oneTimeExtraAmount,
    oneTimeExtraPeriod,
    startDate: draft.startDate.trim() || '2026-01-01',
    currency: draft.currency,
  };
}

interface AmortizationFormProps {
  draft: AmortizationDraft;
  errors: AmortizationFieldErrors;
  onChange: (nextDraft: AmortizationDraft) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
}

export function AmortizationForm({
  draft,
  errors,
  onChange,
  onSubmit,
  onReset,
}: AmortizationFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const symbol = getCurrencySymbol(draft.currency);

  const parsedInput = draftToInput(draft);
  const { numberOfPayments, isValidWholePeriods } = resolveScheduledPeriods(
    parsedInput.termYears,
    parsedInput.termMonths,
    parsedInput.paymentFrequency
  );

  const currentPaymentOption =
    PAYMENT_FREQUENCY_OPTIONS.find((opt) => opt.value === draft.paymentFrequency) ??
    PAYMENT_FREQUENCY_OPTIONS[2];

  const updateField = <K extends keyof AmortizationDraft>(
    field: K,
    value: AmortizationDraft[K]
  ) => {
    onChange({
      ...draft,
      [field]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* SECTION A: SPECIFICATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <h3 className="text-sm font-semibold tracking-tight text-accent">
            Loan Specifications
          </h3>
          <span className="text-xs text-muted-foreground">Standard parameters</span>
        </div>

        {/* 1. Loan Amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="loanAmount"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Loan Amount
              <InfoTooltip
                label="Loan Amount"
                text="The initial principal balance borrowed, before interest charges or finance fees."
              />
            </label>
            <span className="text-[11px] text-muted-foreground">Principal</span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <Input
              id="loanAmount"
              type="number"
              min={1}
              step="any"
              value={draft.loanAmount}
              onChange={(e) => updateField('loanAmount', e.target.value)}
              className="pl-8 text-sm"
              placeholder="10,000"
              aria-invalid={Boolean(errors.loanAmount)}
            />
          </div>
          {errors.loanAmount && (
            <p className="text-xs font-medium text-destructive">{errors.loanAmount}</p>
          )}
        </div>

        {/* 2. Amortization Term (Years & Months) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="termYears"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Amortization Term
              <InfoTooltip
                label="Amortization Term"
                text="The total duration of time over which the loan will be fully repaid in regular installments."
              />
            </label>
            <span className="text-[11px] text-muted-foreground">
              {isValidWholePeriods ? `${numberOfPayments} scheduled payments` : 'Years & months'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input
                id="termYears"
                type="number"
                min={0}
                max={100}
                value={draft.termYears}
                onChange={(e) => updateField('termYears', e.target.value)}
                className="pr-14 text-sm"
                placeholder="10"
                aria-invalid={Boolean(errors.term)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                years
              </span>
            </div>
            <div className="relative">
              <Input
                id="termMonths"
                type="number"
                min={0}
                max={11}
                value={draft.termMonths}
                onChange={(e) => updateField('termMonths', e.target.value)}
                className="pr-16 text-sm"
                placeholder="0"
                aria-invalid={Boolean(errors.term)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                months
              </span>
            </div>
          </div>
          {errors.term && (
            <p className="text-xs font-medium text-destructive">{errors.term}</p>
          )}
        </div>

        {/* 3. Interest Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="interestRate"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Interest Rate (Nominal APR)
              <InfoTooltip
                label="Nominal Interest Rate"
                text="The annual fixed interest rate stated on your loan contract (APR). Supports 0% for zero-interest promotions."
              />
            </label>
            <span className="text-[11px] text-muted-foreground">Annual percentage</span>
          </div>
          <div className="relative">
            <Input
              id="interestRate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={draft.interestRate}
              onChange={(e) => updateField('interestRate', e.target.value)}
              className="pr-8 text-sm"
              placeholder="12.5"
              aria-invalid={Boolean(errors.interestRate)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.interestRate && (
            <p className="text-xs font-medium text-destructive">{errors.interestRate}</p>
          )}
        </div>

        {/* 4. Compounding Frequency vs Payment Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="compoundingFrequency"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Compounding
              <InfoTooltip
                label="Compounding Frequency"
                text="How frequently interest is calculated and added to the principal balance. US commercial loans and mortgages typically compound monthly; Canadian mortgages compound semi-annually."
              />
            </label>
            <Select
              id="compoundingFrequency"
              value={draft.compoundingFrequency}
              onChange={(e) =>
                updateField('compoundingFrequency', e.target.value as CompoundingFrequency)
              }
            >
              {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="paymentFrequency"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Payment Frequency
              <InfoTooltip
                label="Payment Frequency"
                text="How often scheduled loan payments occur. Choosing biweekly or weekly payments with the same payment rate accelerates principal payoff."
              />
            </label>
            <Select
              id="paymentFrequency"
              value={draft.paymentFrequency}
              onChange={(e) =>
                updateField('paymentFrequency', e.target.value as PaymentFrequency)
              }
            >
              {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.periodsPerYear}/yr)
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 5. Extra Payment & Start Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="extraPayment"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Extra Payment
              <InfoTooltip
                label="Recurring Extra Payment"
                text="An optional recurring sum added to each scheduled payment that goes directly towards principal reduction, shortening loan duration and saving interest."
              />
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <Input
                id="extraPayment"
                type="number"
                min={0}
                step="any"
                value={draft.extraPayment}
                onChange={(e) => updateField('extraPayment', e.target.value)}
                className="pl-8 text-sm"
                placeholder="0"
                aria-invalid={Boolean(errors.extraPayment)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {currentPaymentOption.unitLabel}
              </span>
            </div>
            {errors.extraPayment && (
              <p className="text-xs font-medium text-destructive">{errors.extraPayment}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="startDate"
              className="text-xs font-medium text-foreground flex items-center gap-1.5"
            >
              Start Date
              <InfoTooltip
                label="Start Date"
                text="The initial loan origination date used to construct calendar dates for the amortization schedule."
              />
            </label>
            <Input
              id="startDate"
              type="date"
              value={draft.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="text-sm"
              aria-invalid={Boolean(errors.startDate)}
            />
            {errors.startDate && (
              <p className="text-xs font-medium text-destructive">{errors.startDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION B: ADVANCED EXTRA PAYMENTS */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 transition-all">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex w-full items-center justify-between text-left text-xs font-semibold text-accent hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            Advanced Extra Payments & Milestones
            {(Number(draft.oneTimeExtraAmount) > 0 ||
              Number(draft.recurringExtraStartPeriod) > 1 ||
              draft.recurringExtraEndPeriod.trim() !== '') && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Active
              </span>
            )}
          </span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 pt-3 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              Target custom lump-sum payments or define a specific date window for recurring extra contributions.
            </p>

            {/* One-time Extra Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="oneTimeExtraAmount"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  One-Time Lump Sum
                  <InfoTooltip
                    label="One-Time Extra Principal"
                    text="A single lump-sum extra payment applied directly to principal in a specific period (e.g. bonus, tax refund)."
                  />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <Input
                    id="oneTimeExtraAmount"
                    type="number"
                    min={0}
                    step="any"
                    value={draft.oneTimeExtraAmount}
                    onChange={(e) => updateField('oneTimeExtraAmount', e.target.value)}
                    className="pl-8 text-sm"
                    placeholder="0"
                    aria-invalid={Boolean(errors.oneTimeExtraAmount)}
                  />
                </div>
                {errors.oneTimeExtraAmount && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.oneTimeExtraAmount}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="oneTimeExtraPeriod"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  At Payment #
                  <InfoTooltip
                    label="Payment Period Number"
                    text="The scheduled installment number when this one-time lump sum is credited."
                  />
                </label>
                <Input
                  id="oneTimeExtraPeriod"
                  type="number"
                  min={1}
                  value={draft.oneTimeExtraPeriod}
                  onChange={(e) => updateField('oneTimeExtraPeriod', e.target.value)}
                  className="text-sm"
                  placeholder="1"
                  aria-invalid={Boolean(errors.oneTimeExtraPeriod)}
                />
                {errors.oneTimeExtraPeriod && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.oneTimeExtraPeriod}
                  </p>
                )}
              </div>
            </div>

            {/* Recurring Extra Payment Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="recurringExtraStartPeriod"
                  className="text-xs font-medium text-foreground"
                >
                  Recurring Extra Starts At (Payment #)
                </label>
                <Input
                  id="recurringExtraStartPeriod"
                  type="number"
                  min={1}
                  value={draft.recurringExtraStartPeriod}
                  onChange={(e) => updateField('recurringExtraStartPeriod', e.target.value)}
                  className="text-sm"
                  placeholder="1"
                />
                {errors.recurringExtraStartPeriod && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.recurringExtraStartPeriod}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="recurringExtraEndPeriod"
                  className="text-xs font-medium text-foreground"
                >
                  Recurring Extra Ends At (Optional)
                </label>
                <Input
                  id="recurringExtraEndPeriod"
                  type="number"
                  min={1}
                  value={draft.recurringExtraEndPeriod}
                  onChange={(e) => updateField('recurringExtraEndPeriod', e.target.value)}
                  className="text-sm"
                  placeholder="Through loan payoff"
                />
                {errors.recurringExtraEndPeriod && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.recurringExtraEndPeriod}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Calculate & Reset */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Button
          type="submit"
          className="w-full sm:flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Calculator className="h-4 w-4" />
          Calculate Amortization
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto h-11 px-5 text-sm font-medium border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}

