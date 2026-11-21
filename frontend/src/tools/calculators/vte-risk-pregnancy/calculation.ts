/**
 * VTE Risk Score in Pregnancy — RCOG Green-top Guideline No. 37a (April 2015;
 * appendix III risk-assessment table as reproduced by NICE NG89 resource).
 *
 * Educational total only. Does not issue prophylaxis orders.
 */

import type {
  ObstetricFactorId,
  PatientSituation,
  PreExistingFactorId,
  ScoredFactor,
  TransientFactorId,
  VteRiskPregnancyInput,
  VteRiskPregnancyResult,
} from './types';

export const GUIDELINE_LABEL =
  'RCOG Green-top Guideline No. 37a — Reducing the Risk of Venous Thromboembolism during Pregnancy and the Puerperium';
export const GUIDELINE_VERSION = 'April 2015 (Appendix III scoring table)';

export const DISCLAIMER =
  'Educational risk-factor score only. It does not diagnose VTE, prescribe LMWH, or replace clinical judgement. Discuss results with a qualified clinician.';

/** Pre-existing factor base points (obesity derived separately from BMI). */
export const PRE_EXISTING_POINTS: Record<PreExistingFactorId, number> = {
  ageOver35: 1,
  previousVte: 4,
  previousVteMajorSurgery: 3,
  highRiskThrombophilia: 3,
  medicalComorbidities: 3,
  familyHistoryVte: 1,
  lowRiskThrombophilia: 1,
  parityGe3: 1,
  smoker: 1,
  grossVaricoseVeins: 1,
};

export const PRE_EXISTING_LABELS: Record<PreExistingFactorId, string> = {
  ageOver35: 'Patient is over 35 years old',
  previousVte: 'Previously had venous thromboembolism (VTE)',
  previousVteMajorSurgery:
    'Previously had VTE provoked by a major surgery',
  highRiskThrombophilia:
    'Has known high-risk thrombophilia due to antithrombin or protein C or S deficiency, compound or homozygous for low-risk thrombophilia',
  medicalComorbidities:
    'Has other medical comorbidities (e.g., cancer, heart failure, active systemic lupus erythematosus, etc.)',
  familyHistoryVte:
    'Has a family history of unprovoked or estrogen-related VTE in a first-degree relative',
  lowRiskThrombophilia:
    'Has known low-risk thrombophilia - no VTE: heterozygous for factor V Leiden or prothrombin G20210A mutations',
  parityGe3: 'Patient has already given birth three times or more',
  smoker: 'Patient is a smoker',
  grossVaricoseVeins: 'Patient has gross varicose veins',
};

export const OBSTETRIC_POINTS: Record<ObstetricFactorId, number> = {
  preeclampsia: 1,
  artIvf: 1,
  multiplePregnancy: 1,
};

export const OBSTETRIC_LABELS: Record<ObstetricFactorId, string> = {
  preeclampsia: 'Patient has pre-eclampsia in the current pregnancy',
  artIvf:
    'Assisted reproductive technology (ART) or in vitro fertilization (IVF) was used to achieve pregnancy',
  multiplePregnancy:
    'Patient has multiple pregnancies or twins, triplets, etc.',
};

export const TRANSIENT_POINTS: Record<TransientFactorId, number> = {
  surgicalProcedure: 3,
  hyperemesis: 3,
  ohss: 4,
  systemicInfection: 1,
  immobilityDehydration: 1,
};

export const TRANSIENT_LABELS: Record<TransientFactorId, string> = {
  surgicalProcedure:
    'Patient has undergone any surgical procedure in pregnancy or puerperium',
  hyperemesis: 'Experiences hyperemesis',
  ohss:
    'Patient is in the first trimester and has been diagnosed with ovarian hyperstimulation syndrome (OHSS)',
  systemicInfection: 'Currently has a systemic infection',
  immobilityDehydration: 'Patient experiences immobility and dehydration',
};

export function heightToMeters(
  value: number,
  unit: VteRiskPregnancyInput['heightUnit']
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * 0.0254;
    case 'ft':
      return value * 0.3048;
    default:
      return null;
  }
}

export function weightToKg(
  value: number,
  unit: VteRiskPregnancyInput['weightUnit']
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * 0.45359237;
    case 'st':
      return value * 6.35029318;
    default:
      return null;
  }
}

export function convertHeightValue(
  value: number,
  from: VteRiskPregnancyInput['heightUnit'],
  to: VteRiskPregnancyInput['heightUnit']
): number | null {
  const m = heightToMeters(value, from);
  if (m == null) return null;
  switch (to) {
    case 'm':
      return m;
    case 'cm':
      return m * 100;
    case 'in':
      return m / 0.0254;
    case 'ft':
      return m / 0.3048;
    default:
      return null;
  }
}

export function convertWeightValue(
  value: number,
  from: VteRiskPregnancyInput['weightUnit'],
  to: VteRiskPregnancyInput['weightUnit']
): number | null {
  const kg = weightToKg(value, from);
  if (kg == null) return null;
  switch (to) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / 0.45359237;
    case 'st':
      return kg / 6.35029318;
    default:
      return null;
  }
}

export function calculateBmi(
  heightMeters: number,
  weightKg: number
): number | null {
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;
  const bmi = weightKg / (heightMeters * heightMeters);
  return Number.isFinite(bmi) ? bmi : null;
}

/** RCOG obesity: BMI ≥40 → 2; BMI ≥30 → 1. */
export function obesityPointsFromBmi(bmi: number | null): number {
  if (bmi == null || !Number.isFinite(bmi)) return 0;
  if (bmi >= 40) return 2;
  if (bmi >= 30) return 1;
  return 0;
}

export function formatBmi(bmi: number): string {
  return bmi.toFixed(1);
}

export function bandSummaryFor(
  situation: PatientSituation,
  totalScore: number
): string {
  if (situation === 'pregnant') {
    if (totalScore >= 4) {
      return 'Antenatal score ≥4 (RCOG appendix threshold for clinician consideration from the first trimester). Not a prescription.';
    }
    if (totalScore === 3) {
      return 'Antenatal score 3 (RCOG appendix threshold for clinician consideration from 28 weeks). Not a prescription.';
    }
    return 'Antenatal score below the RCOG appendix numerical thresholds listed for routine consideration bands. Clinical context still required.';
  }
  if (totalScore >= 2) {
    return 'Postnatal score ≥2 (RCOG appendix threshold for clinician consideration for at least 10 days). Not a prescription.';
  }
  return 'Postnatal score below the RCOG appendix numerical threshold (≥2) listed for routine consideration. Clinical context still required.';
}

export function calculateVteRiskScore(
  input: VteRiskPregnancyInput,
  bmi: number | null
): VteRiskPregnancyResult {
  const scored: ScoredFactor[] = [];
  const excludedNotes: string[] = [];
  const situation = input.situation;

  // Mutually exclusive prior VTE categories: prefer non-surgery previous VTE (4).
  let previousVte = input.preExisting.previousVte;
  let previousVteSurgery = input.preExisting.previousVteMajorSurgery;
  if (previousVte && previousVteSurgery) {
    previousVteSurgery = false;
    excludedNotes.push(
      'Previous VTE and surgery-provoked VTE are mutually exclusive; scored previous VTE (4 points) only.'
    );
  }

  const preFlags: Record<PreExistingFactorId, boolean> = {
    ...input.preExisting,
    previousVte,
    previousVteMajorSurgery: previousVteSurgery,
  };

  for (const id of Object.keys(PRE_EXISTING_POINTS) as PreExistingFactorId[]) {
    if (!preFlags[id]) continue;
    scored.push({
      id,
      label: PRE_EXISTING_LABELS[id],
      points: PRE_EXISTING_POINTS[id],
      group: 'preExisting',
    });
  }

  const obesityPoints = obesityPointsFromBmi(bmi);
  if (obesityPoints > 0) {
    scored.push({
      id: 'obesity',
      label:
        obesityPoints === 2
          ? 'Obesity (BMI ≥ 40 kg/m²)'
          : 'Obesity (BMI ≥ 30 kg/m²)',
      points: obesityPoints,
      group: 'obesity',
    });
  }

  for (const id of Object.keys(OBSTETRIC_POINTS) as ObstetricFactorId[]) {
    if (!input.obstetric[id]) continue;
    if (id === 'artIvf' && situation === 'postpartum') {
      excludedNotes.push(
        'ART/IVF scores antenatally only (RCOG); excluded for postpartum situation.'
      );
      continue;
    }
    scored.push({
      id,
      label: OBSTETRIC_LABELS[id],
      points: OBSTETRIC_POINTS[id],
      group: 'obstetric',
    });
  }

  for (const id of Object.keys(TRANSIENT_POINTS) as TransientFactorId[]) {
    if (!input.transient[id]) continue;
    if (id === 'ohss' && situation === 'postpartum') {
      excludedNotes.push(
        'OHSS scores in the first trimester only (RCOG); excluded for postpartum situation.'
      );
      continue;
    }
    scored.push({
      id,
      label: TRANSIENT_LABELS[id],
      points: TRANSIENT_POINTS[id],
      group: 'transient',
    });
  }

  const totalScore = scored.reduce((sum, f) => sum + f.points, 0);

  return {
    situation,
    bmi,
    formattedBmi: bmi == null ? null : formatBmi(bmi),
    obesityPoints,
    totalScore,
    scoredFactors: scored,
    excludedNotes,
    guidelineLabel: GUIDELINE_LABEL,
    guidelineVersion: GUIDELINE_VERSION,
    bandSummary: bandSummaryFor(situation, totalScore),
    disclaimer: DISCLAIMER,
  };
}
