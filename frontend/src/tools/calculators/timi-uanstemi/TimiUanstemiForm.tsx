'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  TimiFactorKey,
  TimiUanstemiFieldErrors,
  TimiUanstemiInput,
  TimiUanstemiResult,
  YesNo,
} from './types';
import { FACTOR_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: TimiUanstemiInput;
  errors: TimiUanstemiFieldErrors;
  result: TimiUanstemiResult | null;
  onChange: (input: TimiUanstemiInput) => void;
  onLoadExample: () => void;
}

export function TimiUanstemiForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setFactor = (key: TimiFactorKey, value: YesNo) => {
    onChange({ ...input, [key]: value });
  };

  const scoreDisplay = result?.formattedScore ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational TIMI risk score for UA/NSTEMI (Antman et al. JAMA 2000).
        Each Yes adds 1 point (0–7). It does not diagnose ACS or order therapy.
        Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (all seven factors Yes → score 7)
        </button>
      </p>

      <section className={sectionClass} aria-label="TIMI UA/NSTEMI factors">
        {FACTOR_OPTIONS.map((factor) => (
          <fieldset key={factor.key} className="space-y-1.5">
            <legend className={labelClass}>
              <span>{factor.label}</span>
              {factor.tip ? (
                <InfoTooltip label={factor.label} text={factor.tip} />
              ) : null}
            </legend>
            <div
              className="flex flex-wrap gap-x-6 gap-y-2"
              role="radiogroup"
              aria-label={factor.label}
            >
              {(['no', 'yes'] as const).map((v) => (
                <label
                  key={v}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name={`timi-uanstemi-${factor.key}`}
                    className="h-4 w-4 accent-primary"
                    checked={input[factor.key] === v}
                    onChange={() => setFactor(factor.key, v)}
                  />
                  <span>{v === 'no' ? 'No' : 'Yes'}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>

      <section className={sectionClass} aria-labelledby="timi-uanstemi-results">
        <h3
          id="timi-uanstemi-results"
          className="text-[15px] font-semibold text-accent"
        >
          Result
        </h3>
        <div
          className="relative flex h-14 items-center rounded-lg border border-primary/20 bg-primary/10 px-3"
          aria-live="polite"
        >
          <input
            id="timi-uanstemi-score-out"
            type="text"
            readOnly
            aria-label="TIMI UA/NSTEMI score"
            className="h-11 w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums text-accent outline-none"
            value={scoreDisplay}
          />
        </div>

        {result?.formattedDisplayEventRate ? (
          <div className="space-y-1.5 text-sm leading-relaxed text-accent">
            <p>
              Over the next 14 days, there is{' '}
              <strong>{result.formattedDisplayEventRate}</strong> risk of:
            </p>
            <ul className="list-none space-y-0.5 text-sm text-accent">
              {result.endpointLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Select the seven TIMI factors to see the educational 14-day composite
            risk band.
          </p>
        )}

        {result?.disclaimer ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        ) : null}

        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}
