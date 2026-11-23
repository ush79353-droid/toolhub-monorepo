'use client';

import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FourTScoreFieldErrors,
  FourTScoreInput,
  FourTScoreResult,
  OtherCauses,
  PlateletFall,
  PlateletNadir,
  FourTTiming,
  FourTThrombosis,
} from './types';
import {
  OTHER_CAUSES_OPTIONS,
  PLATELET_FALL_OPTIONS,
  PLATELET_NADIR_OPTIONS,
  THROMBOSIS_OPTIONS,
  TIMING_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';
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
        muted
          ? 'border-border bg-sky-50/80'
          : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: FourTScoreInput;
  errors: FourTScoreFieldErrors;
  result: FourTScoreResult | null;
  onChange: (input: FourTScoreInput) => void;
  onLoadExample: () => void;
}

export function FourTScoreForm({
  input,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<FourTScoreInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational 4Ts pretest score (0–8) for heparin-induced thrombocytopenia.
        Platelet fall and nadir score jointly as one component. Entries stay in
        your browser only — share uses the page URL.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (intermediate pretest profile)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Platelet count fall</span>
          <InfoTooltip
            label="Platelet count fall"
            text="Percent fall from baseline (or peak) while on heparin. Jointly scored with platelet nadir as one 4Ts component."
          />
        </legend>
        <div
          className="mt-1 flex flex-wrap gap-x-6 gap-y-2"
          role="radiogroup"
          aria-label="Platelet count fall"
        >
          {PLATELET_FALL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="4t-fall"
                className="h-4 w-4 accent-primary"
                checked={input.plateletFall === opt.value}
                onChange={() =>
                  set({ plateletFall: opt.value as PlateletFall })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="4t-timing">
          <span>Timing</span>
          <InfoTooltip
            label="Timing"
            text="Timing of thrombocytopenia relative to heparin exposure: highest points for clear onset days 5–10 or rapid fall with recent heparin."
          />
        </label>
        <FieldShell>
          <select
            id="4t-timing"
            className={selectClass}
            value={input.timing}
            onChange={(e) =>
              set({ timing: e.target.value as FourTTiming })
            }
          >
            {TIMING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Platelet nadir</span>
          <InfoTooltip
            label="Platelet nadir"
            text="Lowest platelet count (×10⁹/L). Combined with percent fall to determine the thrombocytopenia component — not a separate 4Ts column."
          />
        </legend>
        <div
          className="mt-1 flex flex-wrap gap-x-6 gap-y-2"
          role="radiogroup"
          aria-label="Platelet nadir"
        >
          {PLATELET_NADIR_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="4t-nadir"
                className="h-4 w-4 accent-primary"
                checked={input.plateletNadir === opt.value}
                onChange={() =>
                  set({ plateletNadir: opt.value as PlateletNadir })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="4t-thrombosis">
          <span>Thrombosis</span>
          <InfoTooltip
            label="Thrombosis"
            text="New or progressive thrombosis, skin lesions, or acute systemic reaction temporally linked to heparin."
          />
        </label>
        <FieldShell>
          <select
            id="4t-thrombosis"
            className={selectClass}
            value={input.thrombosis}
            onChange={(e) =>
              set({ thrombosis: e.target.value as FourTThrombosis })
            }
          >
            {THROMBOSIS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Other possible causes</span>
          <InfoTooltip
            label="Other possible causes"
            text="Competing explanations for thrombocytopenia (sepsis, DIC, line-related, etc.). None scores 2; definite alternate cause scores 0."
          />
        </legend>
        <div
          className="mt-1 flex flex-wrap gap-x-6 gap-y-2"
          role="radiogroup"
          aria-label="Other possible causes"
        >
          {OTHER_CAUSES_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="4t-other"
                className="h-4 w-4 accent-primary"
                checked={input.otherCauses === opt.value}
                onChange={() =>
                  set({ otherCauses: opt.value as OtherCauses })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="4t-score-out">
          <span>4Ts score</span>
          <InfoTooltip
            label="4Ts score"
            text="Sum of four components (thrombocytopenia joint score + timing + thrombosis + other causes), 0–8 points."
          />
        </label>
        <FieldShell muted>
          <input
            id="4t-score-out"
            className={inputClass}
            readOnly
            tabIndex={-1}
            aria-label="4Ts score"
            value={result?.formattedScore ?? ''}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
            pts
          </span>
        </FieldShell>
      </div>

      {result ? (
        <div
          className="flex items-start gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent"
          aria-live="polite"
        >
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
            aria-hidden
          />
          <span>{result.interpretation}</span>
        </div>
      ) : null}

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
    </form>
  );
}