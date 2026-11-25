'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DISCLAIMER } from './content';
import type {
  LungNoduleGrowthRateFieldErrors,
  LungNoduleGrowthRateInput,
  LungNoduleGrowthRateResult,
  NoduleType,
  Sex,
  YesNo,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const resultField =
  'flex h-11 items-center justify-between rounded-lg border border-border bg-muted/25 px-3 text-sm tabular-nums text-accent';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function YesNoRow({
  name,
  label,
  tip,
  value,
  onChange,
}: {
  name: string;
  label: string;
  tip?: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>
        {label}
        {tip ? <InfoTooltip text={tip} /> : null}
      </legend>
      <div className="flex flex-wrap gap-4">
        {(['yes', 'no'] as const).map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name={name}
              className="h-4 w-4 accent-primary"
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt === 'yes' ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface FormProps {
  input: LungNoduleGrowthRateInput;
  errors: LungNoduleGrowthRateFieldErrors;
  result: LungNoduleGrowthRateResult | null;
  onChange: (input: LungNoduleGrowthRateInput) => void;
}

export function LungNoduleGrowthRateForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<LungNoduleGrowthRateInput>) =>
    onChange({ ...input, ...patch });

  const logOdds =
    result?.logOdds != null ? result.formattedLogOdds : '—';
  const probability =
    result?.probabilityPercent != null ? result.formattedProbability : '—';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Brock / PanCan malignancy probability (educational). Not volume
        doubling time. {DISCLAIMER} Share uses the page URL only — never clinical
        inputs.
      </p>

      <div>
        <label className={labelClass} htmlFor="lngr-age">
          Age
        </label>
        <FieldShell error={errors.ageText}>
          <input
            id="lngr-age"
            className={inputClass}
            inputMode="decimal"
            value={input.ageText}
            onChange={(e) => set({ ageText: e.target.value })}
            aria-invalid={Boolean(errors.ageText)}
          />
          <span className={unitFixed}>years</span>
        </FieldShell>
        {errors.ageText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Sex</legend>
        <div className="flex flex-wrap gap-4">
          {(
            [
              ['female', 'Female'],
              ['male', 'Male'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="lngr-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === value}
                onChange={() => set({ sex: value as Sex })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <YesNoRow
        name="lngr-emphysema"
        label="Emphysema"
        tip="Chronic lung disease with pathologically inflated air spaces; yes if present on CT or history."
        value={input.emphysema}
        onChange={(v) => set({ emphysema: v })}
      />
      <YesNoRow
        name="lngr-family"
        label="Family history"
        tip="Family history of lung cancer (first-degree relative)."
        value={input.familyHistory}
        onChange={(v) => set({ familyHistory: v })}
      />
      <YesNoRow
        name="lngr-spiculation"
        label="Spiculation"
        tip="Spiculated nodule margin on CT."
        value={input.spiculation}
        onChange={(v) => set({ spiculation: v })}
      />
      <YesNoRow
        name="lngr-upper"
        label="Upper lung nodule"
        tip="Nodule located in an upper lobe."
        value={input.upperLobe}
        onChange={(v) => set({ upperLobe: v })}
      />

      <div>
        <label className={labelClass} htmlFor="lngr-count">
          Nodule count
        </label>
        <FieldShell error={errors.countText}>
          <input
            id="lngr-count"
            className={inputClass}
            inputMode="decimal"
            value={input.countText}
            onChange={(e) => set({ countText: e.target.value })}
            aria-invalid={Boolean(errors.countText)}
          />
        </FieldShell>
        {errors.countText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.countText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lngr-size">
          Nodule size
        </label>
        <FieldShell error={errors.sizeText}>
          <input
            id="lngr-size"
            className={inputClass}
            inputMode="decimal"
            value={input.sizeText}
            onChange={(e) => set({ sizeText: e.target.value })}
            aria-invalid={Boolean(errors.sizeText)}
          />
          <span className={unitFixed}>mm</span>
        </FieldShell>
        {errors.sizeText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.sizeText}</p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Nodule type</legend>
        <div className="flex flex-col gap-2">
          {(
            [
              ['nonsolid', 'Nonsolid or ground-glass'],
              ['partSolid', 'Partially solid'],
              ['solid', 'Solid'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="lngr-type"
                className="h-4 w-4 accent-primary"
                checked={input.noduleType === value}
                onChange={() => set({ noduleType: value as NoduleType })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <div>
          <div className={labelClass}>
            log odds
            <InfoTooltip text="Natural log of the odds of malignancy from Brock model 2b before converting to probability." />
          </div>
          <div className={resultField} aria-live="polite">
            <span>{logOdds}</span>
          </div>
        </div>
        <div>
          <div className={labelClass}>Cancer probability</div>
          <div className={resultField} aria-live="polite">
            <span>{probability}</span>
            <span className="font-mono text-xs text-muted-foreground">%</span>
          </div>
        </div>
        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </div>
    </form>
  );
}
