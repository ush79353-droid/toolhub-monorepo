'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  bunFromMgDl,
  bunToMgDl,
  ethanolFromMgDl,
  ethanolToMgDl,
  formatMeasure,
  glucoseFromMgDl,
  glucoseToMgDl,
  parseNumber,
} from './calculation';
import type {
  BunUnit,
  EthanolUnit,
  GlucoseUnit,
  OsmolalityUnit,
  SerumOsmolalityFieldErrors,
  SerumOsmolalityInput,
  SerumOsmolalityResult,
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

const BUN_UNITS: { value: BunUnit; label: string }[] = [
  { value: 'mg_dl_bun', label: 'mg/dL' },
  { value: 'mmol_l_urea', label: 'mmol/L urea' },
  { value: 'mg_dl_urea', label: 'mg/dL urea' },
];

const GLUCOSE_UNITS: { value: GlucoseUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
];

const ETHANOL_UNITS: { value: EthanolUnit; label: string }[] = [
  { value: 'mmol_l', label: 'mmol/L' },
  { value: 'mg_dl', label: 'mg/dL' },
];

const OSM_UNITS: { value: OsmolalityUnit; label: string }[] = [
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
  input: SerumOsmolalityInput;
  errors: SerumOsmolalityFieldErrors;
  result: SerumOsmolalityResult | null;
  onChange: (input: SerumOsmolalityInput) => void;
}

export function SerumOsmolalityForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SerumOsmolalityInput>) =>
    onChange({ ...input, ...patch });

  const switchBun = (next: BunUnit) => {
    if (next === input.bunUnit) return;
    const n = parseNumber(input.bunText);
    if (n == null) {
      set({ bunUnit: next });
      return;
    }
    set({
      bunUnit: next,
      bunText: formatMeasure(bunFromMgDl(bunToMgDl(n, input.bunUnit), next), 4),
    });
  };

  const switchGlucose = (next: GlucoseUnit) => {
    if (next === input.glucoseUnit) return;
    const n = parseNumber(input.glucoseText);
    if (n == null) {
      set({ glucoseUnit: next });
      return;
    }
    set({
      glucoseUnit: next,
      glucoseText: formatMeasure(
        glucoseFromMgDl(glucoseToMgDl(n, input.glucoseUnit), next),
        4,
      ),
    });
  };

  const switchEthanol = (next: EthanolUnit) => {
    if (next === input.ethanolUnit) return;
    const n = parseNumber(input.ethanolText);
    if (n == null) {
      set({ ethanolUnit: next });
      return;
    }
    set({
      ethanolUnit: next,
      ethanolText: formatMeasure(
        ethanolFromMgDl(ethanolToMgDl(n, input.ethanolUnit), next),
        4,
      ),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Serum osmolality inputs">
        <div>
          <label className={labelClass} htmlFor="sosm-na">
            Na
            <InfoTooltip text="Serum sodium in mEq/L." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="sosm-na"
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
          <label className={labelClass} htmlFor="sosm-bun">
            Blood urea nitrogen
            <InfoTooltip text="BUN nitrogen mg/dL or whole urea units converted before ÷2.8." />
          </label>
          <FieldShell error={errors.bunText}>
            <input
              id="sosm-bun"
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
              onChange={(e) => switchBun(e.target.value as BunUnit)}
              aria-label="BUN unit"
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
          <label className={labelClass} htmlFor="sosm-glu">
            Glucose
            <InfoTooltip text="Plasma glucose; mmol/L × 18 → mg/dL." />
          </label>
          <FieldShell error={errors.glucoseText}>
            <input
              id="sosm-glu"
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
              onChange={(e) => switchGlucose(e.target.value as GlucoseUnit)}
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
          <label className={labelClass} htmlFor="sosm-etoh">
            Serum alcohol concentration
            <InfoTooltip text="Optional. mmol/L × 4.607 → mg/dL, then ÷3.7 in the improved equation." />
          </label>
          <FieldShell error={errors.ethanolText}>
            <input
              id="sosm-etoh"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ethanolText}
              onChange={(e) => set({ ethanolText: e.target.value })}
              aria-invalid={Boolean(errors.ethanolText)}
            />
            <select
              className={unitSelectClass}
              value={input.ethanolUnit}
              onChange={(e) => switchEthanol(e.target.value as EthanolUnit)}
              aria-label="Ethanol unit"
            >
              {ETHANOL_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.ethanolText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ethanolText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sosm-meas">
            Measured serum osmolality
            <InfoTooltip text="Optional osmometer value. Blank or 0 skips the osmotic gap." />
          </label>
          <FieldShell error={errors.measuredText}>
            <input
              id="sosm-meas"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.measuredText}
              onChange={(e) => set({ measuredText: e.target.value })}
              aria-invalid={Boolean(errors.measuredText)}
            />
            <select
              className={unitSelectClass}
              value={input.measuredUnit}
              onChange={(e) =>
                set({ measuredUnit: e.target.value as OsmolalityUnit })
              }
              aria-label="Measured osmolality unit"
            >
              {OSM_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.measuredText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.measuredText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="sosm-result">
            Serum osmolality
            <InfoTooltip text="Calculated improved formula including ethanol when entered." />
          </label>
          <FieldShell muted>
            <input
              id="sosm-result"
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
              aria-label="Calculated osmolality unit"
            >
              {OSM_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        {result?.osmoticGap != null ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">Osmotic gap:</span>{' '}
            {result.formattedGap} mOsm/kg H₂O
          </p>
        ) : null}

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
