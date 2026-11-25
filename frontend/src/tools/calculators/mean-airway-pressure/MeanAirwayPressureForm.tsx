'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EquationMode,
  MeanAirwayPressureFieldErrors,
  MeanAirwayPressureInput,
  MeanAirwayPressureResult,
  TimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const unitClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';

interface Props {
  input: MeanAirwayPressureInput;
  errors: MeanAirwayPressureFieldErrors;
  result: MeanAirwayPressureResult | null;
  onChange: (input: MeanAirwayPressureInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function MeanAirwayPressureForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<MeanAirwayPressureInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Pmean = PEEP + k×(PIP−PEEP)×(Ti/Ttot). Frequency mode uses
        Ttot = 60/f. Not a ventilator order.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (PEEP 5 · PIP 25 · k 1 · duty 0.25 → 10)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>Equation type</legend>
        <div className="flex flex-wrap gap-4 text-sm text-accent">
          {(
            [
              ['totalCycleTime', 'Total cycle time'],
              ['frequency', 'Frequency'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="map-mode"
                checked={input.mode === value}
                onChange={() => set({ mode: value as EquationMode })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {input.mode === 'totalCycleTime' ? (
        <div>
          <label className={labelClass} htmlFor="map-ttot">
            Total cycle time
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.totalCycleTime ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="map-ttot"
              className={inputClass}
              inputMode="decimal"
              value={input.totalCycleTime ?? ''}
              onChange={(e) =>
                set({ totalCycleTime: parseOptional(e.target.value) })
              }
            />
            <select
              className={selectClass}
              aria-label="Total cycle time unit"
              value={input.timeUnit}
              onChange={(e) => set({ timeUnit: e.target.value as TimeUnit })}
            >
              <option value="sec">sec</option>
              <option value="ms">ms</option>
            </select>
          </div>
          {errors.totalCycleTime ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.totalCycleTime}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="map-freq">
            <span>Frequency</span>
            <InfoTooltip
              label="Frequency"
              text="Respiratory rate in breaths per minute. Ttot (sec) = 60 / frequency."
            />
          </label>
          <div
            className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.frequency ? 'border-rose-400' : 'border-border'
            }`}
          >
            <input
              id="map-freq"
              className={inputClass}
              inputMode="decimal"
              value={input.frequency ?? ''}
              onChange={(e) =>
                set({ frequency: parseOptional(e.target.value) })
              }
            />
            <span className={unitClass}>breaths/min</span>
          </div>
          {errors.frequency ? (
            <p className="mt-1 text-xs text-destructive">{errors.frequency}</p>
          ) : null}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="map-ti">
          Inspiratory time
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.inspiratoryTime ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="map-ti"
            className={inputClass}
            inputMode="decimal"
            value={input.inspiratoryTime ?? ''}
            onChange={(e) =>
              set({ inspiratoryTime: parseOptional(e.target.value) })
            }
          />
          <select
            className={selectClass}
            aria-label="Inspiratory time unit"
            value={input.timeUnit}
            onChange={(e) => set({ timeUnit: e.target.value as TimeUnit })}
          >
            <option value="sec">sec</option>
            <option value="ms">ms</option>
          </select>
        </div>
        {errors.inspiratoryTime ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.inspiratoryTime}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="map-k">
          <span>K</span>
          <InfoTooltip
            label="K"
            text="Waveform factor. Square-wave inspiratory flow commonly uses k = 1."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.k ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="map-k"
            className={inputClass}
            inputMode="decimal"
            value={input.k ?? ''}
            onChange={(e) => set({ k: parseOptional(e.target.value) })}
          />
        </div>
        {errors.k ? (
          <p className="mt-1 text-xs text-destructive">{errors.k}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="map-peep">
          PEEP
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.peep ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="map-peep"
            className={inputClass}
            inputMode="decimal"
            value={input.peep ?? ''}
            onChange={(e) => set({ peep: parseOptional(e.target.value) })}
          />
          <span className={unitClass}>cmH₂O</span>
        </div>
        {errors.peep ? (
          <p className="mt-1 text-xs text-destructive">{errors.peep}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="map-pip">
          PIP
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.pip ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="map-pip"
            className={inputClass}
            inputMode="decimal"
            value={input.pip ?? ''}
            onChange={(e) => set({ pip: parseOptional(e.target.value) })}
          />
          <span className={unitClass}>cmH₂O</span>
        </div>
        {errors.pip ? (
          <p className="mt-1 text-xs text-destructive">{errors.pip}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>Mean airway pressure</div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result ? result.formatted : '—'}
          </div>
          <span className={unitClass}>cmH₂O</span>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </div>
    </form>
  );
}
