'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertGlucoseValue,
  formatUnits,
  parseNumber,
} from './calculation';
import type {
  GlucoseUnit,
  InsulinDosageFieldErrors,
  InsulinDosageInput,
  InsulinDosageResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const suffixClass = 'shrink-0 pr-3 text-xs text-muted-foreground';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function Section({
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

interface InsulinDosageFormProps {
  input: InsulinDosageInput;
  errors: InsulinDosageFieldErrors;
  result: InsulinDosageResult | null;
  carbOpen: boolean;
  correctionOpen: boolean;
  onCarbOpenChange: (open: boolean) => void;
  onCorrectionOpenChange: (open: boolean) => void;
  onChange: (input: InsulinDosageInput) => void;
}

export function InsulinDosageForm({
  input,
  errors,
  result,
  carbOpen,
  correctionOpen,
  onCarbOpenChange,
  onCorrectionOpenChange,
  onChange,
}: InsulinDosageFormProps) {
  const set = (patch: Partial<InsulinDosageInput>) =>
    onChange({ ...input, ...patch });

  const changeGlucoseUnit = (next: GlucoseUnit) => {
    if (next === input.glucoseUnit) return;
    const convertField = (raw: string): string => {
      const n = parseNumber(raw);
      if (n == null) return raw;
      return formatUnits(convertGlucoseValue(n, input.glucoseUnit, next));
    };
    set({
      glucoseUnit: next,
      currentGlucose: convertField(input.currentGlucose),
      targetGlucose: convertField(input.targetGlucose),
      sensitivity: convertField(input.sensitivity),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Educational mealtime arithmetic only. Use ICR, target, and ISF from your
        clinician — sample field values are not personal prescriptions.
      </p>

      <label className="flex items-center gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          checked={input.knowTotalDailyDose}
          onChange={(e) => set({ knowTotalDailyDose: e.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        I know my total daily insulin dose!
      </label>

      {input.knowTotalDailyDose ? (
        <div className="space-y-2 rounded-xl border border-border bg-white p-3.5">
          <label className={labelClass} htmlFor="insulin-tdd">
            Total daily insulin dose
            <InfoTooltip text="Optional. Used only to show educational Rule of 500 / 1800 estimates — never auto-fills your ICR or ISF." />
          </label>
          <FieldShell error={errors.totalDailyDose}>
            <input
              id="insulin-tdd"
              className={inputClass}
              inputMode="decimal"
              value={input.totalDailyDose}
              onChange={(e) => set({ totalDailyDose: e.target.value })}
              aria-invalid={Boolean(errors.totalDailyDose)}
            />
            <span className={suffixClass}>units / day</span>
          </FieldShell>
          {errors.totalDailyDose ? (
            <p className="text-xs text-rose-600">{errors.totalDailyDose}</p>
          ) : null}
          {result?.suggestedCarbRatio != null &&
          result.suggestedSensitivityMgDl != null ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Educational estimate: ICR ≈ {formatUnits(result.suggestedCarbRatio)}{' '}
              g/unit · ISF ≈ {formatUnits(result.suggestedSensitivityMgDl)} mg/dL
              (Rule of 500 / 1800). Not applied automatically.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Enter TDD to preview Rule of 500 / 1800 estimates without changing
              your ratio or sensitivity fields.
            </p>
          )}
        </div>
      ) : null}

      <Section
        title="Carbohydrate coverage"
        open={carbOpen}
        onToggle={() => onCarbOpenChange(!carbOpen)}
      >
        <div>
          <label className={labelClass} htmlFor="insulin-carbs">
            Carbohydrate content
            <InfoTooltip text="Grams of carbohydrate in the meal or snack." />
          </label>
          <FieldShell error={errors.carbsGrams}>
            <input
              id="insulin-carbs"
              className={inputClass}
              inputMode="decimal"
              value={input.carbsGrams}
              onChange={(e) => set({ carbsGrams: e.target.value })}
              aria-invalid={Boolean(errors.carbsGrams)}
            />
            <span className={suffixClass}>g</span>
          </FieldShell>
          {errors.carbsGrams ? (
            <p className="mt-1 text-xs text-rose-600">{errors.carbsGrams}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="insulin-icr">
            Carbohydrate ratio
            <InfoTooltip text="Insulin-to-carb ratio: grams of carbohydrate covered by 1 unit. Sample educational value is 15 — replace with your care-plan ICR." />
          </label>
          <FieldShell error={errors.carbRatio}>
            <input
              id="insulin-icr"
              className={inputClass}
              inputMode="decimal"
              value={input.carbRatio}
              onChange={(e) => set({ carbRatio: e.target.value })}
              aria-invalid={Boolean(errors.carbRatio)}
            />
            <span className={suffixClass}>g / unit</span>
          </FieldShell>
          {errors.carbRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.carbRatio}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="insulin-carb-dose">
            Insulin dose to cover carbohydrates
          </label>
          <FieldShell muted>
            <input
              id="insulin-carb-dose"
              className={inputClass}
              readOnly
              value={result?.formattedCarbCoverage ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <span className={suffixClass}>units</span>
          </FieldShell>
        </div>
      </Section>

      <Section
        title="High blood sugar correction"
        open={correctionOpen}
        onToggle={() => onCorrectionOpenChange(!correctionOpen)}
      >
        <div>
          <label className={labelClass} htmlFor="insulin-current">
            Current blood glucose
          </label>
          <FieldShell error={errors.currentGlucose}>
            <input
              id="insulin-current"
              className={inputClass}
              inputMode="decimal"
              value={input.currentGlucose}
              onChange={(e) => set({ currentGlucose: e.target.value })}
              aria-invalid={Boolean(errors.currentGlucose)}
            />
            <select
              className={unitSelectClass}
              aria-label="Current glucose unit"
              value={input.glucoseUnit}
              onChange={(e) =>
                changeGlucoseUnit(e.target.value as GlucoseUnit)
              }
            >
              <option value="mg/dL">mg/dL</option>
              <option value="mmol/L">mmol/L</option>
            </select>
          </FieldShell>
          {errors.currentGlucose ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentGlucose}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="insulin-target">
            Target blood glucose
          </label>
          <FieldShell error={errors.targetGlucose}>
            <input
              id="insulin-target"
              className={inputClass}
              inputMode="decimal"
              value={input.targetGlucose}
              onChange={(e) => set({ targetGlucose: e.target.value })}
              aria-invalid={Boolean(errors.targetGlucose)}
            />
            <select
              className={unitSelectClass}
              aria-label="Target glucose unit"
              value={input.glucoseUnit}
              onChange={(e) =>
                changeGlucoseUnit(e.target.value as GlucoseUnit)
              }
            >
              <option value="mg/dL">mg/dL</option>
              <option value="mmol/L">mmol/L</option>
            </select>
          </FieldShell>
          {errors.targetGlucose ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetGlucose}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="insulin-isf">
            Insulin sensitivity factor
            <InfoTooltip text="How much 1 unit lowers glucose in the selected unit. Sample educational value is 50 mg/dL — replace with your care-plan ISF." />
          </label>
          <FieldShell error={errors.sensitivity}>
            <input
              id="insulin-isf"
              className={inputClass}
              inputMode="decimal"
              value={input.sensitivity}
              onChange={(e) => set({ sensitivity: e.target.value })}
              aria-invalid={Boolean(errors.sensitivity)}
            />
            <select
              className={unitSelectClass}
              aria-label="Sensitivity unit"
              value={input.glucoseUnit}
              onChange={(e) =>
                changeGlucoseUnit(e.target.value as GlucoseUnit)
              }
            >
              <option value="mg/dL">mg/dL</option>
              <option value="mmol/L">mmol/L</option>
            </select>
          </FieldShell>
          {errors.sensitivity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sensitivity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="insulin-corr-dose">
            Insulin dose to correct blood glucose
          </label>
          <FieldShell muted>
            <input
              id="insulin-corr-dose"
              className={inputClass}
              readOnly
              value={result?.formattedCorrection ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <span className={suffixClass}>units</span>
          </FieldShell>
        </div>
      </Section>

      <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <label className={labelClass} htmlFor="insulin-total">
          Total insulin dose
        </label>
        <FieldShell muted>
          <input
            id="insulin-total"
            className={inputClass}
            readOnly
            value={result?.formattedTotal ?? ''}
            tabIndex={-1}
            aria-live="polite"
          />
          <span className={suffixClass}>units</span>
        </FieldShell>
        {result?.notes.map((note) => (
          <p key={note} className="text-xs leading-relaxed text-amber-900">
            {note}
          </p>
        ))}
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          {result?.disclaimer ??
            'Always double-check the calculations, the dosing information, and contraindications on the leaflet. Consult your health provider before administering any medication.'}
        </p>
      </div>
    </form>
  );
}
