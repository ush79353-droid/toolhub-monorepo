'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calculator, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatCurrencyValue, formatDisplayDate, getScheduledPaymentDate } from './calculation';
import {
  getCurrencySymbol,
  type ExtraPaymentFrequency,
  type FeeInclusion,
  type FeeMode,
  type LoanFieldErrors,
  type LoanInput,
  type LoanMode,
  type PaymentFrequency,
  type SupportedCurrency,
  type TermUnit,
} from './types';
import { resolveScheduledPeriods, resolveTotalMonths, validateLoanInput } from './validation';

export interface LoanDraft {
  loanMode: LoanMode;
  loanAmount: string;
  annualInterestRate: string;
  loanTermValue: string;
  loanTermUnit: TermUnit;
  paymentFrequency: PaymentFrequency;
  interestOnlyValue: string;
  interestOnlyUnit: TermUnit;
  originationFeeValue: string;
  originationFeeMode: FeeMode;
  feeInclusion: FeeInclusion;
  extraPaymentAmount: string;
  extraPaymentFrequency: ExtraPaymentFrequency;
  oneTimeExtraAmount: string;
  oneTimeExtraPeriod: string;
  startDate: string;
  currency: SupportedCurrency;
}

export function inputToDraft(input: LoanInput): LoanDraft {
  return {
    loanMode: input.loanMode,
    loanAmount: String(input.loanAmount),
    annualInterestRate: String(input.annualInterestRate),
    loanTermValue: String(input.loanTermValue),
    loanTermUnit: input.loanTermUnit,
    paymentFrequency: input.paymentFrequency,
    interestOnlyValue: String(input.interestOnlyValue),
    interestOnlyUnit: input.interestOnlyUnit,
    originationFeeValue: String(input.originationFeeValue),
    originationFeeMode: input.originationFeeMode,
    feeInclusion: input.feeInclusion,
    extraPaymentAmount: String(input.extraPaymentAmount),
    extraPaymentFrequency: input.extraPaymentFrequency,
    oneTimeExtraAmount: String(input.oneTimeExtraAmount),
    oneTimeExtraPeriod: String(input.oneTimeExtraPeriod),
    startDate: input.startDate,
    currency: input.currency,
  };
}

function parseDraftNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '') return NaN;
  return Number(cleaned);
}

export function draftToInput(draft: LoanDraft): LoanInput {
  return {
    loanMode: draft.loanMode,
    loanAmount: parseDraftNumber(draft.loanAmount),
    annualInterestRate: parseDraftNumber(draft.annualInterestRate),
    loanTermValue: parseDraftNumber(draft.loanTermValue),
    loanTermUnit: draft.loanTermUnit,
    paymentFrequency: draft.paymentFrequency,
    interestOnlyValue: parseDraftNumber(draft.interestOnlyValue),
    interestOnlyUnit: draft.interestOnlyUnit,
    originationFeeValue: parseDraftNumber(draft.originationFeeValue),
    originationFeeMode: draft.originationFeeMode,
    feeInclusion: draft.feeInclusion,
    extraPaymentAmount: parseDraftNumber(draft.extraPaymentAmount),
    extraPaymentFrequency: draft.extraPaymentFrequency,
    oneTimeExtraAmount: parseDraftNumber(draft.oneTimeExtraAmount),
    oneTimeExtraPeriod: parseDraftNumber(draft.oneTimeExtraPeriod),
    startDate: draft.startDate,
    currency: draft.currency,
  };
}

interface LoanFormProps {
  draft: LoanDraft;
  errors: LoanFieldErrors;
  onDraftChange: (nextDraft: LoanDraft) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
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
              active
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

interface UnitNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixUnit?: string;
  suffixUnit?: string;
  hasError?: boolean;
}

function UnitNumberInput({
  prefixUnit,
  suffixUnit,
  hasError = false,
  className = '',
  ...props
}: UnitNumberInputProps) {
  return (
    <div
      className={`flex h-11 w-full items-center overflow-hidden rounded-lg border bg-white text-sm transition-colors focus-within:ring-2 focus-within:ring-offset-1 ${
        hasError
          ? 'border-rose-500 focus-within:ring-rose-500'
          : 'border-border focus-within:ring-ring'
      } ${className}`}
    >
      {prefixUnit && (
        <span
          aria-hidden="true"
          className="flex h-full min-w-[40px] shrink-0 items-center justify-center border-r border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground sm:text-[13px]"
        >
          {prefixUnit}
        </span>
      )}
      <input
        {...props}
        type="number"
        inputMode="decimal"
        autoComplete="off"
        className="h-full w-full min-w-0 bg-transparent px-3 text-sm font-normal text-foreground tabular-nums placeholder:text-muted-foreground focus:outline-none"
      />
      {suffixUnit && (
        <span
          aria-hidden="true"
          className="flex h-full min-w-[40px] shrink-0 items-center justify-center border-l border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground sm:text-[13px]"
        >
          {suffixUnit}
        </span>
      )}
    </div>
  );
}

export function LoanForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: LoanFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const unitSymbol = getCurrencySymbol(draft.currency);
  const hasAdvancedError = Boolean(
    errors.originationFeeValue ||
      errors.extraPaymentAmount ||
      errors.oneTimeExtraAmount ||
      errors.oneTimeExtraPeriod ||
      errors.startDate
  );

  React.useEffect(() => {
    if (hasAdvancedError) {
      setShowAdvanced(true);
    }
  }, [hasAdvancedError]);

  const update = <K extends keyof LoanDraft>(key: K, value: LoanDraft[K]) => {
    onDraftChange({ ...draft, [key]: value });
  };

  const handleTermUnitToggle = (nextUnit: TermUnit) => {
    if (nextUnit === draft.loanTermUnit) return;
    const current = parseDraftNumber(draft.loanTermValue);
    let converted = draft.loanTermValue;
    if (Number.isFinite(current) && current > 0) {
      converted =
        nextUnit === 'months'
          ? String(Math.round(current * 12))
          : String(Number((current / 12).toFixed(2)));
    }
    onDraftChange({ ...draft, loanTermUnit: nextUnit, loanTermValue: converted });
  };

  const handleIoUnitToggle = (nextUnit: TermUnit) => {
    if (nextUnit === draft.interestOnlyUnit) return;
    const current = parseDraftNumber(draft.interestOnlyValue);
    let converted = draft.interestOnlyValue;
    if (Number.isFinite(current) && current > 0) {
      converted =
        nextUnit === 'months'
          ? String(Math.round(current * 12))
          : String(Number((current / 12).toFixed(2)));
    }
    onDraftChange({ ...draft, interestOnlyUnit: nextUnit, interestOnlyValue: converted });
  };

  const handleFeeModeToggle = (nextMode: FeeMode) => {
    if (nextMode === draft.originationFeeMode) return;
    const loanAmt = parseDraftNumber(draft.loanAmount);
    const currentFee = parseDraftNumber(draft.originationFeeValue);
    let converted = draft.originationFeeValue;

    if (Number.isFinite(loanAmt) && loanAmt > 0 && Number.isFinite(currentFee) && currentFee >= 0) {
      converted =
        nextMode === 'percent'
          ? String(Number(((currentFee / loanAmt) * 100).toFixed(2)))
          : String(Number(((loanAmt * currentFee) / 100).toFixed(2)));
    }
    onDraftChange({ ...draft, originationFeeMode: nextMode, originationFeeValue: converted });
  };

  const parsedInput = draftToInput(draft);
  const parsedMonths = resolveTotalMonths(parsedInput.loanTermValue, parsedInput.loanTermUnit);
  const scheduledPeriods =
    Number.isFinite(parsedMonths) && parsedMonths > 0
      ? resolveScheduledPeriods(Math.round(parsedMonths), parsedInput.paymentFrequency)
      : null;

  const oneTimeTargetDate = React.useMemo(() => {
    if (
      !Number.isInteger(parsedInput.oneTimeExtraPeriod) ||
      parsedInput.oneTimeExtraPeriod < 1 ||
      !scheduledPeriods ||
      parsedInput.oneTimeExtraPeriod > scheduledPeriods ||
      !validateLoanInput({
        ...parsedInput,
        loanAmount: 1000,
        annualInterestRate: 0,
        loanTermValue: 1,
        loanTermUnit: 'years',
        originationFeeValue: 0,
        extraPaymentAmount: 0,
        oneTimeExtraAmount: 0,
        oneTimeExtraPeriod: 1,
      }).isValid
    ) {
      return null;
    }
    try {
      return formatDisplayDate(
        getScheduledPaymentDate(
          parsedInput.startDate,
          parsedInput.oneTimeExtraPeriod,
          parsedInput.paymentFrequency
        )
      );
    } catch {
      return null;
    }
  }, [parsedInput, scheduledPeriods]);

  const advancedSummary = React.useMemo(() => {
    const parts: string[] = [];
    if (Number.isFinite(parsedInput.extraPaymentAmount) && parsedInput.extraPaymentAmount > 0) {
      parts.push(`+${formatCurrencyValue(parsedInput.extraPaymentAmount, draft.currency)} extra`);
    }
    if (Number.isFinite(parsedInput.oneTimeExtraAmount) && parsedInput.oneTimeExtraAmount > 0) {
      parts.push(
        `${formatCurrencyValue(parsedInput.oneTimeExtraAmount, draft.currency)} one-time`
      );
    }
    if (Number.isFinite(parsedInput.originationFeeValue) && parsedInput.originationFeeValue > 0) {
      parts.push(
        draft.originationFeeMode === 'percent'
          ? `${draft.originationFeeValue}% fee`
          : `${formatCurrencyValue(parsedInput.originationFeeValue, draft.currency)} fee`
      );
    }
    return parts.length > 0 ? parts.join(' · ') : 'Start date · Extra payments · Origination fee';
  }, [draft, parsedInput]);

  return (
    <form onSubmit={onSubmit} noValidate autoComplete="off" className="space-y-4">
      {/* Loan Mode Selector */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-accent">Loan Type</span>
            <InfoTooltip
              label="Loan type"
              text="Amortized loans pay principal and interest evenly until paid off. Interest-Only loans cover only periodic interest during the I/O phase before principal amortizes."
              align="left"
            />
          </div>

          <SegmentedToggle
            label="Loan calculation mode"
            value={draft.loanMode}
            options={[
              { value: 'amortized', label: 'Amortized' },
              { value: 'interest-only', label: 'Interest-Only' },
            ]}
            onChange={(mode) => update('loanMode', mode)}
          />
        </div>

        {draft.loanMode === 'interest-only' && (
          <div className="rounded-xl border border-border bg-brand-softTeal/50 p-3.5">
            <div className="mb-1 flex min-h-6 items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <label
                  htmlFor="loan-io-period"
                  className="text-[13px] font-medium text-accent"
                >
                  Interest-Only Period
                </label>
                <InfoTooltip
                  label="Interest-only period"
                  text="Duration where scheduled payments cover interest only. Afterward, any remaining balance amortizes over the rest of the term unless equal to the full term."
                  align="left"
                />
              </div>
              <SegmentedToggle
                label="Interest-only period unit"
                value={draft.interestOnlyUnit}
                options={[
                  { value: 'months', label: 'Mo' },
                  { value: 'years', label: 'Yr' },
                ]}
                onChange={handleIoUnitToggle}
              />
            </div>
            <UnitNumberInput
              id="loan-io-period"
              step="any"
              min="1"
              value={draft.interestOnlyValue}
              onChange={(e) => update('interestOnlyValue', e.target.value)}
              suffixUnit={draft.interestOnlyUnit === 'months' ? 'mo' : 'yr'}
              hasError={Boolean(errors.interestOnlyValue)}
              aria-invalid={Boolean(errors.interestOnlyValue)}
              aria-describedby={errors.interestOnlyValue ? 'loan-io-error' : undefined}
            />
            {errors.interestOnlyValue ? (
              <p id="loan-io-error" className="mt-1 text-xs font-normal text-rose-600">
                {errors.interestOnlyValue}
              </p>
            ) : (
              <p className="mt-1.5 text-xs font-normal text-muted-foreground">
                Interest-only payments do not reduce loan principal unless extra payments are made.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pair 1: Loan Amount & Interest Rate */}
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <div className="mb-1 flex min-h-7 items-center gap-1.5">
            <label htmlFor="loan-amount" className="text-[13px] font-medium text-accent">
              Loan Amount
            </label>
            <InfoTooltip
              label="Loan amount"
              text="Total principal amount borrowed before any optional origination fees."
              align="left"
            />
          </div>
          <UnitNumberInput
            id="loan-amount"
            step="any"
            min="1"
            value={draft.loanAmount}
            onChange={(e) => update('loanAmount', e.target.value)}
            prefixUnit={unitSymbol}
            hasError={Boolean(errors.loanAmount)}
            aria-invalid={Boolean(errors.loanAmount)}
            aria-describedby={errors.loanAmount ? 'loan-amount-error' : undefined}
          />
          {errors.loanAmount && (
            <p id="loan-amount-error" className="mt-1 text-xs font-normal text-rose-600">
              {errors.loanAmount}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex min-h-7 items-center gap-1.5">
            <label htmlFor="loan-apr" className="text-[13px] font-medium text-accent">
              Interest Rate (APR)
            </label>
            <InfoTooltip
              label="Annual percentage rate"
              text="Nominal annual rate divided across your payment periods (12 monthly, 26 biweekly, or 52 weekly periods per year)."
              align="right"
            />
          </div>
          <UnitNumberInput
            id="loan-apr"
            step="0.01"
            min="0"
            max="100"
            value={draft.annualInterestRate}
            onChange={(e) => update('annualInterestRate', e.target.value)}
            suffixUnit="%"
            hasError={Boolean(errors.annualInterestRate)}
            aria-invalid={Boolean(errors.annualInterestRate)}
            aria-describedby={errors.annualInterestRate ? 'loan-apr-error' : undefined}
          />
          {errors.annualInterestRate && (
            <p id="loan-apr-error" className="mt-1 text-xs font-normal text-rose-600">
              {errors.annualInterestRate}
            </p>
          )}
        </div>
      </div>

      {/* Pair 2: Loan Term & Payment Frequency */}
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <div className="mb-1 flex min-h-7 items-center justify-between gap-1.5">
            <label htmlFor="loan-term" className="text-[13px] font-medium text-accent">
              Loan Term
            </label>
            <SegmentedToggle
              label="Loan term unit"
              value={draft.loanTermUnit}
              options={[
                { value: 'months', label: 'Mo' },
                { value: 'years', label: 'Yr' },
              ]}
              onChange={handleTermUnitToggle}
            />
          </div>
          <UnitNumberInput
            id="loan-term"
            step="any"
            min="1"
            value={draft.loanTermValue}
            onChange={(e) => update('loanTermValue', e.target.value)}
            suffixUnit={draft.loanTermUnit === 'months' ? 'mo' : 'yr'}
            hasError={Boolean(errors.loanTermValue)}
            aria-invalid={Boolean(errors.loanTermValue)}
            aria-describedby={errors.loanTermValue ? 'loan-term-error' : undefined}
          />
          {errors.loanTermValue && (
            <p id="loan-term-error" className="mt-1 text-xs font-normal text-rose-600">
              {errors.loanTermValue}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex min-h-7 items-center gap-1.5">
            <label htmlFor="loan-frequency" className="text-[13px] font-medium text-accent">
              Payment Frequency
            </label>
            <InfoTooltip
              label="Payment frequency"
              text="Monthly uses 12 payments/year, Biweekly uses 26 payments/year (every 14 days), and Weekly uses 52 payments/year (every 7 days)."
              align="right"
            />
          </div>
          <Select
            id="loan-frequency"
            value={draft.paymentFrequency}
            onChange={(e) => update('paymentFrequency', e.target.value as PaymentFrequency)}
            className="h-11 text-sm"
          >
            <option value="monthly">Monthly (12/yr)</option>
            <option value="biweekly">Biweekly (26/yr)</option>
            <option value="weekly">Weekly (52/yr)</option>
          </Select>
        </div>
      </div>

      {/* Collapsible Advanced Options */}
      <div className="rounded-xl border border-border bg-background/50">
        <button
          type="button"
          aria-expanded={showAdvanced}
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="min-w-0">
            <span className="block text-[13px] font-medium text-accent">Advanced Options</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {advancedSummary}
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-3.5 border-t border-border bg-white/70 p-3.5">
            {/* Recurring Additional Payment */}
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <div>
                <div className="mb-1 flex min-h-6 items-center gap-1">
                  <label htmlFor="loan-extra-amount" className="text-[13px] font-medium text-accent">
                    Additional Payment
                  </label>
                  <InfoTooltip
                    label="Additional principal payment"
                    text="Extra amount applied directly toward principal to shorten payoff time and reduce interest."
                    align="left"
                  />
                </div>
                <UnitNumberInput
                  id="loan-extra-amount"
                  step="any"
                  min="0"
                  value={draft.extraPaymentAmount}
                  onChange={(e) => update('extraPaymentAmount', e.target.value)}
                  prefixUnit={unitSymbol}
                  hasError={Boolean(errors.extraPaymentAmount)}
                  aria-invalid={Boolean(errors.extraPaymentAmount)}
                />
                {errors.extraPaymentAmount && (
                  <p className="mt-1 text-xs font-normal text-rose-600">
                    {errors.extraPaymentAmount}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1 flex min-h-6 items-center">
                  <label htmlFor="loan-extra-freq" className="text-[13px] font-medium text-accent">
                    Extra Frequency
                  </label>
                </div>
                <Select
                  id="loan-extra-freq"
                  value={draft.extraPaymentFrequency}
                  onChange={(e) =>
                    update('extraPaymentFrequency', e.target.value as ExtraPaymentFrequency)
                  }
                  className="h-11 text-sm"
                >
                  <option value="every-payment">Every Payment</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </div>
            </div>

            {/* One-Time Extra Payment */}
            <div>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <div>
                  <div className="mb-1 flex min-h-6 items-center gap-1">
                    <label
                      htmlFor="loan-onetime-amount"
                      className="text-[13px] font-medium text-accent"
                    >
                      One-Time Extra
                    </label>
                    <InfoTooltip
                      label="One-time extra principal payment"
                      text="Lump-sum principal reduction applied on a single scheduled payment number (capped at remaining balance)."
                      align="left"
                    />
                  </div>
                  <UnitNumberInput
                    id="loan-onetime-amount"
                    step="any"
                    min="0"
                    value={draft.oneTimeExtraAmount}
                    onChange={(e) => update('oneTimeExtraAmount', e.target.value)}
                    prefixUnit={unitSymbol}
                    hasError={Boolean(errors.oneTimeExtraAmount)}
                    aria-invalid={Boolean(errors.oneTimeExtraAmount)}
                  />
                  {errors.oneTimeExtraAmount && (
                    <p className="mt-1 text-xs font-normal text-rose-600">
                      {errors.oneTimeExtraAmount}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex min-h-6 items-center">
                    <label
                      htmlFor="loan-onetime-period"
                      className="text-[13px] font-medium text-accent"
                    >
                      At Payment #
                    </label>
                  </div>
                  <UnitNumberInput
                    id="loan-onetime-period"
                    step="1"
                    min="1"
                    max={scheduledPeriods ?? undefined}
                    value={draft.oneTimeExtraPeriod}
                    onChange={(e) => update('oneTimeExtraPeriod', e.target.value)}
                    prefixUnit="#"
                    hasError={Boolean(errors.oneTimeExtraPeriod)}
                    aria-invalid={Boolean(errors.oneTimeExtraPeriod)}
                  />
                  {errors.oneTimeExtraPeriod && (
                    <p className="mt-1 text-xs font-normal text-rose-600">
                      {errors.oneTimeExtraPeriod}
                    </p>
                  )}
                </div>
              </div>
              {oneTimeTargetDate && Number(draft.oneTimeExtraAmount) > 0 && !errors.oneTimeExtraPeriod && (
                <p className="mt-1.5 text-xs font-normal text-muted-foreground">
                  Applied on Payment #{draft.oneTimeExtraPeriod} ({oneTimeTargetDate})
                </p>
              )}
            </div>

            {/* Origination Fee & Handling */}
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <div>
                <div className="mb-1 flex min-h-6 items-center justify-between gap-1">
                  <label htmlFor="loan-fee" className="text-[13px] font-medium text-accent">
                    Origination Fee
                  </label>
                  <SegmentedToggle
                    label="Origination fee mode"
                    value={draft.originationFeeMode}
                    options={[
                      { value: 'amount', label: draft.currency },
                      { value: 'percent', label: '%' },
                    ]}
                    onChange={handleFeeModeToggle}
                  />
                </div>
                <UnitNumberInput
                  id="loan-fee"
                  step="any"
                  min="0"
                  value={draft.originationFeeValue}
                  onChange={(e) => update('originationFeeValue', e.target.value)}
                  prefixUnit={draft.originationFeeMode === 'amount' ? unitSymbol : undefined}
                  suffixUnit={draft.originationFeeMode === 'percent' ? '%' : undefined}
                  hasError={Boolean(errors.originationFeeValue)}
                  aria-invalid={Boolean(errors.originationFeeValue)}
                />
                {errors.originationFeeValue && (
                  <p className="mt-1 text-xs font-normal text-rose-600">
                    {errors.originationFeeValue}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1 flex min-h-6 items-center gap-1">
                  <label
                    htmlFor="loan-fee-inclusion"
                    className="text-[13px] font-medium text-accent"
                  >
                    Fee Handling
                  </label>
                  <InfoTooltip
                    label="Origination fee handling"
                    text="Upfront fees are paid at closing without changing loan principal. Financed fees are added into the loan balance."
                    align="right"
                  />
                </div>
                <Select
                  id="loan-fee-inclusion"
                  value={draft.feeInclusion}
                  onChange={(e) => update('feeInclusion', e.target.value as FeeInclusion)}
                  className="h-11 text-sm"
                >
                  <option value="upfront">Pay Upfront</option>
                  <option value="finance">Roll Into Loan</option>
                </Select>
              </div>
            </div>

            {/* Loan Start Date */}
            <div>
              <div className="mb-1 flex min-h-6 items-center">
                <label htmlFor="loan-start-date" className="text-[13px] font-medium text-accent">
                  Loan Start Date
                </label>
              </div>
              <Input
                id="loan-start-date"
                type="date"
                autoComplete="off"
                value={draft.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                aria-invalid={Boolean(errors.startDate)}
                className={`h-11 text-sm ${errors.startDate ? 'border-rose-500' : ''}`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs font-normal text-rose-600">{errors.startDate}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
          Calculate
        </Button>
        <Button type="button" variant="outline" onClick={onReset} className="h-11 font-medium">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>
    </form>
  );
}

