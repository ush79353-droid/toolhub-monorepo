'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  metersToUsParts,
  parseNumber,
} from './calculation';
import type {
  HealthyWeightFieldErrors,
  HealthyWeightInput,
  HealthyWeightResult,
  UnitSystem,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const UNIT_TABS: { id: UnitSystem; label: string }[] = [
  { id: 'us', label: 'US Units' },
  { id: 'metric', label: 'Metric Units' },
];

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <span className="shrink-0 pr-3 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

interface FormProps {
  input: HealthyWeightInput;
  errors: HealthyWeightFieldErrors;
  result: HealthyWeightResult | null;
  onChange: (input: HealthyWeightInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function HealthyWeightForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: FormProps) {
  const set = (patch: Partial<HealthyWeightInput>) =>
    onChange({ ...input, ...patch });

  const switchSystem = (next: UnitSystem) => {
    if (next === input.unitSystem) return;
    if (input.unitSystem === 'metric' && next === 'us') {
      const cm = parseNumber(input.heightCm);
      if (cm != null && cm > 0) {
        const { ft, inches } = metersToUsParts(cm / 100);
        set({
          unitSystem: next,
          heightFt: String(ft),
          heightIn: String(Math.round(inches * 10) / 10),
        });
        return;
      }
    }
    if (input.unitSystem === 'us' && next === 'metric') {
      const ft = parseNumber(input.heightFt) ?? 0;
      const inches = parseNumber(input.heightIn) ?? 0;
      if (ft > 0 || inches > 0) {
        const m = (ft * 12 + inches) * 0.0254;
        set({
          unitSystem: next,
          heightCm: String(Math.round(m * 1000) / 10),
        });
        return;
      }
    }
    set({ unitSystem: next });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div
        className="flex rounded-lg border border-border bg-muted/30 p-1"
        role="tablist"
        aria-label="Unit system"
      >
        {UNIT_TABS.map((tab) => {
          const active = input.unitSystem === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-muted-foreground hover:text-accent'
              }`}
              onClick={() => switchSystem(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <section className={sectionClass} aria-label="Healthy weight inputs">
        <p className="text-xs text-muted-foreground">
          Modify the values and click the Calculate button to use.
        </p>

        {input.unitSystem === 'metric' ? (
          <div>
            <label className={labelClass} htmlFor="hw-height-cm">
              Height
            </label>
            <FieldShell error={errors.height} suffix="cm">
              <input
                id="hw-height-cm"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightCm}
                onChange={(e) => set({ heightCm: e.target.value })}
                aria-invalid={Boolean(errors.height)}
              />
            </FieldShell>
            {errors.height ? (
              <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <span className={labelClass}>Height</span>
            <div className="flex gap-2">
              <FieldShell error={errors.height} suffix="ft">
                <input
                  id="hw-height-ft"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.heightFt}
                  onChange={(e) => set({ heightFt: e.target.value })}
                  aria-label="Height feet"
                  aria-invalid={Boolean(errors.height)}
                />
              </FieldShell>
              <FieldShell error={errors.height} suffix="in">
                <input
                  id="hw-height-in"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.heightIn}
                  onChange={(e) => set({ heightIn: e.target.value })}
                  aria-label="Height inches"
                  aria-invalid={Boolean(errors.height)}
                />
              </FieldShell>
            </div>
            {errors.height ? (
              <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="submit"
            className="h-11 rounded-xl px-5 text-sm font-semibold"
          >
            Calculate
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-border px-5 text-sm font-semibold text-accent"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>

        {result ? (
          <div
            className="rounded-lg border border-sky-200 bg-sky-50/60 px-3.5 py-3"
            aria-live="polite"
          >
            <p className="text-[13px] font-semibold text-accent">
              {result.statusHeadline}
            </p>
            <p className="mt-1 text-sm tabular-nums text-accent">
              {result.formattedRange}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail} {result.disclaimer}
            </p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
