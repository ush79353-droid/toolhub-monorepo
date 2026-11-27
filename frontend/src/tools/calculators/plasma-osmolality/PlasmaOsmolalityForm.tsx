'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  bunFromMgDl,
  bunToMgDl,
  formatMeasure,
  glucoseFromMgDl,
  glucoseToMgDl,
  parseNumber,
} from './calculation';
import type {
  BunUnit,
  GlucoseUnit,
  OsmolalityUnit,
  PlasmaOsmolalityFieldErrors,
  PlasmaOsmolalityInput,
  PlasmaOsmolalityResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const GLUCOSE_UNITS: { value: GlucoseUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
];

const BUN_UNITS: { value: BunUnit; label: string }[] = [
  { value: 'mg_dl_bun', label: 'mg/dL' },
  { value: 'mmol_l_urea', label: 'mmol/L urea' },
  { value: 'mg_dl_urea', label: 'mg/dL urea' },
];

const RESULT_UNITS: { value: OsmolalityUnit; label: string }[] = [
  { value: 'mosm_kg', label: 'mOsm/kg H₂O' },
  { value: 'mosm_l', label: 'mOsm/L' },
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
  input: PlasmaOsmolalityInput;
  errors: PlasmaOsmolalityFieldErrors;
  result: PlasmaOsmolalityResult | null;
  onChange: (input: PlasmaOsmolalityInput) => void;
}

export function PlasmaOsmolalityForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<PlasmaOsmolalityInput>) =>
    onChange({ ...input, ...patch });

  const switchGlucoseUnit = (next: GlucoseUnit) => {
    if (next === input.glucoseUnit) return;
    const n = parseNumber(input.glucoseText);
    if (n == null) {
      set({ glucoseUnit: next });
      return;
    }
    const mgDl = glucoseToMgDl(n, input.glucoseUnit);
    set({
      glucoseUnit: next,
      glucoseText: formatMeasure(glucoseFromMgDl(mgDl, next), 4),
    });
  };

  const switchBunUnit = (next: BunUnit) => {
    if (next === input.bunUnit) return;
    const n = parseNumber(input.bunText);
    if (n == null) {
      set({ bunUnit: next });
      return;
    }
    const bunMgDl = bunToMgDl(n, input.bunUnit);
    set({
      bunUnit: next,
      bunText: formatMeasure(bunFromMgDl(bunMgDl, next), 4),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Plasma osmolality inputs">
        <div>
          <label className={labelClass} htmlFor="posm-sodium">
            Sodium
            <InfoTooltip text="Serum sodium in mEq/L (numerically equivalent to mmol/L for monovalent Na⁺)." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="posm-sodium"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sodiumText}
              onChange={(e) => set({ sodiumText: e.target.value })}
              aria-invalid={Boolean(errors.sodiumText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.sodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="posm-glucose">
            Glucose
            <InfoTooltip text="Plasma glucose. mmol/L converts with ÷18 before the Worthley-style term." />
          </label>
          <FieldShell error={errors.glucoseText}>
            <input
              id="posm-glucose"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.glucoseText}
              onChange={(e) => set({ glucoseText: e.target.value })}
              aria-invalid={Boolean(errors.glucoseText)}
            />
            <select
              className={unitSelectClass}
              value={input.glucoseUnit}
              onChange={(e) =>
                switchGlucoseUnit(e.target.value as GlucoseUnit)
              }
              aria-label="Glucose unit"
            >
              {GLUCOSE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.glucoseText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.glucoseText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="posm-bun">
            Blood urea nitrogen
            <InfoTooltip text="BUN nitrogen mg/dL, or whole urea (mmol/L or mg/dL) converted to BUN before ÷2.8." />
          </label>
          <FieldShell error={errors.bunText}>
            <input
              id="posm-bun"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bunText}
              onChange={(e) => set({ bunText: e.target.value })}
              aria-invalid={Boolean(errors.bunText)}
            />
            <select
              className={unitSelectClass}
              value={input.bunUnit}
              onChange={(e) => switchBunUnit(e.target.value as BunUnit)}
              aria-label="BUN / urea unit"
            >
              {BUN_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.bunText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bunText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="posm-result">
            Plasma osmolality
            <InfoTooltip text="Calculated 2×Na + glucose/18 + BUN/2.8 (mg/dL). Not measured osmolality or osmolar gap." />
          </label>
          <FieldShell muted>
            <input
              id="posm-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedOsmolality ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.resultUnit}
              onChange={(e) =>
                set({ resultUnit: e.target.value as OsmolalityUnit })
              }
              aria-label="Plasma osmolality unit"
            >
              {RESULT_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">
              {result.statusHeadline}
            </span>
            {result.statusDetail ? ` ${result.statusDetail}` : ''}
          </p>
        ) : null}
      </section>
    </form>
  );
}
