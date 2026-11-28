'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertCircumferenceFromCm,
  convertCircumferenceToCm,
  convertHeightFromCm,
  convertHeightToCm,
} from './calculation';
import { JacketMeasureDiagram } from './JacketMeasureDiagram';
import {
  CATEGORY_LABELS,
  CIRC_UNIT_LABELS,
  FIT_LABELS,
  HEIGHT_UNIT_LABELS,
  REGION_LABELS,
  STYLE_LABELS,
  createEmptyInput,
  type CircumferenceUnit,
  type FitPreference,
  type HeightUnit,
  type JacketSizeFieldErrors,
  type JacketSizeInput,
  type JacketSizingCategory,
  type JacketStyle,
  type SizeRegion,
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

interface JacketSizeFormProps {
  input: JacketSizeInput;
  errors: JacketSizeFieldErrors;
  onChange: (next: JacketSizeInput) => void;
}

export function JacketSizeForm({
  input,
  errors,
  onChange,
}: JacketSizeFormProps) {
  const set = (patch: Partial<JacketSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = input.height.trim();
    const n = Number(raw.replace(/,/g, ''));
    const inchesPart = Number(input.heightInchesPart.replace(/,/g, '')) || 0;
    const patch: Partial<JacketSizeInput> = {
      heightUnit: next,
      heightInchesPart: next === 'ft' ? input.heightInchesPart || '0' : '0',
    };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertHeightToCm(
        n,
        input.heightUnit,
        input.heightUnit === 'ft' ? inchesPart : 0,
      );
      if (next === 'ft') {
        const totalIn = cm / 2.54;
        const ft = Math.floor(totalIn / 12);
        const inch = Math.round(totalIn - ft * 12);
        patch.height = String(ft);
        patch.heightInchesPart = String(inch);
      } else {
        patch.height = String(
          Number(convertHeightFromCm(cm, next).toFixed(next === 'm' ? 2 : 1)),
        );
      }
    }
    set(patch);
  };

  const switchChestUnit = (next: CircumferenceUnit) => {
    if (next === input.chestUnit) return;
    const raw = input.chest.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<JacketSizeInput> = { chestUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertCircumferenceToCm(n, input.chestUnit);
      patch.chest = String(
        Number(convertCircumferenceFromCm(cm, next).toFixed(1)),
      );
    }
    set(patch);
  };

  const switchHipsUnit = (next: CircumferenceUnit) => {
    if (next === input.hipsUnit) return;
    const raw = input.hips.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<JacketSizeInput> = { hipsUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertCircumferenceToCm(n, input.hipsUnit);
      patch.hips = String(
        Number(convertCircumferenceFromCm(cm, next).toFixed(1)),
      );
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
        Estimate jacket size from chest circumference and height. Charts are
        illustrative — brands vary. Sizing category is a chart choice, not an
        identity label.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (100 cm chest · men)
        </button>
      </div>

      <fieldset>
        <legend className={labelClass}>Jacket sizing</legend>
        <div className="flex flex-wrap gap-2">
          {(['men', 'women'] as const).map((c) => (
            <label
              key={c}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                input.category === c
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="jacket-category"
                checked={input.category === c}
                onChange={() => set({ category: c as JacketSizingCategory })}
                className="accent-primary"
              />
              {CATEGORY_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="jk-height" className={labelClass}>
          Height
          <InfoTooltip content="Used for short / regular / long length guidance." />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.height}>
            <input
              id="jk-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.height}
              onFocus={() => set({ focusedField: 'height' })}
              onBlur={() => set({ focusedField: null })}
              onChange={(e) => set({ height: e.target.value })}
            />
          </FieldShell>
          {input.heightUnit === 'ft' ? (
            <FieldShell>
              <input
                aria-label="Height inches"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightInchesPart}
                onChange={(e) => set({ heightInchesPart: e.target.value })}
                placeholder="in"
              />
            </FieldShell>
          ) : null}
          <select
            aria-label="Height unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.heightUnit}
            onChange={(e) => switchHeightUnit(e.target.value as HeightUnit)}
          >
            {(Object.keys(HEIGHT_UNIT_LABELS) as HeightUnit[]).map((u) => (
              <option key={u} value={u}>
                {HEIGHT_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.height ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.height}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Optional for chest size; needed for length classification.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="jk-chest" className={labelClass}>
          Chest circumference
          <InfoTooltip content="Full circumference around the fullest part of the chest — not flat width." />
        </label>
        <p className="mb-1.5 text-[11px] text-muted-foreground">
          Measure around the fullest part of your chest, keeping the measuring
          tape level.
        </p>
        <div className="flex gap-2">
          <FieldShell error={errors.chest}>
            <input
              id="jk-chest"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.chest}
              onFocus={() => set({ focusedField: 'chest' })}
              onBlur={() => set({ focusedField: null })}
              onChange={(e) => set({ chest: e.target.value })}
            />
          </FieldShell>
          <select
            aria-label="Chest unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.chestUnit}
            onChange={(e) =>
              switchChestUnit(e.target.value as CircumferenceUnit)
            }
          >
            {(Object.keys(CIRC_UNIT_LABELS) as CircumferenceUnit[]).map((u) => (
              <option key={u} value={u}>
                {CIRC_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.chest ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.chest}
          </p>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          {input.showAdvanced ? 'Hide' : 'Show'} advanced (hips · fit · style ·
          region)
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/10 p-3">
            <div>
              <label htmlFor="jk-hips" className={labelClass}>
                Hip circumference
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.hips}>
                  <input
                    id="jk-hips"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.hips}
                    onFocus={() => set({ focusedField: 'hips' })}
                    onBlur={() => set({ focusedField: null })}
                    onChange={(e) => set({ hips: e.target.value })}
                  />
                </FieldShell>
                <select
                  aria-label="Hips unit"
                  className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.hipsUnit}
                  onChange={(e) =>
                    switchHipsUnit(e.target.value as CircumferenceUnit)
                  }
                >
                  {(Object.keys(CIRC_UNIT_LABELS) as CircumferenceUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {CIRC_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label htmlFor="jk-fit" className={labelClass}>
                  Fit preference
                </label>
                <select
                  id="jk-fit"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.fitPreference}
                  onChange={(e) =>
                    set({ fitPreference: e.target.value as FitPreference })
                  }
                >
                  {(Object.keys(FIT_LABELS) as FitPreference[]).map((f) => (
                    <option key={f} value={f}>
                      {FIT_LABELS[f]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jk-style" className={labelClass}>
                  Jacket style
                </label>
                <select
                  id="jk-style"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.jacketStyle}
                  onChange={(e) =>
                    set({ jacketStyle: e.target.value as JacketStyle })
                  }
                >
                  {(Object.keys(STYLE_LABELS) as JacketStyle[]).map((s) => (
                    <option key={s} value={s}>
                      {STYLE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jk-region" className={labelClass}>
                  Preferred region
                </label>
                <select
                  id="jk-region"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.preferredRegion}
                  onChange={(e) =>
                    set({ preferredRegion: e.target.value as SizeRegion })
                  }
                >
                  {(Object.keys(REGION_LABELS) as SizeRegion[]).map((r) => (
                    <option key={r} value={r}>
                      {REGION_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showMeasureHelp: !input.showMeasureHelp })}
        >
          {input.showMeasureHelp ? 'Hide' : 'Show'} measuring guide
        </button>
        {input.showMeasureHelp ? (
          <div className="mt-2">
            <JacketMeasureDiagram highlight={input.focusedField} />
          </div>
        ) : null}
      </div>
    </form>
  );
}
