/**
 * UI stub — real IU↔mcg formulas land in the engine commit.
 * Exports keep the form/converter type-checkable without inventing factors here.
 */
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

/** Stub: returns null until the engine commit wires published factors. */
export function calculateMcgToIu(_input: McgToIuInput): McgToIuResult | null {
  return null;
}

export function shareResultText(result: McgToIuResult): string {
  return [
    'mcg to IU Converter | Omega Calculators',
    result.substanceLabel,
    `${formatMeasure(result.massMcg)} mcg ↔ ${formatMeasure(result.iu)} IU`,
    result.factorNote,
  ].join('\n');
}
