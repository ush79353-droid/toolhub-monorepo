'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RentalCommissionFieldErrors,
  RentalCommissionInput,
  RentalCommissionResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function SectionCard({
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
    <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span className="text-[13px] font-semibold text-accent">{title}</span>
      </button>
      {open ? <div className="mt-3.5 space-y-3.5">{children}</div> : null}
    </fieldset>
  );
}

interface RentalCommissionFormProps {
  input: RentalCommissionInput;
  errors: RentalCommissionFieldErrors;
  result: RentalCommissionResult | null;
  conversionError: string | null;
  ratesWarning?: string | null;
  onChange: (input: RentalCommissionInput) => void;
  onAnnualCurrencyChange: (currency: SupportedCurrency) => void;
  onMonthlyCurrencyChange: (currency: SupportedCurrency) => void;
  onResultCurrencyChange: (
    field:
      | 'halfMonthCurrency'
      | 'oneMonthCurrency'
      | 'oneHalfMonthCurrency'
      | 'customAmountCurrency',
    currency: SupportedCurrency
  ) => void;
}

export function RentalCommissionForm({
  input,
  errors,
  result,
  conversionError,
  ratesWarning = null,
  onChange,
  onAnnualCurrencyChange,
  onMonthlyCurrencyChange,
  onResultCurrencyChange,
}: RentalCommissionFormProps) {
  const [commissionOpen, setCommissionOpen] = React.useState(true);
  const [customOpen, setCustomOpen] = React.useState(true);

  const annualSymbol = getCurrencySymbol(input.annualCurrency);
  const monthlySymbol = getCurrencySymbol(input.monthlyCurrency);
  const halfSymbol = getCurrencySymbol(input.halfMonthCurrency);
  const oneSymbol = getCurrencySymbol(input.oneMonthCurrency);
  const oneHalfSymbol = getCurrencySymbol(input.oneHalfMonthCurrency);
  const customSymbol = getCurrencySymbol(input.customAmountCurrency);

  const set = (patch: Partial<RentalCommissionInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Rental Details</legend>

        <div>
          <label className={labelClass} htmlFor="rc-annual">
            <span>Annual rent</span>
            <InfoTooltip
              label="Annual rent"
              text="Total rent for 12 months. Editing this field updates monthly rent (÷ 12). Changing currency converts this amount using live rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualRent}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {annualSymbol}
              </span>
              <input
                id="rc-annual"
                className={`${inputClass} pl-1`}
                inputMode="decimal"
                value={input.annualRent}
                aria-invalid={Boolean(errors.annualRent)}
                onChange={(e) =>
                  set({ annualRent: e.target.value, rentSource: 'annual' })
                }
              />
            </FieldShell>
            <CurrencySelect
              id="rc-annual-currency"
              value={input.annualCurrency}
              onChange={onAnnualCurrencyChange}
              aria-label="Annual rent currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
          {errors.annualRent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualRent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rc-monthly">
            <span>Monthly rent</span>
            <InfoTooltip
              label="Monthly rent"
              text="Rent for one month. Editing this field updates annual rent (× 12). Changing currency converts this amount using live rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.monthlyRent}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {monthlySymbol}
              </span>
              <input
                id="rc-monthly"
                className={`${inputClass} pl-1`}
                inputMode="decimal"
                value={input.monthlyRent}
                aria-invalid={Boolean(errors.monthlyRent)}
                onChange={(e) =>
                  set({ monthlyRent: e.target.value, rentSource: 'monthly' })
                }
              />
            </FieldShell>
            <CurrencySelect
              id="rc-monthly-currency"
              value={input.monthlyCurrency}
              onChange={onMonthlyCurrencyChange}
              aria-label="Monthly rent currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
          {errors.monthlyRent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyRent}</p>
          ) : null}
        </div>
      </fieldset>

      <SectionCard
        title="Commission"
        open={commissionOpen}
        onToggle={() => setCommissionOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="rc-half">
            <span>½ month (4.17%)</span>
            <InfoTooltip
              label="½ month commission"
              text="Exact half of monthly rent (monthly × 0.5). The 4.17% label is an annual-rent approximation only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {halfSymbol}
              </span>
              <input
                id="rc-half"
                className={`${inputClass} pl-1 text-muted-foreground`}
                readOnly
                tabIndex={-1}
                value={result ? result.formattedHalfMonth : ''}
                aria-live="polite"
              />
            </FieldShell>
            <CurrencySelect
              id="rc-half-currency"
              value={input.halfMonthCurrency}
              onChange={(c) => onResultCurrencyChange('halfMonthCurrency', c)}
              aria-label="Half-month commission currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rc-one">
            <span>1 month (8.33%)</span>
            <InfoTooltip
              label="1 month commission"
              text="Exactly one month of rent. The 8.33% label is an annual-rent approximation only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {oneSymbol}
              </span>
              <input
                id="rc-one"
                className={`${inputClass} pl-1 text-muted-foreground`}
                readOnly
                tabIndex={-1}
                value={result ? result.formattedOneMonth : ''}
                aria-live="polite"
              />
            </FieldShell>
            <CurrencySelect
              id="rc-one-currency"
              value={input.oneMonthCurrency}
              onChange={(c) => onResultCurrencyChange('oneMonthCurrency', c)}
              aria-label="One-month commission currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rc-one-half">
            <span>1½ months (12.5%)</span>
            <InfoTooltip
              label="1½ months commission"
              text="Exactly one and a half months of rent (monthly × 1.5). The 12.5% label matches annual rent × 12.5%."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {oneHalfSymbol}
              </span>
              <input
                id="rc-one-half"
                className={`${inputClass} pl-1 text-muted-foreground`}
                readOnly
                tabIndex={-1}
                value={result ? result.formattedOneHalfMonth : ''}
                aria-live="polite"
              />
            </FieldShell>
            <CurrencySelect
              id="rc-one-half-currency"
              value={input.oneHalfMonthCurrency}
              onChange={(c) => onResultCurrencyChange('oneHalfMonthCurrency', c)}
              aria-label="One-and-a-half-month commission currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Custom commission"
        open={customOpen}
        onToggle={() => setCustomOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="rc-custom-pct">
            <span>Custom percentage</span>
            <InfoTooltip
              label="Custom percentage"
              text="Percent of annual rent. Never currency-converted. Custom amount = annual × percent ÷ 100."
            />
          </label>
          <FieldShell error={errors.customPercent}>
            <input
              id="rc-custom-pct"
              className={inputClass}
              inputMode="decimal"
              value={input.customPercent}
              aria-invalid={Boolean(errors.customPercent)}
              onChange={(e) => set({ customPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-primary" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.customPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.customPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rc-custom-amt">
            <span>Custom amount</span>
            <InfoTooltip
              label="Custom amount"
              text="Annual rent × custom percentage ÷ 100, shown in the selected currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {customSymbol}
              </span>
              <input
                id="rc-custom-amt"
                className={`${inputClass} pl-1 text-muted-foreground`}
                readOnly
                tabIndex={-1}
                value={result ? result.formattedCustomAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <CurrencySelect
              id="rc-custom-amt-currency"
              value={input.customAmountCurrency}
              onChange={(c) => onResultCurrencyChange('customAmountCurrency', c)}
              aria-label="Custom commission currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
        </div>
      </SectionCard>

      {conversionError ? (
        <p className="text-xs text-amber-800">{conversionError}</p>
      ) : null}
      {!conversionError && ratesWarning ? (
        <p className="text-xs text-amber-800">{ratesWarning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
