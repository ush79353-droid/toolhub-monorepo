'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUND_OPTIONS,
  type CompoundFrequency,
  type EarFieldErrors,
  type EarInput,
  type EarResult,
} from './types';

interface EarFormProps {
  input: EarInput;
  errors: EarFieldErrors;
  result: EarResult | null;
  onChange: (input: EarInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus:outline-none focus:ring-2 focus:ring-ring';

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

export function EarForm({ input, errors, result, onChange, onReset }: EarFormProps) {
  const set = (patch: Partial<EarInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Interest rate calculation
        </legend>

        <div>
          <FieldLabel
            htmlFor="ear-annual-rate"
            label="Annual interest rate"
            tip="Nominal annual interest rate before compounding. Zero and valid negatives are allowed."
          />
          <div className="relative">
            <input
              id="ear-annual-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(e) => set({ annualInterestRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="ear-compound"
            label="Compounding frequency"
            tip="Number of compounding periods per year (n): Annual 1, Semiannual 2, Quarterly 4, Monthly 12, Daily 365."
          />
          <select
            id="ear-compound"
            className={selectClass}
            value={input.compoundFrequency}
            onChange={(e) =>
              set({ compoundFrequency: e.target.value as CompoundFrequency })
            }
          >
            {COMPOUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel
            htmlFor="ear-periodic"
            label="Periodic rate"
            tip="Annual interest rate ÷ n."
          />
          <div className="relative">
            <input
              id="ear-periodic"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              value={result ? result.formattedPeriodicRate : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="ear-result"
            label="Effective Annual Rate (EAR)"
            tip="[(1 + annual rate ÷ (100 × n))^n − 1] × 100"
          />
          <div className="relative">
            <input
              id="ear-result"
              type="text"
              readOnly
              className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
              value={result ? result.formattedEar : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
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
