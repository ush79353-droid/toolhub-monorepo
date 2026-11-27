'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  albuminFromGDl,
  calciumFromMgDl,
  formatAlbumin,
  formatCalcium,
  parseNumber,
} from './calculation';
import type {
  AlbuminUnit,
  CalciumUnit,
  CorrectedCalciumFieldErrors,
  CorrectedCalciumInput,
  CorrectedCalciumResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const CALCIUM_UNITS: { value: CalciumUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
];

const ALBUMIN_UNITS: { value: AlbuminUnit; label: string }[] = [
  { value: 'g_dl', label: 'g/dL' },
  { value: 'g_l', label: 'g/L' },
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
  input: CorrectedCalciumInput;
  errors: CorrectedCalciumFieldErrors;
  result: CorrectedCalciumResult | null;
  onChange: (input: CorrectedCalciumInput) => void;
}

export function CorrectedCalciumForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<CorrectedCalciumInput>) =>
    onChange({ ...input, ...patch });

  const switchCalciumUnit = (next: CalciumUnit) => {
    if (next === input.calciumUnit) return;
    const n = parseNumber(input.calciumText);
    if (n == null) {
      set({ calciumUnit: next });
      return;
    }
    const mgDl =
      input.calciumUnit === 'mg_dl' ? n : n * 4; /* mmol/L → mg/dL */
    const converted = calciumFromMgDl(mgDl, next);
    set({
      calciumUnit: next,
      calciumText:
        converted == null ? '' : formatCalcium(converted, next),
    });
  };

  const switchAlbuminUnit = (next: AlbuminUnit) => {
    if (next === input.albuminUnit) return;
    const n = parseNumber(input.albuminText);
    if (n == null) {
      set({ albuminUnit: next });
      return;
    }
    const gDl = input.albuminUnit === 'g_dl' ? n : n / 10;
    const converted = albuminFromGDl(gDl, next);
    set({
      albuminUnit: next,
      albuminText: formatAlbumin(converted, next),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Corrected calcium inputs">
        <div>
          <label className={labelClass} htmlFor="cca-calcium">
            Serum calcium
            <InfoTooltip text="Total serum calcium. Payne correction uses mg/dL; mmol/L is converted ×4 before math." />
          </label>
          <FieldShell error={errors.calciumText}>
            <input
              id="cca-calcium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.calciumText}
              onChange={(e) => set({ calciumText: e.target.value })}
              aria-invalid={Boolean(errors.calciumText)}
            />
            <select
              className={unitSelectClass}
              value={input.calciumUnit}
              onChange={(e) =>
                switchCalciumUnit(e.target.value as CalciumUnit)
              }
              aria-label="Serum calcium unit"
            >
              {CALCIUM_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.calciumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.calciumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cca-albumin">
            Albumin
            <InfoTooltip text="Serum albumin. Normal reference for this formula is 4.0 g/dL (40 g/L)." />
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="cca-albumin"
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
                switchAlbuminUnit(e.target.value as AlbuminUnit)
              }
              aria-label="Albumin unit"
            >
              {ALBUMIN_UNITS.map((opt) => (
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
          <label className={labelClass} htmlFor="cca-result">
            Corrected calcium
            <InfoTooltip text="Estimated albumin-adjusted total calcium — not ionized calcium." />
          </label>
          <FieldShell muted>
            <input
              id="cca-result"
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
                set({ resultUnit: e.target.value as CalciumUnit })
              }
              aria-label="Corrected calcium unit"
            >
              {CALCIUM_UNITS.map((opt) => (
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
