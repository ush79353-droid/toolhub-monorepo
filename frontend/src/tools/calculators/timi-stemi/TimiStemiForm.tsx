'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  TimiStemiAgeBand,
  TimiStemiFieldErrors,
  TimiStemiInput,
  TimiStemiResult,
  YesNo,
} from './types';
import { AGE_OPTIONS, FACTOR_OPTIONS, YES_NO_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: TimiStemiInput;
  errors: TimiStemiFieldErrors;
  result: TimiStemiResult | null;
  onChange: (input: TimiStemiInput) => void;
  onLoadExample: () => void;
}

export function TimiStemiForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<TimiStemiInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Select age and clinical factors to see the educational TIMI STEMI score.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Morrow 2000 TIMI risk score for STEMI (InTIME II derivation). Educational
        0–14 point total with published 30-day mortality bands. Not a triage or
        treatment order. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age &lt;65 → score 0 · 0.8%)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Morrow/TIMI points: under 65 → 0; 65–74 → 2; 75 or older → 3. The screenshot’s top band is shown as ≥75 so age 75 is scored correctly."
          />
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Age band">
          {AGE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="timi-stemi-age"
                className="h-4 w-4 accent-primary"
                checked={input.ageBand === opt.value}
                onChange={() => set({ ageBand: opt.value as TimiStemiAgeBand })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.ageBand ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageBand}</p>
        ) : null}
      </fieldset>

      <div className="space-y-2.5">
        <p className={labelClass}>Please tick all that apply</p>
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
            <span>{factor.label}</span>
          </label>
        ))}
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Weight checkbox uses the published &lt;67 kg item; the label also shows
          150 lbs per the reference UI. History is one combined
          diabetes/hypertension/angina point.
        </p>
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Killip class II-IV</span>
          <InfoTooltip
            label="Killip class II-IV"
            text="Killip II–IV (JVD or any pulmonary findings of CHF) adds 2 points in the Morrow TIMI STEMI score."
          />
        </legend>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Killip class II-IV"
        >
          {YES_NO_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="timi-stemi-killip"
                className="h-4 w-4 accent-primary"
                checked={input.killipClassIiToIv === opt.value}
                onChange={() => set({ killipClassIiToIv: opt.value as YesNo })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Anterior lead ST elevation or LBBB</span>
          <InfoTooltip
            label="Anterior ST elevation or LBBB"
            text="Anterior ST-segment elevation or left bundle branch block on the presenting ECG adds 1 point."
          />
        </legend>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Anterior lead ST elevation or LBBB"
        >
          {YES_NO_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="timi-stemi-anterior"
                className="h-4 w-4 accent-primary"
                checked={input.anteriorStElevationOrLbbb === opt.value}
                onChange={() =>
                  set({ anteriorStElevationOrLbbb: opt.value as YesNo })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className={labelClass}>
          <span>TIMI STEMI score</span>
          <InfoTooltip
            label="TIMI STEMI score"
            text="Additive Morrow score from 0 to 14 with InTIME II 30-day mortality bands. Educational only — not a reperfusion or disposition order."
          />
        </div>
        <div
          className="flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary"
          aria-live="polite"
          aria-label="TIMI STEMI score result"
        >
          {result ? result.formattedScore : ''}
        </div>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Educational InTIME II 30-day mortality band:{' '}
            {result.formattedMortality}. Not a treatment order.
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Answer all questions to see the result.
          </p>
        )}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
