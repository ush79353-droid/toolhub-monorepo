'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  TTM_MODE_OPTIONS,
  type TtmFieldErrors,
  type TtmInput,
  type TtmMode,
  type TtmResult,
} from './types';

interface TtmFormProps {
  input: TtmInput;
  errors: TtmFieldErrors;
  result: TtmResult | null;
  onChange: (input: TtmInput) => void;
  onCurrencyChange: (currency: TtmInput['currency']) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
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
  readOnly,
  onValueChange,
  onCurrencyChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  currency: TtmInput['currency'];
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: TtmInput['currency']) => void;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} tip={tip} />
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} pl-8${readOnly ? ' bg-muted/10 font-semibold text-accent' : ''}`}
            inputMode="decimal"
            readOnly={readOnly}
            value={value}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        </div>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export function TtmForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: TtmFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<TtmInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="ttm-mode"
          label="TTM mode"
          tip="Original TTM sums four consecutive quarterly values."
        />
        <select
          id="ttm-mode"
          className={selectClass}
          value={input.mode}
          onChange={(e) => set({ mode: e.target.value as TtmMode })}
        >
          {TTM_MODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          You can pick any income statement or cash flow statement quarterly value. Examples: total
          dividends, free cash flow, operating cash flow, among others.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Original TTM mode</legend>

        <MoneyField
          id="ttm-q0"
          label="TTM last reported quarter"
          tip="Most recently reported quarter (Q0)."
          value={input.quarter0}
          error={errors.quarter0}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(quarter0) => set({ quarter0 })}
          onCurrencyChange={onCurrencyChange}
        />
        <MoneyField
          id="ttm-q1"
          label="TTM one quarter before"
          tip="Previous quarter (Q1)."
          value={input.quarter1}
          error={errors.quarter1}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(quarter1) => set({ quarter1 })}
          onCurrencyChange={onCurrencyChange}
        />
        <MoneyField
          id="ttm-q2"
          label="TTM two quarters before"
          tip="Two quarters before the latest (Q2)."
          value={input.quarter2}
          error={errors.quarter2}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(quarter2) => set({ quarter2 })}
          onCurrencyChange={onCurrencyChange}
        />
        <MoneyField
          id="ttm-q3"
          label="TTM three quarters before"
          tip="Three quarters before the latest (Q3)."
          value={input.quarter3}
          error={errors.quarter3}
          symbol={symbol}
          currency={input.currency}
          onValueChange={(quarter3) => set({ quarter3 })}
          onCurrencyChange={onCurrencyChange}
        />
        <MoneyField
          id="ttm-result"
          label="Trailing twelve month value"
          tip="Q0 + Q1 + Q2 + Q3 — sum of four consecutive quarters, not averaged or annualized."
          value={result ? result.formattedTtm : ''}
          symbol={symbol}
          currency={input.currency}
          readOnly
          onCurrencyChange={onCurrencyChange}
        />
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
