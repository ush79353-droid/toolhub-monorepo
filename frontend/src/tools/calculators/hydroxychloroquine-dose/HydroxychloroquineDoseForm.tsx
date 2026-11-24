'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import type {
  DoseUnit,
  HydroxychloroquineDoseFieldErrors,
  HydroxychloroquineDoseInput,
  HydroxychloroquineDoseResult,
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

const LB_TO_KG = 0.45359237;

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

function formatMgPerKg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

interface Props {
  input: HydroxychloroquineDoseInput;
  errors: HydroxychloroquineDoseFieldErrors;
  result: HydroxychloroquineDoseResult | null;
  onChange: (input: HydroxychloroquineDoseInput) => void;
}

export function HydroxychloroquineDoseForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<HydroxychloroquineDoseInput>) =>
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

  const switchDoseUnit = (next: DoseUnit) => {
    if (next === input.doseUnit) return;
    const raw = input.dailyDoseText.trim().replace(/,/g, '');
    if (raw === '') {
      set({ doseUnit: next });
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      set({ doseUnit: next });
      return;
    }
    const mg = input.doseUnit === 'mg' ? n : n * 1000;
    const converted = next === 'mg' ? mg : mg / 1000;
    set({ doseUnit: next, dailyDoseText: formatConverted(converted) });
  };

  const showComparison =
    result != null &&
    result.band !== 'incomplete' &&
    result.mgPerKgPerDay != null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational regimen checker — not a prescription
        </p>
        <p className="mt-1.5 text-foreground/85">
          Enter actual body weight and a custom daily hydroxychloroquine sulfate
          dose to see mg/kg/day versus the FDA ≥5 mg/kg/day retinopathy
          threshold. This tool never invents a dose from weight alone.
        </p>
      </div>

      <section className={sectionClass} aria-label="Hydroxychloroquine dose inputs">
        <Field
          label="Weight"
          htmlFor="hcq-weight"
          error={errors.weightText}
          tooltip="Use actual body weight. FDA PLAQUENIL retinopathy risk wording uses actual body weight, not ideal body weight."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.weightText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="hcq-weight"
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
          label="Your custom daily dose"
          htmlFor="hcq-daily-dose"
          error={errors.dailyDoseText}
          tooltip="Enter the hydroxychloroquine sulfate amount (mg or g) already prescribed or under review. Comparison uses actual body weight mg/kg/day."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.dailyDoseText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="hcq-daily-dose"
              className={inputClass}
              value={input.dailyDoseText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.dailyDoseText)}
              onChange={(e) => set({ dailyDoseText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.doseUnit}
              aria-label="Daily dose unit"
              onChange={(e) => switchDoseUnit(e.target.value as DoseUnit)}
            >
              <option value="mg">mg</option>
              <option value="g">g</option>
            </select>
          </div>
        </Field>
      </section>

      <section
        className={sectionClass}
        aria-label="Hydroxychloroquine dose comparison"
        aria-live="polite"
      >
        {showComparison ? (
          <>
            <p className="text-sm font-semibold text-accent">
              {result.statusHeadline}
            </p>
            <p className="text-sm leading-relaxed text-accent">
              <span className="tabular-nums font-semibold">
                {formatMgPerKg(result.mgPerKgPerDay)} mg/kg/day
              </span>{' '}
              <span className="text-muted-foreground">
                (actual body weight) · threshold{' '}
                {result.thresholdMgPerKg} mg/kg/day
              </span>
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.absoluteRangeNote}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-accent">
              {result?.statusHeadline ??
                'Enter weight and your custom daily dose'}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result?.statusDetail ??
                'Results appear after both fields are filled. No dose is invented from weight alone.'}
            </p>
          </>
        )}
      </section>

      {result?.disclaimer ? (
        <p className="text-xs italic leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
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
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
