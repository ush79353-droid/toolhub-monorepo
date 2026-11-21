'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  basePayLabel,
  type SalaryFrequency,
  type SellingLeaveDaysFieldErrors,
  type SellingLeaveDaysInput,
  type SellingLeaveDaysResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'shrink-0 pr-3 text-xs text-muted-foreground whitespace-nowrap';

const FREQUENCIES: { value: SalaryFrequency; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'hourly', label: 'Hourly' },
];

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

interface SellingLeaveDaysFormProps {
  input: SellingLeaveDaysInput;
  errors: SellingLeaveDaysFieldErrors;
  result: SellingLeaveDaysResult | null;
  onChange: (input: SellingLeaveDaysInput) => void;
  onBaseCurrencyChange: (next: SupportedCurrency) => void;
  onResultCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function SellingLeaveDaysForm({
  input,
  errors,
  result,
  onChange,
  onBaseCurrencyChange,
  onResultCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SellingLeaveDaysFormProps) {
  const set = (patch: Partial<SellingLeaveDaysInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Enter your base pay as well as your desired number of leave days to sell
        to find out how much you can earn by selling your leave!
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>How is your salary paid?</span>
          <InfoTooltip
            label="Salary frequency"
            text="Choose how your base pay is quoted. Changing frequency keeps the entered amount and reinterprets it in the new period."
          />
        </legend>
        <div
          className="flex flex-wrap gap-x-4 gap-y-2"
          role="radiogroup"
          aria-label="Salary payment frequency"
        >
          {FREQUENCIES.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="sld-frequency"
                value={option.value}
                checked={input.frequency === option.value}
                onChange={() => set({ frequency: option.value })}
                className="h-4 w-4 accent-primary"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="sld-base-pay">
          <span>{basePayLabel(input.frequency)}</span>
          <InfoTooltip
            label="Base pay"
            text="Gross base pay for the selected frequency. Independent currency; leave days never FX-convert."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.basePay}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {getCurrencySymbol(input.basePayCurrency)}
            </span>
            <input
              id="sld-base-pay"
              className={inputClass}
              inputMode="decimal"
              value={input.basePay}
              aria-invalid={Boolean(errors.basePay)}
              onChange={(e) => set({ basePay: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sld-base-currency"
              value={input.basePayCurrency}
              onChange={onBaseCurrencyChange}
              aria-label="Base pay currency"
            />
          </div>
        </div>
        {errors.basePay ? (
          <p className="mt-1 text-xs text-rose-600">{errors.basePay}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="sld-leave-days">
          <span>Leave days to sell</span>
          <InfoTooltip
            label="Leave days to sell"
            text="Number of unused paid leave days to convert to cash. Fractional days allowed. Never FX-converted."
          />
        </label>
        <FieldShell error={errors.leaveDays}>
          <input
            id="sld-leave-days"
            className={inputClass}
            inputMode="decimal"
            value={input.leaveDays}
            aria-invalid={Boolean(errors.leaveDays)}
            onChange={(e) => set({ leaveDays: e.target.value })}
          />
          <span className={unitClass}>days</span>
        </FieldShell>
        {errors.leaveDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.leaveDays}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="sld-payout">
          <span>Amount you can earn</span>
          <InfoTooltip
            label="Amount you can earn"
            text="Working-day estimate: Daily pay × leave days. Uses 260 working days/year (52×5), 8 hours/day. Not a statutory entitlement."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {getCurrencySymbol(input.resultCurrency)}
            </span>
            <input
              id="sld-payout"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedPayout ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sld-result-currency"
              value={input.resultCurrency}
              onChange={onResultCurrencyChange}
              aria-label="Result currency"
            />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Working-day estimate (260 days/year · 5 days/week · 8 hours/day). Not
          tax or statutory leave-encashment advice.
        </p>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
