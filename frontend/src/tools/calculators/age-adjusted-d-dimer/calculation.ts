/**
 * Age-adjusted D-dimer cutoff — validated FEU/DDU pathways (ADR-018).
 *
 * FEU (age > 50): cutoff = age × 10 µg/L; FEU (age ≤ 50): 500 µg/L.
 * DDU (age > 50): cutoff = age × 5 µg/L; DDU (age ≤ 50): 250 µg/L
 *   (DDU numeric threshold ≈ half FEU for the same clinical decision).
 *
 * µg/mL = µg/L ÷ 1000 (liter multiplier 1,000 µg/L per µg/mL).
 */

import type {
  AgeAdjustedDDimerInput,
  AgeAdjustedDDimerResult,
  DdimerAssayUnit,
} from './types';

export const LITER_MULTIPLIER = 1000;

export const SOURCE_NOTE =
  'Age-adjusted D-dimer for VTE exclusion in validated pretest-probability settings. FEU: ≤50 y → 500 µg/L; >50 y → age×10 µg/L. DDU thresholds use half the FEU µg/L values for assay-specific reporting.';

export const DISCLAIMER =
  'Educational reference thresholds only — not a diagnosis. Apply only with validated clinical pathways.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ageAdjustedCutoffMicrogPerLiter(
  ageYears: number,
  assayUnit: DdimerAssayUnit,
): number {
  if (!(Number.isFinite(ageYears) && ageYears >= 0)) {
    throw new Error('Age must be a non-negative finite number.');
  }

  if (assayUnit === 'FEU') {
    if (ageYears > 50) return ageYears * 10;
    return 500;
  }
  // DDU
  if (ageYears > 50) return ageYears * 5;
  return 250;
}

export function microgPerLiterToMicrogPerMilliliter(
  microgPerLiter: number,
): number {
  return microgPerLiter / LITER_MULTIPLIER;
}

export function calculateAgeAdjustedDDimer(
  input: AgeAdjustedDDimerInput,
): AgeAdjustedDDimerResult {
  const empty = {
    cutoffMicrogPerLiter: null,
    cutoffMicrogPerMilliliter: null,
    literMultiplier: LITER_MULTIPLIER,
    usesAgeAdjustment: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  if (age === null) {
    return {
      ...empty,
      statusHeadline: 'Enter age',
      statusDetail: 'Enter patient age in years to compute the age-adjusted D-dimer cutoff.',
    };
  }

  if (!(age >= 0 && age <= 120)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between 0 and 120 years.',
    };
  }

  const cutoffL = ageAdjustedCutoffMicrogPerLiter(age, input.assayUnit);
  const cutoffMl = microgPerLiterToMicrogPerMilliliter(cutoffL);
  const adjusted = age > 50;

  return {
    cutoffMicrogPerLiter: cutoffL,
    cutoffMicrogPerMilliliter: cutoffMl,
    literMultiplier: LITER_MULTIPLIER,
    usesAgeAdjustment: adjusted,
    statusHeadline: 'Age-adjusted D-dimer cutoff',
    statusDetail: `${input.assayUnit}: ${cutoffL} µg/L (= ${formatCutoff(cutoffMl)} µg/mL)${adjusted ? ` for age ${age} (>50, age×${input.assayUnit === 'FEU' ? 10 : 5}).` : ' (fixed younger threshold ≤50 y).'}`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatCutoff(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const abs = Math.abs(value);
  const maxFrac = abs >= 10 ? 1 : abs >= 1 ? 2 : 3;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(value);
}