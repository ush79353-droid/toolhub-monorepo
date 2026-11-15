'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MovingAverageFieldErrors,
  MovingAverageInput,
  MovingAverageResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface MovingAverageFormProps {
  input: MovingAverageInput;
  errors: MovingAverageFieldErrors;
  result: MovingAverageResult | null;
  incomplete: boolean;
  onChange: (input: MovingAverageInput) => void;
  onReset: () => void;
}

export function MovingAverageForm({
  input,
  errors,
  result,
  incomplete,
  onChange,
  onReset,
}: MovingAverageFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MovingAverageInput>) => onChange({ ...input, ...patch });

  const onLength = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ length: text === '' ? Number.NaN : Number(text) });
  };

  const onPrice = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const prices = input.prices.map((price, i) =>
      i === index ? event.target.value : price
    );
    set({ prices });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label htmlFor="ma-length" className={labelClass}>
          Length of the moving average
          <InfoTooltip
            label="Length of the moving average"
            text="Whole number of periods (N). Must be at least 2. SMA uses the latest N prices."
          />
        </label>
        <FieldShell error={errors.length}>
          <input
            id="ma-length"
            className={inputClass}
            inputMode="numeric"
            value={numberOrBlank(input.length)}
            aria-invalid={Boolean(errors.length)}
            onChange={onLength}
          />
        </FieldShell>
        {errors.length ? <p className="mt-1 text-xs text-rose-600">{errors.length}</p> : null}
      </div>

      {input.prices.map((price, index) => {
        const id = `ma-price-${index + 1}`;
        const label = `Price #${index + 1}`;
        const error = errors[`price${index + 1}`];
        return (
          <div key={id}>
            <label htmlFor={id} className={labelClass}>
              {label}
              {index === 0 ? (
                <InfoTooltip
                  label="Price"
                  text="Enter prices in chronological order. Currency labels amounts only; it does not convert."
                />
              ) : null}
            </label>
            <div className="flex gap-2">
              <FieldShell error={error}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {symbol}
                </span>
                <input
                  id={id}
                  className={inputClass}
                  inputMode="decimal"
                  value={price}
                  aria-invalid={Boolean(error)}
                  onChange={onPrice(index)}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id={`${id}-currency`}
                  value={input.currency}
                  onChange={(currency) => set({ currency })}
                  aria-label={`${label} currency`}
                />
              </div>
            </div>
            {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
          </div>
        );
      })}

      {incomplete ? (
        <p
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-accent"
        >
          Enter at least <strong>2 price values</strong> along with the{' '}
          <strong>length</strong> of the moving average.
        </p>
      ) : null}

      {result ? (
        <div>
          <label htmlFor="ma-result" className={labelClass}>
            Moving average
            <InfoTooltip
              label="Moving average"
              text="Simple moving average of the latest N prices: sum ÷ N."
            />
          </label>
          <div className="flex gap-2">
            <ReadOnlyShell>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {symbol}
              </span>
              <input
                id="ma-result"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result.smaDisplay}
                aria-live="polite"
              />
            </ReadOnlyShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ma-result-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Moving average currency"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
