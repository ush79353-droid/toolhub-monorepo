'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BeeActivity,
  BeeCalculatorFieldErrors,
  BeeCalculatorInput,
  BeeCalculatorResult,
  BeeStress,
  BeeTemperature,
  EnergyUnit,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: BeeCalculatorInput;
  errors: BeeCalculatorFieldErrors;
  result: BeeCalculatorResult | null;
  onChange: (input: BeeCalculatorInput) => void;
}

export function BeeCalculatorForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<BeeCalculatorInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex gap-4 text-sm">
            {(['male', 'female'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 capitalize">
                <input type="radio" checked={input.sex === s} onChange={() => set({ sex: s })} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Age (in years)" error={errors.ageYearsText} suffix="yrs">
          <input
            className={inputClass}
            value={input.ageYearsText}
            inputMode="decimal"
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
        </Field>

        <Field label="Height" error={errors.heightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.heightText}
              inputMode="decimal"
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.heightUnit}
              onChange={(e) => set({ heightUnit: e.target.value as HeightUnit })}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </Field>

        <Field label="Weight" error={errors.weightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.weightText}
              inputMode="decimal"
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </Field>

        <SelectField
          label="Activity"
          tooltip="Physical activity multiplier applied to BEE for TEE."
          value={input.activity}
          options={[
            ['bed_rest', 'Bed rest'],
            ['light_sedentary', 'Light or sedentary'],
            ['moderate', 'Moderate'],
            ['heavy', 'Heavy'],
          ]}
          onChange={(v) => set({ activity: v as BeeActivity })}
        />
        <SelectField
          label="Stress"
          tooltip="Clinical stress factor — does not change displayed BEE."
          value={input.stress}
          options={[
            ['none', 'None'],
            ['minor', 'Minor'],
            ['moderate', 'Moderate'],
            ['severe', 'Severe'],
          ]}
          onChange={(v) => set({ stress: v as BeeStress })}
        />
        <SelectField
          label="Temperature"
          value={input.temperature}
          options={[
            ['normal', 'Normal'],
            ['fever_low', 'Low-grade fever'],
            ['fever_high', 'Fever'],
          ]}
          onChange={(v) => set({ temperature: v as BeeTemperature })}
        />
      </section>

      <section className={sectionClass} aria-label="Results">
        <Field label="BEE" tooltip="Revised Harris–Benedict basal energy expenditure.">
          <div className="flex gap-2">
            <input readOnly className={`${inputClass} bg-sky-50/60`} value={result?.beeDisplay ?? ''} />
            <EnergyUnitSelect value={input.energyUnit} onChange={(u) => set({ energyUnit: u })} />
          </div>
        </Field>
        <Field label="Total energy expenditure" tooltip="TEE = BEE × activity × stress × temperature.">
          <MotionReadOnly value={result?.teeDisplay ?? ''} unit={input.energyUnit} />
        </Field>
      </section>
    </form>
  );
}

function MotionReadOnly({ value, unit }: { value: string; unit: EnergyUnit }) {
  return (
    <div className="flex gap-2">
      <input readOnly className={`${inputClass} bg-sky-50/60`} value={value} />
      <span className="flex h-11 items-center text-xs text-muted-foreground">
        {unit === 'kcal_day' ? 'kcal/day' : 'MJ/day'}
      </span>
    </div>
  );
}

function EnergyUnitSelect({
  value,
  onChange,
}: {
  value: EnergyUnit;
  onChange: (u: EnergyUnit) => void;
}) {
  return (
    <select
      className="h-11 rounded-lg border border-border px-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value as EnergyUnit)}
    >
      <option value="kcal_day">kcal/day</option>
      <option value="mj_day">MJ/day</option>
    </select>
  );
}

function Field({
  label,
  tooltip,
  error,
  suffix,
  children,
}: {
  label: string;
  tooltip?: string;
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {tooltip ? <InfoTooltip text={tooltip} /> : null}
        {suffix ? <span className="text-muted-foreground font-normal"> ({suffix})</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  tooltip,
  value,
  options,
  onChange,
}: {
  label: string;
  tooltip?: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} tooltip={tooltip}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </Field>
  );
}