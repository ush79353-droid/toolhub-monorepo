'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cmToHeightUnit,
  heightToCm,
  kgToWeightUnit,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  BsaUnit,
  CoUnit,
  HeightUnit,
  StrokeVolumeFieldErrors,
  StrokeVolumeInput,
  StrokeVolumeResult,
  SvUnit,
  WeightUnit,
} from './types';
import {
  BSA_UNIT_LABELS,
  CO_UNIT_LABELS,
  HEIGHT_UNIT_LABELS,
  SV_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function formatSwitch(value: number, digits: number): string {
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: StrokeVolumeInput;
  errors: StrokeVolumeFieldErrors;
  result: StrokeVolumeResult;
  onChange: (input: StrokeVolumeInput) => void;
  onLoadExample: () => void;
}

export function StrokeVolumeForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<StrokeVolumeInput>) =>
    onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.heightValue);
    let nextValue = input.heightValue;
    if (raw != null && raw > 0) {
      const cm = heightToCm(raw, input.heightUnit);
      nextValue = formatSwitch(
        cmToHeightUnit(cm, next),
        next === 'in' ? 2 : 1
      );
    }
    set({ heightUnit: next, heightValue: nextValue });
  };

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightValue);
    let nextValue = input.weightValue;
    if (raw != null && raw > 0) {
      const kg = weightToKg(raw, input.weightUnit);
      nextValue = formatSwitch(
        kgToWeightUnit(kg, next),
        next === 'lb' ? 1 : 2
      );
    }
    set({ weightUnit: next, weightValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational stroke volume from cardiac output and heart rate, with
        Mosteller BSA and indexed values.{' '}
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

      <CollapsibleSection
        title="Stroke volume"
        open={input.strokeVolumeOpen}
        onToggle={() => set({ strokeVolumeOpen: !input.strokeVolumeOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Cardiac output</span>
            <InfoTooltip text="Volume of blood pumped per minute. SV (mL) = 1000 × CO (L/min) ÷ HR (bpm)." />
          </div>
          <FieldShell error={errors.cardiacOutput}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.cardiacOutput}
              aria-label="Cardiac output"
              aria-invalid={Boolean(errors.cardiacOutput)}
              onChange={(e) => set({ cardiacOutput: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Cardiac output unit"
              value={input.coUnit}
              onChange={(e) => set({ coUnit: e.target.value as CoUnit })}
            >
              {(Object.keys(CO_UNIT_LABELS) as CoUnit[]).map((u) => (
                <option key={u} value={u}>
                  {CO_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.cardiacOutput ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cardiacOutput}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Heart rate</span>
            <InfoTooltip text="Beats per minute. Must be positive — zero heart rate is rejected." />
          </div>
          <FieldShell error={errors.heartRateBpm}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.heartRateBpm}
              aria-label="Heart rate"
              aria-invalid={Boolean(errors.heartRateBpm)}
              onChange={(e) => set({ heartRateBpm: e.target.value })}
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
          {errors.heartRateBpm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heartRateBpm}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Stroke volume</span>
            <InfoTooltip text="Volume ejected per beat. Fills when cardiac output and heart rate are valid." />
          </div>
          <FieldShell muted>
            <input
              className={inputClass}
              readOnly
              value={result.formattedSv}
              aria-label="Stroke volume result"
              tabIndex={-1}
            />
            <select
              className={selectClass}
              aria-label="Stroke volume unit"
              value={input.svUnit}
              onChange={(e) => set({ svUnit: e.target.value as SvUnit })}
            >
              {(Object.keys(SV_UNIT_LABELS) as SvUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SV_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Body surface area"
        open={input.bsaOpen}
        onToggle={() => set({ bsaOpen: !input.bsaOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Height</span>
            <InfoTooltip text="Used with weight for Mosteller BSA √(cm × kg / 3600)." />
          </div>
          <FieldShell error={errors.heightValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.heightValue}
              aria-label="Height"
              aria-invalid={Boolean(errors.heightValue)}
              onChange={(e) => set({ heightValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) =>
                switchHeightUnit(e.target.value as HeightUnit)
              }
            >
              {(Object.keys(HEIGHT_UNIT_LABELS) as HeightUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HEIGHT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Weight</span>
            <InfoTooltip text="Used with height for Mosteller BSA. Physical mass is preserved when switching units." />
          </div>
          <FieldShell error={errors.weightValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.weightValue}
              aria-label="Weight"
              aria-invalid={Boolean(errors.weightValue)}
              onChange={(e) => set({ weightValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
              }
            >
              {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
                <option key={u} value={u}>
                  {WEIGHT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Body surface area</span>
            <InfoTooltip text="Mosteller √(height_cm × weight_kg / 3600). Fills when height and weight are valid." />
          </div>
          <FieldShell muted>
            <input
              className={inputClass}
              readOnly
              value={result.formattedBsa}
              aria-label="Body surface area result"
              tabIndex={-1}
            />
            <select
              className={selectClass}
              aria-label="Body surface area unit"
              value={input.bsaUnit}
              onChange={(e) => set({ bsaUnit: e.target.value as BsaUnit })}
            >
              {(Object.keys(BSA_UNIT_LABELS) as BsaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {BSA_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Indices"
        open={input.indicesOpen}
        onToggle={() => set({ indicesOpen: !input.indicesOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Cardiac index</span>
            <InfoTooltip text="CI = cardiac output ÷ BSA. Fills when both CO and BSA are available." />
          </div>
          <FieldShell muted>
            <input
              className={inputClass}
              readOnly
              value={result.formattedCi}
              aria-label="Cardiac index result"
              tabIndex={-1}
            />
            <span className={unitFixed}>L/(min·m²)</span>
          </FieldShell>
        </div>

        <div>
          <div className={labelClass}>
            <span>Stroke volume index</span>
            <InfoTooltip text="SVI = stroke volume ÷ BSA. Fills when both SV and BSA are available." />
          </div>
          <FieldShell muted>
            <input
              className={inputClass}
              readOnly
              value={result.formattedSvi}
              aria-label="Stroke volume index result"
              tabIndex={-1}
            />
            <span className={unitFixed}>mL/m²</span>
          </FieldShell>
        </div>

        {result.explanation ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation} {result.disclaimer}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter cardiac output and heart rate for stroke volume; height and
            weight for BSA. Indices appear when both sides are ready.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
