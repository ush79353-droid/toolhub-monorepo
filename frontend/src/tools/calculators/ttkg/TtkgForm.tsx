'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { URINE_SODIUM_APPLICABILITY_NOTE } from './content';
import type { TtkgFieldErrors, TtkgInput, TtkgResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: TtkgInput;
  errors: TtkgFieldErrors;
  result: TtkgResult | null;
  onChange: (input: TtkgInput) => void;
}

export function TtkgForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<TtkgInput>) => onChange({ ...input, ...patch });
  const ttkgDisplay = result?.formattedTtkg ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div
        className="rounded-lg border border-violet-200 bg-violet-50/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground"
        role="note"
      >
        {URINE_SODIUM_APPLICABILITY_NOTE}
      </div>

      <section className={sectionClass} aria-label="TTKG lab inputs">
        <div>
          <label className={labelClass} htmlFor="ttkg-serum-k">
            Serum potassium
            <InfoTooltip text="Serum (plasma) potassium in mmol/L (same as mEq/L)." />
          </label>
          <FieldShell error={errors.serumPotassiumText}>
            <input
              id="ttkg-serum-k"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumPotassiumText}
              onChange={(e) => set({ serumPotassiumText: e.target.value })}
              aria-invalid={Boolean(errors.serumPotassiumText)}
            />
            <span className={unitFixed}>mmol/L</span>
          </FieldShell>
          {errors.serumPotassiumText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumPotassiumText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ttkg-urine-k">
            Urine potassium
            <InfoTooltip text="Urine potassium in mmol/L (same as mEq/L)." />
          </label>
          <FieldShell error={errors.urinePotassiumText}>
            <input
              id="ttkg-urine-k"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urinePotassiumText}
              onChange={(e) => set({ urinePotassiumText: e.target.value })}
              aria-invalid={Boolean(errors.urinePotassiumText)}
            />
            <span className={unitFixed}>mmol/L</span>
          </FieldShell>
          {errors.urinePotassiumText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.urinePotassiumText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ttkg-serum-osm">
            Serum osmolality
            <InfoTooltip text="Serum osmolality in mOsm/kg H₂O." />
          </label>
          <FieldShell error={errors.serumOsmolalityText}>
            <input
              id="ttkg-serum-osm"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumOsmolalityText}
              onChange={(e) => set({ serumOsmolalityText: e.target.value })}
              aria-invalid={Boolean(errors.serumOsmolalityText)}
            />
            <span className={unitFixed}>mOsm/kg H₂O</span>
          </FieldShell>
          {errors.serumOsmolalityText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumOsmolalityText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ttkg-urine-osm">
            Urine osmolality
            <InfoTooltip text="Urine osmolality in mOsm/kg H₂O." />
          </label>
          <FieldShell error={errors.urineOsmolalityText}>
            <input
              id="ttkg-urine-osm"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineOsmolalityText}
              onChange={(e) => set({ urineOsmolalityText: e.target.value })}
              aria-invalid={Boolean(errors.urineOsmolalityText)}
            />
            <span className={unitFixed}>mOsm/kg H₂O</span>
          </FieldShell>
          {errors.urineOsmolalityText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.urineOsmolalityText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ttkg-result">
            Transtubular potassium gradient
            <InfoTooltip text="Dimensionless ratio (UK/PK) ÷ (UOsm/POsm)." />
          </label>
          <FieldShell muted>
            <input
              id="ttkg-result"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={ttkgDisplay}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result?.ttkg != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusHeadline}. {result.applicabilityNote}
          </p>
        ) : null}
      </section>
    </form>
  );
}