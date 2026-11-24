'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OPIOID_DRUGS,
  UNIT_LABEL,
  convertMassAmount,
  drugById,
  type OpioidDrugId,
  type OpioidUnit,
} from './drug-data';
import type {
  OpioidConversionInput,
  OpioidConversionResult,
  OpioidFieldErrors,
} from './types';
import { createEmptyDoses, formatDose } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
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
  input: OpioidConversionInput;
  errors: OpioidFieldErrors;
  result: OpioidConversionResult | null;
  onChange: (input: OpioidConversionInput) => void;
}

export function OpioidConversionForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const setDose = (id: OpioidDrugId, value: string) => {
    const doses = createEmptyDoses();
    doses[id] = value;
    onChange({ ...input, doses });
  };

  const setUnit = (id: OpioidDrugId, nextUnit: OpioidUnit) => {
    const drug = drugById(id);
    if (!drug.units.includes(nextUnit)) return;
    const prevUnit = input.units[id];
    let doseText = input.doses[id];
    if (doseText.trim() !== '' && drug.unitKind === 'mass' && prevUnit !== nextUnit) {
      const n = Number(doseText.trim().replace(/,/g, ''));
      if (Number.isFinite(n) && (prevUnit === 'mg' || prevUnit === 'mcg') && (nextUnit === 'mg' || nextUnit === 'mcg')) {
        doseText = String(convertMassAmount(n, prevUnit, nextUnit));
      }
    }
    onChange({
      ...input,
      doses: { ...input.doses, [id]: doseText },
      units: { ...input.units, [id]: nextUnit },
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-muted-foreground">
        Enter one opioid dose to see approximate equianalgesic equivalents.
        Educational comparison only—not for patient-specific rotation or
        prescribing. Incomplete cross-tolerance reduces converted (non-source)
        doses.
      </p>

      <section className={sectionClass} aria-label="Incomplete cross-tolerance">
        <div>
          <label className={labelClass} htmlFor="opioid-ict">
            Incomplete cross tolerance
            <InfoTooltip text="When switching opioids, reduce the calculated equianalgesic dose by this percent (CDC and NHS guidance commonly cite ~25–50% / up to ~30%). 0% shows full table equivalents." />
          </label>
          <FieldShell error={errors.crossToleranceText}>
            <input
              id="opioid-ict"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.crossToleranceText}
              onChange={(e) =>
                onChange({ ...input, crossToleranceText: e.target.value })
              }
              aria-invalid={Boolean(errors.crossToleranceText)}
            />
            <span className="shrink-0 pr-3 font-mono text-xs text-primary">%</span>
          </FieldShell>
          {errors.crossToleranceText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.crossToleranceText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Opioid doses">
        <h3 className="text-[15px] font-semibold text-accent">Opioid doses</h3>
        <div className="space-y-3">
          {OPIOID_DRUGS.map((drug) => {
            const isSource = result?.activeSourceId === drug.id;
            const showConverted =
              !isSource &&
              result?.convertedDoses[drug.id] != null &&
              input.doses[drug.id].trim() === '';
            const fieldValue = showConverted
              ? formatDose(result!.convertedDoses[drug.id]!, drug.unitKind)
              : input.doses[drug.id];
            return (
              <div key={drug.id}>
                <label className={labelClass} htmlFor={`opioid-${drug.id}`}>
                  {drug.label}
                </label>
                <div className="flex gap-2">
                  <FieldShell
                    error={errors[drug.id]}
                    muted={showConverted}
                  >
                    <input
                      id={`opioid-${drug.id}`}
                      type="text"
                      inputMode="decimal"
                      className={inputClass}
                      value={fieldValue}
                      readOnly={showConverted}
                      onChange={(e) => setDose(drug.id, e.target.value)}
                      aria-invalid={Boolean(errors[drug.id])}
                    />
                    {drug.units.length === 1 ? (
                      <span className="shrink-0 pr-3 font-mono text-xs text-primary">
                        {UNIT_LABEL[drug.defaultUnit]}
                      </span>
                    ) : (
                      <select
                        className={unitSelectClass}
                        value={input.units[drug.id]}
                        onChange={(e) =>
                          setUnit(drug.id, e.target.value as OpioidUnit)
                        }
                        aria-label={`${drug.label} unit`}
                        disabled={showConverted}
                      >
                        {drug.units.map((u) => (
                          <option key={u} value={u}>
                            {UNIT_LABEL[u]}
                          </option>
                        ))}
                      </select>
                    )}
                  </FieldShell>
                </div>
                {errors[drug.id] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[drug.id]}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {result?.statusDetail ? (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      ) : null}
      {result?.cautionNotes?.length ? (
        <ul className="list-disc space-y-1 pl-4 text-xs text-amber-800">
          {result.cautionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
