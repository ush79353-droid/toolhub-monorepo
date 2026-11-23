'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CerebralPerfusionPressureFieldErrors,
  CerebralPerfusionPressureInput,
  CerebralPerfusionPressureResult,
  CppAgeGroup,
} from './types';
import { AGE_GROUP_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const suffixClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface Props {
  input: CerebralPerfusionPressureInput;
  errors: CerebralPerfusionPressureFieldErrors;
  result: CerebralPerfusionPressureResult | null;
  onChange: (input: CerebralPerfusionPressureInput) => void;
  onLoadExample: () => void;
}

export function CerebralPerfusionPressureForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<CerebralPerfusionPressureInput>) =>
    onChange({ ...input, ...patch });

  const mapDisplay = input.calculateMap
    ? result?.formattedMap ?? ''
    : input.mapMmHg;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter MAP and ICP (mmHg) to see cerebral perfusion pressure.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational arithmetic only (CPP = MAP − ICP). Age-group bands are
        literature reference ranges, not treatment targets. Entries stay in your
        browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (MAP 90 − ICP 15 → CPP 75)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="cpp-age-group">
          <span>Age group</span>
          <InfoTooltip
            label="Age group"
            text="Selects an educational literature reference band for CPP. It does not change the CPP = MAP − ICP formula and does not set a treatment target."
          />
        </label>
        <select
          id="cpp-age-group"
          className={selectClass}
          aria-label="Age group"
          value={input.ageGroup}
          onChange={(e) => set({ ageGroup: e.target.value as CppAgeGroup })}
        >
          {AGE_GROUP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          checked={input.calculateMap}
          onChange={(e) => set({ calculateMap: e.target.checked })}
        />
        <span>I want to calculate the mean arterial pressure (MAP)</span>
      </label>

      {input.calculateMap ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3.5">
          <div>
            <label className={labelClass} htmlFor="cpp-sbp">
              <span>Systolic blood pressure (SBP)</span>
              <InfoTooltip
                label="SBP"
                text="Peak arterial pressure (mmHg). Used with DBP in MAP ≈ (SBP + 2×DBP) ÷ 3."
              />
            </label>
            <FieldShell error={errors.sbpMmHg}>
              <input
                id="cpp-sbp"
                className={inputClass}
                inputMode="decimal"
                aria-label="Systolic blood pressure"
                value={input.sbpMmHg}
                aria-invalid={Boolean(errors.sbpMmHg)}
                onChange={(e) => set({ sbpMmHg: e.target.value })}
              />
              <span className={suffixClass}>mmHg</span>
            </FieldShell>
            {errors.sbpMmHg ? (
              <p className="mt-1 text-xs text-rose-600">{errors.sbpMmHg}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="cpp-dbp">
              <span>Diastolic blood pressure (DBP)</span>
              <InfoTooltip
                label="DBP"
                text="Trough arterial pressure (mmHg). Must be less than or equal to SBP for MAP estimation."
              />
            </label>
            <FieldShell error={errors.dbpMmHg}>
              <input
                id="cpp-dbp"
                className={inputClass}
                inputMode="decimal"
                aria-label="Diastolic blood pressure"
                value={input.dbpMmHg}
                aria-invalid={Boolean(errors.dbpMmHg)}
                onChange={(e) => set({ dbpMmHg: e.target.value })}
              />
              <span className={suffixClass}>mmHg</span>
            </FieldShell>
            {errors.dbpMmHg ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dbpMmHg}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="cpp-map">
          <span>Mean arterial pressure (MAP)</span>
          <InfoTooltip
            label="MAP"
            text="Driving arterial pressure for cerebral blood flow (mmHg). Enter a measured MAP, or check the box above to estimate MAP from SBP and DBP."
          />
        </label>
        <FieldShell error={errors.mapMmHg}>
          <input
            id="cpp-map"
            className={inputClass}
            inputMode="decimal"
            aria-label="Mean arterial pressure"
            value={mapDisplay}
            readOnly={input.calculateMap}
            aria-invalid={Boolean(errors.mapMmHg)}
            onChange={(e) => {
              if (!input.calculateMap) set({ mapMmHg: e.target.value });
            }}
          />
          <span className={suffixClass}>mmHg</span>
        </FieldShell>
        {errors.mapMmHg ? (
          <p className="mt-1 text-xs text-rose-600">{errors.mapMmHg}</p>
        ) : null}
        {input.calculateMap && result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Calculated MAP (not a direct arterial measurement):{' '}
            <span className="font-medium text-accent">{result.formattedMap} mmHg</span>
          </p>
        ) : null}
        {input.calculateMap && !result && !errors.sbpMmHg && !errors.dbpMmHg ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter SBP and DBP to calculate MAP.
          </p>
        ) : null}
        {!input.calculateMap && input.mapMmHg.trim() ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Measured / entered MAP (not estimated from cuff SBP/DBP in this mode).
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="cpp-icp">
          <span>Intracranial pressure (ICP)</span>
          <InfoTooltip
            label="ICP"
            text="Pressure inside the skull (mmHg), typically from invasive monitoring by specialized clinicians. Required for CPP."
          />
        </label>
        <FieldShell error={errors.icpMmHg}>
          <input
            id="cpp-icp"
            className={inputClass}
            inputMode="decimal"
            aria-label="Intracranial pressure"
            value={input.icpMmHg}
            aria-invalid={Boolean(errors.icpMmHg)}
            onChange={(e) => set({ icpMmHg: e.target.value })}
          />
          <span className={suffixClass}>mmHg</span>
        </FieldShell>
        {errors.icpMmHg ? (
          <p className="mt-1 text-xs text-rose-600">{errors.icpMmHg}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="cpp-out">
          <span>Cerebral perfusion pressure (CPP)</span>
          <InfoTooltip
            label="CPP"
            text="CPP = MAP − ICP (mmHg). Blank until both MAP and ICP are valid. Not a treatment recommendation."
          />
        </label>
        <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60">
          <output
            id="cpp-out"
            className="w-full px-3 text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? result.formattedCpp : ''}
          </output>
          <span className={suffixClass}>mmHg</span>
        </div>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational arithmetic only — not a treatment target or clinical recommendation.'}
        </p>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
