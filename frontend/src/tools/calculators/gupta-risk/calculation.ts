/**
 * Gupta perioperative MICA model — myocardial infarction or cardiac arrest within 30 days.
 * Gupta PK et al. Circulation 2011;124:381–387, Table 2 (hernia reference).
 */

import type {
  AsaClass,
  CreatinineUnit,
  FunctionalStatus,
  GuptaProcedure,
  GuptaRiskInput,
  GuptaRiskResult,
} from './types';
import { CREATININE_UMOL_PER_MG_DL } from './types';

export const SOURCE_LABEL =
  'Gupta PK et al. Development and validation of a risk calculator for prediction of cardiac risk after surgery. Circulation. 2011;124:381–387 (Table 2, MICA model).';

export const DISCLAIMER =
  'Educational estimate from the published NSQIP MICA logistic model. It does not replace institutional risk tools, clinician judgement, or informed consent.';

const INTERCEPT = -5.25;
const AGE_COEF = 0.02;

export const FUNCTIONAL_COEF: Record<FunctionalStatus, number> = {
  independent: 0,
  partiallyDependent: 0.65,
  totallyDependent: 1.03,
};

/** ASA class coefficients (reference ASA V = 0). */
export const ASA_COEF: Record<AsaClass, number> = {
  I: -5.17,
  II: -3.29,
  III: -1.92,
  IV: -0.95,
  V: 0,
};

export const CREATININE_NOT_MEASURED_COEF = -0.1;
export const CREATININE_HIGH_COEF = 0.61;
export const CREATININE_HIGH_THRESHOLD_MG_DL = 1.5;

/** Procedure coefficients (reference: hernia = 0). */
export const PROCEDURE_COEF: Record<GuptaProcedure, number> = {
  anorectal: -0.16,
  aortic: 1.6,
  bariatric: -0.25,
  brain: 1.4,
  breast: -1.61,
  cardiac: 1.01,
  ent: 0.71,
  foregutHpb: 1.39,
  gallbladderAppendixAdrenalSpleen: 0.59,
  intestinal: 1.14,
  neck: 0.18,
  obGyn: 0.76,
  orthopedic: 0.8,
  otherAbdomen: 1.13,
  peripheralVascular: 0.86,
  skin: 0.54,
  spinal: 0.21,
  thoracic: 0.4,
  urology: -0.26,
  vein: -1.09,
  hernia: 0,
};

export function creatinineToMgDl(value: number, unit: CreatinineUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'mgDl':
      return value;
    case 'umolL':
      return value / CREATININE_UMOL_PER_MG_DL;
    default:
      return null;
  }
}

export function mgDlToCreatinineUnit(mgDl: number, unit: CreatinineUnit): number {
  return unit === 'umolL' ? mgDl * CREATININE_UMOL_PER_MG_DL : mgDl;
}

export function creatinineCategoryCoef(
  notMeasured: boolean,
  creatinineMgDl: number | null
): number | null {
  if (notMeasured) return CREATININE_NOT_MEASURED_COEF;
  if (creatinineMgDl == null) return null;
  if (creatinineMgDl <= 0) return null;
  if (creatinineMgDl <= CREATININE_HIGH_THRESHOLD_MG_DL) return 0;
  return CREATININE_HIGH_COEF;
}

export function logOddsFromParts(
  ageYears: number,
  functional: FunctionalStatus,
  asa: AsaClass,
  creatinineK: number,
  procedure: GuptaProcedure
): number {
  return (
    INTERCEPT +
    AGE_COEF * ageYears +
    FUNCTIONAL_COEF[functional] +
    ASA_COEF[asa] +
    creatinineK +
    PROCEDURE_COEF[procedure]
  );
}

/** risk% = 100 / (1 + exp(−L)) */
export function logOddsToRiskPercent(logOdds: number): number {
  if (!Number.isFinite(logOdds)) return NaN;
  return 100 / (1 + Math.exp(-logOdds));
}

export function formatMicaPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  const rounded = Math.round(percent * 100) / 100;
  return `${rounded}%`;
}

export function calculateGuptaRisk(
  input: GuptaRiskInput,
  ageYears: number,
  creatinineMgDl: number | null,
  creatinineK: number
): GuptaRiskResult {
  const logOdds = logOddsFromParts(
    ageYears,
    input.functionalStatus,
    input.asaClass,
    creatinineK,
    input.procedure
  );
  const micaRiskPercent = logOddsToRiskPercent(logOdds);
  const creatinineNote = input.creatinineNotMeasured
    ? 'creatinine not measured (−0.10)'
    : creatinineMgDl != null && creatinineMgDl > CREATININE_HIGH_THRESHOLD_MG_DL
      ? `creatinine >1.5 mg/dL (+0.61; ${creatinineMgDl.toFixed(2)} mg/dL after conversion)`
      : `creatinine ≤1.5 mg/dL (0; ${creatinineMgDl!.toFixed(2)} mg/dL)`;

  return {
    logOdds,
    micaRiskPercent,
    formattedMicaPercent: formatMicaPercent(micaRiskPercent),
    explanation: `MICA ≈ 100/(1+e^−L) with L = −5.25 + 0.02×age (${ageYears}) + functional (${FUNCTIONAL_COEF[input.functionalStatus]}) + ASA ${input.asaClass} (${ASA_COEF[input.asaClass]}) + ${creatinineNote} + procedure (${PROCEDURE_COEF[input.procedure]}).`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}