import type { PoundsToLbsInput, PoundsToLbsResult } from './types';

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

/** Identity: pound and lb are the same unit. */
export function poundsToLbs(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid pounds value');
  }
  return pounds;
}

/** Identity reverse. */
export function lbsToPounds(lbs: number): number {
  if (!Number.isFinite(lbs) || lbs < 0) {
    throw new Error('Invalid lbs value');
  }
  return lbs;
}

export function calculatePoundsToLbs(input: PoundsToLbsInput): PoundsToLbsResult {
  let pounds: number;
  let lbs: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    lbs = poundsToLbs(pounds);
  } else {
    lbs = input.lbs!;
    pounds = lbsToPounds(lbs);
  }

  const explanation = `${formatMass(pounds)} pound${pounds === 1 ? '' : 's'} = ${formatMass(lbs)} lb`;

  return { source: input.source, pounds, lbs, explanation };
}

export function shareResultText(result: PoundsToLbsResult): string {
  return [
    'Pounds to lbs Converter — Omega Calculators',
    '',
    `${formatMass(result.pounds)} pound${result.pounds === 1 ? '' : 's'} = ${formatMass(result.lbs)} lbs`,
    '',
    '/tools/pounds-to-lbs-converter',
  ].join('\n');
}
