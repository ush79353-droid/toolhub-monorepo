/**
 * Pediatric endotracheal tube size estimates (educational).
 *
 * Cole (1957) uncuffed ID (mm) = age_years/4 + 4  — intended ~1–12 years.
 * Cuffed ID (mm) = age_years/4 + 3  (Omni / Khine-style; 0.5–1 mm smaller than uncuffed).
 * Oral insertion depth (cm) = age_years/2 + 12.
 * Commercial half-size rounding: nearest 0.5 mm for tube IDs only.
 */

import { DISCLAIMER, SOURCE_NOTE } from './content';
import type {
  AgeUnit,
  EndotrachealTubeSizeInput,
  EndotrachealTubeSizeResult,
} from './types';

export { DISCLAIMER, SOURCE_NOTE };

/** Cole pediatric band used by this worksheet. */
export const MIN_COLE_AGE_YEARS = 1;
export const MAX_COLE_AGE_YEARS = 12;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toAgeYears(value: number, unit: AgeUnit): number {
  return unit === 'yrs' ? value : value / 12;
}

export function fromAgeYears(years: number, unit: AgeUnit): number {
  return unit === 'yrs' ? years : years * 12;
}

/** Round tube ID to nearest 0.5 mm. */
export function roundHalfMm(mm: number): number {
  return Math.round(mm * 2) / 2;
}

export function coleUncuffedMm(ageYears: number): number {
  return ageYears / 4 + 4;
}

export function khineCuffedMm(ageYears: number): number {
  return ageYears / 4 + 3;
}

export function insertionDepthCm(ageYears: number): number {
  return ageYears / 2 + 12;
}

export function calculateEndotrachealTubeSize(
  input: EndotrachealTubeSizeInput,
): EndotrachealTubeSizeResult {
  const empty = {
    uncuffedMm: null as number | null,
    cuffedMm: null as number | null,
    insertionDepthCm: null as number | null,
    formattedUncuffed: '',
    formattedCuffed: '',
    formattedDepth: '',
    ageYears: null as number | null,
    populationLabel: null as string | null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const raw = parseNumber(input.ageText);
  if (raw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter age',
      statusDetail:
        'Age is blank. Enter age in years or months. Cole formulas apply for about 1–12 years.',
    };
  }

  if (raw < 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be non-negative.',
    };
  }

  const ageYears = toAgeYears(raw, input.ageUnit);

  if (ageYears < MIN_COLE_AGE_YEARS || ageYears > MAX_COLE_AGE_YEARS) {
    return {
      ...empty,
      ageYears,
      populationLabel:
        ageYears < MIN_COLE_AGE_YEARS
          ? 'Infant / neonate (<1 year)'
          : 'Outside Cole pediatric band (>12 years)',
      statusHeadline: 'Age outside Cole 1–12 year range',
      statusDetail:
        ageYears < MIN_COLE_AGE_YEARS
          ? 'Age-based Cole/Khine formulas are not applied under 1 year. Use clinical weight-/length-based sizing for neonates and infants.'
          : 'Age-based Cole/Khine formulas are not applied over 12 years. Adult sizing usually uses clinical judgment (height/weight), not age alone.',
    };
  }

  const uncuffedMm = roundHalfMm(coleUncuffedMm(ageYears));
  const cuffedMm = roundHalfMm(khineCuffedMm(ageYears));
  const depth = Math.round(insertionDepthCm(ageYears) * 10) / 10;

  return {
    uncuffedMm,
    cuffedMm,
    insertionDepthCm: depth,
    formattedUncuffed: uncuffedMm.toFixed(1),
    formattedCuffed: cuffedMm.toFixed(1),
    formattedDepth: String(depth),
    ageYears,
    populationLabel: 'Pediatric Cole band (1–12 years)',
    statusHeadline: 'Estimated ETT sizes',
    statusDetail: `Uncuffed ${uncuffedMm.toFixed(1)} mm ID · cuffed ${cuffedMm.toFixed(1)} mm ID · depth ≈ ${depth} cm. Educational estimate only — verify clinically.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
