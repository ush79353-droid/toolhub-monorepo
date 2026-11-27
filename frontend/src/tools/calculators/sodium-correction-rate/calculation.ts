/**
 * Sodium correction rate — educational Adrogué–Madias (ADR-018).
 *
 * TBW (L) = weight_kg × demographic fraction
 * ΔNa per liter (mEq/L) = (infusate Na + infusate K − serum Na) / (TBW + 1)
 * Flow (mL/h) = 1000 × aimed_change_per_h / ΔNa_per_liter
 *             = 1000 × aimed × (TBW + 1) / (infusate Na+K − serum Na)
 *
 * Fractions (Omni): child/adult male 0.6; adult female/elderly male 0.5;
 * elderly female 0.45. mEq/L ≡ mmol/L for sodium.
 *
 * Teaching estimate only — not a saline order. Recheck Na frequently.
 */

import type {
  AgeSexCategory,
  FluidPreset,
  SodiumCorrectionRateInput,
  SodiumCorrectionRateResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Adrogué–Madias: ΔNa/L = (infusate Na + K − serum Na) / (TBW + 1); flow mL/h = 1000 × aimed ΔNa/h / (ΔNa/L). TBW fractions: child/adult male 0.6; adult female/elderly male 0.5; elderly female 0.45. Educational estimate — not a treatment order.';

export const DISCLAIMER =
  'Not a diagnosis or infusion order — confirm with a clinician; rapid correction can cause osmotic demyelination or cerebral edema. Recheck serum sodium during therapy.';

export const TBW_FRACTION: Record<AgeSexCategory, number> = {
  child: 0.6,
  adult_male: 0.6,
  adult_female: 0.5,
  elderly_male: 0.5,
  elderly_female: 0.45,
};

/** Infusate Na / K (mEq/L). Hartmann's uses NICE-style Na 131 + K 5. */
export const FLUID_COMPOSITION: Record<
  FluidPreset,
  { label: string; na: number; k: number }
> = {
  nacl_09: { label: '0.9% NaCl', na: 154, k: 0 },
  nacl_045: { label: '0.45% NaCl', na: 77, k: 0 },
  nacl_3: { label: '3% NaCl', na: 513, k: 0 },
  nacl_2: { label: '2% NaCl', na: 342, k: 0 },
  d5w: { label: '5% dextrose (D5W)', na: 0, k: 0 },
  hartmanns: { label: "Hartmann's / LR", na: 131, k: 5 },
};

export const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function changePerLiterMeq(
  infusateNa: number,
  infusateK: number,
  serumNa: number,
  tbwL: number,
): number {
  return (infusateNa + infusateK - serumNa) / (tbwL + 1);
}

export function flowMlPerHour(
  aimedChangePerHr: number,
  deltaPerLiter: number,
): number | null {
  if (!Number.isFinite(deltaPerLiter) || deltaPerLiter === 0) return null;
  const flow = (1000 * aimedChangePerHr) / deltaPerLiter;
  return Number.isFinite(flow) ? flow : null;
}

export function formatVolumeL(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatMeq(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatFlow(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function emptyResult(
  partial?: Partial<SodiumCorrectionRateResult>,
): SodiumCorrectionRateResult {
  return {
    tbwFraction: null,
    weightKg: null,
    tbwL: null,
    sodiumMeqL: null,
    fluidNaMeqL: null,
    fluidKMeqL: null,
    aimedChangeMeqPerHr: null,
    changePerLiter: null,
    flowMlPerHr: null,
    formattedTbw: '',
    formattedChangePerLiter: '',
    formattedFlow: '',
    statusHeadline: 'Enter weight and serum sodium',
    statusDetail:
      'Enter body weight and serum sodium to estimate Adrogué–Madias ΔNa per liter and infusion rate.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    showAdvanced: false,
    ...partial,
  };
}

export function calculateSodiumCorrectionRate(
  input: SodiumCorrectionRateInput,
): SodiumCorrectionRateResult {
  const fraction = TBW_FRACTION[input.category];
  const fluid = FLUID_COMPOSITION[input.fluid];
  const weightRaw = parseNumber(input.weightText);
  const sodiumRaw = parseNumber(input.sodiumText);
  const aimedRaw = parseNumber(input.aimedChangeText);

  if (weightRaw === null || sodiumRaw === null) {
    return emptyResult({ tbwFraction: fraction });
  }

  if (!(weightRaw > 0)) {
    return emptyResult({
      tbwFraction: fraction,
      statusHeadline: 'Weight must be positive',
      statusDetail: 'Enter a body weight greater than zero.',
    });
  }

  if (!(sodiumRaw > 0) || sodiumRaw > 300) {
    return emptyResult({
      tbwFraction: fraction,
      weightKg: weightToKg(weightRaw, input.weightUnit),
      statusHeadline: 'Serum sodium out of range',
      statusDetail: 'Enter a plausible serum sodium in mEq/L (mmol/L).',
    });
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const tbwL = weightKg * fraction;
  const delta = changePerLiterMeq(fluid.na, fluid.k, sodiumRaw, tbwL);

  const showAdvanced = true;
  const base = {
    tbwFraction: fraction,
    weightKg,
    tbwL,
    sodiumMeqL: sodiumRaw,
    fluidNaMeqL: fluid.na,
    fluidKMeqL: fluid.k,
    changePerLiter: delta,
    formattedTbw: formatVolumeL(tbwL),
    formattedChangePerLiter: formatMeq(delta),
    showAdvanced,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (aimedRaw === null) {
    return emptyResult({
      ...base,
      statusHeadline: 'Enter aimed sodium change',
      statusDetail:
        'Enter the aimed serum sodium change per hour (mEq/L/h) to estimate infusion rate.',
      formattedFlow: '',
      flowMlPerHr: null,
      aimedChangeMeqPerHr: null,
    });
  }

  if (!Number.isFinite(aimedRaw) || aimedRaw === 0) {
    return emptyResult({
      ...base,
      aimedChangeMeqPerHr: aimedRaw,
      statusHeadline: 'Aimed change cannot be zero',
      statusDetail:
        'Enter a non-zero aimed hourly sodium change (positive to raise, negative to lower).',
    });
  }

  if (delta === 0) {
    return emptyResult({
      ...base,
      aimedChangeMeqPerHr: aimedRaw,
      statusHeadline: 'Infusate matches serum sodium',
      statusDetail:
        'When infusate Na+K equals serum Na, predicted ΔNa per liter is zero — choose another fluid.',
    });
  }

  const flow = flowMlPerHour(aimedRaw, delta);
  if (flow === null) {
    return emptyResult({
      ...base,
      aimedChangeMeqPerHr: aimedRaw,
      statusHeadline: 'Cannot compute flow',
      statusDetail: 'Check inputs — division by zero or non-finite result.',
    });
  }

  // Aimed and ΔNa should share sign for a meaningful positive infusion volume.
  if (aimedRaw * delta < 0) {
    return emptyResult({
      ...base,
      aimedChangeMeqPerHr: aimedRaw,
      flowMlPerHr: flow,
      formattedFlow: formatFlow(flow),
      statusHeadline: 'Direction mismatch',
      statusDetail:
        'Aimed change and predicted ΔNa/L have opposite signs — this fluid moves sodium the other way. Flow is still shown mathematically.',
    });
  }

  return {
    ...base,
    aimedChangeMeqPerHr: aimedRaw,
    flowMlPerHr: flow,
    formattedFlow: formatFlow(flow),
    statusHeadline: 'Estimated correction rate',
    statusDetail: `${FLUID_COMPOSITION[input.fluid].label}: ≈ ${formatMeq(delta)} mEq/L per liter · ≈ ${formatFlow(flow)} mL/h for ${formatMeq(aimedRaw)} mEq/L/h aimed.`,
  };
}
