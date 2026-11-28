'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHexagonMeasurement,
  convertLengthFromCm,
  convertLengthToCm,
  sideToMeasurement,
} from './calculation';
import {
  FABRIC_WIDTH_PRESETS_IN,
  FABRIC_WIDTH_UNITS,
  HEX_UNITS,
  MEASUREMENT_LABELS,
  QUILT_UNITS,
  SEAM_UNITS,
  UNIT_LABELS,
  createEmptyInput,
  type HexagonMeasurementType,
  type HexagonQuiltFieldErrors,
  type HexagonQuiltInput,
  type LengthUnit,
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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface HexagonQuiltFormProps {
  input: HexagonQuiltInput;
  errors: HexagonQuiltFieldErrors;
  onChange: (next: HexagonQuiltInput) => void;
}

export function HexagonQuiltForm({
  input,
  errors,
  onChange,
}: HexagonQuiltFormProps) {
  const set = (patch: Partial<HexagonQuiltInput>) =>
    onChange({ ...input, ...patch });

  const switchQuiltUnit = (next: LengthUnit) => {
    if (next === input.quiltUnit) return;
    const patch: Partial<HexagonQuiltInput> = { quiltUnit: next };
    for (const key of ['quiltWidth', 'quiltLength'] as const) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        const cm = convertLengthToCm(n, input.quiltUnit);
        patch[key] = String(Number(convertLengthFromCm(cm, next).toFixed(2)));
      }
    }
    set(patch);
  };

  const switchHexUnit = (next: LengthUnit) => {
    if (next === input.hexagonUnit) return;
    const raw = input.hexagonSize.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<HexagonQuiltInput> = { hexagonUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertLengthToCm(n, input.hexagonUnit);
      patch.hexagonSize = String(
        Number(convertLengthFromCm(cm, next).toFixed(3)),
      );
    }
    set(patch);
  };

  const switchMeasurement = (next: HexagonMeasurementType) => {
    if (next === input.measurementType) return;
    const raw = input.hexagonSize.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<HexagonQuiltInput> = { measurementType: next };
    if (raw !== '' && Number.isFinite(n)) {
      const valueCm = convertLengthToCm(n, input.hexagonUnit);
      const sideCm = convertHexagonMeasurement(valueCm, input.measurementType);
      const nextCm = sideToMeasurement(sideCm, next);
      patch.hexagonSize = String(
        Number(convertLengthFromCm(nextCm, input.hexagonUnit).toFixed(3)),
      );
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Plan a flat-top hexagon quilt: columns, rows, full and half hexagons,
        and actual top size.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (150×200 · s=5 cm)
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="hq-width" className={labelClass}>
            Width of quilt
            <InfoTooltip content="Desired finished quilt-top width before optional borders." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.quiltWidth}>
              <input
                id="hq-width"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.quiltWidth}
                onChange={(e) => set({ quiltWidth: e.target.value })}
              />
            </FieldShell>
            <select
              aria-label="Quilt width unit"
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.quiltUnit}
              onChange={(e) => switchQuiltUnit(e.target.value as LengthUnit)}
            >
              {QUILT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.quiltWidth ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.quiltWidth}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="hq-length" className={labelClass}>
            Length of quilt
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.quiltLength}>
              <input
                id="hq-length"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.quiltLength}
                onChange={(e) => set({ quiltLength: e.target.value })}
              />
            </FieldShell>
            <select
              aria-label="Quilt length unit"
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.quiltUnit}
              onChange={(e) => switchQuiltUnit(e.target.value as LengthUnit)}
            >
              {QUILT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.quiltLength ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.quiltLength}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="hq-hex" className={labelClass}>
          Size of hexagon
          <InfoTooltip content="Finished measurement — seam allowance is applied separately for cutting." />
        </label>
        <p className="mb-1.5 text-[11px] text-muted-foreground">
          Enter the finished length of one side of your hexagon, excluding seam
          allowance (or switch measurement type below).
        </p>
        <div className="flex gap-2">
          <FieldShell error={errors.hexagonSize}>
            <input
              id="hq-hex"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hexagonSize}
              onChange={(e) => set({ hexagonSize: e.target.value })}
            />
          </FieldShell>
          <select
            aria-label="Hexagon unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.hexagonUnit}
            onChange={(e) => switchHexUnit(e.target.value as LengthUnit)}
          >
            {HEX_UNITS.map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.hexagonSize ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.hexagonSize}
          </p>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          {input.showAdvanced ? 'Hide' : 'Show'} advanced (measurement · seam ·
          fabric)
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/10 p-3">
            <div>
              <label htmlFor="hq-meas" className={labelClass}>
                Hexagon measurement type
              </label>
              <select
                id="hq-meas"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.measurementType}
                onChange={(e) =>
                  switchMeasurement(e.target.value as HexagonMeasurementType)
                }
              >
                {(
                  Object.keys(MEASUREMENT_LABELS) as HexagonMeasurementType[]
                ).map((m) => (
                  <option key={m} value={m}>
                    {MEASUREMENT_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="hq-seam" className={labelClass}>
                Seam allowance
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.seamAllowance}>
                  <input
                    id="hq-seam"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.seamAllowance}
                    onChange={(e) => set({ seamAllowance: e.target.value })}
                  />
                </FieldShell>
                <select
                  aria-label="Seam unit"
                  className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.seamUnit}
                  onChange={(e) =>
                    set({ seamUnit: e.target.value as LengthUnit })
                  }
                >
                  {SEAM_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  checked={input.showFabric}
                  onChange={(e) => set({ showFabric: e.target.checked })}
                />
                Estimate fabric yardage
              </label>
              {input.showFabric ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label htmlFor="hq-fw" className={labelClass}>
                      Fabric width
                    </label>
                    <div className="flex gap-2">
                      <FieldShell error={errors.fabricWidth}>
                        <input
                          id="hq-fw"
                          type="text"
                          inputMode="decimal"
                          className={inputClass}
                          value={input.fabricWidth}
                          onChange={(e) =>
                            set({ fabricWidth: e.target.value })
                          }
                        />
                      </FieldShell>
                      <select
                        aria-label="Fabric width unit"
                        className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
                        value={input.fabricWidthUnit}
                        onChange={(e) =>
                          set({
                            fabricWidthUnit: e.target.value as LengthUnit,
                          })
                        }
                      >
                        {FABRIC_WIDTH_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {UNIT_LABELS[u]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {FABRIC_WIDTH_PRESETS_IN.map((p) => (
                        <button
                          key={p}
                          type="button"
                          className="rounded border border-border px-1.5 py-0.5 text-[10px]"
                          onClick={() =>
                            set({
                              fabricWidth: String(p),
                              fabricWidthUnit: 'in',
                            })
                          }
                        >
                          {p}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hq-waste" className={labelClass}>
                      Extra / waste %
                    </label>
                    <FieldShell error={errors.wastePercent}>
                      <input
                        id="hq-waste"
                        type="text"
                        inputMode="decimal"
                        className={inputClass}
                        value={input.wastePercent}
                        onChange={(e) => set({ wastePercent: e.target.value })}
                      />
                    </FieldShell>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
