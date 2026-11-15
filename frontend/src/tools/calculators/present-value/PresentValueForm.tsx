'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PresentValueFieldErrors,
  PresentValueInput,
  PresentValueResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
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
        muted ? 'border-border bg-muted/10' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface PresentValueFormProps {
  input: PresentValueInput;
  errors: PresentValueFieldErrors;
  result: PresentValueResult | null;
  onChange: (input: PresentValueInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function PresentValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: PresentValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PresentValueInput>) => onChange({ ...input, ...patch });

  const moneyOutput = (id: string, label: string, tip: string, display: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="pv-inputs-heading">
        <h3 id="pv-inputs-heading" className={sectionTitleClass}>
          Main inputs
        </h3>

        <div>
          <label htmlFor="pv-future-value" className={labelClass}>
            Future value
            <InfoTooltip
              label="Future value"
              text="Amount received after the stated number of periods. Currency labels denomination only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.futureValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="pv-future-value"
                className={inputClass}
                inputMode="decimal"
                value={input.futureValue}
                aria-invalid={Boolean(errors.futureValue)}
                onChange={(e) => set({ futureValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="pv-future-value-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Future value currency"
              />
            </div>
          </div>
          {errors.futureValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.futureValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pv-periods" className={labelClass}>
            Number of periods
            <InfoTooltip
              label="Number of periods"
              text="Whole number of compounding periods. The interest rate must use the same period frequency."
            />
          </label>
          <FieldShell error={errors.periods}>
            <input
              id="pv-periods"
              className={inputClass}
              inputMode="numeric"
              value={input.periods}
              aria-invalid={Boolean(errors.periods)}
              onChange={(e) => set({ periods: e.target.value })}
            />
          </FieldShell>
          {errors.periods ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periods}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pv-interest-rate" className={labelClass}>
            Interest rate
            <InfoTooltip
              label="Interest rate"
              text="Rate per period as a percent. Must match the period frequency (for example monthly rate with monthly periods)."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="pv-interest-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="pv-results-heading"
      >
        <h3 id="pv-results-heading" className={sectionTitleClass}>
          Present value and interest
        </h3>
        {moneyOutput(
          'pv-result',
          'Present value',
          'FV ÷ (1 + r)^n. The amount needed today to reach the future value at the stated rate.',
          result?.presentValueDisplay ?? ''
        )}
        {moneyOutput(
          'pv-total-interest',
          'Total interest',
          'Future value − present value. Growth earned over the periods.',
          result?.totalInterestDisplay ?? ''
        )}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
