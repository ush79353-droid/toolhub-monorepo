'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BbtFieldErrors,
  BbtInput,
  BbtResult,
  TemperatureUnit,
} from './types';
import { TEMPERATURE_UNIT_LABELS } from './types';

function parseFiniteNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

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

interface BbtFormProps {
  input: BbtInput;
  errors: BbtFieldErrors;
  result: BbtResult | null;
  onChange: (input: BbtInput) => void;
  onLoadExample: () => void;
}

export function BbtForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: BbtFormProps) {
  const unit = input.temperatureUnit;
  const unitLabel = TEMPERATURE_UNIT_LABELS[unit];

  const adjustedDisplay = result
    ? result.formattedAdjusted.replace(` ${unitLabel}`, '')
    : '';
  const deltaDisplay = result
    ? result.formattedTemperatureDifference.replace(` ${unitLabel}`, '')
    : '';

  const switchUnit = (next: TemperatureUnit) => {
    if (next === input.temperatureUnit) return;
    const measured = parseFiniteNumber(input.measuredTemperature);
    let nextMeasured = input.measuredTemperature;
    if (measured != null) {
      const celsius =
        input.temperatureUnit === 'fahrenheit'
          ? ((measured - 32) * 5) / 9
          : measured;
      const converted =
        next === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
      nextMeasured = converted.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        useGrouping: false,
      });
    }
    onChange({
      ...input,
      temperatureUnit: next,
      measuredTemperature: nextMeasured,
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational timing adjustment using 0.05 °C per 30 minutes (0.1 °C per
        hour). Not ovulation confirmation and not contraception advice. Entries
        stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (6:30 → 7:00 · 36.60 °C → 36.55 °C)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="bbt-usual-hrs">
          <span>Usual temperature check time</span>
          <InfoTooltip
            label="Usual temperature check time"
            text="The clock time you normally take basal temperature after waking, before getting out of bed."
          />
        </label>
        <FieldShell error={errors.usualTime}>
          <input
            id="bbt-usual-hrs"
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            aria-label="Usual check hours"
            value={input.usualHours}
            aria-invalid={Boolean(errors.usualTime)}
            onChange={(e) =>
              onChange({ ...input, usualHours: e.target.value })
            }
          />
          <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
            hrs
          </span>
          <span className="px-1 text-muted-foreground" aria-hidden>
            |
          </span>
          <input
            id="bbt-usual-min"
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            aria-label="Usual check minutes"
            value={input.usualMinutes}
            aria-invalid={Boolean(errors.usualTime)}
            onChange={(e) =>
              onChange({ ...input, usualMinutes: e.target.value })
            }
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">min</span>
        </FieldShell>
        {errors.usualTime ? (
          <p className="mt-1 text-xs text-rose-600">{errors.usualTime}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bbt-actual-hrs">
          <span>Actual temperature check time</span>
          <InfoTooltip
            label="Actual temperature check time"
            text="The clock time of today’s basal temperature reading."
          />
        </label>
        <FieldShell error={errors.actualTime}>
          <input
            id="bbt-actual-hrs"
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            aria-label="Actual check hours"
            value={input.actualHours}
            aria-invalid={Boolean(errors.actualTime)}
            onChange={(e) =>
              onChange({ ...input, actualHours: e.target.value })
            }
          />
          <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
            hrs
          </span>
          <span className="px-1 text-muted-foreground" aria-hidden>
            |
          </span>
          <input
            id="bbt-actual-min"
            className={inputClass}
            inputMode="numeric"
            placeholder="0"
            aria-label="Actual check minutes"
            value={input.actualMinutes}
            aria-invalid={Boolean(errors.actualTime)}
            onChange={(e) =>
              onChange({ ...input, actualMinutes: e.target.value })
            }
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">min</span>
        </FieldShell>
        {errors.actualTime ? (
          <p className="mt-1 text-xs text-rose-600">{errors.actualTime}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bbt-measured">
          <span>Measured temperature</span>
          <InfoTooltip
            label="Measured temperature"
            text="The basal temperature you recorded at the actual check time. Switch °C/°F to relabel the absolute reading (difference scale does not use the +32 offset)."
          />
        </label>
        <FieldShell error={errors.measuredTemperature}>
          <input
            id="bbt-measured"
            className={inputClass}
            inputMode="decimal"
            value={input.measuredTemperature}
            aria-invalid={Boolean(errors.measuredTemperature)}
            onChange={(e) =>
              onChange({
                ...input,
                measuredTemperature: e.target.value,
              })
            }
          />
          <select
            className={selectClass}
            aria-label="Temperature unit"
            value={unit}
            onChange={(e) => switchUnit(e.target.value as TemperatureUnit)}
          >
            <option value="celsius">°C</option>
            <option value="fahrenheit">°F</option>
          </select>
        </FieldShell>
        {errors.measuredTemperature ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.measuredTemperature}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bbt-adjusted">
          <span>Adjusted temperature</span>
          <InfoTooltip
            label="Adjusted temperature"
            text="Estimated basal temperature at your usual check time using the linear 0.1 °C/hour rule when the timing gap is within ±6 hours."
          />
        </label>
        <FieldShell muted>
          <input
            id="bbt-adjusted"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={adjustedDisplay}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
            {unitLabel}
          </span>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="bbt-delta">
          <span>Temperature difference</span>
          <InfoTooltip
            label="Temperature difference"
            text="Timing correction applied to the measured reading (usual − actual) × rate. Shown in the selected unit using the difference scale only."
          />
        </label>
        <FieldShell muted>
          <input
            id="bbt-delta"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={deltaDisplay}
            aria-live="polite"
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
            {unitLabel}
          </span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
