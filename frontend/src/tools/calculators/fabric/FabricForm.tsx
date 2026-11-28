'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength, convertMillimetersToUnit, convertLengthToMillimeters } from './calculation';
import {
  FABRIC_WIDTH_PRESETS_IN,
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  createEmptyInput,
  type FabricFieldErrors,
  type FabricInput,
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

interface FabricFormProps {
  input: FabricInput;
  errors: FabricFieldErrors;
  onChange: (next: FabricInput) => void;
}

export function FabricForm({ input, errors, onChange }: FabricFormProps) {
  const set = (patch: Partial<FabricInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'fabricWidth',
      'pieceWidth',
      'pieceLength',
      'cuttingGap',
      'edgeAllowance',
    ] as const;
    const patch: Partial<FabricInput> = { unit: next };
    for (const key of keys) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(convertLength(n, input.unit, next).toFixed(4)),
        );
      }
    }
    set(patch);
  };

  const applyPresetIn = (inches: number) => {
    const mm = convertLengthToMillimeters(inches, 'in');
    set({
      fabricWidth: String(
        Number(convertMillimetersToUnit(mm, input.unit).toFixed(4)),
      ),
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
        Estimate fabric length and yardage for identical rectangular pieces.
        Uniform-orientation layout only — not a guaranteed minimum-waste pack.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (60×12×18 in · 12 pcs)
        </button>
      </div>

      <div>
        <label className={labelClass} htmlFor="fab-unit">
          Units
        </label>
        <select
          id="fab-unit"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.unit}
          onChange={(e) => switchUnit(e.target.value as LengthUnit)}
        >
          {LENGTH_UNITS.map((u) => (
            <option key={u} value={u}>
              {LENGTH_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="fab-fw">
          Fabric width
          <InfoTooltip content="Usable cutting width of the fabric (before edge allowance)." />
        </label>
        <FieldShell error={errors.fabricWidth}>
          <input
            id="fab-fw"
            className={inputClass}
            inputMode="decimal"
            value={input.fabricWidth}
            onChange={(e) => set({ fabricWidth: e.target.value })}
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            {LENGTH_UNIT_LABELS[input.unit]}
          </span>
        </FieldShell>
        {errors.fabricWidth ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fabricWidth}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {FABRIC_WIDTH_PRESETS_IN.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => applyPresetIn(w)}
              className="rounded border border-border bg-white px-2 py-0.5 text-[11px] text-accent hover:bg-muted/30"
            >
              {w}&quot;
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="fab-pw">
            Piece width
          </label>
          <FieldShell error={errors.pieceWidth}>
            <input
              id="fab-pw"
              className={inputClass}
              inputMode="decimal"
              value={input.pieceWidth}
              onChange={(e) => set({ pieceWidth: e.target.value })}
            />
          </FieldShell>
          {errors.pieceWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pieceWidth}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="fab-pl">
            Piece length
          </label>
          <FieldShell error={errors.pieceLength}>
            <input
              id="fab-pl"
              className={inputClass}
              inputMode="decimal"
              value={input.pieceLength}
              onChange={(e) => set({ pieceLength: e.target.value })}
            />
          </FieldShell>
          {errors.pieceLength ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pieceLength}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="fab-n">
            Number of pieces
          </label>
          <FieldShell error={errors.numberOfPieces}>
            <input
              id="fab-n"
              className={inputClass}
              inputMode="numeric"
              value={input.numberOfPieces}
              onChange={(e) => set({ numberOfPieces: e.target.value })}
            />
          </FieldShell>
          {errors.numberOfPieces ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.numberOfPieces}
            </p>
          ) : null}
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={input.allowRotation}
          onChange={(e) => set({ allowRotation: e.target.checked })}
        />
        Allow 90° rotation
        <InfoTooltip content="Compares both uniform orientations and picks the shorter length. Grain, nap, and pattern may forbid rotation." />
      </label>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showAdvanced}
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          Advanced (gap, edge, shrinkage, extra)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="fab-gap">
                Cutting gap
              </label>
              <FieldShell error={errors.cuttingGap}>
                <input
                  id="fab-gap"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cuttingGap}
                  onChange={(e) => set({ cuttingGap: e.target.value })}
                />
              </FieldShell>
              {errors.cuttingGap ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.cuttingGap}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="fab-edge">
                Edge allowance (each side)
              </label>
              <FieldShell error={errors.edgeAllowance}>
                <input
                  id="fab-edge"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.edgeAllowance}
                  onChange={(e) => set({ edgeAllowance: e.target.value })}
                />
              </FieldShell>
              {errors.edgeAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.edgeAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="fab-sh">
                Shrinkage %
              </label>
              <FieldShell error={errors.shrinkagePercent}>
                <input
                  id="fab-sh"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.shrinkagePercent}
                  onChange={(e) =>
                    set({ shrinkagePercent: e.target.value })
                  }
                />
              </FieldShell>
              {errors.shrinkagePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.shrinkagePercent}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="fab-ex">
                Extra fabric %
              </label>
              <FieldShell error={errors.extraFabricPercent}>
                <input
                  id="fab-ex"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.extraFabricPercent}
                  onChange={(e) =>
                    set({ extraFabricPercent: e.target.value })
                  }
                />
              </FieldShell>
              {errors.extraFabricPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.extraFabricPercent}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
