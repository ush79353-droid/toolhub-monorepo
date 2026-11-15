'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  ASTM_E11_SIEVES,
  type CalculatorMode,
  type MeshToMicronFieldErrors,
  type MeshToMicronInput,
  type MeshToMicronResult,
  type WireDiameterUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MeshToMicronDraft {
  mode: CalculatorMode;
  sieveDesignation: string;
  meshCount: string;
  wireDiameter: string;
  wireUnit: WireDiameterUnit;
  reverseUm: string;
  advancedOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function draftToInput(draft: MeshToMicronDraft): MeshToMicronInput {
  return {
    mode: draft.mode,
    sieveDesignation: draft.sieveDesignation,
    meshCount: parseOptionalNumber(draft.meshCount),
    wireDiameter: parseOptionalNumber(draft.wireDiameter),
    wireUnit: draft.wireUnit,
    reverseUm: parseOptionalNumber(draft.reverseUm),
  };
}

interface MeshToMicronFormProps {
  draft: MeshToMicronDraft;
  errors: MeshToMicronFieldErrors;
  result: MeshToMicronResult | null;
  onDraftChange: (draft: MeshToMicronDraft) => void;
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

export function MeshToMicronForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: MeshToMicronFormProps) {
  const set = (patch: Partial<MeshToMicronDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Calculator mode"
        htmlFor="mesh-mode"
        tip="Standard uses ASTM E11 nominal openings. Custom needs mesh count and wire diameter. Reverse finds the nearest standard sieve for an entered opening."
      >
        <select
          id="mesh-mode"
          className={selectClass}
          value={draft.mode}
          onChange={(event) => set({ mode: event.target.value as CalculatorMode })}
        >
          <option value="standard">Standard sieve (ASTM E11)</option>
          <option value="custom">Custom woven mesh</option>
          <option value="reverse">Micron → nearest sieve</option>
        </select>
      </FieldShell>

      {draft.mode === 'standard' ? (
        <>
          <FieldShell
            label="Mesh / sieve size"
            htmlFor="mesh-sieve"
            tip="US Standard / ASTM E11 sieve designation. Result is the nominal opening, not a particle diameter."
            error={errors.sieve}
          >
            <select
              id="mesh-sieve"
              className={selectClass}
              value={draft.sieveDesignation}
              aria-invalid={Boolean(errors.sieve)}
              onChange={(event) => set({ sieveDesignation: event.target.value })}
            >
              {ASTM_E11_SIEVES.map((sieve) => (
                <option key={sieve.designation} value={sieve.designation}>
                  {sieve.label} — {sieve.openingUm} µm
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell
            label="Opening size in microns"
            htmlFor="mesh-um-out"
            tip="Nominal ASTM E11 opening for the selected sieve."
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30">
                <input
                  id="mesh-um-out"
                  readOnly
                  className={inputClass}
                  value={result && result.mode === 'standard' ? formatLength(result.openingUm) : ''}
                  placeholder="Select a sieve"
                  aria-readonly="true"
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                µm
              </span>
            </div>
          </FieldShell>
        </>
      ) : null}

      {draft.mode === 'custom' ? (
        <>
          <FieldShell
            label="Mesh count"
            htmlFor="mesh-count"
            tip="Openings per linear inch for a conventional square woven screen."
            error={errors.meshCount}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mesh-count"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.meshCount}
                  placeholder="e.g. 100"
                  aria-invalid={Boolean(errors.meshCount)}
                  onChange={(event) => set({ meshCount: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                /in
              </span>
            </div>
          </FieldShell>

          <FieldShell
            label="Wire diameter"
            htmlFor="mesh-wire"
            tip="Must be smaller than pitch (25.4 mm ÷ mesh count)."
            error={errors.wireDiameter}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mesh-wire"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.wireDiameter}
                  placeholder="e.g. 0.1"
                  aria-invalid={Boolean(errors.wireDiameter)}
                  onChange={(event) => set({ wireDiameter: event.target.value })}
                />
              </div>
              <select
                className={unitSelectClass}
                value={draft.wireUnit}
                aria-label="Wire diameter unit"
                onChange={(event) => set({ wireUnit: event.target.value as WireDiameterUnit })}
              >
                <option value="mm">mm</option>
                <option value="um">µm</option>
                <option value="in">in</option>
              </select>
            </div>
          </FieldShell>
        </>
      ) : null}

      {draft.mode === 'reverse' ? (
        <FieldShell
          label="Opening in micrometers"
          htmlFor="mesh-reverse-um"
          tip="Finds the nearest ASTM E11 nominal opening. Exact matches are labeled separately from nearest matches."
          error={errors.reverseUm}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mesh-reverse-um"
                inputMode="decimal"
                className={inputClass}
                value={draft.reverseUm}
                placeholder="e.g. 150"
                aria-invalid={Boolean(errors.reverseUm)}
                onChange={(event) => set({ reverseUm: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              µm
            </span>
          </div>
        </FieldShell>
      ) : null}

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.advancedOpen}
          onClick={() => set({ advancedOpen: !draft.advancedOpen })}
        >
          <span>Advanced conversion options</span>
          {draft.advancedOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.advancedOpen ? (
          result ? (
            <ul className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm">
              <li className="flex justify-between gap-2 tabular-nums text-accent">
                <span>Micrometers (µm)</span>
                <span className="font-medium">{formatLength(result.equivalents.um)}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums text-accent">
                <span>Millimeters (mm)</span>
                <span className="font-medium">{formatLength(result.equivalents.mm)}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums text-accent">
                <span>Centimeters (cm)</span>
                <span className="font-medium">{formatLength(result.equivalents.cm)}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums text-accent">
                <span>Inches (in)</span>
                <span className="font-medium">{formatLength(result.equivalents.in)}</span>
              </li>
              <li className="flex justify-between gap-2 tabular-nums text-accent">
                <span>Mils / thou</span>
                <span className="font-medium">{formatLength(result.equivalents.mil)}</span>
              </li>
              {result.pitchMm !== null ? (
                <li className="flex justify-between gap-2 tabular-nums text-accent">
                  <span>Pitch (mm)</span>
                  <span className="font-medium">{formatLength(result.pitchMm)}</span>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Enter or select values to see equivalent openings.
            </p>
          )
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
