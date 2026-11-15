'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatFlowNumber,
  fromMeters,
  fromPascals,
  fromSquareMeters,
  toMeters,
  toPascals,
  toSquareMeters,
} from './calculation';
import {
  DEFAULT_CD,
  DEFAULT_WATER_DENSITY,
  STANDARD_ATM_PSI,
  type AreaUnit,
  type FlowUnit,
  type GeometrySource,
  type LengthUnit,
  type PressureReference,
  type PressureUnit,
  type PsiToGpmFieldErrors,
  type PsiToGpmInput,
  type PsiToGpmResult,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PsiToGpmDraft {
  inlet: string;
  outlet: string;
  diameter: string;
  area: string;
  density: string;
  cd: string;
  inletUnit: PressureUnit;
  outletUnit: PressureUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  flowUnit: FlowUnit;
  geometrySource: GeometrySource;
  pressureReference: PressureReference;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function inputToDraft(input: PsiToGpmInput): PsiToGpmDraft {
  return {
    inlet: input.inletPsi === null ? '' : formatFlowNumber(input.inletPsi),
    outlet: input.outletPsi === null ? '' : formatFlowNumber(input.outletPsi),
    diameter:
      input.diameterM === null ? '' : formatFlowNumber(fromMeters(input.diameterM, 'cm')),
    area:
      input.areaM2 === null
        ? ''
        : formatFlowNumber(fromSquareMeters(input.areaM2, 'cm2')),
    density: formatFlowNumber(input.densityKgM3),
    cd: formatFlowNumber(input.dischargeCoefficient),
    inletUnit: 'psi',
    outletUnit: 'psi',
    lengthUnit: 'cm',
    areaUnit: 'cm2',
    flowUnit: 'usGpm',
    geometrySource: input.geometrySource,
    pressureReference: input.pressureReference,
  };
}

export function draftToInput(draft: PsiToGpmDraft): PsiToGpmInput {
  const inletRaw = parseOptionalNumber(draft.inlet);
  const outletRaw = parseOptionalNumber(draft.outlet);
  const diameterRaw = parseOptionalNumber(draft.diameter);
  const areaRaw = parseOptionalNumber(draft.area);
  const densityRaw = parseOptionalNumber(draft.density);
  const cdRaw = parseOptionalNumber(draft.cd);

  const pressureToPsi = (value: number, unit: PressureUnit): number =>
    fromPascals(toPascals(value, unit), 'psi');

  return {
    inletPsi:
      inletRaw === null || !Number.isFinite(inletRaw)
        ? inletRaw
        : pressureToPsi(inletRaw, draft.inletUnit),
    outletPsi:
      outletRaw === null || !Number.isFinite(outletRaw)
        ? outletRaw
        : pressureToPsi(outletRaw, draft.outletUnit),
    diameterM:
      diameterRaw === null || !Number.isFinite(diameterRaw)
        ? diameterRaw
        : toMeters(diameterRaw, draft.lengthUnit),
    areaM2:
      areaRaw === null || !Number.isFinite(areaRaw)
        ? areaRaw
        : toSquareMeters(areaRaw, draft.areaUnit),
    geometrySource: draft.geometrySource,
    densityKgM3:
      densityRaw === null || !Number.isFinite(densityRaw)
        ? DEFAULT_WATER_DENSITY
        : densityRaw,
    dischargeCoefficient:
      cdRaw === null || !Number.isFinite(cdRaw) ? DEFAULT_CD : cdRaw,
    pressureReference: draft.pressureReference,
  };
}

/** Preserve physical pressure when the display unit changes. */
export function convertPressureDraftValue(
  raw: string,
  fromUnit: PressureUnit,
  toUnit: PressureUnit
): string {
  const value = parseOptionalNumber(raw);
  if (value === null || !Number.isFinite(value)) return raw;
  return formatFlowNumber(fromPascals(toPascals(value, fromUnit), toUnit));
}

export function convertLengthDraftValue(
  raw: string,
  fromUnit: LengthUnit,
  toUnit: LengthUnit
): string {
  const value = parseOptionalNumber(raw);
  if (value === null || !Number.isFinite(value)) return raw;
  return formatFlowNumber(fromMeters(toMeters(value, fromUnit), toUnit));
}

export function convertAreaDraftValue(
  raw: string,
  fromUnit: AreaUnit,
  toUnit: AreaUnit
): string {
  const value = parseOptionalNumber(raw);
  if (value === null || !Number.isFinite(value)) return raw;
  return formatFlowNumber(fromSquareMeters(toSquareMeters(value, fromUnit), toUnit));
}

interface PsiToGpmFormProps {
  draft: PsiToGpmDraft;
  errors: PsiToGpmFieldErrors;
  result: PsiToGpmResult | null;
  flowDisplay: string;
  onDraftChange: (draft: PsiToGpmDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PsiToGpmForm({
  draft,
  errors,
  result,
  flowDisplay,
  onDraftChange,
  onSubmit,
  onReset,
}: PsiToGpmFormProps) {
  const set = (patch: Partial<PsiToGpmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Ideal pressure-driven liquid flow (Bernoulli). PSI measures pressure; GPM measures
        volumetric flow — they are not directly interchangeable. Default fluid is water at{' '}
        {formatFlowNumber(DEFAULT_WATER_DENSITY)} kg/m³. Not a full pipe-friction network model.
      </div>

      <FieldShell
        label="Pressure inside the pipe"
        htmlFor="psi-gpm-inlet"
        tip="Use the same absolute or gauge reference as the exit pressure."
        error={errors.inlet ?? errors.deltaP}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-gpm-inlet"
              inputMode="decimal"
              className={inputClass}
              value={draft.inlet}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.inlet)}
              onChange={(event) => set({ inlet: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            value={draft.inletUnit}
            aria-label="Inlet pressure unit"
            onChange={(event) => {
              const next = event.target.value as PressureUnit;
              set({
                inlet: convertPressureDraftValue(draft.inlet, draft.inletUnit, next),
                inletUnit: next,
              });
            }}
          >
            <option value="psi">psi</option>
            <option value="kPa">kPa</option>
            <option value="bar">bar</option>
            <option value="atm">atm</option>
            <option value="Pa">Pa</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure at the exit"
        htmlFor="psi-gpm-outlet"
        tip={`Default ≈ standard atmosphere (${formatFlowNumber(STANDARD_ATM_PSI)} psi absolute). Keep the same reference as the inlet.`}
        error={errors.outlet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-gpm-outlet"
              inputMode="decimal"
              className={inputClass}
              value={draft.outlet}
              placeholder="Exit pressure"
              aria-invalid={Boolean(errors.outlet)}
              onChange={(event) => set({ outlet: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            value={draft.outletUnit}
            aria-label="Exit pressure unit"
            onChange={(event) => {
              const next = event.target.value as PressureUnit;
              set({
                outlet: convertPressureDraftValue(draft.outlet, draft.outletUnit, next),
                outletUnit: next,
              });
            }}
          >
            <option value="psi">psi</option>
            <option value="kPa">kPa</option>
            <option value="bar">bar</option>
            <option value="atm">atm</option>
            <option value="Pa">Pa</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Diameter of the pipe"
        htmlFor="psi-gpm-diameter"
        tip="Internal flow diameter (not nominal OD)."
        error={errors.diameter}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-gpm-diameter"
              inputMode="decimal"
              className={inputClass}
              value={draft.diameter}
              placeholder="Enter diameter"
              aria-invalid={Boolean(errors.diameter)}
              onChange={(event) =>
                set({ diameter: event.target.value, geometrySource: 'diameter' })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.lengthUnit}
            aria-label="Diameter unit"
            onChange={(event) => {
              const next = event.target.value as LengthUnit;
              set({
                diameter: convertLengthDraftValue(draft.diameter, draft.lengthUnit, next),
                lengthUnit: next,
              });
            }}
          >
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
            <option value="ft">ft</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Cross-sectional area of the pipe"
        htmlFor="psi-gpm-area"
        tip="A = πd²/4 for a circular section. Editing area updates diameter."
        error={errors.area}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-gpm-area"
              inputMode="decimal"
              className={inputClass}
              value={draft.area}
              placeholder="Calculated area"
              aria-invalid={Boolean(errors.area)}
              onChange={(event) =>
                set({ area: event.target.value, geometrySource: 'area' })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.areaUnit}
            aria-label="Area unit"
            onChange={(event) => {
              const next = event.target.value as AreaUnit;
              set({
                area: convertAreaDraftValue(draft.area, draft.areaUnit, next),
                areaUnit: next,
              });
            }}
          >
            <option value="mm2">mm²</option>
            <option value="cm2">cm²</option>
            <option value="m2">m²</option>
            <option value="in2">in²</option>
            <option value="ft2">ft²</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Flow rate in GPM"
        htmlFor="psi-gpm-flow"
        tip="Ideal model result. US liquid gallons by default."
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="psi-gpm-flow"
              readOnly
              className={inputClass}
              value={flowDisplay}
              placeholder="Calculated flow"
              aria-readonly="true"
            />
          </div>
          <select
            className={selectClass}
            value={draft.flowUnit}
            aria-label="Flow unit"
            onChange={(event) => set({ flowUnit: event.target.value as FlowUnit })}
          >
            <option value="usGpm">US gpm</option>
            <option value="Lmin">L/min</option>
            <option value="Ls">L/s</option>
            <option value="m3s">m³/s</option>
            <option value="m3h">m³/h</option>
            <option value="usGalH">US gal/h</option>
            <option value="impGpm">Imp gpm</option>
          </select>
        </div>
      </FieldShell>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldShell
          label="Fluid density"
          htmlFor="psi-gpm-density"
          tip="Default water ≈ 1000 kg/m³. Density varies with temperature."
          error={errors.density}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="psi-gpm-density"
                inputMode="decimal"
                className={inputClass}
                value={draft.density}
                onChange={(event) => set({ density: event.target.value })}
              />
            </div>
            <span className={`${selectClass} flex items-center`} aria-hidden="true">
              kg/m³
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Discharge coefficient Cd"
          htmlFor="psi-gpm-cd"
          tip="Ideal Cd = 1. Real openings often use Cd below 1."
          error={errors.cd}
        >
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-gpm-cd"
              inputMode="decimal"
              className={inputClass}
              value={draft.cd}
              onChange={(event) => set({ cd: event.target.value })}
            />
          </div>
        </FieldShell>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Pressure reference</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="pressure-ref"
              checked={draft.pressureReference === 'absolute'}
              onChange={() => set({ pressureReference: 'absolute' })}
            />
            Absolute (psia)
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="pressure-ref"
              checked={draft.pressureReference === 'gauge'}
              onChange={() => set({ pressureReference: 'gauge' })}
            />
            Gauge (psig)
          </label>
        </div>
      </fieldset>

      {result ? (
        <p className="text-xs text-muted-foreground">
          ΔP = {formatFlowNumber(result.deltaPPa)} Pa · v ≈{' '}
          {formatFlowNumber(result.velocityMs)} m/s · Q ≈ {formatFlowNumber(result.flowM3s)}{' '}
          m³/s · {result.pressureReference} reference
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
