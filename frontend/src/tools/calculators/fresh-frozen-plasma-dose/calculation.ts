/**
 * Fresh Frozen Plasma Dose Calculator — pure engine (ADR-018).
 *
 * totalPlasmaDoseMl = weightKg × doseMlPerKg
 * equivalentUnits   = totalPlasmaDoseMl / unitVolumeMl  (exact; never rounded/ceiled)
 *
 * Sources (labeled / primary):
 * - AABB Circular of Information for the Use of Human Blood and Blood Components:
 *   standard plasma dose ~15 mL/kg; pediatric plasma components 10–15 mL/kg (Table 3);
 *   typical FFP unit ~200–250 mL (apheresis may be 400–600 mL; use labeled bag volume).
 *
 * Educational arithmetic only — not a transfusion order or blood-bank issue quantity.
 */

import type {
  FreshFrozenPlasmaDoseInput,
  FreshFrozenPlasmaDoseResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'AABB Circular of Information: standard plasma dose ~15 mL/kg; pediatric plasma 10–15 mL/kg; typical FFP unit ~200–250 mL (label volume).';

export const DISCLAIMER =
  'Always double-check the calculations with another source, and the dosing information and contraindications according to the current guidelines. Consult a health provider before administering any medication. This tool cannot replace real medical assessment.';

export const ASSUMPTIONS =
  'Educational arithmetic only: total mL = weight(kg) × dose(mL/kg); equivalent units = total ÷ unit volume. Fractional units are not a blood-bank issue order.';

/** Published AABB “standard dose” reference used as the screenshot default (mL/kg). */
export const AABB_STANDARD_DOSE_ML_PER_KG = 15;

/** Pediatric plasma dose range from AABB Circular Table 3 (mL/kg). */
export const AABB_PEDIATRIC_PLASMA_DOSE_ML_PER_KG = {
  min: 10,
  max: 15,
} as const;

/** Typical whole-blood–derived FFP unit volume band cited by AABB (mL). */
export const AABB_TYPICAL_UNIT_VOLUME_ML = {
  min: 200,
  max: 250,
} as const;

const LB_TO_KG = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/** Total plasma volume in mL from weight (kg) and dose (mL/kg). */
export function totalPlasmaDoseMl(weightKg: number, doseMlPerKg: number): number {
  if (!(weightKg > 0) || !(doseMlPerKg > 0)) {
    throw new Error('Weight and dose must be positive.');
  }
  return weightKg * doseMlPerKg;
}

/**
 * Exact equivalent units (may be fractional).
 * Rejects non-positive unit volume so callers never divide by zero.
 */
export function equivalentUnitsFromVolume(
  totalMl: number,
  unitVolumeMl: number,
): number {
  if (!(unitVolumeMl > 0)) {
    throw new Error('Unit volume must be positive.');
  }
  if (!(totalMl >= 0) || !Number.isFinite(totalMl)) {
    throw new Error('Total plasma volume must be a finite non-negative number.');
  }
  return totalMl / unitVolumeMl;
}

function emptyResult(
  patch: Partial<FreshFrozenPlasmaDoseResult> = {},
): FreshFrozenPlasmaDoseResult {
  return {
    totalPlasmaDoseMl: null,
    equivalentUnits: null,
    weightKg: null,
    doseMlPerKg: null,
    unitVolumeMl: null,
    statusHeadline: 'Enter patient weight',
    statusDetail:
      'Provide weight to compute total plasma volume and equivalent units from the ordered mL/kg dose.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
    ...patch,
  };
}

export function calculateFreshFrozenPlasmaDose(
  input: FreshFrozenPlasmaDoseInput,
): FreshFrozenPlasmaDoseResult {
  const weightRaw = parseNumber(input.weightText);
  const volumeRaw = parseNumber(input.unitVolumeText);
  const doseRaw = parseNumber(input.doseMlPerKgText);

  if (weightRaw === null) {
    return emptyResult({
      doseMlPerKg: doseRaw != null && doseRaw > 0 ? doseRaw : null,
      unitVolumeMl: volumeRaw != null && volumeRaw > 0 ? volumeRaw : null,
    });
  }

  if (!(weightRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Invalid weight',
      statusDetail: 'Patient weight must be a positive number.',
    });
  }

  if (doseRaw === null) {
    return emptyResult({
      weightKg: weightToKg(weightRaw, input.weightUnit),
      statusHeadline: 'Enter dose',
      statusDetail: 'Provide an ordered dose in mL/kg (AABB standard reference is ~15 mL/kg).',
    });
  }

  if (!(doseRaw > 0)) {
    return emptyResult({
      weightKg: weightToKg(weightRaw, input.weightUnit),
      statusHeadline: 'Invalid dose',
      statusDetail: 'Dose (mL/kg) must be a positive number.',
    });
  }

  if (volumeRaw === null) {
    return emptyResult({
      weightKg: weightToKg(weightRaw, input.weightUnit),
      doseMlPerKg: doseRaw,
      statusHeadline: 'Enter unit volume',
      statusDetail:
        'Provide the labeled FFP bag volume in mL (AABB typical units ~200–250 mL).',
    });
  }

  if (!(volumeRaw > 0)) {
    return emptyResult({
      weightKg: weightToKg(weightRaw, input.weightUnit),
      doseMlPerKg: doseRaw,
      unitVolumeMl: volumeRaw,
      statusHeadline: 'Invalid unit volume',
      statusDetail:
        'Unit volume must be greater than zero. Zero or negative bag size cannot compute equivalent units.',
    });
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const total = totalPlasmaDoseMl(weightKg, doseRaw);
  const units = equivalentUnitsFromVolume(total, volumeRaw);

  return {
    totalPlasmaDoseMl: total,
    equivalentUnits: units,
    weightKg,
    doseMlPerKg: doseRaw,
    unitVolumeMl: volumeRaw,
    statusHeadline: 'FFP dose estimate',
    statusDetail: `Total ${formatPresentationMl(total)} mL ≈ ${formatPresentationUnits(units)} equivalent unit(s) at ${formatPresentationMl(volumeRaw)} mL each — not an issue order.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}

export function formatPresentationMl(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    useGrouping: true,
  }).format(value);
}

export function formatPresentationUnits(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
    useGrouping: false,
  }).format(value);
}
