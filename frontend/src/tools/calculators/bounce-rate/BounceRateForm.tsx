'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { BounceRateFieldErrors, BounceRateInput, BounceRateResult } from './types';

interface BounceRateFormProps {
  input: BounceRateInput;
  errors: BounceRateFieldErrors;
  result: BounceRateResult | null;
  onInputChange: (field: keyof BounceRateInput, value: string) => void;
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

export function BounceRateForm({
  input,
  errors,
  result,
  onInputChange,
  onReset,
}: BounceRateFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="bounce-website-visits"
          label="Number of website visits"
          tip="Total sessions (or visits) to your site during the measurement period."
        />
        <input
          id="bounce-website-visits"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.websiteVisits}
          placeholder=""
          aria-invalid={Boolean(errors.websiteVisits)}
          onChange={(e) => onInputChange('websiteVisits', e.target.value)}
        />
        {errors.websiteVisits ? (
          <p className="mt-1 text-xs text-rose-600">{errors.websiteVisits}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="bounce-one-page-visits"
          label="Number of one-page visits"
          tip="Sessions where the visitor viewed only a single page and then left (bounces)."
        />
        <input
          id="bounce-one-page-visits"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.onePageVisits}
          placeholder=""
          aria-invalid={Boolean(errors.onePageVisits)}
          onChange={(e) => onInputChange('onePageVisits', e.target.value)}
        />
        {errors.onePageVisits ? (
          <p className="mt-1 text-xs text-rose-600">{errors.onePageVisits}</p>
        ) : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="bounce-rate"
          label="Bounce rate"
          tip="Calculated as (one-page visits ÷ total website visits) × 100."
        />
        <div className="relative">
          <input
            id="bounce-rate"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
            value={result ? result.formattedRate : ''}
            placeholder=""
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
