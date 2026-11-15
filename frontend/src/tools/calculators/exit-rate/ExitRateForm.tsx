'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { ExitRateFieldErrors, ExitRateInput, ExitRateResult } from './types';

interface ExitRateFormProps {
  input: ExitRateInput;
  errors: ExitRateFieldErrors;
  result: ExitRateResult | null;
  onInputChange: (field: keyof ExitRateInput, value: string) => void;
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

export function ExitRateForm({
  input,
  errors,
  result,
  onInputChange,
  onReset,
}: ExitRateFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="exit-rate-pageviews"
          label="Number of pageviews"
          tip="Total pageviews for the page or site during the measurement period. Must be greater than zero."
        />
        <input
          id="exit-rate-pageviews"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.pageviews}
          aria-invalid={Boolean(errors.pageviews)}
          onChange={(e) => onInputChange('pageviews', e.target.value)}
        />
        {errors.pageviews ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pageviews}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="exit-rate-exits"
          label="Number of exits"
          tip="How many sessions ended on this page. Cannot exceed pageviews."
        />
        <input
          id="exit-rate-exits"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.exits}
          aria-invalid={Boolean(errors.exits)}
          onChange={(e) => onInputChange('exits', e.target.value)}
        />
        {errors.exits ? <p className="mt-1 text-xs text-rose-600">{errors.exits}</p> : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="exit-rate-result"
          label="Exit rate"
          tip="Calculated as (exits ÷ pageviews) × 100."
        />
        <div className="relative">
          <input
            id="exit-rate-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
            value={result ? result.formattedRate : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
