/**
 * Opioid Conversion Calculator — types & defaults (ADR-018 / ADR-023).
 *
 * Screenshot: incomplete cross-tolerance %, blank route-specific opioid rows
 * with unit selectors, share/reload/clear. No FX. Share = public page URL only.
 */

import {
  OPIOID_DRUGS,
  type OpioidDrugId,
  type OpioidUnit,
} from './drug-data';

export type { OpioidDrugId, OpioidUnit };

export type OpioidDoseFields = Record<OpioidDrugId, string>;
export type OpioidUnitFields = Record<OpioidDrugId, OpioidUnit>;

export interface OpioidConversionInput {
  /** Incomplete cross-tolerance reduction percent (0 = no reduction). */
  crossToleranceText: string;
  doses: OpioidDoseFields;
  units: OpioidUnitFields;
}

export interface OpioidConversionResult {
  /** Filled equivalents for non-source rows (in each row’s selected unit). */
  convertedDoses: Partial<Record<OpioidDrugId, number>>;
  activeSourceId: OpioidDrugId | null;
  /** Oral morphine mg equivalent of the active source (before ICT). */
  oralMorphineEquivalentMg: number | null;
  crossTolerancePercent: number;
  statusHeadline: string;
  statusDetail: string;
  cautionNotes: readonly string[];
  disclaimer: string;
}

export type OpioidFieldErrors = Partial<
  Record<OpioidDrugId | 'crossToleranceText', string>
>;

export function createEmptyDoses(): OpioidDoseFields {
  return Object.fromEntries(OPIOID_DRUGS.map((d) => [d.id, ''])) as OpioidDoseFields;
}

export function createDefaultUnits(): OpioidUnitFields {
  return Object.fromEntries(
    OPIOID_DRUGS.map((d) => [d.id, d.defaultUnit]),
  ) as OpioidUnitFields;
}

/** Screenshot shows incomplete cross-tolerance 0% — modifier default, not a drug dose. */
export function createDefaultInput(): OpioidConversionInput {
  return {
    crossToleranceText: '0',
    doses: createEmptyDoses(),
    units: createDefaultUnits(),
  };
}

export function createEmptyInput(): OpioidConversionInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: OpioidConversionInput,
  b: OpioidConversionInput,
): boolean {
  if (a.crossToleranceText !== b.crossToleranceText) return false;
  return OPIOID_DRUGS.every(
    (d) => a.doses[d.id] === b.doses[d.id] && a.units[d.id] === b.units[d.id],
  );
}

/** Presentation rounding only — engine stays unrounded until display. */
export function formatDose(
  value: number | null | undefined,
  kind: 'mass' | 'rate' = 'mass',
): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const digits =
    kind === 'rate'
      ? abs >= 10
        ? 1
        : 2
      : abs >= 100
        ? 1
        : abs >= 10
          ? 2
          : abs >= 1
            ? 3
            : 4;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
