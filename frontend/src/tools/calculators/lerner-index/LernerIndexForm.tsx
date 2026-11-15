'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  LernerIndexFieldErrors,
  LernerIndexInput,
  LernerIndexResult,
} from './types';

interface LernerIndexFormProps {
  input: LernerIndexInput;
  errors: LernerIndexFieldErrors;
  result: LernerIndexResult | null;
  onChange: (input: LernerIndexInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
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

export function LernerIndexForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: LernerIndexFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<LernerIndexInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="lerner-price"
          label="Price"
          tip="Selling price per unit in the selected currency. Must be greater than zero."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="lerner-price"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.price}
              aria-invalid={Boolean(errors.price)}
              onChange={(event) => set({ price: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="lerner-price-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price}</p> : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="lerner-mc"
          label="Marginal cost"
          tip="Extra cost of producing one more unit, in the same currency as price. Zero is allowed."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="lerner-mc"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.marginalCost}
              aria-invalid={Boolean(errors.marginalCost)}
              onChange={(event) => set({ marginalCost: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="lerner-mc-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.marginalCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.marginalCost}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="lerner-result"
          label="Lerner index"
          tip="(Price − Marginal cost) ÷ Price, shown as a decimal (not a percentage)."
        />
        <input
          id="lerner-result"
          className={`${inputClass} bg-muted/10 font-semibold text-accent`}
          readOnly
          value={result?.formattedIndex ?? ''}
          placeholder=""
          aria-live="polite"
        />
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
