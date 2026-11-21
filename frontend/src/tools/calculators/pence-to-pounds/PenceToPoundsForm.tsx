'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PenceToPoundsFieldErrors,
  PenceToPoundsInput,
  PenceToPoundsResult,
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

interface PenceToPoundsFormProps {
  input: PenceToPoundsInput;
  errors: PenceToPoundsFieldErrors;
  result: PenceToPoundsResult | null;
  onChange: (input: PenceToPoundsInput) => void;
  onLoadExample: () => void;
}

export function PenceToPoundsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: PenceToPoundsFormProps) {
  const penceDisplay =
    input.lastEdited === 'pence'
      ? input.pence
      : result
        ? String(result.pence)
        : input.pence;
  const poundsDisplay =
    input.lastEdited === 'pounds'
      ? input.pounds
      : result
        ? String(result.pounds)
        : input.pounds;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Fixed sterling subdivision: <strong>100 pence = 1 pound</strong>. Edit
        either field; the other updates from the amount you last changed. This
        is not a live foreign-exchange rate.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (250p → £2.50)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="pp-pence">
          <span>Pence Sterling (GBX)</span>
          <InfoTooltip
            label="Pence Sterling (GBX)"
            text="British penny amounts. 100 pence equal one pound sterling. Symbol often shown as p."
          />
        </label>
        <FieldShell error={errors.pence}>
          <input
            id="pp-pence"
            className={inputClass}
            inputMode="decimal"
            value={penceDisplay}
            aria-invalid={Boolean(errors.pence)}
            onChange={(e) =>
              onChange({
                ...input,
                pence: e.target.value,
                lastEdited: 'pence',
              })
            }
          />
          <span
            className="shrink-0 pr-3 text-sm font-medium text-muted-foreground"
            aria-hidden
          >
            p
          </span>
        </FieldShell>
        {errors.pence ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pence}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pp-pounds">
          <span>Pound Sterling (GBP)</span>
          <InfoTooltip
            label="Pound Sterling (GBP)"
            text="British pounds. One pound equals 100 pence. Symbol £."
          />
        </label>
        <FieldShell error={errors.pounds}>
          <span
            className="shrink-0 pl-3 text-sm font-medium text-muted-foreground"
            aria-hidden
          >
            £
          </span>
          <input
            id="pp-pounds"
            className={inputClass}
            inputMode="decimal"
            value={poundsDisplay}
            aria-invalid={Boolean(errors.pounds)}
            onChange={(e) =>
              onChange({
                ...input,
                pounds: e.target.value,
                lastEdited: 'pounds',
              })
            }
          />
        </FieldShell>
        {errors.pounds ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pounds}</p>
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
