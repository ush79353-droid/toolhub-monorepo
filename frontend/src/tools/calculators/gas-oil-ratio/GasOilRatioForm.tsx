'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertFuelVolume,
  fmt,
  fromMilliliters,
  generateGasOilMixingChart,
} from './calculation';
import {
  MODE_LABELS,
  RATIO_PRESETS,
  VOLUME_UNIT_LABELS,
  type FuelVolumeUnit,
  type GasOilFieldErrors,
  type GasOilInput,
  type GasOilMode,
  createEmptyInput,
  createExampleFiveLiters,
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

interface GasOilRatioFormProps {
  input: GasOilInput;
  errors: GasOilFieldErrors;
  onChange: (next: GasOilInput) => void;
}

export function GasOilRatioForm({
  input,
  errors,
  onChange,
}: GasOilRatioFormProps) {
  const set = (patch: Partial<GasOilInput>) =>
    onChange({ ...input, ...patch });

  const changeVolumeUnit = (
    field: 'gas' | 'oil' | 'total',
    next: FuelVolumeUnit,
  ) => {
    if (field === 'gas') {
      const n = Number(input.gasVolume.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          gasUnit: next,
          gasVolume: String(
            Number(convertFuelVolume(n, input.gasUnit, next).toPrecision(12)),
          ),
        });
        return;
      }
      set({ gasUnit: next });
      return;
    }
    if (field === 'oil') {
      const n = Number(input.oilVolume.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          oilUnit: next,
          oilVolume: String(
            Number(convertFuelVolume(n, input.oilUnit, next).toPrecision(12)),
          ),
        });
        return;
      }
      set({ oilUnit: next });
      return;
    }
    const n = Number(input.totalMixtureVolume.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      set({
        totalMixtureUnit: next,
        totalMixtureVolume: String(
          Number(
            convertFuelVolume(n, input.totalMixtureUnit, next).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ totalMixtureUnit: next });
  };

  const chartRows = generateGasOilMixingChart(input.chartSystem);
  const chartRatios = [25, 32, 40, 50];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Two-stroke premix is volume-to-volume. Always follow the engine
        manufacturer&apos;s recommended ratio and approved oil — this tool only
        does the math.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createExampleFiveLiters())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (5 L · 50:1 → 100 mL)
        </button>
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Reset defaults
        </button>
      </div>

      <div>
        <span className={labelClass}>
          Calculation mode
          <InfoTooltip
            label="Calculation mode"
            text="Calculate oil from gas + ratio; gas from oil + ratio; ratio from both volumes; or split a desired total premix volume into gas and oil."
          />
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(MODE_LABELS) as GasOilMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set({ mode: m })}
              className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                input.mode === m
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {input.mode !== 'calculateRatio' ? (
        <div>
          <label htmlFor="gor-ratio" className={labelClass}>
            Gas-to-oil ratio
            <InfoTooltip
              label="Gas-to-oil ratio"
              text="50:1 means 50 parts gasoline for every 1 part two-stroke oil by volume. Enter the gasoline parts number (e.g. 50)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.ratio}>
              <input
                id="gor-ratio"
                className={inputClass}
                inputMode="decimal"
                value={input.ratio}
                aria-invalid={Boolean(errors.ratio)}
                onChange={(e) => set({ ratio: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground">
                :1
              </span>
            </FieldShell>
          </div>
          {errors.ratio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ratio}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RATIO_PRESETS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set({ ratio: String(r) })}
                className={`rounded-md border px-2 py-1 text-xs font-medium ${
                  input.ratio === String(r)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-white text-accent hover:bg-muted/30'
                }`}
              >
                {r}:1
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {input.mode === 'calculateOil' || input.mode === 'calculateRatio' ? (
        <div>
          <label htmlFor="gor-gas" className={labelClass}>
            Gas (petrol) volume
            <InfoTooltip
              label="Gasoline volume"
              text="Volume of gasoline (petrol) before mixing. Units convert while preserving the physical quantity."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.gasVolume}>
              <input
                id="gor-gas"
                className={inputClass}
                inputMode="decimal"
                value={input.gasVolume}
                aria-invalid={Boolean(errors.gasVolume)}
                onChange={(e) => set({ gasVolume: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.gasUnit}
              aria-label="Gasoline volume unit"
              onChange={(e) =>
                changeVolumeUnit('gas', e.target.value as FuelVolumeUnit)
              }
            >
              {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {VOLUME_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.gasVolume ? (
            <p className="mt-1 text-xs text-rose-600">{errors.gasVolume}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'calculateGas' || input.mode === 'calculateRatio' ? (
        <div>
          <label htmlFor="gor-oil" className={labelClass}>
            Oil volume
            <InfoTooltip
              label="Oil volume"
              text="Two-stroke oil volume. In Calculate gas mode this is the known oil; in Calculate ratio mode both gas and oil are known."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.oilVolume}>
              <input
                id="gor-oil"
                className={inputClass}
                inputMode="decimal"
                value={input.oilVolume}
                aria-invalid={Boolean(errors.oilVolume)}
                onChange={(e) => set({ oilVolume: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.oilUnit}
              aria-label="Oil volume unit"
              onChange={(e) =>
                changeVolumeUnit('oil', e.target.value as FuelVolumeUnit)
              }
            >
              {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {VOLUME_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.oilVolume ? (
            <p className="mt-1 text-xs text-rose-600">{errors.oilVolume}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'calculateTotalMixture' ? (
        <div>
          <label htmlFor="gor-total" className={labelClass}>
            Desired total mixture volume
            <InfoTooltip
              label="Total mixture"
              text="Target premixed fuel volume (gas + oil). Oil = Total / (Ratio + 1). This differs from adding oil to a known gasoline volume alone."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalMixtureVolume}>
              <input
                id="gor-total"
                className={inputClass}
                inputMode="decimal"
                value={input.totalMixtureVolume}
                aria-invalid={Boolean(errors.totalMixtureVolume)}
                onChange={(e) => set({ totalMixtureVolume: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.totalMixtureUnit}
              aria-label="Total mixture unit"
              onChange={(e) =>
                changeVolumeUnit('total', e.target.value as FuelVolumeUnit)
              }
            >
              {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {VOLUME_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.totalMixtureVolume ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.totalMixtureVolume}
            </p>
          ) : null}
        </div>
      ) : null}

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Mixing reference chart
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set({ chartSystem: 'metric' })}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                input.chartSystem === 'metric'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent'
              }`}
            >
              Metric (L → mL oil)
            </button>
            <button
              type="button"
              onClick={() => set({ chartSystem: 'us' })}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                input.chartSystem === 'us'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent'
              }`}
            >
              US gallons → fl oz oil
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-2 py-1.5 font-medium">Gasoline</th>
                  {chartRatios.map((r) => (
                    <th key={r} className="px-2 py-1.5 font-medium">
                      {r}:1
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartRows.map((row) => (
                  <tr key={row.gasolineLabel} className="border-b border-border/60">
                    <td className="px-2 py-1.5 font-medium text-accent">
                      {row.gasolineLabel}
                    </td>
                    {chartRatios.map((r) => {
                      const oilMl = row.oilsMl[r];
                      const display =
                        input.chartSystem === 'metric'
                          ? `${fmt(oilMl)} mL`
                          : `${fmt(fromMilliliters(oilMl, 'flOzUS'))} fl oz`;
                      return (
                        <td
                          key={r}
                          className="px-2 py-1.5 tabular-nums text-accent"
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Chart shows oil to add to the listed gasoline volume (not a fixed
            total premix). Confirm the ratio for your engine.
          </p>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
