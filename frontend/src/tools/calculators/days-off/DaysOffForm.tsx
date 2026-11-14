'use client';

import { Button } from '@/components/ui/button';
import type {
  DaysOffContract,
  DaysOffCountry,
  DaysOffInput,
  DaysOffResult,
} from './types';
import { CONTRACT_OPTIONS, COUNTRY_OPTIONS } from './types';

interface DaysOffFormProps {
  input: DaysOffInput;
  result: DaysOffResult;
  onChange: (input: DaysOffInput) => void;
  onReset: () => void;
}

export function DaysOffForm({ input, result, onChange, onReset }: DaysOffFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Country</legend>
        <div role="radiogroup" aria-label="Country" className="space-y-2">
          {COUNTRY_OPTIONS.map((option) => {
            const active = input.country === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="days-off-country"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() =>
                    onChange({ ...input, country: option.value as DaysOffCountry })
                  }
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Contract</legend>
        <div role="radiogroup" aria-label="Contract" className="space-y-2">
          {CONTRACT_OPTIONS.map((option) => {
            const active = input.contract === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="days-off-contract"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() =>
                    onChange({ ...input, contract: option.value as DaysOffContract })
                  }
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <section
        aria-labelledby="days-off-info-heading"
        className="space-y-2 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
      >
        <h3 id="days-off-info-heading" className="text-sm font-semibold text-accent">
          Days-off information
        </h3>
        <p className="text-sm leading-relaxed text-foreground/90" aria-live="polite">
          {result.segments.map((segment, index) =>
            segment.emphasis ? (
              <strong key={index} className="font-semibold text-accent">
                {segment.text}
              </strong>
            ) : (
              <span key={index}>{segment.text}</span>
            )
          )}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{result.disclaimer}</p>
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
