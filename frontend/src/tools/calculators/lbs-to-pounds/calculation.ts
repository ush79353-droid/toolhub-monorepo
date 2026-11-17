import { LBS_TO_POUNDS_FACTOR, type LbsToPoundsInput, type LbsToPoundsResult } from './types';

export { LBS_TO_POUNDS_FACTOR };

/** Display helper that preserves exact numeric identity (no forced rounding). */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  return String(value);
}

export function lbsToPounds(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid weight value');
  }
  return value * LBS_TO_POUNDS_FACTOR;
}

export function poundsToLbs(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid weight value');
  }
  return value * LBS_TO_POUNDS_FACTOR;
}

export function calculateLbsToPounds(input: LbsToPoundsInput): LbsToPoundsResult {
  const value = input.source === 'lbs' ? input.lbs! : input.pounds!;
  const lbs = poundsToLbs(value);
  const pounds = lbsToPounds(value);

  return {
    source: input.source,
    lbs,
    pounds,
    explanation: `${formatMass(lbs)} lb(s) = ${formatMass(pounds)} pound(s) (same unit)`,
  };
}

export function shareResultText(result: LbsToPoundsResult): string {
  return [
    'lbs to Pounds Converter — Omega Calculators',
    '',
    `Weight in lbs: ${formatMass(result.lbs)}`,
    `Weight in pounds: ${formatMass(result.pounds)}`,
    '',
    '/tools/lbs-to-pounds-converter',
  ].join('\n');
}
