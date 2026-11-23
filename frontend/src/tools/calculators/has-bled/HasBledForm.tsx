'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HasBledFieldErrors,
  HasBledInput,
  HasBledResult,
  YesNo,
} from './types';
import { FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: HasBledInput;
  errors: HasBledFieldErrors;
  result: HasBledResult | null;
  onChange: (input: HasBledInput) => void;
  onLoadExample: () => void;
}

export function HasBledForm({
  input,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setFactor = (key: keyof HasBledInput, value: YesNo) =>
    onChange({ ...input, [key]: value });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        If the condition is present in your patient, select &apos;Yes&apos;.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational HAS-BLED score (0–9) from Pisters 2010. It supports
        bleeding-risk review in atrial fibrillation — it does not order
        anticoagulation. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (HTN + age &gt;65 + drugs → score 3)
        </button>
      </p>

      <div className="space-y-3">
        {FACTOR_OPTIONS.map((opt) => (
          <fieldset key={opt.key} className="rounded-lg border border-border px-3 py-2.5">
            <legend className={`${labelClass} px-1`}>
              <span>{opt.label}</span>
              <InfoTooltip label={opt.label} text={opt.tip} />
            </legend>
            <div className="mt-1 flex gap-4">
              {(['no', 'yes'] as const).map((v) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name={`hasbled-${opt.key}`}
                    className="h-4 w-4 accent-primary"
                    checked={input[opt.key] === v}
                    onChange={() => setFactor(opt.key, v)}
                  />
                  <span>{v === 'yes' ? 'Yes' : 'No'}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {result ? (
        <div
          className="space-y-2 rounded-xl border border-border bg-muted/15 px-4 py-3"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-xl font-bold tabular-nums text-primary">
              {result.formattedScore}
            </div>
            <p className="text-sm text-accent">{result.interpretation}</p>
          </div>
          <p className="text-sm text-foreground/90">
            The bleeding risk is{' '}
            <strong>{result.formattedBleedingRisk}</strong>. The number of
            events (bleeds) per 100 patient-years is{' '}
            <strong>{result.formattedEventsRate}</strong>.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>Patient-year:</strong> {result.patientYearNote}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.rateNote}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </form>
  );
}
