'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DlbclPrognosisFieldErrors,
  DlbclPrognosisInput,
  DlbclPrognosisResult,
  EcogBand,
  ExtranodalBand,
  LdhBand,
  StageBand,
} from './types';
import {
  ECOG_OPTIONS,
  EXTRANODAL_OPTIONS,
  LDH_OPTIONS,
  STAGE_OPTIONS,
} from './types';

const labelClass = 'mb-2 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  tooltip,
}: {
  legend: string;
  name: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  tooltip?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={`${labelClass} flex items-center gap-1.5`}>
        {legend}
        {tooltip ? <InfoTooltip text={tooltip} /> : null}
      </legend>
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="radio"
            name={name}
            className="h-4 w-4 accent-primary"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  );
}

interface Props {
  input: DlbclPrognosisInput;
  errors: DlbclPrognosisFieldErrors;
  result: DlbclPrognosisResult | null;
  onChange: (input: DlbclPrognosisInput) => void;
}

export function DlbclPrognosisForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<DlbclPrognosisInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="dlbcl-age">
          Age in years
        </label>
        <div
          className={`flex h-11 items-center rounded-lg border ${
            errors.ageYearsText ? 'border-rose-400' : 'border-border'
          }`}
        >
          <input
            id="dlbcl-age"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ageYearsText}
            onChange={(e) => set({ ageYearsText: e.target.value })}
            autoComplete="off"
          />
          <span className={unitFixed}>yrs</span>
        </div>
        {errors.ageYearsText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">R-IPI: age &gt; 60 years scores 1 point.</p>
        )}
      </div>

      <RadioGroup<StageBand>
        legend="Stage"
        name="stage"
        value={input.stage}
        options={STAGE_OPTIONS}
        onChange={(v) => set({ stage: v })}
        tooltip="Ann Arbor stage grouping."
      />

      <RadioGroup<ExtranodalBand>
        legend="Extranodal sites"
        name="extranodal"
        value={input.extranodalSites}
        options={EXTRANODAL_OPTIONS}
        onChange={(v) => set({ extranodalSites: v })}
      />

      <RadioGroup<LdhBand>
        legend="LDH"
        name="ldh"
        value={input.ldh}
        options={LDH_OPTIONS}
        onChange={(v) => set({ ldh: v })}
        tooltip="Use your laboratory ULN when available."
      />

      <RadioGroup<EcogBand>
        legend="ECOG / Zubrod performance status"
        name="ecog"
        value={input.ecog}
        options={ECOG_OPTIONS}
        onChange={(v) => set({ ecog: v })}
      />

      <div>
        <div className={labelClass}>Total points</div>
        <div className="flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary" aria-live="polite">
          {result?.formattedScore ?? '0'}
        </div>
      </div>

      {result ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/15 p-3 text-xs text-muted-foreground">
          {result.fourYearProgressionFreeSurvivalPercent != null ? (
            <p>
              Estimated 4-year progression-free survival: {result.fourYearProgressionFreeSurvivalPercent}%
            </p>
          ) : null}
          {result.fourYearOverallSurvivalPercent != null ? (
            <p>Estimated 4-year overall survival: {result.fourYearOverallSurvivalPercent}%</p>
          ) : null}
          <p className="font-medium text-accent">{result.riskGroupLabel}</p>
        </div>
      ) : null}
    </form>
  );
}