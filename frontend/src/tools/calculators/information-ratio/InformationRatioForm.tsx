'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  InformationRatioFieldErrors,
  InformationRatioInput,
  InformationRatioResult,
} from './types';

interface InformationRatioFormProps {
  input: InformationRatioInput;
  errors: InformationRatioFieldErrors;
  result: InformationRatioResult | null;
  onChange: (input: InformationRatioInput) => void;
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

export function InformationRatioForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: InformationRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<InformationRatioInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Portfolio return</legend>

        <div>
          <FieldLabel
            htmlFor="ir-begin"
            label="Beginning portfolio value"
            tip="Portfolio value at the start of the period. Must be greater than zero."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ir-begin"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.beginningValue}
                aria-invalid={Boolean(errors.beginningValue)}
                onChange={(e) => set({ beginningValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ir-begin-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.beginningValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.beginningValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ir-end"
            label="Ending portfolio value"
            tip="Portfolio value at the end of the period. May be below beginning (negative return)."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ir-end"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.endingValue}
                aria-invalid={Boolean(errors.endingValue)}
                onChange={(e) => set({ endingValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ir-end-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.endingValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.endingValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ir-portfolio-return"
            label="Portfolio return"
            tip="((Ending − Beginning) ÷ Beginning) × 100"
          />
          <div className="relative">
            <input
              id="ir-portfolio-return"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              value={result ? result.formattedPortfolioReturn : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Information ratio</legend>

        <div>
          <FieldLabel
            htmlFor="ir-benchmark"
            label="Benchmark return"
            tip="Benchmark return for the same period (%). Negatives are allowed."
          />
          <div className="relative">
            <input
              id="ir-benchmark"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.benchmarkReturn}
              aria-invalid={Boolean(errors.benchmarkReturn)}
              onChange={(e) => set({ benchmarkReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.benchmarkReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.benchmarkReturn}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ir-tracking"
            label="Tracking error"
            tip="Standard deviation of active returns (%). Must be greater than zero. Entered directly — not derived here."
          />
          <div className="relative">
            <input
              id="ir-tracking"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.trackingError}
              aria-invalid={Boolean(errors.trackingError)}
              onChange={(e) => set({ trackingError: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.trackingError ? (
            <p className="mt-1 text-xs text-rose-600">{errors.trackingError}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ir-result"
            label="Information ratio"
            tip="(Portfolio return − benchmark return) ÷ tracking error"
          />
          <input
            id="ir-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/20 font-semibold text-accent`}
            value={result ? result.formattedInformationRatio : ''}
            aria-live="polite"
          />
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
