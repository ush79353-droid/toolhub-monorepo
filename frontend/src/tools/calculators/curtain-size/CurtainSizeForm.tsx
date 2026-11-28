'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertCurtainMeasurementUnits,
  getRecommendedFullnessMultiplier,
} from './calculation';
import { CurtainSizeDiagram } from './CurtainSizeDiagram';
import {
  CURTAIN_TYPE_LABELS,
  FULLNESS_LABELS,
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  createEmptyInput,
  type CurtainFullness,
  type CurtainSizeFieldErrors,
  type CurtainSizeInput,
  type CurtainType,
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

interface CurtainSizeFormProps {
  input: CurtainSizeInput;
  errors: CurtainSizeFieldErrors;
  onChange: (next: CurtainSizeInput) => void;
}

export function CurtainSizeForm({
  input,
  errors,
  onChange,
}: CurtainSizeFormProps) {
  const set = (patch: Partial<CurtainSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'windowHeight',
      'windowWidth',
      'rodMountingHeight',
      'rodExtension',
      'extraLengthBelowSill',
      'rodHeightAboveFloor',
      'floorClearance',
      'puddlingLength',
    ] as const;
    const patch: Partial<CurtainSizeInput> = { unit: next };
    for (const key of keys) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(
            convertCurtainMeasurementUnits(n, input.unit, next).toFixed(4),
          ),
        );
      }
    }
    set(patch);
  };

  const panelsN = Number(input.numberOfPanels) || 2;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Recommend finished curtain length and flat width from window size,
        style, and fullness. These are finished dimensions — not fabric cutting
        sizes.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (150×120 cm · sill · deluxe)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-white p-3.5">
            <h3 className="mb-2 text-[13px] font-semibold text-accent">
              Type of curtain
            </h3>
            <fieldset>
              <legend className="sr-only">Curtain type</legend>
              <div className="flex flex-col gap-2">
                {(Object.keys(CURTAIN_TYPE_LABELS) as CurtainType[]).map(
                  (t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-2 text-sm text-accent"
                    >
                      <input
                        type="radio"
                        name="curtain-size-type"
                        className="h-4 w-4"
                        checked={input.curtainType === t}
                        onChange={() => set({ curtainType: t })}
                      />
                      {CURTAIN_TYPE_LABELS[t]}
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          </div>

          <div className="rounded-xl border border-border bg-white p-3.5">
            <h3 className="mb-2 text-[13px] font-semibold text-accent">
              Curtain fullness
            </h3>
            <fieldset>
              <legend className="sr-only">Curtain fullness</legend>
              <div className="flex flex-col gap-2">
                {(
                  ['standard', 'deluxe', 'ultra', 'custom'] as CurtainFullness[]
                ).map((f) => (
                  <label
                    key={f}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="curtain-size-fullness"
                      className="h-4 w-4"
                      checked={input.fullnessType === f}
                      onChange={() => {
                        const patch: Partial<CurtainSizeInput> = {
                          fullnessType: f,
                        };
                        if (f !== 'custom') {
                          patch.fullnessMultiplier = String(
                            getRecommendedFullnessMultiplier(f),
                          );
                        }
                        set(patch);
                      }}
                    />
                    {FULLNESS_LABELS[f]}
                    {f !== 'custom'
                      ? ` (${getRecommendedFullnessMultiplier(f)}×)`
                      : ''}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
        <CurtainSizeDiagram
          curtainType={input.curtainType}
          numberOfPanels={panelsN}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cs-full">
          Fullness multiplier
          <InfoTooltip content="Total flat curtain width ÷ effective rod width. Standard 1.5× · Deluxe 2× · Ultra 2.5×." />
        </label>
        <FieldShell error={errors.fullnessMultiplier}>
          <input
            id="cs-full"
            className={inputClass}
            inputMode="decimal"
            value={input.fullnessMultiplier}
            onChange={(e) =>
              set({
                fullnessMultiplier: e.target.value,
                fullnessType: 'custom',
              })
            }
          />
          <span className="border-l border-border px-2 text-xs text-muted-foreground">
            ×
          </span>
        </FieldShell>
        {errors.fullnessMultiplier ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.fullnessMultiplier}
          </p>
        ) : null}
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cs-wh">
            Window height
            <InfoTooltip content="Measure vertically from the top of the window opening to the bottom of the window sill." />
          </label>
          <FieldShell error={errors.windowHeight}>
            <input
              id="cs-wh"
              className={inputClass}
              inputMode="decimal"
              value={input.windowHeight}
              onChange={(e) => set({ windowHeight: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.windowHeight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.windowHeight}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cs-ww">
            Window width
            <InfoTooltip content="Measure the window horizontally from one side of the frame to the other." />
          </label>
          <FieldShell error={errors.windowWidth}>
            <input
              id="cs-ww"
              className={inputClass}
              inputMode="decimal"
              value={input.windowWidth}
              onChange={(e) => set({ windowWidth: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.windowWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.windowWidth}</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showAdvanced}
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          Advanced (rod, panels, café, floor)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="cs-mount">
                Rod height above window
              </label>
              <FieldShell error={errors.rodMountingHeight}>
                <input
                  id="cs-mount"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.rodMountingHeight}
                  onChange={(e) => set({ rodMountingHeight: e.target.value })}
                />
              </FieldShell>
              {errors.rodMountingHeight ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.rodMountingHeight}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cs-ext">
                Rod extension each side
              </label>
              <FieldShell error={errors.rodExtension}>
                <input
                  id="cs-ext"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.rodExtension}
                  onChange={(e) => set({ rodExtension: e.target.value })}
                />
              </FieldShell>
              {errors.rodExtension ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.rodExtension}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cs-below">
                Extra length below sill
              </label>
              <FieldShell error={errors.extraLengthBelowSill}>
                <input
                  id="cs-below"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.extraLengthBelowSill}
                  onChange={(e) =>
                    set({ extraLengthBelowSill: e.target.value })
                  }
                />
              </FieldShell>
              {errors.extraLengthBelowSill ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.extraLengthBelowSill}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cs-panels">
                Number of panels
              </label>
              <FieldShell error={errors.numberOfPanels}>
                <input
                  id="cs-panels"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.numberOfPanels}
                  onChange={(e) => set({ numberOfPanels: e.target.value })}
                />
              </FieldShell>
              {errors.numberOfPanels ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.numberOfPanels}
                </p>
              ) : null}
            </div>
            {input.curtainType === 'cafe' ? (
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="cs-cafe">
                  Café coverage ratio (0–1)
                  <InfoTooltip content="Fraction of window height covered. Default 0.5. Rod assumed at top of covered area." />
                </label>
                <FieldShell error={errors.cafeCoverageRatio}>
                  <input
                    id="cs-cafe"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.cafeCoverageRatio}
                    onChange={(e) =>
                      set({ cafeCoverageRatio: e.target.value })
                    }
                  />
                </FieldShell>
                {errors.cafeCoverageRatio ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.cafeCoverageRatio}
                  </p>
                ) : null}
              </div>
            ) : null}
            {input.curtainType === 'extra-long' ? (
              <>
                <div>
                  <label className={labelClass} htmlFor="cs-floorh">
                    Rod height above floor
                    <InfoTooltip content="Required for floor-length curtains — window height alone is not enough." />
                  </label>
                  <FieldShell error={errors.rodHeightAboveFloor}>
                    <input
                      id="cs-floorh"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.rodHeightAboveFloor}
                      onChange={(e) =>
                        set({ rodHeightAboveFloor: e.target.value })
                      }
                    />
                  </FieldShell>
                  {errors.rodHeightAboveFloor ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.rodHeightAboveFloor}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="cs-clear">
                    Floor clearance
                  </label>
                  <FieldShell error={errors.floorClearance}>
                    <input
                      id="cs-clear"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.floorClearance}
                      onChange={(e) =>
                        set({ floorClearance: e.target.value })
                      }
                    />
                  </FieldShell>
                  {errors.floorClearance ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.floorClearance}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className={labelClass} htmlFor="cs-puddle">
                    Puddling length
                  </label>
                  <FieldShell error={errors.puddlingLength}>
                    <input
                      id="cs-puddle"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.puddlingLength}
                      onChange={(e) =>
                        set({ puddlingLength: e.target.value })
                      }
                    />
                  </FieldShell>
                  {errors.puddlingLength ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.puddlingLength}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {input.curtainType === 'extra-long' && !input.showAdvanced ? (
        <div>
          <label className={labelClass} htmlFor="cs-floorh-main">
            Rod height above floor
            <InfoTooltip content="Required for extra-long curtains." />
          </label>
          <FieldShell error={errors.rodHeightAboveFloor}>
            <input
              id="cs-floorh-main"
              className={inputClass}
              inputMode="decimal"
              value={input.rodHeightAboveFloor}
              onChange={(e) => set({ rodHeightAboveFloor: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.rodHeightAboveFloor ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.rodHeightAboveFloor}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
