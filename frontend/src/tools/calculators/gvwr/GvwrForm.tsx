'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertWeight } from './calculation';
import {
  MODE_LABELS,
  WEIGHT_UNIT_LABELS,
  type GvwrFieldErrors,
  type GvwrInput,
  type GvwrMode,
  type WeightUnit,
  createCapacityExample,
  createEmptyInput,
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

interface GvwrFormProps {
  input: GvwrInput;
  errors: GvwrFieldErrors;
  onChange: (next: GvwrInput) => void;
}

export function GvwrForm({ input, errors, onChange }: GvwrFormProps) {
  const set = (patch: Partial<GvwrInput>) => onChange({ ...input, ...patch });

  const changeUnit = (
    field:
      | 'tare'
      | 'payload'
      | 'gvw'
      | 'gvwr'
      | 'actual'
      | 'unloaded',
    next: WeightUnit,
  ) => {
    if (field === 'tare') {
      const n = Number(input.tareWeight.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          tareUnit: next,
          tareWeight: String(
            Number(convertWeight(n, input.tareUnit, next).toPrecision(12)),
          ),
        });
        return;
      }
      set({ tareUnit: next });
      return;
    }
    if (field === 'payload') {
      const n = Number(input.payloadWeight.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          payloadUnit: next,
          payloadWeight: String(
            Number(convertWeight(n, input.payloadUnit, next).toPrecision(12)),
          ),
        });
        return;
      }
      set({ payloadUnit: next });
      return;
    }
    if (field === 'gvw') {
      set({ gvwUnit: next });
      return;
    }
    if (field === 'gvwr') {
      const n = Number(input.manufacturerGvwr.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          manufacturerGvwrUnit: next,
          manufacturerGvwr: String(
            Number(
              convertWeight(n, input.manufacturerGvwrUnit, next).toPrecision(
                12,
              ),
            ),
          ),
        });
        return;
      }
      set({ manufacturerGvwrUnit: next });
      return;
    }
    if (field === 'actual') {
      const n = Number(input.actualGrossWeight.replace(/,/g, ''));
      if (Number.isFinite(n) && n >= 0) {
        set({
          actualGrossUnit: next,
          actualGrossWeight: String(
            Number(
              convertWeight(n, input.actualGrossUnit, next).toPrecision(12),
            ),
          ),
        });
        return;
      }
      set({ actualGrossUnit: next });
      return;
    }
    const n = Number(input.unloadedWeight.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      set({
        unloadedUnit: next,
        unloadedWeight: String(
          Number(convertWeight(n, input.unloadedUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ unloadedUnit: next });
  };

  const unitSelect = (
    value: WeightUnit,
    onPick: (u: WeightUnit) => void,
    ariaLabel: string,
  ) => (
    <select
      className="h-11 w-[96px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onPick(e.target.value as WeightUnit)}
    >
      {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
        <option key={u} value={u}>
          {WEIGHT_UNIT_LABELS[u]}
        </option>
      ))}
    </select>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Adding tare and payload estimates <strong>gross vehicle weight (GVW)</strong>
        . <strong>GVWR</strong> is the manufacturer&apos;s maximum permitted
        loaded weight — enter it separately to check capacity. Axle and tire
        limits may still apply.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (1,000 + 500 → 1,500 kg)
        </button>
        <button
          type="button"
          onClick={() => onChange(createCapacityExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Capacity check (2,100 vs 2,500)
        </button>
      </div>

      <div>
        <span className={labelClass}>Mode</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(MODE_LABELS) as GvwrMode[]).map((m) => (
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

      {input.mode === 'grossWeight' || input.mode === 'capacityCheck' ? (
        <>
          <div>
            <label htmlFor="gvwr-tare" className={labelClass}>
              Vehicle&apos;s tare weight
              <InfoTooltip
                label="Tare weight"
                text="Unloaded vehicle weight under a weighing convention. Definitions vary (fuel, fluids, equipment). Curb weight is a related but not identical term."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.tareWeight}>
                <input
                  id="gvwr-tare"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.tareWeight}
                  aria-invalid={Boolean(errors.tareWeight)}
                  onChange={(e) => set({ tareWeight: e.target.value })}
                />
              </FieldShell>
              {unitSelect(input.tareUnit, (u) => changeUnit('tare', u), 'Tare unit')}
            </div>
            {errors.tareWeight ? (
              <p className="mt-1 text-xs text-rose-600">{errors.tareWeight}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gvwr-payload" className={labelClass}>
              Vehicle&apos;s rated payload
              <InfoTooltip
                label="Payload"
                text="Passengers, cargo, luggage, tools, equipment, and (when applicable) trailer tongue weight on the towing vehicle."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.payloadWeight}>
                <input
                  id="gvwr-payload"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.payloadWeight}
                  aria-invalid={Boolean(errors.payloadWeight)}
                  onChange={(e) => set({ payloadWeight: e.target.value })}
                />
              </FieldShell>
              {unitSelect(
                input.payloadUnit,
                (u) => changeUnit('payload', u),
                'Payload unit',
              )}
            </div>
            {errors.payloadWeight ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.payloadWeight}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gvwr-gvw-unit" className={labelClass}>
              Gross vehicle weight display unit
              <InfoTooltip
                label="Gross vehicle weight"
                text="Estimated loaded weight = tare + payload. This is GVW, not the manufacturer GVWR."
              />
            </label>
            {unitSelect(
              input.gvwUnit,
              (u) => changeUnit('gvw', u),
              'GVW display unit',
            )}
          </div>
        </>
      ) : null}

      {input.mode === 'capacityCheck' ? (
        <details className="rounded-xl border border-border bg-muted/10" open>
          <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
            Check vehicle weight against GVWR
          </summary>
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <div>
              <label htmlFor="gvwr-mfr" className={labelClass}>
                Manufacturer&apos;s GVWR
                <InfoTooltip
                  label="GVWR"
                  text="Gross Vehicle Weight Rating — the manufacturer’s maximum permitted loaded vehicle weight. Found on the certification label / door jamb."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.manufacturerGvwr}>
                  <input
                    id="gvwr-mfr"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.manufacturerGvwr}
                    aria-invalid={Boolean(errors.manufacturerGvwr)}
                    onChange={(e) =>
                      set({ manufacturerGvwr: e.target.value })
                    }
                  />
                </FieldShell>
                {unitSelect(
                  input.manufacturerGvwrUnit,
                  (u) => changeUnit('gvwr', u),
                  'GVWR unit',
                )}
              </div>
              {errors.manufacturerGvwr ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.manufacturerGvwr}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="gvwr-actual" className={labelClass}>
                Actual / scale gross weight (optional)
                <InfoTooltip
                  label="Actual gross weight"
                  text="Leave blank to use tare + payload. Enter a scale-measured loaded weight to override the estimate."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.actualGrossWeight}>
                  <input
                    id="gvwr-actual"
                    className={inputClass}
                    inputMode="decimal"
                    placeholder="optional"
                    value={input.actualGrossWeight}
                    aria-invalid={Boolean(errors.actualGrossWeight)}
                    onChange={(e) =>
                      set({ actualGrossWeight: e.target.value })
                    }
                  />
                </FieldShell>
                {unitSelect(
                  input.actualGrossUnit,
                  (u) => changeUnit('actual', u),
                  'Actual gross unit',
                )}
              </div>
              {errors.actualGrossWeight ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.actualGrossWeight}
                </p>
              ) : null}
            </div>
          </div>
        </details>
      ) : null}

      {input.mode === 'maximumPayload' ? (
        <>
          <div>
            <label htmlFor="gvwr-mfr2" className={labelClass}>
              Manufacturer&apos;s GVWR
              <InfoTooltip
                label="GVWR"
                text="Manufacturer maximum permitted loaded weight used to estimate payload headroom."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.manufacturerGvwr}>
                <input
                  id="gvwr-mfr2"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.manufacturerGvwr}
                  aria-invalid={Boolean(errors.manufacturerGvwr)}
                  onChange={(e) => set({ manufacturerGvwr: e.target.value })}
                />
              </FieldShell>
              {unitSelect(
                input.manufacturerGvwrUnit,
                (u) => changeUnit('gvwr', u),
                'GVWR unit',
              )}
            </div>
            {errors.manufacturerGvwr ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.manufacturerGvwr}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gvwr-unload" className={labelClass}>
              Unloaded vehicle weight
              <InfoTooltip
                label="Unloaded weight"
                text="Compatible tare/curb/unladen weight for Maximum payload ≈ GVWR − unloaded weight."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.unloadedWeight}>
                <input
                  id="gvwr-unload"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.unloadedWeight}
                  aria-invalid={Boolean(errors.unloadedWeight)}
                  onChange={(e) => set({ unloadedWeight: e.target.value })}
                />
              </FieldShell>
              {unitSelect(
                input.unloadedUnit,
                (u) => changeUnit('unloaded', u),
                'Unloaded unit',
              )}
            </div>
            {errors.unloadedWeight ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.unloadedWeight}
              </p>
            ) : null}
          </div>

          <div>
            <span className={labelClass}>Result display unit</span>
            {unitSelect(
              input.gvwUnit,
              (u) => changeUnit('gvw', u),
              'Result unit',
            )}
          </div>
        </>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
