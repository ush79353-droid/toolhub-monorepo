'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MutualFundFieldErrors,
  MutualFundInput,
  MutualFundMode,
  MutualFundResult,
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

interface MutualFundFormProps {
  input: MutualFundInput;
  errors: MutualFundFieldErrors;
  result: MutualFundResult | null;
  onChange: (input: MutualFundInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const MODES: readonly { value: MutualFundMode; label: string }[] = [
  { value: 'sip', label: 'Systematic Investment Plan (SIP)' },
  { value: 'lumpSum', label: 'One-time investment (lump sum)' },
];

export function MutualFundForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: MutualFundFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MutualFundInput>) => onChange({ ...input, ...patch });
  const amountLabel =
    input.mode === 'sip' ? 'Monthly investment' : 'One-time investment';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Input the amount of your investment (one time, or monthly), the expected return, and the
        time you commit to it, and find out how much you will earn at withdrawal.
      </p>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>Investment form</legend>
        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Investment form">
          {MODES.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="mutual-fund-mode"
                className="h-4 w-4 border-border"
                checked={input.mode === option.value}
                onChange={() => set({ mode: option.value })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="mutual-fund-amount">
          <span>{amountLabel}</span>
          <InfoTooltip
            label={amountLabel}
            text={
              input.mode === 'sip'
                ? 'Amount invested at the end of each month. Must be zero or greater.'
                : 'Single lump-sum amount invested at the start. Must be zero or greater.'
            }
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.investmentAmount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="mutual-fund-amount"
              className={inputClass}
              inputMode="decimal"
              value={input.investmentAmount}
              aria-invalid={Boolean(errors.investmentAmount)}
              onChange={(event) => set({ investmentAmount: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="mutual-fund-amount-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Investment currency"
            />
          </div>
        </div>
        {errors.investmentAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.investmentAmount}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mutual-fund-return">
          <span>Expected annual return</span>
          <InfoTooltip
            label="Expected annual return"
            text="Projected annual return as a percent. Compounded monthly. Zero is allowed. Projected returns are estimates, not guarantees."
          />
        </label>
        <FieldShell error={errors.expectedAnnualReturn}>
          <input
            id="mutual-fund-return"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.expectedAnnualReturn}
            aria-invalid={Boolean(errors.expectedAnnualReturn)}
            onChange={(event) => set({ expectedAnnualReturn: event.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.expectedAnnualReturn ? (
          <p className="mt-1 text-xs text-rose-600">{errors.expectedAnnualReturn}</p>
        ) : null}
      </div>

      <div>
        <div className={`${labelClass} mb-1.5`}>
          <span>Investment period</span>
          <InfoTooltip
            label="Investment period"
            text="Commitment length in years and months. Both must be non-negative."
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldShell error={errors.years}>
            <input
              id="mutual-fund-years"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.years}
              placeholder="0"
              aria-label="Years"
              aria-invalid={Boolean(errors.years)}
              onChange={(event) => set({ years: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          <FieldShell error={errors.months}>
            <input
              id="mutual-fund-months"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.months}
              placeholder="0"
              aria-label="Months"
              aria-invalid={Boolean(errors.months)}
              onChange={(event) => set({ months: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              mos
            </span>
          </FieldShell>
        </div>
        {errors.years ? (
          <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
        ) : errors.months ? (
          <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mutual-fund-maturity">
          <span>Investment amount at maturity</span>
          <InfoTooltip
            label="Investment amount at maturity"
            text="Projected value at the end of the investment period using monthly compounding. Estimates are not guaranteed outcomes."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="mutual-fund-maturity"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedMaturityValue : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="mutual-fund-maturity-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Maturity currency"
            />
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Projected returns are estimates based on the expected rate you enter. They are not
          guaranteed investment outcomes.
        </p>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
