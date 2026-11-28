'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertFromCm,
  convertHandMeasurementToCm,
  calculateHandMeasurementFromSize,
  formatGloveMeasurement,
  fmt,
  getGloveSizingChart,
} from './calculation';
import { GloveMeasureDiagram } from './GloveMeasureDiagram';
import {
  STYLE_LABELS,
  UNIT_LABELS,
  createEmptyInput,
  type GloveSizeFieldErrors,
  type GloveSizeInput,
  type GloveStyle,
  type MeasurementUnit,
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

interface GloveSizeFormProps {
  input: GloveSizeInput;
  errors: GloveSizeFieldErrors;
  onChange: (next: GloveSizeInput) => void;
}

export function GloveSizeForm({
  input,
  errors,
  onChange,
}: GloveSizeFormProps) {
  const set = (patch: Partial<GloveSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: MeasurementUnit) => {
    if (next === input.unit) return;
    const raw = input.handCircumference.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<GloveSizeInput> = { unit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertHandMeasurementToCm(n, input.unit);
      patch.handCircumference = String(
        Number(convertFromCm(cm, next).toFixed(next === 'mm' ? 1 : 2)),
      );
    }
    set(patch);
  };

  const chart = getGloveSizingChart(input.gloveStyle);
  const reverse = calculateHandMeasurementFromSize(
    input.gloveStyle,
    input.reverseSize,
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate glove size from palm circumference. Style selects a sizing
        convention — not a judgment about the wearer. Brands vary.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (21 cm · men/unisex)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-white p-3.5">
            <h3 className="mb-2 text-[13px] font-semibold text-accent">
              Style of glove
            </h3>
            <fieldset>
              <legend className="sr-only">Glove style</legend>
              <div className="flex flex-col gap-2">
                {(Object.keys(STYLE_LABELS) as GloveStyle[]).map((s) => (
                  <label
                    key={s}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="glove-style"
                      className="h-4 w-4"
                      checked={input.gloveStyle === s}
                      onChange={() => {
                        const sizes = getGloveSizingChart(s).sizes;
                        const hasReverse = sizes.some(
                          (x) => x.label === input.reverseSize,
                        );
                        set({
                          gloveStyle: s,
                          reverseSize: hasReverse
                            ? input.reverseSize
                            : (sizes[Math.floor(sizes.length / 2)]?.label ??
                              'M'),
                        });
                      }}
                    />
                    {STYLE_LABELS[s]}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <label className={labelClass} htmlFor="gs-unit">
              Units
            </label>
            <select
              id="gs-unit"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.unit}
              onChange={(e) =>
                switchUnit(e.target.value as MeasurementUnit)
              }
            >
              {(Object.keys(UNIT_LABELS) as MeasurementUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="gs-circ">
              Hand circumference
              <InfoTooltip content="Measure around the widest part of your palm, just below the knuckles, excluding the thumb." />
            </label>
            <FieldShell error={errors.handCircumference}>
              <input
                id="gs-circ"
                className={inputClass}
                inputMode="decimal"
                value={input.handCircumference}
                onChange={(e) => set({ handCircumference: e.target.value })}
              />
              <span className="border-l border-border px-2 text-xs text-muted-foreground">
                {UNIT_LABELS[input.unit]}
              </span>
            </FieldShell>
            {errors.handCircumference ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.handCircumference}
              </p>
            ) : null}
          </div>
        </div>
        {input.showMeasureHelp ? <GloveMeasureDiagram /> : null}
      </div>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => set({ showMeasureHelp: !input.showMeasureHelp })}
        aria-expanded={input.showMeasureHelp}
      >
        {input.showMeasureHelp ? 'Hide' : 'Show'} measurement instructions
      </button>
      {input.showMeasureHelp ? (
        <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Open your hand naturally with fingers together.</li>
          <li>Wrap a soft tape around the widest part of the palm.</li>
          <li>Keep the tape just below the knuckles.</li>
          <li>Exclude the thumb; do not pull too tightly.</li>
          <li>If hands differ, use the larger measurement (or dominant hand).</li>
        </ol>
      ) : null}

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showReverse}
          onClick={() => set({ showReverse: !input.showReverse })}
        >
          Glove size → hand measurement
          <span className="text-xs font-normal text-muted-foreground">
            {input.showReverse ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showReverse ? (
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelClass} htmlFor="gs-rev">
                Glove size
              </label>
              <select
                id="gs-rev"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.reverseSize}
                onChange={(e) => set({ reverseSize: e.target.value })}
              >
                {chart.sizes.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                    {s.numericSize ? ` (≈ ${s.numericSize})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {reverse ? (
              <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Minimum</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatGloveMeasurement(reverse.minCm, input.unit)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Maximum</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatGloveMeasurement(reverse.maxCm, input.unit)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Midpoint</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatGloveMeasurement(reverse.midCm, input.unit)}
                  </dd>
                </div>
                <div className="sm:col-span-3 text-[11px] text-muted-foreground">
                  ≈ {fmt(reverse.minCm, 1)}–{fmt(reverse.maxCm, 1)} cm ·{' '}
                  {fmt(reverse.minCm / 2.54, 2)}–{fmt(reverse.maxCm / 2.54, 2)}{' '}
                  in on this chart
                </div>
              </dl>
            ) : (
              <p className="text-xs text-rose-600">
                That size is not defined on the selected chart.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}
