'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatGrams, formatKcal } from './calculation';
import type {
  ApprovedPolyolsAnswer,
  NetCarbsBasis,
  NetCarbsFieldErrors,
  NetCarbsInput,
  NetCarbsResult,
  UsaCanadaAnswer,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
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

interface FormProps {
  input: NetCarbsInput;
  errors: NetCarbsFieldErrors;
  result: NetCarbsResult | null;
  onChange: (input: NetCarbsInput) => void;
}

export function NetCarbsForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<NetCarbsInput>) => onChange({ ...input, ...patch });

  const amountUnit =
    input.basis === 'serving' ? 'g per serving' : 'g per 100 g';

  const netDisplay =
    result?.netCarbsG != null ? formatGrams(result.netCarbsG) : '';
  const mealNetDisplay =
    result?.totalNetCarbsG != null ? formatGrams(result.totalNetCarbsG) : '';
  const mealKcalDisplay =
    result?.caloriesFromNetCarbsKcal != null
      ? formatKcal(result.caloriesFromNetCarbsKcal)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Net carbs inputs">
        <fieldset>
          <legend className={labelClass}>
            Are you counting per serving or per 100g?
          </legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Serving basis"
          >
            {(
              [
                { value: 'serving', label: 'per serving' },
                { value: 'per100g', label: 'per 100 g' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="net-carbs-basis"
                  className="h-4 w-4 accent-primary"
                  checked={input.basis === opt.value}
                  onChange={() => set({ basis: opt.value as NetCarbsBasis })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Are you in the USA or Canada?
            <InfoTooltip
              label="USA or Canada label rules"
              text="US and Canadian Nutrition Facts include dietary fiber inside Total Carbohydrate. Many other regions already exclude fiber from the carbohydrate figure — subtracting fiber again would double-count."
            />
          </legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="USA or Canada"
          >
            {(
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="net-carbs-usa-canada"
                  className="h-4 w-4 accent-primary"
                  checked={input.usaCanada === opt.value}
                  onChange={() =>
                    set({ usaCanada: opt.value as UsaCanadaAnswer })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="net-carbs-total">
            Total carbohydrates
          </label>
          <FieldShell error={errors.totalCarbsText}>
            <input
              id="net-carbs-total"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalCarbsText}
              onChange={(e) => set({ totalCarbsText: e.target.value })}
              aria-invalid={Boolean(errors.totalCarbsText)}
            />
            <span className={unitFixed}>{amountUnit}</span>
          </FieldShell>
          {errors.totalCarbsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalCarbsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="net-carbs-fiber">
            Fiber
          </label>
          <FieldShell error={errors.fiberText}>
            <input
              id="net-carbs-fiber"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.fiberText}
              onChange={(e) => set({ fiberText: e.target.value })}
              aria-invalid={Boolean(errors.fiberText)}
            />
            <span className={unitFixed}>{amountUnit}</span>
          </FieldShell>
          {errors.fiberText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fiberText}</p>
          ) : input.usaCanada === 'no' ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Outside the US/Canada, fiber is not subtracted again (already
              excluded from the carbohydrate figure).
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="net-carbs-sugar-alcohol">
            Sugar alcohol
          </label>
          <FieldShell error={errors.sugarAlcoholText}>
            <input
              id="net-carbs-sugar-alcohol"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sugarAlcoholText}
              onChange={(e) => set({ sugarAlcoholText: e.target.value })}
              aria-invalid={Boolean(errors.sugarAlcoholText)}
            />
            <span className={unitFixed}>{amountUnit}</span>
          </FieldShell>
          {errors.sugarAlcoholText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sugarAlcoholText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="net-carbs-net">
            Net carbohydrates
          </label>
          <FieldShell muted>
            <input
              id="net-carbs-net"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={netDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>{amountUnit}</span>
          </FieldShell>
          {result?.statusDetail && result.netCarbsG != null ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>

      <CollapsibleSection
        title="I want to be more specific sugar types"
        open={input.sugarSpecificOpen}
        onToggle={() => set({ sugarSpecificOpen: !input.sugarSpecificOpen })}
      >
        <fieldset>
          <legend className={labelClass}>
            Does your product only contain sugars from either erythritol,
            xylitol, mannitol or lactitol?
            <InfoTooltip
              label="approved polyols"
              text="Erythritol, xylitol, mannitol, and lactitol are treated as fully non-digestible here (factor 1). Other or mixed sugar alcohols use a half deduction (factor ½) so partially absorbed polyols are not over-subtracted."
            />
          </legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Approved polyols only"
          >
            {(
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="net-carbs-polyols"
                  className="h-4 w-4 accent-primary"
                  checked={input.approvedPolyolsOnly === opt.value}
                  onChange={() =>
                    set({
                      approvedPolyolsOnly: opt.value as ApprovedPolyolsAnswer,
                    })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </CollapsibleSection>

      <CollapsibleSection
        title="How many net carbs were in my meal?"
        open={input.mealOpen}
        onToggle={() => set({ mealOpen: !input.mealOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="net-carbs-servings">
            Servings consumed
          </label>
          <FieldShell error={errors.servingsText}>
            <input
              id="net-carbs-servings"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.servingsText}
              onChange={(e) => set({ servingsText: e.target.value })}
              aria-invalid={Boolean(errors.servingsText)}
            />
          </FieldShell>
          {errors.servingsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.servingsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="net-carbs-meal-total">
            Total net carbohydrates
          </label>
          <FieldShell muted>
            <input
              id="net-carbs-meal-total"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={mealNetDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>g</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="net-carbs-meal-kcal">
            Calories from net carbs
          </label>
          <FieldShell muted>
            <input
              id="net-carbs-meal-kcal"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={mealKcalDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>kcal</span>
          </FieldShell>
        </div>
      </CollapsibleSection>
    </form>
  );
}
