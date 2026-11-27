'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, parseNumber, toCm } from './calculation';
import {
  clearIncompatibleHeightFields,
  clearIncompatibleWeightFields,
  heightFieldsFor,
  weightFieldsFor,
  type BedriddenFieldErrors,
  type BedriddenInput,
  type BedriddenResult,
  type HeightStudy,
  type LengthUnit,
  type MassUnit,
  type RabitoWeightVariant,
  type WeightStudy,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

const HEIGHT_STUDIES: { value: HeightStudy; label: string }[] = [
  { value: 'mitchellLipschitz', label: 'Mitchell & Lipschitz' },
  { value: 'who', label: 'WHO' },
  { value: 'rabitoArmSemi', label: 'Rabito et al. (arm + semi-span)' },
  { value: 'rabitoSemi', label: 'Rabito et al. (semi-span)' },
  { value: 'gray', label: 'Gray et al. (recumbent)' },
  { value: 'chumlea', label: 'Chumlea et al.' },
  { value: 'cereda', label: 'Cereda et al.' },
  { value: 'kneeHeight', label: 'Knee height formula' },
  { value: 'demiSpan', label: 'Demi-span' },
  { value: 'forearm', label: 'Forearm / ulna chart' },
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

function fmt(value: number, digits = 4): string {
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: BedriddenInput;
  errors: BedriddenFieldErrors;
  result: BedriddenResult | null;
  onChange: (input: BedriddenInput) => void;
}

export function BedriddenForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<BedriddenInput>) => onChange({ ...input, ...patch });
  const hNeed = heightFieldsFor(input.heightStudy);
  const wNeed = weightFieldsFor(input.weightStudy, input.rabitoVariant);

  const changeLength = (
    textKey: keyof BedriddenInput,
    unitKey: keyof BedriddenInput,
    nextUnit: LengthUnit,
  ) => {
    const raw = parseNumber(String(input[textKey]));
    const prevUnit = input[unitKey] as LengthUnit;
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, prevUnit);
      set({
        [unitKey]: nextUnit,
        [textKey]: fmt(fromCm(cm, nextUnit)),
      } as Partial<BedriddenInput>);
      return;
    }
    set({ [unitKey]: nextUnit } as Partial<BedriddenInput>);
  };

  const changeMassOut = (next: MassUnit) => {
    set({ weightOutUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Height estimation">
        <p className="text-sm font-semibold text-accent">Height estimation</p>

        <div>
          <label className={labelClass} htmlFor="bed-h-study">
            Study
            <InfoTooltip text="Published stature equations for non-standing patients." />
          </label>
          <select
            id="bed-h-study"
            className={selectClass}
            value={input.heightStudy}
            onChange={(e) =>
              onChange(
                clearIncompatibleHeightFields(
                  input,
                  e.target.value as HeightStudy,
                ),
              )
            }
          >
            {HEIGHT_STUDIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {hNeed.has('sex') ? (
          <fieldset>
            <legend className={labelClass}>Sex</legend>
            <div className="flex flex-wrap gap-4 pt-1">
              {(['male', 'female'] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-accent">
                  <input
                    type="radio"
                    name="bed-h-sex"
                    checked={input.heightSex === s}
                    onChange={() => set({ heightSex: s })}
                  />
                  {s === 'male' ? 'Male' : 'Female'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {hNeed.has('race') ? (
          <fieldset>
            <legend className={labelClass}>Race</legend>
            <div className="flex flex-wrap gap-4 pt-1">
              {(['black', 'white'] as const).map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm text-accent">
                  <input
                    type="radio"
                    name="bed-h-race"
                    checked={input.heightRace === r}
                    onChange={() => set({ heightRace: r })}
                  />
                  {r === 'black' ? 'Black' : 'White'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {hNeed.has('age') ? (
          <div>
            <label className={labelClass} htmlFor="bed-h-age">
              Age
            </label>
            <FieldShell error={errors.heightAgeText}>
              <input
                id="bed-h-age"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightAgeText}
                onChange={(e) => set({ heightAgeText: e.target.value })}
              />
              <span className="shrink-0 pr-3 font-mono text-xs text-primary">
                years
              </span>
            </FieldShell>
            {errors.heightAgeText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.heightAgeText}</p>
            ) : null}
          </div>
        ) : null}

        {hNeed.has('semiSpan') ? (
          <LengthField
            id="bed-semi"
            label="Semi-span"
            tip="Sternal notch to tip of middle finger (demi-span)."
            text={input.semiSpanText}
            unit={input.semiSpanUnit}
            error={errors.semiSpanText}
            onText={(v) => set({ semiSpanText: v })}
            onUnit={(u) => changeLength('semiSpanText', 'semiSpanUnit', u)}
          />
        ) : null}

        {hNeed.has('halfArmSpan') ? (
          <LengthField
            id="bed-half"
            label="Half of arm span"
            tip="Half arm span for the WHO equation."
            text={input.halfArmSpanText}
            unit={input.halfArmSpanUnit}
            error={errors.halfArmSpanText}
            onText={(v) => set({ halfArmSpanText: v })}
            onUnit={(u) => changeLength('halfArmSpanText', 'halfArmSpanUnit', u)}
          />
        ) : null}

        {hNeed.has('armLength') ? (
          <LengthField
            id="bed-armlen"
            label="Arm length"
            tip="Acromion to mid-elbow."
            text={input.armLengthText}
            unit={input.armLengthUnit}
            error={errors.armLengthText}
            onText={(v) => set({ armLengthText: v })}
            onUnit={(u) => changeLength('armLengthText', 'armLengthUnit', u)}
          />
        ) : null}

        {hNeed.has('recumbent') ? (
          <LengthField
            id="bed-rec"
            label="Recumbent height"
            tip="Crown-to-heel length."
            text={input.recumbentText}
            unit={input.recumbentUnit}
            error={errors.recumbentText}
            onText={(v) => set({ recumbentText: v })}
            onUnit={(u) => changeLength('recumbentText', 'recumbentUnit', u)}
          />
        ) : null}

        {hNeed.has('kneeHeight') ? (
          <LengthField
            id="bed-knee-h"
            label="Knee height"
            tip="Heel to anterior thigh with sliding caliper."
            text={input.kneeHeightText}
            unit={input.kneeHeightUnit}
            error={errors.kneeHeightText}
            onText={(v) => set({ kneeHeightText: v })}
            onUnit={(u) => changeLength('kneeHeightText', 'kneeHeightUnit', u)}
          />
        ) : null}

        {hNeed.has('demiSpan') ? (
          <LengthField
            id="bed-demi"
            label="Demi-span"
            tip="Same measurement as semi-span in demi-span equations."
            text={input.demiSpanText}
            unit={input.demiSpanUnit}
            error={errors.demiSpanText}
            onText={(v) => set({ demiSpanText: v })}
            onUnit={(u) => changeLength('demiSpanText', 'demiSpanUnit', u)}
          />
        ) : null}

        {hNeed.has('forearm') ? (
          <LengthField
            id="bed-fore"
            label="Forearm (ulna) length"
            tip="Elbow point to mid wrist bone; chart 18.5–32 cm."
            text={input.forearmText}
            unit={input.forearmUnit}
            error={errors.forearmText}
            onText={(v) => set({ forearmText: v })}
            onUnit={(u) => changeLength('forearmText', 'forearmUnit', u)}
          />
        ) : null}

        <div>
          <label className={labelClass} htmlFor="bed-h-out">
            Height
          </label>
          <FieldShell muted>
            <input
              id="bed-h-out"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedHeight ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.heightOutUnit}
              onChange={(e) =>
                set({ heightOutUnit: e.target.value as LengthUnit })
              }
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {result?.heightStatus ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.heightStatus}
            </p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Weight estimation">
        <p className="text-sm font-semibold text-accent">Weight estimation</p>

        <fieldset>
          <legend className={labelClass}>Study</legend>
          <div className="flex flex-col gap-2 pt-1">
            {(
              [
                { value: 'chumlea', label: 'Chumlea et al.' },
                { value: 'rabito', label: 'Rabito et al.' },
                { value: 'ross', label: 'Ross laboratories' },
              ] as const
            ).map((s) => (
              <label key={s.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="bed-w-study"
                  checked={input.weightStudy === s.value}
                  onChange={() =>
                    onChange(
                      clearIncompatibleWeightFields(
                        input,
                        s.value as WeightStudy,
                      ),
                    )
                  }
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        {input.weightStudy === 'rabito' ? (
          <div>
            <label className={labelClass} htmlFor="bed-rabito-v">
              Rabito equation
            </label>
            <select
              id="bed-rabito-v"
              className={selectClass}
              value={input.rabitoVariant}
              onChange={(e) => {
                const next = e.target.value as RabitoWeightVariant;
                onChange(
                  clearIncompatibleWeightFields(
                    { ...input, rabitoVariant: next },
                    'rabito',
                  ),
                );
              }}
            >
              <option value="noSkinfold">Arm + abdomen + calf</option>
              <option value="withSkinfold">+ subscapular skinfold</option>
              <option value="withSex">+ sex term</option>
            </select>
          </div>
        ) : null}

        {wNeed.has('sex') ? (
          <fieldset>
            <legend className={labelClass}>Sex</legend>
            <div className="flex flex-wrap gap-4 pt-1">
              {(['male', 'female'] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-accent">
                  <input
                    type="radio"
                    name="bed-w-sex"
                    checked={input.weightSex === s}
                    onChange={() => set({ weightSex: s })}
                  />
                  {s === 'male' ? 'Male' : 'Female'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {wNeed.has('race') ? (
          <fieldset>
            <legend className={labelClass}>Race</legend>
            <div className="flex flex-wrap gap-4 pt-1">
              {(['black', 'white'] as const).map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm text-accent">
                  <input
                    type="radio"
                    name="bed-w-race"
                    checked={input.weightRace === r}
                    onChange={() => set({ weightRace: r })}
                  />
                  {r === 'black' ? 'Black' : 'White'}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {wNeed.has('armCirc') ? (
          <LengthField
            id="bed-armc"
            label="Arm circumference"
            tip="Mid-arm circumference."
            text={input.armCircText}
            unit={input.armCircUnit}
            error={errors.armCircText}
            onText={(v) => set({ armCircText: v })}
            onUnit={(u) => changeLength('armCircText', 'armCircUnit', u)}
          />
        ) : null}

        {wNeed.has('knee') ? (
          <LengthField
            id="bed-knee-w"
            label="Knee height"
            tip="Same caliper knee height used in stature equations."
            text={input.kneeWeightText}
            unit={input.kneeWeightUnit}
            error={errors.kneeWeightText}
            onText={(v) => set({ kneeWeightText: v })}
            onUnit={(u) => changeLength('kneeWeightText', 'kneeWeightUnit', u)}
          />
        ) : null}

        {wNeed.has('calf') ? (
          <LengthField
            id="bed-calf"
            label="Calf circumference"
            tip="Widest calf on the non-dominant leg."
            text={input.calfText}
            unit={input.calfUnit}
            error={errors.calfText}
            onText={(v) => set({ calfText: v })}
            onUnit={(u) => changeLength('calfText', 'calfUnit', u)}
          />
        ) : null}

        {wNeed.has('subscapular') ? (
          <LengthField
            id="bed-sub"
            label="Subscapular skinfold"
            tip="Diagonal fold below the scapula (enter as cm numeric path used by Omni teaching tables)."
            text={input.subscapularText}
            unit={input.subscapularUnit}
            error={errors.subscapularText}
            onText={(v) => set({ subscapularText: v })}
            onUnit={(u) => changeLength('subscapularText', 'subscapularUnit', u)}
          />
        ) : null}

        {wNeed.has('abdominal') ? (
          <LengthField
            id="bed-abd"
            label="Abdominal circumference"
            tip="Midpoint between last rib and iliac crest."
            text={input.abdominalText}
            unit={input.abdominalUnit}
            error={errors.abdominalText}
            onText={(v) => set({ abdominalText: v })}
            onUnit={(u) => changeLength('abdominalText', 'abdominalUnit', u)}
          />
        ) : null}

        <div>
          <label className={labelClass} htmlFor="bed-w-out">
            Weight
          </label>
          <FieldShell muted>
            <input
              id="bed-w-out"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedWeight ?? ''}
              aria-live="polite"
            />
            <select
              className={unitSelectClass}
              value={input.weightOutUnit}
              onChange={(e) => changeMassOut(e.target.value as MassUnit)}
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {result?.weightStatus ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.weightStatus}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}

function LengthField({
  id,
  label,
  tip,
  text,
  unit,
  error,
  onText,
  onUnit,
}: {
  id: string;
  label: string;
  tip: string;
  text: string;
  unit: LengthUnit;
  error?: string;
  onText: (v: string) => void;
  onUnit: (u: LengthUnit) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        <InfoTooltip text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={text}
          onChange={(e) => onText(e.target.value)}
          aria-invalid={Boolean(error)}
        />
        <select
          className={unitSelectClass}
          value={unit}
          onChange={(e) => onUnit(e.target.value as LengthUnit)}
          aria-label={`${label} unit`}
        >
          <option value="cm">cm</option>
          <option value="in">in</option>
        </select>
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
