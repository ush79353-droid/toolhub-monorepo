'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { BodyFatResults } from './BodyFatResults';
import type {
  BodyFatFieldErrors,
  BodyFatInput,
  BodyFatMethod,
  BodyFatResult,
  LengthUnit,
  MassUnit,
  Sex,
} from './types';
import { CM_PER_INCH, LB_PER_KG, parseLoose } from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/40 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  unitSelect,
  children,
}: {
  error?: string;
  unitSelect?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {unitSelect}
    </div>
  );
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface BodyFatFormProps {
  input: BodyFatInput;
  errors: BodyFatFieldErrors;
  result: BodyFatResult | null;
  detailsOpen: boolean;
  onDetailsOpenChange: (open: boolean) => void;
  onChange: (input: BodyFatInput) => void;
}

export function BodyFatForm({
  input,
  errors,
  result,
  detailsOpen,
  onDetailsOpenChange,
  onChange,
}: BodyFatFormProps) {
  const set = (patch: Partial<BodyFatInput>) => onChange({ ...input, ...patch });

  const setHeightUnit = (heightUnit: LengthUnit) => {
    const raw = parseLoose(input.height);
    if (raw === null || input.heightUnit === heightUnit) {
      set({ heightUnit });
      return;
    }
    const cm = input.heightUnit === 'cm' ? raw : raw * CM_PER_INCH;
    const next = heightUnit === 'cm' ? cm : cm / CM_PER_INCH;
    set({ heightUnit, height: formatField(next, 2) });
  };

  const setWeightUnit = (weightUnit: MassUnit) => {
    const raw = parseLoose(input.weight);
    if (raw === null || input.weightUnit === weightUnit) {
      set({ weightUnit });
      return;
    }
    const kg = input.weightUnit === 'kg' ? raw : raw / LB_PER_KG;
    const next = weightUnit === 'kg' ? kg : kg * LB_PER_KG;
    set({ weightUnit, weight: formatField(next, 2) });
  };

  const setCircUnit = (circumferenceUnit: LengthUnit) => {
    if (input.circumferenceUnit === circumferenceUnit) {
      set({ circumferenceUnit });
      return;
    }
    const convert = (raw: string) => {
      const n = parseLoose(raw);
      if (n === null) return raw;
      const cm =
        input.circumferenceUnit === 'cm' ? n : n * CM_PER_INCH;
      const next = circumferenceUnit === 'cm' ? cm : cm / CM_PER_INCH;
      return formatField(next, 2);
    };
    set({
      circumferenceUnit,
      neck: convert(input.neck),
      waist: convert(input.waist),
      hip: convert(input.hip),
    });
  };

  const methodRadio = (
    id: BodyFatMethod,
    title: string,
    hint: string,
  ) => (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
      <input
        type="radio"
        name="body-fat-method"
        className="mt-0.5 h-4 w-4 accent-primary"
        checked={input.method === id}
        onChange={() => set({ method: id })}
      />
      <span className="text-sm text-accent">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground"> {hint}</span>
      </span>
    </label>
  );

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Input your data
        </legend>

        <div>
          <p className={labelClass}>Sex</p>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {([
              ['female', 'Female'],
              ['male', 'Male'],
            ] as const).map(([id, label]) => (
              <label key={id} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="body-fat-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === id}
                  onChange={() => set({ sex: id as Sex })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className={labelClass}>Choose the calculation method</p>
          <div className="space-y-2" role="radiogroup" aria-label="Calculation method">
            {methodRadio(
              'ada',
              'American Diabetes Association',
              '(most common)',
            )}
            {methodRadio('navy', 'U.S. Navy', '(most precise)')}
            {methodRadio('bmi', 'BMI', '(least precise)')}
          </div>
        </div>

        <div>
          <label htmlFor="bf-age" className={labelClass}>
            Age
          </label>
          <FieldShell
            error={errors.age}
            unitSelect={
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                yrs
              </span>
            }
          >
            <input
              id="bf-age"
              className={inputClass}
              inputMode="decimal"
              value={input.age}
              aria-invalid={Boolean(errors.age)}
              onChange={(e) => set({ age: e.target.value })}
            />
          </FieldShell>
          {errors.age ? (
            <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="bf-height" className={labelClass}>
            Height
          </label>
          <FieldShell
            error={errors.height}
            unitSelect={
              <select
                className={selectClass}
                value={input.heightUnit}
                aria-label="Height unit"
                onChange={(e) => setHeightUnit(e.target.value as LengthUnit)}
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            }
          >
            <input
              id="bf-height"
              className={inputClass}
              inputMode="decimal"
              value={input.height}
              aria-invalid={Boolean(errors.height)}
              onChange={(e) => set({ height: e.target.value })}
            />
          </FieldShell>
          {errors.height ? (
            <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="bf-weight" className={labelClass}>
            Body weight
          </label>
          <FieldShell
            error={errors.weight}
            unitSelect={
              <select
                className={selectClass}
                value={input.weightUnit}
                aria-label="Weight unit"
                onChange={(e) => setWeightUnit(e.target.value as MassUnit)}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            }
          >
            <input
              id="bf-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weight}
              aria-invalid={Boolean(errors.weight)}
              onChange={(e) => set({ weight: e.target.value })}
            />
          </FieldShell>
          {errors.weight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
          ) : null}
        </div>

        {input.method === 'navy' ? (
          <div className="space-y-3 rounded-lg border border-dashed border-border bg-white/70 p-3">
            <p className="text-xs text-muted-foreground">
              Navy method needs tape measurements. Men: waist at navel. Women:
              waist at narrowest point plus hips at widest. Neck just below the
              larynx.
            </p>
            <div>
              <label htmlFor="bf-neck" className={labelClass}>
                Neck
              </label>
              <FieldShell
                error={errors.neck}
                unitSelect={
                  <select
                    className={selectClass}
                    value={input.circumferenceUnit}
                    aria-label="Circumference unit"
                    onChange={(e) =>
                      setCircUnit(e.target.value as LengthUnit)
                    }
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                }
              >
                <input
                  id="bf-neck"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.neck}
                  aria-invalid={Boolean(errors.neck)}
                  onChange={(e) => set({ neck: e.target.value })}
                />
              </FieldShell>
              {errors.neck ? (
                <p className="mt-1 text-xs text-rose-600">{errors.neck}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="bf-waist" className={labelClass}>
                Waist
              </label>
              <FieldShell error={errors.waist}>
                <input
                  id="bf-waist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.waist}
                  aria-invalid={Boolean(errors.waist)}
                  onChange={(e) => set({ waist: e.target.value })}
                />
              </FieldShell>
              {errors.waist ? (
                <p className="mt-1 text-xs text-rose-600">{errors.waist}</p>
              ) : null}
            </div>
            {input.sex === 'female' ? (
              <div>
                <label htmlFor="bf-hip" className={labelClass}>
                  Hip
                </label>
                <FieldShell error={errors.hip}>
                  <input
                    id="bf-hip"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.hip}
                    aria-invalid={Boolean(errors.hip)}
                    onChange={(e) => set({ hip: e.target.value })}
                  />
                </FieldShell>
                {errors.hip ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.hip}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
      </fieldset>

      <BodyFatResults
        result={result}
        detailsOpen={detailsOpen}
        onDetailsOpenChange={onDetailsOpenChange}
      />
    </div>
  );
}
