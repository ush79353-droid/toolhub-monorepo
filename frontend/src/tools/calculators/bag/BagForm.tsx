'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { BagDiagram } from './BagDiagram';
import {
  AREA_UNIT_LABELS,
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  createEmptyInput,
  type AreaUnit,
  type BagFieldErrors,
  type BagInput,
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

interface BagFormProps {
  input: BagInput;
  errors: BagFieldErrors;
  onChange: (next: BagInput) => void;
}

export function BagForm({ input, errors, onChange }: BagFormProps) {
  const set = (patch: Partial<BagInput>) => onChange({ ...input, ...patch });

  const switchDimUnit = (
    valueKey: 'height' | 'width' | 'depth',
    unitKey: 'heightUnit' | 'widthUnit' | 'depthUnit',
    next: LengthUnit,
  ) => {
    const raw = input[valueKey].trim();
    const n = Number(raw.replace(/,/g, ''));
    if (raw !== '' && Number.isFinite(n)) {
      set({
        [valueKey]: String(Number(convertLength(n, input[unitKey], next).toFixed(4))),
        [unitKey]: next,
      } as Partial<BagInput>);
      return;
    }
    set({ [unitKey]: next } as Partial<BagInput>);
  };

  const switchAllowanceUnit = (next: LengthUnit) => {
    const patch: Partial<BagInput> = { allowanceUnit: next };
    for (const key of ['sideSeamAllowance', 'topHemAllowance'] as const) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(convertLength(n, input.allowanceUnit, next).toFixed(4)),
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
        Estimate one rectangular fabric cut for a folded-bottom tote (flat or
        boxed corners). Finished size ≠ cutting size. Not a two-panel, lined, or
        handle-inclusive pattern.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (40×35×10 cm)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Desired bag size
        </h3>
        <BagDiagram boxCorners={input.boxCorners} />

        {(
          [
            ['height', 'heightUnit', 'Height (h)', 'Finished vertical height.', errors.height],
            ['width', 'widthUnit', 'Width (w)', 'Finished front width.', errors.width],
            [
              'depth',
              'depthUnit',
              'Depth (d)',
              'Finished gusset / boxed-bottom depth (front to back).',
              errors.depth,
            ],
          ] as const
        ).map(([valueKey, unitKey, label, tip, err]) => (
          <div key={valueKey}>
            <label className={labelClass} htmlFor={`bag-${valueKey}`}>
              {label}
              <InfoTooltip content={tip} />
            </label>
            <FieldShell error={err}>
              <input
                id={`bag-${valueKey}`}
                className={inputClass}
                inputMode="decimal"
                value={input[valueKey]}
                onChange={(e) => set({ [valueKey]: e.target.value })}
                aria-invalid={Boolean(err)}
              />
              <select
                aria-label={`${label} unit`}
                className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
                value={input[unitKey]}
                onChange={(e) =>
                  switchDimUnit(
                    valueKey,
                    unitKey,
                    e.target.value as LengthUnit,
                  )
                }
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {LENGTH_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Box corner</h3>
        <fieldset>
          <legend className={labelClass}>Box corners?</legend>
          <div className="flex gap-4">
            {(
              [
                [false, 'No'],
                [true, 'Yes'],
              ] as const
            ).map(([val, label]) => (
              <label
                key={label}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="bag-box"
                  className="h-4 w-4"
                  checked={input.boxCorners === val}
                  onChange={() => set({ boxCorners: val })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {!input.boxCorners ? (
          <p className="text-xs text-muted-foreground">
            Flat folded-bottom tote — entered depth is not used in the fabric
            cut until box corners are Yes.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Boxed-corner tote — depth is added into fabric width and height.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
          aria-expanded={input.showAdvanced}
        >
          Advanced settings
          <span className="text-muted-foreground">
            {input.showAdvanced ? '−' : '+'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelClass} htmlFor="bag-seam">
                Side seam allowance
                <InfoTooltip content="Allowance per side. Default 1 cm. Set 0 for geometric cut without sewing allowance." />
              </label>
              <FieldShell error={errors.sideSeamAllowance}>
                <input
                  id="bag-seam"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sideSeamAllowance}
                  onChange={(e) =>
                    set({ sideSeamAllowance: e.target.value })
                  }
                />
                <select
                  aria-label="Allowance unit"
                  className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
                  value={input.allowanceUnit}
                  onChange={(e) =>
                    switchAllowanceUnit(e.target.value as LengthUnit)
                  }
                >
                  {(['mm', 'cm', 'in'] as LengthUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {LENGTH_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.sideSeamAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.sideSeamAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="bag-hem">
                Top hem allowance
                <InfoTooltip content="Hem allowance at each opening edge of the folded piece. Default 2 cm." />
              </label>
              <FieldShell error={errors.topHemAllowance}>
                <input
                  id="bag-hem"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.topHemAllowance}
                  onChange={(e) => set({ topHemAllowance: e.target.value })}
                />
                <span className="pr-3 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.allowanceUnit]}
                </span>
              </FieldShell>
              {errors.topHemAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.topHemAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="bag-disp">
                Fabric result unit
              </label>
              <select
                id="bag-disp"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
                value={input.fabricDisplayUnit}
                onChange={(e) =>
                  set({
                    fabricDisplayUnit: e.target.value as LengthUnit,
                  })
                }
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {LENGTH_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="bag-area">
                Area unit
              </label>
              <select
                id="bag-area"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
                value={input.areaUnit}
                onChange={(e) =>
                  set({ areaUnit: e.target.value as AreaUnit })
                }
              >
                {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {AREA_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Defaults: side seam 1 cm · top hem 2 cm (open to edit).
          </p>
        )}
      </div>
    </form>
  );
}
