'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PvifaFieldErrors, PvifaInput, PvifaResult } from './types';

interface PvifaFormProps {
  input: PvifaInput;
  errors: PvifaFieldErrors;
  result: PvifaResult | null;
  onChange: (input: PvifaInput) => void;
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

export function PvifaForm({ input, errors, result, onChange }: PvifaFormProps) {
  const set = (patch: Partial<PvifaInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">PVIFA</legend>

        <div>
          <FieldLabel
            htmlFor="pvifa-r"
            label="Interest rate per period (r)"
            tip="Period interest rate as a percent. Must be greater than −100%. Zero uses PVIFA = n."
          />
          <div className="relative">
            <input
              id="pvifa-r"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="pvifa-n"
            label="Number of periods (n)"
            tip="Count of equal end-of-period payments. Must be a non-negative whole number."
          />
          <input
            id="pvifa-n"
            className={inputClass}
            inputMode="numeric"
            value={input.periods}
            aria-invalid={Boolean(errors.periods)}
            onChange={(e) => set({ periods: e.target.value })}
          />
          {errors.periods ? <p className="mt-1 text-xs text-rose-600">{errors.periods}</p> : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="pvifa-result"
            label="PVIFA"
            tip="Present value interest factor of annuity: [1 − (1 + r)^(−n)] ÷ r (or n when r = 0)."
          />
          <input
            id="pvifa-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/20 font-semibold text-accent`}
            value={result ? result.formattedPvifa : ''}
            aria-live="polite"
          />
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
