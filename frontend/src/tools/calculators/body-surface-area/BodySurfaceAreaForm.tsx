'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type {
  BodySurfaceAreaFieldErrors,
  BodySurfaceAreaInput,
  BodySurfaceAreaResult,
  Sex,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'lb', label: 'pounds' },
  { value: 'kg', label: 'kilograms' },
];

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

interface FormProps {
  input: BodySurfaceAreaInput;
  errors: BodySurfaceAreaFieldErrors;
  result: BodySurfaceAreaResult | null;
  onChange: (input: BodySurfaceAreaInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function BodySurfaceAreaForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: FormProps) {
  const set = (patch: Partial<BodySurfaceAreaInput>) =>
    onChange({ ...input, ...patch });

  const setSex = (sex: Sex) => set({ sex });

  const editImperial = (patch: Partial<BodySurfaceAreaInput>) =>
    set({
      ...patch,
      heightSource: 'imperial',
      heightCm: '',
    });

  const editMetric = (cm: string) =>
    set({
      heightCm: cm,
      heightSource: 'metric',
      heightFt: '',
      heightIn: '',
    });

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
      <section className={sectionClass} aria-label="Body surface area inputs">
        <p className="text-xs text-muted-foreground">
          Modify the values and click the Calculate button to use.
        </p>

        <fieldset>
          <legend className={labelClass}>Gender</legend>
          <div className="flex flex-wrap gap-4">
            {([
              ['male', 'male'],
              ['female', 'female'],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="bsa-net-sex"
                  checked={input.sex === value}
                  onChange={() => setSex(value)}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="bsa-net-weight">
            Body Weight
          </label>
          <FieldShell error={errors.weight}>
            <input
              id="bsa-net-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weight)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit })
              }
              aria-label="Weight unit"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>Body Height</span>
          <div className="flex gap-2">
            <FieldShell error={errors.height}>
              <input
                id="bsa-net-height-ft"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightFt}
                onChange={(e) => editImperial({ heightFt: e.target.value })}
                aria-label="Height feet"
                aria-invalid={Boolean(errors.height)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                feet
              </span>
            </FieldShell>
            <FieldShell error={errors.height}>
              <input
                id="bsa-net-height-in"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightIn}
                onChange={(e) => editImperial({ heightIn: e.target.value })}
                aria-label="Height inches"
                aria-invalid={Boolean(errors.height)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                inches
              </span>
            </FieldShell>
          </div>
        </div>

        <div
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          aria-hidden
        >
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <div>
          <label className="sr-only" htmlFor="bsa-net-height-cm">
            Body Height in centimeters
          </label>
          <FieldShell error={errors.height}>
            <input
              id="bsa-net-height-cm"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightCm}
              onChange={(e) => editMetric(e.target.value)}
              aria-invalid={Boolean(errors.height)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              cm
            </span>
          </FieldShell>
          {errors.height ? (
            <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
          ) : null}
        </div>

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
            className="space-y-2 rounded-lg border border-sky-200 bg-sky-50/60 px-3.5 py-3"
            aria-live="polite"
          >
            <p className="text-[13px] font-semibold text-accent">
              {result.statusHeadline}
            </p>
            <ul className="space-y-1 text-sm tabular-nums text-accent">
              <li>Du Bois: {result.formatted.duBois} m²</li>
              <li>Mosteller: {result.formatted.mosteller} m²</li>
              <li>Haycock: {result.formatted.haycock} m²</li>
              <li>Gehan &amp; George: {result.formatted.gehanGeorge} m²</li>
              <li>Boyd: {result.formatted.boyd} m²</li>
              <li>Fujimoto: {result.formatted.fujimoto} m²</li>
              <li>Takahira: {result.formatted.takahira} m²</li>
              <li>
                Schlich ({input.sex}): {result.formatted.schlich} m²
              </li>
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail} {result.disclaimer}
            </p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
