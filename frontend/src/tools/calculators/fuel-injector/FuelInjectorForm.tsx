'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromBar, fromHp, toBar, toHp } from './calculation';
import {
  ASPIRATION_LABELS,
  FLOW_UNIT_LABELS,
  FUEL_TYPE_LABELS,
  POWER_UNIT_LABELS,
  PRESSURE_UNIT_LABELS,
  type AspirationType,
  type FuelInjectorFieldErrors,
  type FuelInjectorInput,
  type FuelType,
  type InjectorFlowUnit,
  type PowerUnit,
  type PressureUnit,
  createEmptyInput,
  createExampleFourCylinder,
  suggestedBsfc,
  suggestedDensity,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface FuelInjectorFormProps {
  input: FuelInjectorInput;
  errors: FuelInjectorFieldErrors;
  onChange: (next: FuelInjectorInput) => void;
}

export function FuelInjectorForm({
  input,
  errors,
  onChange,
}: FuelInjectorFormProps) {
  const set = (patch: Partial<FuelInjectorInput>) =>
    onChange({ ...input, ...patch });

  const applyFuelAspiration = (
    fuelType: FuelType,
    aspiration: AspirationType,
  ) => {
    const patch: Partial<FuelInjectorInput> = { fuelType, aspiration };
    if (!input.bsfcManual) {
      patch.bsfc = String(suggestedBsfc(fuelType, aspiration));
    }
    if (!input.densityManual && fuelType !== 'custom') {
      patch.fuelDensity = String(suggestedDensity(fuelType));
    }
    set(patch);
  };

  const changePowerUnit = (next: PowerUnit) => {
    const eng = Number(input.engineHorsepower.replace(/,/g, ''));
    const tgt = Number(input.targetHorsepower.replace(/,/g, ''));
    const patch: Partial<FuelInjectorInput> = { horsepowerUnit: next };
    if (Number.isFinite(eng) && eng > 0) {
      const hp = toHp(eng, input.horsepowerUnit);
      patch.engineHorsepower = String(
        Number(fromHp(hp, next).toPrecision(12)),
      );
    }
    if (Number.isFinite(tgt) && tgt > 0) {
      const hp = toHp(tgt, input.horsepowerUnit);
      patch.targetHorsepower = String(
        Number(fromHp(hp, next).toPrecision(12)),
      );
    }
    set(patch);
  };

  const changePressureUnit = (
    field: 'fuelPressureUnit' | 'pressureUnit',
    next: PressureUnit,
  ) => {
    if (field === 'fuelPressureUnit') {
      const n = Number(input.fuelPressure.replace(/,/g, ''));
      if (Number.isFinite(n) && n > 0) {
        const bar = toBar(n, input.fuelPressureUnit);
        set({
          fuelPressureUnit: next,
          fuelPressure: String(Number(fromBar(bar, next).toPrecision(12))),
        });
        return;
      }
      set({ fuelPressureUnit: next });
      return;
    }
    const ref = Number(input.referenceDifferentialPressure.replace(/,/g, ''));
    const act = Number(input.actualDifferentialPressure.replace(/,/g, ''));
    const patch: Partial<FuelInjectorInput> = { pressureUnit: next };
    if (Number.isFinite(ref) && ref > 0) {
      const bar = toBar(ref, input.pressureUnit);
      patch.referenceDifferentialPressure = String(
        Number(fromBar(bar, next).toPrecision(12)),
      );
    }
    if (Number.isFinite(act) && act > 0) {
      const bar = toBar(act, input.pressureUnit);
      patch.actualDifferentialPressure = String(
        Number(fromBar(bar, next).toPrecision(12)),
      );
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Size injectors with{' '}
        <strong className="text-accent">
          IFR = (HP × BSFC) / (N × DC)
        </strong>
        . Suggested BSFC and density are labeled estimates — override anytime.
        Target crankshaft HP, when set, is the power used (not added to current
        HP).
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example V8 (400 hp · 8 inj · 80%)
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleFourCylinder())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 4-cyl (200 hp)
        </button>
      </div>

      <div>
        <label htmlFor="fi-fuel" className={labelClass}>
          Fuel type
          <InfoTooltip
            label="Fuel type"
            text="Updates suggested BSFC and density estimates. Custom fuel requires manual BSFC."
          />
        </label>
        <select
          id="fi-fuel"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.fuelType}
          onChange={(e) =>
            applyFuelAspiration(e.target.value as FuelType, input.aspiration)
          }
        >
          {(Object.keys(FUEL_TYPE_LABELS) as FuelType[]).map((f) => (
            <option key={f} value={f}>
              {FUEL_TYPE_LABELS[f]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fi-asp" className={labelClass}>
          Aspiration
          <InfoTooltip
            label="Aspiration"
            text="Naturally aspirated vs forced induction often changes suggested BSFC for sizing estimates."
          />
        </label>
        <select
          id="fi-asp"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.aspiration}
          onChange={(e) =>
            applyFuelAspiration(
              input.fuelType,
              e.target.value as AspirationType,
            )
          }
        >
          {(Object.keys(ASPIRATION_LABELS) as AspirationType[]).map((a) => (
            <option key={a} value={a}>
              {ASPIRATION_LABELS[a]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fi-eng-hp" className={labelClass}>
          Horsepower at the engine
          <InfoTooltip
            label="Engine horsepower"
            text="Current crankshaft horsepower. Used when target horsepower is empty."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.engineHorsepower}>
            <input
              id="fi-eng-hp"
              className={inputClass}
              inputMode="decimal"
              value={input.engineHorsepower}
              aria-invalid={Boolean(errors.engineHorsepower)}
              onChange={(e) => set({ engineHorsepower: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.horsepowerUnit}
            aria-label="Horsepower unit"
            onChange={(e) => changePowerUnit(e.target.value as PowerUnit)}
          >
            {(Object.keys(POWER_UNIT_LABELS) as PowerUnit[]).map((u) => (
              <option key={u} value={u}>
                {POWER_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.engineHorsepower ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.engineHorsepower}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fi-tgt-hp" className={labelClass}>
          Target horsepower at crankshaft
          <InfoTooltip
            label="Target horsepower"
            text="Desired total crankshaft output for sizing — not additional horsepower on top of current HP."
          />
        </label>
        <FieldShell error={errors.targetHorsepower}>
          <input
            id="fi-tgt-hp"
            className={inputClass}
            inputMode="decimal"
            value={input.targetHorsepower}
            aria-invalid={Boolean(errors.targetHorsepower)}
            onChange={(e) => set({ targetHorsepower: e.target.value })}
          />
        </FieldShell>
        {errors.targetHorsepower ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.targetHorsepower}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fi-cyl" className={labelClass}>
          Number of cylinders
          <InfoTooltip
            label="Cylinders"
            text="Positive whole number. When locked, injector count follows cylinder count (common multiport assumption)."
          />
        </label>
        <FieldShell error={errors.numberOfCylinders}>
          <input
            id="fi-cyl"
            className={inputClass}
            inputMode="numeric"
            value={input.numberOfCylinders}
            aria-invalid={Boolean(errors.numberOfCylinders)}
            onChange={(e) => {
              const v = e.target.value;
              const patch: Partial<FuelInjectorInput> = {
                numberOfCylinders: v,
              };
              if (input.injectorCountLockedToCylinders) {
                patch.numberOfInjectors = v;
              }
              set(patch);
            }}
          />
        </FieldShell>
        {errors.numberOfCylinders ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.numberOfCylinders}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fi-press" className={labelClass}>
          Fuel pressure
          <InfoTooltip
            label="Fuel pressure"
            text="Rail gauge pressure for reference. Differential pressure across the injector may differ under boost — use Advanced settings."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.fuelPressure}>
            <input
              id="fi-press"
              className={inputClass}
              inputMode="decimal"
              value={input.fuelPressure}
              aria-invalid={Boolean(errors.fuelPressure)}
              onChange={(e) => set({ fuelPressure: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.fuelPressureUnit}
            aria-label="Fuel pressure unit"
            onChange={(e) =>
              changePressureUnit(
                'fuelPressureUnit',
                e.target.value as PressureUnit,
              )
            }
          >
            {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map((u) => (
              <option key={u} value={u}>
                {PRESSURE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.fuelPressure ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fuelPressure}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fi-duty" className={labelClass}>
          Max duty cycle
          <InfoTooltip
            label="Duty cycle"
            text="Percent of available time the injector is open. 80% is a common sizing headroom assumption — not a universal limit."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.maxDutyCycle}>
            <input
              id="fi-duty"
              className={inputClass}
              inputMode="decimal"
              value={input.maxDutyCycle}
              aria-invalid={Boolean(errors.maxDutyCycle)}
              onChange={(e) => set({ maxDutyCycle: e.target.value })}
            />
          </FieldShell>
          <span className="flex h-11 items-center text-sm text-muted-foreground">
            %
          </span>
        </div>
        {errors.maxDutyCycle ? (
          <p className="mt-1 text-xs text-rose-600">{errors.maxDutyCycle}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fi-result-unit" className={labelClass}>
          Result flow unit
        </label>
        <select
          id="fi-result-unit"
          className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
          value={input.resultFlowUnit}
          onChange={(e) =>
            set({ resultFlowUnit: e.target.value as InjectorFlowUnit })
          }
        >
          {(Object.keys(FLOW_UNIT_LABELS) as InjectorFlowUnit[]).map((u) => (
            <option key={u} value={u}>
              {FLOW_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced settings
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fi-bsfc" className={labelClass}>
              BSFC (lb/(hp·hr))
              <InfoTooltip
                label="BSFC"
                text="Brake-specific fuel consumption estimate. Editing marks it as a manual override."
              />
            </label>
            <FieldShell error={errors.bsfc}>
              <input
                id="fi-bsfc"
                className={inputClass}
                inputMode="decimal"
                value={input.bsfc}
                aria-invalid={Boolean(errors.bsfc)}
                onChange={(e) =>
                  set({ bsfc: e.target.value, bsfcManual: true })
                }
              />
            </FieldShell>
            {errors.bsfc ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bsfc}</p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              {input.bsfcManual
                ? 'Manual override active.'
                : 'Using suggested estimate for fuel/aspiration.'}
            </p>
          </div>

          <div>
            <label htmlFor="fi-dens" className={labelClass}>
              Fuel density (g/mL)
              <InfoTooltip
                label="Fuel density"
                text="Required to convert lb/hr to cc/min or mL/min. Estimated by fuel type unless overridden."
              />
            </label>
            <FieldShell error={errors.fuelDensity}>
              <input
                id="fi-dens"
                className={inputClass}
                inputMode="decimal"
                value={input.fuelDensity}
                aria-invalid={Boolean(errors.fuelDensity)}
                onChange={(e) =>
                  set({ fuelDensity: e.target.value, densityManual: true })
                }
              />
            </FieldShell>
            {errors.fuelDensity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.fuelDensity}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fi-inj" className={labelClass}>
              Number of fuel injectors
              <InfoTooltip
                label="Injectors"
                text="Defaults to cylinder count. Unlock for staged or multi-injector-per-cylinder setups."
              />
            </label>
            <FieldShell error={errors.numberOfInjectors}>
              <input
                id="fi-inj"
                className={inputClass}
                inputMode="numeric"
                value={input.numberOfInjectors}
                aria-invalid={Boolean(errors.numberOfInjectors)}
                onChange={(e) =>
                  set({
                    numberOfInjectors: e.target.value,
                    injectorCountLockedToCylinders: false,
                  })
                }
              />
            </FieldShell>
            {errors.numberOfInjectors ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.numberOfInjectors}
              </p>
            ) : null}
            <label className="mt-2 inline-flex items-center gap-2 text-xs text-accent">
              <input
                type="checkbox"
                checked={input.injectorCountLockedToCylinders}
                onChange={(e) => {
                  if (e.target.checked) {
                    set({
                      injectorCountLockedToCylinders: true,
                      numberOfInjectors: input.numberOfCylinders,
                    });
                  } else {
                    set({ injectorCountLockedToCylinders: false });
                  }
                }}
              />
              Lock injectors to cylinder count
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="fi-ref-p" className={labelClass}>
                Reference ΔP
              </label>
              <FieldShell error={errors.referenceDifferentialPressure}>
                <input
                  id="fi-ref-p"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.referenceDifferentialPressure}
                  onChange={(e) =>
                    set({ referenceDifferentialPressure: e.target.value })
                  }
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="fi-act-p" className={labelClass}>
                Actual ΔP
              </label>
              <FieldShell error={errors.actualDifferentialPressure}>
                <input
                  id="fi-act-p"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.actualDifferentialPressure}
                  onChange={(e) =>
                    set({ actualDifferentialPressure: e.target.value })
                  }
                />
              </FieldShell>
            </div>
          </div>
          <select
            className="h-11 w-full max-w-[120px] rounded-lg border border-border bg-white px-3 text-sm"
            value={input.pressureUnit}
            aria-label="Differential pressure unit"
            onChange={(e) =>
              changePressureUnit('pressureUnit', e.target.value as PressureUnit)
            }
          >
            {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map((u) => (
              <option key={u} value={u}>
                {PRESSURE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Q₂ = Q₁ √(ΔP₂/ΔP₁) when actual ≠ reference. Ideal orifice model —
            real injectors may deviate.
          </p>

          <div>
            <label htmlFor="fi-exist" className={labelClass}>
              Existing injector flow (optional)
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.existingInjectorFlow}>
                <input
                  id="fi-exist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.existingInjectorFlow}
                  onChange={(e) =>
                    set({ existingInjectorFlow: e.target.value })
                  }
                />
              </FieldShell>
              <select
                className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.existingInjectorFlowUnit}
                aria-label="Existing injector flow unit"
                onChange={(e) =>
                  set({
                    existingInjectorFlowUnit: e.target
                      .value as InjectorFlowUnit,
                  })
                }
              >
                {(Object.keys(FLOW_UNIT_LABELS) as InjectorFlowUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {FLOW_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.existingInjectorFlow ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.existingInjectorFlow}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
