'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DENOMINATOR_NOTE, formatMl } from './calculation';
import {
  AGE_SEX_CATEGORY_OPTIONS,
  type AllowableBloodLossFieldErrors,
  type AllowableBloodLossInput,
  type AllowableBloodLossResult,
  type AgeSexCategory,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';
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
  input: AllowableBloodLossInput;
  errors: AllowableBloodLossFieldErrors;
  result: AllowableBloodLossResult | null;
  onChange: (input: AllowableBloodLossInput) => void;
}

export function AllowableBloodLossForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AllowableBloodLossInput>) =>
    onChange({ ...input, ...patch });

  const mablDisplay =
    result?.allowableBloodLossMl != null
      ? formatMl(result.allowableBloodLossMl)
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
        aria-label="Allowable blood loss inputs"
      >
        <div>
          <label className={labelClass} htmlFor="abl-category">
            Age/sex category
            <InfoTooltip text="Selects the estimated blood volume constant (mL/kg) used in the Gross formula." />
          </label>
          <FieldShell>
            <select
              id="abl-category"
              className={selectClass}
              value={input.ageSexCategory}
              onChange={(e) =>
                set({ ageSexCategory: e.target.value as AgeSexCategory })
              }
            >
              {AGE_SEX_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="abl-weight">
            Weight
            <InfoTooltip text="Patient body weight used to estimate blood volume." />
          </label>
          <FieldShell error={errors.weightKgText}>
            <input
              id="abl-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightKgText}
              onChange={(e) => set({ weightKgText: e.target.value })}
              aria-invalid={Boolean(errors.weightKgText)}
            />
            <span className={unitFixed}>kg</span>
          </FieldShell>
          {errors.weightKgText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightKgText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="abl-initial-hb">
            Initial hemoglobin of the patient
            <InfoTooltip text="Preoperative or baseline hemoglobin concentration." />
          </label>
          <FieldShell error={errors.initialHemoglobinGPerDlText}>
            <input
              id="abl-initial-hb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialHemoglobinGPerDlText}
              onChange={(e) =>
                set({ initialHemoglobinGPerDlText: e.target.value })
              }
              aria-invalid={Boolean(errors.initialHemoglobinGPerDlText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.initialHemoglobinGPerDlText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.initialHemoglobinGPerDlText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="abl-low-hb">
            Lowest acceptable hemoglobin
            <InfoTooltip text="Clinician threshold for the target hemoglobin nadir; default display 10 g/dL is not a universal trigger." />
          </label>
          <FieldShell error={errors.lowestAcceptableHemoglobinGPerDlText}>
            <input
              id="abl-low-hb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lowestAcceptableHemoglobinGPerDlText}
              onChange={(e) =>
                set({ lowestAcceptableHemoglobinGPerDlText: e.target.value })
              }
              aria-invalid={Boolean(errors.lowestAcceptableHemoglobinGPerDlText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.lowestAcceptableHemoglobinGPerDlText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lowestAcceptableHemoglobinGPerDlText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="abl-result">
            Allowable blood loss
            <InfoTooltip text="Gross maximum allowable blood loss in milliliters from estimated blood volume and hemoglobin change." />
          </label>
          <FieldShell muted>
            <input
              id="abl-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={mablDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {result?.denominatorNote ?? DENOMINATOR_NOTE}
          </p>
          {result?.statusDetail && result.allowableBloodLossMl != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
          {result?.statusDetail &&
          result.allowableBloodLossMl == null &&
          result.statusHeadline.includes('Lowest') ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}