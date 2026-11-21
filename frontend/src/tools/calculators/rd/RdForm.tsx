'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { RdFieldErrors, RdInput, RdResult, RdTermUnit } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring sm:w-[120px]';

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

interface RdFormProps {
  input: RdInput;
  errors: RdFieldErrors;
  result: RdResult | null;
  onChange: (input: RdInput) => void;
  onDepositCurrencyChange: (next: SupportedCurrency) => void;
  onTotalDepositsCurrencyChange: (next: SupportedCurrency) => void;
  onTotalInterestCurrencyChange: (next: SupportedCurrency) => void;
  onMaturityCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RdForm({
  input,
  errors,
  result,
  onChange,
  onDepositCurrencyChange,
  onTotalDepositsCurrencyChange,
  onTotalInterestCurrencyChange,
  onMaturityCurrencyChange,
  onLoadExample,
  conversionError = null,
  ratesWarning = null,
}: RdFormProps) {
  const set = (patch: Partial<RdInput>) => onChange({ ...input, ...patch });
  const depositSym = getCurrencySymbol(input.monthlyDepositCurrency);
  const depositsSym = getCurrencySymbol(input.totalDepositsCurrency);
  const interestSym = getCurrencySymbol(input.totalInterestCurrency);
  const maturitySym = getCurrencySymbol(input.maturityCurrency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Bank-style recurring deposit: monthly deposits with{' '}
        <strong>quarterly compounding</strong> (i = r/400). Money fields use
        independent currencies; term and % never convert.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (PKR 5,000/mo · 5 yrs · 6%)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="rd-deposit">
          <span>Monthly deposit</span>
          <InfoTooltip
            label="Monthly deposit"
            text="Fixed amount deposited at the end of each month for the RD term."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.monthlyDeposit}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {depositSym}
            </span>
            <input
              id="rd-deposit"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyDeposit}
              aria-invalid={Boolean(errors.monthlyDeposit)}
              onChange={(e) => set({ monthlyDeposit: e.target.value })}
            />
          </FieldShell>
          <CurrencySelect
            id="rd-deposit-currency"
            value={input.monthlyDepositCurrency}
            onChange={onDepositCurrencyChange}
            aria-label="Monthly deposit currency"
          />
        </div>
        {errors.monthlyDeposit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.monthlyDeposit}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rd-term">
          <span>RD term</span>
          <InfoTooltip
            label="RD term"
            text="Length of the recurring deposit. Switch between years and months."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.term}>
            <input
              id="rd-term"
              className={inputClass}
              inputMode="decimal"
              value={input.term}
              aria-invalid={Boolean(errors.term)}
              onChange={(e) => set({ term: e.target.value })}
            />
          </FieldShell>
          <select
            id="rd-term-unit"
            className={selectClass}
            value={input.termUnit}
            aria-label="Term unit"
            onChange={(e) =>
              set({ termUnit: e.target.value as RdTermUnit })
            }
          >
            <option value="years">yrs</option>
            <option value="months">mos</option>
          </select>
        </div>
        {errors.term ? (
          <p className="mt-1 text-xs text-rose-600">{errors.term}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rd-rate">
          <span>Interest rate</span>
          <InfoTooltip
            label="Interest rate"
            text="Nominal annual interest rate percent. Compounded quarterly in this calculator."
          />
        </label>
        <FieldShell error={errors.annualRatePercent}>
          <input
            id="rd-rate"
            className={inputClass}
            inputMode="decimal"
            value={input.annualRatePercent}
            aria-invalid={Boolean(errors.annualRatePercent)}
            onChange={(e) => set({ annualRatePercent: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.annualRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualRatePercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rd-total-deposits">
          <span>Total deposits</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {depositsSym}
            </span>
            <input
              id="rd-total-deposits"
              className={inputClass}
              readOnly
              tabIndex={0}
              value={result?.formattedTotalDeposits ?? ''}
              aria-label="Total deposits result"
            />
          </FieldShell>
          <CurrencySelect
            id="rd-total-deposits-currency"
            value={input.totalDepositsCurrency}
            onChange={onTotalDepositsCurrencyChange}
            aria-label="Total deposits currency"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rd-total-interest">
          <span>Total interest</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {interestSym}
            </span>
            <input
              id="rd-total-interest"
              className={inputClass}
              readOnly
              tabIndex={0}
              value={result?.formattedTotalInterest ?? ''}
              aria-label="Total interest result"
            />
          </FieldShell>
          <CurrencySelect
            id="rd-total-interest-currency"
            value={input.totalInterestCurrency}
            onChange={onTotalInterestCurrencyChange}
            aria-label="Total interest currency"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rd-maturity">
          <span>Maturity amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {maturitySym}
            </span>
            <input
              id="rd-maturity"
              className={inputClass}
              readOnly
              tabIndex={0}
              value={result?.formattedMaturity ?? ''}
              aria-label="Maturity amount result"
            />
          </FieldShell>
          <CurrencySelect
            id="rd-maturity-currency"
            value={input.maturityCurrency}
            onChange={onMaturityCurrencyChange}
            aria-label="Maturity currency"
          />
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
