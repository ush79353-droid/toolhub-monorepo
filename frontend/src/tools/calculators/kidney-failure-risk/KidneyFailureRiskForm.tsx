'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  albuminToGDl,
  bicarbonateToMeqL,
  calciumToMgDl,
  gDlToAlbuminUnit,
  mgDlToCalciumUnit,
  mgDlToPhosphorusUnit,
  phosphorusToMgDl,
} from './calculation';
import type {
  AcrBand,
  AlbuminUnit,
  BicarbonateUnit,
  CalciumUnit,
  KidneyFailureRiskFieldErrors,
  KidneyFailureRiskInput,
  KidneyFailureRiskResult,
  PhosphorusUnit,
  Sex,
} from './types';
import {
  ACR_OPTIONS,
  ALBUMIN_UNIT_LABELS,
  BICARBONATE_UNIT_LABELS,
  CALCIUM_UNIT_LABELS,
  PHOSPHORUS_UNIT_LABELS,
  SEX_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

interface Props {
  input: KidneyFailureRiskInput;
  errors: KidneyFailureRiskFieldErrors;
  result: KidneyFailureRiskResult | null;
  onChange: (input: KidneyFailureRiskInput) => void;
  onLoadExample: () => void;
}

export function KidneyFailureRiskForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<KidneyFailureRiskInput>) =>
    onChange({ ...input, ...patch });

  const setAlbuminUnit = (next: AlbuminUnit) => {
    if (next === input.albuminUnit) return;
    const n = parseLoose(input.albuminValue);
    if (n == null) {
      set({ albuminUnit: next });
      return;
    }
    const gDl = albuminToGDl(n, input.albuminUnit);
    if (gDl == null) {
      set({ albuminUnit: next });
      return;
    }
    set({
      albuminUnit: next,
      albuminValue: formatField(gDlToAlbuminUnit(gDl, next), next === 'g_l' ? 1 : 2),
    });
  };

  const setBicarbUnit = (next: BicarbonateUnit) => {
    if (next === input.bicarbonateUnit) return;
    const n = parseLoose(input.bicarbonateValue);
    if (n == null) {
      set({ bicarbonateUnit: next });
      return;
    }
    const meq = bicarbonateToMeqL(n, input.bicarbonateUnit);
    if (meq == null) {
      set({ bicarbonateUnit: next });
      return;
    }
    set({ bicarbonateUnit: next, bicarbonateValue: formatField(meq, 1) });
  };

  const setCalciumUnit = (next: CalciumUnit) => {
    if (next === input.calciumUnit) return;
    const n = parseLoose(input.calciumValue);
    if (n == null) {
      set({ calciumUnit: next });
      return;
    }
    const mgDl = calciumToMgDl(n, input.calciumUnit);
    if (mgDl == null) {
      set({ calciumUnit: next });
      return;
    }
    set({
      calciumUnit: next,
      calciumValue: formatField(
        mgDlToCalciumUnit(mgDl, next),
        next === 'mmol_l' ? 2 : 2
      ),
    });
  };

  const setPhosphorusUnit = (next: PhosphorusUnit) => {
    if (next === input.phosphorusUnit) return;
    const n = parseLoose(input.phosphorusValue);
    if (n == null) {
      set({ phosphorusUnit: next });
      return;
    }
    const mgDl = phosphorusToMgDl(n, input.phosphorusUnit);
    if (mgDl == null) {
      set({ phosphorusUnit: next });
      return;
    }
    set({
      phosphorusUnit: next,
      phosphorusValue: formatField(
        mgDlToPhosphorusUnit(mgDl, next),
        next === 'mmol_l' ? 2 : 2
      ),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Complete the form and read the kidney failure risk score in points at
        the bottom.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Tangri 2011 eight-variable categorical points for CKD
        stages G3–G5 (eGFR &lt;60). Not continuous KFRE. Not a dialysis order.
        Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (Tangri Table 4 patient A → −27 pts)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>
          <span>Sex</span>
        </legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Sex">
          {SEX_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="kfr-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === opt.value}
                onChange={() => set({ sex: opt.value as Sex })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="kfr-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Whole years. Tangri categorical age bands: &lt;30, 30–39, …, ≥90."
          />
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="kfr-age"
            className={inputClass}
            inputMode="numeric"
            placeholder=""
            aria-label="Age in years"
            value={input.ageYears}
            aria-invalid={Boolean(errors.ageYears)}
            onChange={(e) => set({ ageYears: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Albumin-to-creatinine ratio</span>
          <InfoTooltip
            label="Albumin-to-creatinine ratio"
            text="Urine ACR categorical bands only (&lt;30 / 30–300 / &gt;300 mg/g). No numeric midpoint is substituted for a band."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Albumin-to-creatinine ratio"
        >
          {ACR_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="kfr-acr"
                className="h-4 w-4 accent-primary"
                checked={input.acrBand === opt.value}
                onChange={() => set({ acrBand: opt.value as AcrBand })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="kfr-egfr">
          <span>eGFR</span>
          <InfoTooltip
            label="eGFR"
            text="Indexed eGFR in mL/min/1.73 m². Scored for CKD G3–G5 (1–59). Values ≥60 are outside derivation and not scored."
          />
        </label>
        <FieldShell error={errors.egfr}>
          <input
            id="kfr-egfr"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Indexed eGFR"
            value={input.egfr}
            aria-invalid={Boolean(errors.egfr)}
            onChange={(e) => set({ egfr: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
            mL/min/1.73m²
          </span>
        </FieldShell>
        {errors.egfr ? (
          <p className="mt-1 text-xs text-rose-600">{errors.egfr}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="kfr-albumin">
          <span>Albumin</span>
          <InfoTooltip
            label="Albumin"
            text="Serum albumin. Engine uses g/dL bands (≤2.5 / 2.6–3.0 / 3.1–3.5 / ≥3.6). g/L converts ÷10."
          />
        </label>
        <FieldShell error={errors.albuminValue}>
          <input
            id="kfr-albumin"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Serum albumin"
            value={input.albuminValue}
            aria-invalid={Boolean(errors.albuminValue)}
            onChange={(e) => set({ albuminValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Albumin unit"
            value={input.albuminUnit}
            onChange={(e) => setAlbuminUnit(e.target.value as AlbuminUnit)}
          >
            {(Object.keys(ALBUMIN_UNIT_LABELS) as AlbuminUnit[]).map((u) => (
              <option key={u} value={u}>
                {ALBUMIN_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.albuminValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.albuminValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="kfr-bicarb">
          <span>Bicarbonate</span>
          <InfoTooltip
            label="Bicarbonate"
            text="Serum bicarbonate in mEq/L (mmol/L identical). Bands: &lt;18 / 18–22 / 23–25 / &gt;25."
          />
        </label>
        <FieldShell error={errors.bicarbonateValue}>
          <input
            id="kfr-bicarb"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Serum bicarbonate"
            value={input.bicarbonateValue}
            aria-invalid={Boolean(errors.bicarbonateValue)}
            onChange={(e) => set({ bicarbonateValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Bicarbonate unit"
            value={input.bicarbonateUnit}
            onChange={(e) => setBicarbUnit(e.target.value as BicarbonateUnit)}
          >
            {(Object.keys(BICARBONATE_UNIT_LABELS) as BicarbonateUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {BICARBONATE_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.bicarbonateValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bicarbonateValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="kfr-calcium">
          <span>Calcium</span>
          <InfoTooltip
            label="Calcium"
            text="Serum calcium. Engine uses mg/dL bands (≤8.5 / 8.6–9.5 / ≥9.6). mmol/L × 4."
          />
        </label>
        <FieldShell error={errors.calciumValue}>
          <input
            id="kfr-calcium"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Serum calcium"
            value={input.calciumValue}
            aria-invalid={Boolean(errors.calciumValue)}
            onChange={(e) => set({ calciumValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Calcium unit"
            value={input.calciumUnit}
            onChange={(e) => setCalciumUnit(e.target.value as CalciumUnit)}
          >
            {(Object.keys(CALCIUM_UNIT_LABELS) as CalciumUnit[]).map((u) => (
              <option key={u} value={u}>
                {CALCIUM_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.calciumValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.calciumValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="kfr-phosphorus">
          <span>Phosphorus</span>
          <InfoTooltip
            label="Phosphorus"
            text="Serum phosphorus (phosphate). Engine uses mg/dL bands (&lt;3.5 / 3.5–4.5 / 4.6–5.5 / &gt;5.5). mmol/L × 3.097."
          />
        </label>
        <FieldShell error={errors.phosphorusValue}>
          <input
            id="kfr-phosphorus"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Serum phosphorus"
            value={input.phosphorusValue}
            aria-invalid={Boolean(errors.phosphorusValue)}
            onChange={(e) => set({ phosphorusValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Phosphorus unit"
            value={input.phosphorusUnit}
            onChange={(e) =>
              setPhosphorusUnit(e.target.value as PhosphorusUnit)
            }
          >
            {(Object.keys(PHOSPHORUS_UNIT_LABELS) as PhosphorusUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {PHOSPHORUS_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.phosphorusValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.phosphorusValue}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="kfr-points-out">
          <span>Kidney failure risk score</span>
          <InfoTooltip
            label="Kidney failure risk score"
            text="Sum of Tangri 2011 categorical points (pts). Blank until age, eGFR, and the four serum labs are entered with eGFR &lt;60."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="kfr-points-out"
            className="w-full text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedPoints : ''}
          </output>
          <span className="shrink-0 pl-2 text-sm font-medium text-muted-foreground">
            pts
          </span>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational point score only — not medical advice.'}
        </p>
      </div>
    </form>
  );
}
