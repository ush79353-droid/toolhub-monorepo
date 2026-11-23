'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatCutoff, LITER_MULTIPLIER } from './calculation';
import type {
  AgeAdjustedDDimerFieldErrors,
  AgeAdjustedDDimerInput,
  AgeAdjustedDDimerResult,
  DdimerAssayUnit,
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
  input: AgeAdjustedDDimerInput;
  errors: AgeAdjustedDDimerFieldErrors;
  result: AgeAdjustedDDimerResult | null;
  onChange: (input: AgeAdjustedDDimerInput) => void;
}

export function AgeAdjustedDDimerForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AgeAdjustedDDimerInput>) =>
    onChange({ ...input, ...patch });

  const setUnit = (unit: DdimerAssayUnit) => set({ assayUnit: unit });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Age-adjusted D-dimer inputs">
        <div>
          <label className={labelClass} htmlFor="ddimer-age">
            Age
            <InfoTooltip text="Patient age in whole or decimal years for the age-adjusted cutoff when older than 50." />
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="ddimer-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className={unitFixed}>years</span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>D-dimer unit type</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ddimer-unit"
                checked={input.assayUnit === 'FEU'}
                onChange={() => setUnit('FEU')}
                className="h-4 w-4 border-border text-primary"
              />
              FEU
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ddimer-unit"
                checked={input.assayUnit === 'DDU'}
                onChange={() => setUnit('DDU')}
                className="h-4 w-4 border-border text-primary"
              />
              DDU
            </label>
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="ddimer-mult">
            Unit type multiplier
            <InfoTooltip text={`µg/L per µg/mL conversion factor (${LITER_MULTIPLIER}).`} />
          </label>
          <FieldShell muted>
            <input
              id="ddimer-mult"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={String(result?.literMultiplier ?? LITER_MULTIPLIER)}
            />
            <span className={unitFixed}>µg/L</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ddimer-cutoff-ml">
            D-dimer cutoff value
            <InfoTooltip text="Age-adjusted threshold in µg/mL (µg/L ÷ 1,000)." />
          </label>
          <FieldShell muted>
            <input
              id="ddimer-cutoff-ml"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.cutoffMicrogPerMilliliter != null
                  ? formatCutoff(result.cutoffMicrogPerMilliliter)
                  : ''
              }
              aria-live="polite"
            />
            <span className={unitFixed}>µg/mL</span>
          </FieldShell>
        </div>

        {result?.cutoffMicrogPerLiter != null ? (
          <p className="text-xs text-muted-foreground">
            {formatCutoff(result.cutoffMicrogPerLiter)} µg/L ({input.assayUnit})
          </p>
        ) : null}
        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}