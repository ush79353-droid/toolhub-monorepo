'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ACTIVITY_OPTIONS,
  PREGNANCY_LACTATION_OFFSETS,
  type EerActivity,
  type EerCalculatorFieldErrors,
  type EerCalculatorInput,
  type EerCalculatorResult,
  type EerSex,
  type HeightUnit,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

const CM_PER_IN = 2.54;
const LB_PER_KG = 2.2046226218;

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

function heightToCm(value: number, unit: HeightUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'm') return value * 100;
  return value * CM_PER_IN;
}

function cmToUnit(cm: number, unit: HeightUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'm') return cm / 100;
  return cm / CM_PER_IN;
}

function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

function kgToUnit(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kg * LB_PER_KG;
}

interface Props {
  input: EerCalculatorInput;
  errors: EerCalculatorFieldErrors;
  result: EerCalculatorResult | null;
  onChange: (input: EerCalculatorInput) => void;
}

export function EerCalculatorForm({ input, errors, result, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const activityMeta =
    ACTIVITY_OPTIONS.find((o) => o.id === input.activity) ?? ACTIVITY_OPTIONS[1];
  const offsets = result?.pregnancyLactation ?? PREGNANCY_LACTATION_OFFSETS;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-accent">Personal details</span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" />
          )}
        </button>
        {open ? (
          <div className="space-y-3.5 border-t border-border px-4 py-3">
            <div>
              <div className={labelClass}>Sex</div>
              <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
                {(
                  [
                    ['female', 'Female'],
                    ['male', 'Male'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="inline-flex items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="eer-sex"
                      checked={input.sex === value}
                      onChange={() => onChange({ ...input, sex: value as EerSex })}
                      className="h-4 w-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="eer-height" className={labelClass}>
                Height
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.heightText}>
                  <input
                    id="eer-height"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.heightText}
                    onChange={(e) => onChange({ ...input, heightText: e.target.value })}
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[5.5rem]`}
                  value={input.heightUnit}
                  aria-label="Height unit"
                  onChange={(e) => {
                    const next = e.target.value as HeightUnit;
                    const n = Number(input.heightText.trim().replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      const cm = heightToCm(n, input.heightUnit);
                      const converted = cmToUnit(cm, next);
                      onChange({
                        ...input,
                        heightUnit: next,
                        heightText: String(Number(converted.toPrecision(8))),
                      });
                      return;
                    }
                    onChange({ ...input, heightUnit: next });
                  }}
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                </select>
              </div>
              {errors.heightText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="eer-weight" className={labelClass}>
                Weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.weightText}>
                  <input
                    id="eer-weight"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.weightText}
                    onChange={(e) => onChange({ ...input, weightText: e.target.value })}
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[5.5rem]`}
                  value={input.weightUnit}
                  aria-label="Weight unit"
                  onChange={(e) => {
                    const next = e.target.value as WeightUnit;
                    const n = Number(input.weightText.trim().replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      const kg = weightToKg(n, input.weightUnit);
                      const converted = kgToUnit(kg, next);
                      onChange({
                        ...input,
                        weightUnit: next,
                        weightText: String(Number(converted.toPrecision(8))),
                      });
                      return;
                    }
                    onChange({ ...input, weightUnit: next });
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              {errors.weightText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="eer-age" className={labelClass}>
                Age
              </label>
              <FieldShell error={errors.ageYearsText}>
                <input
                  id="eer-age"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.ageYearsText}
                  onChange={(e) => onChange({ ...input, ageYearsText: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">yrs</span>
              </FieldShell>
              {errors.ageYearsText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
              ) : null}
            </div>

            <div>
              <div className={labelClass}>Physical activity</div>
              <div
                className="space-y-2"
                role="radiogroup"
                aria-label="Physical activity"
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="eer-activity"
                      checked={input.activity === opt.id}
                      onChange={() =>
                        onChange({ ...input, activity: opt.id as EerActivity })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {activityMeta.description}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Estimated energy requirement</h3>
        <div>
          <label htmlFor="eer-result" className={labelClass}>
            EER
            <InfoTooltip
              label="EER"
              text="Adult non-pregnant Estimated Energy Requirement (kcal/day) from IOM DRI 2002/2005 equations. Pregnancy and lactation offsets below are educational additions kept separate from this baseline."
            />
          </label>
          <FieldShell>
            <input
              id="eer-result"
              type="text"
              readOnly
              className={`${inputClass} ${
                result?.eerDisplay ? 'font-semibold text-primary' : 'text-muted-foreground'
              }`}
              value={result?.eerDisplay ?? ''}
              placeholder="—"
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">kcal</span>
          </FieldShell>
        </div>

        <div className="flex gap-2 rounded-lg border border-border/70 bg-white/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <div>
            <p className="mb-1.5 text-accent">
              If you are pregnant or breastfeeding you should increase your energy intake by:
            </p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>{offsets.trimester1Kcal} kcal for the 1st trimester</li>
              <li>{offsets.trimester2Kcal} kcal for the 2nd trimester</li>
              <li>{offsets.trimester3Kcal} kcal for the 3rd trimester</li>
              <li>
                {offsets.lactation0to6Kcal} kcal when breastfeeding, 0–6 months postpartum
              </li>
              <li>
                {offsets.lactation7to12Kcal} kcal when breastfeeding, 7–12 months postpartum
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
