/**
 * Levothyroxine eligibility + educational teaching estimate (ADR-018).
 *
 * Sources:
 * - DailyMed SYNTHROID (updated 2024-02-20), setid
 *   1e11ad30-1041-4520-10b0-8f9d30d30fcc — adult full replacement ≈ 1.6 mcg/kg/day;
 *   lower start if cardiac disease / geriatric; titrate on TSH or free-T4.
 * - Omni Levothyroxine Dosage article — uses actual vs Devine ideal body weight
 *   (IBW) when above ideal; notes lower needs for older patients, heart disease,
 *   and subclinical hypothyroidism — without publishing a complete decision table.
 * - Devine BJ (1974) IBW equations as commonly cited in pharmacy references
 *   (adults ≥60 in / 152.4 cm).
 *
 * Approved numeric output: educational teaching estimate only for
 * age 15–50 + FT4 Low + no heart disease + Devine-eligible height, using
 * 1.6 × min(actual kg, IBW kg). Not a prescription.
 */

import type {
  HeightUnit,
  LevothyroxineDosageInput,
  LevothyroxineDosageResult,
  Sex,
  WeightUnit,
} from './types';

export const KG_PER_POUND = 0.45359237;
export const CM_PER_INCH = 2.54;

/** FDA label teaching constant (adult full replacement). */
export const FDA_FULL_REPLACEMENT_MCG_PER_KG = 1.6;

/** Devine IBW requires height ≥ 60 inches (5 ft / 152.4 cm). */
export const DEVINE_MIN_HEIGHT_INCHES = 60;

export const SOURCE_NOTE =
  'Educational context from SYNTHROID DailyMed (updated 2024-02-20, setid 1e11ad30-1041-4520-10b0-8f9d30d30fcc), FDA adult 1.6 mcg/kg teaching, Omni’s IBW/Devine notes, and Devine (1974) IBW equations. Not a prescription.';

export const DISCLAIMER =
  'Always confirm indication, labs (TSH/free-T4), cardiac status, pregnancy, interactions, and product labeling with a clinician. This calculator does not prescribe levothyroxine.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_POUND : value;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'in' ? value * CM_PER_INCH : value;
}

export function heightToInches(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value / CM_PER_INCH : value;
}

/**
 * Devine ideal body weight (kg). Eligible for adults with height ≥ 60 in.
 * Male: 50 + 2.3×(in−60); Female: 45.5 + 2.3×(in−60).
 */
export function devineIdealBodyWeightKg(
  sex: Sex,
  heightInches: number,
): number {
  if (!(heightInches >= DEVINE_MIN_HEIGHT_INCHES) || !Number.isFinite(heightInches)) {
    throw new Error(
      `Devine IBW requires height ≥ ${DEVINE_MIN_HEIGHT_INCHES} inches.`,
    );
  }
  const base = sex === 'male' ? 50 : 45.5;
  return base + 2.3 * (heightInches - DEVINE_MIN_HEIGHT_INCHES);
}

export function dosingWeightKg(actualKg: number, ibwKg: number): number {
  if (!(actualKg > 0) || !(ibwKg > 0)) {
    throw new Error('Actual and ideal weights must be positive.');
  }
  return Math.min(actualKg, ibwKg);
}

export function educationalFullReplacementMcg(weightKg: number): number {
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new Error('Weight must be a positive finite number.');
  }
  return Math.round(FDA_FULL_REPLACEMENT_MCG_PER_KG * weightKg);
}

function baseEducationalLines(): string[] {
  return [
    'FDA adult labeling: full replacement dose is about 1.6 mcg/kg/day for diagnosed hypothyroidism in adults; some patients need a lower start.',
    'Adults with underlying cardiac disease or older adults: start below full replacement and titrate more slowly using TSH or free-T4.',
    'Omni/pharmacy practice often doses on the lesser of actual weight and Devine ideal body weight when the person is above ideal weight.',
    'Peak therapeutic effect of a given dose may take 4–6 weeks. Doses >200 mcg/day are seldom required.',
    'TSH goals are individualized (primary vs central hypothyroidism differ). This tool does not invent a universal TSH target from these fields alone.',
  ];
}

function emptyExtras(): Pick<
  LevothyroxineDosageResult,
  'weightKg' | 'idealBodyWeightKg' | 'dosingWeightKg'
> {
  return { weightKg: null, idealBodyWeightKg: null, dosingWeightKg: null };
}

export function calculateLevothyroxineDosage(
  input: LevothyroxineDosageInput,
): LevothyroxineDosageResult {
  const educationalLines = baseEducationalLines();
  const weightRaw = parseNumber(input.weightText);
  const heightRaw = parseNumber(input.heightText);

  if (input.ft4 === 'normal') {
    return {
      outcome: 'insufficient_clinical_information',
      doseMcgPerDay: null,
      statusHeadline: 'Insufficient clinical information for a dose estimate',
      statusDetail:
        'A Normal FT4 selection is consistent with possible subclinical hypothyroidism teaching context, but FT4 alone does not establish diagnosis, TSH, antibodies, pregnancy plans, or whether treatment is indicated. No mcg/day estimate is published.',
      educationalLines,
      ...emptyExtras(),
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (weightRaw === null || heightRaw === null) {
    return {
      outcome: 'awaiting_inputs',
      doseMcgPerDay: null,
      statusHeadline: 'Enter weight and height to continue',
      statusDetail:
        'Weight and height are required for Devine ideal-body-weight comparison (Omni method) before any educational mcg/day teaching estimate can be shown.',
      educationalLines,
      ...emptyExtras(),
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(weightRaw > 0)) {
    return {
      outcome: 'insufficient_clinical_information',
      doseMcgPerDay: null,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Weight must be a positive number.',
      educationalLines,
      ...emptyExtras(),
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(heightRaw > 0)) {
    return {
      outcome: 'insufficient_clinical_information',
      doseMcgPerDay: null,
      statusHeadline: 'Invalid height',
      statusDetail: 'Height must be a positive number.',
      educationalLines,
      ...emptyExtras(),
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const actualKg = weightToKg(weightRaw, input.weightUnit);
  const heightIn = heightToInches(heightRaw, input.heightUnit);

  if (heightIn < DEVINE_MIN_HEIGHT_INCHES) {
    return {
      outcome: 'unsupported_population',
      doseMcgPerDay: null,
      statusHeadline: 'Height outside Devine IBW eligibility',
      statusDetail: `Devine ideal body weight equations used here apply at heights ≥ ${DEVINE_MIN_HEIGHT_INCHES} inches (152.4 cm). Shorter adults need clinician-guided dosing — no mcg/day estimate is invented.`,
      educationalLines,
      weightKg: actualKg,
      idealBodyWeightKg: null,
      dosingWeightKg: null,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  let ibwKg: number;
  try {
    ibwKg = devineIdealBodyWeightKg(input.sex, heightIn);
  } catch {
    return {
      outcome: 'unsupported_population',
      doseMcgPerDay: null,
      statusHeadline: 'Unable to compute ideal body weight',
      statusDetail: 'Height/sex combination is outside the supported Devine range.',
      educationalLines,
      weightKg: actualKg,
      idealBodyWeightKg: null,
      dosingWeightKg: null,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const doseWt = dosingWeightKg(actualKg, ibwKg);
  const teachingMcg = educationalFullReplacementMcg(doseWt);

  const cardiacOrOlder =
    input.heartDisease === 'yes' || input.ageBand === 'over_50';

  if (cardiacOrOlder) {
    return {
      outcome: 'clinician_review_required',
      doseMcgPerDay: null,
      statusHeadline: 'Clinician review required',
      statusDetail: `Age band Over 50 and/or reported heart disease place the person in FDA lower-start / slower-titration populations. Omni notes smaller dosages but does not publish a complete multiplier table for every input combination — so mcg/day remains unpublished. At ${doseWt.toFixed(1)} kg dosing weight (min of actual ${actualKg.toFixed(1)} kg and Devine IBW ${ibwKg.toFixed(1)} kg), the adult full-replacement teaching figure would be about ${teachingMcg} mcg/day — shown only as label arithmetic context, not as this tool’s dose.`,
      educationalLines,
      weightKg: actualKg,
      idealBodyWeightKg: ibwKg,
      dosingWeightKg: doseWt,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  // Approved educational teaching branch: 15–50, FT4 Low, no heart disease, Devine-eligible.
  return {
    outcome: 'approved_estimate_available',
    doseMcgPerDay: teachingMcg,
    statusHeadline: 'Educational teaching estimate (not a prescription)',
    statusDetail: `For the verified healthy-adult overt-hypothyroidism teaching branch (age 15–50, FT4 Low, no heart disease), FDA adult full-replacement language ≈ 1.6 mcg/kg/day applied to dosing weight ${doseWt.toFixed(1)} kg (lesser of actual ${actualKg.toFixed(1)} kg and Devine IBW ${ibwKg.toFixed(1)} kg) yields about ${teachingMcg} mcg/day. Confirm indication, labs, and product labeling with a clinician before any therapy.`,
    educationalLines,
    weightKg: actualKg,
    idealBodyWeightKg: ibwKg,
    dosingWeightKg: doseWt,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
