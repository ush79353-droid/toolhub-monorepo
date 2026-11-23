'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  distanceMmToIntervalValue,
  intervalToDistanceMm,
} from './calculation';
import type {
  EcgBoxType,
  EcgHeartRateFieldErrors,
  EcgHeartRateInput,
  EcgHeartRateResult,
  EcgPaperSpeed,
  RrIntervalUnit,
} from './types';
import { INTERVAL_UNIT_LABELS } from './types';

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

interface Props {
  input: EcgHeartRateInput;
  errors: EcgHeartRateFieldErrors;
  result: EcgHeartRateResult | null;
  onChange: (input: EcgHeartRateInput) => void;
  onLoadExample: () => void;
}

export function EcgHeartRateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EcgHeartRateInput>) =>
    onChange({ ...input, ...patch });

  const switchIntervalUnit = (next: RrIntervalUnit) => {
    if (next === input.intervalUnit) return;
    const raw = Number(input.intervalValue.trim().replace(/,/g, ''));
    let nextValue = input.intervalValue;
    if (input.intervalValue.trim() && Number.isFinite(raw) && raw > 0) {
      const mm = intervalToDistanceMm(raw, input.intervalUnit, input.paperSpeed);
      if (mm != null) {
        const converted = distanceMmToIntervalValue(mm, next, input.paperSpeed);
        if (converted != null) {
          const rounded = Math.round(converted * 10000) / 10000;
          nextValue = Number.isInteger(rounded)
            ? String(rounded)
            : String(Number(rounded.toFixed(4)));
        }
      }
    }
    set({
      intervalUnit: next,
      intervalValue: nextValue,
      lastEdited: 'interval',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter an R–R interval as distance or boxes to estimate BPM.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational single-interval estimate for regular rhythms. Millimeters
        are paper distance; seconds/milliseconds are time. Entries stay in your
        browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (20 mm / 4 big boxes @ 25 mm/s → 75 bpm)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="ecg-hr-interval">
          <span>R–R interval</span>
          <InfoTooltip
            label="R–R interval"
            text="Horizontal distance between consecutive R peaks. Use mm for strip distance, or s/ms for duration (converted with paper speed)."
          />
        </label>
        <FieldShell error={errors.intervalValue}>
          <input
            id="ecg-hr-interval"
            className={inputClass}
            inputMode="decimal"
            aria-label="R–R interval"
            value={input.intervalValue}
            aria-invalid={Boolean(errors.intervalValue)}
            onChange={(e) =>
              set({
                intervalValue: e.target.value,
                lastEdited: 'interval',
              })
            }
          />
          <select
            className={selectClass}
            aria-label="R–R interval unit"
            value={input.intervalUnit}
            onChange={(e) =>
              switchIntervalUnit(e.target.value as RrIntervalUnit)
            }
          >
            {(Object.keys(INTERVAL_UNIT_LABELS) as RrIntervalUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {INTERVAL_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.intervalValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.intervalValue}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Type of box</span>
          <InfoTooltip
            label="Type of box"
            text="Small (fine) boxes are 1 mm; big (bold) boxes are 5 mm on standard ECG paper."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Type of box"
        >
          {(
            [
              { value: 'small', label: 'Small' },
              { value: 'big', label: 'Big' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ecg-hr-box-type"
                className="h-4 w-4 accent-primary"
                checked={input.boxType === opt.value}
                onChange={() =>
                  set({
                    boxType: opt.value as EcgBoxType,
                    lastEdited:
                      input.boxesValue.trim() !== '' ? 'boxes' : input.lastEdited,
                  })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="ecg-hr-boxes">
          <span>R–R interval (boxes)</span>
          <InfoTooltip
            label="R–R interval (boxes)"
            text="Count of small or big boxes between consecutive R peaks. Synchronized with the millimeter/time field."
          />
        </label>
        <FieldShell error={errors.boxesValue}>
          <input
            id="ecg-hr-boxes"
            className={inputClass}
            inputMode="decimal"
            aria-label="R–R interval in boxes"
            value={input.boxesValue}
            aria-invalid={Boolean(errors.boxesValue)}
            onChange={(e) =>
              set({
                boxesValue: e.target.value,
                lastEdited: 'boxes',
              })
            }
          />
        </FieldShell>
        {errors.boxesValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.boxesValue}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Paper speed</span>
          <InfoTooltip
            label="Paper speed"
            text="Recording speed of the ECG machine. Standard adult speed is 25 mm/s; 50 mm/s is sometimes used."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Paper speed"
        >
          {(
            [
              { value: 25, label: '25 mm/s' },
              { value: 50, label: '50 mm/s' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ecg-hr-speed"
                className="h-4 w-4 accent-primary"
                checked={input.paperSpeed === opt.value}
                onChange={() =>
                  set({ paperSpeed: opt.value as EcgPaperSpeed })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="ecg-hr-bpm">
          <span>Beats per minute (BPM)</span>
          <InfoTooltip
            label="Beats per minute"
            text="BPM = 60 ÷ R–R duration in seconds. Blank until a positive interval is entered."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="ecg-hr-bpm"
            className="w-full text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedBpm : ''}
          </output>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational single-interval estimate — not for irregular rhythms alone.'}
        </p>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
