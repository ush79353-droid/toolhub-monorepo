'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertHeightValue,
  convertWeightValue,
  OBSTETRIC_LABELS,
  PRE_EXISTING_LABELS,
  TRANSIENT_LABELS,
} from './calculation';
import { VteRiskPregnancyResults } from './VteRiskPregnancyResults';
import type {
  HeightUnit,
  ObstetricFactorId,
  PreExistingFactorId,
  TransientFactorId,
  VteRiskPregnancyFieldErrors,
  VteRiskPregnancyInput,
  VteRiskPregnancyResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  suffix,
}: {
  error?: string;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <div className="shrink-0 pr-2 text-xs text-muted-foreground">
          {suffix}
        </div>
      ) : null}
    </div>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

function CheckboxRow({
  id,
  label,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-accent ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

interface Props {
  input: VteRiskPregnancyInput;
  errors: VteRiskPregnancyFieldErrors;
  result: VteRiskPregnancyResult | null;
  bmiDisplay: string;
  onChange: (input: VteRiskPregnancyInput) => void;
}

export function VteRiskPregnancyForm({
  input,
  errors,
  result,
  bmiDisplay,
  onChange,
}: Props) {
  const set = (patch: Partial<VteRiskPregnancyInput>) =>
    onChange({ ...input, ...patch });

  const setPre = (id: PreExistingFactorId, checked: boolean) => {
    const preExisting = { ...input.preExisting, [id]: checked };
    // Mutual exclusion for prior VTE categories
    if (checked && id === 'previousVte') {
      preExisting.previousVteMajorSurgery = false;
    }
    if (checked && id === 'previousVteMajorSurgery') {
      preExisting.previousVte = false;
    }
    set({ preExisting });
  };

  const postpartum = input.situation === 'postpartum';

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Patient&apos;s details
        </legend>

        <fieldset>
          <legend className={labelClass}>Patient&apos;s current situation</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="vte-situation"
                className="h-4 w-4 accent-primary"
                checked={input.situation === 'pregnant'}
                onChange={() => set({ situation: 'pregnant' })}
              />
              Patient is pregnant
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="vte-situation"
                className="h-4 w-4 accent-primary"
                checked={input.situation === 'postpartum'}
                onChange={() => set({ situation: 'postpartum' })}
              />
              Patient has given birth
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="vte-height" className={labelClass}>
            Height
            <InfoTooltip
              label="Height"
              text="Optional. With weight, derives BMI for RCOG obesity points (BMI ≥30 = 1; ≥40 = 2)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.heightValue}>
              <input
                id="vte-height"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightValue}
                onChange={(e) => set({ heightValue: e.target.value })}
                aria-invalid={Boolean(errors.heightValue)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => {
                const unit = e.target.value as HeightUnit;
                const v = parseLoose(input.heightValue);
                if (v != null && v > 0) {
                  const next = convertHeightValue(v, input.heightUnit, unit);
                  set({
                    heightUnit: unit,
                    heightValue:
                      next == null ? input.heightValue : formatField(next, 4),
                  });
                } else set({ heightUnit: unit });
              }}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="ft">ft</option>
              <option value="in">in</option>
            </select>
          </div>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="vte-weight" className={labelClass}>
            Weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightValue}>
              <input
                id="vte-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightValue}
                onChange={(e) => set({ weightValue: e.target.value })}
                aria-invalid={Boolean(errors.weightValue)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.weightUnit}
              aria-label="Weight unit"
              onChange={(e) => {
                const unit = e.target.value as WeightUnit;
                const v = parseLoose(input.weightValue);
                if (v != null && v > 0) {
                  const next = convertWeightValue(v, input.weightUnit, unit);
                  set({
                    weightUnit: unit,
                    weightValue:
                      next == null ? input.weightValue : formatField(next, 4),
                  });
                } else set({ weightUnit: unit });
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>BMI</span>
          <div className="flex h-11 items-center justify-between rounded-lg border border-border bg-muted/40 px-3 text-sm tabular-nums text-accent">
            <span>{bmiDisplay}</span>
            <span className="text-xs text-muted-foreground">kg/m²</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Pre-existing risk factors
        </legend>
        <p className="text-xs text-muted-foreground">
          Please tick all that apply…
        </p>
        <div className="space-y-2">
          {(Object.keys(PRE_EXISTING_LABELS) as PreExistingFactorId[]).map(
            (id) => (
              <CheckboxRow
                key={id}
                id={`vte-pre-${id}`}
                label={PRE_EXISTING_LABELS[id]}
                checked={input.preExisting[id]}
                onChange={(checked) => setPre(id, checked)}
              />
            )
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Obstetric risk factors
        </legend>
        <div className="space-y-2">
          {(Object.keys(OBSTETRIC_LABELS) as ObstetricFactorId[]).map((id) => (
            <CheckboxRow
              key={id}
              id={`vte-ob-${id}`}
              label={OBSTETRIC_LABELS[id]}
              checked={input.obstetric[id]}
              disabled={postpartum && id === 'artIvf'}
              onChange={(checked) =>
                set({
                  obstetric: { ...input.obstetric, [id]: checked },
                })
              }
            />
          ))}
        </div>
        {postpartum ? (
          <p className="text-[11px] text-muted-foreground">
            ART/IVF is antenatal-only under RCOG and is disabled postpartum.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Transient risk factors
        </legend>
        <div className="space-y-2">
          {(Object.keys(TRANSIENT_LABELS) as TransientFactorId[]).map((id) => (
            <CheckboxRow
              key={id}
              id={`vte-tr-${id}`}
              label={TRANSIENT_LABELS[id]}
              checked={input.transient[id]}
              disabled={postpartum && id === 'ohss'}
              onChange={(checked) =>
                set({
                  transient: { ...input.transient, [id]: checked },
                })
              }
            />
          ))}
        </div>
        {postpartum ? (
          <p className="text-[11px] text-muted-foreground">
            OHSS is first-trimester only under RCOG and is disabled postpartum.
          </p>
        ) : null}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <VteRiskPregnancyResults result={result} bmiDisplay={bmiDisplay} />
    </div>
  );
}
