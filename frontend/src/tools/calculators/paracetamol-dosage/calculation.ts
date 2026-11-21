/**
 * Paracetamol Dosage Calculator — pure engine (ADR-018).
 *
 * Educational pediatric oral/rectal weight-based ceiling used by common
 * teaching calculators (Omni-style):
 *   single = 15 mg/kg (cap 1,000 mg)
 *   daily  = 60 mg/kg (cap 4,000 mg) = 4 × single when uncapped
 * Age gate: under 3 months → too young (seek clinician).
 *
 * Not a substitute for BNFC age-band product leaflets or local protocols.
 * NHS/BNFC age-band volumes differ by product strength — link users to
 * Infant Tylenol Dosage for US OTC label forms.
 */

import type {
  AgeUnit,
  DoseStatus,
  ParacetamolDosageInput,
  ParacetamolDosageResult,
  WeightUnit,
} from './types';

export const KG_PER_LB = 0.45359237;

/** Standard pediatric single-dose coefficient (mg per kg). */
export const SINGLE_DOSE_MG_PER_KG = 15;
/** Standard pediatric maximum daily coefficient (mg per kg). */
export const DAILY_DOSE_MG_PER_KG = 60;
export const MAX_DOSES_PER_24H = 4;
export const MIN_HOURS_BETWEEN_DOSES = 4;
/** Do not auto-dose under this age without clinician advice. */
export const MIN_AGE_MONTHS = 3;
export const AGE_YEARS_MAX = 17;
/** Adult oral single-dose ceiling applied as hard cap. */
export const ADULT_SINGLE_CAP_MG = 1000;
/** Adult oral 24h ceiling applied as hard cap. */
export const ADULT_DAILY_CAP_MG = 4000;

export const FREQUENCY_NOTE =
  'Administer the single dose a maximum of 4 times in 24 hours.';
export const INTERVAL_NOTE =
  'Wait at least 4 hours between doses.';
export const SOURCE_NOTE =
  'Uses the common educational pediatric ceiling of 15 mg/kg per dose (max 4 doses/24 h; 60 mg/kg/day), capped at adult oral limits of 1,000 mg/dose and 4,000 mg/day. Product leaflets and BNFC age-band volumes may differ — always follow the labeled product.';
export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and contraindications on the leaflet. Contact your health provider before administering.';
export const INFANT_TYLENOL_HREF = '/tools/infant-tylenol-dosage-calculator';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ageToYears(value: number, unit: AgeUnit): number {
  return unit === 'mos' ? value / 12 : value;
}

export function ageToMonths(value: number, unit: AgeUnit): number {
  return unit === 'mos' ? value : value * 12;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function formatMg(mg: number): string {
  if (!Number.isFinite(mg)) return '';
  const rounded = Math.round(mg * 10) / 10;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString('en-US');
  }
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function computeWeightBasedDoses(weightKg: number): {
  singleMg: number;
  dailyMg: number;
  capped: boolean;
} {
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new RangeError('Weight must be a positive finite number.');
  }
  let singleMg = weightKg * SINGLE_DOSE_MG_PER_KG;
  let dailyMg = weightKg * DAILY_DOSE_MG_PER_KG;
  let capped = false;
  if (singleMg > ADULT_SINGLE_CAP_MG) {
    singleMg = ADULT_SINGLE_CAP_MG;
    capped = true;
  }
  if (dailyMg > ADULT_DAILY_CAP_MG) {
    dailyMg = ADULT_DAILY_CAP_MG;
    capped = true;
  }
  // Keep daily consistent with 4 × single when single was the binding cap.
  if (singleMg * MAX_DOSES_PER_24H < dailyMg) {
    dailyMg = singleMg * MAX_DOSES_PER_24H;
  }
  return { singleMg, dailyMg, capped };
}

export function calculateParacetamolDosage(
  input: ParacetamolDosageInput,
): ParacetamolDosageResult {
  const base: ParacetamolDosageResult = {
    status: 'awaiting_inputs',
    ageYears: null,
    weightKg: null,
    singleDoseMg: null,
    dailyDoseMg: null,
    formattedSingleDose: null,
    formattedDailyDose: null,
    frequencyNote: FREQUENCY_NOTE,
    intervalNote: INTERVAL_NOTE,
    infantTylenolHref: INFANT_TYLENOL_HREF,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    statusNote: null,
  };

  const ageVal = parseNumber(input.age);
  const weightVal = parseNumber(input.weight);
  if (ageVal == null || weightVal == null) {
    return {
      ...base,
      statusNote: 'Enter the child’s age and weight to see educational dose ceilings.',
    };
  }
  if (!(ageVal >= 0) || !(weightVal > 0)) {
    return base;
  }

  const ageYears = ageToYears(ageVal, input.ageUnit);
  const ageMonths = ageToMonths(ageVal, input.ageUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);

  if (ageMonths < MIN_AGE_MONTHS) {
    return {
      ...base,
      status: 'too_young',
      ageYears,
      weightKg,
      statusNote: `Under ${MIN_AGE_MONTHS} months of age, do not use this calculator — ask a clinician before giving paracetamol.`,
    };
  }

  if (ageYears > AGE_YEARS_MAX) {
    return {
      ...base,
      status: 'awaiting_inputs',
      ageYears,
      weightKg,
      statusNote: `This pediatric tool covers ages up to ${AGE_YEARS_MAX} years. For adults, follow adult label dosing (typically up to 1,000 mg per dose / 4,000 mg per day) or ask a clinician.`,
    };
  }

  if (!(weightKg > 0) || weightKg > 200) {
    return base;
  }

  const { singleMg, dailyMg, capped } = computeWeightBasedDoses(weightKg);
  const status: DoseStatus = capped ? 'capped' : 'ready';

  return {
    ...base,
    status,
    ageYears,
    weightKg,
    singleDoseMg: singleMg,
    dailyDoseMg: dailyMg,
    formattedSingleDose: formatMg(singleMg),
    formattedDailyDose: formatMg(dailyMg),
    statusNote: capped
      ? 'Weight-based amounts were capped at adult oral limits (1,000 mg per dose / 4,000 mg per day).'
      : null,
  };
}
