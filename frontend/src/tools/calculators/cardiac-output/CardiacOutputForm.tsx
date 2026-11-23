'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cmToHeightUnit,
  gPerDlToHbUnit,
  heightToCm,
  hemoglobinToGPerDl,
  kgToWeightUnit,
  lPerMinToCoUnit,
  m2ToBsaUnit,
  mlPerLToContentUnit,
  mlPerMinToVo2Unit,
  torrToTensionUnit,
  weightToKg,
  bsaToM2,
  contentToMlPerL,
  tensionToTorr,
  vo2ToMlPerMin,
} from './calculation';
import type {
  BsaUnit,
  CardiacOutputFieldErrors,
  CardiacOutputInput,
  CardiacOutputResult,
  ContentUnit,
  CoUnit,
  HbUnit,
  HeightUnit,
  TensionUnit,
  Vo2Unit,
  WeightUnit,
} from './types';
import {
  BSA_UNIT_LABELS,
  CO_UNIT_LABELS,
  CONTENT_UNIT_LABELS,
  HB_UNIT_LABELS,
  HEIGHT_UNIT_LABELS,
  TENSION_UNIT_LABELS,
  VO2_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const resultInputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
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
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

interface Props {
  input: CardiacOutputInput;
  errors: CardiacOutputFieldErrors;
  result: CardiacOutputResult | null;
  onChange: (input: CardiacOutputInput) => void;
  onLoadExample: () => void;
}

export function CardiacOutputForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<CardiacOutputInput>) =>
    onChange({ ...input, ...patch });

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseLoose(input.heightValue);
    let nextValue = input.heightValue;
    if (raw != null) {
      const cm = heightToCm(raw, input.heightUnit);
      if (cm != null) nextValue = formatField(cmToHeightUnit(cm, next), 2);
    }
    set({ heightUnit: next, heightValue: nextValue });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseLoose(input.weightValue);
    let nextValue = input.weightValue;
    if (raw != null) {
      const kg = weightToKg(raw, input.weightUnit);
      if (kg != null) nextValue = formatField(kgToWeightUnit(kg, next), 2);
    }
    set({ weightUnit: next, weightValue: nextValue });
  };

  const switchBsa = (next: BsaUnit) => {
    if (next === input.bsaUnit) return;
    const raw = parseLoose(input.bsaValue);
    let nextValue = input.bsaValue;
    if (raw != null) {
      const m2 = bsaToM2(raw, input.bsaUnit);
      if (m2 != null) nextValue = formatField(m2ToBsaUnit(m2, next), 3);
    }
    set({ bsaUnit: next, bsaValue: nextValue });
  };

  const switchVo2 = (next: Vo2Unit) => {
    if (next === input.vo2Unit) return;
    const raw = parseLoose(input.vo2Value);
    let nextValue = input.vo2Value;
    if (raw != null) {
      const ml = vo2ToMlPerMin(raw, input.vo2Unit);
      if (ml != null) nextValue = formatField(mlPerMinToVo2Unit(ml, next), 2);
    }
    set({ vo2Unit: next, vo2Value: nextValue });
  };

  const switchHb = (next: HbUnit) => {
    if (next === input.hemoglobinUnit) return;
    const raw = parseLoose(input.hemoglobinValue);
    let nextValue = input.hemoglobinValue;
    if (raw != null) {
      const g = hemoglobinToGPerDl(raw, input.hemoglobinUnit);
      if (g != null) nextValue = formatField(gPerDlToHbUnit(g, next), 2);
    }
    set({ hemoglobinUnit: next, hemoglobinValue: nextValue });
  };

  const switchTension = (
    side: 'arterial' | 'venous',
    next: TensionUnit
  ) => {
    if (side === 'arterial') {
      if (next === input.arterialTensionUnit) return;
      const raw = parseLoose(input.arterialTension);
      let nextValue = input.arterialTension;
      if (raw != null) {
        const torr = tensionToTorr(raw, input.arterialTensionUnit);
        if (torr != null) nextValue = formatField(torrToTensionUnit(torr, next), 2);
      }
      set({ arterialTensionUnit: next, arterialTension: nextValue });
    } else {
      if (next === input.venousTensionUnit) return;
      const raw = parseLoose(input.venousTension);
      let nextValue = input.venousTension;
      if (raw != null) {
        const torr = tensionToTorr(raw, input.venousTensionUnit);
        if (torr != null) nextValue = formatField(torrToTensionUnit(torr, next), 2);
      }
      set({ venousTensionUnit: next, venousTension: nextValue });
    }
  };

  const switchContent = (side: 'arterial' | 'venous', next: ContentUnit) => {
    if (side === 'arterial') {
      if (next === input.arterialContentUnit) return;
      const raw = parseLoose(input.arterialContent);
      let nextValue = input.arterialContent;
      if (raw != null) {
        const ml = contentToMlPerL(raw, input.arterialContentUnit);
        if (ml != null) {
          nextValue = formatField(mlPerLToContentUnit(ml, next), 2);
        }
      }
      set({ arterialContentUnit: next, arterialContent: nextValue });
    } else {
      if (next === input.venousContentUnit) return;
      const raw = parseLoose(input.venousContent);
      let nextValue = input.venousContent;
      if (raw != null) {
        const ml = contentToMlPerL(raw, input.venousContentUnit);
        if (ml != null) {
          nextValue = formatField(mlPerLToContentUnit(ml, next), 2);
        }
      }
      set({ venousContentUnit: next, venousContent: nextValue });
    }
  };

  const switchCo = (next: CoUnit) => {
    if (next === input.coUnit) return;
    set({ coUnit: next });
  };

  const coDisplay =
    result != null
      ? formatField(
          lPerMinToCoUnit(result.cardiacOutputLPerMin, input.coUnit),
          input.coUnit === 'mL/min' ? 0 : 2
        )
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational Fick cardiac output from estimated or entered oxygen
        consumption and arteriovenous oxygen content.{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline"
          onClick={onLoadExample}
        >
          Load example
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <div>
          <div className={labelClass}>
            <span>Your height</span>
            <InfoTooltip text="Used with weight for Mosteller BSA when BSA is not entered manually." />
          </div>
          <FieldShell error={errors.heightValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.heightValue}
              aria-label="Height"
              onChange={(e) =>
                set({ heightValue: e.target.value, bsaManual: false })
              }
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => switchHeight(e.target.value as HeightUnit)}
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
          <div className={labelClass}>
            <span>Your weight</span>
            <InfoTooltip text="Used with height for Mosteller BSA when BSA is not entered manually." />
          </div>
          <FieldShell error={errors.weightValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.weightValue}
              aria-label="Weight"
              onChange={(e) =>
                set({ weightValue: e.target.value, bsaManual: false })
              }
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              aria-label="Weight unit"
              onChange={(e) => switchWeight(e.target.value as WeightUnit)}
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
          <div className={labelClass}>
            <span>Body surface area</span>
            <InfoTooltip text="Mosteller √(height_cm × weight_kg / 3600). Edit to override." />
          </div>
          <FieldShell error={errors.bsaValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.bsaValue}
              aria-label="Body surface area"
              onChange={(e) =>
                set({ bsaValue: e.target.value, bsaManual: true })
              }
            />
            <select
              className={unitSelectClass}
              value={input.bsaUnit}
              aria-label="BSA unit"
              onChange={(e) => switchBsa(e.target.value as BsaUnit)}
            >
              {(Object.keys(BSA_UNIT_LABELS) as BsaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {BSA_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.bsaValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bsaValue}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>O₂ consumption</span>
            <InfoTooltip text="Estimated as 125 mL/min/m² × BSA when blank. Marked as estimated in results. Edit to enter a measured VO₂." />
          </div>
          <FieldShell error={errors.vo2Value}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.vo2Value}
              aria-label="Oxygen consumption"
              onChange={(e) =>
                set({ vo2Value: e.target.value, vo2Manual: true })
              }
            />
            <select
              className={unitSelectClass}
              value={input.vo2Unit}
              aria-label="O2 consumption unit"
              onChange={(e) => switchVo2(e.target.value as Vo2Unit)}
            >
              {(Object.keys(VO2_UNIT_LABELS) as Vo2Unit[]).map((u) => (
                <option key={u} value={u}>
                  {VO2_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.vo2Value ? (
            <p className="mt-1 text-xs text-rose-600">{errors.vo2Value}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Hemoglobin</span>
            <InfoTooltip text="Used with saturation and tension to estimate arterial and venous oxygen content." />
          </div>
          <FieldShell error={errors.hemoglobinValue}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.hemoglobinValue}
              aria-label="Hemoglobin"
              onChange={(e) => set({ hemoglobinValue: e.target.value })}
            />
            <select
              className={unitSelectClass}
              value={input.hemoglobinUnit}
              aria-label="Hemoglobin unit"
              onChange={(e) => switchHb(e.target.value as HbUnit)}
            >
              {(Object.keys(HB_UNIT_LABELS) as HbUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HB_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.hemoglobinValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hemoglobinValue}</p>
          ) : null}
        </div>
      </div>

      <CollapsibleSection
        title="Arterial blood"
        open={input.arterialOpen}
        onToggle={() => set({ arterialOpen: !input.arterialOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Oxygen saturation</span>
            <InfoTooltip text="Arterial O₂ saturation as a percentage (0–100)." />
          </div>
          <FieldShell error={errors.arterialSaturation}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.arterialSaturation}
              aria-label="Arterial oxygen saturation"
              onChange={(e) =>
                set({
                  arterialSaturation: e.target.value,
                  arterialContentManual: false,
                })
              }
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.arterialSaturation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.arterialSaturation}
            </p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Oxygen tension</span>
            <InfoTooltip text="PaO₂ for the dissolved oxygen term (Torr ≈ mmHg)." />
          </div>
          <FieldShell error={errors.arterialTension}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.arterialTension}
              aria-label="Arterial oxygen tension"
              onChange={(e) =>
                set({
                  arterialTension: e.target.value,
                  arterialContentManual: false,
                })
              }
            />
            <select
              className={unitSelectClass}
              value={input.arterialTensionUnit}
              aria-label="Arterial tension unit"
              onChange={(e) =>
                switchTension('arterial', e.target.value as TensionUnit)
              }
            >
              {(Object.keys(TENSION_UNIT_LABELS) as TensionUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TENSION_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.arterialTension ? (
            <p className="mt-1 text-xs text-rose-600">{errors.arterialTension}</p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Oxygen concentration</span>
            <InfoTooltip text="CaO₂. Auto-filled from Hb × sat + dissolved PO₂, or enter manually." />
          </div>
          <FieldShell error={errors.arterialContent}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.arterialContent}
              aria-label="Arterial oxygen concentration"
              onChange={(e) =>
                set({
                  arterialContent: e.target.value,
                  arterialContentManual: true,
                })
              }
            />
            <select
              className={unitSelectClass}
              value={input.arterialContentUnit}
              aria-label="Arterial content unit"
              onChange={(e) =>
                switchContent('arterial', e.target.value as ContentUnit)
              }
            >
              {(Object.keys(CONTENT_UNIT_LABELS) as ContentUnit[]).map((u) => (
                <option key={u} value={u}>
                  {CONTENT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.arterialContent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.arterialContent}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Venous blood"
        open={input.venousOpen}
        onToggle={() => set({ venousOpen: !input.venousOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Oxygen saturation</span>
            <InfoTooltip text="Mixed venous (pulmonary artery) O₂ saturation as a percentage." />
          </div>
          <FieldShell error={errors.venousSaturation}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.venousSaturation}
              aria-label="Venous oxygen saturation"
              onChange={(e) =>
                set({
                  venousSaturation: e.target.value,
                  venousContentManual: false,
                })
              }
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.venousSaturation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.venousSaturation}
            </p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Oxygen tension</span>
            <InfoTooltip text="PvO₂ for the dissolved oxygen term." />
          </div>
          <FieldShell error={errors.venousTension}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.venousTension}
              aria-label="Venous oxygen tension"
              onChange={(e) =>
                set({
                  venousTension: e.target.value,
                  venousContentManual: false,
                })
              }
            />
            <select
              className={unitSelectClass}
              value={input.venousTensionUnit}
              aria-label="Venous tension unit"
              onChange={(e) =>
                switchTension('venous', e.target.value as TensionUnit)
              }
            >
              {(Object.keys(TENSION_UNIT_LABELS) as TensionUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TENSION_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.venousTension ? (
            <p className="mt-1 text-xs text-rose-600">{errors.venousTension}</p>
          ) : null}
        </div>
        <div>
          <div className={labelClass}>
            <span>Oxygen concentration</span>
            <InfoTooltip text="CvO₂. Auto-filled from Hb × sat + dissolved PO₂, or enter manually." />
          </div>
          <FieldShell error={errors.venousContent}>
            <input
              className={inputClass}
              inputMode="decimal"
              value={input.venousContent}
              aria-label="Venous oxygen concentration"
              onChange={(e) =>
                set({
                  venousContent: e.target.value,
                  venousContentManual: true,
                })
              }
            />
            <select
              className={unitSelectClass}
              value={input.venousContentUnit}
              aria-label="Venous content unit"
              onChange={(e) =>
                switchContent('venous', e.target.value as ContentUnit)
              }
            >
              {(Object.keys(CONTENT_UNIT_LABELS) as ContentUnit[]).map((u) => (
                <option key={u} value={u}>
                  {CONTENT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.venousContent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.venousContent}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Cardiac output"
        open={input.resultsOpen}
        onToggle={() => set({ resultsOpen: !input.resultsOpen })}
      >
        <div>
          <div className={labelClass}>
            <span>Cardiac output</span>
            <InfoTooltip text="CO = VO₂ / (CaO₂ − CvO₂) with contents in mL/L." />
          </div>
          <FieldShell muted>
            <input
              className={resultInputClass}
              readOnly
              value={coDisplay}
              aria-label="Cardiac output result"
              tabIndex={-1}
            />
            <select
              className={unitSelectClass}
              value={input.coUnit}
              aria-label="Cardiac output unit"
              onChange={(e) => switchCo(e.target.value as CoUnit)}
            >
              {(Object.keys(CO_UNIT_LABELS) as CoUnit[]).map((u) => (
                <option key={u} value={u}>
                  {CO_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
        <div>
          <div className={labelClass}>
            <span>Cardiac index</span>
            <InfoTooltip text="CI = CO / BSA (L/(min·m²))." />
          </div>
          <FieldShell muted>
            <input
              className={resultInputClass}
              readOnly
              value={result?.formattedCi ?? ''}
              aria-label="Cardiac index result"
              tabIndex={-1}
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">
              L/(min·m²)
            </span>
          </FieldShell>
        </div>
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation} {result.disclaimer}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter height and weight (or BSA), hemoglobin with arterial and
            venous saturations, or enter VO₂ and oxygen concentrations
            directly.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
