/**
 * Water Intake (Adequate Intake) — educational (ADR-018).
 *
 * Institute of Medicine Dietary Reference Intakes for Water (2005).
 * Total AI includes food moisture; beverages ≈ 81% of total.
 * Adult male fixture: 3.7 L total · 3.0 L beverages (~13 cups).
 */

import type {
  AgeUnit,
  PersonMode,
  Sex,
  WaterIntakeInput,
  WaterIntakeResult,
} from './types';

export const SOURCE_NOTE =
  'Adequate Intake (AI) from Dietary Reference Intakes for Water (Institute of Medicine / National Academies, 2005). Beverages ≈ 81% of total water; remainder from food.';

export const DISCLAIMER =
  'Adequate Intake based on Dietary Reference Intakes (Institute of Medicine 2005). Actual water requirements may vary according to physical activity, climate, weather, health, and other conditions.';

/** Fraction of total AI assumed from beverages (IOM / Omni convention). */
export const BEVERAGE_FRACTION = 0.81;

/** US customary cup used for display (mL). 3.0 L → ~13 cups. */
export const ML_PER_CUP = 240;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Convert age input to age in years (continuous). */
export function ageToYears(value: number, unit: AgeUnit): number {
  return unit === 'months' ? value / 12 : value;
}

/**
 * Total water AI in liters/day from IOM 2005 table (Omni presentation).
 * Returns null when age is outside supported pediatric bands.
 */
export function totalAiLiters(
  mode: PersonMode,
  sex: Sex,
  ageYears: number | null,
): number | null {
  if (mode === 'adult') {
    return sex === 'male' ? 3.7 : 2.7;
  }
  if (ageYears === null || !(ageYears >= 0) || !Number.isFinite(ageYears)) {
    return null;
  }
  // Infant / child bands (age in years)
  if (ageYears < 0.5) return 0.7; // 0–6 months
  if (ageYears < 1) return 0.8; // 7–12 months
  if (ageYears < 4) return 1.3; // 1–3 years
  if (ageYears < 9) return 1.7; // 4–8 years
  if (ageYears < 14) return sex === 'male' ? 2.4 : 2.1; // 9–13
  if (ageYears < 19) return sex === 'male' ? 3.3 : 2.3; // 14–18
  // 19+ treated as adult AI if child mode age exceeds teen band
  return sex === 'male' ? 3.7 : 2.7;
}

export function beverageFromTotal(totalL: number): {
  beverageLiters: number;
  beverageCups: number;
} {
  const beverageLiters = totalL * BEVERAGE_FRACTION;
  const beverageCups = Math.round((beverageLiters * 1000) / ML_PER_CUP);
  return { beverageLiters, beverageCups };
}

export function formatLiters(liters: number): string {
  return String(Number(liters.toFixed(1)));
}

function emptyResult(partial?: Partial<WaterIntakeResult>): WaterIntakeResult {
  return {
    totalLiters: null,
    beverageLiters: null,
    beverageCups: null,
    formattedTotal: '',
    formattedBeverages: '',
    statusHeadline: 'Select age group and sex.',
    statusDetail: 'AI updates from IOM 2005 tables when inputs are valid.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateWaterIntake(input: WaterIntakeInput): WaterIntakeResult {
  let ageYears: number | null = null;
  if (input.mode === 'child') {
    const raw = parseNumber(input.ageText);
    if (raw === null) {
      return emptyResult({
        statusHeadline: 'Enter the child age.',
        statusDetail: 'Child mode uses IOM age bands (months or years).',
      });
    }
    if (!(raw >= 0)) {
      return emptyResult({
        statusHeadline: 'Age must be zero or greater.',
        statusDetail: 'Negative ages are not supported.',
      });
    }
    ageYears = ageToYears(raw, input.ageUnit);
    if (ageYears > 19) {
      return emptyResult({
        statusHeadline: 'Child mode supports ages up to 19 years.',
        statusDetail: 'Switch to Adult for ages 19 and older, or lower the age.',
      });
    }
  }

  const total = totalAiLiters(input.mode, input.sex, ageYears);
  if (total === null || !Number.isFinite(total)) {
    return emptyResult({
      statusHeadline: 'Unable to resolve adequate intake.',
      statusDetail: 'Check age band and sex selections.',
    });
  }

  const { beverageLiters, beverageCups } = beverageFromTotal(total);

  return {
    totalLiters: total,
    beverageLiters,
    beverageCups,
    formattedTotal: formatLiters(total),
    formattedBeverages: formatLiters(beverageLiters),
    statusHeadline: 'Adequate intake estimated.',
    statusDetail:
      input.mode === 'adult'
        ? 'Adult IOM AI for total water and beverages.'
        : 'Pediatric IOM AI band for total water and beverages.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
