'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  creatinineToMgDl,
  mgDlToCreatinineUnit,
} from './calculation';
import type {
  AsaClass,
  CreatinineUnit,
  FunctionalStatus,
  GuptaProcedure,
  GuptaRiskFieldErrors,
  GuptaRiskInput,
  GuptaRiskResult,
} from './types';
import {
  ASA_OPTIONS,
  CREATININE_UNIT_LABELS,
  FUNCTIONAL_STATUS_OPTIONS,
  PROCEDURE_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const selectInlineClass =
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
  input: GuptaRiskInput;
  errors: GuptaRiskFieldErrors;
  result: GuptaRiskResult | null;
  onChange: (input: GuptaRiskInput) => void;
  onLoadExample: () => void;
}

export function GuptaRiskForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<GuptaRiskInput>) =>
    onChange({ ...input, ...patch });

  const switchCreatinineUnit = (next: CreatinineUnit) => {
    if (next === input.creatinineUnit || input.creatinineNotMeasured) {
      set({ creatinineUnit: next });
      return;
    }
    const raw = parseLoose(input.creatinineValue);
    let nextValue = input.creatinineValue;
    if (raw != null) {
      const mg = creatinineToMgDl(raw, input.creatinineUnit);
      if (mg != null) {
        nextValue = formatField(
          mgDlToCreatinineUnit(mg, next),
          next === 'umolL' ? 1 : 2
        );
      }
    }
    set({ creatinineUnit: next, creatinineValue: nextValue });
  };

  const toggleNotMeasured = (checked: boolean) => {
    set({
      creatinineNotMeasured: checked,
      creatinineValue: checked ? '' : input.creatinineValue,
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
        Complete the form and read the MICA score at the bottom.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Gupta perioperative MI or cardiac arrest (MICA) risk from the
        published NSQIP logistic model. Not medical advice. Entries stay in your
        browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 50 · ASA I · creatinine 1.0 mg/dL · anorectal)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="gupta-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Patient age in years. The NSQIP MICA model is validated for adults (typically age ≥16)."
          />
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="gupta-age"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Age in years"
            value={input.ageYears}
            aria-invalid={Boolean(errors.ageYears)}
            onChange={(e) => set({ ageYears: e.target.value })}
          />
          <span className="shrink-0 border-l border-border px-3 text-sm text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Status</span>
          <InfoTooltip
            label="Status"
            text="Functional status: totally independent (0), partially dependent (+0.65), or totally dependent (+1.03)."
          />
        </legend>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Functional status"
        >
          {FUNCTIONAL_STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="gupta-functional"
                className="h-4 w-4 accent-primary"
                checked={input.functionalStatus === opt.value}
                onChange={() =>
                  set({ functionalStatus: opt.value as FunctionalStatus })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="gupta-asa">
          <span>ASA Class</span>
          <InfoTooltip
            label="ASA Class"
            text="American Society of Anesthesiologists physical status (classes I–V). Coefficients are from Gupta Table 2 (reference class V = 0)."
          />
        </label>
        <select
          id="gupta-asa"
          className={selectClass}
          value={input.asaClass}
          onChange={(e) => set({ asaClass: e.target.value as AsaClass })}
        >
          {ASA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="gupta-creatinine">
          <span>Creatinine</span>
          <InfoTooltip
            label="Creatinine"
            text="Serum creatinine: ≤1.5 mg/dL (0), &gt;1.5 mg/dL (+0.61), or choose “not measured” (−0.10). Blank or zero without “not measured” keeps MICA blank."
          />
        </label>
        <FieldShell error={errors.creatinineValue}>
          <input
            id="gupta-creatinine"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Creatinine"
            disabled={input.creatinineNotMeasured}
            value={input.creatinineValue}
            aria-invalid={Boolean(errors.creatinineValue)}
            onChange={(e) => set({ creatinineValue: e.target.value })}
          />
          <select
            className={selectInlineClass}
            aria-label="Creatinine unit"
            disabled={input.creatinineNotMeasured}
            value={input.creatinineUnit}
            onChange={(e) =>
              switchCreatinineUnit(e.target.value as CreatinineUnit)
            }
          >
            {(Object.keys(CREATININE_UNIT_LABELS) as CreatinineUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {CREATININE_UNIT_LABELS[u]}
                </option>
              )
            )}
          </select>
        </FieldShell>
        <label className="mt-2 inline-flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-primary"
            checked={input.creatinineNotMeasured}
            onChange={(e) => toggleNotMeasured(e.target.checked)}
          />
          Creatinine not measured
        </label>
        {errors.creatinineValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.creatinineValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gupta-procedure">
          <span>Procedure</span>
          <InfoTooltip
            label="Procedure"
            text="NSQIP procedure category (hernia = reference 0). Choose the category closest to the planned operation."
          />
        </label>
        <select
          id="gupta-procedure"
          className={selectClass}
          value={input.procedure}
          onChange={(e) =>
            set({ procedure: e.target.value as GuptaProcedure })
          }
        >
          {PROCEDURE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="gupta-mica-out">
          <span>MICA score</span>
          <InfoTooltip
            label="MICA score"
            text="Estimated risk (%) of myocardial infarction or cardiac arrest within 30 days after surgery. Blank until age and creatinine category are valid."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3">
          <output
            id="gupta-mica-out"
            className="w-full text-right text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedMicaPercent : ''}
          </output>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational MICA estimate only — not a treatment or consent decision.'}
        </p>
      </div>
    </form>
  );
}