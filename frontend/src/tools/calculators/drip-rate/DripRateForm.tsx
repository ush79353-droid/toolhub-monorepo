'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ConcentrationUnit,
  DoseMassUnit,
  DoseTimeUnit,
  DropFactorVolumeUnit,
  DrugMassUnit,
  DripRateFieldErrors,
  DripRateInput,
  DripRateResult,
  DripRateSource,
  DripVolumeUnit,
  DurationUnit,
  FlowTimeUnit,
  VolumeUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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

interface FormProps {
  input: DripRateInput;
  errors: DripRateFieldErrors;
  result: DripRateResult | null;
  onChange: (input: DripRateInput) => void;
}

function displayOrDerived(
  typed: string,
  derived: string | undefined,
): { value: string; muted: boolean } {
  if (typed.trim() !== '') return { value: typed, muted: false };
  if (derived && derived.trim() !== '') return { value: derived, muted: true };
  return { value: '', muted: false };
}

export function DripRateForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<DripRateInput>, source?: DripRateSource) =>
    onChange({
      ...input,
      ...patch,
      ...(source ? { source } : {}),
    });

  const conc = displayOrDerived(
    input.concentrationText,
    result?.formattedConcentration,
  );
  const drug = displayOrDerived(
    input.drugInBagText,
    result?.formattedDrugInBag,
  );
  const bag = displayOrDerived(
    input.bagVolumeText,
    result?.formattedBagVolume,
  );
  const drip = displayOrDerived(
    input.dripRateText,
    result?.formattedDripRate,
  );
  const flow = displayOrDerived(
    input.flowRateText,
    result?.formattedFlowRate,
  );
  const duration = displayOrDerived(
    input.bagDurationText,
    result?.formattedBagDuration,
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Drip rate inputs">
        <div>
          <label className={labelClass} htmlFor="drip-dose">
            Desired dose
            <InfoTooltip text="Prescribed dose rate. Converted to mg/kg/min before drip math. mcg and per-hour units are normalized." />
          </label>
          <FieldShell error={errors.doseText}>
            <input
              id="drip-dose"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.doseText}
              onChange={(e) => set({ doseText: e.target.value }, 'dose')}
              aria-invalid={Boolean(errors.doseText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Dose mass unit"
              value={input.doseMassUnit}
              onChange={(e) =>
                set(
                  { doseMassUnit: e.target.value as DoseMassUnit },
                  'dose',
                )
              }
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg</option>
            </select>
            <span className={unitFixed}>/</span>
            <select
              className={unitSelectClass}
              aria-label="Dose weight unit"
              value={input.doseWeightUnit}
              onChange={(e) =>
                set(
                  { doseWeightUnit: e.target.value as WeightUnit },
                  'dose',
                )
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            <span className={unitFixed}>/</span>
            <select
              className={unitSelectClass}
              aria-label="Dose time unit"
              value={input.doseTimeUnit}
              onChange={(e) =>
                set(
                  { doseTimeUnit: e.target.value as DoseTimeUnit },
                  'dose',
                )
              }
            >
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </FieldShell>
          {errors.doseText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.doseText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-weight">
            Body weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="drip-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value }, 'weight')}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Body weight unit"
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit }, 'weight')
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-conc">
            Concentration
            <InfoTooltip text="Solution concentration. Prefer this when known; otherwise bag volume + drug in bag define mg/L as drug×1000/volume." />
          </label>
          <FieldShell error={errors.concentrationText} muted={conc.muted}>
            <input
              id="drip-conc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={conc.value}
              onChange={(e) =>
                set({ concentrationText: e.target.value }, 'concentration')
              }
              aria-invalid={Boolean(errors.concentrationText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Concentration unit"
              value={input.concentrationUnit}
              onChange={(e) =>
                set(
                  {
                    concentrationUnit: e.target.value as ConcentrationUnit,
                  },
                  'concentration',
                )
              }
            >
              <option value="mg/L">mg/L</option>
              <option value="mg/mL">mg/mL</option>
              <option value="mcg/mL">mcg/mL</option>
            </select>
          </FieldShell>
          {errors.concentrationText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.concentrationText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-bag">
            Bag volume
          </label>
          <FieldShell error={errors.bagVolumeText} muted={bag.muted}>
            <input
              id="drip-bag"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={bag.value}
              onChange={(e) =>
                set({ bagVolumeText: e.target.value }, 'bagVolume')
              }
              aria-invalid={Boolean(errors.bagVolumeText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Bag volume unit"
              value={input.bagVolumeUnit}
              onChange={(e) =>
                set(
                  { bagVolumeUnit: e.target.value as VolumeUnit },
                  'bagVolume',
                )
              }
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.bagVolumeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bagVolumeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-drug">
            Drug in bag
          </label>
          <FieldShell error={errors.drugInBagText} muted={drug.muted}>
            <input
              id="drip-drug"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={drug.value}
              onChange={(e) =>
                set({ drugInBagText: e.target.value }, 'drugInBag')
              }
              aria-invalid={Boolean(errors.drugInBagText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Drug mass unit"
              value={input.drugMassUnit}
              onChange={(e) =>
                set(
                  { drugMassUnit: e.target.value as DrugMassUnit },
                  'drugInBag',
                )
              }
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg</option>
              <option value="g">g</option>
            </select>
          </FieldShell>
          {errors.drugInBagText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.drugInBagText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-rate">
            Drip rate
          </label>
          <FieldShell error={errors.dripRateText} muted={drip.muted}>
            <input
              id="drip-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={drip.value}
              onChange={(e) =>
                set({ dripRateText: e.target.value }, 'dripRate')
              }
              aria-invalid={Boolean(errors.dripRateText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Drip volume unit"
              value={input.dripVolumeUnit}
              onChange={(e) =>
                set(
                  { dripVolumeUnit: e.target.value as DripVolumeUnit },
                  'dripRate',
                )
              }
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
            <span className={unitFixed}>/h</span>
          </FieldShell>
          {errors.dripRateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dripRateText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-drop">
            Drop factor
          </label>
          <FieldShell error={errors.dropFactorText}>
            <span className="shrink-0 pl-3 font-mono text-xs text-primary">
              gtts/
            </span>
            <input
              id="drip-drop"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.dropFactorText}
              onChange={(e) =>
                set({ dropFactorText: e.target.value }, 'dropFactor')
              }
              aria-invalid={Boolean(errors.dropFactorText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Drop factor volume unit"
              value={input.dropFactorVolumeUnit}
              onChange={(e) =>
                set(
                  {
                    dropFactorVolumeUnit: e.target
                      .value as DropFactorVolumeUnit,
                  },
                  'dropFactor',
                )
              }
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.dropFactorText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dropFactorText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-flow">
            Flow rate
          </label>
          <FieldShell error={errors.flowRateText} muted={flow.muted}>
            <span className="shrink-0 pl-3 font-mono text-xs text-primary">
              gtts/
            </span>
            <input
              id="drip-flow"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={flow.value}
              onChange={(e) =>
                set({ flowRateText: e.target.value }, 'flowRate')
              }
              aria-invalid={Boolean(errors.flowRateText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Flow time unit"
              value={input.flowTimeUnit}
              onChange={(e) =>
                set(
                  { flowTimeUnit: e.target.value as FlowTimeUnit },
                  'flowRate',
                )
              }
            >
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </FieldShell>
          {errors.flowRateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.flowRateText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="drip-duration">
            Time to end bag
          </label>
          <FieldShell error={errors.bagDurationText} muted={duration.muted}>
            <input
              id="drip-duration"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={duration.value}
              onChange={(e) =>
                set({ bagDurationText: e.target.value }, 'bagDuration')
              }
              aria-invalid={Boolean(errors.bagDurationText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Duration unit"
              value={input.durationUnit}
              onChange={(e) =>
                set(
                  { durationUnit: e.target.value as DurationUnit },
                  'bagDuration',
                )
              }
            >
              <option value="hrs">hrs</option>
              <option value="min">min</option>
            </select>
          </FieldShell>
          {errors.bagDurationText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.bagDurationText}
            </p>
          ) : null}
        </div>

        {result?.statusHeadline ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-accent">
            <p className="font-semibold">{result.statusHeadline}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
