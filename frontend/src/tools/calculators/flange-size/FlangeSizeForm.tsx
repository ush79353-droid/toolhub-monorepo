'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  diameterToMm,
  mmToDiameterUnit,
} from './calculation';
import { FlangeFitExamples, NippleMeasureDiagram } from './FlangeFitDiagrams';
import type {
  DiameterUnit,
  FlangeSizeFieldErrors,
  FlangeSizeInput,
  FlangeSizeResult,
} from './types';
import { DIAMETER_UNIT_LABELS } from './types';

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

function formatField(value: number, unit: DiameterUnit): string {
  const digits = unit === 'in' ? 4 : 2;
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: FlangeSizeInput;
  errors: FlangeSizeFieldErrors;
  result: FlangeSizeResult | null;
  onChange: (input: FlangeSizeInput) => void;
  onLoadExample: () => void;
}

export function FlangeSizeForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const switchUnit = (next: DiameterUnit) => {
    if (next === input.diameterUnit) return;
    const raw = parseLoose(input.diameterValue);
    let nextValue = input.diameterValue;
    if (raw != null) {
      const mm = diameterToMm(raw, input.diameterUnit);
      if (mm != null) {
        nextValue = formatField(mmToDiameterUnit(mm, next), next);
      }
    }
    onChange({ ...input, diameterUnit: next, diameterValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Spectra Baby USA flange-size table lookup from nipple base
        diameter (excluding areola). Not a universal “add N mm” rule and not a
        Medela Room-to-Move calculator. Confirm fit while pumping.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (18 mm → Spectra 24 mm flange)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="flange-diameter">
          <span>Nipple diameter</span>
          <InfoTooltip
            label="Nipple diameter"
            text="Measure across the nipple base in millimeters (or inches). Do not include the areola."
          />
        </label>
        <FieldShell error={errors.diameterValue}>
          <input
            id="flange-diameter"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Nipple diameter"
            value={input.diameterValue}
            aria-invalid={Boolean(errors.diameterValue)}
            onChange={(e) =>
              onChange({ ...input, diameterValue: e.target.value })
            }
          />
          <select
            className={selectClass}
            aria-label="Diameter unit"
            value={input.diameterUnit}
            onChange={(e) => switchUnit(e.target.value as DiameterUnit)}
          >
            {(Object.keys(DIAMETER_UNIT_LABELS) as DiameterUnit[]).map((u) => (
              <option key={u} value={u}>
                {DIAMETER_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.diameterValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.diameterValue}</p>
        ) : null}
      </div>

      {result ? (
        <div
          className="rounded-xl border border-border bg-white p-4"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Suggested Spectra flange
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
            {result.formattedSuggestion}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {result.explanation}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : null}

      <FlangeFitExamples />
      <NippleMeasureDiagram />
    </form>
  );
}
