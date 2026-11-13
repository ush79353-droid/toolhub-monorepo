'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ARM_STRUCTURES, type ArmMortgageInput } from './types';

interface ArmMortgageFormProps {
  input: ArmMortgageInput;
  errors: Record<string, string>;
  onChange: (input: ArmMortgageInput) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

export function ArmMortgageForm({ input, errors, onChange, onSubmit, onReset }: ArmMortgageFormProps) {
  const [advanced, setAdvanced] = React.useState(false);
  const set = (patch: Partial<ArmMortgageInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <label htmlFor="arm-principal" className={labelClass}>
            Mortgage amount
          </label>
          <input
            id="arm-principal"
            className={inputClass}
            inputMode="decimal"
            value={input.principal}
            onChange={(e) => set({ principal: Number(e.target.value) })}
            autoComplete="off"
          />
          {errors.principal ? <p className="mt-1 text-xs text-rose-600">{errors.principal}</p> : null}
        </div>
        <div>
          <label htmlFor="arm-term" className={labelClass}>
            Loan term (years)
          </label>
          <input
            id="arm-term"
            className={inputClass}
            type="number"
            min={1}
            max={40}
            value={input.termYears}
            onChange={(e) => set({ termYears: Number(e.target.value) })}
          />
          <p className="mt-1 text-xs text-muted-foreground">Common terms: 15, 20, 25, 30</p>
          {errors.termYears ? <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p> : null}
        </div>
        <div>
          <label htmlFor="arm-rate" className={labelClass}>
            Initial interest rate (%)
          </label>
          <input
            id="arm-rate"
            className={inputClass}
            inputMode="decimal"
            value={input.initialAnnualRate}
            onChange={(e) => set({ initialAnnualRate: Number(e.target.value) })}
            autoComplete="off"
          />
          {errors.initialAnnualRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialAnnualRate}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="arm-structure" className={labelClass}>
            ARM structure
          </label>
          <select
            id="arm-structure"
            className={inputClass}
            value={input.structure}
            onChange={(e) => set({ structure: e.target.value as ArmMortgageInput['structure'] })}
          >
            {ARM_STRUCTURES.map((id) => (
              <option key={id} value={id}>
                {id} ARM
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            First number is fixed years. /1 adjusts yearly; /6 adjusts every 6 months.
          </p>
          {errors.structure ? <p className="mt-1 text-xs text-rose-600">{errors.structure}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <label htmlFor="arm-scenario" className={labelClass}>
            Future-rate assumption
          </label>
          <select
            id="arm-scenario"
            className={inputClass}
            value={input.scenario}
            onChange={(e) => set({ scenario: e.target.value as ArmMortgageInput['scenario'] })}
          >
            <option value="constant">Constant projected rate</option>
            <option value="rising">Rising by a fixed step</option>
            <option value="falling">Falling by a fixed step</option>
          </select>
        </div>
        {input.scenario === 'constant' ? (
          <div>
            <label htmlFor="arm-projected" className={labelClass}>
              Projected rate after reset (%)
            </label>
            <input
              id="arm-projected"
              className={inputClass}
              inputMode="decimal"
              value={input.projectedAnnualRate}
              onChange={(e) => set({ projectedAnnualRate: Number(e.target.value) })}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-muted-foreground">Assumption only — not a market forecast.</p>
          </div>
        ) : (
          <div>
            <label htmlFor="arm-step" className={labelClass}>
              Step per adjustment (percentage points)
            </label>
            <input
              id="arm-step"
              className={inputClass}
              inputMode="decimal"
              value={input.scenarioStepPercent}
              onChange={(e) => set({ scenarioStepPercent: Number(e.target.value) })}
              autoComplete="off"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-background/50">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => setAdvanced((open) => !open)}
          aria-expanded={advanced}
        >
          Advanced ARM settings
          <span className="text-xs font-normal text-muted-foreground">Caps, floor, housing costs</span>
        </button>
        {advanced ? (
          <div className="space-y-3.5 border-t border-border p-3.5">
            <label className="flex items-start gap-2 text-sm text-accent">
              <input
                type="checkbox"
                checked={input.useIndexMargin}
                onChange={(e) => set({ useIndexMargin: e.target.checked })}
                className="mt-1"
              />
              <span>Use index + margin as the uncapped reset target (still an assumption)</span>
            </label>
            {input.useIndexMargin ? (
              <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="arm-index">
                    Index (%)
                  </label>
                  <input
                    id="arm-index"
                    className={inputClass}
                    value={input.indexRate}
                    onChange={(e) => set({ indexRate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="arm-margin">
                    Margin (pp)
                  </label>
                  <input
                    id="arm-margin"
                    className={inputClass}
                    value={input.margin}
                    onChange={(e) => set({ margin: Number(e.target.value) })}
                  />
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-3">
              {(
                [
                  ['initialCap', 'Initial cap (pp)'],
                  ['subsequentCap', 'Later cap (pp)'],
                  ['lifetimeCap', 'Lifetime cap (pp)'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={labelClass} htmlFor={`arm-${key}`}>
                    {label}
                  </label>
                  <input
                    id={`arm-${key}`}
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) => set({ [key]: Number(e.target.value) })}
                  />
                  {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="arm-floor">
                  Rate floor (%) optional
                </label>
                <input
                  id="arm-floor"
                  className={inputClass}
                  value={input.rateFloor ?? ''}
                  placeholder="None"
                  onChange={(e) =>
                    set({ rateFloor: e.target.value.trim() === '' ? null : Number(e.target.value) })
                  }
                />
                {errors.rateFloor ? <p className="mt-1 text-xs text-rose-600">{errors.rateFloor}</p> : null}
              </div>
              <div>
                <label className={labelClass} htmlFor="arm-start">
                  First payment month start
                </label>
                <input
                  id="arm-start"
                  type="date"
                  className={`${inputClass} block`}
                  value={input.startDate}
                  onChange={(e) => set({ startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
              {(
                [
                  ['propertyTaxMonthly', 'Property tax / mo'],
                  ['insuranceMonthly', 'Insurance / mo'],
                  ['hoaMonthly', 'HOA / mo'],
                  ['mortgageInsuranceMonthly', 'Mortgage insurance / mo'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={labelClass} htmlFor={`arm-${key}`}>
                    {label}
                  </label>
                  <input
                    id={`arm-${key}`}
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) => set({ [key]: Number(e.target.value) })}
                  />
                  {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Caps limit rate increases only. Decreases are not symmetrically capped. Taxes, insurance, and HOA
              are added to the housing payment and are not financed.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
