'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ALEVE_DRUG_TYPES,
  ALEVE_INDICATIONS,
  type AleveDosageFieldErrors,
  type AleveDosageInput,
  type AleveDrugTypeId,
  type AleveIndicationId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 cursor-pointer bg-transparent px-3 text-sm font-semibold text-accent outline-none';

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

interface AleveDosageFormProps {
  input: AleveDosageInput;
  errors: AleveDosageFieldErrors;
  onChange: (input: AleveDosageInput) => void;
}

export function AleveDosageForm({
  input,
  errors,
  onChange,
}: AleveDosageFormProps) {
  const set = (patch: Partial<AleveDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational label lookup — not medical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          OTC Aleve follows FDA Drug Facts (naproxen sodium 220 mg). Prescription
          naproxen uses different milligram schedules and is not interchangeable
          with OTC products. Always read your package or dispensed label.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="aleve-indication">
          <span>Indication</span>
          <InfoTooltip
            label="Indication"
            text="OTC Aleve uses match Drug Facts (pain, fever, and listed aches). Prescription-only rows require a clinician-directed product — OTC Aleve is not substituted for those regimens."
          />
        </label>
        <FieldShell error={errors.indication}>
          <select
            id="aleve-indication"
            className={inputClass}
            value={input.indication}
            aria-invalid={Boolean(errors.indication)}
            onChange={(e) =>
              set({ indication: e.target.value as AleveIndicationId })
            }
          >
            {ALEVE_INDICATIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.indication ? (
          <p className="mt-1 text-xs text-rose-600">{errors.indication}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="aleve-drug-type">
          <span>Drug type</span>
          <InfoTooltip
            label="Drug type"
            text="Aleve OTC products are naproxen sodium 220 mg (≈ 200 mg naproxen base). Prescription strengths use separate labeled schedules. Unit counts are whole tablets/caplets/gels only."
          />
        </label>
        <FieldShell error={errors.drugType}>
          <select
            id="aleve-drug-type"
            className={inputClass}
            value={input.drugType}
            aria-invalid={Boolean(errors.drugType)}
            onChange={(e) =>
              set({ drugType: e.target.value as AleveDrugTypeId })
            }
          >
            {ALEVE_DRUG_TYPES.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.drugType ? (
          <p className="mt-1 text-xs text-rose-600">{errors.drugType}</p>
        ) : null}
      </div>
    </form>
  );
}
