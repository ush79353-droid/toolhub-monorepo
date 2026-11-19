'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import type { SipFieldErrors, SipInput, SipResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface SipFormProps {
  input: SipInput;
  errors: SipFieldErrors;
  result: SipResult | null;
  onChange: (input: SipInput) => void;
  onMonthlyCurrencyChange: (next: SupportedCurrency) => void;
  onTotalCurrencyChange: (next: SupportedCurrency) => void;
  onMaturityCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function SipForm({
  input,
  errors,
  result,
  onChange,
  onMonthlyCurrencyChange,
  onTotalCurrencyChange,
  onMaturityCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SipFormProps) {
  const monthlySymbol = getCurrencySymbol(input.monthlyAmountCurrency);
  const totalSymbol = getCurrencySymbol(input.totalInvestmentCurrency);
  const maturitySymbol = getCurrencySymbol(input.maturityCurrency);
  const set = (patch: Partial<SipInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="sip-p">
            Monthly SIP amount (P)
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.monthlyAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {monthlySymbol}
              </span>
              <input
                id="sip-p"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyAmount}
                aria-invalid={Boolean(errors.monthlyAmount)}
                onChange={(e) => set({ monthlyAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sip-p-currency"
                value={input.monthlyAmountCurrency}
                onChange={onMonthlyCurrencyChange}
                aria-label="Monthly SIP currency"
              />
            </div>
          </div>
          {errors.monthlyAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyAmount}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="sip-t">
            Investment period (t)
          </label>
          <FieldShell error={errors.years}>
            <input
              id="sip-t"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.years}
              aria-invalid={Boolean(errors.years)}
              onChange={(e) => set({ years: e.target.value })}
            />
            <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.years ? (
            <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="sip-r">
            Expected rate of return (r)
          </label>
          <FieldShell error={errors.annualReturnPercent}>
            <input
              id="sip-r"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualReturnPercent}
              aria-invalid={Boolean(errors.annualReturnPercent)}
              onChange={(e) => set({ annualReturnPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.annualReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualReturnPercent}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-accent">Return</h3>
        <div>
          <label className={labelClass} htmlFor="sip-total">
            Total investment
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalSymbol}
              </span>
              <input
                id="sip-total"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedTotalInvestment ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sip-total-currency"
                value={input.totalInvestmentCurrency}
                onChange={onTotalCurrencyChange}
                aria-label="Total investment currency"
              />
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="sip-maturity">
            Maturity amount
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {maturitySymbol}
              </span>
              <input
                id="sip-maturity"
                className={inputClass}
                readOnly
                tabIndex={-1}
                value={result?.formattedMaturity ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="sip-maturity-currency"
                value={input.maturityCurrency}
                onChange={onMaturityCurrencyChange}
                aria-label="Maturity amount currency"
              />
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="sip-factor">
            Investment multiplication factor
          </label>
          <FieldShell muted>
            <input
              id="sip-factor"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedFactor ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
