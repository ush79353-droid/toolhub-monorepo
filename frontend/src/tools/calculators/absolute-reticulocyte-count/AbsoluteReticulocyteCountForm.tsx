'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ASSUMPTION_NOTE,
  formatCellsPerUl,
  formatPercent,
} from './calculation';
import type {
  AbsoluteReticulocyteCountFieldErrors,
  AbsoluteReticulocyteCountInput,
  AbsoluteReticulocyteCountResult,
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
  input: AbsoluteReticulocyteCountInput;
  errors: AbsoluteReticulocyteCountFieldErrors;
  result: AbsoluteReticulocyteCountResult | null;
  onChange: (input: AbsoluteReticulocyteCountInput) => void;
}

export function AbsoluteReticulocyteCountForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AbsoluteReticulocyteCountInput>) =>
    onChange({ ...input, ...patch });

  const arcDisplay =
    result?.absoluteCountCellsPerMicroliter != null
      ? formatCellsPerUl(result.absoluteCountCellsPerMicroliter)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Absolute reticulocyte count inputs"
      >
        <div>
          <label className={labelClass} htmlFor="arc-hct">
            Hematocrit (Hct)
            <InfoTooltip text="Patient hematocrit from the CBC, expressed as a percentage of blood volume occupied by red cells." />
          </label>
          <FieldShell error={errors.hematocritPercentText}>
            <input
              id="arc-hct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hematocritPercentText}
              onChange={(e) => set({ hematocritPercentText: e.target.value })}
              aria-invalid={Boolean(errors.hematocritPercentText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.hematocritPercentText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.hematocritPercentText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arc-ref-hct">
            Normal hematocrit
            <InfoTooltip text="Reference (normal) hematocrit used to correct the reticulocyte percentage and estimate RBC from hematocrit ratio. Default 45%." />
          </label>
          <FieldShell error={errors.referenceHematocritPercentText}>
            <input
              id="arc-ref-hct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.referenceHematocritPercentText}
              onChange={(e) =>
                set({ referenceHematocritPercentText: e.target.value })
              }
              aria-invalid={Boolean(errors.referenceHematocritPercentText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.referenceHematocritPercentText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.referenceHematocritPercentText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arc-retic-pct">
            Reticulocytes
            <InfoTooltip text="Reticulocyte differential from the CBC, expressed as a percentage (0–100%)." />
          </label>
          <FieldShell error={errors.reticulocytePercentText}>
            <input
              id="arc-retic-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.reticulocytePercentText}
              onChange={(e) =>
                set({ reticulocytePercentText: e.target.value })
              }
              aria-invalid={Boolean(errors.reticulocytePercentText)}
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          {errors.reticulocytePercentText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.reticulocytePercentText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="arc-result">
            Absolute reticulocyte count
            <InfoTooltip text="Estimated count in cells per microliter, using hematocrit-based RBC estimation unless you supply a measured RBC elsewhere." />
          </label>
          <FieldShell muted>
            <input
              id="arc-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={arcDisplay}
              aria-live="polite"
              placeholder=""
            />
            <span className={unitFixed}>cells/µL</span>
          </FieldShell>
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {result?.assumptionNote ?? ASSUMPTION_NOTE}
          </p>
          {result?.correctedReticulocytePercent != null &&
          result.absoluteCountCellsPerMicroliter != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Corrected reticulocyte %:{' '}
              {formatPercent(result.correctedReticulocytePercent)}.{' '}
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}