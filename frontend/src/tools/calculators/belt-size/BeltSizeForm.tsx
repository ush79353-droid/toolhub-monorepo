'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { getClothingOptions } from './chart-data';
import { BeltSizeDiagram } from './BeltSizeDiagram';
import {
  CATEGORY_LABELS,
  GENERAL_SIZES,
  LENGTH_UNIT_LABELS,
  METHOD_LABELS,
  createEmptyInput,
  type BeltSizeFieldErrors,
  type BeltSizeInput,
  type GeneralSize,
  type LengthUnit,
  type MeasurementMethod,
  type SizingCategory,
  type SizingSystem,
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

interface BeltSizeFormProps {
  input: BeltSizeInput;
  errors: BeltSizeFieldErrors;
  onChange: (next: BeltSizeInput) => void;
}

export function BeltSizeForm({
  input,
  errors,
  onChange,
}: BeltSizeFormProps) {
  const set = (patch: Partial<BeltSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (
    valueKey: 'numericalBeltSize' | 'waistCircumference' | 'existingBeltLength',
    unitKey: 'numericalUnit' | 'waistUnit' | 'existingUnit',
    next: LengthUnit,
  ) => {
    const raw = input[valueKey].trim();
    const n = Number(raw.replace(/,/g, ''));
    if (raw !== '' && Number.isFinite(n)) {
      set({
        [valueKey]: String(
          Number(convertLength(n, input[unitKey], next).toFixed(4)),
        ),
        [unitKey]: next,
      } as Partial<BeltSizeInput>);
      return;
    }
    set({ [unitKey]: next } as Partial<BeltSizeInput>);
  };

  const clothingOpts = getClothingOptions(
    input.sizingCategory,
    input.sizingSystem,
  );

  const systems: SizingSystem[] =
    input.sizingCategory === 'women'
      ? ['US', 'UK', 'EU', 'International']
      : ['US', 'UK', 'EU', 'International'];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate belt size from waist, clothing charts, or an existing belt.
        Woman/Man selects a conventional sizing chart — not an identity rule.
        Charts are approximate; brands vary.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...createEmptyInput(),
              sizingCategory: 'men',
              measurementMethod: 'dress-pants-size',
              clothingSize: '32',
              pantsWaistInches: '32',
              sizingSystem: 'US',
            })
          }
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (men · pants 32 → 34)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">I am a…</h3>
        <fieldset>
          <legend className="sr-only">Sizing chart category</legend>
          <div className="flex gap-4">
            {(Object.keys(CATEGORY_LABELS) as SizingCategory[]).map((c) => (
              <label
                key={c}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="belt-cat"
                  className="h-4 w-4"
                  checked={input.sizingCategory === c}
                  onChange={() => {
                    const opts = getClothingOptions(c, input.sizingSystem);
                    set({
                      sizingCategory: c,
                      clothingSize: opts[0]?.clothingSize ?? '',
                    });
                  }}
                />
                {CATEGORY_LABELS[c]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">I know my…</h3>
        <fieldset>
          <legend className="sr-only">Measurement method</legend>
          <div className="flex flex-col gap-2">
            {(Object.keys(METHOD_LABELS) as MeasurementMethod[]).map((m) => (
              <label
                key={m}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="belt-method"
                  className="h-4 w-4"
                  checked={input.measurementMethod === m}
                  onChange={() => set({ measurementMethod: m })}
                />
                {METHOD_LABELS[m]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">And it&apos;s…</h3>

        {input.measurementMethod === 'numerical-belt-size' ? (
          <div>
            <label className={labelClass} htmlFor="belt-num">
              Numerical belt size
              <InfoTooltip content="Enter a labeled numerical belt size (e.g. 34 in)." />
            </label>
            <FieldShell error={errors.numericalBeltSize}>
              <input
                id="belt-num"
                className={inputClass}
                inputMode="decimal"
                value={input.numericalBeltSize}
                onChange={(e) => set({ numericalBeltSize: e.target.value })}
              />
              <select
                aria-label="Numerical unit"
                className="h-full border-l border-border bg-muted/30 px-2 text-xs"
                value={input.numericalUnit}
                onChange={(e) =>
                  switchUnit(
                    'numericalBeltSize',
                    'numericalUnit',
                    e.target.value as LengthUnit,
                  )
                }
              >
                {(['in', 'cm'] as LengthUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {LENGTH_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.numericalBeltSize ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.numericalBeltSize}
              </p>
            ) : null}
          </div>
        ) : null}

        {input.measurementMethod === 'general-belt-size' ? (
          <div>
            <label className={labelClass} htmlFor="belt-gen">
              General belt size
            </label>
            <select
              id="belt-gen"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.generalBeltSize}
              onChange={(e) =>
                set({ generalBeltSize: e.target.value as GeneralSize })
              }
            >
              {GENERAL_SIZES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {input.measurementMethod === 'waist-circumference' ? (
          <div>
            <label className={labelClass} htmlFor="belt-waist">
              Waist circumference
              <InfoTooltip content="Measure around the position where you normally wear your belt." />
            </label>
            <FieldShell error={errors.waistCircumference}>
              <input
                id="belt-waist"
                className={inputClass}
                inputMode="decimal"
                value={input.waistCircumference}
                onChange={(e) => set({ waistCircumference: e.target.value })}
              />
              <select
                aria-label="Waist unit"
                className="h-full border-l border-border bg-muted/30 px-2 text-xs"
                value={input.waistUnit}
                onChange={(e) =>
                  switchUnit(
                    'waistCircumference',
                    'waistUnit',
                    e.target.value as LengthUnit,
                  )
                }
              >
                {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {LENGTH_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            <p className="mt-1 text-xs text-muted-foreground">
              Body measure — not the same as a pants waist label (+2 heuristic
              is not applied here).
            </p>
            {errors.waistCircumference ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.waistCircumference}
              </p>
            ) : null}
          </div>
        ) : null}

        {input.measurementMethod === 'existing-belt-length' ? (
          <div className="space-y-3">
            <BeltSizeDiagram />
            <div>
              <label className={labelClass} htmlFor="belt-exist">
                Length of existing belt
                <InfoTooltip content="Measure from the buckle fastening point (prong) to the hole you normally use — not tip-to-tip." />
              </label>
              <FieldShell error={errors.existingBeltLength}>
                <input
                  id="belt-exist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.existingBeltLength}
                  onChange={(e) =>
                    set({ existingBeltLength: e.target.value })
                  }
                />
                <select
                  aria-label="Existing belt unit"
                  className="h-full border-l border-border bg-muted/30 px-2 text-xs"
                  value={input.existingUnit}
                  onChange={(e) =>
                    switchUnit(
                      'existingBeltLength',
                      'existingUnit',
                      e.target.value as LengthUnit,
                    )
                  }
                >
                  {(['cm', 'in'] as LengthUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {LENGTH_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </FieldShell>
              {errors.existingBeltLength ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.existingBeltLength}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {input.measurementMethod === 'dress-pants-size' ? (
          <div className="space-y-3">
            <div>
              <label className={labelClass} htmlFor="belt-sys">
                Sizing system
              </label>
              <select
                id="belt-sys"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.sizingSystem}
                onChange={(e) => {
                  const sys = e.target.value as SizingSystem;
                  const opts = getClothingOptions(input.sizingCategory, sys);
                  set({
                    sizingSystem: sys,
                    clothingSize: opts[0]?.clothingSize ?? '',
                    pantsWaistInches:
                      opts[0]?.pantsWaistInches != null
                        ? String(opts[0].pantsWaistInches)
                        : input.pantsWaistInches,
                  });
                }}
              >
                {systems.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="belt-cloth">
                Clothing size
              </label>
              <select
                id="belt-cloth"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.clothingSize}
                onChange={(e) => {
                  const size = e.target.value;
                  const row = clothingOpts.find((o) => o.clothingSize === size);
                  set({
                    clothingSize: size,
                    pantsWaistInches:
                      row?.pantsWaistInches != null
                        ? String(row.pantsWaistInches)
                        : '',
                  });
                }}
              >
                {clothingOpts.map((o) => (
                  <option key={o.clothingSize} value={o.clothingSize}>
                    {o.clothingSize}
                    {o.pantsWaistInches != null
                      ? ` (waist ${o.pantsWaistInches})`
                      : ''}
                  </option>
                ))}
              </select>
              {errors.clothingSize ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.clothingSize}
                </p>
              ) : null}
            </div>
            {input.sizingCategory === 'men' &&
            (input.sizingSystem === 'US' || input.sizingSystem === 'UK') ? (
              <p className="text-xs text-muted-foreground">
                Men&apos;s US/UK pants labels use the conventional B ≈ P + 2 in
                heuristic.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Dress/clothing sizes map via approximate waist bands — not the
                pants +2 formula.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}
