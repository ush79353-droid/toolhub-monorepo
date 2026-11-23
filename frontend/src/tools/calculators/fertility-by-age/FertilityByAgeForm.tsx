'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FertilityByAgeFieldErrors,
  FertilityByAgeInput,
  FertilityByAgeResult,
} from './types';
import { AGE_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
  suffix,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
      {suffix}
    </div>
  );
}

interface Props {
  input: FertilityByAgeInput;
  errors: FertilityByAgeFieldErrors;
  result: FertilityByAgeResult | null;
  onChange: (input: FertilityByAgeInput) => void;
}

export function FertilityByAgeForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-accent">
        Enter your <span className="font-semibold">age</span> to calculate your
        chance to conceive.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational cohort estimate of average pregnancy chance per menstrual
        cycle by female age. Not an individualized fertility diagnosis.
      </p>

      <div>
        <label className={labelClass} htmlFor="fertility-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Female age in completed years. Maps to an educational fecundability band (20–44). Leave on Select until you choose an age."
          />
        </label>
        <div className="flex items-center gap-2">
          <FieldShell error={errors.ageYears}>
            <select
              id="fertility-age"
              className={selectClass}
              value={input.ageYears}
              aria-invalid={Boolean(errors.ageYears)}
              onChange={(e) => onChange({ ageYears: e.target.value })}
            >
              <option value="">Select</option>
              {AGE_OPTIONS.map((age) => (
                <option key={age} value={String(age)}>
                  {age}
                </option>
              ))}
            </select>
          </FieldShell>
          <span className="shrink-0 text-sm text-muted-foreground">yrs</span>
        </div>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-accent">Result</h3>
        <p className="text-[13px] font-medium text-accent">
          Your chance to conceive in each cycle is:
        </p>
        <FieldShell muted suffix={<span className="pr-3 text-sm text-muted-foreground">%</span>}>
          <output
            className="w-full px-3 text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedPercent : ''}
          </output>
        </FieldShell>
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Cohort educational estimate — not individualized prediction.'}
        </p>
      </div>
    </form>
  );
}
