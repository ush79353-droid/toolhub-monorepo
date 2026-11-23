'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cm2ToArea,
  cmToLength,
  cmToVti,
  lengthToCm,
  vtiToCm,
} from './calculation';
import type {
  AorticValveAreaFieldErrors,
  AorticValveAreaInput,
  AorticValveAreaResult,
  AreaUnit,
  LengthUnit,
  VtiUnit,
} from './types';
import {
  AREA_UNIT_LABELS,
  LENGTH_UNIT_LABELS,
  SEVERITY_TABLE_ROWS,
  VTI_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

interface Props {
  input: AorticValveAreaInput;
  errors: AorticValveAreaFieldErrors;
  result: AorticValveAreaResult | null;
  onChange: (input: AorticValveAreaInput) => void;
  onLoadExample: () => void;
}

export function AorticValveAreaForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<AorticValveAreaInput>) =>
    onChange({ ...input, ...patch });

  const switchLvotUnit = (next: LengthUnit) => {
    if (next === input.lvotUnit) return;
    const raw = parseLoose(input.lvotValue);
    let nextValue = input.lvotValue;
    if (raw != null) {
      const cm = lengthToCm(raw, input.lvotUnit);
      if (cm != null) {
        nextValue = formatField(cmToLength(cm, next), next === 'mm' ? 1 : 2);
      }
    }
    set({ lvotUnit: next, lvotValue: nextValue });
  };

  const switchVti1Unit = (next: VtiUnit) => {
    if (next === input.vti1Unit) return;
    const raw = parseLoose(input.vti1Value);
    let nextValue = input.vti1Value;
    if (raw != null) {
      const cm = vtiToCm(raw, input.vti1Unit);
      if (cm != null) {
        nextValue = formatField(cmToVti(cm, next), next === 'm' ? 4 : 2);
      }
    }
    set({ vti1Unit: next, vti1Value: nextValue });
  };

  const switchVti2Unit = (next: VtiUnit) => {
    if (next === input.vti2Unit) return;
    const raw = parseLoose(input.vti2Value);
    let nextValue = input.vti2Value;
    if (raw != null) {
      const cm = vtiToCm(raw, input.vti2Unit);
      if (cm != null) {
        nextValue = formatField(cmToVti(cm, next), next === 'm' ? 4 : 2);
      }
    }
    set({ vti2Unit: next, vti2Value: nextValue });
  };

  const switchAvaUnit = (next: AreaUnit) => {
    if (next === input.avaUnit) return;
    set({ avaUnit: next });
  };

  const avaDisplay =
    result != null
      ? formatField(
          cm2ToArea(result.avaCm2, input.avaUnit),
          input.avaUnit === 'mm2' ? 2 : 4
        )
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter LVOT diameter and both VTIs to estimate aortic valve area.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational continuity-equation AVA. VTI₁ is LVOT stroke distance; VTI₂
        is the transaortic jet. Entries stay in your browser only. Area alone
        cannot grade discordant Doppler studies.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (20 mm · 20 cm · 80 cm → ≈ 0.7854 cm²)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="ava-lvot">
          <span>LVOT</span>
          <InfoTooltip
            label="LVOT"
            text="Left ventricular outflow tract diameter, usually measured in the parasternal long-axis view. Converted to centimeters before the continuity equation."
          />
        </label>
        <FieldShell error={errors.lvotValue}>
          <input
            id="ava-lvot"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="LVOT diameter"
            value={input.lvotValue}
            aria-invalid={Boolean(errors.lvotValue)}
            onChange={(e) => set({ lvotValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="LVOT unit"
            value={input.lvotUnit}
            onChange={(e) => switchLvotUnit(e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.lvotValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lvotValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ava-vti1">
          <span>
            V<sub>T1</sub>
          </span>
          <InfoTooltip
            label="VTI1"
            text="Velocity-time integral in the LVOT (stroke distance proximal to the valve). Used as the numerator flow proxy in the continuity equation."
          />
        </label>
        <FieldShell error={errors.vti1Value}>
          <input
            id="ava-vti1"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="VTI1 LVOT stroke distance"
            value={input.vti1Value}
            aria-invalid={Boolean(errors.vti1Value)}
            onChange={(e) => set({ vti1Value: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="VTI1 unit"
            value={input.vti1Unit}
            onChange={(e) => switchVti1Unit(e.target.value as VtiUnit)}
          >
            {(Object.keys(VTI_UNIT_LABELS) as VtiUnit[]).map((u) => (
              <option key={u} value={u}>
                {VTI_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.vti1Value ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vti1Value}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ava-vti2">
          <span>
            V<sub>T2</sub>
          </span>
          <InfoTooltip
            label="VTI2"
            text="Velocity-time integral of the transaortic jet (across the aortic valve). Must be positive; zero would make AVA undefined."
          />
        </label>
        <FieldShell error={errors.vti2Value}>
          <input
            id="ava-vti2"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="VTI2 transaortic jet stroke distance"
            value={input.vti2Value}
            aria-invalid={Boolean(errors.vti2Value)}
            onChange={(e) => set({ vti2Value: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="VTI2 unit"
            value={input.vti2Unit}
            onChange={(e) => switchVti2Unit(e.target.value as VtiUnit)}
          >
            {(Object.keys(VTI_UNIT_LABELS) as VtiUnit[]).map((u) => (
              <option key={u} value={u}>
                {VTI_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.vti2Value ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vti2Value}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ava-result">
          <span>Aortic Valve Area (AVA)</span>
          <InfoTooltip
            label="AVA"
            text="Estimated effective orifice area from the continuity equation. Display unit can be cm² or mm²; the underlying value stays in cm²."
          />
        </label>
        <FieldShell>
          <input
            id="ava-result"
            className={`${inputClass} text-muted-foreground`}
            readOnly
            tabIndex={0}
            aria-label="Aortic valve area result"
            value={avaDisplay}
            placeholder=""
          />
          <select
            className={selectClass}
            aria-label="AVA unit"
            value={input.avaUnit}
            onChange={(e) => switchAvaUnit(e.target.value as AreaUnit)}
          >
            {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
              <option key={u} value={u}>
                {AREA_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Educational band: {result.severityLabel}. Not a diagnosis.
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-muted/30 px-3 py-2">
          <h3 className="text-[13px] font-semibold text-accent">
            Aortic Stenosis Severity
          </h3>
          <p className="text-[11px] text-muted-foreground">
            AVA (cm²) reference table — educational only
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/15 text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">AVA (cm²)</th>
              <th className="px-3 py-2 font-medium">Aortic Stenosis Severity</th>
            </tr>
          </thead>
          <tbody>
            {SEVERITY_TABLE_ROWS.map((row) => {
              const active = result?.severityBand === row.band;
              return (
                <tr
                  key={row.band}
                  className={`border-b border-border last:border-0 ${
                    active ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {row.range}
                  </td>
                  <td className="px-3 py-2 text-accent">{row.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="border-t border-border px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          Screenshot bands with resolved edges: &lt;1 severe; 1–1.5 moderate
          (1.5 inclusive); &gt;1.5–3 mild; &gt;3 labeled normal for education.
          ACC/AHA 2020 often cites severe as AVA ≤1.0 cm² and does not define
          “normal” as &gt;3 cm² alone. Velocity and mean gradient also matter.
        </p>
      </div>
    </form>
  );
}
