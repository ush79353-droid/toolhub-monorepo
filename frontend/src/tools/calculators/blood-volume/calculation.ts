/**
 * Total blood volume (TBV) — Nadler, Lemmens–Bernstein–Brodsky, and weight-based estimates (ADR-018).
 *
 * Nadler (height cm, weight kg → mL):
 *   male   604.1 + 0.0003668 × h³ + 32 × w
 *   female 183.3 + 0.000356  × h³ + 33 × w
 *
 * LBB (BMI-adjusted indexed volume, mL):
 *   male   70 × w / √(BMI/22)
 *   female 65 × w / √(BMI/22)
 *
 * Weight-only: 70 mL/kg (male), 65 mL/kg (female) — depends only on weight.
 */

import type { BloodVolumeInput, BloodVolumeResult } from './types';

export const SOURCE_NOTE =
  'Nadler equation; Lemmens–Bernstein–Brodsky indexed volume; weight constants 70/65 mL/kg. Educational physiology estimate — not a measured blood volume.';

export const DISCLAIMER =
  'Educational estimate only — not for transfusion, apheresis, or acute care decisions without laboratory confirmation.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function bmiKgM2(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  if (!(hM > 0)) throw new Error('Height must be positive.');
  return weightKg / (hM * hM);
}

/** Nadler TBV in mL from height (cm) and weight (kg). */
export function nadlerBloodVolumeMl(
  sex: 'male' | 'female',
  heightCm: number,
  weightKg: number,
): number {
  const h3 = heightCm ** 3;
  if (sex === 'male') {
    return 604.1 + 0.0003668 * h3 + 32 * weightKg;
  }
  return 183.3 + 0.000356 * h3 + 33 * weightKg;
}

/** Lemmens–Bernstein–Brodsky TBV in mL. */
export function lemmensBernsteinBrodskyBloodVolumeMl(
  sex: 'male' | 'female',
  weightKg: number,
  heightCm: number,
): number {
  const bmi = bmiKgM2(weightKg, heightCm);
  const baseIndexed = sex === 'male' ? 70 : 65;
  const factor = Math.sqrt(bmi / 22);
  if (!(factor > 0)) throw new Error('Invalid BMI factor.');
  return (baseIndexed * weightKg) / factor;
}

/** Simple mL/kg weight estimate. */
export function weightBasedBloodVolumeMl(
  sex: 'male' | 'female',
  weightKg: number,
): number {
  const mlPerKg = sex === 'male' ? 70 : 65;
  return mlPerKg * weightKg;
}

export function formatVolumeMl(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value));
}

export function calculateBloodVolume(input: BloodVolumeInput): BloodVolumeResult {
  const empty: BloodVolumeResult = {
    nadlerFemaleMl: null,
    nadlerMaleMl: null,
    lbbFemaleMl: null,
    lbbMaleMl: null,
    weightFemaleMl: null,
    weightMaleMl: null,
    statusHeadline: 'Enter height and weight',
    statusDetail: 'Provide height and weight to estimate blood volume with Nadler, Lemmens–Bernstein–Brodsky, and weight-based methods.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  if (hRaw === null || wRaw === null) return empty;

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid measurements',
      statusDetail: 'Height and weight must be positive numbers.',
    };
  }

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  const nadlerF = nadlerBloodVolumeMl('female', heightCm, weightKg);
  const nadlerM = nadlerBloodVolumeMl('male', heightCm, weightKg);
  const lbbF = lemmensBernsteinBrodskyBloodVolumeMl('female', weightKg, heightCm);
  const lbbM = lemmensBernsteinBrodskyBloodVolumeMl('male', weightKg, heightCm);
  const wF = weightBasedBloodVolumeMl('female', weightKg);
  const wM = weightBasedBloodVolumeMl('male', weightKg);

  return {
    nadlerFemaleMl: nadlerF,
    nadlerMaleMl: nadlerM,
    lbbFemaleMl: lbbF,
    lbbMaleMl: lbbM,
    weightFemaleMl: wF,
    weightMaleMl: wM,
    statusHeadline: 'Blood volume estimates',
    statusDetail: `Weight-based male volume uses only weight (${formatVolumeMl(wM)} mL at 70 mL/kg).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}