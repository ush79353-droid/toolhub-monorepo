'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MELATONIN_INDICATIONS,
  MELATONIN_MEDICATION_TYPES,
  type DurationUnit,
  type MelatoninDosageFieldErrors,
  type MelatoninDosageInput,
  type MelatoninIndicationId,
  type MelatoninMedicationTypeId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 cursor-pointer bg-transparent px-3 text-sm font-semibold text-accent outline-none';
const textInputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm font-semibold text-accent outline-none';

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

interface MelatoninDosageFormProps {
  input: MelatoninDosageInput;
  errors: MelatoninDosageFieldErrors;
  onChange: (input: MelatoninDosageInput) => void;
}

export function MelatoninDosageForm({
  input,
  errors,
  onChange,
}: MelatoninDosageFormProps) {
  const set = (patch: Partial<MelatoninDosageInput>) =>
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
          US melatonin supplements have no single FDA Drug Facts dose table in
          this tool. EMA Circadin 2 mg prolonged-release SmPC is shown only when
          that product type is selected. Blank therapy duration stays blank —
          no dose or course length is invented from the defaults.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="melatonin-indication">
          <span>Indication</span>
          <InfoTooltip
            label="Indication"
            text="Circadin’s SmPC covers short-term primary insomnia (poor sleep quality) in adults ≥55. Other rows stay educational / out-of-scope — this tool will not invent off-label milligram schedules."
          />
        </label>
        <FieldShell error={errors.indication}>
          <select
            id="melatonin-indication"
            className={inputClass}
            value={input.indication}
            aria-invalid={Boolean(errors.indication)}
            onChange={(e) =>
              set({ indication: e.target.value as MelatoninIndicationId })
            }
          >
            {MELATONIN_INDICATIONS.map((opt) => (
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
        <label className={labelClass} htmlFor="melatonin-medication-type">
          <span>Medication type</span>
          <InfoTooltip
            label="Medication type"
            text="Tablets/capsules, liquid, spray, and strips follow dietary-supplement labeling (read YOUR product). Prolonged-release 2 mg uses the Circadin EMA SmPC summary."
          />
        </label>
        <FieldShell error={errors.medicationType}>
          <select
            id="melatonin-medication-type"
            className={inputClass}
            value={input.medicationType}
            aria-invalid={Boolean(errors.medicationType)}
            onChange={(e) =>
              set({
                medicationType: e.target.value as MelatoninMedicationTypeId,
              })
            }
          >
            {MELATONIN_MEDICATION_TYPES.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.medicationType ? (
          <p className="mt-1 text-xs text-rose-600">{errors.medicationType}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="melatonin-duration">
          <span>Therapy duration</span>
          <InfoTooltip
            label="Therapy duration"
            text="Optional. Leave blank to avoid inventing a course length. Circadin SmPC allows up to 13 weeks for the labeled regimen. Supplement forms do not get invented milligram totals from duration alone."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.durationText}>
            <input
              id="melatonin-duration"
              type="text"
              inputMode="decimal"
              className={textInputClass}
              value={input.durationText}
              placeholder=""
              aria-invalid={Boolean(errors.durationText)}
              onChange={(e) => set({ durationText: e.target.value })}
            />
          </FieldShell>
          <div className="relative flex h-11 w-[7.5rem] shrink-0 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <select
              id="melatonin-duration-unit"
              className={inputClass}
              value={input.durationUnit}
              aria-label="Therapy duration unit"
              onChange={(e) =>
                set({ durationUnit: e.target.value as DurationUnit })
              }
            >
              <option value="days">days</option>
              <option value="weeks">weeks</option>
            </select>
          </div>
        </div>
        {errors.durationText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationText}</p>
        ) : null}
      </div>
    </form>
  );
}
