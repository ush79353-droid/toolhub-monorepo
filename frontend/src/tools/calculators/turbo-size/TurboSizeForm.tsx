'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertCapacity,
  convertPower,
  convertPressure,
  convertTemperature,
} from './calculation';
import {
  CAPACITY_UNIT_LABELS,
  POWER_UNIT_LABELS,
  PRESSURE_UNIT_LABELS,
  TEMP_UNIT_LABELS,
  TURBO_EXAMPLES,
  createEmptyInput,
  type CapacityUnit,
  type PowerUnit,
  type PressureUnit,
  type TemperatureUnit,
  type TurboSizeFieldErrors,
  type TurboSizeInput,
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

interface TurboSizeFormProps {
  input: TurboSizeInput;
  errors: TurboSizeFieldErrors;
  onChange: (next: TurboSizeInput) => void;
}

export function TurboSizeForm({
  input,
  errors,
  onChange,
}: TurboSizeFormProps) {
  const set = (patch: Partial<TurboSizeInput>) =>
    onChange({ ...input, ...patch });

  const applyExample = (capacityL: number, powerHp: number) => {
    onChange({
      ...createEmptyInput(),
      engineCapacity: String(capacityL),
      engineCapacityUnit: 'L',
      desiredPower: String(powerHp),
      desiredPowerUnit: 'hp',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate theoretical compressor airflow from target power using a
        documented heuristic (default 10 hp per lb/min). This does not pick an
        exact turbo model — compare maps with advanced operating-point estimates.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (2.0 L · 400 hp)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <div>
          <label htmlFor="tu-cap" className={labelClass}>
            Engine capacity
            <InfoTooltip
              label="Displacement"
              text="Enter displacement to compute power density (hp/L). Airflow heuristic uses power primarily."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.engineCapacity}>
              <input
                id="tu-cap"
                className={inputClass}
                inputMode="decimal"
                value={input.engineCapacity}
                onChange={(e) => set({ engineCapacity: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
              value={input.engineCapacityUnit}
              aria-label="Capacity unit"
              onChange={(e) => {
                const next = e.target.value as CapacityUnit;
                const n = Number(input.engineCapacity.replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  set({
                    engineCapacityUnit: next,
                    engineCapacity: String(
                      Number(
                        convertCapacity(
                          n,
                          input.engineCapacityUnit,
                          next,
                        ).toPrecision(12),
                      ),
                    ),
                  });
                } else set({ engineCapacityUnit: next });
              }}
            >
              {(Object.keys(CAPACITY_UNIT_LABELS) as CapacityUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {CAPACITY_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.engineCapacity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.engineCapacity}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tu-pow" className={labelClass}>
            Desired power
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.desiredPower}>
              <input
                id="tu-pow"
                className={inputClass}
                inputMode="decimal"
                value={input.desiredPower}
                onChange={(e) => set({ desiredPower: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
              value={input.desiredPowerUnit}
              aria-label="Power unit"
              onChange={(e) => {
                const next = e.target.value as PowerUnit;
                const n = Number(input.desiredPower.replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  set({
                    desiredPowerUnit: next,
                    desiredPower: String(
                      Number(
                        convertPower(
                          n,
                          input.desiredPowerUnit,
                          next,
                        ).toPrecision(12),
                      ),
                    ),
                  });
                } else set({ desiredPowerUnit: next });
              }}
            >
              {(Object.keys(POWER_UNIT_LABELS) as PowerUnit[]).map((u) => (
                <option key={u} value={u}>
                  {POWER_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.desiredPower ? (
            <p className="mt-1 text-xs text-rose-600">{errors.desiredPower}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tu-c" className={labelClass}>
            Airflow heuristic (hp per lb/min)
            <InfoTooltip
              label="Sizing factor"
              text="Editable assumption. Default 10 is a rough rule of thumb, not a universal law."
            />
          </label>
          <FieldShell error={errors.horsepowerPerLbMin}>
            <input
              id="tu-c"
              className={inputClass}
              inputMode="decimal"
              value={input.horsepowerPerLbMin}
              onChange={(e) => set({ horsepowerPerLbMin: e.target.value })}
            />
          </FieldShell>
          {errors.horsepowerPerLbMin ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.horsepowerPerLbMin}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Check our examples
        </h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Illustrative airflow sizing only — not turbo model recommendations.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TURBO_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => applyExample(ex.capacityL, ex.powerHp)}
              className="rounded-md border border-border bg-muted/20 px-2.5 py-1.5 text-left text-xs text-accent hover:bg-muted/40"
            >
              <span className="font-medium">{ex.label}</span>
              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                {ex.note}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
          onClick={() => set({ advancedMode: !input.advancedMode })}
          aria-expanded={input.advancedMode}
        >
          Advanced turbo sizing
          <span className="text-muted-foreground">
            {input.advancedMode ? '−' : '+'}
          </span>
        </button>
        {input.advancedMode ? (
          <div className="mt-3 space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Independent engine-airflow estimate using RPM, VE, absolute
              pressures, and temperatures. Defaults are editable illustrations.
            </p>
            <div>
              <label htmlFor="tu-rpm" className={labelClass}>
                Engine RPM
              </label>
              <FieldShell error={errors.engineRPM}>
                <input
                  id="tu-rpm"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.engineRPM}
                  onChange={(e) => set({ engineRPM: e.target.value })}
                />
              </FieldShell>
              {errors.engineRPM ? (
                <p className="mt-1 text-xs text-rose-600">{errors.engineRPM}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-ve" className={labelClass}>
                Volumetric efficiency (%)
              </label>
              <FieldShell error={errors.volumetricEfficiency}>
                <input
                  id="tu-ve"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.volumetricEfficiency}
                  onChange={(e) =>
                    set({ volumetricEfficiency: e.target.value })
                  }
                />
              </FieldShell>
              {errors.volumetricEfficiency ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.volumetricEfficiency}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-pman" className={labelClass}>
                Intake manifold absolute pressure
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.intakeManifoldPressure}>
                  <input
                    id="tu-pman"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.intakeManifoldPressure}
                    onChange={(e) =>
                      set({ intakeManifoldPressure: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.intakePressureUnit}
                  aria-label="Manifold pressure unit"
                  onChange={(e) => {
                    const next = e.target.value as PressureUnit;
                    const n = Number(
                      input.intakeManifoldPressure.replace(/,/g, ''),
                    );
                    if (Number.isFinite(n) && n > 0) {
                      set({
                        intakePressureUnit: next,
                        intakeManifoldPressure: String(
                          Number(
                            convertPressure(
                              n,
                              input.intakePressureUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ intakePressureUnit: next });
                  }}
                >
                  {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {PRESSURE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.intakeManifoldPressure ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.intakeManifoldPressure}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-pin" className={labelClass}>
                Compressor inlet absolute pressure
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.compressorInletPressure}>
                  <input
                    id="tu-pin"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.compressorInletPressure}
                    onChange={(e) =>
                      set({ compressorInletPressure: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.inletPressureUnit}
                  aria-label="Inlet pressure unit"
                  onChange={(e) => {
                    const next = e.target.value as PressureUnit;
                    const n = Number(
                      input.compressorInletPressure.replace(/,/g, ''),
                    );
                    if (Number.isFinite(n) && n > 0) {
                      set({
                        inletPressureUnit: next,
                        compressorInletPressure: String(
                          Number(
                            convertPressure(
                              n,
                              input.inletPressureUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ inletPressureUnit: next });
                  }}
                >
                  {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {PRESSURE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.compressorInletPressure ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.compressorInletPressure}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-tman" className={labelClass}>
                Intake manifold temperature
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.intakeTemperature}>
                  <input
                    id="tu-tman"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.intakeTemperature}
                    onChange={(e) =>
                      set({ intakeTemperature: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className="h-11 w-[70px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.intakeTempUnit}
                  aria-label="Intake temp unit"
                  onChange={(e) => {
                    const next = e.target.value as TemperatureUnit;
                    const n = Number(input.intakeTemperature.replace(/,/g, ''));
                    if (Number.isFinite(n)) {
                      set({
                        intakeTempUnit: next,
                        intakeTemperature: String(
                          Number(
                            convertTemperature(
                              n,
                              input.intakeTempUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ intakeTempUnit: next });
                  }}
                >
                  {(Object.keys(TEMP_UNIT_LABELS) as TemperatureUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {TEMP_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.intakeTemperature ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.intakeTemperature}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-tin" className={labelClass}>
                Compressor inlet temperature
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.compressorInletTemperature}>
                  <input
                    id="tu-tin"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.compressorInletTemperature}
                    onChange={(e) =>
                      set({ compressorInletTemperature: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className="h-11 w-[70px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.inletTempUnit}
                  aria-label="Inlet temp unit"
                  onChange={(e) => {
                    const next = e.target.value as TemperatureUnit;
                    const n = Number(
                      input.compressorInletTemperature.replace(/,/g, ''),
                    );
                    if (Number.isFinite(n)) {
                      set({
                        inletTempUnit: next,
                        compressorInletTemperature: String(
                          Number(
                            convertTemperature(
                              n,
                              input.inletTempUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ inletTempUnit: next });
                  }}
                >
                  {(Object.keys(TEMP_UNIT_LABELS) as TemperatureUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {TEMP_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.compressorInletTemperature ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.compressorInletTemperature}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tu-eta" className={labelClass}>
                Compressor efficiency (%)
              </label>
              <FieldShell error={errors.compressorEfficiency}>
                <input
                  id="tu-eta"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compressorEfficiency}
                  onChange={(e) =>
                    set({ compressorEfficiency: e.target.value })
                  }
                />
              </FieldShell>
              {errors.compressorEfficiency ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.compressorEfficiency}
                </p>
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
