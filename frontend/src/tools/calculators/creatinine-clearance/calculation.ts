/**
 * Creatinine clearance — educational (ADR-018).
 *
 * Estimated CrCl — Cockcroft–Gault (1976), with Omni/Winter–Brown weight basis:
 *   CrCl (mL/min) = (140 − age) × weightKg × sexFactor / (72 × SCr_mg_dL)
 *   sexFactor = 0.85 female, 1 male
 *
 * Weight basis from BMI (Omni Creatinine Clearance / Winter et al.):
 *   BMI < 18.5  → actual body weight (TBW)
 *   18.5 ≤ BMI < 25 → ideal body weight (Devine)
 *   BMI ≥ 25 → adjusted body weight = IBW + 0.4 × (TBW − IBW)
 *
 * Devine IBW (kg), Omni cm form:
 *   male:   50 + 0.9 × (height_cm − 152)
 *   female: 45.5 + 0.9 × (height_cm − 152)
 *
 * Direct timed CrCl:
 *   dCrCl = UCr × volume_mL / (SCr × collection_minutes)
 * Fixture: UCr 100 mg/dL, SCr 1 mg/dL, 1440 mL over 24 h → 100 mL/min.
 *
 * Sources: Cockcroft DW, Gault MH. Nephron. 1976;16:31–41.
 * Omni Calculator CrCl (weight adjustment summary). Educational only.
 */

import type {
  CollectionTimeUnit,
  CreatinineClearanceInput,
  CreatinineClearanceResult,
  HeightUnit,
  SerumCreatinineUnit,
  Sex,
  UrineCreatinineUnit,
  WeightBasis,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Cockcroft–Gault CrCl = (140−age)×wt×sex/(72×SCr); female sex=0.85. Weight by BMI: <18.5 TBW; 18.5–<25 IBW (Devine); ≥25 ABW=IBW+0.4×(TBW−IBW). Direct: UCr×V/(SCr×minutes). Educational only.';

export const DISCLAIMER =
  'Educational kidney-function worksheet — not a diagnosis, drug-dosing order, or laboratory report. Confirm with clinical context and local dosing guidance.';

/** µmol/L → mg/dL (conventional factor used in clinical calculators). */
export const UMOL_L_PER_MG_DL = 88.4;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * 0.45359237 : value;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  if (unit === 'm') return value * 100;
  if (unit === 'in') return value * 2.54;
  return value;
}

export function creatinineToMgDl(
  value: number,
  unit: SerumCreatinineUnit | UrineCreatinineUnit,
): number {
  return unit === 'umol_l' ? value / UMOL_L_PER_MG_DL : value;
}

export function collectionToMinutes(
  value: number,
  unit: CollectionTimeUnit,
): number {
  return unit === 'hours' ? value * 60 : value;
}

/** Devine ideal body weight (kg) using Omni cm coefficients. */
export function idealBodyWeightKg(heightCm: number, sex: Sex): number {
  const base = sex === 'female' ? 45.5 : 50;
  return base + 0.9 * (heightCm - 152);
}

export function bodyMassIndex(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function adjustedBodyWeightKg(tbwKg: number, ibwKg: number): number {
  return ibwKg + 0.4 * (tbwKg - ibwKg);
}

/**
 * Select dosing weight for Cockcroft–Gault per Omni BMI bands.
 */
export function selectCockcroftWeightKg(
  tbwKg: number,
  heightCm: number,
  sex: Sex,
): { weightKg: number; basis: WeightBasis; bmi: number; ibwKg: number } {
  const ibwKg = idealBodyWeightKg(heightCm, sex);
  const bmi = bodyMassIndex(tbwKg, heightCm);
  if (bmi < 18.5) {
    return { weightKg: tbwKg, basis: 'actual', bmi, ibwKg };
  }
  if (bmi < 25) {
    return { weightKg: ibwKg, basis: 'ideal', bmi, ibwKg };
  }
  return {
    weightKg: adjustedBodyWeightKg(tbwKg, ibwKg),
    basis: 'adjusted',
    bmi,
    ibwKg,
  };
}

/**
 * Cockcroft–Gault estimated CrCl (mL/min).
 * @throws when SCr ≤ 0 or non-finite inputs.
 */
export function cockcroftGaultCrClMlMin(
  ageYears: number,
  weightKg: number,
  sex: Sex,
  serumCreatinineMgDl: number,
): number {
  if (!(serumCreatinineMgDl > 0)) {
    throw new Error('Serum creatinine must be greater than zero.');
  }
  if (!Number.isFinite(ageYears) || !Number.isFinite(weightKg)) {
    throw new Error('Age and weight must be finite.');
  }
  const sexFactor = sex === 'female' ? 0.85 : 1;
  return ((140 - ageYears) * weightKg * sexFactor) / (72 * serumCreatinineMgDl);
}

/**
 * Timed urine creatinine clearance (mL/min).
 */
export function directCrClMlMin(
  urineCreatinineMgDl: number,
  urineVolumeMl: number,
  serumCreatinineMgDl: number,
  collectionMinutes: number,
): number {
  if (!(serumCreatinineMgDl > 0)) {
    throw new Error('Serum creatinine must be greater than zero.');
  }
  if (!(collectionMinutes > 0)) {
    throw new Error('Collection duration must be greater than zero.');
  }
  return (
    (urineCreatinineMgDl * urineVolumeMl) /
    (serumCreatinineMgDl * collectionMinutes)
  );
}

export function formatCrCl(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.0$/, '');
}

function basisLabel(basis: WeightBasis): string {
  switch (basis) {
    case 'actual':
      return 'actual body weight (BMI < 18.5)';
    case 'ideal':
      return 'ideal body weight (BMI 18.5–<25)';
    case 'adjusted':
      return 'adjusted body weight (BMI ≥ 25)';
  }
}

export function calculateCreatinineClearance(
  input: CreatinineClearanceInput,
): CreatinineClearanceResult {
  const age = parseNumber(input.ageYearsText);
  const weightRaw = parseNumber(input.weightText);
  const heightRaw = parseNumber(input.heightText);
  const scrRaw = parseNumber(input.serumCreatinineText);

  let estimatedCrClMlMin: number | null = null;
  let formattedEstimatedCrCl = '';
  let weightUsedKg: number | null = null;
  let weightBasis: WeightBasis | null = null;
  let bmi: number | null = null;
  let ibwKg: number | null = null;
  let estimateHeadline = 'Enter age, weight, height, and serum creatinine';
  let estimateDetail =
    'Estimated creatinine clearance uses Cockcroft–Gault with BMI-based weight selection. Blank until all estimate fields are entered.';

  if (
    age !== null &&
    weightRaw !== null &&
    heightRaw !== null &&
    scrRaw !== null
  ) {
    const weightKg = weightToKg(weightRaw, input.weightUnit);
    const heightCm = heightToCm(heightRaw, input.heightUnit);
    const scrMgDl = creatinineToMgDl(scrRaw, input.serumCreatinineUnit);
    const selected = selectCockcroftWeightKg(weightKg, heightCm, input.sex);
    weightUsedKg = selected.weightKg;
    weightBasis = selected.basis;
    bmi = selected.bmi;
    ibwKg = selected.ibwKg;
    estimatedCrClMlMin = cockcroftGaultCrClMlMin(
      age,
      selected.weightKg,
      input.sex,
      scrMgDl,
    );
    formattedEstimatedCrCl = formatCrCl(estimatedCrClMlMin);
    estimateHeadline = 'Estimated creatinine clearance';
    estimateDetail = `Cockcroft–Gault estimate ${formattedEstimatedCrCl} mL/min using ${basisLabel(selected.basis)} (${formatCrCl(selected.weightKg)} kg). Educational only — not a dosing order.`;
  }

  const uCrRaw = parseNumber(input.urineCreatinineText);
  const volRaw = parseNumber(input.urineVolumeMlText);
  const dScrRaw = parseNumber(input.directSerumCreatinineText);
  const timeRaw = parseNumber(input.collectionTimeText);

  let directCrClMlMinValue: number | null = null;
  let formattedDirectCrCl = '';
  let directHeadline = 'Enter timed urine values';
  let directDetail =
    'Direct creatinine clearance needs urine creatinine, urine volume (mL), serum creatinine, and collection duration. Independent of the estimate above.';

  if (
    uCrRaw !== null &&
    volRaw !== null &&
    dScrRaw !== null &&
    timeRaw !== null
  ) {
    const uCr = creatinineToMgDl(uCrRaw, input.urineCreatinineUnit);
    const dScr = creatinineToMgDl(dScrRaw, input.directSerumCreatinineUnit);
    const minutes = collectionToMinutes(timeRaw, input.collectionTimeUnit);
    directCrClMlMinValue = directCrClMlMin(uCr, volRaw, dScr, minutes);
    formattedDirectCrCl = formatCrCl(directCrClMlMinValue);
    directHeadline = 'Direct creatinine clearance';
    directDetail = `Timed urine measurement ${formattedDirectCrCl} mL/min (UCr×volume)/(SCr×minutes). Educational only.`;
  }

  return {
    estimatedCrClMlMin,
    formattedEstimatedCrCl,
    weightUsedKg,
    weightBasis,
    bmi,
    ibwKg,
    estimateHeadline,
    estimateDetail,
    directCrClMlMin: directCrClMlMinValue,
    formattedDirectCrCl,
    directHeadline,
    directDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
