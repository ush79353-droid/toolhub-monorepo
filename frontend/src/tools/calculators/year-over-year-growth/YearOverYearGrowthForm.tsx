'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  YearOverYearGrowthFieldErrors,
  YearOverYearGrowthInput,
  YearOverYearGrowthResult,
} from './types';

interface YearOverYearGrowthFormProps {
  input: YearOverYearGrowthInput;
  errors: YearOverYearGrowthFieldErrors;
  result: YearOverYearGrowthResult | null;
  onChange: (input: YearOverYearGrowthInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

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

export function YearOverYearGrowthForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: YearOverYearGrowthFormProps) {
  const [cagrOpen, setCagrOpen] = React.useState(false);
  const set = (patch: Partial<YearOverYearGrowthInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Year-over-year growth</legend>

        <div>
          <FieldLabel
            htmlFor="yoy-initial"
            label="Value in initial year"
            tip="Starting-period value. Must be greater than zero."
          />
          <input
            id="yoy-initial"
            className={inputClass}
            inputMode="decimal"
            value={input.initialYearValue}
            aria-invalid={Boolean(errors.initialYearValue)}
            onChange={(e) => set({ initialYearValue: e.target.value })}
          />
          {errors.initialYearValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialYearValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="yoy-final"
            label="Value in final year"
            tip="Ending-period value. Zero and negatives are allowed."
          />
          <input
            id="yoy-final"
            className={inputClass}
            inputMode="decimal"
            value={input.finalYearValue}
            aria-invalid={Boolean(errors.finalYearValue)}
            onChange={(e) => set({ finalYearValue: e.target.value })}
          />
          {errors.finalYearValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalYearValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="yoy-result"
            label="Year-over-year % change"
            tip="((Final − Initial) ÷ Initial) × 100"
          />
          <div className="relative">
            <input
              id="yoy-result"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              value={result ? result.formattedYoyGrowth : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </fieldset>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={cagrOpen}
          onClick={() => setCagrOpen((open) => !open)}
        >
          Calculate CAGR (compound annualized growth rate)
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${cagrOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {cagrOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Uses the same initial and final year values above with the verified CAGR formula:{' '}
              ((Final ÷ Initial)^(1 ÷ years) − 1) × 100.
            </p>
            <div>
              <FieldLabel
                htmlFor="yoy-years"
                label="Number of years"
                tip="Number of periods between the initial and final values (must be greater than zero)."
              />
              <input
                id="yoy-years"
                className={inputClass}
                inputMode="decimal"
                value={input.numberOfYears}
                aria-invalid={Boolean(errors.numberOfYears)}
                onChange={(e) => set({ numberOfYears: e.target.value })}
              />
              {errors.numberOfYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.numberOfYears}</p>
              ) : null}
            </div>
            <div>
              <FieldLabel
                htmlFor="yoy-cagr"
                label="CAGR"
                tip="Compound annualized growth rate from the verified CAGR engine."
              />
              <div className="relative">
                <input
                  id="yoy-cagr"
                  type="text"
                  readOnly
                  className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
                  value={result?.formattedCagr ?? ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>
        ) : null}
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
