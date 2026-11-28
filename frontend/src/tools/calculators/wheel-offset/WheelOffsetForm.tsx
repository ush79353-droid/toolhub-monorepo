'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import {
  LENGTH_UNIT_LABELS,
  OFFSET_UNITS,
  WIDTH_UNITS,
  createEmptyInput,
  type LengthUnit,
  type WheelOffsetFieldErrors,
  type WheelOffsetInput,
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

interface WheelOffsetFormProps {
  input: WheelOffsetInput;
  errors: WheelOffsetFieldErrors;
  onChange: (next: WheelOffsetInput) => void;
}

export function WheelOffsetForm({
  input,
  errors,
  onChange,
}: WheelOffsetFormProps) {
  const set = (patch: Partial<WheelOffsetInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (
    valueKey: keyof WheelOffsetInput,
    unitKey: 'currentWidthUnit' | 'currentOffsetUnit' | 'newWidthUnit' | 'newOffsetUnit',
    nextUnit: LengthUnit,
  ) => {
    const raw = String(input[valueKey]).trim();
    const n = Number(raw.replace(/,/g, ''));
    const from = input[unitKey];
    if (raw !== '' && Number.isFinite(n)) {
      const converted = convertLength(n, from, nextUnit);
      set({
        [valueKey]: String(Number(converted.toFixed(4))),
        [unitKey]: nextUnit,
      } as Partial<WheelOffsetInput>);
      return;
    }
    set({ [unitKey]: nextUnit } as Partial<WheelOffsetInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Compare current and replacement wheel width and offset (ET). Results are
        nominal rim-edge shifts relative to the hub-mounting plane — not a tire
        fitment guarantee.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (7.5″ ET45 → 8.5″ ET35)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Current wheel</h3>
        <div>
          <label className={labelClass} htmlFor="wo-cur-w">
            Current wheel width
            <InfoTooltip content="Enter the width of the wheel currently installed on your vehicle." />
          </label>
          <FieldShell error={errors.currentWidth}>
            <input
              id="wo-cur-w"
              className={inputClass}
              inputMode="decimal"
              value={input.currentWidth}
              onChange={(e) => set({ currentWidth: e.target.value })}
              aria-invalid={Boolean(errors.currentWidth)}
            />
            <select
              aria-label="Current width unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.currentWidthUnit}
              onChange={(e) =>
                switchUnit(
                  'currentWidth',
                  'currentWidthUnit',
                  e.target.value as LengthUnit,
                )
              }
            >
              {WIDTH_UNITS.map((u) => (
                <option key={u} value={u}>
                  {LENGTH_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.currentWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentWidth}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="wo-cur-et">
            Current wheel offset
            <InfoTooltip content="Enter the offset of your existing wheel. Positive, zero, and negative offsets are supported." />
          </label>
          <FieldShell error={errors.currentOffset}>
            <input
              id="wo-cur-et"
              className={inputClass}
              inputMode="decimal"
              value={input.currentOffset}
              onChange={(e) => set({ currentOffset: e.target.value })}
              aria-invalid={Boolean(errors.currentOffset)}
            />
            <select
              aria-label="Current offset unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.currentOffsetUnit}
              onChange={(e) =>
                switchUnit(
                  'currentOffset',
                  'currentOffsetUnit',
                  e.target.value as LengthUnit,
                )
              }
            >
              {OFFSET_UNITS.map((u) => (
                <option key={u} value={u}>
                  {LENGTH_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.currentOffset ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentOffset}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">New wheel</h3>
        <div>
          <label className={labelClass} htmlFor="wo-new-w">
            New wheel width
            <InfoTooltip content="Enter the width of the replacement wheel." />
          </label>
          <FieldShell error={errors.newWidth}>
            <input
              id="wo-new-w"
              className={inputClass}
              inputMode="decimal"
              value={input.newWidth}
              onChange={(e) => set({ newWidth: e.target.value })}
              aria-invalid={Boolean(errors.newWidth)}
            />
            <select
              aria-label="New width unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.newWidthUnit}
              onChange={(e) =>
                switchUnit(
                  'newWidth',
                  'newWidthUnit',
                  e.target.value as LengthUnit,
                )
              }
            >
              {WIDTH_UNITS.map((u) => (
                <option key={u} value={u}>
                  {LENGTH_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.newWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newWidth}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="wo-new-et">
            New wheel offset
            <InfoTooltip content="Enter the offset of the replacement wheel." />
          </label>
          <FieldShell error={errors.newOffset}>
            <input
              id="wo-new-et"
              className={inputClass}
              inputMode="decimal"
              value={input.newOffset}
              onChange={(e) => set({ newOffset: e.target.value })}
              aria-invalid={Boolean(errors.newOffset)}
            />
            <select
              aria-label="New offset unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.newOffsetUnit}
              onChange={(e) =>
                switchUnit(
                  'newOffset',
                  'newOffsetUnit',
                  e.target.value as LengthUnit,
                )
              }
            >
              {OFFSET_UNITS.map((u) => (
                <option key={u} value={u}>
                  {LENGTH_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.newOffset ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newOffset}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
