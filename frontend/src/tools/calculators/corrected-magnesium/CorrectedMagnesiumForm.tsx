'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  albuminFromGL,
  formatAlbumin,
  formatMagnesium,
  magnesiumFromMmolL,
  magnesiumToMmolL,
  parseNumber,
} from './calculation';
import type {
  AlbuminUnit,
  CorrectedMagnesiumFieldErrors,
  CorrectedMagnesiumInput,
  CorrectedMagnesiumResult,
  MagnesiumUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const MG_UNITS: { value: MagnesiumUnit; label: string }[] = [
  { value: 'meq_l', label: 'mEq/L' },
  { value: 'mmol_l', label: 'mmol/L' },
  { value: 'mg_dl', label: 'mg/dL' },
];

const ALB_UNITS: { value: AlbuminUnit; label: string }[] = [
  { value: 'g_l', label: 'g/L' },
  { value: 'g_dl', label: 'g/dL' },
];

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
  input: CorrectedMagnesiumInput;
  errors: CorrectedMagnesiumFieldErrors;
  result: CorrectedMagnesiumResult | null;
  onChange: (input: CorrectedMagnesiumInput) => void;
}

export function CorrectedMagnesiumForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<CorrectedMagnesiumInput>) =>
    onChange({ ...input, ...patch });

  const switchMgUnit = (next: MagnesiumUnit) => {
    if (next === input.magnesiumUnit) return;
    const n = parseNumber(input.magnesiumText);
    if (n == null) {
      set({ magnesiumUnit: next });
      return;
    }
    const mmol = magnesiumToMmolL(n, input.magnesiumUnit);
    set({
      magnesiumUnit: next,
      magnesiumText: formatMagnesium(magnesiumFromMmolL(mmol, next), next),
    });
  };

  const switchAlbUnit = (next: AlbuminUnit) => {
    if (next === input.albuminUnit) return;
    const n = parseNumber(input.albuminText);
    if (n == null) {
      set({ albuminUnit: next });
      return;
    }
    const gL = input.albuminUnit === 'g_l' ? n : n * 10;
    set({
      albuminUnit: next,
      albuminText: formatAlbumin(albuminFromGL(gL, next), next),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Corrected magnesium inputs"
      >
        <div>
          <label className={labelClass} htmlFor="cmg-magnesium">
            Patient&apos;s magnesium
            <InfoTooltip text="Serum magnesium. Correction math uses mmol/L; mEq/L uses divalent ×2; mg/dL uses ≈2.4305×mmol/L." />
          </label>
          <FieldShell error={errors.magnesiumText}>
            <input
              id="cmg-magnesium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.magnesiumText}
              onChange={(e) => set({ magnesiumText: e.target.value })}
              aria-invalid={Boolean(errors.magnesiumText)}
            />
            <select
              className={unitSelectClass}
              value={input.magnesiumUnit}
              onChange={(e) =>
                switchMgUnit(e.target.value as MagnesiumUnit)
              }
              aria-label="Magnesium unit"
            >
              {MG_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.magnesiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.magnesiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cmg-albumin">
            Patient&apos;s albumin
            <InfoTooltip text="Serum albumin. Reference for this formula is 40 g/L (4.0 g/dL)." />
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="cmg-albumin"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.albuminText}
              onChange={(e) => set({ albuminText: e.target.value })}
              aria-invalid={Boolean(errors.albuminText)}
            />
            <select
              className={unitSelectClass}
              value={input.albuminUnit}
              onChange={(e) =>
                switchAlbUnit(e.target.value as AlbuminUnit)
              }
              aria-label="Albumin unit"
            >
              {ALB_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.albuminText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.albuminText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cmg-result">
            Corrected magnesium
            <InfoTooltip text="Albumin-adjusted magnesium (Kroll & Elin) — educational estimate." />
          </label>
          <FieldShell muted>
            <input
              id="cmg-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedCorrected ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as MagnesiumUnit })
              }
              aria-label="Corrected magnesium unit"
            >
              {MG_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}
