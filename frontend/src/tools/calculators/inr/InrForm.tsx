'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { InrFieldErrors, InrInput, InrResult } from './types';

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
  input: InrInput;
  errors: InrFieldErrors;
  result: InrResult | null;
  onChange: (input: InrInput) => void;
}

export function InrForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<InrInput>) => onChange({ ...input, ...patch });
  const inrDisplay = result?.formattedInr ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="INR calculator inputs">
        <div>
          <label className={labelClass} htmlFor="inr-patient-pt">
            Patient’s PT
            <InfoTooltip text="Patient prothrombin time in seconds from the same thromboplastin system as the ISI." />
          </label>
          <FieldShell error={errors.patientPtText}>
            <input
              id="inr-patient-pt"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.patientPtText}
              onChange={(e) => set({ patientPtText: e.target.value })}
              aria-invalid={Boolean(errors.patientPtText)}
            />
            <span className={unitFixed}>sec</span>
          </FieldShell>
          {errors.patientPtText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.patientPtText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inr-control-pt">
            Control PT
            <InfoTooltip text="Laboratory mean normal PT (MNPT) in seconds for the same thromboplastin and method." />
          </label>
          <FieldShell error={errors.controlPtText}>
            <input
              id="inr-control-pt"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.controlPtText}
              onChange={(e) => set({ controlPtText: e.target.value })}
              aria-invalid={Boolean(errors.controlPtText)}
            />
            <span className={unitFixed}>sec</span>
          </FieldShell>
          {errors.controlPtText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.controlPtText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inr-isi">
            ISI (International Sensitivity Index)
            <InfoTooltip text="Reagent- and method-specific ISI from the thromboplastin package insert or local calibration." />
          </label>
          <FieldShell error={errors.isiText}>
            <input
              id="inr-isi"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.isiText}
              onChange={(e) => set({ isiText: e.target.value })}
              aria-invalid={Boolean(errors.isiText)}
            />
          </FieldShell>
          {errors.isiText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.isiText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="inr-result">
            INR
            <InfoTooltip text="International Normalized Ratio = (patient PT ÷ mean normal PT) raised to the ISI." />
          </label>
          <FieldShell muted>
            <input
              id="inr-result"
              type="text"
              readOnly
              className={inputClass}
              value={inrDisplay}
              aria-readonly="true"
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </section>
    </form>
  );
}
