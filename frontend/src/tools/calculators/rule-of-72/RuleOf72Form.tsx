'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RuleOf72FieldErrors,
  RuleOf72Input,
  RuleOf72Result,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface RuleOf72FormProps {
  input: RuleOf72Input;
  errors: RuleOf72FieldErrors;
  result: RuleOf72Result | null;
  onChange: (input: RuleOf72Input) => void;
  onLoadExample: () => void;
}

export function RuleOf72Form({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: RuleOf72FormProps) {
  const increaseDisplay =
    input.lastEdited === 'increase'
      ? input.increasePercent
      : result
        ? result.formattedIncrease
        : input.increasePercent;
  const doublingDisplay =
    input.lastEdited === 'doublingTime'
      ? input.doublingTime
      : result
        ? result.formattedDoublingTime
        : input.doublingTime;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        The Rule of 72 is a <strong>mental-math approximation</strong>: doubling
        time (periods) ≈ 72 ÷ percent increase per period. Edit either field;
        the other updates from the value you last changed. It is not an exact
        compound-growth formula.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (8%/period → ≈ 9 periods)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="r72-increase">
          <span>Increase</span>
          <InfoTooltip
            label="Increase"
            text="Approximate growth rate as a percent per period (for example 8 means 8% each period). Used in T ≈ 72 ÷ rate."
          />
        </label>
        <FieldShell error={errors.increasePercent}>
          <input
            id="r72-increase"
            className={inputClass}
            inputMode="decimal"
            value={increaseDisplay}
            aria-invalid={Boolean(errors.increasePercent)}
            onChange={(e) =>
              onChange({
                ...input,
                increasePercent: e.target.value,
                lastEdited: 'increase',
              })
            }
          />
          <span
            className="shrink-0 pr-3 text-sm font-medium text-muted-foreground"
            aria-hidden
          >
            % /period
          </span>
        </FieldShell>
        {errors.increasePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.increasePercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="r72-doubling">
          <span>Doubling time</span>
          <InfoTooltip
            label="Doubling time"
            text="Approximate number of periods until the quantity doubles, using the Rule of 72. Solving from this field implies rate ≈ 72 ÷ periods."
          />
        </label>
        <FieldShell error={errors.doublingTime}>
          <input
            id="r72-doubling"
            className={inputClass}
            inputMode="decimal"
            value={doublingDisplay}
            aria-invalid={Boolean(errors.doublingTime)}
            onChange={(e) =>
              onChange({
                ...input,
                doublingTime: e.target.value,
                lastEdited: 'doublingTime',
              })
            }
          />
          <span
            className="shrink-0 pr-3 text-sm font-medium text-muted-foreground"
            aria-hidden
          >
            periods
          </span>
        </FieldShell>
        {errors.doublingTime ? (
          <p className="mt-1 text-xs text-rose-600">{errors.doublingTime}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
