'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { cmToDilationUnit, dilationToCm } from './calculation';
import type {
  BishopScoreFieldErrors,
  BishopScoreInput,
  BishopScoreResult,
  ConsistencyBand,
  CervicalPositionBand,
  DilationUnit,
  EffacementBand,
  StationBand,
} from './types';
import {
  CONSISTENCY_OPTIONS,
  DILATION_UNIT_LABELS,
  EFFACEMENT_OPTIONS,
  POSITION_OPTIONS,
  STATION_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

interface Props {
  input: BishopScoreInput;
  errors: BishopScoreFieldErrors;
  result: BishopScoreResult | null;
  onChange: (input: BishopScoreInput) => void;
  onLoadExample: () => void;
}

export function BishopScoreForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<BishopScoreInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: DilationUnit) => {
    if (next === input.dilationUnit) return;
    const raw = parseLoose(input.dilationValue);
    let nextValue = input.dilationValue;
    if (raw != null) {
      const cm = dilationToCm(raw, input.dilationUnit);
      if (cm != null) {
        nextValue = formatField(cmToDilationUnit(cm, next), next === 'mm' ? 1 : 2);
      }
    }
    set({ dilationUnit: next, dilationValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Complete the form and read the Bishop score at the bottom.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational classic Bishop score (0–13) from a cervical exam. It does
        not recommend induction or predict its success. Entries stay in your
        browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (closed · 0–30% · firm · −3 · posterior → 0)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="bishop-dilation">
          <span>Dilation</span>
          <InfoTooltip
            label="Dilation"
            text="Cervical opening in centimeters (or millimeters). Closed (&lt;1 cm) scores 0; 1–2 cm scores 1; 3–4 cm scores 2; ≥5 cm scores 3."
          />
        </label>
        <FieldShell error={errors.dilationValue}>
          <input
            id="bishop-dilation"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Cervical dilation"
            value={input.dilationValue}
            aria-invalid={Boolean(errors.dilationValue)}
            onChange={(e) => set({ dilationValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Dilation unit"
            value={input.dilationUnit}
            onChange={(e) => switchUnit(e.target.value as DilationUnit)}
          >
            {(Object.keys(DILATION_UNIT_LABELS) as DilationUnit[]).map((u) => (
              <option key={u} value={u}>
                {DILATION_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.dilationValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dilationValue}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Effacement</span>
          <InfoTooltip
            label="Effacement"
            text="Cervical thinning as a percentage of full length. Classic bands: 0–30% (0), 40–50% (1), 60–70% (2), ≥80% (3)."
          />
        </legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Effacement">
          {EFFACEMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bishop-effacement"
                className="h-4 w-4 accent-primary"
                checked={input.effacement === opt.value}
                onChange={() => set({ effacement: opt.value as EffacementBand })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Consistency</span>
          <InfoTooltip
            label="Consistency"
            text="How the cervix feels on exam: firm (0), moderately firm / medium (1), or soft (2)."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Consistency"
        >
          {CONSISTENCY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bishop-consistency"
                className="h-4 w-4 accent-primary"
                checked={input.consistency === opt.value}
                onChange={() =>
                  set({ consistency: opt.value as ConsistencyBand })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Station</span>
          <InfoTooltip
            label="Station"
            text="Fetal head height relative to the ischial spines on the classic −3 to +2 Bishop scale (not the −5 to +5 ACOG centimeter scale)."
          />
        </legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Station">
          {STATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-start gap-2 text-sm leading-snug text-accent"
            >
              <input
                type="radio"
                name="bishop-station"
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                checked={input.station === opt.value}
                onChange={() => set({ station: opt.value as StationBand })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Baby&apos;s head position</span>
          <InfoTooltip
            label="Baby's head position"
            text="Scored item is cervical position relative to the fetal head and pelvis (posterior 0, mid-position 1, anterior 2)—not fetal occiput presentation."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Cervical position"
        >
          {POSITION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bishop-position"
                className="h-4 w-4 accent-primary"
                checked={input.position === opt.value}
                onChange={() =>
                  set({ position: opt.value as CervicalPositionBand })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Label kept for screenshot parity; the scored measure is{' '}
          <span className="font-medium text-accent">cervical position</span>.
        </p>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="bishop-score-out">
          <span>Bishop score</span>
          <InfoTooltip
            label="Bishop score"
            text="Sum of the five classic item scores (range 0–13). Blank until dilation is entered."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="bishop-score-out"
            className="w-full text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedScore : ''}
          </output>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational score only — not an induction recommendation.'}
        </p>
      </div>
    </form>
  );
}
