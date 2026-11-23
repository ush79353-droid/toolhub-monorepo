'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, toCm } from './calculation';
import type {
  DimensionUnit,
  KnowBsa,
  LvFieldErrors,
  LvInput,
  LvResult,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
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

interface Props {
  input: LvInput;
  errors: LvFieldErrors;
  result: LvResult | null;
  onChange: (input: LvInput) => void;
}

export function LvForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<LvInput>) => onChange({ ...input, ...patch });

  const switchUnit = (next: DimensionUnit) => {
    if (next === input.dimensionUnit) return;
    const convert = (raw: string) => {
      const t = raw.trim();
      if (t === '' || !/^\d+(\.\d+)?$/.test(t)) return raw;
      const n = Number(t);
      const cm = toCm(n, input.dimensionUnit);
      const v = fromCm(cm, next);
      return String(Math.round(v * 1000) / 1000);
    };
    set({
      dimensionUnit: next,
      lvedd: convert(input.lvedd),
      ivsd: convert(input.ivsd),
      pwd: convert(input.pwd),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ASE cube-formula LV mass, LVMI, and RWT. Sex labels reference
        ranges only. Entries stay in your browser.
      </p>

      <fieldset>
        <legend className={labelClass}>Sex</legend>
        <div className="flex flex-wrap gap-4">
          {([
            ['female', 'Female'],
            ['male', 'Male'],
          ] as [Sex, string][]).map(([v, label]) => (
            <label key={v} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="lv-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === v}
                onChange={() => set({ sex: v })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>
          <span>Do you know body surface area?</span>
          <InfoTooltip
            label="BSA"
            text="Yes: enter BSA in m². No: enter height (cm) and weight (kg); BSA uses Mosteller √(H×W/3600)."
          />
        </legend>
        <div className="flex flex-wrap gap-4">
          {([
            ['yes', 'Yes'],
            ['no', 'No'],
          ] as [KnowBsa, string][]).map(([v, label]) => (
            <label key={v} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="lv-bsa-known"
                className="h-4 w-4 accent-primary"
                checked={input.knowBsa === v}
                onChange={() => set({ knowBsa: v })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {input.knowBsa === 'yes' ? (
        <div>
          <label className={labelClass} htmlFor="lv-bsa">
            Body surface area
          </label>
          <FieldShell error={errors.bsaM2}>
            <input
              id="lv-bsa"
              className={inputClass}
              inputMode="decimal"
              value={input.bsaM2}
              aria-invalid={Boolean(errors.bsaM2)}
              onChange={(e) => set({ bsaM2: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">m²</span>
          </FieldShell>
          {errors.bsaM2 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bsaM2}</p>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="lv-height">
              Height
            </label>
            <FieldShell error={errors.heightCm}>
              <input
                id="lv-height"
                className={inputClass}
                inputMode="decimal"
                value={input.heightCm}
                onChange={(e) => set({ heightCm: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">cm</span>
            </FieldShell>
            {errors.heightCm ? (
              <p className="mt-1 text-xs text-rose-600">{errors.heightCm}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="lv-weight">
              Weight
            </label>
            <FieldShell error={errors.weightKg}>
              <input
                id="lv-weight"
                className={inputClass}
                inputMode="decimal"
                value={input.weightKg}
                onChange={(e) => set({ weightKg: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">kg</span>
            </FieldShell>
            {errors.weightKg ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weightKg}</p>
            ) : null}
          </div>
        </div>
      )}

      {(
        [
          ['lvedd', 'LVEDD', errors.lvedd],
          ['ivsd', 'IVSd', errors.ivsd],
          ['pwd', 'PWd', errors.pwd],
        ] as const
      ).map(([key, label, err]) => (
        <div key={key}>
          <label className={labelClass} htmlFor={`lv-${key}`}>
            {label}
          </label>
          <FieldShell error={err}>
            <input
              id={`lv-${key}`}
              className={inputClass}
              inputMode="decimal"
              value={input[key]}
              aria-invalid={Boolean(err)}
              onChange={(e) => set({ [key]: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label={`${label} unit`}
              value={input.dimensionUnit}
              onChange={(e) => switchUnit(e.target.value as DimensionUnit)}
            >
              <option value="mm">mm</option>
              <option value="cm">cm</option>
            </select>
          </FieldShell>
          {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
        </div>
      ))}

      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-accent">Result</h3>
        {(
          [
            ['Left ventricular mass', result?.formattedMass ?? '', 'g'],
            ['LVMI', result?.formattedLvmi ?? '', 'g / m²'],
            ['Relative wall thickness (RWT)', result?.formattedRwt ?? '', ''],
          ] as const
        ).map(([label, value, unit]) => (
          <div key={label}>
            <p className="mb-1.5 text-[13px] font-medium text-accent">{label}</p>
            <FieldShell muted>
              <output className="w-full px-3 text-sm tabular-nums font-semibold text-accent">
                {value}
              </output>
              {unit ? (
                <span className="pr-3 text-sm text-muted-foreground">{unit}</span>
              ) : null}
            </FieldShell>
          </div>
        ))}
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.massIndexCategory}. {result.rwtCategory}. {result.disclaimer}
          </p>
        ) : null}
      </div>
    </form>
  );
}
