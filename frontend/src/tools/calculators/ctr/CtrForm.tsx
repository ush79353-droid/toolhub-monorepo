'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CtrFieldErrors, CtrInput, CtrResult } from './types';

interface CtrFormProps {
  input: CtrInput;
  errors: CtrFieldErrors;
  result: CtrResult | null;
  onInputChange: (field: keyof CtrInput, value: string) => void;
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

export function CtrForm({ input, errors, result, onInputChange, onReset }: CtrFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="ctr-impressions"
          label="Ad impressions"
          tip="How many times the ad was shown during the measurement period."
        />
        <input
          id="ctr-impressions"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.impressions}
          aria-invalid={Boolean(errors.impressions)}
          onChange={(e) => onInputChange('impressions', e.target.value)}
        />
        {errors.impressions ? (
          <p className="mt-1 text-xs text-rose-600">{errors.impressions}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="ctr-clicks"
          label="Number of clicks"
          tip="How many times the ad was clicked. Cannot exceed impressions."
        />
        <input
          id="ctr-clicks"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={input.clicks}
          aria-invalid={Boolean(errors.clicks)}
          onChange={(e) => onInputChange('clicks', e.target.value)}
        />
        {errors.clicks ? <p className="mt-1 text-xs text-rose-600">{errors.clicks}</p> : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="ctr-rate"
          label="Click through rate (CTR)"
          tip="Calculated as (clicks ÷ ad impressions) × 100."
        />
        <div className="relative">
          <input
            id="ctr-rate"
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
