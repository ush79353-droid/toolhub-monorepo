'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { deriveBmi } from './calculation';
import { StillbirthRiskResults } from './StillbirthRiskResults';
import type {
  DiabetesOption,
  EthnicityOption,
  StillbirthRiskFieldErrors,
  StillbirthRiskInput,
  StillbirthRiskResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const ETHNICITY_OPTIONS: { value: EthnicityOption; label: string }[] = [
  { value: 'asianPacific', label: 'Asian/Pacific Islander' },
  { value: 'hispanic', label: 'Hispanic' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'nonHispanicBlack', label: 'Non-Hispanic Black' },
  { value: 'nonHispanicWhite', label: 'Non-Hispanic White' },
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

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

interface Props {
  input: StillbirthRiskInput;
  errors: StillbirthRiskFieldErrors;
  result: StillbirthRiskResult | null;
  onChange: (input: StillbirthRiskInput) => void;
}

export function StillbirthRiskForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<StillbirthRiskInput>) =>
    onChange({ ...input, ...patch });

  const height = parseLoose(input.heightCm);
  const weight = parseLoose(input.weightKg);
  const displayBmi =
    height != null && height > 0 && weight != null && weight > 0
      ? deriveBmi(weight, height)
      : null;
  const formattedBmi =
    displayBmi != null && Number.isFinite(displayBmi)
      ? (Math.round(displayBmi * 10) / 10).toFixed(1)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Uses the published Trudell et al. 2017 US logistic model (≥32 weeks).
        Screenshot-matched fields for ART, SLE, APS, alcohol, and detailed
        ethnicity are shown for intake parity but only{' '}
        <strong className="font-semibold text-accent">Trudell predictors</strong>{' '}
        change the score. No editable baseline multiplier. Share uses the page
        URL only — no clinical data in links.
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Mother&apos;s details, and settings
        </legend>

        <div>
          <label htmlFor="sbr-age" className={labelClass}>
            Age
            <InfoTooltip
              label="Maternal age"
              text="Trudell age bands: ≤18, 19–34 (reference), 35–39, ≥40."
            />
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="sbr-age"
              className={inputClass}
              inputMode="numeric"
              aria-label="Maternal age in years"
              value={input.ageYears}
              aria-invalid={Boolean(errors.ageYears)}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sbr-height" className={labelClass}>
            Height
          </label>
          <FieldShell error={errors.heightCm}>
            <input
              id="sbr-height"
              className={inputClass}
              inputMode="decimal"
              aria-label="Height in centimeters"
              value={input.heightCm}
              aria-invalid={Boolean(errors.heightCm)}
              onChange={(e) => set({ heightCm: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              cm
            </span>
          </FieldShell>
          {errors.heightCm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightCm}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sbr-weight" className={labelClass}>
            Pre-pregnancy weight
          </label>
          <FieldShell error={errors.weightKg}>
            <input
              id="sbr-weight"
              className={inputClass}
              inputMode="decimal"
              aria-label="Pre-pregnancy weight in kilograms"
              value={input.weightKg}
              aria-invalid={Boolean(errors.weightKg)}
              onChange={(e) => set({ weightKg: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kg
            </span>
          </FieldShell>
          {errors.weightKg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightKg}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sbr-bmi" className={labelClass}>
            BMI
            <InfoTooltip
              label="Body mass index"
              text="kg/m² from height and pre-pregnancy weight. Trudell model uses BMI category bands, not continuous BMI."
            />
          </label>
          <FieldShell>
            <input
              id="sbr-bmi"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              aria-label="Computed BMI"
              value={formattedBmi}
              placeholder="—"
            />
          </FieldShell>
          {errors.bmi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bmi}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>
            Ethnicity
            <InfoTooltip
              label="Ethnicity"
              text="Trudell 2017 uses a Black vs non-Black indicator (Non-Hispanic Black → yes). Other groups are collected for form parity only."
            />
          </legend>
          <div className="flex flex-col gap-2">
            {ETHNICITY_OPTIONS.map((opt) => (
              <RadioRow
                key={opt.value}
                name="sbr-ethnicity"
                checked={input.ethnicity === opt.value}
                onChange={() => set({ ethnicity: opt.value })}
                label={opt.label}
              />
            ))}
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Obstetric history
        </legend>

        <fieldset>
          <legend className={labelClass}>
            Previous pregnancies
            <InfoTooltip
              label="Parity"
              text="No → nulliparous (+0.3423 in Trudell). Yes → not nulliparous (reference)."
            />
          </legend>
          <PriorPregnancyRadios
            id="sbr-prior"
            value={input.previousPregnancies}
            onChange={(v) => set({ previousPregnancies: v })}
          />
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Assisted Reproductive Technology (ART)
            <InfoTooltip
              label="ART"
              text="Shown for screenshot parity. Not a Trudell 2017 coefficient — does not change this score."
            />
          </legend>
          <YesNoRadios
            id="sbr-art"
            checked={input.art}
            onChange={(v) => set({ art: v })}
          />
        </fieldset>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Comorbidities
        </legend>

        <fieldset>
          <legend className={labelClass}>
            Diabetes
            <InfoTooltip
              label="Diabetes"
              text="Type 1 or Type 2 pregestational diabetes (+0.9863). No → reference."
            />
          </legend>
          <DiabetesRadios
            value={input.diabetes}
            onChange={(v) => set({ diabetes: v })}
          />
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Hypertension
            <InfoTooltip
              label="Chronic hypertension"
              text="Chronic hypertension (+0.6255 when yes)."
            />
          </legend>
          <YesNoRadios
            id="sbr-htn"
            checked={input.chronicHypertension}
            onChange={(v) => set({ chronicHypertension: v })}
          />
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Systemic Lupus Erythematosus (SLE)
            <InfoTooltip
              label="SLE"
              text="Not in Trudell 2017 model — does not change score."
            />
          </legend>
          <YesNoRadios
            id="sbr-sle"
            checked={input.sle}
            onChange={(v) => set({ sle: v })}
          />
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Anti-phospholipid syndrome (APS)
            <InfoTooltip
              label="APS"
              text="Not in Trudell 2017 model — does not change score."
            />
          </legend>
          <YesNoRadios
            id="sbr-aps"
            checked={input.aps}
            onChange={(v) => set({ aps: v })}
          />
        </fieldset>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Addictions
        </legend>
        <p className="text-xs text-muted-foreground">
          Tick if the following applies to you.
        </p>

        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
            checked={input.alcoholDuringPregnancy}
            onChange={(e) => set({ alcoholDuringPregnancy: e.target.checked })}
          />
          <span>
            Alcohol use during pregnancy
            <span className="block text-xs text-muted-foreground">
              Not in Trudell 2017 — does not change score
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
            checked={input.smokingDuringPregnancy}
            onChange={(e) => set({ smokingDuringPregnancy: e.target.checked })}
          />
          <span>
            Smoking during pregnancy (+0.2270 in Trudell model)
          </span>
        </label>
      </fieldset>

      <StillbirthRiskResults result={result} />

      {!result ? (
        <p className="text-xs text-muted-foreground">
          Stillbirth probability appears after age, height, weight, and previous
          pregnancies are entered. Clinical radios default to No / unchecked.
        </p>
      ) : null}
    </form>
  );
}

function RadioRow({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-start gap-2 text-sm leading-snug text-accent">
      <input
        type="radio"
        name={name}
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

function YesNoRadios({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={id}
          className="h-4 w-4 accent-primary"
          checked={!checked}
          onChange={() => onChange(false)}
        />
        No
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={id}
          className="h-4 w-4 accent-primary"
          checked={checked}
          onChange={() => onChange(true)}
        />
        Yes
      </label>
    </div>
  );
}

function PriorPregnancyRadios({
  id,
  value,
  onChange,
}: {
  id: string;
  value: boolean | null;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={id}
          className="h-4 w-4 accent-primary"
          checked={value === false}
          onChange={() => onChange(false)}
        />
        No
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={id}
          className="h-4 w-4 accent-primary"
          checked={value === true}
          onChange={() => onChange(true)}
        />
        Yes
      </label>
    </div>
  );
}

function DiabetesRadios({
  value,
  onChange,
}: {
  value: DiabetesOption;
  onChange: (next: DiabetesOption) => void;
}) {
  const options: { value: DiabetesOption; label: string }[] = [
    { value: 'no', label: 'No' },
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
  ];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="inline-flex items-center gap-2 text-sm text-accent"
        >
          <input
            type="radio"
            name="sbr-diabetes"
            className="h-4 w-4 accent-primary"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}