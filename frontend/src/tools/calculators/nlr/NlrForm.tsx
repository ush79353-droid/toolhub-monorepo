'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { NlrCountMode, NlrFieldErrors, NlrInput, NlrResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

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
  input: NlrInput;
  errors: NlrFieldErrors;
  result: NlrResult | null;
  onChange: (input: NlrInput) => void;
}

export function NlrForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<NlrInput>) => onChange({ ...input, ...patch });
  const isAbsolute = input.mode === 'absolute';

  const changeMode = (mode: NlrCountMode) => {
    set({
      mode,
      neutrophilText: '',
      lymphocyteText: '',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="NLR inputs">
        <div>
          <label className={labelClass} htmlFor="nlr-mode">
            Absolute or % neutrophil count
            <InfoTooltip text="Choose absolute counts (×10³/µL) or differential percentages from the same CBC. NLR is neutrophils ÷ lymphocytes on the same basis." />
          </label>
          <select
            id="nlr-mode"
            className={selectClass}
            value={input.mode}
            onChange={(e) => changeMode(e.target.value as NlrCountMode)}
          >
            <option value="absolute">Absolute</option>
            <option value="percent">%</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="nlr-neutrophil">
            {isAbsolute
              ? 'Absolute neutrophil count (ANC)'
              : 'Neutrophil percentage'}
            <InfoTooltip
              text={
                isAbsolute
                  ? 'Absolute neutrophil count from the CBC, in thousands per microliter (×10³/µL).'
                  : 'Neutrophil differential percentage from the same CBC (0–100%). WBC is not required when both percentages come from the same differential.'
              }
            />
          </label>
          <FieldShell error={errors.neutrophilText}>
            <input
              id="nlr-neutrophil"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.neutrophilText}
              onChange={(e) => set({ neutrophilText: e.target.value })}
              aria-invalid={Boolean(errors.neutrophilText)}
            />
            <span className={unitFixed} aria-hidden>
              {isAbsolute ? '×10³/µL' : '%'}
            </span>
          </FieldShell>
          {errors.neutrophilText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.neutrophilText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="nlr-lymphocyte">
            {isAbsolute
              ? 'Absolute lymphocyte count (ALC)'
              : 'Lymphocyte percentage'}
            <InfoTooltip
              text={
                isAbsolute
                  ? 'Absolute lymphocyte count from the same CBC, in ×10³/µL.'
                  : 'Lymphocyte differential percentage from the same CBC (0–100%).'
              }
            />
          </label>
          <FieldShell error={errors.lymphocyteText}>
            <input
              id="nlr-lymphocyte"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lymphocyteText}
              onChange={(e) => set({ lymphocyteText: e.target.value })}
              aria-invalid={Boolean(errors.lymphocyteText)}
            />
            <span className={unitFixed} aria-hidden>
              {isAbsolute ? '×10³/µL' : '%'}
            </span>
          </FieldShell>
          {errors.lymphocyteText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lymphocyteText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="NLR result">
        <div>
          <label className={labelClass} htmlFor="nlr-result">
            Neutrophil lymphocyte ratio (NLR)
            <InfoTooltip text="Dimensionless ratio: neutrophils ÷ lymphocytes using absolute counts or matching differential percentages." />
          </label>
          <FieldShell muted>
            <input
              id="nlr-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedNlr ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          {result?.disclaimer ??
            'Educational CBC ratio only — not a diagnosis, prognosis, or treatment decision.'}
        </p>
      </section>
    </form>
  );
}
