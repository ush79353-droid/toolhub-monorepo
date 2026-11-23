/**
 * Framingham hard CHD (10-year) ATP III point score — educational total only.
 *
 * Myocardial infarction or coronary death; Framingham offspring / ATP III
 * Table B1 (men) and B2 (women). Ages 20–79 for this calculator gate.
 *
 * Source: Framingham Heart Study hard CHD 10-year risk point tables (ATP III,
 * JAMA 2001) as published at framinghamheartstudy.org.
 */

import type {
  FraminghamRiskBreakdown,
  FraminghamRiskInput,
  FraminghamRiskResult,
  Sex,
  CholesterolUnit,
} from './types';

export const MIN_AGE = 20;
export const MAX_AGE = 79;

/** mg/dL = mmol/L × 38.67 (task spec; ≈ conventional 1/0.02586). */
export const MMOL_L_TO_MG_DL = 38.67;

export const SOURCE_LABEL =
  'Framingham Heart Study ATP III hard CHD point tables (myocardial infarction or coronary death; JAMA 2001).';

export const DISCLAIMER =
  'Educational Framingham point total only. It is not a diagnosis, treatment plan, or substitute for clinical cardiovascular risk assessment.';

const MEN_AGE_POINTS: readonly { min: number; max: number; points: number }[] =
  [
    { min: 20, max: 34, points: -9 },
    { min: 35, max: 39, points: -4 },
    { min: 40, max: 44, points: 0 },
    { min: 45, max: 49, points: 3 },
    { min: 50, max: 54, points: 6 },
    { min: 55, max: 59, points: 8 },
    { min: 60, max: 64, points: 10 },
    { min: 65, max: 69, points: 11 },
    { min: 70, max: 74, points: 12 },
    { min: 75, max: 79, points: 13 },
  ];

const WOMEN_AGE_POINTS: readonly { min: number; max: number; points: number }[] =
  [
    { min: 20, max: 34, points: -7 },
    { min: 35, max: 39, points: -3 },
    { min: 40, max: 44, points: 0 },
    { min: 45, max: 49, points: 3 },
    { min: 50, max: 54, points: 6 },
    { min: 55, max: 59, points: 8 },
    { min: 60, max: 64, points: 10 },
    { min: 65, max: 69, points: 12 },
    { min: 70, max: 74, points: 14 },
    { min: 75, max: 79, points: 16 },
  ];

/** Five ATP III age columns for TC / smoking (20–39 … 70–79). */
export type TcSmokingAgeBand = '20-39' | '40-49' | '50-59' | '60-69' | '70-79';

const TC_BAND_EDGES = [160, 200, 240, 280] as const;

const MEN_TC_POINTS: Record<TcSmokingAgeBand, readonly number[]> = {
  '20-39': [0, 4, 7, 9, 11],
  '40-49': [0, 3, 5, 6, 8],
  '50-59': [0, 2, 3, 4, 5],
  '60-69': [0, 1, 1, 2, 3],
  '70-79': [0, 0, 0, 1, 1],
};

const WOMEN_TC_POINTS: Record<TcSmokingAgeBand, readonly number[]> = {
  '20-39': [0, 4, 8, 11, 13],
  '40-49': [0, 3, 6, 8, 10],
  '50-59': [0, 2, 4, 5, 7],
  '60-69': [0, 1, 2, 3, 4],
  '70-79': [0, 1, 1, 2, 2],
};

const MEN_SMOKING_POINTS: Record<TcSmokingAgeBand, number> = {
  '20-39': 8,
  '40-49': 5,
  '50-59': 3,
  '60-69': 1,
  '70-79': 1,
};

const WOMEN_SMOKING_POINTS: Record<TcSmokingAgeBand, number> = {
  '20-39': 9,
  '40-49': 7,
  '50-59': 4,
  '60-69': 2,
  '70-79': 1,
};

const MEN_SBP_UNTREATED = [0, 0, 1, 1, 2] as const;
const MEN_SBP_TREATED = [0, 1, 2, 2, 3] as const;
const WOMEN_SBP_UNTREATED = [0, 1, 2, 3, 4] as const;
const WOMEN_SBP_TREATED = [0, 3, 4, 5, 6] as const;

export function cholesterolToMgDl(
  value: number,
  unit: CholesterolUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'mg_dl') return value;
  return value * MMOL_L_TO_MG_DL;
}

export function mgDlToCholesterolUnit(
  mgDl: number,
  unit: CholesterolUnit
): number {
  if (unit === 'mg_dl') return mgDl;
  return mgDl / MMOL_L_TO_MG_DL;
}

export function scoreAgePoints(age: number, sex: Sex): number | null {
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) return null;
  const table = sex === 'male' ? MEN_AGE_POINTS : WOMEN_AGE_POINTS;
  const row = table.find((r) => age >= r.min && age <= r.max);
  return row ? row.points : null;
}

export function tcSmokingAgeBand(age: number): TcSmokingAgeBand | null {
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) return null;
  if (age <= 39) return '20-39';
  if (age <= 49) return '40-49';
  if (age <= 59) return '50-59';
  if (age <= 69) return '60-69';
  return '70-79';
}

export function totalCholesterolBandIndex(tcMgDl: number): number | null {
  if (!Number.isFinite(tcMgDl) || tcMgDl < 0) return null;
  if (tcMgDl < TC_BAND_EDGES[0]) return 0;
  if (tcMgDl < TC_BAND_EDGES[1]) return 1;
  if (tcMgDl < TC_BAND_EDGES[2]) return 2;
  if (tcMgDl < TC_BAND_EDGES[3]) return 3;
  return 4;
}

export function scoreTotalCholesterolPoints(
  age: number,
  tcMgDl: number,
  sex: Sex
): number | null {
  const band = tcSmokingAgeBand(age);
  const tcBand = totalCholesterolBandIndex(tcMgDl);
  if (band == null || tcBand == null) return null;
  const table = sex === 'male' ? MEN_TC_POINTS : WOMEN_TC_POINTS;
  return table[band][tcBand] ?? null;
}

export function scoreHdlPoints(hdlMgDl: number): number | null {
  if (!Number.isFinite(hdlMgDl) || hdlMgDl < 0) return null;
  if (hdlMgDl >= 60) return -1;
  if (hdlMgDl >= 50) return 0;
  if (hdlMgDl >= 40) return 1;
  return 2;
}

export function sbpBandIndex(sbp: number): number | null {
  if (!Number.isFinite(sbp) || sbp <= 0) return null;
  if (sbp < 120) return 0;
  if (sbp < 130) return 1;
  if (sbp < 140) return 2;
  if (sbp < 160) return 3;
  return 4;
}

export function scoreSbpPoints(
  sbp: number,
  sex: Sex,
  onTreatment: boolean
): number | null {
  const idx = sbpBandIndex(sbp);
  if (idx == null) return null;
  if (sex === 'male') {
    return onTreatment ? MEN_SBP_TREATED[idx] : MEN_SBP_UNTREATED[idx];
  }
  return onTreatment ? WOMEN_SBP_TREATED[idx] : WOMEN_SBP_UNTREATED[idx];
}

export function scoreSmokingPoints(
  age: number,
  sex: Sex,
  smoker: boolean
): number {
  if (!smoker) return 0;
  const band = tcSmokingAgeBand(age);
  if (band == null) return 0;
  return sex === 'male' ? MEN_SMOKING_POINTS[band] : WOMEN_SMOKING_POINTS[band];
}

/** ATP III point total → published 10-year hard CHD risk label (education only). */
export function tenYearHardChdRiskLabel(
  totalPoints: number,
  sex: Sex
): string {
  if (sex === 'male') {
    if (totalPoints < 0) return '< 1%';
    const men: Record<number, string> = {
      0: '1%',
      1: '1%',
      2: '1%',
      3: '1%',
      4: '1%',
      5: '2%',
      6: '2%',
      7: '3%',
      8: '4%',
      9: '5%',
      10: '6%',
      11: '8%',
      12: '10%',
      13: '12%',
      14: '16%',
      15: '20%',
      16: '25%',
    };
    if (totalPoints >= 17) return '≥ 30%';
    return men[totalPoints] ?? '—';
  }
  if (totalPoints < 9) return '< 1%';
  const women: Record<number, string> = {
    9: '1%',
    10: '1%',
    11: '1%',
    12: '1%',
    13: '2%',
    14: '2%',
    15: '3%',
    16: '4%',
    17: '5%',
    18: '6%',
    19: '8%',
    20: '11%',
    21: '14%',
    22: '17%',
    23: '22%',
    24: '27%',
  };
  if (totalPoints >= 25) return '≥ 30%';
  return women[totalPoints] ?? '—';
}

export function buildBreakdown(
  age: number,
  tcMgDl: number,
  hdlMgDl: number,
  sbp: number,
  sex: Sex,
  onTreatment: boolean,
  smoker: boolean
): FraminghamRiskBreakdown | null {
  const agePoints = scoreAgePoints(age, sex);
  const totalCholesterolPoints = scoreTotalCholesterolPoints(
    age,
    tcMgDl,
    sex
  );
  const hdlPoints = scoreHdlPoints(hdlMgDl);
  const sbpPoints = scoreSbpPoints(sbp, sex, onTreatment);
  if (
    agePoints == null ||
    totalCholesterolPoints == null ||
    hdlPoints == null ||
    sbpPoints == null
  ) {
    return null;
  }
  const smokingPoints = scoreSmokingPoints(age, sex, smoker);
  return {
    agePoints,
    totalCholesterolPoints,
    hdlPoints,
    sbpPoints,
    smokingPoints,
  };
}

export function sumBreakdown(b: FraminghamRiskBreakdown): number {
  return (
    b.agePoints +
    b.totalCholesterolPoints +
    b.hdlPoints +
    b.sbpPoints +
    b.smokingPoints
  );
}

export function calculateFraminghamRisk(
  input: FraminghamRiskInput,
  age: number,
  sbp: number,
  tcMgDl: number,
  hdlMgDl: number
): FraminghamRiskResult | null {
  const onTreatment = input.bpTreatment === 'yes';
  const smoker = input.smoker === 'yes';
  const breakdown = buildBreakdown(
    age,
    tcMgDl,
    hdlMgDl,
    sbp,
    input.sex,
    onTreatment,
    smoker
  );
  if (!breakdown) return null;
  const totalPoints = sumBreakdown(breakdown);
  const tenYearRiskLabel = tenYearHardChdRiskLabel(totalPoints, input.sex);
  const treatmentNote = onTreatment ? 'treated' : 'untreated';
  const smokingNote = smoker ? 'current smoker' : 'nonsmoker';

  return {
    totalPoints,
    breakdown,
    ageYears: age,
    sbpMmHg: sbp,
    totalCholesterolMgDl: tcMgDl,
    hdlCholesterolMgDl: hdlMgDl,
    formattedPoints: `${totalPoints} pts`,
    tenYearRiskLabel,
    explanation: `ATP III hard CHD point total = age (${breakdown.agePoints}) + total cholesterol (${breakdown.totalCholesterolPoints}) + HDL (${breakdown.hdlPoints}) + systolic BP ${treatmentNote} (${breakdown.sbpPoints}) + smoking (${breakdown.smokingPoints}) = ${totalPoints} pts. Published ATP III tables associate this total with an estimated 10-year hard CHD risk of about ${tenYearRiskLabel} for ${input.sex === 'male' ? 'men' : 'women'} (${smokingNote}).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}