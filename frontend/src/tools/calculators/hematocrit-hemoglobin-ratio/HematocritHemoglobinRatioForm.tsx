'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HematocritHemoglobinRatioFieldErrors,
  HematocritHemoglobinRatioInput,
  HematocritHemoglobinRatioResult,
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
  input: HematocritHemoglobinRatioInput;
  errors: HematocritHemoglobinRatioFieldErrors;
  result: HematocritHemoglobinRatioResult | null;
  onChange: (input: HematocritHemoglobinRatioInput) => void;
}

export function HematocritHemoglobinRatioForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<HematocritHemoglobinRatioInput>) =>
    onChange({ ...input, ...patch });

  const ratioDisplay = result?.formattedRatio ?? '3';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Hct to Hgb ratio inputs">
        <div>
          <label className={labelClass} htmlFor="hct-hgb-hct">
            Hematocrit (Hct)
            <InfoTooltip text="Hematocrit as a percentage of blood volume occupied by red cells (CBC)." />
          </label>
          <FieldShell error={errors.hematocritPercentText}>
            <input
              id="hct-hgb-hct"
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
          <label className={labelClass} htmlFor="hct-hgb-hgb">
            Hemoglobin (Hgb)
            <InfoTooltip text="Hemoglobin concentration in grams per deciliter (g/dL)." />
          </label>
          <FieldShell error={errors.hemoglobinGdlText}>
            <input
              id="hct-hgb-hgb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hemoglobinGdlText}
              onChange={(e) => set({ hemoglobinGdlText: e.target.value })}
              aria-invalid={Boolean(errors.hemoglobinGdlText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.hemoglobinGdlText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.hemoglobinGdlText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hct-hgb-ratio">
            Hct/Hgb ratio
            <InfoTooltip text="Hematocrit ÷ hemoglobin. Shows the approximate teaching factor of 3 until both values are entered." />
          </label>
          <FieldShell muted>
            <input
              id="hct-hgb-ratio"
              type="text"
              readOnly
              className={inputClass}
              value={ratioDisplay}
              aria-readonly="true"
            />
          </FieldShell>
          {result?.isApproximateRuleOfThree ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Approximate rule-of-three factor (not a measured ratio).
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
