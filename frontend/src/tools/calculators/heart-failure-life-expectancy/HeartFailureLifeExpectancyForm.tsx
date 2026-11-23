'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  computeBmiKgM2,
  heightToMeters,
  weightToKg,
} from './calculation';
import type {
  CreatinineUnit,
  HeartFailureLifeExpectancyFieldErrors,
  HeartFailureLifeExpectancyInput,
  HeartFailureLifeExpectancyResult,
  HeightUnit,
  NyhaClass,
  Sex,
  WeightUnit,
} from './types';
import {
  CREATININE_UNIT_LABELS,
  HEIGHT_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
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
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
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

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatBmi(bmi: number | null): string {
  if (bmi == null || !Number.isFinite(bmi)) return '';
  return bmi.toFixed(1);
}

const NYHA_OPTIONS: readonly { value: NyhaClass; label: string }[] = [
  { value: 'I', label: 'I class' },
  { value: 'II', label: 'II class' },
  { value: 'III', label: 'III class' },
  { value: 'IV', label: 'IV class' },
];

interface Props {
  input: HeartFailureLifeExpectancyInput;
  errors: HeartFailureLifeExpectancyFieldErrors;
  result: HeartFailureLifeExpectancyResult | null;
  onChange: (input: HeartFailureLifeExpectancyInput) => void;
}

export function HeartFailureLifeExpectancyForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<HeartFailureLifeExpectancyInput>) =>
    onChange({ ...input, ...patch });

  const derivedBmi = React.useMemo(() => {
    const h = parseLoose(input.heightValue);
    const w = parseLoose(input.weightValue);
    if (h == null || w == null) return null;
    const hm = heightToMeters(h, input.heightUnit);
    const kg = weightToKg(w, input.weightUnit);
    if (hm == null || kg == null) return null;
    return computeBmiKgM2(hm, kg);
  }, [
    input.heightValue,
    input.heightUnit,
    input.weightValue,
    input.weightUnit,
  ]);

  const bmiDisplay =
    derivedBmi != null ? formatBmi(derivedBmi) : input.bmiDisplay;

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseLoose(input.heightValue);
    let nextValue = input.heightValue;
    if (raw != null) {
      const m = heightToMeters(raw, input.heightUnit);
      if (m != null) {
        const converted =
          next === 'm'
            ? m
            : next === 'cm'
              ? m * 100
              : next === 'in'
                ? (m * 100) / 2.54
                : (m * 100) / (12 * 2.54);
        nextValue = String(Number(converted.toFixed(3)));
      }
    }
    set({ heightUnit: next, heightValue: nextValue });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseLoose(input.weightValue);
    let nextValue = input.weightValue;
    if (raw != null) {
      const kg = weightToKg(raw, input.weightUnit);
      if (kg != null) {
        nextValue = String(
          Number((next === 'kg' ? kg : kg / 0.45359237).toFixed(2)),
        );
      }
    }
    set({ weightUnit: next, weightValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        MAGGIC 13-variable risk score and published 1- and 3-year survival
        probabilities (100% − mortality). Entries stay in your browser — share
        uses the page URL only.
      </p>

      <CollapsibleSection title="Patient's basic details">
        <div>
          <p className={labelClass}>Sex</p>
          <div
            role="radiogroup"
            aria-label="Sex"
            className="flex flex-wrap gap-4"
          >
            {(['male', 'female'] as Sex[]).map((sex) => (
              <label
                key={sex}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="hfle-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-age">
            Age
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="hfle-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
              aria-invalid={Boolean(errors.ageYears)}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="hfle-height">
              Height
            </label>
            <FieldShell error={errors.heightValue}>
              <input
                id="hfle-height"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightValue}
                onChange={(e) => set({ heightValue: e.target.value })}
              />
              <select
                className={unitSelectClass}
                aria-label="Height unit"
                value={input.heightUnit}
                onChange={(e) => switchHeight(e.target.value as HeightUnit)}
              >
                {(Object.keys(HEIGHT_UNIT_LABELS) as HeightUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {HEIGHT_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.heightValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="hfle-weight">
              Weight
            </label>
            <FieldShell error={errors.weightValue}>
              <input
                id="hfle-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightValue}
                onChange={(e) => set({ weightValue: e.target.value })}
              />
              <select
                className={unitSelectClass}
                aria-label="Weight unit"
                value={input.weightUnit}
                onChange={(e) => switchWeight(e.target.value as WeightUnit)}
              >
                {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {WEIGHT_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.weightValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-bmi">
            BMI
            <InfoTooltip
              label="BMI"
              text="Body mass index derived from height and weight (kg/m²) for the MAGGIC integer chart."
            />
          </label>
          <FieldShell muted>
            <output
              id="hfle-bmi"
              className={`${inputClass} text-accent`}
              aria-live="polite"
            >
              {bmiDisplay}
            </output>
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              kg/m²
            </span>
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Test results">
        <div>
          <label className={labelClass} htmlFor="hfle-cr">
            Creatinine
          </label>
          <FieldShell error={errors.creatinineValue}>
            <input
              id="hfle-cr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.creatinineValue}
              onChange={(e) => set({ creatinineValue: e.target.value })}
            />
            <select
              className={unitSelectClass}
              aria-label="Creatinine unit"
              value={input.creatinineUnit}
              onChange={(e) =>
                set({ creatinineUnit: e.target.value as CreatinineUnit })
              }
            >
              {(
                Object.keys(CREATININE_UNIT_LABELS) as CreatinineUnit[]
              ).map((u) => (
                <option key={u} value={u}>
                  {CREATININE_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.creatinineValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.creatinineValue}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-ef">
            EF
            <InfoTooltip
              label="Ejection fraction"
              text="Left ventricular ejection fraction (%). MAGGIC uses EF bands and EF-dependent age and systolic pressure rows (Pocock Figure 2)."
            />
          </label>
          <FieldShell error={errors.efPercent}>
            <input
              id="hfle-ef"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.efPercent}
              onChange={(e) => set({ efPercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.efPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.efPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-sbp">
            SBP
            <InfoTooltip
              label="Systolic blood pressure"
              text="Systolic blood pressure (mmHg). Extra integer points depend on EF group in the published chart."
            />
          </label>
          <FieldShell error={errors.systolicBp}>
            <input
              id="hfle-sbp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.systolicBp}
              onChange={(e) => set({ systolicBp: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              mmHg
            </span>
          </FieldShell>
          {errors.systolicBp ? (
            <p className="mt-1 text-xs text-rose-600">{errors.systolicBp}</p>
          ) : null}
        </div>

        <div>
          <p className={labelClass}>
            NYHA class
            <InfoTooltip
              label="NYHA class"
              text="New York Heart Association functional class I–IV as assigned clinically."
            />
          </p>
          <div
            role="radiogroup"
            aria-label="NYHA class"
            className="flex flex-col gap-2"
          >
            {NYHA_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="hfle-nyha"
                  className="h-4 w-4 accent-primary"
                  checked={input.nyhaClass === opt.value}
                  onChange={() => set({ nyhaClass: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Patient's history">
        <p className="text-xs font-medium text-muted-foreground">
          Tick all that apply
        </p>
        <ul className="space-y-2.5">
          {[
            {
              key: 'takingAceiArb' as const,
              label: 'Taking ACEi (e.g., captopril) or ARB (sartans)',
            },
            {
              key: 'takingBetaBlocker' as const,
              label: 'Taking Beta-blocker',
            },
            {
              key: 'heartFailureOver18Months' as const,
              label: 'With heart failure history >18 months ago',
            },
            {
              key: 'hasCopd' as const,
              label: 'Has chronic obstructive pulmonary disease',
            },
            { key: 'isSmoker' as const, label: 'Patient is a smoker' },
            { key: 'hasDiabetes' as const, label: 'Has diabetes' },
          ].map(({ key, label }) => (
            <li key={key}>
              <label className="inline-flex cursor-pointer items-start gap-2 text-sm text-accent">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                  checked={input[key]}
                  onChange={(e) => set({ [key]: e.target.checked })}
                />
                <span>{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Results">
        <div>
          <label className={labelClass} htmlFor="hfle-score">
            Risk score
          </label>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
            <output
              id="hfle-score"
              className="w-full text-sm font-semibold tabular-nums text-accent"
              aria-live="polite"
            >
              {result?.formattedScore ?? ''}
            </output>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-surv1">
            1-year survival probability
            <InfoTooltip
              label="1-year survival"
              text="100% minus the published Table 4 one-year probability of death for this integer score (0–50)."
            />
          </label>
          <FieldShell muted>
            <output
              id="hfle-surv1"
              className={`${inputClass} font-medium text-accent`}
              aria-live="polite"
            >
              {result?.formattedSurvival1Year ?? ''}
            </output>
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="hfle-surv3">
            3-years survival probability
            <InfoTooltip
              label="3-year survival"
              text="100% minus the published Table 4 three-year probability of death. Not years of life remaining."
            />
          </label>
          <FieldShell muted>
            <output
              id="hfle-surv3"
              className={`${inputClass} font-medium text-accent`}
              aria-live="polite"
            >
              {result?.formattedSurvival3Year ?? ''}
            </output>
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {result && !result.tableInRange ? (
          <p className="text-xs text-amber-800">
            Integer score is above 50; published Table 4 probabilities are not
            tabulated.
          </p>
        ) : null}
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational MAGGIC mapping — not medical advice.'}
        </p>
      </CollapsibleSection>
    </form>
  );
}