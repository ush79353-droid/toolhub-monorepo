'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RcriFieldErrors,
  RcriInput,
  RcriResult,
  YesNo,
} from './types';
import { FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  muted,
  children,
}: {
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: RcriInput;
  errors: RcriFieldErrors;
  result: RcriResult | null;
  onChange: (input: RcriInput) => void;
  onLoadExample: () => void;
}

export function RcriForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setFactor = (key: keyof RcriInput, value: YesNo) =>
    onChange({ ...input, [key]: value });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational Revised Cardiac Risk Index (six Lee factors).{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline"
          onClick={onLoadExample}
        >
          Load example
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {FACTOR_OPTIONS.map((factor) => (
        <div key={factor.key}>
          <div className={labelClass}>
            <span>{factor.label}</span>
            <InfoTooltip text={factor.tip} />
          </div>
          <div
            className="flex gap-4"
            role="radiogroup"
            aria-label={factor.label}
          >
            {(['no', 'yes'] as const).map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name={factor.key}
                  className="h-4 w-4 accent-primary"
                  checked={input[factor.key] === opt}
                  onChange={() => setFactor(factor.key, opt)}
                />
                <span>{opt === 'no' ? 'No' : 'Yes'}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div>
        <div className={labelClass}>
          <span>Total RCRI points</span>
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={result?.formattedPoints ?? ''}
            aria-label="Total RCRI points"
            tabIndex={-1}
          />
        </FieldShell>
      </div>

      {result ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-3 text-sm text-accent">
          {result.interpretation}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>30-day risk of death, MI, or cardiac arrest</span>
          <InfoTooltip text="CCS 2017 pooled external-validation estimates — not Lee 1999 derivation rates." />
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={result?.formattedRisk ?? ''}
            aria-label="30-day risk percent"
            tabIndex={-1}
          />
          <span className="shrink-0 px-3 text-sm font-medium text-primary">
            %
          </span>
        </FieldShell>
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation} {result.disclaimer}
        </p>
      ) : null}
    </form>
  );
}
