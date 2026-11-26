'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AnionGapFieldErrors,
  AnionGapInput,
  AnionGapResult,
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
  input: AnionGapInput;
  errors: AnionGapFieldErrors;
  result: AnionGapResult | null;
  onChange: (input: AnionGapInput) => void;
}

export function AnionGapForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<AnionGapInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Anion gap inputs">
        <div>
          <label className={labelClass} htmlFor="ag-na">
            Na⁺
            <InfoTooltip text="Serum sodium. mEq/L equals mmol/L for Na⁺." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="ag-na"
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
          <label className={labelClass} htmlFor="ag-cl">
            Cl⁻
            <InfoTooltip text="Serum chloride. mEq/L equals mmol/L for Cl⁻." />
          </label>
          <FieldShell error={errors.chlorideText}>
            <input
              id="ag-cl"
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
          <label className={labelClass} htmlFor="ag-hco3">
            HCO₃⁻
            <InfoTooltip text="Serum bicarbonate (or total CO₂ as used locally)." />
          </label>
          <FieldShell error={errors.bicarbonateText}>
            <input
              id="ag-hco3"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bicarbonateText}
              onChange={(e) => set({ bicarbonateText: e.target.value })}
              aria-invalid={Boolean(errors.bicarbonateText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.bicarbonateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bicarbonateText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ag-result">
            Anion gap
            <InfoTooltip text="AG = Na − (Cl + HCO₃). Potassium is not included in this primary result." />
          </label>
          <FieldShell muted>
            <input
              id="ag-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedAnionGap ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs leading-relaxed text-accent">
          In this case, the values in mEq/L are equal to those in mmol/L. If your
          results are in mmol/L, type in these values.
        </p>
      </section>

      <section
        className={sectionClass}
        aria-label="Correction for albumin"
      >
        <p className="text-sm font-semibold text-accent">
          Correction for albumin
        </p>

        <div>
          <label className={labelClass} htmlFor="ag-k">
            K⁺
            <InfoTooltip text="Optional. Default 0. Included only in the corrected-panel AG_K path — never in the primary anion gap." />
          </label>
          <FieldShell error={errors.potassiumText}>
            <input
              id="ag-k"
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
          <label className={labelClass} htmlFor="ag-alb">
            Albumin
            <InfoTooltip text="Serum albumin in g/dL. Required for Figge correction: +2.5 × (4.0 − albumin)." />
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="ag-alb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.albuminText}
              onChange={(e) => set({ albuminText: e.target.value })}
              aria-invalid={Boolean(errors.albuminText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.albuminText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.albuminText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ag-corrected">
            Corrected anion gap
            <InfoTooltip text="AG_K + 2.5 × (4.0 − albumin). Blank until albumin is entered." />
          </label>
          <FieldShell muted>
            <input
              id="ag-corrected"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedCorrected ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
