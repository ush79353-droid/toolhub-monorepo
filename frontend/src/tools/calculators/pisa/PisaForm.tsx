'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cmPerSToSpeedUnit,
  cmToLengthUnit,
  lengthToCm,
  speedToCmPerS,
} from './calculation';
import type {
  AreaUnit,
  FlowUnit,
  LengthUnit,
  PisaFieldErrors,
  PisaInput,
  PisaResult,
  SpeedUnit,
  VolumeUnit,
} from './types';
import {
  AREA_UNIT_LABELS,
  FLOW_UNIT_LABELS,
  LENGTH_UNIT_LABELS,
  SPEED_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

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
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
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
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: PisaInput;
  errors: PisaFieldErrors;
  result: PisaResult | null;
  onChange: (input: PisaInput) => void;
  onLoadExample: () => void;
}

export function PisaForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PisaInput>) => onChange({ ...input, ...patch });

  const switchSpeed = (field: 'vmax' | 'vr', next: SpeedUnit) => {
    const unitKey = field === 'vmax' ? 'vmaxUnit' : 'vrUnit';
    const cur = input[unitKey];
    if (next === cur) return;
    const raw = parseLoose(input[field]);
    let nextValue = input[field];
    if (raw != null) {
      const cm = speedToCmPerS(raw, cur);
      if (cm != null) nextValue = formatField(cmPerSToSpeedUnit(cm, next), 2);
    }
    set({ [field]: nextValue, [unitKey]: next } as Partial<PisaInput>);
  };

  const switchLength = (field: 'radius' | 'vti', next: LengthUnit) => {
    const unitKey = field === 'radius' ? 'radiusUnit' : 'vtiUnit';
    const cur = input[unitKey];
    if (next === cur) return;
    const raw = parseLoose(input[field]);
    let nextValue = input[field];
    if (raw != null) {
      const cm = lengthToCm(raw, cur);
      if (cm != null) nextValue = formatField(cmToLengthUnit(cm, next), 3);
    }
    set({ [field]: nextValue, [unitKey]: next } as Partial<PisaInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational PISA worksheet (angle-corrected hemisphere).{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline"
          onClick={onLoadExample}
        >
          Load example
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>Vmax</span>
          <InfoTooltip text="Peak jet velocity. Must be &gt; 0 for MVA/EROA." />
        </div>
        <FieldShell error={errors.vmax}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.vmax}
            aria-label="Vmax"
            onChange={(e) => set({ vmax: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.vmaxUnit}
            aria-label="Vmax unit"
            onChange={(e) => switchSpeed('vmax', e.target.value as SpeedUnit)}
          >
            {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
              <option key={u} value={u}>
                {SPEED_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.vmax ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vmax}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>r</span>
          <InfoTooltip text="PISA radius from orifice to aliasing shell." />
        </div>
        <FieldShell error={errors.radius}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.radius}
            aria-label="PISA radius"
            onChange={(e) => set({ radius: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.radiusUnit}
            aria-label="Radius unit"
            onChange={(e) => switchLength('radius', e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.radius ? (
          <p className="mt-1 text-xs text-rose-600">{errors.radius}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Vr</span>
          <InfoTooltip text="Aliasing / Nyquist velocity of the PISA shell." />
        </div>
        <FieldShell error={errors.vr}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.vr}
            aria-label="Aliasing speed Vr"
            onChange={(e) => set({ vr: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.vrUnit}
            aria-label="Vr unit"
            onChange={(e) => switchSpeed('vr', e.target.value as SpeedUnit)}
          >
            {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
              <option key={u} value={u}>
                {SPEED_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.vr ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vr}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>α angle</span>
          <InfoTooltip text="Leaflet opening angle for MS constraint. Factor = α/180. Blank → 180° (full hemisphere)." />
        </div>
        <FieldShell error={errors.alpha}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.alpha}
            aria-label="Alpha angle"
            onChange={(e) => set({ alpha: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
            deg
          </span>
        </FieldShell>
        {errors.alpha ? (
          <p className="mt-1 text-xs text-rose-600">{errors.alpha}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Velocity time integral (VTI)</span>
          <InfoTooltip text="Jet VTI for regurgitant volume = EROA × VTI." />
        </div>
        <FieldShell error={errors.vti}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.vti}
            aria-label="Velocity time integral"
            onChange={(e) => set({ vti: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.vtiUnit}
            aria-label="VTI unit"
            onChange={(e) => switchLength('vti', e.target.value as LengthUnit)}
          >
            {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {LENGTH_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.vti ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vti}</p>
        ) : null}
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="mb-3 text-[13px] font-semibold text-accent">Results</h3>

        <div className="space-y-4">
          <div>
            <div className={labelClass}>
              <span>Mitral valve area (MVA)</span>
              <InfoTooltip text="Stenosis orifice estimate = VFR / Vmax." />
            </div>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                value={result?.formattedMva ?? ''}
                aria-label="Mitral valve area result"
                tabIndex={-1}
              />
              <select
                className={unitSelectClass}
                value={input.mvaUnit}
                aria-label="MVA unit"
                onChange={(e) => set({ mvaUnit: e.target.value as AreaUnit })}
              >
                {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {AREA_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>

          <div>
            <div className={labelClass}>
              <span>Volume flow rate (VFR)</span>
              <InfoTooltip text="VFR = angle-corrected PISA × Vr." />
            </div>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                value={result?.formattedVfr ?? ''}
                aria-label="Volume flow rate result"
                tabIndex={-1}
              />
              <select
                className={unitSelectClass}
                value={input.vfrUnit}
                aria-label="VFR unit"
                onChange={(e) => set({ vfrUnit: e.target.value as FlowUnit })}
              >
                {(Object.keys(FLOW_UNIT_LABELS) as FlowUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {FLOW_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>

          <div>
            <div className={labelClass}>
              <span>Effective regurgitant orifice (ERO, EROA)</span>
              <InfoTooltip text="Regurgitant orifice = VFR / Vmax (default mm²)." />
            </div>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                value={result?.formattedEroa ?? ''}
                aria-label="EROA result"
                tabIndex={-1}
              />
              <select
                className={unitSelectClass}
                value={input.eroaUnit}
                aria-label="EROA unit"
                onChange={(e) => set({ eroaUnit: e.target.value as AreaUnit })}
              >
                {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {AREA_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>

          <div>
            <div className={labelClass}>
              <span>Regurgitant volume (RVol)</span>
              <InfoTooltip text="RVol = EROA × VTI per beat." />
            </div>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                value={result?.formattedRvol ?? ''}
                aria-label="Regurgitant volume result"
                tabIndex={-1}
              />
              <select
                className={unitSelectClass}
                value={input.rvolUnit}
                aria-label="RVol unit"
                onChange={(e) => set({ rvolUnit: e.target.value as VolumeUnit })}
              >
                {(Object.keys(VOLUME_UNIT_LABELS) as VolumeUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {VOLUME_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
              <span className="shrink-0 pr-3 text-sm text-muted-foreground">
                /beat
              </span>
            </FieldShell>
          </div>

          <div>
            <div className={labelClass}>
              <span>PISA</span>
              <InfoTooltip text="Angle-corrected proximal isovelocity surface area = 2πr² × (α/180)." />
            </div>
            <FieldShell muted>
              <input
                className={inputClass}
                readOnly
                value={result?.formattedPisa ?? ''}
                aria-label="PISA area result"
                tabIndex={-1}
              />
              <select
                className={unitSelectClass}
                value={input.pisaUnit}
                aria-label="PISA unit"
                onChange={(e) => set({ pisaUnit: e.target.value as AreaUnit })}
              >
                {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {AREA_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>
        </div>
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation} {result.disclaimer}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter radius for PISA; add Vr for VFR; add Vmax for MVA/EROA; add VTI
          for regurgitant volume. Blank α uses 180° (hemisphere).
        </p>
      )}
    </form>
  );
}
