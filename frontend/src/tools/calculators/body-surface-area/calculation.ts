/**
 * Multi-formula BSA estimates — educational (ADR-018).
 *
 * Sources (calculator.net Body Surface Area Calculator):
 * W = kg, H = cm → m²
 * Du Bois:      0.007184 × W^0.425 × H^0.725
 * Mosteller:    √(W × H / 3600)
 * Haycock:      0.024265 × W^0.5378 × H^0.3964
 * Gehan-George: 0.0235 × W^0.51456 × H^0.42246
 * Boyd:         0.03330 × W^(0.6157 − 0.0188 × log10(W)) × H^0.3
 * Fujimoto:     0.008883 × W^0.444 × H^0.663
 * Takahira:     0.007241 × W^0.425 × H^0.725
 * Schlich ♀:    0.000975482 × W^0.46 × H^1.08
 * Schlich ♂:    0.000579479 × W^0.38 × H^1.24
 *
 * Fixture: 155 lb · 5′9″ → ≈70.3068 kg · 175.26 cm → Mosteller ≈ 1.85 m².
 */

import type {
  BodySurfaceAreaInput,
  BodySurfaceAreaMethodValues,
  BodySurfaceAreaResult,
  HeightSource,
  Sex,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'BSA (m²) from weight kg and height cm: Du Bois 0.007184×W^0.425×H^0.725; Mosteller √(WH/3600); Haycock; Gehan & George; Boyd; Fujimoto; Takahira; Schlich sex-specific (calculator.net / primary literature).';

export const DISCLAIMER =
  'Educational estimate only — not a clinical dosing authority; follow institutional BSA protocols.';

export const LB_TO_KG = 0.45359237;
export const IN_TO_CM = 2.54;

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

export function resolveHeightCm(input: BodySurfaceAreaInput): number | null {
  if (input.heightSource === 'metric') {
    const cm = parseNumber(input.heightCm);
    if (cm === null) return null;
    return cm;
  }
  const ft = parseNumber(input.heightFt);
  const inches = parseNumber(input.heightIn);
  const hasFt = input.heightFt.trim() !== '';
  const hasIn = input.heightIn.trim() !== '';
  if (!hasFt && !hasIn) return null;
  if ((hasFt && ft === null) || (hasIn && inches === null)) return null;
  const f = ft ?? 0;
  const i = inches ?? 0;
  if (i < 0 || i >= 12) return null;
  if (f < 0) return null;
  if (f === 0 && i === 0) return null;
  return (f * 12 + i) * IN_TO_CM;
}

export function duBoisBsaM2(weightKg: number, heightCm: number): number {
  return 0.007184 * weightKg ** 0.425 * heightCm ** 0.725;
}

export function mostellerBsaM2(weightKg: number, heightCm: number): number {
  return Math.sqrt((weightKg * heightCm) / 3600);
}

export function haycockBsaM2(weightKg: number, heightCm: number): number {
  return 0.024265 * weightKg ** 0.5378 * heightCm ** 0.3964;
}

export function gehanGeorgeBsaM2(weightKg: number, heightCm: number): number {
  return 0.0235 * weightKg ** 0.51456 * heightCm ** 0.42246;
}

/** Boyd (calculator.net / Boyd 1935 kg form). */
export function boydBsaM2(weightKg: number, heightCm: number): number {
  const exponent = 0.6157 - 0.0188 * Math.log10(weightKg);
  return 0.0333 * weightKg ** exponent * heightCm ** 0.3;
}

export function fujimotoBsaM2(weightKg: number, heightCm: number): number {
  return 0.008883 * weightKg ** 0.444 * heightCm ** 0.663;
}

export function takahiraBsaM2(weightKg: number, heightCm: number): number {
  return 0.007241 * weightKg ** 0.425 * heightCm ** 0.725;
}

export function schlichBsaM2(
  weightKg: number,
  heightCm: number,
  sex: Sex,
): number {
  if (sex === 'female') {
    return 0.000975482 * weightKg ** 0.46 * heightCm ** 1.08;
  }
  return 0.000579479 * weightKg ** 0.38 * heightCm ** 1.24;
}

export function computeAllBsa(
  weightKg: number,
  heightCm: number,
  sex: Sex,
): BodySurfaceAreaMethodValues {
  return {
    duBois: duBoisBsaM2(weightKg, heightCm),
    mosteller: mostellerBsaM2(weightKg, heightCm),
    haycock: haycockBsaM2(weightKg, heightCm),
    gehanGeorge: gehanGeorgeBsaM2(weightKg, heightCm),
    boyd: boydBsaM2(weightKg, heightCm),
    fujimoto: fujimotoBsaM2(weightKg, heightCm),
    takahira: takahiraBsaM2(weightKg, heightCm),
    schlich: schlichBsaM2(weightKg, heightCm, sex),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatBsaM2(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(round2(value));
}

export function calculateBodySurfaceArea(
  input: BodySurfaceAreaInput,
): BodySurfaceAreaResult | null {
  const wRaw = parseNumber(input.weightText);
  const heightCm = resolveHeightCm(input);
  if (wRaw === null || heightCm === null) return null;
  if (!(wRaw > 0) || !(heightCm > 0)) return null;

  const weightKg = weightToKg(wRaw, input.weightUnit);
  if (!(weightKg > 0)) return null;

  const methods = computeAllBsa(weightKg, heightCm, input.sex);
  const fmt = (n: number) => formatBsaM2(n);

  return {
    weightKg,
    heightCm,
    methods,
    formatted: {
      duBois: fmt(methods.duBois),
      mosteller: fmt(methods.mosteller),
      haycock: fmt(methods.haycock),
      gehanGeorge: fmt(methods.gehanGeorge),
      boyd: fmt(methods.boyd),
      fujimoto: fmt(methods.fujimoto),
      takahira: fmt(methods.takahira),
      schlich: fmt(methods.schlich),
    },
    statusHeadline: 'Body surface area estimates',
    statusDetail: `Normalized ≈ ${weightKg.toFixed(4)} kg · ${heightCm.toFixed(2)} cm. Mosteller ≈ ${fmt(methods.mosteller)} m².`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** Exported for tests — height source typing helper. */
export type { HeightSource };
