'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cholesterolToMgDl,
  mgDlToCholesterolUnit,
} from './calculation';
import type {
  CholesterolUnit,
  FraminghamRiskFieldErrors,
  FraminghamRiskInput,
  FraminghamRiskResult,
  Sex,
  YesNo,
} from './types';
import {
  CHOLESTEROL_UNIT_LABELS,
  SEX_OPTIONS,
  YES_NO_OPTIONS,
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

function switchCholesterolUnit(
  raw: string,
  from: CholesterolUnit,
  to: CholesterolUnit
): string {
  if (from === to) return raw;
  const n = parseLoose(raw);
  if (n == null) return raw;
  const mgDl = cholesterolToMgDl(n, from);
  if (mgDl == null) return raw;
  const next = mgDlToCholesterolUnit(mgDl, to);
  return formatField(next, to === 'mmol_l' ? 2 : 0);
}

interface Props {
  input: FraminghamRiskInput;
  errors: FraminghamRiskFieldErrors;
  result: FraminghamRiskResult | null;
  onChange: (input: FraminghamRiskInput) => void;
  onLoadExample: () => void;
}

export function FraminghamRiskForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<FraminghamRiskInput>) =>
    onChange({ ...input, ...patch });

  const setTcUnit = (next: CholesterolUnit) => {
    if (next === input.totalCholesterolUnit) return;
    set({
      totalCholesterolUnit: next,
      totalCholesterolValue: switchCholesterolUnit(
        input.totalCholesterolValue,
        input.totalCholesterolUnit,
        next
      ),
    });
  };

  const setHdlUnit = (next: CholesterolUnit) => {
    if (next === input.hdlCholesterolUnit) return;
    set({
      hdlCholesterolUnit: next,
      hdlCholesterolValue: switchCholesterolUnit(
        input.hdlCholesterolValue,
        input.hdlCholesterolUnit,
        next
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
        Complete the form and read the Framingham hard CHD risk score in points
        at the bottom.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ATP III Framingham point total for hard coronary heart
        disease (myocardial infarction or coronary death). Not a treatment
        decision. Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (man 45 · SBP 130 · TC 180 · HDL 50 → 7 pts)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="frs-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text={`Whole years between ${20} and ${79}. ATP III age points use sex-specific 5-year bands.`}
          />
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="frs-age"
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
          <span>Sex</span>
          <InfoTooltip
            label="Sex"
            text="ATP III uses separate point tables for women and men."
          />
        </legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Sex">
          {SEX_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="frs-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === opt.value}
                onChange={() => set({ sex: opt.value as Sex })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Blood pressure treatment?</span>
          <InfoTooltip
            label="Blood pressure treatment"
            text="Whether the patient is taking medication for hypertension; ATP III uses different systolic BP point columns when treated."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Blood pressure treatment"
        >
          {YES_NO_OPTIONS.map((opt) => (
            <label
              key={`bp-${opt.value}`}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="frs-bp-treatment"
                className="h-4 w-4 accent-primary"
                checked={input.bpTreatment === opt.value}
                onChange={() => set({ bpTreatment: opt.value as YesNo })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="frs-sbp">
          <span>Systolic blood pressure</span>
          <InfoTooltip
            label="Systolic blood pressure"
            text="Systolic blood pressure in mmHg. Scored in ATP III bands with separate treated vs untreated columns."
          />
        </label>
        <FieldShell error={errors.sbpMmHg}>
          <input
            id="frs-sbp"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Systolic blood pressure"
            value={input.sbpMmHg}
            aria-invalid={Boolean(errors.sbpMmHg)}
            onChange={(e) => set({ sbpMmHg: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
            mmHg
          </span>
        </FieldShell>
        {errors.sbpMmHg ? (
          <p className="mt-1 text-xs text-rose-600">{errors.sbpMmHg}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="frs-tc">
          <span>Total cholesterol</span>
          <InfoTooltip
            label="Total cholesterol"
            text="Total cholesterol; engine stores mg/dL. mmol/L is converted × 38.67. Points depend on age band."
          />
        </label>
        <FieldShell error={errors.totalCholesterolValue}>
          <input
            id="frs-tc"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Total cholesterol"
            value={input.totalCholesterolValue}
            aria-invalid={Boolean(errors.totalCholesterolValue)}
            onChange={(e) => set({ totalCholesterolValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Total cholesterol unit"
            value={input.totalCholesterolUnit}
            onChange={(e) => setTcUnit(e.target.value as CholesterolUnit)}
          >
            {(Object.keys(CHOLESTEROL_UNIT_LABELS) as CholesterolUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {CHOLESTEROL_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.totalCholesterolValue ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.totalCholesterolValue}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="frs-hdl">
          <span>HDL cholesterol</span>
          <InfoTooltip
            label="HDL cholesterol"
            text="HDL cholesterol in mg/dL (or mmol/L converted × 38.67). Same HDL points for both sexes."
          />
        </label>
        <FieldShell error={errors.hdlCholesterolValue}>
          <input
            id="frs-hdl"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="HDL cholesterol"
            value={input.hdlCholesterolValue}
            aria-invalid={Boolean(errors.hdlCholesterolValue)}
            onChange={(e) => set({ hdlCholesterolValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="HDL cholesterol unit"
            value={input.hdlCholesterolUnit}
            onChange={(e) => setHdlUnit(e.target.value as CholesterolUnit)}
          >
            {(Object.keys(CHOLESTEROL_UNIT_LABELS) as CholesterolUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {CHOLESTEROL_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        {errors.hdlCholesterolValue ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.hdlCholesterolValue}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Smoker</span>
          <InfoTooltip
            label="Smoker"
            text="Current cigarette smoker adds age-band-dependent points; nonsmoker adds 0."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Smoker"
        >
          {YES_NO_OPTIONS.map((opt) => (
            <label
              key={`smoke-${opt.value}`}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="frs-smoker"
                className="h-4 w-4 accent-primary"
                checked={input.smoker === opt.value}
                onChange={() => set({ smoker: opt.value as YesNo })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="frs-points-out">
          <span>Risk score</span>
          <InfoTooltip
            label="Risk score"
            text="ATP III Framingham hard CHD point total (pts). Blank until age, systolic BP, total cholesterol, and HDL are entered."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="frs-points-out"
            className="w-full text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedPoints : ''}
          </output>
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