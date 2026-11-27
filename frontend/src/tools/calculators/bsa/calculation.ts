/**
 * Body surface area formulas — educational (ADR-018).
 *
 * W = weight kg, H = height cm. Results in m².
 * Du Bois:      0.007184 × W^0.425 × H^0.725  (primary)
 * Mosteller:    √(W × H / 3600)
 * Fujimoto:     0.008883 × W^0.444 × H^0.663
 * Gehan-George: 0.0235 × W^0.51456 × H^0.42246
 * Haycock:      0.024265 × W^0.5378 × H^0.3964
 *
 * Fixture: 180 cm · 80 kg → Mosteller 2.00 m².
 */

import type {
  BsaInput,
  BsaMethodValues,
  BsaResult,
  BsaUnit,
  HeightUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Primary Du Bois BSA (m²) = 0.007184 × W_kg^0.425 × H_cm^0.725. Also Mosteller √(WH/3600), Fujimoto, Gehan & George, and Haycock (all W kg, H cm).';

export const DISCLAIMER =
  'Educational estimate only — not a clinical dosing authority; follow institutional BSA protocols.';

export const LB_TO_KG = 0.45359237;
export const M2_TO_FT2 = 10.76391041671;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * LB_TO_KG : value;
}

export function weightFromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / LB_TO_KG : kg;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * 2.54;
    case 'ft':
      return value * 30.48;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

export function heightFromCm(cm: number, unit: HeightUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / 2.54;
    case 'ft':
      return cm / 30.48;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

export function duBoisBsaM2(weightKg: number, heightCm: number): number {
  return 0.007184 * weightKg ** 0.425 * heightCm ** 0.725;
}

export function mostellerBsaM2(weightKg: number, heightCm: number): number {
  return Math.sqrt((weightKg * heightCm) / 3600);
}

export function fujimotoBsaM2(weightKg: number, heightCm: number): number {
  return 0.008883 * weightKg ** 0.444 * heightCm ** 0.663;
}

export function gehanGeorgeBsaM2(weightKg: number, heightCm: number): number {
  return 0.0235 * weightKg ** 0.51456 * heightCm ** 0.42246;
}

export function haycockBsaM2(weightKg: number, heightCm: number): number {
  return 0.024265 * weightKg ** 0.5378 * heightCm ** 0.3964;
}

export function computeAllBsa(
  weightKg: number,
  heightCm: number,
): BsaMethodValues {
  return {
    duBois: duBoisBsaM2(weightKg, heightCm),
    mosteller: mostellerBsaM2(weightKg, heightCm),
    fujimoto: fujimotoBsaM2(weightKg, heightCm),
    gehanGeorge: gehanGeorgeBsaM2(weightKg, heightCm),
    haycock: haycockBsaM2(weightKg, heightCm),
  };
}

export function bsaFromM2(m2: number, unit: BsaUnit): number {
  return unit === 'ft2' ? m2 * M2_TO_FT2 : m2;
}

export function formatBsa(value: number | null, unit: BsaUnit): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'ft2' ? 2 : 2;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(value);
}

export function formatWeight(value: number | null, unit: WeightUnit): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: unit === 'lb' ? 1 : 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatHeight(value: number | null, unit: HeightUnit): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'cm' ? 1 : 3;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateBsa(input: BsaInput): BsaResult {
  const empty = {
    weightKg: null,
    heightCm: null,
    methods: null,
    primaryDisplay: null,
    formattedPrimary: '',
    formattedAdditional: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const wRaw = parseNumber(input.weightText);
  const hRaw = parseNumber(input.heightText);

  if (wRaw === null || hRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter weight and height',
      statusDetail:
        'Provide weight and height to estimate body surface area (Du Bois primary).',
    };
  }

  if (!(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Weight must be greater than zero.',
    };
  }
  if (!(hRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height',
      statusDetail: 'Height must be greater than zero.',
    };
  }

  const weightKg = weightToKg(wRaw, input.weightUnit);
  const heightCm = heightToCm(hRaw, input.heightUnit);
  const methods = computeAllBsa(weightKg, heightCm);
  const primaryM2 = methods.duBois;
  const primaryDisplay = round2(bsaFromM2(primaryM2, input.resultUnit));

  const fmt = (m2: number) =>
    formatBsa(round2(bsaFromM2(m2, input.resultUnit)), input.resultUnit);

  return {
    weightKg,
    heightCm,
    methods,
    primaryDisplay,
    formattedPrimary: formatBsa(primaryDisplay, input.resultUnit),
    formattedAdditional: {
      mosteller: fmt(methods.mosteller),
      fujimoto: fmt(methods.fujimoto),
      gehanGeorge: fmt(methods.gehanGeorge),
      haycock: fmt(methods.haycock),
    },
    statusHeadline: 'Body surface area (Du Bois)',
    statusDetail: `Du Bois BSA ≈ ${formatBsa(primaryDisplay, input.resultUnit)} ${input.resultUnit === 'ft2' ? 'ft²' : 'm²'}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
