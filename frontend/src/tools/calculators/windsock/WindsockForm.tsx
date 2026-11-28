'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertImperialToKnots,
  convertKnotsToImperial,
  convertKnotsToMetric,
  convertMetricToKnots,
  fmt,
} from './calculation';
import {
  IMPERIAL_UNIT_LABELS,
  METRIC_UNIT_LABELS,
  createEmptyInput,
  type ImperialUnit,
  type MetricUnit,
  type WindsockFieldErrors,
  type WindsockInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface WindsockFormProps {
  input: WindsockInput;
  errors: WindsockFieldErrors;
  onChange: (next: WindsockInput) => void;
}

export function WindsockForm({ input, errors, onChange }: WindsockFormProps) {
  const set = (patch: Partial<WindsockInput>) =>
    onChange({ ...input, ...patch });

  const switchImperial = (next: ImperialUnit) => {
    const n = Number(input.imperialSpeed.trim().replace(/,/g, ''));
    if (input.imperialSpeed.trim() !== '' && Number.isFinite(n)) {
      const kn = convertImperialToKnots(n, input.imperialUnit);
      set({
        imperialUnit: next,
        imperialSpeed: fmt(convertKnotsToImperial(kn, next), 3),
        calculationSource: 'imperial',
      });
      return;
    }
    set({ imperialUnit: next });
  };

  const switchMetric = (next: MetricUnit) => {
    const n = Number(input.metricSpeed.trim().replace(/,/g, ''));
    if (input.metricSpeed.trim() !== '' && Number.isFinite(n)) {
      const kn = convertMetricToKnots(n, input.metricUnit);
      set({
        metricUnit: next,
        metricSpeed: fmt(convertKnotsToMetric(kn, next), 3),
        calculationSource: 'metric',
      });
      return;
    }
    set({ metricUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate wind speed from extended windsock segments (≈3 kn each in a
        simplified five-segment model) or convert between knots, mph, km/h, m/s,
        and ft/s. Visual estimate only — not a calibrated instrument.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (3 segments)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <div>
          <label className={labelClass} htmlFor="ws-seg">
            Number of segments (n)
            <InfoTooltip content="Count of extended segments on a standard five-segment windsock (0–5). Integer only." />
          </label>
          <FieldShell error={errors.segments}>
            <input
              id="ws-seg"
              className={inputClass}
              inputMode="numeric"
              value={input.segments}
              onChange={(e) =>
                set({
                  segments: e.target.value,
                  calculationSource: 'segments',
                })
              }
              aria-invalid={Boolean(errors.segments)}
            />
          </FieldShell>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  set({
                    segments: String(n),
                    calculationSource: 'segments',
                  })
                }
                className={`rounded-md border px-2.5 py-1 text-xs tabular-nums ${
                  input.segments === String(n)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-accent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {errors.segments ? (
            <p className="mt-1 text-xs text-rose-600">{errors.segments}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ws-kn">
            Wind speed
            <InfoTooltip content="Estimated or entered speed in knots (kn)." />
          </label>
          <FieldShell error={errors.speedKnots}>
            <input
              id="ws-kn"
              className={inputClass}
              inputMode="decimal"
              value={input.speedKnots}
              onChange={(e) =>
                set({
                  speedKnots: e.target.value,
                  calculationSource: 'knots',
                })
              }
              aria-invalid={Boolean(errors.speedKnots)}
            />
            <span className="pr-3 text-xs text-muted-foreground">kn</span>
          </FieldShell>
          {errors.speedKnots ? (
            <p className="mt-1 text-xs text-rose-600">{errors.speedKnots}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ws-imp">
            Speed (imperial)
          </label>
          <FieldShell error={errors.imperialSpeed}>
            <input
              id="ws-imp"
              className={inputClass}
              inputMode="decimal"
              value={input.imperialSpeed}
              onChange={(e) =>
                set({
                  imperialSpeed: e.target.value,
                  calculationSource: 'imperial',
                })
              }
              aria-invalid={Boolean(errors.imperialSpeed)}
            />
            <select
              aria-label="Imperial unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.imperialUnit}
              onChange={(e) =>
                switchImperial(e.target.value as ImperialUnit)
              }
            >
              {(Object.keys(IMPERIAL_UNIT_LABELS) as ImperialUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {IMPERIAL_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </FieldShell>
          {errors.imperialSpeed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.imperialSpeed}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ws-met">
            Speed (metric)
          </label>
          <FieldShell error={errors.metricSpeed}>
            <input
              id="ws-met"
              className={inputClass}
              inputMode="decimal"
              value={input.metricSpeed}
              onChange={(e) =>
                set({
                  metricSpeed: e.target.value,
                  calculationSource: 'metric',
                })
              }
              aria-invalid={Boolean(errors.metricSpeed)}
            />
            <select
              aria-label="Metric unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.metricUnit}
              onChange={(e) => switchMetric(e.target.value as MetricUnit)}
            >
              {(Object.keys(METRIC_UNIT_LABELS) as MetricUnit[]).map((u) => (
                <option key={u} value={u}>
                  {METRIC_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.metricSpeed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.metricSpeed}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
