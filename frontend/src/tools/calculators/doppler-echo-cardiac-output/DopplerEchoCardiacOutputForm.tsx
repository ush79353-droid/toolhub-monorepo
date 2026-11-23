'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { cmToLength, cmToVti } from '../aortic-valve-area/calculation';
import {
  cmToHeightUnit,
  heightToCm,
  kgToWeightUnit,
} from '../cardiac-index/calculation';
import type {
  DopplerEchoCardiacOutputFieldErrors,
  DopplerEchoCardiacOutputInput,
  DopplerEchoCardiacOutputResult,
  HeightUnit,
  LvotDiameterUnit,
  LvotVtiUnit,
  WeightUnit,
} from './types';
import {
  HEIGHT_UNIT_LABELS,
  LVOT_DIAMETER_UNIT_LABELS,
  LVOT_VTI_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
} from './types';
import { parseNumber } from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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
        muted ? 'border-border bg-muted/15' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function formatSwitch(value: number, digits: number): string {
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: DopplerEchoCardiacOutputInput;
  errors: DopplerEchoCardiacOutputFieldErrors;
  result: DopplerEchoCardiacOutputResult;
  onChange: (input: DopplerEchoCardiacOutputInput) => void;
  onLoadExample: () => void;
}

export function DopplerEchoCardiacOutputForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: FormProps) {
  const set = (patch: Partial<DopplerEchoCardiacOutputInput>) =>
    onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.heightValue);
    let nextValue = input.heightValue;
    if (raw != null && raw > 0) {
      const cm = heightToCm(raw, input.heightUnit);
      nextValue = formatSwitch(
        cmToHeightUnit(cm, next),
        next === 'in' ? 2 : 1,
      );
    }
    set({ heightUnit: next, heightValue: nextValue });
  };

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightValue);
    let nextValue = input.weightValue;
    if (raw != null && raw > 0) {
      const kg =
        input.weightUnit === 'kg' ? raw : raw * 0.45359237;
      nextValue = formatSwitch(kgToWeightUnit(kg, next), next === 'lb' ? 1 : 2);
    }
    set({ weightUnit: next, weightValue: nextValue });
  };

  const switchDiameterUnit = (next: LvotDiameterUnit) => {
    if (next === input.lvotDiameterUnit) return;
    const raw = parseNumber(input.lvotDiameterValue);
    let nextValue = input.lvotDiameterValue;
    if (raw != null && raw > 0) {
      const cm =
        input.lvotDiameterUnit === 'mm' ? raw / 10 : raw;
      nextValue = formatSwitch(cmToLength(cm, next), next === 'mm' ? 1 : 2);
    }
    set({ lvotDiameterUnit: next, lvotDiameterValue: nextValue });
  };

  const switchVtiUnit = (next: LvotVtiUnit) => {
    if (next === input.lvotVtiUnit) return;
    const raw = parseNumber(input.lvotVtiValue);
    let nextValue = input.lvotVtiValue;
    if (raw != null && raw > 0) {
      const cm = input.lvotVtiUnit === 'cm' ? raw : raw * 100;
      nextValue = formatSwitch(cmToVti(cm, next), next === 'm' ? 4 : 2);
    }
    set({ lvotVtiUnit: next, lvotVtiValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Doppler LVOT stroke volume and cardiac output. BSA uses the
        same Mosteller formula as the Cardiac Index Calculator. Measurements stay
        in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (20 mm · VTI 20 cm · HR 80 → CO ≈ 5.03 L/min)
        </button>
      </p>

      <section className={sectionClass} aria-label="Hemodynamic inputs">
        <div>
          <label className={labelClass} htmlFor="deco-height">
            Height
          </label>
          <FieldShell error={errors.heightValue}>
            <input
              id="deco-height"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              aria-label="Height"
              value={input.heightValue}
              aria-invalid={Boolean(errors.heightValue)}
              onChange={(e) => set({ heightValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Height unit"
              value={input.heightUnit}
              onChange={(e) => switchHeightUnit(e.target.value as HeightUnit)}
            >
              {(Object.keys(HEIGHT_UNIT_LABELS) as HeightUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HEIGHT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-weight">
            Weight
          </label>
          <FieldShell error={errors.weightValue}>
            <input
              id="deco-weight"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              aria-label="Weight"
              value={input.weightValue}
              aria-invalid={Boolean(errors.weightValue)}
              onChange={(e) => set({ weightValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Weight unit"
              value={input.weightUnit}
              onChange={(e) => switchWeightUnit(e.target.value as WeightUnit)}
            >
              {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
                <option key={u} value={u}>
                  {WEIGHT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-hr">
            Heart rate
            <InfoTooltip
              label="Heart rate"
              text="Enter the simultaneous heart rate in beats per minute used with the LVOT stroke distance."
            />
          </label>
          <FieldShell error={errors.heartRateBpm}>
            <input
              id="deco-hr"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              aria-label="Heart rate"
              value={input.heartRateBpm}
              aria-invalid={Boolean(errors.heartRateBpm)}
              onChange={(e) => set({ heartRateBpm: e.target.value })}
            />
            <span className={unitFixed}>bpm</span>
          </FieldShell>
          {errors.heartRateBpm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heartRateBpm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-vti">
            LVOT VTI
            <InfoTooltip
              label="LVOT VTI"
              text="Velocity-time integral (stroke distance) sampled in the left ventricular outflow tract by pulsed-wave Doppler."
            />
          </label>
          <FieldShell error={errors.lvotVtiValue}>
            <input
              id="deco-vti"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              aria-label="LVOT velocity time integral"
              value={input.lvotVtiValue}
              aria-invalid={Boolean(errors.lvotVtiValue)}
              onChange={(e) => set({ lvotVtiValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="LVOT VTI unit"
              value={input.lvotVtiUnit}
              onChange={(e) => switchVtiUnit(e.target.value as LvotVtiUnit)}
            >
              {(Object.keys(LVOT_VTI_UNIT_LABELS) as LvotVtiUnit[]).map((u) => (
                <option key={u} value={u}>
                  {LVOT_VTI_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.lvotVtiValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lvotVtiValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-lvot">
            LVOT diameter
            <InfoTooltip
              label="LVOT diameter"
              text="Left ventricular outflow tract diameter, usually from parasternal long-axis echocardiography, converted to centimeters before area calculation."
            />
          </label>
          <FieldShell error={errors.lvotDiameterValue}>
            <input
              id="deco-lvot"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              aria-label="LVOT diameter"
              value={input.lvotDiameterValue}
              aria-invalid={Boolean(errors.lvotDiameterValue)}
              onChange={(e) => set({ lvotDiameterValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="LVOT diameter unit"
              value={input.lvotDiameterUnit}
              onChange={(e) =>
                switchDiameterUnit(e.target.value as LvotDiameterUnit)
              }
            >
              {(
                Object.keys(LVOT_DIAMETER_UNIT_LABELS) as LvotDiameterUnit[]
              ).map((u) => (
                <option key={u} value={u}>
                  {LVOT_DIAMETER_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.lvotDiameterValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lvotDiameterValue}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-co">
            Cardiac output
          </label>
          <FieldShell muted>
            <input
              id="deco-co"
              readOnly
              aria-label="Cardiac output liters per minute"
              className={`${inputClass} cursor-default`}
              value={result.formattedCo}
            />
            <span className={unitFixed}>L/min</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-ci">
            Cardiac index
          </label>
          <FieldShell muted>
            <input
              id="deco-ci"
              readOnly
              aria-label="Cardiac index liters per minute per square meter"
              className={`${inputClass} cursor-default`}
              value={result.formattedCi}
            />
            <span className={unitFixed}>L/min/m²</span>
          </FieldShell>
        </div>
      </section>

      <section
        className={sectionClass}
        aria-labelledby="deco-derived-heading"
      >
        <h3
          id="deco-derived-heading"
          className="text-[15px] font-semibold text-accent"
        >
          Derived values
        </h3>

        <div>
          <label className={labelClass} htmlFor="deco-sv">
            Stroke volume
          </label>
          <FieldShell muted>
            <input
              id="deco-sv"
              readOnly
              aria-label="Stroke volume milliliters"
              className={`${inputClass} cursor-default`}
              value={result.formattedStrokeVolume}
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-csa">
            <span>Cross sectional area of LVOT</span>
            <InfoTooltip
              label="LVOT cross sectional area"
              text="Assumes a circular LVOT: area = π × (diameter ÷ 2)² with diameter in centimeters."
            />
          </label>
          <FieldShell muted>
            <input
              id="deco-csa"
              readOnly
              aria-label="LVOT cross sectional area square centimeters"
              className={`${inputClass} cursor-default`}
              value={result.formattedLvotArea}
            />
            <span className={unitFixed}>cm²</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="deco-bsa">
            Body surface area
          </label>
          <FieldShell muted>
            <input
              id="deco-bsa"
              readOnly
              aria-label="Body surface area square meters"
              className={`${inputClass} cursor-default`}
              value={result.formattedBsa}
            />
            <span className={unitFixed}>m²</span>
          </FieldShell>
        </div>

        {result.explanation ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}