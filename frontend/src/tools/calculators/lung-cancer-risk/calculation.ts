/**
 * HUNT Lung Cancer Model — Markaki et al. EBioMedicine 2018; corrigendum 2022.
 *
 * 16-year Cox absolute risk: Risk = 1 − S0^exp(Xβ) with S0 ≈ 0.06
 * 6-year logistic: Risk = 1 / (1 + exp(−Xβ6)) with published intercept + coefficients
 * Logs are natural; pack-years, quit-years, BMI, smoke-hours use ln(x+1).
 * Age enters as (age/100)^(-1) = 100/age.
 * Pack-years = (cigarettes/day / 20) × smoking years.
 */

import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  HeightUnit,
  LungCancerRiskInput,
  LungCancerRiskResult,
  WeightUnit,
} from './types';

export { DISCLAIMER, SOURCE_LABEL };

/** Baseline survival S0(t≈16 y) used in corrigendum absolute-risk formula. */
export const S0_16 = 0.06;

// —— 16-year Cox coefficients (corrigendum, non-rounded) ——
export const C16 = {
  male: 0.12058192,
  ageInv: -2.00205575,
  lnPackYears: 1.16301808,
  cigPerDay: -0.02954059,
  lnQuitYears: -0.24079981,
  lnBmi: -1.24626558,
  lnSmokeHours: 0.16632008,
  cough: 0.4059355,
} as const;

// —— 6-year logistic coefficients (corrigendum) ——
export const C6 = {
  intercept: 1.18203062,
  male: 0.31573217,
  ageInv: -1.98496138,
  lnPackYears: 1.11994217,
  cigPerDay: -0.04002877,
  lnQuitYears: -0.24019955,
  lnBmi: -1.70238304,
  lnSmokeHours: 0.0807242,
  cough: 0.49212668,
} as const;

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * 0.45359237;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value / 100 : value * 0.0254;
}

export function computeBmiKgM2(weightKg: number, heightM: number): number {
  return weightKg / (heightM * heightM);
}

export function packYears(cigarettesPerDay: number, smokingYears: number): number {
  return (cigarettesPerDay / 20) * smokingYears;
}

export function ageInverse(ageYears: number): number {
  return 100 / ageYears;
}

function lnPlus1(x: number): number {
  return Math.log(x + 1);
}

export function prognosticIndex16(args: {
  male: 0 | 1;
  ageYears: number;
  packYears: number;
  cigarettesPerDay: number;
  quitYears: number;
  bmi: number;
  smokeHours: number;
  cough: 0 | 1;
}): number {
  const ageTerm = ageInverse(args.ageYears);
  return (
    C16.male * args.male +
    C16.ageInv * ageTerm +
    C16.lnPackYears * lnPlus1(args.packYears) +
    C16.cigPerDay * args.cigarettesPerDay +
    C16.lnQuitYears * lnPlus1(args.quitYears) +
    C16.lnBmi * lnPlus1(args.bmi) +
    C16.lnSmokeHours * lnPlus1(args.smokeHours) +
    C16.cough * args.cough
  );
}

export function prognosticIndex6(args: {
  male: 0 | 1;
  ageYears: number;
  packYears: number;
  cigarettesPerDay: number;
  quitYears: number;
  bmi: number;
  smokeHours: number;
  cough: 0 | 1;
}): number {
  const ageTerm = ageInverse(args.ageYears);
  return (
    C6.intercept +
    C6.male * args.male +
    C6.ageInv * ageTerm +
    C6.lnPackYears * lnPlus1(args.packYears) +
    C6.cigPerDay * args.cigarettesPerDay +
    C6.lnQuitYears * lnPlus1(args.quitYears) +
    C6.lnBmi * lnPlus1(args.bmi) +
    C6.lnSmokeHours * lnPlus1(args.smokeHours) +
    C6.cough * args.cough
  );
}

/** Cox absolute risk with S0 = 0.06: 1 − S0^exp(Xβ). */
export function risk16FromXb(xb: number): number {
  return 1 - Math.pow(S0_16, Math.exp(xb));
}

/** Logistic probability: 1 / (1 + e^(−Xβ)). */
export function risk6FromXb(xb: number): number {
  return 1 / (1 + Math.exp(-xb));
}

/** Numeric percent string for the read-only field (unit “%” shown beside the input). */
export function formatRiskPercent(fraction: number): string {
  const pct = fraction * 100;
  if (!Number.isFinite(pct)) return '—';
  if (pct < 0.01) return '<0.01';
  if (pct >= 10) return `${round1(pct)}`;
  return `${round2(pct)}`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateLungCancerRisk(
  input: LungCancerRiskInput,
): LungCancerRiskResult {
  const weightKg = weightToKg(input.weight as number, input.weightUnit);
  const heightM = heightToMeters(input.height as number, input.heightUnit);
  const bmi = computeBmiKgM2(weightKg, heightM);
  const py = packYears(
    input.cigarettesPerDay as number,
    input.smokingYears as number,
  );
  const male: 0 | 1 = input.sex === 'male' ? 1 : 0;
  const cough: 0 | 1 = input.dailyCough === 'yes' ? 1 : 0;
  const quit = input.yearsSinceQuitting as number;
  const smokeHours = input.smokeRoomHours as number;
  const cig = input.cigarettesPerDay as number;
  const age = input.ageYears as number;

  const args = {
    male,
    ageYears: age,
    packYears: py,
    cigarettesPerDay: cig,
    quitYears: quit,
    bmi,
    smokeHours,
    cough,
  };

  const xb16 = prognosticIndex16(args);
  const xb6 = prognosticIndex6(args);
  const risk16 = risk16FromXb(xb16);
  const risk6 = risk6FromXb(xb6);

  return {
    bmi,
    packYears: py,
    risk6Percent: risk6 * 100,
    risk16Percent: risk16 * 100,
    formattedRisk6: formatRiskPercent(risk6),
    formattedRisk16: formatRiskPercent(risk16),
    formattedBmi: `${round1(bmi)}`,
    explanation: `HUNT ever-smoker model: pack-years ${(Math.round(py * 100) / 100).toFixed(2)}; BMI ${round1(bmi)}. 6-year logistic and 16-year Cox (S0=0.06) with corrigendum ln(x+1) terms.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
