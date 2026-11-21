/**
 * Infant Tylenol Dosage Calculator — pure engine (ADR-018).
 * Weight-first OTC acetaminophen label lookup (DailyMed / Tylenol.com).
 */

import { getProductLabel } from './products';
import type {
  AgeUnit,
  DoseStatus,
  InfantTylenolDosageInput,
  InfantTylenolDosageResult,
  WeightUnit,
} from './types';

export const KG_PER_LB = 0.45359237;
export const MG_PER_ML_160_PER_5 = 32; // 160 mg / 5 mL

export const FREQUENCY_NOTE =
  'Repeat every 4 hours while symptoms last, or as directed by a doctor.';
export const MAX_DOSES_NOTE =
  'Do not give more than 5 doses in 24 hours.';
export const ACETAMINOPHEN_WARNING =
  'Do not use with any other drug containing acetaminophen (prescription or nonprescription). If you are not sure, ask a doctor or pharmacist. Severe liver damage may occur if more than directed is given.';
export const DISCLAIMER =
  'Always double-check the calculations, the dosing information and contraindications on the leaflet. Consult your health provider before administering any medication. This tool cannot replace real medical consultation.';

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

export function weightToLb(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value / KG_PER_LB : value;
}

export function lbToWeight(lb: number, unit: WeightUnit): number {
  return unit === 'kg' ? lb * KG_PER_LB : lb;
}

/** Liquid mass conversion: mL = mg / (mg per mL). */
export function mlFromMg(mg: number, mgPerMl: number): number {
  if (!(mgPerMl > 0) || !Number.isFinite(mgPerMl) || !Number.isFinite(mg)) {
    throw new RangeError('Invalid liquid concentration.');
  }
  return mg / mgPerMl;
}

export function mgFromMl(ml: number, mgPerMl: number): number {
  if (!(mgPerMl > 0) || !Number.isFinite(mgPerMl) || !Number.isFinite(ml)) {
    throw new RangeError('Invalid liquid concentration.');
  }
  return ml * mgPerMl;
}

function bandForWeightLb(
  weightLb: number,
  bands: ReturnType<typeof getProductLabel>['bands'],
) {
  return (
    bands.find((band) => {
      const above = weightLb >= band.minLbInclusive;
      const below =
        band.maxLbExclusive == null || weightLb < band.maxLbExclusive;
      return above && below;
    }) ?? null
  );
}

function interpretationFor(
  status: DoseStatus,
  productLabel: string | null,
  doseLine: string | null,
): string {
  switch (status) {
    case 'awaiting_inputs':
      return 'Enter the child’s age and weight, then select a medication type.';
    case 'awaiting_product':
      return 'Select a medication type to see the matching label dose band.';
    case 'labeled_dose':
      return `${productLabel}: ${doseLine} per dose. Prefer weight over age when both are known.`;
    case 'ask_doctor':
      return `Label directions for ${productLabel}: ask a doctor before use at this weight/age.`;
    case 'do_not_use':
      return `Label directions for ${productLabel}: do not use at this weight/age.`;
    case 'not_labeled':
      return `${productLabel} pediatric chart does not cover this weight. See adult dosing or ask a clinician.`;
    default:
      return DISCLAIMER;
  }
}

export function calculateInfantTylenolDosage(
  input: InfantTylenolDosageInput,
): InfantTylenolDosageResult {
  const ageVal = parseNumber(input.ageText);
  const weightVal = parseNumber(input.weightText);

  const ageYears =
    ageVal != null && ageVal >= 0 ? ageToYears(ageVal, input.ageUnit) : null;
  const weightLb =
    weightVal != null && weightVal > 0
      ? weightToLb(weightVal, input.weightUnit)
      : null;

  if (!input.productId) {
    return {
      productId: null,
      productLabel: null,
      activeIngredient: null,
      status: 'awaiting_product',
      doseLine: null,
      doseMg: null,
      doseMl: null,
      ageYears,
      weightLb,
      frequencyNote: FREQUENCY_NOTE,
      maxDosesNote: MAX_DOSES_NOTE,
      acetaminophenWarning: ACETAMINOPHEN_WARNING,
      interpretation: interpretationFor('awaiting_product', null, null),
      disclaimer: DISCLAIMER,
      sourceNote:
        'US OTC acetaminophen pediatric Drug Facts / Tylenol.com dosing charts.',
    };
  }

  const product = getProductLabel(input.productId);

  if (weightLb == null) {
    return {
      productId: product.id,
      productLabel: product.label,
      activeIngredient: product.activeIngredient,
      status: 'awaiting_inputs',
      doseLine: null,
      doseMg: null,
      doseMl: null,
      ageYears,
      weightLb: null,
      frequencyNote: FREQUENCY_NOTE,
      maxDosesNote: MAX_DOSES_NOTE,
      acetaminophenWarning: ACETAMINOPHEN_WARNING,
      interpretation:
        'Enter weight (preferred for label dosing). Age alone is not used to invent a dose when weight is blank.',
      disclaimer: DISCLAIMER,
      sourceNote: product.sourceNote,
    };
  }

  const band = bandForWeightLb(weightLb, product.bands);
  const status: DoseStatus = band?.status ?? 'not_labeled';
  const doseLine = band?.doseLine ?? null;

  let doseMg: number | null = null;
  let doseMl: number | null = null;

  if (status === 'labeled_dose' && band) {
    if (product.form === 'liquid' && band.ml != null && product.mgPerMl) {
      doseMl = band.ml;
      doseMg = mgFromMl(band.ml, product.mgPerMl);
    } else if (band.units != null) {
      doseMg = band.units * product.mgPerUnit;
      doseMl = null;
    }
  }

  return {
    productId: product.id,
    productLabel: product.label,
    activeIngredient: product.activeIngredient,
    status,
    doseLine,
    doseMg,
    doseMl,
    ageYears,
    weightLb,
    frequencyNote: FREQUENCY_NOTE,
    maxDosesNote: MAX_DOSES_NOTE,
    acetaminophenWarning: ACETAMINOPHEN_WARNING,
    interpretation: interpretationFor(status, product.label, doseLine),
    disclaimer: DISCLAIMER,
    sourceNote: product.sourceNote,
  };
}
