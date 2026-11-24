'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import type {
  CalculationType,
  HeightUnit,
  IvigDoseFieldErrors,
  IvigDoseInput,
  IvigDoseResult,
  Sex,
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
const radioRow = 'flex flex-wrap gap-4 text-sm text-accent';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

function formatGrams(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

function formatKg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

interface Props {
  input: IvigDoseInput;
  errors: IvigDoseFieldErrors;
  result: IvigDoseResult | null;
  onChange: (input: IvigDoseInput) => void;
}

export function IvigDoseForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<IvigDoseInput>) =>
    onChange({ ...input, ...patch });

  const isGeneral = input.calculationType === 'general';

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
    set({
      weightUnit: next,
      weightText: formatConverted(next === 'kg' ? kg : kg / LB_TO_KG),
    });
  };

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = input.heightText.trim().replace(/,/g, '');
    if (raw === '') {
      set({ heightUnit: next });
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      set({ heightUnit: next });
      return;
    }
    const cm = input.heightUnit === 'cm' ? n : n * IN_TO_CM;
    set({
      heightUnit: next,
      heightText: formatConverted(next === 'cm' ? cm : cm / IN_TO_CM),
    });
  };

  const setCalculationType = (calculationType: CalculationType) => {
    if (calculationType === 'pregnancy_hemorrhage') {
      set({ calculationType, sex: 'female' });
      return;
    }
    set({ calculationType });
  };

  const showIvig =
    isGeneral && result?.ivigDoseGrams != null && Number.isFinite(result.ivigDoseGrams);
  const showRhig =
    !isGeneral && result?.rhigVials != null && Number.isFinite(result.rhigVials);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Type of calculation">
        <h3 className="text-[15px] font-semibold text-accent">
          Type of calculation
        </h3>
        <fieldset className={radioRow}>
          <legend className="sr-only">Type of calculation</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="ivig-calc-type"
              checked={input.calculationType === 'general'}
              onChange={() => setCalculationType('general')}
            />
            <span>General</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="ivig-calc-type"
              checked={input.calculationType === 'pregnancy_hemorrhage'}
              onChange={() => setCalculationType('pregnancy_hemorrhage')}
            />
            <span>Pregnancy hemorrhage</span>
          </label>
        </fieldset>
      </section>

      <section
        className={sectionClass}
        aria-label={isGeneral ? 'General dosing' : 'Pregnancy hemorrhage dosing'}
      >
        <h3 className="text-[15px] font-semibold text-accent">
          {isGeneral ? 'General dosing' : 'Pregnancy hemorrhage'}
        </h3>

        {isGeneral ? (
          <fieldset className={radioRow}>
            <legend className={labelClass}>Sex</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ivig-sex"
                checked={input.sex === 'female'}
                onChange={() => set({ sex: 'female' satisfies Sex })}
              />
              <span>Female</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ivig-sex"
                checked={input.sex === 'male'}
                onChange={() => set({ sex: 'male' })}
              />
              <span>Male</span>
            </label>
          </fieldset>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Rh(D) immune globulin (RhIG) fetomaternal-hemorrhage worksheet for an
            Rh-negative mother — not polyvalent IVIG grams. Sex is fixed female
            for this obstetric branch.
          </p>
        )}

        <Field
          label="Weight"
          htmlFor="ivig-weight"
          error={errors.weightText}
          tooltip={
            isGeneral
              ? 'Actual body weight. Used with height to choose actual, ideal, or adjusted dosing weight.'
              : 'Maternal weight for Nadler blood-volume estimate.'
          }
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.weightText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ivig-weight"
              className={inputClass}
              value={input.weightText}
              inputMode="decimal"
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
          label="Height"
          htmlFor="ivig-height"
          error={errors.heightText}
          tooltip={
            isGeneral
              ? 'Needed for Devine ideal body weight and BMI (≥152.4 cm for IBW eligibility).'
              : 'Maternal height for Nadler blood-volume estimate.'
          }
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.heightText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ivig-height"
              className={inputClass}
              value={input.heightText}
              inputMode="decimal"
              aria-invalid={Boolean(errors.heightText)}
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => switchHeightUnit(e.target.value as HeightUnit)}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </Field>

        {isGeneral ? (
          <Field
            label="Dosing"
            htmlFor="ivig-dosing"
            error={errors.dosingText}
            tooltip="Supplied protocol intensity in g/kg (default 1 matches labeled Privigen chronic ITP daily intensity). Enter the ordered g/kg — this tool does not invent unsupported indication schedules."
          >
            <div
              className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.dosingText ? 'border-rose-400' : ''
              }`}
            >
              <input
                id="ivig-dosing"
                className={inputClass}
                value={input.dosingText}
                inputMode="decimal"
                aria-invalid={Boolean(errors.dosingText)}
                onChange={(e) => set({ dosingText: e.target.value })}
              />
              <span className="flex h-11 shrink-0 items-center border-l border-border px-3 text-sm font-medium text-primary">
                g/kg
              </span>
            </div>
          </Field>
        ) : (
          <Field
            label="Fetal cells"
            htmlFor="ivig-fetal-cells"
            error={errors.fetalCellsPercentText}
            tooltip="Percent fetal red cells from Kleihauer–Betke or flow cytometry (enter the laboratory %)."
          >
            <div
              className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                errors.fetalCellsPercentText ? 'border-rose-400' : ''
              }`}
            >
              <input
                id="ivig-fetal-cells"
                className={inputClass}
                value={input.fetalCellsPercentText}
                inputMode="decimal"
                aria-invalid={Boolean(errors.fetalCellsPercentText)}
                onChange={(e) =>
                  set({ fetalCellsPercentText: e.target.value })
                }
              />
              <span className="flex h-11 shrink-0 items-center border-l border-border px-3 text-sm font-medium text-primary">
                %
              </span>
            </div>
          </Field>
        )}
      </section>

      <section
        className={sectionClass}
        aria-label="Dose results"
        aria-live="polite"
      >
        {showIvig ? (
          <>
            <p className="text-sm font-semibold text-accent">
              {result.statusHeadline}
            </p>
            <p className="text-sm leading-relaxed text-accent">
              <span className="tabular-nums font-semibold">
                {formatGrams(result.ivigDoseGrams)} g
              </span>
              <span className="text-muted-foreground">
                {' '}
                · dosing weight {formatKg(result.dosingWeightKg)} kg (
                {weightBasisLabel(result.weightBasis)})
              </span>
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          </>
        ) : showRhig ? (
          <>
            <p className="text-sm font-semibold text-accent">
              {result.statusHeadline}
            </p>
            <p className="text-sm leading-relaxed text-accent">
              <span className="tabular-nums font-semibold">
                {result.rhigVials} vial
                {result.rhigVials === 1 ? '' : 's'}
              </span>
              <span className="text-muted-foreground">
                {' '}
                · 300 µg (30 mL fetal whole-blood) RhIG
              </span>
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-accent">
              {result?.statusHeadline ??
                (isGeneral
                  ? 'Enter weight and height'
                  : 'Enter maternal weight, height, and % fetal cells')}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result?.statusDetail ??
                (isGeneral
                  ? 'IVIG grams = supplied g/kg × dosing weight after actual / ideal / adjusted selection.'
                  : 'RhIG vials use Nadler maternal blood volume and AABB rounding — not IVIG grams.')}
            </p>
          </>
        )}
        {result?.sourceNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.sourceNote}
          </p>
        ) : null}
      </section>
    </form>
  );
}

function weightBasisLabel(basis: IvigDoseResult['weightBasis']): string {
  switch (basis) {
    case 'actual':
      return 'actual';
    case 'ideal':
      return 'ideal';
    case 'adjusted':
      return 'adjusted';
    case 'actual_below_ibw_eligibility':
      return 'actual (IBW not eligible)';
    default:
      return 'n/a';
  }
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
