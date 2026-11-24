/**
 * GRACE 1.0 point score — Granger CB et al. Arch Intern Med. 2003;163:2345-2353.
 *
 * Discrete published bands for age, heart rate, systolic BP, creatinine (mg/dL),
 * Killip class, and three binary admission factors.
 *
 * Educational in-hospital mortality risk categories by total points:
 * low ≤108 (&lt;1%); intermediate 109–140 (1–3%); high &gt;140 (&gt;3%).
 */

import type {
  GraceBreakdown,
  GraceInput,
  GraceResult,
  GraceRiskCategory,
  KillipClass,
} from './types';
import { CREATININE_UMOL_PER_MG_DL } from './types';

export const SOURCE_LABEL =
  'Granger CB et al. Predictors of hospital mortality in the Global Registry of Acute Coronary Events. Arch Intern Med. 2003;163(19):2345-2353.';

export const DISCLAIMER =
  'Educational GRACE 1.0 point total with published in-hospital mortality risk categories only. Not a treatment, triage, or disposition order. Use GRACE 1.0 discrete points—not the GRACE 2.0 continuous mortality equation.';

export function parseNumericField(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function creatinineToMgDl(
  value: number,
  unit: GraceInput['creatinineUnit'],
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'mg/dL') return value;
  return value / CREATININE_UMOL_PER_MG_DL;
}

/**
 * Age (years): 0–29→0; 30–39→8; 40–49→25; 50–59→41; 60–69→58; 70–79→75;
 * 80–89→91; ≥90→100.
 */
export function agePoints(ageYears: number): number {
  if (!Number.isFinite(ageYears) || ageYears < 0) {
    throw new Error('Age must be a non-negative finite number.');
  }
  if (ageYears < 30) return 0;
  if (ageYears < 40) return 8;
  if (ageYears < 50) return 25;
  if (ageYears < 60) return 41;
  if (ageYears < 70) return 58;
  if (ageYears < 80) return 75;
  if (ageYears < 90) return 91;
  return 100;
}

/**
 * Heart rate (bpm): 0–49→0; 50–69→3; 70–89→9; 90–109→15; 110–149→24;
 * 150–199→38; ≥200→46.
 */
export function heartRatePoints(bpm: number): number {
  if (!Number.isFinite(bpm) || bpm < 0) {
    throw new Error('Heart rate must be a non-negative finite number.');
  }
  if (bpm < 50) return 0;
  if (bpm < 70) return 3;
  if (bpm < 90) return 9;
  if (bpm < 110) return 15;
  if (bpm < 150) return 24;
  if (bpm < 200) return 38;
  return 46;
}

/**
 * Systolic BP (mmHg): 0–79→58; 80–99→53; 100–119→43; 120–139→34;
 * 140–159→24; 160–199→10; ≥200→0.
 */
export function systolicBpPoints(mmHg: number): number {
  if (!Number.isFinite(mmHg) || mmHg < 0) {
    throw new Error('Systolic BP must be a non-negative finite number.');
  }
  if (mmHg < 80) return 58;
  if (mmHg < 100) return 53;
  if (mmHg < 120) return 43;
  if (mmHg < 140) return 34;
  if (mmHg < 160) return 24;
  if (mmHg < 200) return 10;
  return 0;
}

/**
 * Creatinine (mg/dL): &lt;0.40→1; &lt;0.80→4; &lt;1.20→7; &lt;1.60→10;
 * &lt;2.00→13; &lt;4.00→21; ≥4.00→28.
 */
export function creatininePointsMgDl(mgDl: number): number {
  if (!Number.isFinite(mgDl) || mgDl < 0) {
    throw new Error('Creatinine must be a non-negative finite number.');
  }
  if (mgDl < 0.4) return 1;
  if (mgDl < 0.8) return 4;
  if (mgDl < 1.2) return 7;
  if (mgDl < 1.6) return 10;
  if (mgDl < 2.0) return 13;
  if (mgDl < 4.0) return 21;
  return 28;
}

const KILLIP_POINTS: Record<KillipClass, number> = {
  I: 0,
  II: 20,
  III: 39,
  IV: 59,
};

export function killipPoints(killip: KillipClass): number {
  return KILLIP_POINTS[killip];
}

export function riskCategoryFromTotal(total: number): GraceRiskCategory {
  if (total <= 108) return 'low';
  if (total <= 140) return 'intermediate';
  return 'high';
}

export function riskCategoryLabel(cat: GraceRiskCategory): string {
  switch (cat) {
    case 'low':
      return 'Low risk';
    case 'intermediate':
      return 'Intermediate risk';
    case 'high':
      return 'High risk';
  }
}

export function riskMortalityRange(cat: GraceRiskCategory): string {
  switch (cat) {
    case 'low':
      return '<1% in-hospital mortality (published category)';
    case 'intermediate':
      return '1–3% in-hospital mortality (published category)';
    case 'high':
      return '>3% in-hospital mortality (published category)';
  }
}

export function buildBreakdown(
  age: number,
  hr: number,
  sbp: number,
  crMgDl: number,
  killip: KillipClass,
  cardiacArrest: boolean,
  stDeviation: boolean,
  elevatedEnzymes: boolean,
): GraceBreakdown {
  return {
    agePoints: agePoints(age),
    heartRatePoints: heartRatePoints(hr),
    systolicBpPoints: systolicBpPoints(sbp),
    creatininePoints: creatininePointsMgDl(crMgDl),
    killipPoints: killipPoints(killip),
    cardiacArrestPoints: cardiacArrest ? 39 : 0,
    stDeviationPoints: stDeviation ? 28 : 0,
    elevatedEnzymesPoints: elevatedEnzymes ? 14 : 0,
  };
}

export function sumBreakdown(b: GraceBreakdown): number {
  return (
    b.agePoints +
    b.heartRatePoints +
    b.systolicBpPoints +
    b.creatininePoints +
    b.killipPoints +
    b.cardiacArrestPoints +
    b.stDeviationPoints +
    b.elevatedEnzymesPoints
  );
}

export function calculateGraceScore(
  age: number,
  hr: number,
  sbp: number,
  crMgDl: number,
  killip: KillipClass,
  cardiacArrest: boolean,
  stDeviation: boolean,
  elevatedEnzymes: boolean,
): GraceResult {
  const breakdown = buildBreakdown(
    age,
    hr,
    sbp,
    crMgDl,
    killip,
    cardiacArrest,
    stDeviation,
    elevatedEnzymes,
  );
  const totalScore = sumBreakdown(breakdown);
  const riskCategory = riskCategoryFromTotal(totalScore);
  const categoryLabel = riskCategoryLabel(riskCategory);
  const mortalityRange = riskMortalityRange(riskCategory);

  return {
    totalScore,
    breakdown,
    formattedScore: String(totalScore),
    riskCategory,
    riskCategoryLabel: categoryLabel,
    riskMortalityRange: mortalityRange,
    explanation: `GRACE = age (${breakdown.agePoints}) + HR (${breakdown.heartRatePoints}) + SBP (${breakdown.systolicBpPoints}) + creatinine (${breakdown.creatininePoints}) + Killip (${breakdown.killipPoints}) + arrest (${breakdown.cardiacArrestPoints}) + ST deviation (${breakdown.stDeviationPoints}) + enzymes (${breakdown.elevatedEnzymesPoints}) = ${totalScore}. Category: ${categoryLabel} (${mortalityRange}).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}