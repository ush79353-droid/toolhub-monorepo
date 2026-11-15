'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  FutureValueFieldErrors,
  FutureValueInput,
  FutureValueResult,
  PeriodicTiming,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4';

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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValueChange,
  onCurrencyChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  error?: string;
  symbol: string;
  currency: FutureValueInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: FutureValueInput['currency']) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass}${readOnly ? ' font-semibold' : ''}`}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={(event) => onValueChange?.(event.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface FutureValueFormProps {
  input: FutureValueInput;
  errors: FutureValueFieldErrors;
  result: FutureValueResult | null;
  onChange: (input: FutureValueInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function FutureValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: FutureValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FutureValueInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={`${sectionClass} bg-muted/15`}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Main inputs</legend>

        <MoneyField
          id="fv-pv"
          label="Present value (starting amount)"
          tip="Starting principal before growth."
          value={input.presentValue}
          error={errors.presentValue}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(presentValue) => set({ presentValue })}
          onCurrencyChange={onCurrencyChange}
        />

        <div>
          <label className={labelClass} htmlFor="fv-periods">
            <span>Number of periods</span>
            <InfoTooltip
              label="Number of periods"
              text="Whole number of compounding periods (n)."
            />
          </label>
          <FieldShell error={errors.periods}>
            <input
              id="fv-periods"
              className={inputClass}
              inputMode="numeric"
              value={input.periods}
              aria-invalid={Boolean(errors.periods)}
              onChange={(event) => set({ periods: event.target.value })}
            />
          </FieldShell>
          {errors.periods ? <p className="mt-1 text-xs text-rose-600">{errors.periods}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fv-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Interest rate per period as a percent. Must be greater than −100%."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="fv-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(event) => set({ interestRatePercent: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.includePeriodic}
            onChange={(event) => set({ includePeriodic: event.target.checked })}
          />
          Include periodic deposits/withdrawals
        </label>

        {input.includePeriodic ? (
          <div className="space-y-3.5 border-t border-border pt-3.5">
            <MoneyField
              id="fv-pmt"
              label="Periodic deposit/withdrawal"
              tip="Positive = deposit, negative = withdrawal. Applied each period at the chosen timing."
              value={input.periodicAmount}
              error={errors.periodicAmount}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(periodicAmount) => set({ periodicAmount })}
              onCurrencyChange={onCurrencyChange}
            />
            <div>
              <label className={labelClass} htmlFor="fv-timing">
                <span>Contribution timing</span>
                <InfoTooltip
                  label="Contribution timing"
                  text="Beginning compounds one extra period versus end-of-period contributions."
                />
              </label>
              <select
                id="fv-timing"
                className={selectClass}
                value={input.periodicTiming}
                onChange={(event) =>
                  set({ periodicTiming: event.target.value as PeriodicTiming })
                }
              >
                <option value="end">End of each period</option>
                <option value="beginning">Beginning of each period</option>
              </select>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Future value and interest
        </legend>

        <MoneyField
          id="fv-result"
          label="Future value"
          tip="Compounded ending balance after n periods."
          value={result ? result.formattedFutureValue : ''}
          symbol={symbol}
          currency={input.currency}
          onCurrencyChange={onCurrencyChange}
          readOnly
        />

        <MoneyField
          id="fv-interest"
          label="Total interest"
          tip={
            input.includePeriodic
              ? 'FV − present value − net contributions.'
              : 'FV − present value.'
          }
          value={result ? result.formattedTotalInterest : ''}
          symbol={symbol}
          currency={input.currency}
          onCurrencyChange={onCurrencyChange}
          readOnly
        />

        <div className="space-y-2 border-t border-border pt-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.showSchedule}
              onChange={(event) => set({ showSchedule: event.target.checked })}
            />
            Show schedule
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.showBreakdown}
              onChange={(event) => set({ showBreakdown: event.target.checked })}
            />
            Show final amount breakdown
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.showAmountByPeriod}
              onChange={(event) => set({ showAmountByPeriod: event.target.checked })}
            />
            Show amount by period
          </label>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
