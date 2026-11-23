'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CELLS_PER_MICROLITER_NOTE,
  formatAlc,
  UNIT_EQUIVALENCE_NOTE,
} from './calculation';
import type {
  AbsoluteLymphocyteCountFieldErrors,
  AbsoluteLymphocyteCountInput,
  AbsoluteLymphocyteCountResult,
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
  input: AbsoluteLymphocyteCountInput;
  errors: AbsoluteLymphocyteCountFieldErrors;
  result: AbsoluteLymphocyteCountResult | null;
  onChange: (input: AbsoluteLymphocyteCountInput) => void;
}

export function AbsoluteLymphocyteCountForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AbsoluteLymphocyteCountInput>) =>
    onChange({ ...input, ...patch });

  const alcDisplay =
    result?.absoluteCount != null ? formatAlc(result.absoluteCount) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Absolute lymphocyte count inputs"
      >
        <div>
          <label className={labelClass} htmlFor="alc-wbc">
            White blood cells (WBC)
            <InfoTooltip text="Total white blood cell count from the CBC, reported in thousands per microliter (×10³/µL)." />
          </label>
          <FieldShell error={errors.wbcText}>
            <input
              id="alc-wbc"
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
          <label className={labelClass} htmlFor="alc-lymph-pct">
            Lymphocytes
            <InfoTooltip text="Lymphocyte differential from the CBC, expressed as a percentage of total white blood cells (0–100%)." />
          </label>
          <FieldShell error={errors.lymphocytePercentText}>
            <input
              id="alc-lymph-pct"
              type="text"
              inputMode="decimal"
              className={`${inputClass} text-primary`}
              value={input.lymphocytePercentText}
              onChange={(e) => set({ lymphocytePercentText: e.target.value })}
              aria-invalid={Boolean(errors.lymphocytePercentText)}
            />
            <span className={`${unitFixed} text-primary`}>%</span>
          </FieldShell>
          {errors.lymphocytePercentText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lymphocytePercentText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="alc-result">
            Absolute lymphocyte count
            <InfoTooltip text="Derived count: WBC × (lymphocyte % ÷ 100), in the same ×10³/µL reporting convention." />
          </label>
          <FieldShell muted>
            <input
              id="alc-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={alcDisplay}
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
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {result?.cellsPerMicroliterNote ?? CELLS_PER_MICROLITER_NOTE}
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