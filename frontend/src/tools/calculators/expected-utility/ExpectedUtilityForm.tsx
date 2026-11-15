'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ExpectedUtilityFieldErrors,
  ExpectedUtilityInput,
  ExpectedUtilityResult,
} from './types';

interface ExpectedUtilityFormProps {
  input: ExpectedUtilityInput;
  errors: ExpectedUtilityFieldErrors;
  result: ExpectedUtilityResult | null;
  onChange: (input: ExpectedUtilityInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';
const readoutClass =
  'h-11 w-full rounded-lg border border-border bg-muted/10 px-3 text-sm font-semibold tabular-nums text-accent';

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

export function ExpectedUtilityForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: ExpectedUtilityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ExpectedUtilityInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-labelledby="eu-event1-heading">
        <h3 id="eu-event1-heading" className="text-sm font-semibold text-accent">
          Event 1
        </h3>
        <div>
          <FieldLabel
            htmlFor="eu-p1"
            label="Probability"
            tip="Chance of event 1 as a percent. Event 1 and Event 2 probabilities must total 100%."
          />
          <div className="relative">
            <input
              id="eu-p1"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.probability1}
              aria-invalid={Boolean(errors.probability1)}
              onChange={(event) => set({ probability1: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.probability1 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.probability1}</p>
          ) : null}
        </div>
        <div>
          <FieldLabel
            htmlFor="eu-v1"
            label="Monetary value"
            tip={`Outcome if event 1 occurs. Signed values allowed. ${CURRENCY_DENOMINATION_NOTE}`}
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="eu-v1"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.value1}
                aria-invalid={Boolean(errors.value1)}
                onChange={(event) => set({ value1: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="eu-v1-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.value1 ? <p className="mt-1 text-xs text-rose-600">{errors.value1}</p> : null}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="eu-event2-heading">
        <h3 id="eu-event2-heading" className="text-sm font-semibold text-accent">
          Event 2
        </h3>
        <div>
          <FieldLabel
            htmlFor="eu-p2"
            label="Probability"
            tip="Chance of event 2 as a percent. Event 1 and Event 2 probabilities must total 100%."
          />
          <div className="relative">
            <input
              id="eu-p2"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.probability2}
              aria-invalid={Boolean(errors.probability2)}
              onChange={(event) => set({ probability2: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.probability2 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.probability2}</p>
          ) : null}
        </div>
        <div>
          <FieldLabel
            htmlFor="eu-v2"
            label="Monetary value"
            tip={`Outcome if event 2 occurs. Signed values allowed. ${CURRENCY_DENOMINATION_NOTE}`}
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="eu-v2"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.value2}
                aria-invalid={Boolean(errors.value2)}
                onChange={(event) => set({ value2: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="eu-v2-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.value2 ? <p className="mt-1 text-xs text-rose-600">{errors.value2}</p> : null}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="eu-result-heading">
        <h3 id="eu-result-heading" className="sr-only">
          Result
        </h3>
        <div>
          <FieldLabel
            htmlFor="eu-result"
            label="Expected utility"
            tip="Risk-neutral linear utility U(x) = x: (P1/100 × V1) + (P2/100 × V2). Equal to expected monetary value under this assumption."
          />
          <input
            id="eu-result"
            className={readoutClass}
            readOnly
            value={result ? result.formattedExpectedUtility : ''}
            aria-live="polite"
          />
        </div>
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
