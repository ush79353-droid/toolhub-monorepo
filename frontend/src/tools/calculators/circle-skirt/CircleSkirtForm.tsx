'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { CircleSkirtDiagram } from './CircleSkirtDiagram';
import {
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  SKIRT_TYPE_LABELS,
  createEmptyInput,
  type CircleSkirtFieldErrors,
  type CircleSkirtInput,
  type CircleSkirtType,
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

interface CircleSkirtFormProps {
  input: CircleSkirtInput;
  errors: CircleSkirtFieldErrors;
  onChange: (next: CircleSkirtInput) => void;
}

export function CircleSkirtForm({
  input,
  errors,
  onChange,
}: CircleSkirtFormProps) {
  const set = (patch: Partial<CircleSkirtInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'waist',
      'skirtLength',
      'waistSeamAllowance',
      'hemAllowance',
      'fabricWidth',
    ] as const;
    const patch: Partial<CircleSkirtInput> = { unit: next };
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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Calculate waist radius and radial cutting length for circle skirts.
        Fabric yardage also depends on width and layout.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...createEmptyInput(),
              skirtType: 'half',
              waist: '75',
              skirtLength: '70',
            })
          }
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (half · 75×70 cm)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
          <h3 className="text-[13px] font-semibold text-accent">Type</h3>
          <fieldset>
            <legend className="sr-only">Circle skirt type</legend>
            <div className="flex flex-col gap-2">
              {(Object.keys(SKIRT_TYPE_LABELS) as CircleSkirtType[]).map(
                (t) => (
                  <label
                    key={t}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="skirt-type"
                      className="h-4 w-4"
                      checked={input.skirtType === t}
                      onChange={() => set({ skirtType: t })}
                    />
                    {SKIRT_TYPE_LABELS[t]}
                  </label>
                ),
              )}
            </div>
          </fieldset>
        </div>
        <CircleSkirtDiagram skirtType={input.skirtType} />
      </div>

      <div>
        <label className={labelClass} htmlFor="cs-unit">
          Units
        </label>
        <select
          id="cs-unit"
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
        <label className={labelClass} htmlFor="cs-waist">
          Waist
          <InfoTooltip content="Measure around the position where the skirt waistband will sit." />
        </label>
        <FieldShell error={errors.waist}>
          <input
            id="cs-waist"
            className={inputClass}
            inputMode="decimal"
            value={input.waist}
            onChange={(e) => set({ waist: e.target.value })}
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            {LENGTH_UNIT_LABELS[input.unit]}
          </span>
        </FieldShell>
        {errors.waist ? (
          <p className="mt-1 text-xs text-rose-600">{errors.waist}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="cs-len">
          Skirt length
          <InfoTooltip content="Desired finished length from waistline to hem — without hem allowance." />
        </label>
        <FieldShell error={errors.skirtLength}>
          <input
            id="cs-len"
            className={inputClass}
            inputMode="decimal"
            value={input.skirtLength}
            onChange={(e) => set({ skirtLength: e.target.value })}
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            {LENGTH_UNIT_LABELS[input.unit]}
          </span>
        </FieldShell>
        {errors.skirtLength ? (
          <p className="mt-1 text-xs text-rose-600">{errors.skirtLength}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showAdvanced}
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          Allowances &amp; fabric width (optional)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelClass} htmlFor="cs-seam">
                Waist seam allowance
              </label>
              <FieldShell error={errors.waistSeamAllowance}>
                <input
                  id="cs-seam"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.waistSeamAllowance}
                  onChange={(e) =>
                    set({ waistSeamAllowance: e.target.value })
                  }
                />
                <span className="border-l border-border px-2 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.unit]}
                </span>
              </FieldShell>
              {errors.waistSeamAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.waistSeamAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cs-hem">
                Hem allowance
              </label>
              <FieldShell error={errors.hemAllowance}>
                <input
                  id="cs-hem"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.hemAllowance}
                  onChange={(e) => set({ hemAllowance: e.target.value })}
                />
                <span className="border-l border-border px-2 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.unit]}
                </span>
              </FieldShell>
              {errors.hemAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.hemAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cs-fw">
                Fabric width (optional)
              </label>
              <FieldShell error={errors.fabricWidth}>
                <input
                  id="cs-fw"
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
                <p className="mt-1 text-xs text-rose-600">
                  {errors.fabricWidth}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                Checks a simplified single-piece layout — not a full marker plan.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
