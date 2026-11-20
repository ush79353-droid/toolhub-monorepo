'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HousingExpenseMode,
  Rule2836FieldErrors,
  Rule2836Input,
  Rule2836Result,
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

function ReadOnlyMoney({
  id,
  label,
  tip,
  symbol,
  display,
}: {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  display: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell muted>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default text-muted-foreground`}
          value={display}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

function ReadOnlyPercent({
  id,
  label,
  tip,
  display,
}: {
  id: string;
  label: string;
  tip: string;
  display: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell muted>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default text-muted-foreground`}
          value={display ? `${display}%` : ''}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
    </div>
  );
}

interface Rule2836FormProps {
  input: Rule2836Input;
  errors: Rule2836FieldErrors;
  result: Rule2836Result | null;
  onChange: (input: Rule2836Input) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function Rule2836Form({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: Rule2836FormProps) {
  const [frontOpen, setFrontOpen] = useState(true);
  const [backOpen, setBackOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<Rule2836Input>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: HousingExpenseMode) => {
    set({ housingExpenseMode: mode });
  };

  const housingDisplay = result?.formattedMonthlyHousingCosts ?? '';
  const frontDisplay = result?.formattedFrontEndRatio ?? '';
  const totalDebtDisplay = result?.formattedTotalMonthlyDebt ?? '';
  const backDisplay = result?.formattedBackEndRatio ?? '';

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
          id="r2836-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for 28/36 rule amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX). Use gross
        monthly income, not take-home pay.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate the 28/36 rule
        </a>
      </p>

      <CollapsibleSection
        title="Front-end ratio (28% rule)"
        open={frontOpen}
        onToggle={() => setFrontOpen((o) => !o)}
      >
        <MoneyField
          id="r2836-income"
          label="Income"
          tip="Enter total gross monthly household income before taxes, insurance deductions, retirement contributions, and other payroll deductions. Do not use net monthly income for the 28/36 rule."
          value={input.grossMonthlyIncome}
          error={errors.grossMonthlyIncome}
          symbol={symbol}
          onChange={(v) => set({ grossMonthlyIncome: v })}
        />

        <fieldset>
          <legend className={labelClass}>
            Do you want to input individual housing expenses separately?
            <InfoTooltip
              label="Housing expense mode"
              text="Choose No for one combined housing payment, or Yes to break out mortgage, taxes, insurance, HOA, and other housing costs. Only one mode is used — costs are never double-counted."
            />
          </legend>
          <div
            className="mt-1.5 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Housing expense input mode"
          >
            {(
              [
                { value: 'combined' as const, label: 'No' },
                { value: 'itemized' as const, label: 'Yes' },
              ] as const
            ).map((opt) => {
              const selected = input.housingExpenseMode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`h-11 min-w-[4.5rem] rounded-lg border px-4 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-white text-accent hover:bg-muted/30'
                  }`}
                  onClick={() => setMode(opt.value)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {input.housingExpenseMode === 'combined' ? (
          <MoneyField
            id="r2836-housing"
            label="Housing costs"
            tip="Estimated total monthly housing payment: mortgage principal and interest, property taxes, homeowners insurance, required HOA dues, and other recurring housing costs a lender may include."
            value={input.combinedHousingCosts}
            error={errors.combinedHousingCosts}
            symbol={symbol}
            onChange={(v) => set({ combinedHousingCosts: v })}
          />
        ) : (
          <>
            <MoneyField
              id="r2836-mortgage"
              label="Monthly mortgage principal and interest"
              tip="Monthly principal and interest payment on the mortgage (not including escrowed taxes or insurance)."
              value={input.mortgagePrincipalAndInterest}
              error={errors.mortgagePrincipalAndInterest}
              symbol={symbol}
              onChange={(v) => set({ mortgagePrincipalAndInterest: v })}
            />
            <MoneyField
              id="r2836-taxes"
              label="Monthly property taxes"
              tip="Property taxes on a monthly basis (annual tax ÷ 12 if billed yearly)."
              value={input.propertyTaxes}
              error={errors.propertyTaxes}
              symbol={symbol}
              onChange={(v) => set({ propertyTaxes: v })}
            />
            <MoneyField
              id="r2836-insurance"
              label="Monthly homeowners insurance"
              tip="Homeowners insurance premium on a monthly basis."
              value={input.homeownersInsurance}
              error={errors.homeownersInsurance}
              symbol={symbol}
              onChange={(v) => set({ homeownersInsurance: v })}
            />
            <MoneyField
              id="r2836-hoa"
              label="Monthly HOA or condominium fees"
              tip="Required homeowners association or condo fees, if any."
              value={input.hoaFees}
              error={errors.hoaFees}
              symbol={symbol}
              onChange={(v) => set({ hoaFees: v })}
            />
            <MoneyField
              id="r2836-other-housing"
              label="Other monthly housing expenses"
              tip="Other recurring housing costs a lender may count (for example mortgage insurance). Leave blank if none."
              value={input.otherHousingExpenses}
              error={errors.otherHousingExpenses}
              symbol={symbol}
              onChange={(v) => set({ otherHousingExpenses: v })}
            />
            <ReadOnlyMoney
              id="r2836-housing-total"
              label="Housing costs"
              tip="Sum of mortgage P&I, property taxes, insurance, HOA, and other housing expenses."
              symbol={symbol}
              display={housingDisplay}
            />
          </>
        )}

        <ReadOnlyPercent
          id="r2836-fer"
          label="Front-end ratio"
          tip="Housing costs ÷ gross monthly income × 100. The 28% guideline is a common front-end limit."
          display={frontDisplay}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Back-end ratio (36% rule)"
        open={backOpen}
        onToggle={() => setBackOpen((o) => !o)}
      >
        <MoneyField
          id="r2836-other-debts"
          label="Other debts"
          tip="Total monthly payments on qualifying debts other than housing already entered — auto loans, student loans, personal loans, minimum credit card payments, and similar. Do not include the housing payment again."
          value={input.otherMonthlyDebts}
          error={errors.otherMonthlyDebts}
          symbol={symbol}
          onChange={(v) => set({ otherMonthlyDebts: v })}
        />
        <ReadOnlyMoney
          id="r2836-total-debt"
          label="Total debt"
          tip="Housing costs + other monthly debts."
          symbol={symbol}
          display={totalDebtDisplay}
        />
        <ReadOnlyPercent
          id="r2836-ber"
          label="Back-end ratio"
          tip="Total monthly debt ÷ gross monthly income × 100. The 36% guideline is a common back-end limit."
          display={backDisplay}
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
