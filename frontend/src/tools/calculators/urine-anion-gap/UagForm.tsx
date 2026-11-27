'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  UrineAnionGapFieldErrors,
  UrineAnionGapInput,
  UrineAnionGapResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
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
  input: UrineAnionGapInput;
  errors: UrineAnionGapFieldErrors;
  result: UrineAnionGapResult | null;
  onChange: (input: UrineAnionGapInput) => void;
}

export function UagForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<UrineAnionGapInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Urine anion gap inputs">
        <div>
          <label className={labelClass} htmlFor="uag-na">
            Na⁺
            <InfoTooltip text="Urinary sodium. mEq/L equals mmol/L for Na⁺." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="uag-na"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sodiumText}
              onChange={(e) => set({ sodiumText: e.target.value })}
              aria-invalid={Boolean(errors.sodiumText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.sodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uag-k">
            K⁺
            <InfoTooltip text="Urinary potassium. mEq/L equals mmol/L for K⁺." />
          </label>
          <FieldShell error={errors.potassiumText}>
            <input
              id="uag-k"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.potassiumText}
              onChange={(e) => set({ potassiumText: e.target.value })}
              aria-invalid={Boolean(errors.potassiumText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.potassiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.potassiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uag-cl">
            Cl⁻
            <InfoTooltip text="Urinary chloride. mEq/L equals mmol/L for Cl⁻." />
          </label>
          <FieldShell error={errors.chlorideText}>
            <input
              id="uag-cl"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.chlorideText}
              onChange={(e) => set({ chlorideText: e.target.value })}
              aria-invalid={Boolean(errors.chlorideText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.chlorideText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.chlorideText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="uag-result">
            Urine anion gap
            <InfoTooltip text="UAG = (Na⁺ + K⁺) − Cl⁻ using urine electrolytes only." />
          </label>
          <FieldShell muted>
            <input
              id="uag-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedGap ?? ''}
              aria-live="polite"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {result?.unitNote ??
            'In this case, the values in mEq/L are equal to those in mmol/L. If you have values in mmol/L, type them in.'}
        </p>
      </section>

      {result?.statusHeadline ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
          {result.statusDetail}
        </p>
      ) : null}
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        {result?.disclaimer ??
          'Educational urine electrolyte worksheet — not a diagnosis or serum anion-gap report.'}
      </p>
    </form>
  );
}
