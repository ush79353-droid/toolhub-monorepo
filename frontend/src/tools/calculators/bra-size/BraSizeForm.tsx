'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { BraMeasureDiagram } from './BraMeasureDiagram';
import {
  LENGTH_UNIT_LABELS,
  METHOD_LABELS,
  REGION_LABELS,
  createEmptyInput,
  type BraFieldErrors,
  type BraInput,
  type BraSizingRegion,
  type LengthUnit,
  type UsUkBandMethod,
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

interface BraSizeFormProps {
  input: BraInput;
  errors: BraFieldErrors;
  onChange: (next: BraInput) => void;
}

export function BraSizeForm({ input, errors, onChange }: BraSizeFormProps) {
  const set = (patch: Partial<BraInput>) => onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const patch: Partial<BraInput> = { unit: next };
    for (const key of ['underbust', 'bust'] as const) {
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

  const showPlus4 = input.region === 'US' || input.region === 'UK';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate band and cup from underbust and bust. Sizing systems and brands
        differ — treat results as a starting point. Measurements stay in your
        browser.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...createEmptyInput(),
              underbust: '75',
              bust: '90',
              unit: 'cm',
              region: 'US',
            })
          }
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (75 / 90 cm · US)
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="bra-unit">
            Measurement unit
          </label>
          <select
            id="bra-unit"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.unit}
            onChange={(e) => switchUnit(e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="bra-region">
            Bra sizing region
          </label>
          <select
            id="bra-region"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.region}
            onChange={(e) =>
              set({ region: e.target.value as BraSizingRegion })
            }
          >
            {(Object.keys(REGION_LABELS) as BraSizingRegion[]).map((r) => (
              <option key={r} value={r}>
                {REGION_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showPlus4 ? (
        <div>
          <label className={labelClass} htmlFor="bra-method">
            US/UK band method
            <InfoTooltip content="Modern uses nearest-even underbust. Traditional +4 adds four inches before rounding — results can differ." />
          </label>
          <select
            id="bra-method"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.bandMethod}
            onChange={(e) =>
              set({ bandMethod: e.target.value as UsUkBandMethod })
            }
          >
            {(Object.keys(METHOD_LABELS) as UsUkBandMethod[]).map((m) => (
              <option key={m} value={m}>
                {METHOD_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="bra-under">
          Underbust circumference
          <InfoTooltip content="Measure snugly around your rib cage directly beneath your bust, keeping the measuring tape level." />
        </label>
        <FieldShell error={errors.underbust}>
          <input
            id="bra-under"
            className={inputClass}
            inputMode="decimal"
            value={input.underbust}
            onChange={(e) => set({ underbust: e.target.value })}
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            {LENGTH_UNIT_LABELS[input.unit]}
          </span>
        </FieldShell>
        {errors.underbust ? (
          <p className="mt-1 text-xs text-rose-600">{errors.underbust}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bra-bust">
          Bust circumference
          <InfoTooltip content="Measure around the fullest part of your bust while keeping the tape level and avoiding unnecessary compression." />
        </label>
        <FieldShell error={errors.bust}>
          <input
            id="bra-bust"
            className={inputClass}
            inputMode="decimal"
            value={input.bust}
            onChange={(e) => set({ bust: e.target.value })}
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            {LENGTH_UNIT_LABELS[input.unit]}
          </span>
        </FieldShell>
        {errors.bust ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bust}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showMeasureHelp}
          onClick={() => set({ showMeasureHelp: !input.showMeasureHelp })}
        >
          Measurement guidance
          <span className="text-xs font-normal text-muted-foreground">
            {input.showMeasureHelp ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showMeasureHelp ? (
          <div className="mt-3 space-y-3">
            <BraMeasureDiagram />
            <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
              <li>Stand upright; breathe normally.</li>
              <li>Underbust: snug tape directly under the bust.</li>
              <li>Bust: fullest point, tape level, no heavy compression.</li>
              <li>Record both in the same unit, then enter above.</li>
            </ol>
          </div>
        ) : null}
      </div>
    </form>
  );
}
