'use client';

import type {
  PaduaFieldErrors,
  PaduaInput,
  PaduaResult,
} from './types';
import { FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: PaduaInput;
  errors: PaduaFieldErrors;
  result: PaduaResult | null;
  onChange: (input: PaduaInput) => void;
  onLoadExample: () => void;
}

export function PaduaScoreForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PaduaInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Please tick all that apply:
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Padua Prediction Score for hospitalized medical patients
        (Barbar 2010). It reports the numeric total and risk band only — it
        does not order prophylaxis. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age ≥70 → 1 point)
        </button>
      </p>

      <fieldset className="space-y-2.5">
        <legend className={labelClass}>Padua score questionnaire</legend>
        {FACTOR_OPTIONS.map((factor) => (
          <label
            key={factor.key}
            className="flex cursor-pointer items-start gap-2 text-sm text-accent"
          >
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              checked={input[factor.key]}
              onChange={(e) => set({ [factor.key]: e.target.checked })}
            />
            <span>
              <span className="font-medium">{factor.label}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                (+{factor.points})
              </span>
              {factor.detail ? (
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  {factor.detail}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </fieldset>

      <div>
        <div className={labelClass}>Padua score</div>
        <div
          className="flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary"
          aria-live="polite"
          aria-label="Padua score result"
        >
          {result ? result.formattedScore : '0 points'}
        </div>
        {result ? (
          <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
            <p>{result.bandLabel}</p>
            <p>
              The original study used score ≥4 as a higher VTE-risk band when
              discussing in-hospital pharmacologic prophylaxis among medical
              inpatients. Mechanical options (e.g. compression stockings or
              intermittent pneumatic compression) are clinical decisions —
              this calculator does not recommend them.
            </p>
          </div>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
