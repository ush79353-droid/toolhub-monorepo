'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatFena } from './calculation';
import type { FenaFieldErrors, FenaInput, FenaResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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
  input: FenaInput;
  errors: FenaFieldErrors;
  result: FenaResult | null;
  onChange: (input: FenaInput) => void;
}

export function FenaForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<FenaInput>) => onChange({ ...input, ...patch });
  const fenaDisplay =
    result?.fenaPercent != null ? formatFena(result.fenaPercent) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="FENa lab inputs">
        <div>
          <label className={labelClass} htmlFor="fena-scr">
            Creatinine (Serum)
            <InfoTooltip text="Serum creatinine in mg/dL. Match the urine creatinine unit." />
          </label>
          <FieldShell error={errors.serumCreatinineText}>
            <input
              id="fena-scr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumCreatinineText}
              onChange={(e) => set({ serumCreatinineText: e.target.value })}
              aria-invalid={Boolean(errors.serumCreatinineText)}
            />
            <span className={unitFixed}>mg/dL</span>
          </FieldShell>
          {errors.serumCreatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumCreatinineText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fena-sna">
            Sodium (Serum)
            <InfoTooltip text="Serum sodium in mmol/L (same as mEq/L)." />
          </label>
          <FieldShell error={errors.serumSodiumText}>
            <input
              id="fena-sna"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumSodiumText}
              onChange={(e) => set({ serumSodiumText: e.target.value })}
              aria-invalid={Boolean(errors.serumSodiumText)}
            />
            <span className={unitFixed}>mmol/L</span>
          </FieldShell>
          {errors.serumSodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.serumSodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fena-ucr">
            Urine creatinine
            <InfoTooltip text="Urine creatinine in mg/dL. Must be &gt; 0." />
          </label>
          <FieldShell error={errors.urineCreatinineText}>
            <input
              id="fena-ucr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineCreatinineText}
              onChange={(e) => set({ urineCreatinineText: e.target.value })}
              aria-invalid={Boolean(errors.urineCreatinineText)}
            />
            <span className={unitFixed}>mg/dL</span>
          </FieldShell>
          {errors.urineCreatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.urineCreatinineText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fena-una">
            Urine sodium
            <InfoTooltip text="Urine sodium in mmol/L (same as mEq/L)." />
          </label>
          <FieldShell error={errors.urineSodiumText}>
            <input
              id="fena-una"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineSodiumText}
              onChange={(e) => set({ urineSodiumText: e.target.value })}
              aria-invalid={Boolean(errors.urineSodiumText)}
            />
            <span className={unitFixed}>mmol/L</span>
          </FieldShell>
          {errors.urineSodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.urineSodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fena-result">
            FENa
            <InfoTooltip text="Fractional excretion of sodium as a percentage." />
          </label>
          <FieldShell muted>
            <input
              id="fena-result"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={fenaDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
        </div>

        {result?.fenaPercent != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.bandLabel ? (
              <span className="font-semibold text-accent">
                Band {result.bandLabel}.{' '}
              </span>
            ) : null}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
