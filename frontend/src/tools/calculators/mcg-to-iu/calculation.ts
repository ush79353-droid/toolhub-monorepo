import {
  MCG_PER_MASS_UNIT,
  SUBSTANCE_OPTIONS,
  type MassUnit,
  type McgIuSubstance,
  type McgToIuInput,
  type McgToIuResult,
} from './types';

export function getSubstanceOption(substance: McgIuSubstance) {
  const option = SUBSTANCE_OPTIONS.find((row) => row.value === substance);
  if (!option) {
    throw new Error(`Unknown substance: ${substance}`);
  }
  return option;
}

export function toMcg(value: number, unit: MassUnit): number {
  return value * MCG_PER_MASS_UNIT[unit];
}

export function fromMcg(mcg: number, unit: MassUnit): number {
  return mcg / MCG_PER_MASS_UNIT[unit];
}

/**
 * Readable mass/IU display without ugly trailing zeros.
 * Keeps enough digits for vitamin D–scale values (e.g. 0.025 mcg).
 */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  return String(Number(value.toFixed(digits)));
}

/** IU from mass using published mcg-per-IU (or mcg RAE-per-IU) factor. */
export function mcgToIu(massMcg: number, mcgPerIu: number): number {
  return massMcg / mcgPerIu;
}

/** Mass from IU using published mcg-per-IU (or mcg RAE-per-IU) factor. */
export function iuToMcg(iu: number, mcgPerIu: number): number {
  return iu * mcgPerIu;
}

export function calculateMcgToIu(input: McgToIuInput): McgToIuResult {
  const option = getSubstanceOption(input.substance);
  const { mcgPerIu, label, sourceNote } = option;

  let massMcg: number;
  let iu: number;

  if (input.source === 'mass') {
    massMcg = input.massMcg!;
    iu = mcgToIu(massMcg, mcgPerIu);
  } else {
    iu = input.iu!;
    massMcg = iuToMcg(iu, mcgPerIu);
  }

  const explanation =
    input.source === 'mass'
      ? `${formatMeasure(massMcg)} mcg ÷ ${formatMeasure(mcgPerIu)} mcg/IU = ${formatMeasure(iu)} IU (${label}).`
      : `${formatMeasure(iu)} IU × ${formatMeasure(mcgPerIu)} mcg/IU = ${formatMeasure(massMcg)} mcg (${label}).`;

  return {
    substance: input.substance,
    source: input.source,
    massMcg,
    iu,
    mcgPerIu,
    substanceLabel: label,
    factorNote: sourceNote,
    explanation,
  };
}

export function shareResultText(result: McgToIuResult): string {
  return [
    'mcg to IU Converter | Omega Calculators',
    result.substanceLabel,
    `${formatMeasure(result.massMcg)} mcg ↔ ${formatMeasure(result.iu)} IU`,
    result.factorNote,
  ].join('\n');
}
