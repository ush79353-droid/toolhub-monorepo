'use client';

import type { ReactNode } from 'react';
import {
  CARBOHYDRATE_ACTIVITY_OPTIONS,
  type CarbohydrateCalculatorFieldErrors,
  type CarbohydrateCalculatorInput,
  type CarbohydrateCalculatorResult,
  type UnitSystem,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: CarbohydrateCalculatorInput;
  errors: CarbohydrateCalculatorFieldErrors;
  result: CarbohydrateCalculatorResult | null;
  onChange: (input: CarbohydrateCalculatorInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CarbohydrateCalculatorForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: Props) {
  const set = (patch: Partial<CarbohydrateCalculatorInput>) =>
    onChange({ ...input, ...patch, isSubmitted: false });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <motionTabGroup
        value={input.unitSystem}
        onChange={(unitSystem) => set({ unitSystem })}
      />

      <section className={sectionClass}>
        <Field label="Age (ages 18 – 80)" error={errors.ageYearsText}>
          <input
            className={inputClass}
            value={input.ageYearsText}
            inputMode="numeric"
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
        </Field>

        <fieldset>
          <legend className={labelClass}>Gender</legend>
          <div className="flex gap-4 text-sm capitalize">
            {(['male', 'female'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="radio" checked={input.sex === s} onChange={() => set({ sex: s })} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        {input.unitSystem === 'metric' ? (
          <>
            <Field label="Height" error={errors.height}>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={input.heightCm}
                  onChange={(e) => set({ heightCm: e.target.value })}
                />
                <span className="flex h-11 items-center px-2 text-sm">cm</span>
              </div>
            </Field>
            <Field label="Weight" error={errors.weight}>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={input.weightKg}
                  onChange={(e) => set({ weightKg: e.target.value })}
                />
                <span className="flex h-11 items-center px-2 text-sm">kg</span>
              </div>
            </Field>
          </>
        ) : null}

        {input.unitSystem === 'us' ? (
          <>
            <Field label="Height" error={errors.height}>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={input.heightFt}
                  onChange={(e) => set({ heightFt: e.target.value })}
                  aria-label="Feet"
                />
                <span className="flex h-11 items-center text-sm">ft</span>
                <input
                  className={inputClass}
                  value={input.heightIn}
                  onChange={(e) => set({ heightIn: e.target.value })}
                  aria-label="Inches"
                />
                <span className="flex h-11 items-center text-sm">in</span>
              </div>
            </Field>
            <Field label="Weight" error={errors.weight}>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={input.weightLb}
                  onChange={(e) => set({ weightLb: e.target.value })}
                />
                <span className="flex h-11 items-center px-2 text-sm">lb</span>
              </div>
            </Field>
          </>
        ) : null}

        {input.unitSystem === 'other' ? (
          <>
            <Field label="Height" error={errors.height}>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={input.otherHeight}
                  onChange={(e) => set({ otherHeight: e.target.value })}
                />
                <select
                  className="h-11 rounded-lg border border-border px-2 text-sm"
                  value={input.otherHeightUnit}
                  onChange={(e) =>
                    set({
                      otherHeightUnit: e.target
                        .value as CarbohydrateCalculatorInput['otherHeightUnit'],
                    })
                  }
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </Field>
            <Field label="Weight" error={errors.weight}>
              <div className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={input.otherWeight}
                  onChange={(e) => set({ otherWeight: e.target.value })}
                />
                <select
                  className="h-11 rounded-lg border border-border px-2 text-sm"
                  value={input.otherWeightUnit}
                  onChange={(e) =>
                    set({
                      otherWeightUnit: e.target
                        .value as CarbohydrateCalculatorInput['otherWeightUnit'],
                    })
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="st">st</option>
                  <option value="g">g</option>
                </select>
              </div>
            </Field>
          </>
        ) : null}

        <Field label="Activity">
          <select
            className={inputClass}
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as CarbohydrateCalculatorInput['activityId'] })
            }
          >
            {CARBOHYDRATE_ACTIVITY_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => set({ settingsOpen: !input.settingsOpen })}
        >
          {input.settingsOpen ? '− Settings' : '+ Settings'}
        </button>
        {input.settingsOpen ? (
          <Field label="BMR equation">
            <select
              className={inputClass}
              value={input.equation}
              onChange={(e) =>
                set({ equation: e.target.value as CarbohydrateCalculatorInput['equation'] })
              }
            >
              <option value="mifflin">Mifflin–St Jeor</option>
              <option value="harris">Revised Harris–Benedict</option>
            </select>
          </Field>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCalculate}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
        >
          Calculate
        </button>
        <button type="button" onClick={onClear} className="rounded-xl border px-6 py-2 text-sm">
          Clear
        </button>
      </div>

      {result?.maintenanceKcalPerDay != null && input.isSubmitted ? (
        <section className={sectionClass}>
          <p className="text-sm font-medium">
            Maintenance: {Math.round(result.maintenanceKcalPerDay).toLocaleString('en-US')} kcal/day
            ({result.equationLabel})
          </p>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th>Carb %</th>
                <th>kcal/day</th>
                <th>g/day</th>
              </tr>
            </thead>
            <tbody>
              {result.carbRows.map((row) => (
                <tr key={row.sharePercent} className="border-t border-border">
                  <td className="py-2">{row.sharePercent}%</td>
                  <td className="py-2">{Math.round(row.carbKcalPerDay)}</td>
                  <td className="py-2">{Math.round(row.carbGramsPerDay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Exercise: 15–30 minutes elevated heart rate. Intense: 45–120 minutes. Very intense: 2+
        hours.
      </p>
    </form>
  );
}

function motionTabGroup({
  value,
  onChange,
}: {
  value: UnitSystem;
  onChange: (v: UnitSystem) => void;
}) {
  const tabs: { id: UnitSystem; label: string }[] = [
    { id: 'us', label: 'US Units' },
    { id: 'metric', label: 'Metric Units' },
    { id: 'other', label: 'Other Units' },
  ];
  return (
    <div className="flex gap-1 rounded-lg border border-border p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`flex-1 rounded-md px-2 py-2 text-xs font-semibold ${
            value === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}