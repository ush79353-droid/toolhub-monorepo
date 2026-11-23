'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ArterialAgeFieldErrors,
  ArterialAgeInput,
  ArterialAgeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <span className="shrink-0 pr-3 text-sm font-medium text-primary">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

interface Props {
  input: ArterialAgeInput;
  errors: ArterialAgeFieldErrors;
  result: ArterialAgeResult | null;
  onChange: (input: ArterialAgeInput) => void;
}

export function ArterialAgeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<ArterialAgeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter an Agatston coronary calcium score to estimate MESA arterial age.
        Chronologic age is optional and used only for comparison.
      </p>

      <div>
        <label className={labelClass} htmlFor="arterial-age-cac">
          <span>Calcium score</span>
          <InfoTooltip
            label="Calcium score"
            text="Agatston coronary artery calcium (CAC) score from cardiac CT. Arterial age uses Â = 39.1 + 7.25 × ln(CAC + 1) from MESA (McClelland 2009). CAC of 0 is valid and maps to about 39 years."
          />
        </label>
        <FieldShell error={errors.calciumScore}>
          <input
            id="arterial-age-cac"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.calciumScore}
            onChange={(e) => set({ calciumScore: e.target.value })}
            aria-invalid={Boolean(errors.calciumScore)}
            aria-describedby={
              errors.calciumScore ? 'arterial-age-cac-err' : undefined
            }
          />
        </FieldShell>
        {errors.calciumScore ? (
          <p id="arterial-age-cac-err" className="mt-1.5 text-xs text-rose-600">
            {errors.calciumScore}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="arterial-age-yrs">
          <span>Your age</span>
          <InfoTooltip
            label="Your age"
            text="Optional chronologic age in years. It never changes the MESA coefficients — used only to compare arterial age with observed age."
          />
        </label>
        <FieldShell error={errors.ageYears} suffix="yrs">
          <input
            id="arterial-age-yrs"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ageYears}
            onChange={(e) => set({ ageYears: e.target.value })}
            aria-invalid={Boolean(errors.ageYears)}
            aria-describedby={
              errors.ageYears ? 'arterial-age-yrs-err' : undefined
            }
          />
        </FieldShell>
        {errors.ageYears ? (
          <p id="arterial-age-yrs-err" className="mt-1.5 text-xs text-rose-600">
            {errors.ageYears}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="arterial-age-out">
          <span>Arterial age</span>
          <InfoTooltip
            label="Arterial age"
            text="CHD risk-equivalent age corresponding to the entered CAC. Blank until a valid calcium score is entered."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="arterial-age-out"
            className="w-full text-sm font-semibold tabular-nums text-accent"
            aria-live="polite"
          >
            {result
              ? `${result.formattedArterialAge} yrs${
                  result.ciExactTable &&
                  result.ciLow != null &&
                  result.ciHigh != null
                    ? ` (95% CI ${result.ciLow}–${result.ciHigh})`
                    : ''
                }`
              : ''}
          </output>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational MESA arterial-age estimate — not medical advice.'}
        </p>
      </div>
    </form>
  );
}
