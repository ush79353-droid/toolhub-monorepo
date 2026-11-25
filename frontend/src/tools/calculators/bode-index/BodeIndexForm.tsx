'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatScore } from './calculation';
import {
  FEV1_OPTIONS,
  MMRC_OPTIONS,
  WALK_OPTIONS,
  type BodeIndexFieldErrors,
  type BodeIndexInput,
  type BodeIndexResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
        muted ? 'border-sky-200 bg-sky-50/60' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: BodeIndexInput;
  errors: BodeIndexFieldErrors;
  result: BodeIndexResult | null;
  onChange: (input: BodeIndexInput) => void;
}

export function BodeIndexForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<BodeIndexInput>) => onChange({ ...input, ...patch });
  const scoreDisplay = result?.score != null ? formatScore(result.score) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="BODE Index inputs">
        <div>
          <label className={`${labelClass} cursor-pointer`} htmlFor="bode-bmi">
            <input
              id="bode-bmi"
              type="checkbox"
              className="mr-2 h-4 w-4"
              checked={input.bmiOver21 === true}
              ref={(el) => {
                if (el) el.indeterminate = input.bmiOver21 === null;
              }}
              onChange={(e) => {
                if (input.bmiOver21 === null) {
                  set({ bmiOver21: e.target.checked });
                  return;
                }
                set({ bmiOver21: e.target.checked });
              }}
            />
            BMI over 21
            <InfoTooltip text="Celli: BMI ≤ 21 = 1 point; BMI > 21 = 0. Unanswered BMI is not scored as low BMI." />
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              {input.bmiOver21 === null
                ? 'Not answered'
                : input.bmiOver21
                  ? 'BMI > 21 → 0 points'
                  : 'BMI ≤ 21 → 1 point'}
            </span>
            {input.bmiOver21 === null ? (
              <button
                type="button"
                className="text-primary underline"
                onClick={() => set({ bmiOver21: false })}
              >
                Confirm BMI ≤ 21
              </button>
            ) : (
              <button
                type="button"
                className="text-primary underline"
                onClick={() => set({ bmiOver21: null })}
              >
                Clear BMI answer
              </button>
            )}
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>
            FEV1 (% predicted)
            <InfoTooltip text="Airflow obstruction points: ≥65=0, 50–64=1, 36–49=2, ≤35=3." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="FEV1 percent predicted">
            {FEV1_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="bode-fev1"
                  checked={input.fev1 === opt.value}
                  onChange={() => set({ fev1: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            6-min walk distance
            <InfoTooltip text="Exercise capacity: ≥350 m=0, 250–349=1, 150–249=2, ≤149=3." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Six-minute walk distance">
            {WALK_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="bode-walk"
                  checked={input.walk === opt.value}
                  onChange={() => set({ walk: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            mMRC Dyspnea Scale
            <InfoTooltip text="Dyspnea: mMRC 0–1=0, 2=1, 3=2, 4=3 points on the BODE table." />
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="mMRC dyspnea scale">
            {MMRC_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="bode-mmrc"
                  checked={input.mmrc === opt.value}
                  onChange={() => set({ mmrc: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="BODE Index result">
        <div>
          <div className={labelClass}>BODE Index score</div>
          <FieldShell muted>
            <input
              readOnly
              className="h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none"
              value={scoreDisplay}
              aria-label="BODE Index score"
            />
          </FieldShell>
          {result ? (
            <p className="mt-2 text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : null}
          {errors.form ? (
            <p className="mt-2 text-xs text-rose-600">{errors.form}</p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
