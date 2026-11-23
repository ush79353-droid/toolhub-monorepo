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
  EroaFieldErrors,
  EroaMitralRegurgitationInput,
  EroaMitralRegurgitationResult,
  FlowUnit,
  LengthUnit,
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
  input: EroaMitralRegurgitationInput;
  errors: EroaFieldErrors;
  result: EroaMitralRegurgitationResult | null;
  onChange: (input: EroaMitralRegurgitationInput) => void;
  onLoadExample: () => void;
}

export function EroaMitralRegurgitationForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EroaMitralRegurgitationInput>) =>
    onChange({ ...input, ...patch });

  const switchSpeed = (
    field: 'aliasingSpeed' | 'maxVelocity',
    next: SpeedUnit
  ) => {
    const unitKey = field === 'aliasingSpeed' ? 'aliasingSpeedUnit' : 'maxVelocityUnit';
    const cur = input[unitKey];
    if (next === cur) return;
    const raw = parseLoose(input[field]);
    let nextValue = input[field];
    if (raw != null) {
      const cm = speedToCmPerS(raw, cur);
      if (cm != null) nextValue = formatField(cmPerSToSpeedUnit(cm, next), 2);
    }
    set({ [field]: nextValue, [unitKey]: next } as Partial<EroaMitralRegurgitationInput>);
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
    set({ [field]: nextValue, [unitKey]: next } as Partial<EroaMitralRegurgitationInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational PISA EROA for mitral regurgitation (hemispherical
        convergence).{' '}
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
          <span>Aliasing speed (Va)</span>
          <InfoTooltip text="Color Doppler aliasing velocity used for the PISA shell." />
        </div>
        <FieldShell error={errors.aliasingSpeed}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.aliasingSpeed}
            aria-label="Aliasing speed"
            onChange={(e) => set({ aliasingSpeed: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.aliasingSpeedUnit}
            aria-label="Aliasing speed unit"
            onChange={(e) =>
              switchSpeed('aliasingSpeed', e.target.value as SpeedUnit)
            }
          >
            {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
              <option key={u} value={u}>
                {SPEED_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.aliasingSpeed ? (
          <p className="mt-1 text-xs text-rose-600">{errors.aliasingSpeed}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Radius (r)</span>
          <InfoTooltip text="PISA radius from orifice to aliasing shell. Hemispherical geometry assumed." />
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
          <span>Maximal velocity (Vmax)</span>
          <InfoTooltip text="Peak MR jet velocity. Must be &gt; 0 for EROA." />
        </div>
        <FieldShell error={errors.maxVelocity}>
          <input
            className={inputClass}
            inputMode="decimal"
            value={input.maxVelocity}
            aria-label="Maximal MR velocity"
            onChange={(e) => set({ maxVelocity: e.target.value })}
          />
          <select
            className={unitSelectClass}
            value={input.maxVelocityUnit}
            aria-label="Maximal velocity unit"
            onChange={(e) =>
              switchSpeed('maxVelocity', e.target.value as SpeedUnit)
            }
          >
            {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
              <option key={u} value={u}>
                {SPEED_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.maxVelocity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.maxVelocity}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Velocity time integral (VTI)</span>
          <InfoTooltip text="MR VTI used for regurgitant volume = EROA × VTI." />
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

      <div>
        <div className={labelClass}>
          <span>Volume flow rate (VFR)</span>
          <InfoTooltip text="2π r² Va (mL/s when r and Va are in cm and cm/s)." />
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={result?.formattedFlow ?? ''}
            aria-label="Volume flow rate result"
            tabIndex={-1}
          />
          <select
            className={unitSelectClass}
            value={input.flowUnit}
            aria-label="Flow unit"
            onChange={(e) => set({ flowUnit: e.target.value as FlowUnit })}
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
          <span>EROA</span>
          <InfoTooltip text="Effective regurgitant orifice area = flow / Vmax." />
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
          <span>Regurgitant volume (Rvol)</span>
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
            aria-label="Regurgitant volume unit"
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

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation} {result.disclaimer}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter radius and aliasing speed for flow; add Vmax for EROA; add VTI
          for regurgitant volume.
        </p>
      )}
    </form>
  );
}
