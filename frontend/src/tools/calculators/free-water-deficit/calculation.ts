/**
 * Free water deficit — educational (ADR-018).
 *
 * TBW (L) = weight_kg × demographic fraction
 * FWD (L) = TBW × ((measured Na / desired Na) − 1)
 *
 * Fractions (Omni / Adrogué–Madias NEJM 2000 Table 2 footnote):
 *   child 0.6 · adult male 0.6 · adult female 0.5 ·
 *   elderly male 0.5 · elderly female 0.45
 *
 * This estimates free-water volume for pure water loss teaching —
 * not an infusion schedule or Adrogué–Madias ΔNa prescription.
 */

import type {
  AgeSexCategory,
  FreeWaterDeficitInput,
  FreeWaterDeficitResult,
  VolumeUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'TBW = weight_kg × age/sex fraction; FWD = TBW × ((Na / desired Na) − 1). Fractions: child/adult male 0.6; adult female/elderly male 0.5; elderly female 0.45 (Adrogué–Madias / Omni). Educational estimate only — not a replacement schedule.';

export const DISCLAIMER =
  'Not a diagnosis or treatment plan — confirm with a clinician; ongoing losses and correction rate are separate clinical decisions.';

export const TBW_FRACTION: Record<AgeSexCategory, number> = {
  child: 0.6,
  adult_male: 0.6,
  adult_female: 0.5,
  elderly_male: 0.5,
  elderly_female: 0.45,
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

export function litersToDisplay(liters: number, unit: VolumeUnit): number {
  return unit === 'mL' ? liters * 1000 : liters;
}

export function displayToLiters(value: number, unit: VolumeUnit): number {
  return unit === 'mL' ? value / 1000 : value;
}

/** Free water deficit in liters (signed: negative ⇒ free-water excess). */
export function freeWaterDeficitL(
  weightKg: number,
  fraction: number,
  sodiumMeqL: number,
  desiredMeqL: number,
): number {
  const tbw = weightKg * fraction;
  return tbw * (sodiumMeqL / desiredMeqL - 1);
}

export function formatVolume(
  value: number | null,
  unit: VolumeUnit,
): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'mL' ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateFreeWaterDeficit(
  input: FreeWaterDeficitInput,
): FreeWaterDeficitResult {
  const empty = {
    tbwFraction: null,
    weightKg: null,
    tbwL: null,
    sodiumMeqL: null,
    desiredMeqL: null,
    deficitL: null,
    deficitDisplay: null,
    formattedDeficit: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const fraction = TBW_FRACTION[input.category];
  const weightRaw = parseNumber(input.weightText);
  const sodiumRaw = parseNumber(input.sodiumText);
  const desiredRaw = parseNumber(input.desiredSodiumText);

  if (weightRaw === null || sodiumRaw === null || desiredRaw === null) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Enter weight and sodium',
      statusDetail:
        'Enter body weight, measured sodium, and desired sodium to estimate free water deficit.',
    };
  }

  if (!(weightRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Body weight must be greater than zero.',
    };
  }

  if (!(sodiumRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid sodium',
      statusDetail: 'Measured sodium must be greater than zero.',
    };
  }

  if (!(desiredRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid desired sodium',
      statusDetail: 'Desired sodium must be greater than zero.',
    };
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const tbwL = weightKg * fraction;
  const deficitL = freeWaterDeficitL(
    weightKg,
    fraction,
    sodiumRaw,
    desiredRaw,
  );
  const deficitDisplayRaw = litersToDisplay(deficitL, input.resultUnit);
  const deficitDisplay =
    input.resultUnit === 'mL'
      ? Math.round(deficitDisplayRaw)
      : Math.round(deficitDisplayRaw * 100) / 100;
  const unitLabel = input.resultUnit === 'mL' ? 'mL' : 'L';

  let statusHeadline = 'Free water deficit';
  let statusDetail = `Estimated free water deficit ≈ ${formatVolume(deficitDisplay, input.resultUnit)} ${unitLabel} (TBW ≈ ${formatVolume(Math.round(tbwL * 100) / 100, 'L')} L).`;

  if (Math.abs(deficitL) < 1e-12) {
    statusHeadline = 'No free water deficit';
    statusDetail =
      'Measured sodium equals desired sodium — free water deficit is 0.';
  } else if (deficitL < 0) {
    statusHeadline = 'Free water excess (negative deficit)';
    statusDetail = `Signed estimate ≈ ${formatVolume(deficitDisplay, input.resultUnit)} ${unitLabel}. Measured sodium is below desired — this conventional formula reports free-water excess, not a hypernatremia deficit.`;
  }

  return {
    tbwFraction: fraction,
    weightKg,
    tbwL,
    sodiumMeqL: sodiumRaw,
    desiredMeqL: desiredRaw,
    deficitL,
    deficitDisplay,
    formattedDeficit: formatVolume(deficitDisplay, input.resultUnit),
    statusHeadline,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
