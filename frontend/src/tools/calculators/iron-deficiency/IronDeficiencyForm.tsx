'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatMg,
  gPerDlToHemoglobinUnit,
  hemoglobinToGPerDl,
  kgToWeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  HemoglobinUnit,
  IronDeficiencyFieldErrors,
  IronDeficiencyInput,
  IronDeficiencyResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function formatSwitched(value: number, maxFrac: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

interface FormProps {
  input: IronDeficiencyInput;
  errors: IronDeficiencyFieldErrors;
  result: IronDeficiencyResult | null;
  onChange: (input: IronDeficiencyInput) => void;
}

export function IronDeficiencyForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<IronDeficiencyInput>) =>
    onChange({ ...input, ...patch });

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightText);
    let nextText = input.weightText;
    if (raw != null) {
      const kg = weightToKg(raw, input.weightUnit);
      nextText = formatSwitched(kgToWeight(kg, next), next === 'kg' ? 2 : 1);
    }
    set({ weightUnit: next, weightText: nextText });
  };

  const switchActualHb = (next: HemoglobinUnit) => {
    if (next === input.actualHemoglobinUnit) return;
    const raw = parseNumber(input.actualHemoglobinText);
    let nextText = input.actualHemoglobinText;
    if (raw != null) {
      const gdl = hemoglobinToGPerDl(raw, input.actualHemoglobinUnit);
      if (gdl != null) {
        nextText = formatSwitched(gPerDlToHemoglobinUnit(gdl, next), 2);
      }
    }
    set({ actualHemoglobinUnit: next, actualHemoglobinText: nextText });
  };

  const switchTargetHb = (next: HemoglobinUnit) => {
    if (next === input.targetHemoglobinUnit) return;
    const raw = parseNumber(input.targetHemoglobinText);
    let nextText = input.targetHemoglobinText;
    if (raw != null) {
      const gdl = hemoglobinToGPerDl(raw, input.targetHemoglobinUnit);
      if (gdl != null) {
        nextText = formatSwitched(gPerDlToHemoglobinUnit(gdl, next), 2);
      }
    }
    set({ targetHemoglobinUnit: next, targetHemoglobinText: nextText });
  };

  const storesDisplay =
    result?.ironStoresMg != null ? formatMg(result.ironStoresMg) : '';
  const deficitDisplay =
    result?.deficitMg != null ? formatMg(result.deficitMg) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section
        className={sectionClass}
        aria-label="Iron deficiency calculator inputs"
      >
        <div>
          <label className={labelClass} htmlFor="iron-def-weight">
            Weight
            <InfoTooltip text="Body weight used in the Ganzoni formula. Prefer ideal body weight when local protocols say so for overweight patients; this worksheet uses the value you enter. Physical mass is preserved when you switch units." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="iron-def-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) => switchWeight(e.target.value as WeightUnit)}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="iron-def-actual-hb">
            Actual hemoglobin
          </label>
          <FieldShell error={errors.actualHemoglobinText}>
            <input
              id="iron-def-actual-hb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.actualHemoglobinText}
              onChange={(e) => set({ actualHemoglobinText: e.target.value })}
              aria-invalid={Boolean(errors.actualHemoglobinText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Actual hemoglobin unit"
              value={input.actualHemoglobinUnit}
              onChange={(e) =>
                switchActualHb(e.target.value as HemoglobinUnit)
              }
            >
              <option value="g/dL">g/dL</option>
              <option value="g/L">g/L</option>
            </select>
          </FieldShell>
          {errors.actualHemoglobinText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.actualHemoglobinText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="iron-def-target-hb">
            Target hemoglobin
            <InfoTooltip text="Clinician-chosen target hemoglobin for the deficit estimate. Classic Ganzoni teaching often uses 15 g/dL when weight ≥35 kg and 13 g/dL when weight &lt;35 kg; pregnancy protocols may use lower targets. This field stays blank until you enter a value." />
          </label>
          <FieldShell error={errors.targetHemoglobinText}>
            <input
              id="iron-def-target-hb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.targetHemoglobinText}
              onChange={(e) => set({ targetHemoglobinText: e.target.value })}
              aria-invalid={Boolean(errors.targetHemoglobinText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Target hemoglobin unit"
              value={input.targetHemoglobinUnit}
              onChange={(e) =>
                switchTargetHb(e.target.value as HemoglobinUnit)
              }
            >
              <option value="g/dL">g/dL</option>
              <option value="g/L">g/L</option>
            </select>
          </FieldShell>
          {errors.targetHemoglobinText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetHemoglobinText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="iron-def-stores">
            Iron stores
            <InfoTooltip text="Weight-based iron depot allowance used in Ganzoni tables: 500 mg when weight ≥35 kg, or 15 mg per kg when weight is under 35 kg. Derived from weight; not a measured ferritin." />
          </label>
          <FieldShell muted>
            <input
              id="iron-def-stores"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={storesDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>mg</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="iron-def-deficit">
            Deficit
          </label>
          <FieldShell muted>
            <input
              id="iron-def-deficit"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={deficitDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>mg</span>
          </FieldShell>
          {result?.statusDetail ? (
            <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
