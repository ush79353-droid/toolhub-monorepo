'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import {
  COMMON_FABRIC_COUNTS,
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  createEmptyInput,
  type CrossStitchFieldErrors,
  type CrossStitchInput,
  type LengthUnit,
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

interface CrossStitchFormProps {
  input: CrossStitchInput;
  errors: CrossStitchFieldErrors;
  onChange: (next: CrossStitchInput) => void;
}

export function CrossStitchForm({
  input,
  errors,
  onChange,
}: CrossStitchFormProps) {
  const set = (patch: Partial<CrossStitchInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'extraFabric',
      'strandLengthPerCrossCm',
      'skeinLengthCm',
    ] as const;
    const patch: Partial<CrossStitchInput> = { unit: next };
    for (const key of keys) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(convertLength(n, input.unit, next).toFixed(4)),
        );
      }
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Pattern size &amp; fabric settings. Count is threads/squares per inch;
        stitch-over sets how many threads each chart stitch covers (Aida usually
        1; evenweave/linen often 2).
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...createEmptyInput(),
              patternWidth: '100',
              patternHeight: '80',
              fabricCount: '14',
              stitchOver: '1',
              extraFabric: '8',
              unit: 'cm',
            })
          }
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (100×80 · 14 ct · 8 cm)
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="xs-w">
            Width
            <InfoTooltip content="Number of stitch positions across the pattern." />
          </label>
          <FieldShell error={errors.patternWidth}>
            <input
              id="xs-w"
              className={inputClass}
              inputMode="numeric"
              value={input.patternWidth}
              onChange={(e) => set({ patternWidth: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              stitches
            </span>
          </FieldShell>
          {errors.patternWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.patternWidth}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="xs-h">
            Height
            <InfoTooltip content="Number of stitch positions from top to bottom." />
          </label>
          <FieldShell error={errors.patternHeight}>
            <input
              id="xs-h"
              className={inputClass}
              inputMode="numeric"
              value={input.patternHeight}
              onChange={(e) => set({ patternHeight: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              stitches
            </span>
          </FieldShell>
          {errors.patternHeight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.patternHeight}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="xs-count">
            Fabric count
            <InfoTooltip content="Threads or Aida squares per inch. Aida count ≠ linen thread count naming — use the manufacturer count." />
          </label>
          <FieldShell error={errors.fabricCount}>
            <input
              id="xs-count"
              className={inputClass}
              inputMode="decimal"
              list="xs-counts"
              value={input.fabricCount}
              onChange={(e) => set({ fabricCount: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              ct
            </span>
          </FieldShell>
          <datalist id="xs-counts">
            {COMMON_FABRIC_COUNTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.fabricCount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fabricCount}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="xs-over">
            Stitch over
            <InfoTooltip content="Fabric threads covered by each chart stitch. 1 for Aida; 2 for many evenweave/linen projects." />
          </label>
          <select
            id="xs-over"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={
              input.stitchOver === '1' || input.stitchOver === '2'
                ? input.stitchOver
                : 'custom'
            }
            onChange={(e) => {
              if (e.target.value === 'custom') {
                set({ stitchOver: input.stitchOver === '1' || input.stitchOver === '2' ? '3' : input.stitchOver });
              } else {
                set({ stitchOver: e.target.value });
              }
            }}
          >
            <option value="1">1 thread (for Aida)</option>
            <option value="2">2 threads (evenweave / linen)</option>
            <option value="custom">Custom…</option>
          </select>
          {input.stitchOver !== '1' && input.stitchOver !== '2' ? (
            <FieldShell error={errors.stitchOver}>
              <input
                className={inputClass}
                inputMode="numeric"
                aria-label="Custom stitch over"
                value={input.stitchOver}
                onChange={(e) => set({ stitchOver: e.target.value })}
              />
            </FieldShell>
          ) : null}
          {errors.stitchOver ? (
            <p className="mt-1 text-xs text-rose-600">{errors.stitchOver}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="xs-unit">
            Units (margins &amp; lengths)
          </label>
          <select
            id="xs-unit"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.unit}
            onChange={(e) => switchUnit(e.target.value as LengthUnit)}
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="xs-extra">
            Extra fabric on each side
            <InfoTooltip content="Added on every side for framing/finishing — total +2× per axis." />
          </label>
          <FieldShell error={errors.extraFabric}>
            <input
              id="xs-extra"
              className={inputClass}
              inputMode="decimal"
              value={input.extraFabric}
              onChange={(e) => set({ extraFabric: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.extraFabric ? (
            <p className="mt-1 text-xs text-rose-600">{errors.extraFabric}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showThread}
          onClick={() => set({ showThread: !input.showThread })}
        >
          Estimate embroidery floss (optional)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showThread ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showThread ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="xs-cov">
                Pattern coverage %
              </label>
              <FieldShell error={errors.coveragePercentage}>
                <input
                  id="xs-cov"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.coveragePercentage}
                  onChange={(e) =>
                    set({ coveragePercentage: e.target.value })
                  }
                />
              </FieldShell>
              {errors.coveragePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.coveragePercentage}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="xs-str">
                Floss strands (working)
              </label>
              <FieldShell error={errors.flossStrands}>
                <input
                  id="xs-str"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.flossStrands}
                  onChange={(e) => set({ flossStrands: e.target.value })}
                />
              </FieldShell>
              {errors.flossStrands ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.flossStrands}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="xs-lpc">
                Strand length per full cross
              </label>
              <FieldShell error={errors.strandLengthPerCrossCm}>
                <input
                  id="xs-lpc"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.strandLengthPerCrossCm}
                  onChange={(e) =>
                    set({ strandLengthPerCrossCm: e.target.value })
                  }
                />
                <span className="border-l border-border px-2 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.unit]}
                </span>
              </FieldShell>
              {errors.strandLengthPerCrossCm ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.strandLengthPerCrossCm}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="xs-waste">
                Waste %
              </label>
              <FieldShell error={errors.wastePercentage}>
                <input
                  id="xs-waste"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.wastePercentage}
                  onChange={(e) => set({ wastePercentage: e.target.value })}
                />
              </FieldShell>
              {errors.wastePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.wastePercentage}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="xs-skein">
                Skein length (hank)
              </label>
              <FieldShell error={errors.skeinLengthCm}>
                <input
                  id="xs-skein"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.skeinLengthCm}
                  onChange={(e) => set({ skeinLengthCm: e.target.value })}
                />
                <span className="border-l border-border px-2 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.unit]}
                </span>
              </FieldShell>
              {errors.skeinLengthCm ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.skeinLengthCm}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="xs-sps">
                Strands per skein
              </label>
              <FieldShell error={errors.strandsPerSkein}>
                <input
                  id="xs-sps"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.strandsPerSkein}
                  onChange={(e) => set({ strandsPerSkein: e.target.value })}
                />
              </FieldShell>
              {errors.strandsPerSkein ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.strandsPerSkein}
                </p>
              ) : null}
            </div>
            <p className="sm:col-span-2 text-xs text-muted-foreground">
              Planning estimate only — not a per-color materials list. Skein
              length is the hank length before splitting into working strands.
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
