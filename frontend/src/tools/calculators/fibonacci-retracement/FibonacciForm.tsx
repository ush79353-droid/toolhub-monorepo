'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FibonacciFieldErrors,
  FibonacciInput,
  FibonacciLevelType,
  FibonacciResult,
  TrendDirection,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface FibonacciFormProps {
  input: FibonacciInput;
  errors: FibonacciFieldErrors;
  result: FibonacciResult | null;
  onChange: (input: FibonacciInput) => void;
}

export function FibonacciForm({
  input,
  errors,
  result,
  onChange,
}: FibonacciFormProps) {
  const sectionTitle =
    input.levelType === 'retracement'
      ? 'Retracement levels'
      : 'Extension levels';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter a swing low and high, then review Fibonacci retracement or
        extension prices for an uptrend or downtrend.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the Fibonacci retracement calculator
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Trend and prices
        </legend>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>
            Trend direction
            <InfoTooltip
              label="Trend direction"
              text="Uptrend measures a move from low to high. Downtrend measures a move from high to low."
            />
          </legend>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            {(
              [
                ['uptrend', 'Uptrend'],
                ['downtrend', 'Downtrend'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fib-trend"
                  value={value}
                  checked={input.trend === value}
                  onChange={() =>
                    onChange({ ...input, trend: value as TrendDirection })
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={`${labelClass} mb-2`}>
            Type of Fibonacci levels
            <InfoTooltip
              label="Level type"
              text="Retracements measure pullbacks within the range. Extensions project targets beyond the measured move (two-price convention)."
            />
          </legend>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            {(
              [
                ['retracement', 'Retracement levels'],
                ['extension', 'Extension levels'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fib-type"
                  value={value}
                  checked={input.levelType === value}
                  onChange={() =>
                    onChange({
                      ...input,
                      levelType: value as FibonacciLevelType,
                    })
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="fib-low" className={labelClass}>
              Low price
              <InfoTooltip
                label="Low price"
                text="The lowest price within the selected price movement used to calculate Fibonacci levels."
              />
            </label>
            <FieldShell error={errors.lowPrice}>
              <input
                id="fib-low"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.lowPrice}
                onChange={(e) =>
                  onChange({ ...input, lowPrice: e.target.value })
                }
                placeholder="100"
                aria-invalid={Boolean(errors.lowPrice)}
              />
            </FieldShell>
            {errors.lowPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lowPrice}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="fib-high" className={labelClass}>
              High price
              <InfoTooltip
                label="High price"
                text="The highest price within the selected price movement used to calculate Fibonacci levels."
              />
            </label>
            <FieldShell error={errors.highPrice}>
              <input
                id="fib-high"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.highPrice}
                onChange={(e) =>
                  onChange({ ...input, highPrice: e.target.value })
                }
                placeholder="200"
                aria-invalid={Boolean(errors.highPrice)}
              />
            </FieldShell>
            {errors.highPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.highPrice}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="fib-diff" className={labelClass}>
            Price difference
          </label>
          <FieldShell muted>
            <input
              id="fib-diff"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedDifference ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          {sectionTitle}
        </legend>
        {result ? (
          result.levels.map((lvl) => (
            <div key={`${input.levelType}-${lvl.ratio}`}>
              <label
                htmlFor={`fib-lvl-${lvl.ratio}`}
                className={labelClass}
              >
                {lvl.percentageLabel}
              </label>
              <FieldShell muted>
                <input
                  id={`fib-lvl-${lvl.ratio}`}
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default font-medium text-accent`}
                  value={lvl.formattedPrice}
                  aria-readonly="true"
                  aria-label={`${lvl.percentageLabel} level ${lvl.formattedPrice}`}
                />
              </FieldShell>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter a valid high and low price to show Fibonacci levels.
          </p>
        )}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
