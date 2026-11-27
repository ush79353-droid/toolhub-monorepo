'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromKg, toKg } from './calculation';
import type {
  ParklandFieldErrors,
  ParklandInput,
  ParklandResult,
  PatientAgeGroup,
  RegionBurn,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const selectFieldClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const HEAD_OPTIONS: { value: RegionBurn; label: string }[] = [
  { value: 'none', label: 'Not affected' },
  { value: 'entire', label: 'Entire head' },
  { value: 'front', label: 'Front of head' },
  { value: 'back', label: 'Back of head' },
];

const TORSO_OPTIONS: { value: RegionBurn; label: string }[] = [
  { value: 'none', label: 'Not affected' },
  { value: 'entire', label: 'Entire torso' },
  { value: 'front', label: 'Front of torso' },
  { value: 'back', label: 'Back of torso' },
  { value: 'chest', label: 'Chest' },
  { value: 'abdomen', label: 'Abdomen' },
];

const ARM_OPTIONS: { value: RegionBurn; label: string }[] = [
  { value: 'none', label: 'Not affected' },
  { value: 'entire', label: 'Entire arm' },
  { value: 'front', label: 'Front of arm' },
  { value: 'back', label: 'Back of arm' },
  { value: 'halfFront', label: 'Half of the front of the arm' },
  { value: 'halfBack', label: 'Half of the back of the arm' },
];

const LEG_OPTIONS: { value: RegionBurn; label: string }[] = [
  { value: 'none', label: 'Not affected' },
  { value: 'entire', label: 'Entire leg' },
  { value: 'front', label: 'Front of leg' },
  { value: 'back', label: 'Back of leg' },
  { value: 'halfFront', label: 'Half of the front of the leg' },
  { value: 'halfBack', label: 'Half of the back of the leg' },
];

const GROIN_OPTIONS: { value: RegionBurn; label: string }[] = [
  { value: 'none', label: 'Not affected' },
  { value: 'affected', label: 'Affected' },
];

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function RegionSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: RegionBurn;
  options: { value: RegionBurn; label: string }[];
  onChange: (v: RegionBurn) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={selectFieldClass}
        value={value}
        onChange={(e) => onChange(e.target.value as RegionBurn)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FormProps {
  input: ParklandInput;
  errors: ParklandFieldErrors;
  result: ParklandResult | null;
  onChange: (input: ParklandInput) => void;
}

export function ParklandFormulaForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<ParklandInput>) =>
    onChange({ ...input, ...patch });

  const changeWeightUnit = (next: WeightUnit) => {
    const raw = input.weightText.trim();
    if (raw !== '') {
      const n = Number(raw.replace(/,/g, ''));
      if (Number.isFinite(n) && n > 0) {
        const kg = toKg(n, input.weightUnit);
        const converted = fromKg(kg, next);
        set({
          weightUnit: next,
          weightText: String(Number(converted.toFixed(4))),
        });
        return;
      }
    }
    set({ weightUnit: next });
  };

  const tbsaDisplay = result?.formattedTbsa ?? '0%';
  const hasVolumes =
    result?.totalMl24h !== null && result?.totalMl24h !== undefined;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Patient profile">
        <fieldset>
          <legend className={labelClass}>Adult or child</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['adult', 'Adult'],
                ['child', 'Child'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="parkland-age"
                  checked={input.ageGroup === value}
                  onChange={() =>
                    set({ ageGroup: value as PatientAgeGroup })
                  }
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="parkland-weight">
            Weight
            <InfoTooltip text="Converted to kilograms before Parkland math. Changing units preserves mass." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="parkland-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                changeWeightUnit(e.target.value as WeightUnit)
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>
      </section>

      <section
        className={sectionClass}
        aria-label="Body areas with 2nd and 3rd degree burns"
      >
        <h3 className="text-sm font-semibold text-accent">
          Body areas with 2nd and 3rd degree burns
        </h3>
        <p className="text-xs text-muted-foreground">
          Mark partial-/full-thickness burns only. Avoid double-counting the
          same surface.
        </p>

        <RegionSelect
          id="parkland-head"
          label="Head"
          value={input.head}
          options={HEAD_OPTIONS}
          onChange={(head) => set({ head })}
        />
        <RegionSelect
          id="parkland-torso"
          label="Torso"
          value={input.torso}
          options={TORSO_OPTIONS}
          onChange={(torso) => set({ torso })}
        />
        <RegionSelect
          id="parkland-arm"
          label="Arm"
          value={input.arm}
          options={ARM_OPTIONS}
          onChange={(arm) => set({ arm })}
        />
        <RegionSelect
          id="parkland-leg"
          label="Leg"
          value={input.leg}
          options={LEG_OPTIONS}
          onChange={(leg) => set({ leg })}
        />
        <RegionSelect
          id="parkland-groin"
          label="Groin"
          value={input.groin}
          options={GROIN_OPTIONS}
          onChange={(groin) => set({ groin })}
        />
        <RegionSelect
          id="parkland-add-arm"
          label="Additional arm area"
          value={input.additionalArm}
          options={ARM_OPTIONS}
          onChange={(additionalArm) => set({ additionalArm })}
        />
        <RegionSelect
          id="parkland-add-leg"
          label="Additional leg area"
          value={input.additionalLeg}
          options={LEG_OPTIONS}
          onChange={(additionalLeg) => set({ additionalLeg })}
        />

        <div>
          <label className={labelClass} htmlFor="parkland-tbsa">
            Burn percentage
          </label>
          <FieldShell muted>
            <input
              id="parkland-tbsa"
              type="text"
              readOnly
              className={inputClass}
              value={tbsaDisplay.replace(/%$/, '')}
              aria-label="Burn percentage TBSA"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
        </div>
      </section>

      <section
        className={sectionClass}
        aria-label="Fluids to give over first 24 hours"
      >
        <h3 className="text-sm font-semibold text-accent">
          Fluids to give over first 24 hours
        </h3>
        <div>
          <label className={labelClass} htmlFor="parkland-total">
            Total fluids
          </label>
          <FieldShell muted>
            <input
              id="parkland-total"
              type="text"
              readOnly
              className={inputClass}
              value={hasVolumes ? result.formattedTotal24h : ''}
              placeholder={result?.statusHeadline}
            />
            <span className={unitFixed}>mL/24h</span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-label="First 8 hours">
        <h3 className="text-sm font-semibold text-accent">
          First 8 hours (50% of total)
        </h3>
        <div>
          <label className={labelClass} htmlFor="parkland-first8">
            Total amount / 8h
          </label>
          <FieldShell muted>
            <input
              id="parkland-first8"
              type="text"
              readOnly
              className={inputClass}
              value={hasVolumes ? result.formattedFirst8 : ''}
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="parkland-rate8">
            IV flow
          </label>
          <FieldShell muted>
            <input
              id="parkland-rate8"
              type="text"
              readOnly
              className={inputClass}
              value={hasVolumes ? result.formattedFirst8Rate : ''}
            />
            <span className={unitFixed}>mL/h</span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-label="Next 16 hours">
        <h3 className="text-sm font-semibold text-accent">
          Next 16 hours (remaining 50% of total)
        </h3>
        <div>
          <label className={labelClass} htmlFor="parkland-next16">
            Total amount / 16h
          </label>
          <FieldShell muted>
            <input
              id="parkland-next16"
              type="text"
              readOnly
              className={inputClass}
              value={hasVolumes ? result.formattedNext16 : ''}
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="parkland-rate16">
            IV flow
          </label>
          <FieldShell muted>
            <input
              id="parkland-rate16"
              type="text"
              readOnly
              className={inputClass}
              value={hasVolumes ? result.formattedNext16Rate : ''}
            />
            <span className={unitFixed}>mL/h</span>
          </FieldShell>
        </div>
        <p className="rounded-lg border border-sky-200 bg-sky-50/70 px-3 py-2 text-xs leading-relaxed text-accent">
          Estimates fluid needed to replace burn losses. Does not include normal
          daily maintenance needs.
        </p>
        {result?.statusDetail ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}
