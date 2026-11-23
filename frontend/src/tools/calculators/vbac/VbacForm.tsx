'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHeightValue,
  convertWeightValue,
} from './calculation';
import { VbacResults } from './VbacResults';
import type {
  HeightUnit,
  PriorVaginalHistory,
  VbacFieldErrors,
  VbacInput,
  VbacResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: VbacInput;
  errors: VbacFieldErrors;
  result: VbacResult | null;
  onChange: (input: VbacInput) => void;
  onLoadExample: () => void;
}

export function VbacForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<VbacInput>) => onChange({ ...input, ...patch });

  const setHistory = (history: PriorVaginalHistory) =>
    set({ priorVaginalHistory: history });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter details available at an early prenatal visit to estimate VBAC
        success probability.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Uses the{' '}
        <strong className="font-semibold text-accent">
          2021 MFMU Grobman model without race or ethnicity
        </strong>
        . Legacy ethnicity/BMI-only UIs are deliberately omitted: the published
        model uses <strong className="font-semibold text-accent">pre-pregnancy
        weight</strong> and <strong className="font-semibold text-accent">height</strong>,
        separates <strong className="font-semibold text-accent">prior VBAC</strong>{' '}
        from vaginal birth before the cesarean, and adds{' '}
        <strong className="font-semibold text-accent">treated chronic hypertension</strong>.
        Entries stay in your browser only; share uses the page URL.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (Table 3 #7 → ~59.4% VBAC)
        </button>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Personal data
        </legend>

        <div>
          <label htmlFor="vbac-age" className={labelClass}>
            Age
            <InfoTooltip
              label="Maternal age"
              text="Maternal age in years at counseling (model coefficient −0.023 per year)."
            />
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="vbac-age"
              className={inputClass}
              inputMode="numeric"
              aria-label="Maternal age in years"
              value={input.ageYears}
              aria-invalid={Boolean(errors.ageYears)}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="vbac-height" className={labelClass}>
            Height
            <InfoTooltip
              label="Height"
              text="Model predictor per centimeter (coefficient +0.056). Not BMI."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.heightValue}>
              <input
                id="vbac-height"
                className={inputClass}
                inputMode="decimal"
                value={input.heightValue}
                aria-label="Height"
                aria-invalid={Boolean(errors.heightValue)}
                onChange={(e) => set({ heightValue: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => {
                const unit = e.target.value as HeightUnit;
                const v = parseLoose(input.heightValue);
                if (v != null && v > 0) {
                  const next = convertHeightValue(v, input.heightUnit, unit);
                  set({
                    heightUnit: unit,
                    heightValue:
                      next == null ? input.heightValue : formatField(next, 4),
                  });
                } else set({ heightUnit: unit });
              }}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="ft">ft</option>
              <option value="in">in</option>
            </select>
          </div>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="vbac-weight" className={labelClass}>
            Pre-pregnancy weight
            <InfoTooltip
              label="Pre-pregnancy weight"
              text="Model predictor per kilogram (coefficient −0.024). Use pre-pregnancy weight, not delivery weight."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightValue}>
              <input
                id="vbac-weight"
                className={inputClass}
                inputMode="decimal"
                value={input.weightValue}
                aria-label="Pre-pregnancy weight"
                aria-invalid={Boolean(errors.weightValue)}
                onChange={(e) => set({ weightValue: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.weightUnit}
              aria-label="Weight unit"
              onChange={(e) => {
                const unit = e.target.value as WeightUnit;
                const v = parseLoose(input.weightValue);
                if (v != null && v > 0) {
                  const next = convertWeightValue(v, input.weightUnit, unit);
                  set({
                    weightUnit: unit,
                    weightValue:
                      next == null ? input.weightValue : formatField(next, 4),
                  });
                } else set({ weightUnit: unit });
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>
            Medication-treated chronic hypertension
          </legend>
          <YesNoRadios
            id="vbac-htn"
            checked={input.treatedChronicHypertension}
            onChange={(v) => set({ treatedChronicHypertension: v })}
          />
        </fieldset>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Obstetric history
        </legend>

        <fieldset>
          <legend className={labelClass}>
            Arrest disorder indication for prior cesarean
            <InfoTooltip
              label="Arrest indication"
              text='Prior cesarean for arrest of dilation or fetal descent ("recurring" labor arrest reason in legacy UIs). Coefficient −0.597 when yes.'
            />
          </legend>
          <YesNoRadios
            id="vbac-arrest"
            checked={input.arrestIndicationForPriorCesarean}
            onChange={(v) => set({ arrestIndicationForPriorCesarean: v })}
          />
        </fieldset>

        <fieldset>
          <legend className={labelClass}>
            Prior vaginal delivery history
            <InfoTooltip
              label="Prior vaginal history"
              text="Choose the option that matches the model: no prior vaginal births; vaginal birth(s) only before the cesarean (+0.868); or a prior VBAC after the cesarean (+1.869)."
            />
          </legend>
          <div className="flex flex-col gap-2">
            <RadioRow
              name="vbac-history"
              checked={input.priorVaginalHistory === 'none'}
              onChange={() => setHistory('none')}
              label="No prior vaginal delivery"
            />
            <RadioRow
              name="vbac-history"
              checked={input.priorVaginalHistory === 'vaginalBeforePriorCesarean'}
              onChange={() => setHistory('vaginalBeforePriorCesarean')}
              label="Vaginal delivery only before prior cesarean"
            />
            <RadioRow
              name="vbac-history"
              checked={input.priorVaginalHistory === 'priorVbac'}
              onChange={() => setHistory('priorVbac')}
              label="Prior VBAC (vaginal birth after prior cesarean)"
            />
          </div>
        </fieldset>
      </fieldset>

      <VbacResults result={result} />

      {!result ? (
        <p className="text-xs text-muted-foreground">
          Probability and Grobman log-odds appear after age, height, and
          pre-pregnancy weight are valid. No probability cutoff restricts
          viewing the estimate.
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