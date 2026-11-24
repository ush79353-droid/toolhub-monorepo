'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { heightToCm, parseNumber, weightToKg } from './calculation';
import type {
  HeightUnit,
  KatchMcardleFieldErrors,
  KatchMcardleInput,
  KatchMcardleResult,
  LbmMode,
  MassUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const LBM_MODE_OPTIONS: { mode: LbmMode; label: string }[] = [
  { mode: 'unknown', label: "I don't know my LBM" },
  { mode: 'known_lbm', label: 'I know my LBM' },
  { mode: 'body_fat', label: 'I know my body fat %' },
];

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

function formatConverted(n: number, digits: number): string {
  if (!Number.isFinite(n)) return '';
  return String(Number(n.toFixed(digits)));
}

interface Props {
  input: KatchMcardleInput;
  errors: KatchMcardleFieldErrors;
  result: KatchMcardleResult | null;
  onChange: (input: KatchMcardleInput) => void;
}

export function KatchMcardleForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<KatchMcardleInput>) =>
    onChange({ ...input, ...patch });

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.heightText);
    if (raw === null) {
      set({ heightUnit: next });
      return;
    }
    const cm = heightToCm(raw, input.heightUnit);
    const converted = next === 'cm' ? cm : cm / 2.54;
    set({
      heightUnit: next,
      heightText: formatConverted(converted, next === 'cm' ? 1 : 2),
    });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightText);
    if (raw === null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(raw, input.weightUnit);
    const converted = next === 'kg' ? kg : kg / 0.45359237;
    set({
      weightUnit: next,
      weightText: formatConverted(converted, 1),
    });
  };

  const switchLeanMass = (next: MassUnit) => {
    if (next === input.leanMassUnit) return;
    const raw = parseNumber(input.leanMassText);
    if (raw === null) {
      set({ leanMassUnit: next });
      return;
    }
    const kg = weightToKg(raw, input.leanMassUnit);
    const converted = next === 'kg' ? kg : kg / 0.45359237;
    set({
      leanMassUnit: next,
      leanMassText: formatConverted(converted, 1),
    });
  };

  const showSex = input.lbmMode === 'unknown';
  const showWeight =
    input.lbmMode === 'unknown' || input.lbmMode === 'body_fat';
  const showHeight = input.lbmMode === 'unknown';
  const showBodyFat = input.lbmMode === 'body_fat';
  const leanEditable = input.lbmMode === 'known_lbm';
  const leanDisplay =
    leanEditable
      ? input.leanMassText
      : (result?.lbmDisplay ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>
            Do you know your lean body mass?
            <InfoTooltip text="Katch–McArdle needs lean body mass (kg). Estimate with Boer from height/weight, enter measured LBM, or derive LBM from body fat %." />
          </legend>
          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label="Lean body mass knowledge"
          >
            {LBM_MODE_OPTIONS.map(({ mode, label }) => (
              <label
                key={mode}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="katch-lbm-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.lbmMode === mode}
                  onChange={() => set({ lbmMode: mode })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {showSex ? (
          <fieldset>
            <legend className={labelClass}>Sex</legend>
            <div
              className="flex flex-wrap gap-4"
              role="radiogroup"
              aria-label="Sex"
            >
              {(['male', 'female'] as const).map((sex) => (
                <label
                  key={sex}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="katch-sex"
                    className="h-4 w-4 accent-primary"
                    checked={input.sex === sex}
                    onChange={() => set({ sex })}
                  />
                  <span className="capitalize">{sex}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {showWeight ? (
          <div>
            <label className={labelClass} htmlFor="katch-weight">
              Weight
              <InfoTooltip text="Converted to kilograms before LBM/BMR math. Switching units preserves physical mass." />
            </label>
            <FieldShell error={errors.weightText}>
              <input
                id="katch-weight"
                className={inputClass}
                inputMode="decimal"
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
                aria-invalid={Boolean(errors.weightText)}
              />
              <select
                className={unitSelectClass}
                value={input.weightUnit}
                onChange={(e) => switchWeight(e.target.value as WeightUnit)}
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
        ) : null}

        {showHeight ? (
          <div>
            <label className={labelClass} htmlFor="katch-height">
              Height
              <InfoTooltip text="Converted to centimetres before Boer LBM. Switching units preserves physical height." />
            </label>
            <FieldShell error={errors.heightText}>
              <input
                id="katch-height"
                className={inputClass}
                inputMode="decimal"
                value={input.heightText}
                onChange={(e) => set({ heightText: e.target.value })}
                aria-invalid={Boolean(errors.heightText)}
              />
              <select
                className={unitSelectClass}
                value={input.heightUnit}
                onChange={(e) => switchHeight(e.target.value as HeightUnit)}
                aria-label="Height unit"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </FieldShell>
            {errors.heightText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
            ) : null}
          </div>
        ) : null}

        {showBodyFat ? (
          <div>
            <label className={labelClass} htmlFor="katch-body-fat">
              Body fat
              <InfoTooltip text="Percent body fat. Lean mass = weight × (1 − fat%/100)." />
            </label>
            <FieldShell error={errors.bodyFatText}>
              <input
                id="katch-body-fat"
                className={inputClass}
                inputMode="decimal"
                value={input.bodyFatText}
                onChange={(e) => set({ bodyFatText: e.target.value })}
                aria-invalid={Boolean(errors.bodyFatText)}
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.bodyFatText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bodyFatText}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="katch-lbm">
            Lean body mass
            <InfoTooltip
              text={
                leanEditable
                  ? 'Measured lean body mass (DEXA, BIA, etc.), converted to kilograms for BMR.'
                  : 'Estimated or derived lean body mass used in Katch–McArdle (read-only in this mode).'
              }
            />
          </label>
          <FieldShell error={errors.leanMassText}>
            <input
              id="katch-lbm"
              className={`${inputClass}${leanEditable ? '' : ' bg-sky-50/60'}`}
              inputMode="decimal"
              readOnly={!leanEditable}
              value={leanDisplay}
              onChange={(e) =>
                leanEditable ? set({ leanMassText: e.target.value }) : undefined
              }
              aria-invalid={Boolean(errors.leanMassText)}
              aria-label={
                leanEditable
                  ? 'Lean body mass'
                  : 'Estimated lean body mass'
              }
            />
            {leanEditable ? (
              <select
                className={unitSelectClass}
                value={input.leanMassUnit}
                onChange={(e) => switchLeanMass(e.target.value as MassUnit)}
                aria-label="Lean body mass unit"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            ) : (
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                kg
              </span>
            )}
          </FieldShell>
          {errors.leanMassText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.leanMassText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-live="polite" aria-label="Results">
        <div>
          <label className={labelClass} htmlFor="katch-bmr">
            Basal metabolic rate (BMR)
            <InfoTooltip text="Katch–McArdle resting energy: 370 + 21.6 × LBM (kg), in kcal/day. No activity multiplier." />
          </label>
          <FieldShell>
            <input
              id="katch-bmr"
              readOnly
              className={`${inputClass} bg-sky-50/60`}
              value={result?.bmrDisplay ?? ''}
              aria-label="Basal metabolic rate result"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal / day
            </span>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-accent">
              {result.statusHeadline}
            </p>
            <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
            {result.equationLabel ? (
              <p className="text-xs text-muted-foreground">
                {result.equationLabel}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
