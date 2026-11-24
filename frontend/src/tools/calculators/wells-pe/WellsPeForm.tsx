'use client';

import type {
  WellsPeFieldErrors,
  WellsPeInput,
  WellsPeResult,
} from './types';
import { FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: WellsPeInput;
  errors: WellsPeFieldErrors;
  result: WellsPeResult | null;
  onChange: (input: WellsPeInput) => void;
  onLoadExample: () => void;
}

export function WellsPeForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<WellsPeInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">Please tick all that apply:</p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Wells criteria for pulmonary embolism pretest probability.
        Classifications support evaluation and cannot independently rule out PE.
        Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (clinical DVT signs → 3 points)
        </button>
      </p>

      <fieldset className="space-y-2.5">
        <legend className={labelClass}>Wells PE criteria</legend>
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

      {result ? (
        <div
          className="space-y-3 rounded-xl border border-border bg-muted/15 px-4 py-3"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-accent">Score</p>
          <div className="flex items-center gap-3">
            <div className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-primary/15 px-2 text-xl font-bold tabular-nums text-primary">
              {result.formattedScore}
            </div>
            <p className="text-sm text-accent">Wells PE Score</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              2-level classification
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.twoLevelTitle}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.twoLevelDetail}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              3-level classification
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.threeLevelTitle}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.threeLevelDetail}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
