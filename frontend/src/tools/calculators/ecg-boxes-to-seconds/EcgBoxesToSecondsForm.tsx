'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DurationUnit,
  EcgBoxType,
  EcgBoxesToSecondsFieldErrors,
  EcgBoxesToSecondsInput,
  EcgBoxesToSecondsResult,
  EcgPaperSpeed,
} from './types';
import {
  BOX_TYPE_OPTIONS,
  DURATION_UNIT_LABELS,
  PAPER_SPEED_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: EcgBoxesToSecondsInput;
  errors: EcgBoxesToSecondsFieldErrors;
  result: EcgBoxesToSecondsResult | null;
  onChange: (input: EcgBoxesToSecondsInput) => void;
  onLoadExample: () => void;
}

export function EcgBoxesToSecondsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EcgBoxesToSecondsInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Convert a counted ECG grid interval to time. Small boxes are 1 mm and
        big boxes are 5 mm on standard paper. Duration = boxes × width ÷ paper
        speed. Educational timing aid only — not a diagnosis.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (1 small box · 25 mm/s → 0.04 sec)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="ecg-boxes-count">
          <span>Number of boxes</span>
          <InfoTooltip
            label="Number of boxes"
            text="How many consecutive small or large grid boxes span the interval you are timing on the ECG strip."
          />
        </label>
        <FieldShell error={errors.boxCount}>
          <input
            id="ecg-boxes-count"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Number of boxes"
            value={input.boxCount}
            aria-invalid={Boolean(errors.boxCount)}
            onChange={(e) => set({ boxCount: e.target.value })}
          />
        </FieldShell>
        {errors.boxCount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.boxCount}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Type of box</span>
          <InfoTooltip
            label="Type of box"
            text="Small (1 mm) is the fine grid square. Big (5 mm) is the bold square (five small boxes wide)."
          />
        </legend>
        <div className="flex flex-wrap gap-4 pt-1">
          {BOX_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ecg-box-type"
                className="h-4 w-4 accent-primary"
                checked={input.boxType === opt.value}
                onChange={() => set({ boxType: opt.value as EcgBoxType })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Paper speed</span>
          <InfoTooltip
            label="Paper speed"
            text="Horizontal paper speed printed on the ECG (commonly 25 mm/s; some recordings use 50 mm/s)."
          />
        </legend>
        <div className="flex flex-wrap gap-4 pt-1">
          {PAPER_SPEED_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ecg-paper-speed"
                className="h-4 w-4 accent-primary"
                checked={input.paperSpeed === opt.value}
                onChange={() =>
                  set({ paperSpeed: opt.value as EcgPaperSpeed })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="ecg-boxes-duration">
          <span>Duration</span>
          <InfoTooltip
            label="Duration"
            text="Computed interval length. Changing the unit keeps the same physical time (for example 0.04 sec = 40 ms)."
          />
        </label>
        <FieldShell muted>
          <input
            id="ecg-boxes-duration"
            className={`${inputClass} cursor-default`}
            readOnly
            tabIndex={0}
            placeholder=""
            aria-label="Duration"
            aria-live="polite"
            value={result?.formattedDuration ?? ''}
          />
          <select
            className={selectClass}
            aria-label="Duration unit"
            value={input.durationUnit}
            onChange={(e) =>
              set({ durationUnit: e.target.value as DurationUnit })
            }
          >
            {(Object.keys(DURATION_UNIT_LABELS) as DurationUnit[]).map((u) => (
              <option key={u} value={u}>
                {DURATION_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>
    </form>
  );
}
