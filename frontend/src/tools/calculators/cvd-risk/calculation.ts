/**
 * Framingham Heart Study general CVD 10-year risk (lipid primary model).
 *
 * D'Agostino RB et al. General cardiovascular risk profile for use in primary
 * care. Circulation. 2008;117:743–753. Coefficients and S0/means from the
 * Framingham Heart Study published function tables.
 *
 * risk = 1 − S0^exp(ΣβX − mean), with ln(age), ln(TC), ln(HDL), ln(SBP).
 * Population: ages 30–74 without baseline CVD. Educational estimate only.
 */

import type { CholUnit, CvdRiskInput, CvdRiskResult, Sex } from './types';

export const SOURCE_CITATION =
  "D'Agostino RB et al. Circulation. 2008;117:743–753 (Framingham general CVD, lipid model).";

/** mg/dL = mmol/L ÷ 0.02586 (conventional clinical conversion). */
export const MMOL_TO_MGDL = 1 / 0.02586;

export interface SexModel {
  s0: number;
  mean: number;
  betaAge: number;
  betaTc: number;
  betaHdl: number;
  betaSbpUntreated: number;
  betaSbpTreated: number;
  betaSmoke: number;
  betaDiabetes: number;
}

export const MEN_LIPID: SexModel = {
  s0: 0.88936,
  mean: 23.9802,
  betaAge: 3.06117,
  betaTc: 1.1237,
  betaHdl: -0.93263,
  betaSbpUntreated: 1.93303,
  betaSbpTreated: 1.99881,
  betaSmoke: 0.65451,
  betaDiabetes: 0.57367,
};

export const WOMEN_LIPID: SexModel = {
  s0: 0.95012,
  mean: 26.1931,
  betaAge: 2.32888,
  betaTc: 1.20904,
  betaHdl: -0.70833,
  betaSbpUntreated: 2.76157,
  betaSbpTreated: 2.82263,
  betaSmoke: 0.52873,
  betaDiabetes: 0.69154,
};

export function cholToMgDl(value: number, unit: CholUnit): number {
  if (unit === 'mmol_l') return value * MMOL_TO_MGDL;
  return value;
}

export function modelForSex(sex: Sex): SexModel {
  return sex === 'male' ? MEN_LIPID : WOMEN_LIPID;
}

export function computeFraminghamCvdRisk(params: {
  sex: Sex;
  ageYears: number;
  totalCholMgDl: number;
  hdlMgDl: number;
  sbpMmHg: number;
  treatedHypertension: boolean;
  smoker: boolean;
  diabetes: boolean;
}): number {
  const m = modelForSex(params.sex);
  const sum =
    m.betaAge * Math.log(params.ageYears) +
    m.betaTc * Math.log(params.totalCholMgDl) +
    m.betaHdl * Math.log(params.hdlMgDl) +
    (params.treatedHypertension
      ? m.betaSbpTreated
      : m.betaSbpUntreated) *
      Math.log(params.sbpMmHg) +
    (params.smoker ? m.betaSmoke : 0) +
    (params.diabetes ? m.betaDiabetes : 0);

  const risk = 1 - Math.pow(m.s0, Math.exp(sum - m.mean));
  return risk * 100;
}

export function formatRiskPercent(riskPercent: number): string {
  if (!Number.isFinite(riskPercent)) return '';
  if (riskPercent < 0.1) return riskPercent.toFixed(2);
  if (riskPercent < 10) return riskPercent.toFixed(1);
  return riskPercent.toFixed(1);
}

export function calculateCvdRisk(input: CvdRiskInput): CvdRiskResult | null {
  if (input.sex == null) return null;

  const age = Number(input.ageYears.trim().replace(/,/g, ''));
  const hdlRaw = Number(input.hdl.trim().replace(/,/g, ''));
  const tcRaw = Number(input.totalChol.trim().replace(/,/g, ''));
  const sbp = Number(input.sbpMmHg.trim().replace(/,/g, ''));

  if (
    ![age, hdlRaw, tcRaw, sbp].every((n) => Number.isFinite(n) && n > 0)
  ) {
    return null;
  }

  const hdl = cholToMgDl(hdlRaw, input.hdlUnit);
  const tc = cholToMgDl(tcRaw, input.totalCholUnit);
  if (!(hdl > 0) || !(tc > 0)) return null;

  const riskPercent = computeFraminghamCvdRisk({
    sex: input.sex,
    ageYears: age,
    totalCholMgDl: tc,
    hdlMgDl: hdl,
    sbpMmHg: sbp,
    treatedHypertension: input.treatedHypertension,
    smoker: input.smoker,
    diabetes: input.diabetes,
  });

  if (!Number.isFinite(riskPercent) || riskPercent < 0) return null;

  const m = modelForSex(input.sex);
  const linearPredictor =
    m.betaAge * Math.log(age) +
    m.betaTc * Math.log(tc) +
    m.betaHdl * Math.log(hdl) +
    (input.treatedHypertension ? m.betaSbpTreated : m.betaSbpUntreated) *
      Math.log(sbp) +
    (input.smoker ? m.betaSmoke : 0) +
    (input.diabetes ? m.betaDiabetes : 0);

  return {
    riskPercent,
    formattedRiskPercent: formatRiskPercent(riskPercent),
    linearPredictor,
    modelLabel: 'Framingham general CVD (lipid model, D’Agostino 2008)',
  };
}
