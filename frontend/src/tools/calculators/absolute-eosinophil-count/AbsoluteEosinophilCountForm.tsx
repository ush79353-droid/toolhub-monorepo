'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatAec, UNIT_EQUIVALENCE_NOTE } from './calculation';
import type {
  AbsoluteEosinophilCountFieldErrors,
  AbsoluteEosinophilCountInput,
  AbsoluteEosinophilCountResult,
} from './types';

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
  input: AbsoluteEosinophilCountInput;
  errors: AbsoluteEosinophilCountFieldErrors;
  result: AbsoluteEosinophilCountResult | null;
  onChange: (input: AbsoluteEosinophilCountInput) => void;
}

export function AbsoluteEosinophilCountForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AbsoluteEosinophilCountInput>) =>
    onChange({ ...input, ...patch });

  const aecDisplay =
    result?.absoluteCount != null ? formatAec(result.absoluteCount) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Absolute eosinophil count inputs"
      >
        <div>
          <label className={labelClass} htmlFor="aec-wbc">
            White blood cells (WBC)
            <InfoTooltip text="Total white blood cell count from the CBC, reported in thousands per microliter (×10³/µL)." />
          </label>
          <FieldShell error={errors.wbcText}>
            <input
              id="aec-wbc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.wbcText}
              onChange={(e) => set({ wbcText: e.target.value })}
              aria-invalid={Boolean(errors.wbcText)}
            />
            <span className={unitFixed} aria-hidden>
              ×10³/µL
            </span>
          </FieldShell>
          {errors.wbcText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.wbcText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="aec-eos-pct">
            Eosinophils
            <InfoTooltip text="Eosinophil differential from the CBC, expressed as a percentage of total white blood cells (0–100%)." />
          </label>
          <FieldShell error={errors.eosinophilPercentText}>
            <input
              id="aec-eos-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.eosinophilPercentText}
              onChange={(e) => set({ eosinophilPercentText: e.target.value })}
              aria-invalid={Boolean(errors.eosinophilPercentText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.eosinophilPercentText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.eosinophilPercentText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="aec-result">
            Absolute eosinophil count
            <InfoTooltip text="Derived count: WBC × (eosinophil % ÷ 100), in the same ×10³/µL reporting convention." />
          </label>
          <FieldShell muted>
            <input
              id="aec-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={aecDisplay}
              aria-live="polite"
              placeholder=""
            />
            <span className={unitFixed} aria-hidden>
              ×10³/µL
            </span>
          </FieldShell>
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {result?.unitEquivalenceNote ?? UNIT_EQUIVALENCE_NOTE}
          </p>
          {result?.statusDetail && result.absoluteCount != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}