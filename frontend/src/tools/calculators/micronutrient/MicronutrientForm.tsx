'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import {
  ELEMENT_OPTIONS,
  type AgeUnit,
  type ElementId,
  type MicronutrientFieldErrors,
  type MicronutrientInput,
  type MicronutrientSex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 font-mono text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: MicronutrientInput;
  errors: MicronutrientFieldErrors;
  onChange: (input: MicronutrientInput) => void;
}

export function MicronutrientForm({ input, errors, onChange }: Props) {
  const set = (patch: Partial<MicronutrientInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-label="Micronutrient profile">
        <div>
          <label className={labelClass} htmlFor="micro-age">
            Age
            <InfoTooltip
              label="age"
              text="Chronological age maps to National Academies DRI life-stage bands (infants in months, children and adults in years)."
            />
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="micro-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <select
              className={unitSelectClass}
              value={input.ageUnit}
              onChange={(e) => set({ ageUnit: e.target.value as AgeUnit })}
              aria-label="Age unit"
            >
              <option value="years">yrs</option>
              <option value="months">mo</option>
            </select>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>
            Sex
            <InfoTooltip
              label="sex"
              text="DRI element tables are published separately for males and females in many life stages."
            />
          </legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['male', 'female'] as const).map((sex) => (
              <label
                key={sex}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="micro-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex: sex as MicronutrientSex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="micro-element">
            Element
            <InfoTooltip
              label="element"
              text="Major and trace mineral elements with published National Academies DRI values (RDA, AI, or sodium CDRR)."
            />
          </label>
          <select
            id="micro-element"
            className={selectClass}
            value={input.elementId}
            onChange={(e) => set({ elementId: e.target.value as ElementId })}
          >
            {ELEMENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    </form>
  );
}
