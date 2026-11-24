/**
 * Kidney Failure Risk — Tangri 2011 eight-variable categorical point score.
 *
 * Distinct from the continuous 8-variable KFRE (log ACR + lab coefficients).
 * ACR enters only as published categorical bands (&lt;30 / 30–300 / &gt;300 mg/g);
 * never a numeric midpoint substitute.
 *
 * Eligible population: adults with CKD stages G3–G5 (eGFR 15–59 mL/min/1.73 m²
 * derivation cohort; eGFR &lt;15 mapped in the published points table). Scores are
 * withheld for eGFR ≥60 (outside derivation).
 *
 * Primary output: total points. Optional educational 5-year probability lookup
 * from the same published points chart (not the continuous KFRE %).
 *
 * Source: Tangri N et al. JAMA. 2011;305(15):1553-1559 (points implementation).
 */

import type {
  AcrBand,
  AlbuminUnit,
  BicarbonateUnit,
  CalciumUnit,
  KidneyFailureRiskBreakdown,
  KidneyFailureRiskInput,
  KidneyFailureRiskResult,
  PhosphorusUnit,
  Sex,
} from './types';

/** Derivation cohort used eGFR about 10–59; we accept &lt;15 band down to 1. */
export const MIN_EGFR = 1;
export const MAX_EGFR_INCLUSIVE = 59;

export const MIN_AGE = 18;
export const MAX_AGE = 120;

/** Calcium mg/dL = mmol/L × 4.0 (conventional). */
export const CALCIUM_MMOL_TO_MG_DL = 4;

/** Phosphorus mg/dL = mmol/L × 3.097 (≈ atomic weight / 10). */
export const PHOSPHORUS_MMOL_TO_MG_DL = 3.097;

export const SOURCE_LABEL =
  'Tangri N et al. A predictive model for progression of chronic kidney disease to kidney failure. JAMA. 2011;305(15):1553-1559 (eight-variable categorical points).';

export const DISCLAIMER =
  'Educational Tangri 2011 point total only. It is not a diagnosis, dialysis plan, or substitute for clinical nephrology assessment. Continuous KFRE probabilities differ from this points chart.';

const FIVE_YEAR_PROBABILITY: ReadonlyMap<number, string> = new Map([
  [-41, '89.0%'],
  [-40, '86.9%'],
  [-39, '84.1%'],
  [-38, '81.0%'],
  [-37, '77.8%'],
  [-36, '74.4%'],
  [-35, '70.9%'],
  [-34, '67.3%'],
  [-33, '63.6%'],
  [-32, '59.9%'],
  [-31, '56.3%'],
  [-30, '52.8%'],
  [-29, '49.3%'],
  [-28, '45.9%'],
  [-27, '42.7%'],
  [-26, '39.6%'],
  [-25, '36.6%'],
  [-24, '33.8%'],
  [-23, '31.2%'],
  [-22, '28.7%'],
  [-21, '26.4%'],
  [-20, '24.2%'],
  [-19, '22.2%'],
  [-18, '20.3%'],
  [-17, '18.6%'],
  [-16, '17.0%'],
  [-15, '15.5%'],
  [-14, '14.1%'],
  [-13, '12.9%'],
  [-12, '11.7%'],
  [-11, '10.7%'],
  [-10, '9.7%'],
  [-9, '8.8%'],
  [-8, '8.0%'],
  [-7, '7.3%'],
  [-6, '6.6%'],
  [-5, '6.0%'],
  [-4, '5.5%'],
]);

export function albuminToGDl(
  value: number,
  unit: AlbuminUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'g_dl') return value;
  return value / 10;
}

export function gDlToAlbuminUnit(gDl: number, unit: AlbuminUnit): number {
  return unit === 'g_dl' ? gDl : gDl * 10;
}

export function bicarbonateToMeqL(
  value: number,
  unit: BicarbonateUnit
): number | null {
  if (!Number.isFinite(value)) return null;
  // mEq/L and mmol/L are numerically identical for bicarbonate.
  return value;
}

export function calciumToMgDl(
  value: number,
  unit: CalciumUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'mg_dl') return value;
  return value * CALCIUM_MMOL_TO_MG_DL;
}

export function mgDlToCalciumUnit(mgDl: number, unit: CalciumUnit): number {
  return unit === 'mg_dl' ? mgDl : mgDl / CALCIUM_MMOL_TO_MG_DL;
}

export function phosphorusToMgDl(
  value: number,
  unit: PhosphorusUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'mg_dl') return value;
  return value * PHOSPHORUS_MMOL_TO_MG_DL;
}

export function mgDlToPhosphorusUnit(
  mgDl: number,
  unit: PhosphorusUnit
): number {
  return unit === 'mg_dl' ? mgDl : mgDl / PHOSPHORUS_MMOL_TO_MG_DL;
}

export function agePoints(ageYears: number): number | null {
  if (!Number.isFinite(ageYears)) return null;
  if (ageYears < 30) return -4;
  if (ageYears < 40) return -2;
  if (ageYears < 50) return 0;
  if (ageYears < 60) return 2;
  if (ageYears < 70) return 4;
  if (ageYears < 80) return 6;
  if (ageYears < 90) return 8;
  return 10;
}

export function sexPoints(sex: Sex): number {
  return sex === 'male' ? -2 : 0;
}

export function acrPoints(band: AcrBand): number {
  switch (band) {
    case 'lt30':
      return 0;
    case '30to300':
      return -14;
    case 'gt300':
      return -22;
  }
}

export function egfrPoints(egfr: number): number | null {
  if (!Number.isFinite(egfr)) return null;
  if (egfr < 15) return -35;
  if (egfr < 20) return -30;
  if (egfr < 25) return -25;
  if (egfr < 30) return -20;
  if (egfr < 35) return -15;
  if (egfr < 40) return -10;
  if (egfr < 45) return -5;
  if (egfr < 50) return 0;
  if (egfr < 55) return 5;
  return 10; // 55–59 (derivation upper band)
}

export function albuminPoints(albuminGDl: number): number | null {
  if (!Number.isFinite(albuminGDl) || albuminGDl < 0) return null;
  if (albuminGDl <= 2.5) return -5;
  if (albuminGDl <= 3.0) return 0;
  if (albuminGDl <= 3.5) return 2;
  return 4; // ≥3.6
}

export function bicarbonatePoints(bicarbMeqL: number): number | null {
  if (!Number.isFinite(bicarbMeqL)) return null;
  if (bicarbMeqL < 18) return -7;
  if (bicarbMeqL <= 22) return -4;
  if (bicarbMeqL <= 25) return -1;
  return 0;
}

export function calciumPoints(calciumMgDl: number): number | null {
  if (!Number.isFinite(calciumMgDl) || calciumMgDl < 0) return null;
  if (calciumMgDl <= 8.5) return -3;
  if (calciumMgDl <= 9.5) return 0;
  return 2; // ≥9.6
}

export function phosphorusPoints(phosphorusMgDl: number): number | null {
  if (!Number.isFinite(phosphorusMgDl) || phosphorusMgDl < 0) return null;
  if (phosphorusMgDl < 3.5) return 3;
  if (phosphorusMgDl <= 4.5) return 0;
  if (phosphorusMgDl <= 5.5) return -3;
  return -5;
}

export function fiveYearProbabilityLabel(totalPoints: number): string {
  if (totalPoints < -41) return '>90.0%';
  if (totalPoints >= -3) return '<5.0%';
  return FIVE_YEAR_PROBABILITY.get(totalPoints) ?? '—';
}

export function calculateKidneyFailureRisk(
  input: KidneyFailureRiskInput,
  ageYears: number,
  egfr: number,
  albuminGDl: number,
  bicarbMeqL: number,
  calciumMgDl: number,
  phosphorusMgDl: number
): KidneyFailureRiskResult | null {
  if (ageYears < MIN_AGE || ageYears > MAX_AGE) return null;
  if (egfr < MIN_EGFR || egfr > MAX_EGFR_INCLUSIVE) return null;

  const a = agePoints(ageYears);
  const e = egfrPoints(egfr);
  const alb = albuminPoints(albuminGDl);
  const bic = bicarbonatePoints(bicarbMeqL);
  const ca = calciumPoints(calciumMgDl);
  const phos = phosphorusPoints(phosphorusMgDl);
  if (a == null || e == null || alb == null || bic == null || ca == null || phos == null) {
    return null;
  }

  const breakdown: KidneyFailureRiskBreakdown = {
    agePoints: a,
    sexPoints: sexPoints(input.sex),
    acrPoints: acrPoints(input.acrBand),
    egfrPoints: e,
    albuminPoints: alb,
    bicarbonatePoints: bic,
    calciumPoints: ca,
    phosphorusPoints: phos,
  };

  const totalPoints =
    breakdown.agePoints +
    breakdown.sexPoints +
    breakdown.acrPoints +
    breakdown.egfrPoints +
    breakdown.albuminPoints +
    breakdown.bicarbonatePoints +
    breakdown.calciumPoints +
    breakdown.phosphorusPoints;

  const fiveYear = fiveYearProbabilityLabel(totalPoints);

  return {
    totalPoints,
    breakdown,
    fiveYearProbabilityLabel: fiveYear,
    formattedPoints: String(totalPoints),
    explanation: `Tangri 2011 categorical points total ${totalPoints} pts. Published chart 5-year kidney-failure probability ≈ ${fiveYear} (educational lookup — not continuous KFRE). More negative totals mean higher charted risk.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

/** Self-check: Tangri Table 4 patient A labs + demographics → −27 pts. */
export function assertKidneyFailureRiskFixtures(): void {
  const input: KidneyFailureRiskInput = {
    sex: 'male',
    ageYears: '70',
    acrBand: '30to300',
    egfr: '30',
    albuminValue: '3.5',
    albuminUnit: 'g_dl',
    bicarbonateValue: '21',
    bicarbonateUnit: 'meq_l',
    calciumValue: '9.0',
    calciumUnit: 'mg_dl',
    phosphorusValue: '4.5',
    phosphorusUnit: 'mg_dl',
  };
  const result = calculateKidneyFailureRisk(
    input,
    70,
    30,
    3.5,
    21,
    9.0,
    4.5
  );
  if (!result || result.totalPoints !== -27) {
    throw new Error(
      `kidney-failure-risk fixture A expected -27, got ${result?.totalPoints}`
    );
  }
  if (result.fiveYearProbabilityLabel !== '42.7%') {
    throw new Error(
      `kidney-failure-risk fixture A expected 42.7%, got ${result.fiveYearProbabilityLabel}`
    );
  }

  const b = calculateKidneyFailureRisk(
    {
      ...input,
      ageYears: '50',
      acrBand: '30to300',
      albuminValue: '4.0',
      bicarbonateValue: '26',
      calciumValue: '9.8',
      phosphorusValue: '3.8',
    },
    50,
    30,
    4.0,
    26,
    9.8,
    3.8
  );
  if (!b || b.totalPoints !== -23) {
    throw new Error(
      `kidney-failure-risk fixture B expected -23, got ${b?.totalPoints}`
    );
  }

  if (acrPoints('lt30') !== 0 || acrPoints('gt300') !== -22) {
    throw new Error('kidney-failure-risk ACR band points mismatch');
  }
  if (calculateKidneyFailureRisk(input, 70, 60, 3.5, 21, 9, 4.5) != null) {
    throw new Error('kidney-failure-risk must withhold eGFR ≥60');
  }
}
