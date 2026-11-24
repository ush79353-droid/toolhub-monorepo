'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import { DISCLAIMER } from './calculation';
import type {
  FreshFrozenPlasmaDoseFieldErrors,
  FreshFrozenPlasmaDoseInput,
  FreshFrozenPlasmaDoseResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';
const unitAffixClass =
  'flex h-11 shrink-0 items-center border-l border-border px-3 text-sm font-medium text-primary';
const readonlyClass =
  'h-11 w-full min-w-0 flex-1 rounded-lg border border-border bg-muted/25 px-3 text-sm tabular-nums text-accent outline-none';

interface Props {
  input: FreshFrozenPlasmaDoseInput;
  errors: FreshFrozenPlasmaDoseFieldErrors;
  result: FreshFrozenPlasmaDoseResult | null;
  onChange: (input: FreshFrozenPlasmaDoseInput) => void;
}

const LB_TO_KG = 0.45359237;

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

function formatVolume(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    useGrouping: true,
  }).format(value);
}

function formatUnits(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
    useGrouping: false,
  }).format(value);
}

export function FreshFrozenPlasmaDoseForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<FreshFrozenPlasmaDoseInput>) =>
    onChange({ ...input, ...patch });

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = input.weightText.trim().replace(/,/g, '');
    if (raw === '') {
      set({ weightUnit: next });
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      set({ weightUnit: next });
      return;
    }
    const kg = input.weightUnit === 'kg' ? n : n * LB_TO_KG;
    const converted = next === 'kg' ? kg : kg / LB_TO_KG;
    set({ weightUnit: next, weightText: formatConverted(converted) });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="FFP dose inputs">
        <Field
          label="Patient weight"
          htmlFor="ffp-weight"
          error={errors.weightText}
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.weightText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ffp-weight"
              className={inputClass}
              value={input.weightText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.weightText)}
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.weightUnit}
              aria-label="Weight unit"
              onChange={(e) => switchWeightUnit(e.target.value as WeightUnit)}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </Field>

        <Field
          label="Unit volume"
          htmlFor="ffp-unit-volume"
          error={errors.unitVolumeText}
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.unitVolumeText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ffp-unit-volume"
              className={inputClass}
              value={input.unitVolumeText}
              inputMode="decimal"
              aria-invalid={Boolean(errors.unitVolumeText)}
              onChange={(e) => set({ unitVolumeText: e.target.value })}
            />
            <span className={unitAffixClass} aria-hidden>
              mL
            </span>
          </div>
        </Field>

        <Field
          label="Dose"
          htmlFor="ffp-dose"
          error={errors.doseMlPerKgText}
          tooltip="Ordered plasma dose in mL per kg body weight. AABB Circular cites a standard dose of ~15 mL/kg; pediatric plasma is often 10–15 mL/kg. Enter the rate specified for this patient."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.doseMlPerKgText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ffp-dose"
              className={inputClass}
              value={input.doseMlPerKgText}
              inputMode="decimal"
              aria-invalid={Boolean(errors.doseMlPerKgText)}
              onChange={(e) => set({ doseMlPerKgText: e.target.value })}
            />
            <span className={unitAffixClass} aria-label="milliliters per kilogram">
              mL/kg
            </span>
          </div>
        </Field>
      </section>

      <section
        className={sectionClass}
        aria-label="FFP dose results"
        aria-live="polite"
      >
        <Field label="Total plasma dose" htmlFor="ffp-total">
          <div className="flex h-11 items-center gap-0">
            <input
              id="ffp-total"
              className={readonlyClass}
              readOnly
              value={formatVolume(result?.totalPlasmaDoseMl ?? null)}
              aria-label="Total plasma dose in milliliters"
            />
            <span
              className="ml-2 flex h-11 shrink-0 items-center rounded-lg border border-border px-3 text-sm font-medium text-primary"
              aria-hidden
            >
              mL
            </span>
          </div>
        </Field>

        <Field label="Units needed" htmlFor="ffp-units">
          <input
            id="ffp-units"
            className={readonlyClass}
            readOnly
            value={formatUnits(result?.equivalentUnits ?? null)}
            aria-label="Equivalent plasma units (fractional, not an issue order)"
          />
          {result?.equivalentUnits != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Equivalent units (exact quotient) — not a blood-bank issue quantity.
              Do not round or ceil this value into a transfusion order.
            </p>
          ) : null}
        </Field>

        {result ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
            <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
          </div>
        ) : null}
      </section>

      <div
        role="note"
        className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-950 sm:text-sm"
      >
        {DISCLAIMER}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  tooltip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tooltip?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
        {tooltip ? (
          <InfoTooltip label={`${label} info`} text={tooltip} />
        ) : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
