'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AprFieldErrors,
  AprInput,
  AprResult,
  FeeTreatment,
  OriginationFeeType,
  PaymentFrequency,
  TermUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function Segmented<T extends string>({
  label,
  tip,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  label: string;
  tip: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </legend>
      <div
        className="mt-1.5 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`h-11 min-w-[4.5rem] rounded-lg border px-3 text-sm font-medium transition-colors ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface AprFormProps {
  input: AprInput;
  errors: AprFieldErrors;
  result: AprResult | null;
  onChange: (input: AprInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

const FREQ_OPTIONS: readonly { value: PaymentFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semiannual', label: 'Semiannual' },
  { value: 'annual', label: 'Annual' },
];

const FEE_TYPE_OPTIONS: readonly {
  value: OriginationFeeType;
  label: string;
}[] = [
  { value: 'fixed', label: 'Fixed amount' },
  { value: 'percentage', label: '% of principal' },
];

const TREATMENT_OPTIONS: readonly { value: FeeTreatment; label: string }[] = [
  { value: 'deducted', label: 'Deducted from proceeds' },
  { value: 'financed', label: 'Added to loan balance' },
  { value: 'paid-upfront', label: 'Paid separately upfront' },
];

export function AprForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: AprFormProps) {
  const [loanOpen, setLoanOpen] = useState(true);
  const [feesOpen, setFeesOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<AprInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="apr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for APR calculator amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX). APR is
        estimated from borrower cash flows, not a simple interest-plus-fees
        shortcut.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate APR
        </a>
      </p>

      <CollapsibleSection
        title="Loan details"
        open={loanOpen}
        onToggle={() => setLoanOpen((o) => !o)}
      >
        <MoneyField
          id="apr-loan"
          label="Loan amount"
          tip="Enter the original principal borrowed before considering upfront deductions or additional financed fees."
          value={input.loanAmount}
          error={errors.loanAmount}
          symbol={symbol}
          onChange={(v) => set({ loanAmount: v })}
        />

        <div>
          <label htmlFor="apr-term" className={labelClass}>
            Loan term
            <InfoTooltip
              label="Loan term"
              text="Positive term in years or months. Must produce a whole number of payments for the selected frequency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanTerm}>
              <input
                id="apr-term"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.loanTerm}
                onChange={(e) => set({ loanTerm: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.loanTerm)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.loanTermUnit}
              aria-label="Loan term unit"
              onChange={(e) =>
                set({ loanTermUnit: e.target.value as TermUnit })
              }
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
          {errors.loanTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="apr-rate" className={labelClass}>
            Interest rate
            <InfoTooltip
              label="Interest rate"
              text="Annual nominal interest rate used for amortizing payments. This is not the APR result."
            />
          </label>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="apr-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.annualInterestRate}
              onChange={(e) => set({ annualInterestRate: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.annualInterestRate)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualInterestRate}
            </p>
          ) : null}
        </div>

        <Segmented
          label="Payment frequency"
          tip="Number of scheduled payments per year. Periodic rate = nominal annual rate ÷ periods per year."
          value={input.paymentFrequency}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ paymentFrequency: v })}
          ariaLabel="Payment frequency"
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Additional loan costs"
        open={feesOpen}
        onToggle={() => setFeesOpen((o) => !o)}
      >
        <Segmented
          label="Origination fee type"
          tip="Enter the origination fee as a fixed amount or as a percentage of the loan principal."
          value={input.originationFeeType}
          options={FEE_TYPE_OPTIONS}
          onChange={(v) => set({ originationFeeType: v })}
          ariaLabel="Origination fee type"
        />

        {input.originationFeeType === 'fixed' ? (
          <MoneyField
            id="apr-orig"
            label="Loan origination fee"
            tip="Qualifying origination or similar lender finance charge. Blank is treated as zero."
            value={input.originationFee}
            error={errors.originationFee}
            symbol={symbol}
            onChange={(v) => set({ originationFee: v })}
          />
        ) : (
          <div>
            <label htmlFor="apr-orig-pct" className={labelClass}>
              Loan origination fee
              <InfoTooltip
                label="Loan origination fee"
                text="Percentage of principal. Blank is treated as zero."
              />
            </label>
            <FieldShell error={errors.originationFee}>
              <input
                id="apr-orig-pct"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.originationFee}
                onChange={(e) => set({ originationFee: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.originationFee)}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.originationFee ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.originationFee}
              </p>
            ) : null}
          </div>
        )}

        <MoneyField
          id="apr-other"
          label="Other finance charges"
          tip="Other qualifying finance charges included in this estimate. Not all closing costs or third-party fees belong in APR."
          value={input.otherFinanceCharges}
          error={errors.otherFinanceCharges}
          symbol={symbol}
          onChange={(v) => set({ otherFinanceCharges: v })}
        />

        <Segmented
          label="How are the fees paid?"
          tip="Deducted: net proceeds = loan − fees, payments on face amount. Financed: payments on loan + fees, proceeds = loan. Paid separately: same cash-flow net as deducted for this estimate."
          value={input.feeTreatment}
          options={TREATMENT_OPTIONS}
          onChange={(v) => set({ feeTreatment: v })}
          ariaLabel="Fee treatment"
        />
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
