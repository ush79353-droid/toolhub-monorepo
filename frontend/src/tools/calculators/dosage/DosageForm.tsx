'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  FREQUENCY_OPTIONS,
  type ConcUnit,
  type DosageBasis,
  type DosageFieldErrors,
  type DosageInput,
  type DosageResult,
  type FrequencyId,
  type MassUnit,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
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

interface DosageFormProps {
  input: DosageInput;
  errors: DosageFieldErrors;
  result: DosageResult | null;
  onChange: (input: DosageInput) => void;
  onLoadExample: () => void;
}

export function DosageForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: DosageFormProps) {
  const set = (patch: Partial<DosageInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="dosage-weight">
          Your weight
        </label>
        <FieldShell error={errors.weight}>
          <input
            id="dosage-weight"
            className={inputClass}
            inputMode="decimal"
            value={input.weight}
            onChange={(e) => set({ weight: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="st">st</option>
          </select>
        </FieldShell>
        {errors.weight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="dosage-rate">
          Dosage
          <InfoTooltip text="Mass ordered per kilogram of body weight. Choose whether that rate is per day or per administration below." />
        </label>
        <FieldShell error={errors.dosagePerKg}>
          <input
            id="dosage-rate"
            className={inputClass}
            inputMode="decimal"
            value={input.dosagePerKg}
            onChange={(e) => set({ dosagePerKg: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="Dosage mass unit"
            value={input.dosageMassUnit}
            onChange={(e) =>
              set({ dosageMassUnit: e.target.value as MassUnit })
            }
          >
            <option value="mg">mg</option>
            <option value="mcg">mcg</option>
            <option value="g">g</option>
          </select>
          <span className="pr-3 text-xs font-medium text-muted-foreground">
            /kg
          </span>
        </FieldShell>
        {errors.dosagePerKg ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dosagePerKg}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>Dosage rate basis</div>
        <div className="flex flex-col gap-2" role="radiogroup">
          {(
            [
              ['per_day', 'Per day (divide by frequency)'],
              ['per_administration', 'Per administration (× frequency for daily)'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
                input.dosageBasis === value
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="dosage-basis"
                checked={input.dosageBasis === value}
                onChange={() => set({ dosageBasis: value as DosageBasis })}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="dosage-frequency">
          Frequency
        </label>
        <FieldShell>
          <select
            id="dosage-frequency"
            className={`${inputClass} cursor-pointer`}
            value={input.frequencyId}
            onChange={(e) =>
              set({ frequencyId: e.target.value as FrequencyId })
            }
          >
            {FREQUENCY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="dosage-dose">
          Dose (per administration)
        </label>
        <FieldShell muted>
          <input
            id="dosage-dose"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedDosePerAdmin ?? ''}
            aria-live="polite"
          />
        </FieldShell>
        {result ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Daily total: {result.formattedDosePerDay}
          </p>
        ) : null}
      </div>

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={input.liquidOpen}
          onClick={() => set({ liquidOpen: !input.liquidOpen })}
        >
          <span>Liquid medicine</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.liquidOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {input.liquidOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
            <div>
              <label className={labelClass} htmlFor="dosage-conc">
                Medicine concentration
              </label>
              <FieldShell error={errors.concentration}>
                <input
                  id="dosage-conc"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.concentration}
                  onChange={(e) => set({ concentration: e.target.value })}
                />
                <select
                  className={unitSelectClass}
                  aria-label="Concentration unit"
                  value={input.concentrationUnit}
                  onChange={(e) =>
                    set({
                      concentrationUnit: e.target.value as ConcUnit,
                    })
                  }
                >
                  <option value="mg/mL">mg/mL</option>
                  <option value="mcg/mL">mcg/mL</option>
                  <option value="g/mL">g/mL</option>
                </select>
              </FieldShell>
              {errors.concentration ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.concentration}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="dosage-liquid">
                Liquid dose
              </label>
              <FieldShell muted>
                <input
                  id="dosage-liquid"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedLiquidMl ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              {result?.liquidNote ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {result.liquidNote}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (10 kg · 15 mg/kg/day · 25 mg/mL)
      </button>
    </form>
  );
}
