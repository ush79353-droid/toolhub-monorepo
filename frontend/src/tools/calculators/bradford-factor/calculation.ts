import type { BradfordFactorInput, BradfordFactorResult } from './types';

/** Bradford Factor B = S × S × D */
export function calculateBradfordFactor(spells: number, daysAbsent: number): number {
  if (!Number.isFinite(spells) || !Number.isFinite(daysAbsent)) return Number.NaN;
  if (spells < 0 || daysAbsent < 0) return Number.NaN;
  const value = spells * spells * daysAbsent;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function formatBradfordFactor(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(rounded);
}

export function buildBradfordFactorResult(
  input: BradfordFactorInput
): BradfordFactorResult | null {
  const bradfordFactor = calculateBradfordFactor(input.spells, input.daysAbsent);
  if (!Number.isFinite(bradfordFactor)) return null;
  return {
    spells: input.spells,
    daysAbsent: input.daysAbsent,
    bradfordFactor,
    factorDisplay: formatBradfordFactor(bradfordFactor),
  };
}
