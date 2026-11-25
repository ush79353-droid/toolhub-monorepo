'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { RsbiFieldErrors, RsbiInput, RsbiResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';

interface Props {
  input: RsbiInput;
  errors: RsbiFieldErrors;
  result: RsbiResult | null;
  onChange: (input: RsbiInput) => void;
  onLoadExample: () => void;
}

function parseOptional(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function RsbiForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<RsbiInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational RSBI = f ÷ VT(L). Enter tidal volume in mL; it is converted
        to liters before dividing. Not an extubation order.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (20 breaths/min · 400 mL → 50)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="rsbi-rr">
          <span>Respiratory rate</span>
          <InfoTooltip
            label="Respiratory rate"
            text="Breathing frequency in breaths per minute during the spontaneous breathing assessment used for RSBI."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.respiratoryRate ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="rsbi-rr"
            className={inputClass}
            inputMode="decimal"
            value={input.respiratoryRate ?? ''}
            onChange={(e) =>
              set({ respiratoryRate: parseOptional(e.target.value) })
            }
          />
          <span className={unitClass}>breaths/minute</span>
        </div>
        {errors.respiratoryRate ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.respiratoryRate}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rsbi-vt">
          <span>Tidal volume</span>
          <InfoTooltip
            label="Tidal volume"
            text="Tidal volume in milliliters. RSBI uses liters, so the worksheet divides by 1000 before f ÷ VT."
          />
        </label>
        <div
          className={`relative flex h-11 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
            errors.tidalVolumeMl ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="rsbi-vt"
            className={inputClass}
            inputMode="decimal"
            value={input.tidalVolumeMl ?? ''}
            onChange={(e) =>
              set({ tidalVolumeMl: parseOptional(e.target.value) })
            }
          />
          <span className={unitClass}>ml</span>
        </div>
        {errors.tidalVolumeMl ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.tidalVolumeMl}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>RSBI</span>
          <InfoTooltip
            label="RSBI"
            text="Rapid Shallow Breathing Index in breaths/min/L. Zero tidal volume is rejected."
          />
        </div>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-sky-50/80">
          <div
            className="flex h-11 min-w-0 flex-1 items-center px-3 text-sm font-semibold tabular-nums text-primary"
            aria-live="polite"
          >
            {result ? result.formattedRsbi : '—'}
          </div>
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
