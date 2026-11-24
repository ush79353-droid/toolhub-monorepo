/**
 * IVIG Dose Calculator — pure engine (ADR-018).
 *
 * General (polyvalent IVIG grams):
 *   dosing_weight from actual / Devine IBW / AdjBW (BMI ≥ 30)
 *   grams = supplied_g_per_kg × dosing_weight
 *
 * Pregnancy hemorrhage (RhIG vials — not IVIG grams):
 *   maternal_TBV_mL = Nadler(female, height, weight)
 *   vials_raw = (% fetal cells / 100) × TBV / 30
 *   vials = AABB Technical Manual round-and-add-1 rule
 *
 * Sources:
 * - Devine BJ (1974) IBW; Ontario IG / Australian Criteria-style AdjBW
 *   (BMI ≥ 30 → IBW + 0.5×(ABW−IBW); use actual when ABW < IBW;
 *   IBW path when height ≥ 152.4 cm and weight ≥ 50 kg male / 45.5 kg female).
 * - Privigen (human IgG) DailyMed/FDA: chronic ITP 1 g/kg daily × 2 days
 *   (supplied intensity default only — not an indication picker).
 * - AABB Technical Manual RhIG dosing after KB/flow cytometry; Rho(D) 300 µg
 *   vial covers ~30 mL fetal whole blood; Nadler maternal TBV.
 */

import { nadlerBloodVolumeMl } from '../blood-volume/calculation';
import type {
  IvigDoseInput,
  IvigDoseResult,
  Sex,
  WeightBasis,
} from './types';

export const DEVINE_MIN_HEIGHT_CM = 152.4;
export const DEVINE_MIN_WEIGHT_KG_MALE = 50;
export const DEVINE_MIN_WEIGHT_KG_FEMALE = 45.5;
/** Omni / stewardship floor for adult weight-based IVIG arithmetic. */
export const MIN_ACTUAL_WEIGHT_KG = 20;
export const OBESITY_BMI_THRESHOLD = 30;
/** Labeled RhIG vial: 300 µg covers ~30 mL fetal whole blood (AABB). */
export const RHIG_FETAL_WHOLE_BLOOD_ML_PER_VIAL = 30;
/** Screenshot / Privigen ITP single-day intensity (g/kg). */
export const DEFAULT_IVIG_G_PER_KG = 1;

export const SOURCE_NOTE =
  'General IVIG: Devine IBW + AdjBW (BMI ≥ 30); grams = supplied g/kg × dosing weight. Default 1 g/kg reflects Privigen chronic ITP labeled daily intensity (DailyMed/FDA) — enter your protocol intensity. Pregnancy hemorrhage: Nadler maternal TBV + AABB Technical Manual RhIG vial rounding for 300 µg / 30 mL fetal whole-blood vials (not IVIG grams).';

export const DISCLAIMER =
  'Educational worksheet only — not a prescription, transfusion order, or medical advice. Confirm product labeling, vial size, and institutional protocol with a licensed clinician.';

export const ASSUMPTIONS =
  'IVIG grams require a clinician-supplied g/kg; unsupported indication schedules are not invented. RhIG obstetric branch outputs vials, never IVIG grams. Pediatric / pregnancy-IVIG pre-pregnancy-weight policies are out of scope.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function bmiKgM2(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  if (!(hM > 0)) throw new Error('Height must be positive.');
  return weightKg / (hM * hM);
}

/** Devine ideal body weight (kg). Requires height ≥ 152.4 cm. */
export function devineIdealBodyWeightKg(sex: Sex, heightCm: number): number {
  if (!(heightCm >= DEVINE_MIN_HEIGHT_CM) || !Number.isFinite(heightCm)) {
    throw new Error(
      `Devine IBW requires height ≥ ${DEVINE_MIN_HEIGHT_CM} cm.`,
    );
  }
  const heightIn = heightCm / IN_TO_CM;
  const base = sex === 'male' ? 50 : 45.5;
  return base + 2.3 * (heightIn - 60);
}

export function isIbwEligible(sex: Sex, weightKg: number, heightCm: number): boolean {
  const floor =
    sex === 'male' ? DEVINE_MIN_WEIGHT_KG_MALE : DEVINE_MIN_WEIGHT_KG_FEMALE;
  return heightCm >= DEVINE_MIN_HEIGHT_CM && weightKg >= floor;
}

/**
 * Select actual / ideal / adjusted dosing weight for adult IVIG stewardship math.
 */
export function selectIvigDosingWeightKg(
  sex: Sex,
  actualKg: number,
  heightCm: number,
): { dosingWeightKg: number; idealBodyWeightKg: number | null; bmi: number; weightBasis: WeightBasis } {
  if (!(actualKg > 0) || !(heightCm > 0)) {
    throw new Error('Weight and height must be positive.');
  }
  const bmi = bmiKgM2(actualKg, heightCm);

  if (!isIbwEligible(sex, actualKg, heightCm)) {
    return {
      dosingWeightKg: actualKg,
      idealBodyWeightKg: null,
      bmi,
      weightBasis: 'actual_below_ibw_eligibility',
    };
  }

  const ibw = devineIdealBodyWeightKg(sex, heightCm);

  if (bmi >= OBESITY_BMI_THRESHOLD) {
    const adj = ibw + 0.5 * (actualKg - ibw);
    return {
      dosingWeightKg: adj,
      idealBodyWeightKg: ibw,
      bmi,
      weightBasis: 'adjusted',
    };
  }

  if (actualKg < ibw) {
    return {
      dosingWeightKg: actualKg,
      idealBodyWeightKg: ibw,
      bmi,
      weightBasis: 'actual',
    };
  }

  return {
    dosingWeightKg: ibw,
    idealBodyWeightKg: ibw,
    bmi,
    weightBasis: 'ideal',
  };
}

export function ivigDoseGrams(dosingWeightKg: number, gPerKg: number): number {
  if (!(dosingWeightKg > 0) || !(gPerKg > 0)) {
    throw new Error('Dosing weight and g/kg must be positive.');
  }
  return dosingWeightKg * gPerKg;
}

/**
 * Continuous vial estimate before AABB rounding:
 * (% fetal cells / 100) × maternal blood volume (mL) / 30.
 */
export function rhigVialsRaw(
  fetalCellsPercent: number,
  maternalBloodVolumeMl: number,
): number {
  if (!(fetalCellsPercent >= 0) || !(maternalBloodVolumeMl > 0)) {
    throw new Error('Fetal cell % and maternal blood volume must be valid.');
  }
  return (fetalCellsPercent / 100) * maternalBloodVolumeMl / RHIG_FETAL_WHOLE_BLOOD_ML_PER_VIAL;
}

/**
 * AABB Technical Manual: if decimal part < 0.5 round down then +1;
 * if ≥ 0.5 round up then +1. Minimum 1 vial when any positive FMH estimate.
 */
export function aabbRhigVials(rawVials: number): number {
  if (!(rawVials >= 0) || !Number.isFinite(rawVials)) {
    throw new Error('Raw vial count must be a finite non-negative number.');
  }
  if (rawVials === 0) return 1;
  const whole = Math.floor(rawVials);
  const frac = rawVials - whole;
  const rounded = frac >= 0.5 ? whole + 1 : whole;
  return rounded + 1;
}

function emptyResult(
  product: IvigDoseResult['product'],
  patch: Partial<IvigDoseResult> = {},
): IvigDoseResult {
  return {
    product,
    weightKg: null,
    heightCm: null,
    bmi: null,
    idealBodyWeightKg: null,
    dosingWeightKg: null,
    weightBasis: 'unavailable',
    dosingGPerKg: null,
    ivigDoseGrams: null,
    maternalBloodVolumeMl: null,
    fetalCellsPercent: null,
    rhigVialsRaw: null,
    rhigVials: null,
    statusHeadline: 'Enter required fields',
    statusDetail:
      product === 'ivig'
        ? 'Provide sex, weight, height, and a supplied g/kg intensity to estimate IVIG grams.'
        : 'Provide maternal weight, height, and % fetal cells for an AABB RhIG vial estimate.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
    ...patch,
  };
}

export function formatPresentationGrams(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

export function calculateIvigDose(input: IvigDoseInput): IvigDoseResult {
  if (input.calculationType === 'pregnancy_hemorrhage') {
    return calculateRhigBranch(input);
  }
  return calculateGeneralIvigBranch(input);
}

function calculateGeneralIvigBranch(input: IvigDoseInput): IvigDoseResult {
  const weightRaw = parseNumber(input.weightText);
  const heightRaw = parseNumber(input.heightText);
  const doseRaw = parseNumber(input.dosingText);

  if (weightRaw === null || heightRaw === null) {
    return emptyResult('ivig', {
      statusHeadline: 'Enter weight and height',
      statusDetail:
        'Blank anthropometrics — no IVIG grams are invented. Enter weight and height for dosing-weight selection.',
      dosingGPerKg: doseRaw != null && doseRaw > 0 ? doseRaw : null,
    });
  }

  if (!(weightRaw > 0) || !(heightRaw > 0)) {
    return emptyResult('ivig', {
      statusHeadline: 'Invalid anthropometrics',
      statusDetail: 'Weight and height must be positive numbers.',
    });
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const heightCm = heightToCm(heightRaw, input.heightUnit);

  if (!(weightKg >= MIN_ACTUAL_WEIGHT_KG)) {
    return emptyResult('ivig', {
      weightKg,
      heightCm,
      statusHeadline: 'Weight below worksheet floor',
      statusDetail: `Educational adult IVIG weight-basis math expects actual weight ≥ ${MIN_ACTUAL_WEIGHT_KG} kg. Pediatric dosing is clinician-gated.`,
    });
  }

  if (doseRaw === null) {
    return emptyResult('ivig', {
      weightKg,
      heightCm,
      statusHeadline: 'Enter dosing (g/kg)',
      statusDetail:
        'Supply the protocol intensity in g/kg. This tool does not invent an indication-specific schedule.',
    });
  }

  if (!(doseRaw > 0)) {
    return emptyResult('ivig', {
      weightKg,
      heightCm,
      statusHeadline: 'Invalid dosing',
      statusDetail: 'Dosing (g/kg) must be a positive number.',
    });
  }

  const selected = selectIvigDosingWeightKg(input.sex, weightKg, heightCm);
  const grams = ivigDoseGrams(selected.dosingWeightKg, doseRaw);

  return {
    product: 'ivig',
    weightKg,
    heightCm,
    bmi: selected.bmi,
    idealBodyWeightKg: selected.idealBodyWeightKg,
    dosingWeightKg: selected.dosingWeightKg,
    weightBasis: selected.weightBasis,
    dosingGPerKg: doseRaw,
    ivigDoseGrams: grams,
    maternalBloodVolumeMl: null,
    fetalCellsPercent: null,
    rhigVialsRaw: null,
    rhigVials: null,
    statusHeadline: 'IVIG dose estimate',
    statusDetail: `${formatPresentationGrams(doseRaw)} g/kg × ${formatPresentationGrams(selected.dosingWeightKg)} kg (${selected.weightBasis.split('_').join(' ')}) ≈ ${formatPresentationGrams(grams)} g. Educational only — not a dispensing order.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}

function calculateRhigBranch(input: IvigDoseInput): IvigDoseResult {
  const weightRaw = parseNumber(input.weightText);
  const heightRaw = parseNumber(input.heightText);
  const fetalRaw = parseNumber(input.fetalCellsPercentText);

  if (weightRaw === null || heightRaw === null || fetalRaw === null) {
    return emptyResult('rhig', {
      statusHeadline: 'Enter maternal size and % fetal cells',
      statusDetail:
        'RhIG vial estimate needs maternal weight, height (Nadler TBV), and laboratory % fetal cells. IVIG grams are suppressed in this branch.',
      ivigDoseGrams: null,
    });
  }

  if (!(weightRaw > 0) || !(heightRaw > 0)) {
    return emptyResult('rhig', {
      statusHeadline: 'Invalid anthropometrics',
      statusDetail: 'Maternal weight and height must be positive.',
    });
  }

  if (!(fetalRaw >= 0) || fetalRaw > 100) {
    return emptyResult('rhig', {
      statusHeadline: 'Invalid fetal cell percent',
      statusDetail: 'Fetal cells must be between 0 and 100%.',
    });
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const heightCm = heightToCm(heightRaw, input.heightUnit);
  const tbv = nadlerBloodVolumeMl('female', heightCm, weightKg);
  const raw = rhigVialsRaw(fetalRaw, tbv);
  const vials = aabbRhigVials(raw);

  return {
    product: 'rhig',
    weightKg,
    heightCm,
    bmi: bmiKgM2(weightKg, heightCm),
    idealBodyWeightKg: null,
    dosingWeightKg: null,
    weightBasis: 'unavailable',
    dosingGPerKg: null,
    ivigDoseGrams: null,
    maternalBloodVolumeMl: tbv,
    fetalCellsPercent: fetalRaw,
    rhigVialsRaw: raw,
    rhigVials: vials,
    statusHeadline: 'RhIG vial estimate',
    statusDetail: `Nadler TBV ≈ ${formatPresentationGrams(tbv)} mL · raw ${formatPresentationGrams(raw)} vials → AABB rounded ${vials} × 300 µg vial(s). Not IVIG grams.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}
