'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  LENGTH_UNIT_LABELS,
  MODE_LABELS,
  VOLUME_UNIT_LABELS,
  type CompressionFieldErrors,
  type CompressionMode,
  type CompressionRatioInput,
  type LengthUnit,
  type VolumeUnit,
  createExampleFourCylinder,
  createExampleKnownVolumes,
  createExampleSingleCylinder,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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

function LengthField({
  id,
  label,
  tooltip,
  value,
  unit,
  error,
  onValue,
  onUnit,
}: {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  unit: LengthUnit;
  error?: string;
  onValue: (v: string) => void;
  onUnit: (u: LengthUnit) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValue(e.target.value)}
          />
        </FieldShell>
        <select
          className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
          value={unit}
          aria-label={`${label} unit`}
          onChange={(e) => onUnit(e.target.value as LengthUnit)}
        >
          {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
            <option key={u} value={u}>
              {LENGTH_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function VolumeField({
  id,
  label,
  tooltip,
  value,
  unit,
  error,
  onValue,
  onUnit,
}: {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  unit: VolumeUnit;
  error?: string;
  onValue: (v: string) => void;
  onUnit: (u: VolumeUnit) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValue(e.target.value)}
          />
        </FieldShell>
        <select
          className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
          value={unit}
          aria-label={`${label} unit`}
          onChange={(e) => onUnit(e.target.value as VolumeUnit)}
        >
          {(Object.keys(VOLUME_UNIT_LABELS) as VolumeUnit[]).map((u) => (
            <option key={u} value={u}>
              {VOLUME_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface CompressionRatioFormProps {
  input: CompressionRatioInput;
  errors: CompressionFieldErrors;
  onChange: (next: CompressionRatioInput) => void;
}

export function CompressionRatioForm({
  input,
  errors,
  onChange,
}: CompressionRatioFormProps) {
  const set = (patch: Partial<CompressionRatioInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Geometric compression ratio CR = (Vs + Vc) / Vc. Dynamic CR uses
        crank-slider geometry after intake valve closing (ABDC) — an idealized
        estimate, not measured cylinder pressure.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createExampleSingleCylinder())}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Example: 1-cyl
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleFourCylinder())}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Example: 4-cyl 86×86
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleKnownVolumes())}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Example: 10:1 volumes
        </button>
      </div>

      <div>
        <label htmlFor="cr-mode" className={labelClass}>
          Calculation mode
        </label>
        <FieldShell>
          <select
            id="cr-mode"
            className={`${inputClass} appearance-none`}
            value={input.mode}
            onChange={(e) =>
              set({ mode: e.target.value as CompressionMode })
            }
          >
            {(Object.keys(MODE_LABELS) as CompressionMode[]).map((m) => (
              <option key={m} value={m}>
                {MODE_LABELS[m]}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      {input.mode === 'engineGeometry' ? (
        <section className={sectionClass} aria-labelledby="cr-engine">
          <h3 id="cr-engine" className="text-sm font-semibold text-accent">
            Engine Characteristics
          </h3>

          <div>
            <label htmlFor="cr-cyl" className={labelClass}>
              Number of cylinders
            </label>
            <FieldShell error={errors.cylinders}>
              <input
                id="cr-cyl"
                className={inputClass}
                inputMode="numeric"
                value={input.cylinders}
                onChange={(e) => set({ cylinders: e.target.value })}
              />
            </FieldShell>
            {errors.cylinders ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cylinders}</p>
            ) : null}
          </div>

          <LengthField
            id="cr-bore"
            label="Bore diameter (D)"
            tooltip="Internal diameter of the cylinder."
            value={input.bore}
            unit={input.boreUnit}
            error={errors.bore}
            onValue={(v) => set({ bore: v })}
            onUnit={(u) => set({ boreUnit: u })}
          />
          <LengthField
            id="cr-stroke"
            label="Piston stroke (L)"
            tooltip="Distance the piston travels between TDC and BDC."
            value={input.stroke}
            unit={input.strokeUnit}
            error={errors.stroke}
            onValue={(v) => set({ stroke: v })}
            onUnit={(u) => set({ strokeUnit: u })}
          />
          <LengthField
            id="cr-gthick"
            label="Head gasket thickness"
            tooltip="Compressed thickness of the cylinder head gasket."
            value={input.gasketThickness}
            unit={input.gasketThicknessUnit}
            error={errors.gasketThickness}
            onValue={(v) => set({ gasketThickness: v })}
            onUnit={(u) => set({ gasketThicknessUnit: u })}
          />

          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={input.useBoreForGasket}
              onChange={(e) => set({ useBoreForGasket: e.target.checked })}
            />
            Use cylinder bore as gasket bore (approximation)
          </label>

          {!input.useBoreForGasket ? (
            <LengthField
              id="cr-gbore"
              label="Gasket bore diameter"
              tooltip="Effective bore of the head gasket opening."
              value={input.gasketBore}
              unit={input.gasketBoreUnit}
              error={errors.gasketBore}
              onValue={(v) => set({ gasketBore: v })}
              onUnit={(u) => set({ gasketBoreUnit: u })}
            />
          ) : null}

          <LengthField
            id="cr-deck"
            label="Deck clearance (d)"
            tooltip="Positive: piston below deck at TDC. Zero: flush. Negative: piston above deck. Total clearance volume must stay positive."
            value={input.deckClearance}
            unit={input.deckClearanceUnit}
            error={errors.deckClearance}
            onValue={(v) => set({ deckClearance: v })}
            onUnit={(u) => set({ deckClearanceUnit: u })}
          />
          <VolumeField
            id="cr-chamber"
            label="Combustion chamber volume"
            tooltip="Volume in the cylinder head combustion chamber."
            value={input.chamberVolume}
            unit={input.chamberVolumeUnit}
            error={errors.chamberVolume}
            onValue={(v) => set({ chamberVolume: v })}
            onUnit={(u) => set({ chamberVolumeUnit: u })}
          />
          <VolumeField
            id="cr-piston"
            label="Piston volume"
            tooltip="Positive: dish/relief adds clearance. Negative: dome reduces clearance. Zero: flat-top."
            value={input.pistonVolume}
            unit={input.pistonVolumeUnit}
            error={errors.pistonVolume}
            onValue={(v) => set({ pistonVolume: v })}
            onUnit={(u) => set({ pistonVolumeUnit: u })}
          />
        </section>
      ) : null}

      {input.mode === 'knownVolumes' || input.mode === 'clearanceFromRatio' ? (
        <section className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">Compression Ratio</h3>
          <VolumeField
            id="cr-disp"
            label="Displacement volume (Vs)"
            tooltip="Swept volume per cylinder (or the volume used with Vc)."
            value={input.displacementVolume}
            unit={input.displacementVolumeUnit}
            error={errors.displacementVolume}
            onValue={(v) => set({ displacementVolume: v })}
            onUnit={(u) => set({ displacementVolumeUnit: u })}
          />
          {input.mode === 'knownVolumes' ? (
            <VolumeField
              id="cr-comp"
              label="Compressed volume (Vc)"
              tooltip="Clearance volume at TDC."
              value={input.compressedVolume}
              unit={input.compressedVolumeUnit}
              error={errors.compressedVolume}
              onValue={(v) => set({ compressedVolume: v })}
              onUnit={(u) => set({ compressedVolumeUnit: u })}
            />
          ) : (
            <div>
              <label htmlFor="cr-target" className={labelClass}>
                Target compression ratio
                <InfoTooltip
                  label="Target CR"
                  text="Must be greater than 1. Vc = Vs / (CR − 1)."
                />
              </label>
              <FieldShell error={errors.targetCR}>
                <input
                  id="cr-target"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.targetCR}
                  onChange={(e) => set({ targetCR: e.target.value })}
                />
              </FieldShell>
              {errors.targetCR ? (
                <p className="mt-1 text-xs text-rose-600">{errors.targetCR}</p>
              ) : null}
            </div>
          )}
        </section>
      ) : null}

      {input.mode === 'engineGeometry' ? (
        <section className={sectionClass} aria-labelledby="cr-dyn">
          <div className="flex items-center justify-between gap-2">
            <h3 id="cr-dyn" className="text-sm font-semibold text-accent">
              Dynamic Compression Ratio
            </h3>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="h-3.5 w-3.5"
                checked={input.enableDynamic}
                onChange={(e) => set({ enableDynamic: e.target.checked })}
              />
              Enable
            </label>
          </div>
          {input.enableDynamic ? (
            <>
              <LengthField
                id="cr-rod"
                label="Connecting rod length"
                tooltip="Center-to-center rod length. Must exceed crank radius (stroke/2)."
                value={input.rodLength}
                unit={input.rodLengthUnit}
                error={errors.rodLength}
                onValue={(v) => set({ rodLength: v })}
                onUnit={(u) => set({ rodLengthUnit: u })}
              />
              <div>
                <label htmlFor="cr-ivc" className={labelClass}>
                  Intake valve closing (° ABDC)
                  <InfoTooltip
                    label="IVC ABDC"
                    text="Crank degrees after bottom dead center when the intake valve closes. Supported range 0–179° ABDC."
                  />
                </label>
                <FieldShell error={errors.ivcAbdc}>
                  <input
                    id="cr-ivc"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.ivcAbdc}
                    onChange={(e) => set({ ivcAbdc: e.target.value })}
                  />
                </FieldShell>
                {errors.ivcAbdc ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.ivcAbdc}</p>
                ) : null}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
