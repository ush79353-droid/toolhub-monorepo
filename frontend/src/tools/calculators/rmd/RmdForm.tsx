'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { RMD_AGES } from './uniform-lifetime-table';
import type { RmdFieldErrors, RmdInput, RmdResult, YesNo } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface RmdFormProps {
  input: RmdInput;
  errors: RmdFieldErrors;
  result: RmdResult | null;
  onChange: (input: RmdInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onRmdCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RmdForm({
  input,
  errors,
  result,
  onChange,
  onBalanceCurrencyChange,
  onRmdCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: RmdFormProps) {
  const balanceSymbol = getCurrencySymbol(input.accountBalanceCurrency);
  const rmdSymbol = getCurrencySymbol(input.rmdCurrency);
  const set = (patch: Partial<RmdInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <div className={labelClass}>
            <span>Is spouse more than 10 years younger and the sole beneficiary of IRA?</span>
            <InfoTooltip
              label="Spouse beneficiary rule"
              text="If Yes, IRS Joint Life Table II applies and requires spouse age; not collected here, so RMD is unavailable for that path."
            />
          </div>
          <div className="flex flex-wrap gap-4" role="radiogroup">
            {(['no', 'yes'] as const).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="rmd-spouse"
                  className="h-4 w-4 accent-primary"
                  checked={input.spouseYoungerSoleBeneficiary === v}
                  onChange={() =>
                    set({ spouseYoungerSoleBeneficiary: v as YesNo })
                  }
                />
                <span>{v === 'no' ? 'No' : 'Yes'}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="rmd-age">
            <span>Your age</span>
            <InfoTooltip
              label="Your age"
              text="Age as of your birthday in the distribution calendar year. Uniform Lifetime factors start at 72 in this table."
            />
          </label>
          <select
            id="rmd-age"
            className={selectClass}
            value={input.age}
            onChange={(e) => set({ age: e.target.value })}
          >
            {RMD_AGES.map((age) => (
              <option key={age} value={String(age)}>
                {age}
              </option>
            ))}
          </select>
          {errors.age ? <p className="mt-1 text-xs text-rose-600">{errors.age}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rmd-factor">
            <span>Life expectancy factor</span>
            <InfoTooltip
              label="Life expectancy factor"
              text="IRS Uniform Lifetime Table (2022+) factor for your age. Age 72 = 27.4 (not the pre-2022 25.6)."
            />
          </label>
          <FieldShell muted>
            <input
              id="rmd-factor"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedFactor ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="rmd-balance">
            <span>Account Balance as of Dec 31</span>
            <InfoTooltip
              label="Account Balance as of Dec 31"
              text="Prior year-end balance used for the RMD year. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.accountBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {balanceSymbol}
              </span>
              <input
                id="rmd-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.accountBalance}
                aria-invalid={Boolean(errors.accountBalance)}
                onChange={(e) => set({ accountBalance: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rmd-balance-currency"
                value={input.accountBalanceCurrency}
                onChange={onBalanceCurrencyChange}
                aria-label="Account balance currency"
              />
            </div>
          </div>
          {errors.accountBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.accountBalance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rmd-result">
            <span>Required minimum distribution (RMD)</span>
            <InfoTooltip
              label="Required minimum distribution (RMD)"
              text="Balance ÷ Uniform Lifetime factor, shown in the currency you select."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {rmdSymbol}
              </span>
              <input
                id="rmd-result"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedRmd ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rmd-result-currency"
                value={input.rmdCurrency}
                onChange={onRmdCurrencyChange}
                aria-label="RMD currency"
              />
            </div>
          </div>
        </div>

        {result?.unavailableNote ? (
          <p className="text-xs leading-relaxed text-amber-800" role="status">
            {result.unavailableNote}
          </p>
        ) : null}
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
