'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  HeightUnit,
  PregnancyWeightGainFieldErrors,
  PregnancyWeightGainInput,
  PregnancyWeightGainResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

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

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface ExcessiveWeightGainFormProps {
  input: PregnancyWeightGainInput;
  errors: PregnancyWeightGainFieldErrors;
  result: PregnancyWeightGainResult | null;
  onChange: (input: PregnancyWeightGainInput) => void;
}

export function ExcessiveWeightGainForm({
  input,
  errors,
  result,
  onChange,
}: ExcessiveWeightGainFormProps) {
  const set = (patch: Partial<PregnancyWeightGainInput>) =>
    onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.height);
    if (raw != null && raw > 0) {
      const meters = heightToMeters(raw, input.heightUnit);
      set({
        heightUnit: next,
        height: formatField(metersToHeight(meters, next), 2),
      });
      return;
    }
    set({ heightUnit: next });
  };

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weight);
    if (raw != null && raw > 0) {
      const kg = weightToKg(raw, input.weightUnit);
      set({
        weightUnit: next,
        weight: formatField(kgToWeight(kg, next), 2),
      });
      return;
    }
    set({ weightUnit: next });
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

      <CollapsibleSection
        title="Before pregnancy"
        open={input.beforeOpen}
        onToggle={() => set({ beforeOpen: !input.beforeOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="ewg-height">
            Height
          </label>
          <FieldShell error={errors.height}>
            <input
              id="ewg-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height}
              onChange={(e) => set({ height: e.target.value })}
              aria-invalid={Boolean(errors.height)}
            />
            <select
              className={unitSelectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) =>
                switchHeightUnit(e.target.value as HeightUnit)
              }
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.height ? (
            <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ewg-weight">
            Weight
          </label>
          <FieldShell error={errors.weight}>
            <input
              id="ewg-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weight}
              onChange={(e) => set({ weight: e.target.value })}
              aria-invalid={Boolean(errors.weight)}
            />
            <select
              className={unitSelectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ewg-bmi">
            BMI
            <InfoTooltip text="BMI = weight (kg) ÷ height (m)² from your pre-pregnancy height and weight. Used only to choose the IOM gestational gain band." />
          </label>
          <FieldShell muted>
            <input
              id="ewg-bmi"
              className={inputClass}
              readOnly
              value={result?.formattedBmi ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
          </FieldShell>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.bmiCategoryLabel}
            </p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Weight during pregnancy"
        open={input.duringOpen}
        onToggle={() => set({ duringOpen: !input.duringOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="ewg-week">
            Week
          </label>
          <FieldShell error={errors.week}>
            <input
              id="ewg-week"
              className={inputClass}
              inputMode="decimal"
              value={input.week}
              onChange={(e) => set({ week: e.target.value })}
              aria-invalid={Boolean(errors.week)}
            />
          </FieldShell>
          {errors.week ? (
            <p className="mt-1 text-xs text-rose-600">{errors.week}</p>
          ) : null}
        </div>

        <div>
          <p className={labelClass} id="ewg-twins-label">
            Are you expecting twins?
          </p>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-labelledby="ewg-twins-label"
          >
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ewg-twins"
                className="h-4 w-4 accent-primary"
                checked={!input.twins}
                onChange={() => set({ twins: false })}
              />
              No
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ewg-twins"
                className="h-4 w-4 accent-primary"
                checked={input.twins}
                onChange={() => set({ twins: true })}
              />
              Yes
            </label>
          </div>
        </div>

        {result?.unavailableMessage ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950"
            role="status"
          >
            {result.unavailableMessage}
          </p>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="ewg-min-weight">
            Minimum weight
          </label>
          <FieldShell muted>
            <input
              id="ewg-min-weight"
              className={inputClass}
              readOnly
              value={result?.formattedMinWeight ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              aria-label="Minimum weight unit"
              value={input.resultWeightUnit}
              onChange={(e) =>
                set({ resultWeightUnit: e.target.value as WeightUnit })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ewg-max-weight">
            Maximum weight
          </label>
          <FieldShell muted>
            <input
              id="ewg-max-weight"
              className={inputClass}
              readOnly
              value={result?.formattedMaxWeight ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              aria-label="Maximum weight unit"
              value={input.resultWeightUnit}
              onChange={(e) =>
                set({ resultWeightUnit: e.target.value as WeightUnit })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ewg-min-gain">
            Minimum weight gain
          </label>
          <FieldShell muted>
            <input
              id="ewg-min-gain"
              className={inputClass}
              readOnly
              value={result?.formattedMinGain ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              aria-label="Minimum weight gain unit"
              value={input.resultGainUnit}
              onChange={(e) =>
                set({ resultGainUnit: e.target.value as WeightUnit })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ewg-max-gain">
            Maximum weight gain
          </label>
          <FieldShell muted>
            <input
              id="ewg-max-gain"
              className={inputClass}
              readOnly
              value={result?.formattedMaxGain ?? ''}
              tabIndex={-1}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              aria-label="Maximum weight gain unit"
              value={input.resultGainUnit}
              onChange={(e) =>
                set({ resultGainUnit: e.target.value as WeightUnit })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
        </div>

        {result?.availability === 'ok' ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        ) : null}
      </CollapsibleSection>
    </form>
  );
}
