'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDensity,
  convertDistance,
  convertFlow,
  convertSpeed,
  convertTime,
} from './calculation';
import {
  DENSITY_UNIT_LABELS,
  DISTANCE_UNIT_LABELS,
  FLOW_UNIT_LABELS,
  HEADWAY_UNIT_LABELS,
  MODE_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
  createEmptyInput,
  type CalculationMode,
  type DensityUnit,
  type DistanceUnit,
  type FlowUnit,
  type HeadwayUnit,
  type SpeedUnit,
  type TimeUnit,
  type TrafficDensityFieldErrors,
  type TrafficDensityInput,
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

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <button
        type="button"
        className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
        onClick={onToggle}
        aria-expanded={open}
      >
        {title}
        <span className="text-muted-foreground">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="mt-3 space-y-3">{children}</div> : null}
    </div>
  );
}

interface TrafficDensityFormProps {
  input: TrafficDensityInput;
  errors: TrafficDensityFieldErrors;
  onChange: (next: TrafficDensityInput) => void;
}

export function TrafficDensityForm({
  input,
  errors,
  onChange,
}: TrafficDensityFormProps) {
  const set = (patch: Partial<TrafficDensityInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Calculate traffic flow, density, and macroscopic stream speed from
        consistent observations (same road scope / lanes / direction). Optional
        direct mode solves q = k × v for one unknown.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (100 / 10 min · 20 / 2 km)
        </button>
      </div>

      <div>
        <label htmlFor="td-mode" className={labelClass}>
          Calculation mode
        </label>
        <select
          id="td-mode"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.mode}
          onChange={(e) =>
            set({ mode: e.target.value as CalculationMode })
          }
        >
          {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      {input.mode === 'observations' ? (
        <>
          <Section
            title="Traffic Flow"
            open={input.openFlow}
            onToggle={() => set({ openFlow: !input.openFlow })}
          >
            <div>
              <label htmlFor="td-pass" className={labelClass}>
                No. of vehicles
                <InfoTooltip
                  label="Passing vehicles"
                  text="Vehicles passing a fixed observation point during the time interval."
                />
              </label>
              <FieldShell error={errors.passingVehicles}>
                <input
                  id="td-pass"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.passingVehicles}
                  onChange={(e) => set({ passingVehicles: e.target.value })}
                />
              </FieldShell>
              {errors.passingVehicles ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.passingVehicles}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="td-time" className={labelClass}>
                Time passed during observation
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.observationTime}>
                  <input
                    id="td-time"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.observationTime}
                    onChange={(e) => set({ observationTime: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.observationTimeUnit}
                  aria-label="Observation time unit"
                  onChange={(e) => {
                    const next = e.target.value as TimeUnit;
                    const n = Number(input.observationTime.replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      set({
                        observationTimeUnit: next,
                        observationTime: String(
                          Number(
                            convertTime(
                              n,
                              input.observationTimeUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ observationTimeUnit: next });
                  }}
                >
                  {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {TIME_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.observationTime ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.observationTime}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass}>Traffic flow (display unit)</label>
              <select
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.flowUnit}
                onChange={(e) =>
                  set({ flowUnit: e.target.value as FlowUnit })
                }
              >
                {(Object.keys(FLOW_UNIT_LABELS) as FlowUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {FLOW_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          <Section
            title="Traffic Density"
            open={input.openDensity}
            onToggle={() => set({ openDensity: !input.openDensity })}
          >
            <div>
              <label htmlFor="td-seg" className={labelClass}>
                No. of vehicles
                <InfoTooltip
                  label="Segment vehicles"
                  text="Vehicles occupying the road segment at a particular instant (same scope as flow)."
                />
              </label>
              <FieldShell error={errors.segmentVehicles}>
                <input
                  id="td-seg"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.segmentVehicles}
                  onChange={(e) => set({ segmentVehicles: e.target.value })}
                />
              </FieldShell>
              {errors.segmentVehicles ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.segmentVehicles}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="td-len" className={labelClass}>
                On a road of length…
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.roadLength}>
                  <input
                    id="td-len"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.roadLength}
                    onChange={(e) => set({ roadLength: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.roadLengthUnit}
                  aria-label="Road length unit"
                  onChange={(e) => {
                    const next = e.target.value as DistanceUnit;
                    const n = Number(input.roadLength.replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      set({
                        roadLengthUnit: next,
                        roadLength: String(
                          Number(
                            convertDistance(
                              n,
                              input.roadLengthUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ roadLengthUnit: next });
                  }}
                >
                  {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {DISTANCE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.roadLength ? (
                <p className="mt-1 text-xs text-rose-600">{errors.roadLength}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass}>Density (display unit)</label>
              <select
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.densityUnit}
                onChange={(e) =>
                  set({ densityUnit: e.target.value as DensityUnit })
                }
              >
                {(Object.keys(DENSITY_UNIT_LABELS) as DensityUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {DENSITY_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </Section>

          <Section
            title="Average Speed"
            open={input.openSpeed}
            onToggle={() => set({ openSpeed: !input.openSpeed })}
          >
            <div>
              <label className={labelClass}>Travel speed (display unit)</label>
              <select
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.speedUnit}
                onChange={(e) =>
                  set({ speedUnit: e.target.value as SpeedUnit })
                }
              >
                {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Headway (display unit)</label>
              <select
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.headwayUnit}
                onChange={(e) =>
                  set({ headwayUnit: e.target.value as HeadwayUnit })
                }
              >
                {(Object.keys(HEADWAY_UNIT_LABELS) as HeadwayUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {HEADWAY_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </Section>
        </>
      ) : (
        <Section
          title="Direct traffic parameters"
          open={input.openDirect || true}
          onToggle={() => set({ openDirect: !input.openDirect })}
        >
          {(input.mode === 'calculate-speed' ||
            input.mode === 'calculate-density') && (
            <div>
              <label htmlFor="td-df" className={labelClass}>
                Traffic flow
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.directFlow}>
                  <input
                    id="td-df"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.directFlow}
                    onChange={(e) => set({ directFlow: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[130px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
                  value={input.flowUnit}
                  aria-label="Flow unit"
                  onChange={(e) => {
                    const next = e.target.value as FlowUnit;
                    const n = Number(input.directFlow.replace(/,/g, ''));
                    if (Number.isFinite(n) && n >= 0) {
                      set({
                        flowUnit: next,
                        directFlow: String(
                          Number(
                            convertFlow(n, input.flowUnit, next).toPrecision(
                              12,
                            ),
                          ),
                        ),
                      });
                    } else set({ flowUnit: next });
                  }}
                >
                  {(Object.keys(FLOW_UNIT_LABELS) as FlowUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {FLOW_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.directFlow ? (
                <p className="mt-1 text-xs text-rose-600">{errors.directFlow}</p>
              ) : null}
            </div>
          )}

          {(input.mode === 'calculate-speed' ||
            input.mode === 'calculate-flow') && (
            <div>
              <label htmlFor="td-dd" className={labelClass}>
                Traffic density
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.directDensity}>
                  <input
                    id="td-dd"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.directDensity}
                    onChange={(e) => set({ directDensity: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
                  value={input.densityUnit}
                  aria-label="Density unit"
                  onChange={(e) => {
                    const next = e.target.value as DensityUnit;
                    const n = Number(input.directDensity.replace(/,/g, ''));
                    if (Number.isFinite(n) && n >= 0) {
                      set({
                        densityUnit: next,
                        directDensity: String(
                          Number(
                            convertDensity(
                              n,
                              input.densityUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ densityUnit: next });
                  }}
                >
                  {(Object.keys(DENSITY_UNIT_LABELS) as DensityUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {DENSITY_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.directDensity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.directDensity}
                </p>
              ) : null}
            </div>
          )}

          {(input.mode === 'calculate-density' ||
            input.mode === 'calculate-flow') && (
            <div>
              <label htmlFor="td-ds" className={labelClass}>
                Traffic speed
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.directSpeed}>
                  <input
                    id="td-ds"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.directSpeed}
                    onChange={(e) => set({ directSpeed: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                  value={input.speedUnit}
                  aria-label="Speed unit"
                  onChange={(e) => {
                    const next = e.target.value as SpeedUnit;
                    const n = Number(input.directSpeed.replace(/,/g, ''));
                    if (Number.isFinite(n) && n >= 0) {
                      set({
                        speedUnit: next,
                        directSpeed: String(
                          Number(
                            convertSpeed(
                              n,
                              input.speedUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else set({ speedUnit: next });
                  }}
                >
                  {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {SPEED_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.directSpeed ? (
                <p className="mt-1 text-xs text-rose-600">{errors.directSpeed}</p>
              ) : null}
            </div>
          )}
        </Section>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
