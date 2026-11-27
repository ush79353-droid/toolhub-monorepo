/**
 * Plasma volume — educational (ADR-018).
 *
 * PV = TBV × (1 − Hct/100)   [Hct as %]
 *
 * Weight-only TBV (mL): female 65 mL/kg; male 70 mL/kg
 * Nadler TBV (L), h in meters, W kg:
 *   male   0.3669 h³ + 0.03219 W + 0.6041
 *   female 0.3561 h³ + 0.03308 W + 0.1833
 * Lemmens–Bernstein–Brodsky (mL):
 *   male   W×70 / sqrt(BMI/22)
 *   female W×65 / sqrt(BMI/22)   BMI = W / h_m²
 *
 * Fixture: Hct 40% → PV = 60% of TBV.
 */

import type {
  HeightUnit,
  PlasmaVolumeInput,
  PlasmaVolumeResult,
  VolumeUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'PV = TBV × (1 − Hct/100). Weight-only TBV 65/70 mL/kg (F/M). Optional Nadler (L) and Lemmens–Bernstein–Brodsky when height is provided. Educational only.';

export const DISCLAIMER =
  'Adult educational estimate only — not a transfusion or procedural prescription.';

export const LB_TO_KG = 0.45359237;
export const FEMALE_ML_PER_KG = 65;
export const MALE_ML_PER_KG = 70;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'kg' ? kg : kg / LB_TO_KG;
}

export function toMeters(value: number, unit: HeightUnit): number {
  if (unit === 'm') return value;
  if (unit === 'cm') return value / 100;
  return value * 0.0254;
}

export function fromMeters(m: number, unit: HeightUnit): number {
  if (unit === 'm') return m;
  if (unit === 'cm') return m * 100;
  return m / 0.0254;
}

export function plasmaFromTbvMl(tbvMl: number, hctPercent: number): number {
  return tbvMl * (1 - hctPercent / 100);
}

export function weightOnlyTbvMl(weightKg: number, sex: 'female' | 'male'): number {
  return weightKg * (sex === 'female' ? FEMALE_ML_PER_KG : MALE_ML_PER_KG);
}

export function nadlerTbvMl(
  sex: 'female' | 'male',
  heightM: number,
  weightKg: number,
): number {
  const h3 = heightM ** 3;
  const liters =
    sex === 'male'
      ? 0.3669 * h3 + 0.03219 * weightKg + 0.6041
      : 0.3561 * h3 + 0.03308 * weightKg + 0.1833;
  return liters * 1000;
}

export function lemmensTbvMl(
  sex: 'female' | 'male',
  heightM: number,
  weightKg: number,
): number {
  const bmi = weightKg / (heightM * heightM);
  const base = sex === 'female' ? FEMALE_ML_PER_KG : MALE_ML_PER_KG;
  return (weightKg * base) / Math.sqrt(bmi / 22);
}

export function formatVolume(ml: number, unit: VolumeUnit): string {
  const v = unit === 'mL' ? ml : ml / 1000;
  const digits = unit === 'mL' ? 0 : 3;
  return (Math.round(v * 10 ** digits) / 10 ** digits).toFixed(digits);
}

function empty(partial?: Partial<PlasmaVolumeResult>): PlasmaVolumeResult {
  return {
    femaleWeightOnlyMl: null,
    maleWeightOnlyMl: null,
    femaleNadlerMl: null,
    maleNadlerMl: null,
    femaleLemmensMl: null,
    maleLemmensMl: null,
    formattedFemale: '',
    formattedMale: '',
    formattedFemaleNadler: '',
    formattedMaleNadler: '',
    formattedFemaleLemmens: '',
    formattedMaleLemmens: '',
    hasHeightMethods: false,
    statusHeadline: 'Enter weight and hematocrit.',
    statusDetail:
      'Optional height unlocks Nadler and Lemmens–Bernstein–Brodsky plasma estimates.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculatePlasmaVolume(
  input: PlasmaVolumeInput,
): PlasmaVolumeResult {
  const wRaw = parseNumber(input.weightText);
  const hct = parseNumber(input.hematocritText);
  const hRaw = parseNumber(input.heightText);

  if (wRaw === null || hct === null) {
    return empty();
  }
  if (!(wRaw > 0)) {
    return empty({
      statusHeadline: 'Weight must be positive.',
      statusDetail: 'Plasma volume withheld.',
    });
  }
  if (!(hct >= 0) || hct >= 100) {
    return empty({
      statusHeadline: 'Hematocrit must be ≥ 0 and < 100%.',
      statusDetail: 'Enter hematocrit as a percentage.',
    });
  }

  const kg = toKg(wRaw, input.weightUnit);
  const femaleTbv = weightOnlyTbvMl(kg, 'female');
  const maleTbv = weightOnlyTbvMl(kg, 'male');
  const femalePv = plasmaFromTbvMl(femaleTbv, hct);
  const malePv = plasmaFromTbvMl(maleTbv, hct);

  const base: PlasmaVolumeResult = {
    femaleWeightOnlyMl: femalePv,
    maleWeightOnlyMl: malePv,
    femaleNadlerMl: null,
    maleNadlerMl: null,
    femaleLemmensMl: null,
    maleLemmensMl: null,
    formattedFemale: formatVolume(femalePv, input.volumeUnit),
    formattedMale: formatVolume(malePv, input.volumeUnit),
    formattedFemaleNadler: '',
    formattedMaleNadler: '',
    formattedFemaleLemmens: '',
    formattedMaleLemmens: '',
    hasHeightMethods: false,
    statusHeadline: 'Weight-only plasma volume computed.',
    statusDetail:
      'Add height for Nadler and Lemmens–Bernstein–Brodsky methods. Both sex coefficients are shown.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (hRaw === null) {
    return base;
  }
  if (!(hRaw > 0)) {
    return {
      ...base,
      statusHeadline: 'Height must be positive when provided.',
      statusDetail: 'Height-dependent methods withheld.',
    };
  }

  const hm = toMeters(hRaw, input.heightUnit);
  if (!(hm > 0)) {
    return {
      ...base,
      statusHeadline: 'Height conversion invalid.',
      statusDetail: 'Height-dependent methods withheld.',
    };
  }

  const fN = plasmaFromTbvMl(nadlerTbvMl('female', hm, kg), hct);
  const mN = plasmaFromTbvMl(nadlerTbvMl('male', hm, kg), hct);
  const fL = plasmaFromTbvMl(lemmensTbvMl('female', hm, kg), hct);
  const mL = plasmaFromTbvMl(lemmensTbvMl('male', hm, kg), hct);

  return {
    ...base,
    femaleNadlerMl: fN,
    maleNadlerMl: mN,
    femaleLemmensMl: fL,
    maleLemmensMl: mL,
    formattedFemaleNadler: formatVolume(fN, input.volumeUnit),
    formattedMaleNadler: formatVolume(mN, input.volumeUnit),
    formattedFemaleLemmens: formatVolume(fL, input.volumeUnit),
    formattedMaleLemmens: formatVolume(mL, input.volumeUnit),
    hasHeightMethods: true,
    statusHeadline: 'Weight-only and height-based plasma volumes computed.',
    statusDetail:
      'Primary fields use 65/70 mL/kg. Nadler and Lemmens rows use the optional height.',
  };
}
