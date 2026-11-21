'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INDICATION_OPTIONS,
  type GabapentinDosageFieldErrors,
  type GabapentinDosageInput,
  type GabapentinIndicationId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface GabapentinDosageFormProps {
  input: GabapentinDosageInput;
  errors: GabapentinDosageFieldErrors;
  onChange: (input: GabapentinDosageInput) => void;
}

export function GabapentinDosageForm({
  input,
  errors,
  onChange,
}: GabapentinDosageFormProps) {
  const set = (patch: Partial<GabapentinDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset className="space-y-2">
        <legend className={labelClass}>
          Indication
          <InfoTooltip text="FDA-labeled NEURONTIN uses are epilepsy (partial-onset seizures, ages ≥3) and adult postherpetic neuralgia. RLS uses a different approved product (Horizant). Neuropathy and anxiety are not labeled indications here." />
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Indication">
          {INDICATION_OPTIONS.map((option) => {
            const checked = input.indication === option.id;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  checked
                    ? 'border-primary bg-primary/10 font-semibold text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="gabapentin-indication"
                  className="h-4 w-4 accent-primary"
                  checked={checked}
                  onChange={() =>
                    set({ indication: option.id as GabapentinIndicationId })
                  }
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors.indication ? (
          <p className="text-xs text-rose-600">{errors.indication}</p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="gabapentin-age" className={labelClass}>
          Age
          <InfoTooltip text="Age in whole years. Leave blank until ready — no dose is seeded from the screenshot. Pediatric epilepsy is mg/kg and needs clinician weight calculation." />
        </label>
        <FieldShell error={errors.ageYearsText}>
          <input
            id="gabapentin-age"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={input.ageYearsText}
            aria-invalid={Boolean(errors.ageYearsText)}
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYearsText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
        ) : null}
      </div>
    </form>
  );
}
