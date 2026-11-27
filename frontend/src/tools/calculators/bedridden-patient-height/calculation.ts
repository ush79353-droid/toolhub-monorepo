/**
 * Bedridden patient height/weight estimates — educational (ADR-018).
 * Coefficients from Omni Calculator method inventory (Mitchell & Lipschitz,
 * WHO, Rabito, Gray, Chumlea, Cereda, knee-height, demi-span, forearm chart,
 * Chumlea/Rabito/Ross weight). Lengths in cm; weight in kg.
 *
 * Fixtures:
 *   Mitchell: semi-span 85 cm → height 170 cm
 *   Ross white male: W = 1.19×KH + 3.21×AC − 86.82
 */

import type {
  BedriddenInput,
  BedriddenResult,
  HeightStudy,
  LengthUnit,
  MassUnit,
  Race,
  Sex,
  WeightStudy,
} from './types';

export const SOURCE_NOTE =
  'Height/weight equations from published bedridden anthropometry methods (Mitchell & Lipschitz; WHO; Rabito; Gray; Chumlea; Cereda; demi-span; ulna chart; Ross Laboratories). Educational only.';

export const DISCLAIMER =
  'Not a clinical measurement or dosing basis — confirm with appropriate scales/stadiometers and clinical judgment.';

export const IN_TO_CM = 2.54;
export const LB_TO_KG = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function fromCm(cm: number, unit: LengthUnit): number {
  return unit === 'cm' ? cm : cm / IN_TO_CM;
}

export function toKg(value: number, unit: MassUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function fromKg(kg: number, unit: MassUnit): number {
  return unit === 'kg' ? kg : kg / LB_TO_KG;
}

export function formatLength(cm: number, unit: LengthUnit): string {
  const v = fromCm(cm, unit);
  return (Math.round(v * 10) / 10).toFixed(1);
}

export function formatMass(kg: number, unit: MassUnit): string {
  const v = fromKg(kg, unit);
  return (Math.round(v * 10) / 10).toFixed(1);
}

export function mitchellLipschitzHeightCm(semiSpanCm: number): number {
  return semiSpanCm * 2;
}

/** WHO uses meters internally. */
export function whoHeightCm(halfArmSpanCm: number): number {
  const halfM = halfArmSpanCm / 100;
  return ((0.73 * 2 * halfM) + 0.43) * 100;
}

export function rabitoArmSemiHeightCm(
  sex: Sex,
  age: number,
  armLengthCm: number,
  semiSpanCm: number,
): number {
  const sexCode = sex === 'male' ? 1 : 2;
  return (
    58.694 -
    2.974 * sexCode -
    0.0736 * age +
    0.4958 * armLengthCm +
    1.132 * semiSpanCm
  );
}

export function rabitoSemiHeightCm(
  sex: Sex,
  age: number,
  semiSpanCm: number,
): number {
  const sexCode = sex === 'male' ? 1 : 2;
  return 63.525 - 3.237 * sexCode - 0.06904 * age + 1.293 * semiSpanCm;
}

export function chumleaHeightCm(
  sex: Sex,
  race: Race,
  kneeCm: number,
  age: number,
): number {
  if (sex === 'female' && race === 'white') {
    return 70.25 + 1.87 * kneeCm - 0.06 * age;
  }
  if (sex === 'female' && race === 'black') {
    return 68.1 + 1.86 * kneeCm - 0.06 * age;
  }
  if (sex === 'male' && race === 'white') {
    return 71.85 + 1.88 * kneeCm;
  }
  return 73.42 + 1.79 * kneeCm;
}

export function ceredaHeightCm(sex: Sex, kneeCm: number, age: number): number {
  const sexCode = sex === 'male' ? 1 : 0;
  return 60.76 + 2.16 * kneeCm - 0.06 * age + 2.76 * sexCode;
}

export function kneeHeightFormulaCm(
  sex: Sex,
  kneeCm: number,
  age: number,
): number {
  if (sex === 'female') return 84.88 - 0.24 * age + 1.83 * kneeCm;
  return 64.19 - 0.04 * age + 2.02 * kneeCm;
}

export function demiSpanHeightCm(sex: Sex, demiSpanCm: number): number {
  if (sex === 'female') return 1.35 * demiSpanCm + 60.1;
  return 1.4 * demiSpanCm + 57.8;
}

/** Ulna chart (cm) from Omni — lengths 18.5…32.0 step 0.5. */
const ULNA_CM = [
  18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5,
  26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32,
];
const MEN_LT65 = [
  146, 148, 149, 151, 153, 155, 157, 158, 160, 162, 164, 166, 167, 169, 171,
  173, 175, 176, 178, 180, 182, 184, 185, 187, 189, 191, 193, 194,
];
const MEN_GE65 = [
  145, 146, 148, 149, 151, 152, 154, 156, 157, 159, 160, 162, 163, 165, 167,
  168, 170, 171, 173, 175, 176, 178, 179, 181, 182, 184, 186, 187,
];
const WOMEN_LT65 = [
  147, 148, 150, 151, 152, 154, 155, 156, 158, 159, 161, 162, 163, 165, 166,
  168, 169, 170, 172, 173, 175, 176, 177, 179, 180, 181, 183, 184,
];
const WOMEN_GE65 = [
  140, 142, 144, 145, 147, 148, 150, 152, 153, 155, 156, 158, 160, 161, 163,
  165, 166, 168, 170, 171, 173, 175, 176, 178, 179, 181, 183, 184,
];

export function forearmChartHeightCm(
  sex: Sex,
  age: number,
  ulnaCm: number,
): number | null {
  if (ulnaCm < ULNA_CM[0]! || ulnaCm > ULNA_CM[ULNA_CM.length - 1]!) {
    return null;
  }
  const row =
    sex === 'male'
      ? age >= 65
        ? MEN_GE65
        : MEN_LT65
      : age >= 65
        ? WOMEN_GE65
        : WOMEN_LT65;
  // Exact table hit or linear interpolate between neighbors
  for (let i = 0; i < ULNA_CM.length; i++) {
    if (Math.abs(ULNA_CM[i]! - ulnaCm) < 1e-9) return row[i]!;
  }
  for (let i = 0; i < ULNA_CM.length - 1; i++) {
    const a = ULNA_CM[i]!;
    const b = ULNA_CM[i + 1]!;
    if (ulnaCm > a && ulnaCm < b) {
      const t = (ulnaCm - a) / (b - a);
      return row[i]! + t * (row[i + 1]! - row[i]!);
    }
  }
  return null;
}

export function chumleaWeightKg(
  sex: Sex,
  calfCm: number,
  kneeCm: number,
  armCm: number,
  subscapularMmOrCm: number,
): number {
  // Omni lists subscapular skinfold with other cm measures; treat input as cm
  // (same numeric path as teaching tables that publish the coefficient set).
  if (sex === 'female') {
    return (
      1.27 * calfCm +
      0.87 * kneeCm +
      0.98 * armCm +
      0.4 * subscapularMmOrCm -
      62.35
    );
  }
  return (
    0.98 * calfCm +
    1.16 * kneeCm +
    1.73 * armCm +
    0.37 * subscapularMmOrCm -
    81.69
  );
}

export function rabitoWeightWithSkinfoldKg(
  armCm: number,
  abdCm: number,
  calfCm: number,
  subscapular: number,
): number {
  return (
    0.503 * armCm +
    0.5634 * abdCm +
    1.318 * calfCm +
    0.0339 * subscapular -
    43.156
  );
}

export function rabitoWeightNoSkinfoldKg(
  armCm: number,
  abdCm: number,
  calfCm: number,
): number {
  return 0.4808 * armCm + 0.5646 * abdCm + 1.316 * calfCm - 42.245;
}

export function rabitoWeightWithSexKg(
  sex: Sex,
  armCm: number,
  abdCm: number,
  calfCm: number,
): number {
  const sexCode = sex === 'male' ? 1 : 2;
  return (
    0.5759 * armCm + 0.5263 * abdCm + 1.2452 * calfCm - 4.8689 * sexCode - 32.9241
  );
}

export function rossWeightKg(
  sex: Sex,
  race: Race,
  kneeCm: number,
  armCm: number,
): number {
  if (sex === 'female' && race === 'white') {
    return 1.01 * kneeCm + 2.81 * armCm - 66.04;
  }
  if (sex === 'female' && race === 'black') {
    return 1.24 * kneeCm + 2.81 * armCm - 82.48;
  }
  if (sex === 'male' && race === 'white') {
    return 1.19 * kneeCm + 3.21 * armCm - 86.82;
  }
  return 1.09 * kneeCm + 3.14 * armCm - 83.72;
}

function requirePositive(n: number | null): n is number {
  return n !== null && n > 0;
}

export function estimateHeightCm(input: BedriddenInput): {
  cm: number | null;
  status: string;
} {
  const study: HeightStudy = input.heightStudy;
  const age = parseNumber(input.heightAgeText);

  switch (study) {
    case 'mitchellLipschitz': {
      const semi = parseNumber(input.semiSpanText);
      if (!requirePositive(semi)) {
        return { cm: null, status: 'Enter semi-span for Mitchell & Lipschitz.' };
      }
      const cm = mitchellLipschitzHeightCm(toCm(semi, input.semiSpanUnit));
      return { cm, status: 'Height = 2 × semi-span.' };
    }
    case 'who': {
      const half = parseNumber(input.halfArmSpanText);
      if (!requirePositive(half)) {
        return { cm: null, status: 'Enter half-arm span for the WHO formula.' };
      }
      return {
        cm: whoHeightCm(toCm(half, input.halfArmSpanUnit)),
        status: 'WHO arm-span height estimate.',
      };
    }
    case 'rabitoArmSemi': {
      const arm = parseNumber(input.armLengthText);
      const semi = parseNumber(input.semiSpanText);
      if (!requirePositive(arm) || !requirePositive(semi) || age === null || age < 0) {
        return {
          cm: null,
          status: 'Enter age, arm length, and semi-span for Rabito (arm + semi-span).',
        };
      }
      return {
        cm: rabitoArmSemiHeightCm(
          input.heightSex,
          age,
          toCm(arm, input.armLengthUnit),
          toCm(semi, input.semiSpanUnit),
        ),
        status: 'Rabito et al. (arm length + semi-span).',
      };
    }
    case 'rabitoSemi': {
      const semi = parseNumber(input.semiSpanText);
      if (!requirePositive(semi) || age === null || age < 0) {
        return {
          cm: null,
          status: 'Enter age and semi-span for Rabito (semi-span).',
        };
      }
      return {
        cm: rabitoSemiHeightCm(
          input.heightSex,
          age,
          toCm(semi, input.semiSpanUnit),
        ),
        status: 'Rabito et al. (semi-span).',
      };
    }
    case 'gray': {
      const rec = parseNumber(input.recumbentText);
      if (!requirePositive(rec)) {
        return { cm: null, status: 'Enter recumbent height (Gray).' };
      }
      return {
        cm: toCm(rec, input.recumbentUnit),
        status: 'Gray: height = recumbent length.',
      };
    }
    case 'chumlea': {
      const knee = parseNumber(input.kneeHeightText);
      const needsAge = input.heightSex === 'female';
      if (!requirePositive(knee) || (needsAge && (age === null || age < 0))) {
        return {
          cm: null,
          status: needsAge
            ? 'Enter knee height and age for Chumlea (female).'
            : 'Enter knee height for Chumlea (male).',
        };
      }
      return {
        cm: chumleaHeightCm(
          input.heightSex,
          input.heightRace,
          toCm(knee, input.kneeHeightUnit),
          age ?? 0,
        ),
        status: 'Chumlea et al. knee-height stature.',
      };
    }
    case 'cereda': {
      const knee = parseNumber(input.kneeHeightText);
      if (!requirePositive(knee) || age === null || age < 0) {
        return { cm: null, status: 'Enter age and knee height for Cereda.' };
      }
      return {
        cm: ceredaHeightCm(
          input.heightSex,
          toCm(knee, input.kneeHeightUnit),
          age,
        ),
        status: 'Cereda et al. knee-height stature.',
      };
    }
    case 'kneeHeight': {
      const knee = parseNumber(input.kneeHeightText);
      if (!requirePositive(knee) || age === null || age < 0) {
        return {
          cm: null,
          status: 'Enter age and knee height for the knee-height formula.',
        };
      }
      return {
        cm: kneeHeightFormulaCm(
          input.heightSex,
          toCm(knee, input.kneeHeightUnit),
          age,
        ),
        status: 'Generic knee-height stature formula.',
      };
    }
    case 'demiSpan': {
      const demi = parseNumber(input.demiSpanText);
      if (!requirePositive(demi)) {
        return { cm: null, status: 'Enter demi-span.' };
      }
      return {
        cm: demiSpanHeightCm(input.heightSex, toCm(demi, input.demiSpanUnit)),
        status: 'Demi-span stature formula.',
      };
    }
    case 'forearm': {
      const ulna = parseNumber(input.forearmText);
      if (!requirePositive(ulna) || age === null || age < 0) {
        return {
          cm: null,
          status: 'Enter age and forearm (ulna) length (18.5–32 cm chart).',
        };
      }
      const cm = forearmChartHeightCm(
        input.heightSex,
        age,
        toCm(ulna, input.forearmUnit),
      );
      if (cm === null) {
        return {
          cm: null,
          status: 'Ulna length outside the published 18.5–32 cm chart.',
        };
      }
      return { cm, status: 'Forearm/ulna length chart estimate.' };
    }
  }
}

export function estimateWeightKg(input: BedriddenInput): {
  kg: number | null;
  status: string;
} {
  const study: WeightStudy = input.weightStudy;
  if (study === 'chumlea') {
    const calf = parseNumber(input.calfText);
    const knee = parseNumber(input.kneeWeightText);
    const arm = parseNumber(input.armCircText);
    const sub = parseNumber(input.subscapularText);
    if (
      !requirePositive(calf) ||
      !requirePositive(knee) ||
      !requirePositive(arm) ||
      !requirePositive(sub)
    ) {
      return {
        kg: null,
        status:
          'Enter calf, knee height, arm circumference, and subscapular skinfold for Chumlea weight.',
      };
    }
    return {
      kg: chumleaWeightKg(
        input.weightSex,
        toCm(calf, input.calfUnit),
        toCm(knee, input.kneeWeightUnit),
        toCm(arm, input.armCircUnit),
        toCm(sub, input.subscapularUnit),
      ),
      status: 'Chumlea et al. weight estimate.',
    };
  }

  if (study === 'ross') {
    const knee = parseNumber(input.kneeWeightText);
    const arm = parseNumber(input.armCircText);
    if (!requirePositive(knee) || !requirePositive(arm)) {
      return {
        kg: null,
        status: 'Enter knee height and arm circumference for Ross weight.',
      };
    }
    return {
      kg: rossWeightKg(
        input.weightSex,
        input.weightRace,
        toCm(knee, input.kneeWeightUnit),
        toCm(arm, input.armCircUnit),
      ),
      status: 'Ross Laboratories weight estimate.',
    };
  }

  // Rabito
  const arm = parseNumber(input.armCircText);
  const abd = parseNumber(input.abdominalText);
  const calf = parseNumber(input.calfText);
  if (!requirePositive(arm) || !requirePositive(abd) || !requirePositive(calf)) {
    return {
      kg: null,
      status: 'Enter arm, abdominal, and calf circumferences for Rabito weight.',
    };
  }
  const armCm = toCm(arm, input.armCircUnit);
  const abdCm = toCm(abd, input.abdominalUnit);
  const calfCm = toCm(calf, input.calfUnit);

  if (input.rabitoVariant === 'withSkinfold') {
    const sub = parseNumber(input.subscapularText);
    if (!requirePositive(sub)) {
      return {
        kg: null,
        status: 'Enter subscapular skinfold for Rabito (with skinfold).',
      };
    }
    return {
      kg: rabitoWeightWithSkinfoldKg(
        armCm,
        abdCm,
        calfCm,
        toCm(sub, input.subscapularUnit),
      ),
      status: 'Rabito et al. weight (with skinfold).',
    };
  }
  if (input.rabitoVariant === 'withSex') {
    return {
      kg: rabitoWeightWithSexKg(input.weightSex, armCm, abdCm, calfCm),
      status: 'Rabito et al. weight (with sex term).',
    };
  }
  return {
    kg: rabitoWeightNoSkinfoldKg(armCm, abdCm, calfCm),
    status: 'Rabito et al. weight (no skinfold).',
  };
}

export function calculateBedridden(input: BedriddenInput): BedriddenResult {
  const height = estimateHeightCm(input);
  const weight = estimateWeightKg(input);

  const heightOk =
    height.cm !== null && Number.isFinite(height.cm) && height.cm > 0;
  const weightOk =
    weight.kg !== null && Number.isFinite(weight.kg) && weight.kg > 0;

  return {
    heightCm: heightOk ? height.cm : null,
    weightKg: weightOk ? weight.kg : null,
    formattedHeight: heightOk
      ? formatLength(height.cm!, input.heightOutUnit)
      : '',
    formattedWeight: weightOk
      ? formatMass(weight.kg!, input.weightOutUnit)
      : '',
    heightStatus: height.status,
    weightStatus: weight.status,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
