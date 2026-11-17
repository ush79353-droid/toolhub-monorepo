import { MILLIGRAMS_PER_POUND, type MgToLbsInput, type MgToLbsResult } from './types';

export { MILLIGRAMS_PER_POUND };

/** Readable mass display; keeps tiny positive values visible. */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(12)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 15;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function milligramsToPounds(milligrams: number): number {
  if (!Number.isFinite(milligrams) || milligrams < 0) {
    throw new Error('Milligrams must be a non-negative finite number.');
  }
  return milligrams / MILLIGRAMS_PER_POUND;
}

export function poundsToMilligrams(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Pounds must be a non-negative finite number.');
  }
  return pounds * MILLIGRAMS_PER_POUND;
}

export function calculateMgToLbs(input: MgToLbsInput): MgToLbsResult {
  let milligrams: number;
  let pounds: number;

  if (input.source === 'milligrams') {
    milligrams = input.milligrams!;
    pounds = milligramsToPounds(milligrams);
  } else {
    pounds = input.pounds!;
    milligrams = poundsToMilligrams(pounds);
  }

  const explanation =
    input.source === 'milligrams'
      ? `${formatMass(milligrams)} ÷ ${MILLIGRAMS_PER_POUND} = ${formatMass(pounds)} lb`
      : `${formatMass(pounds)} × ${MILLIGRAMS_PER_POUND} = ${formatMass(milligrams)} mg`;

  return { source: input.source, milligrams, pounds, explanation };
}

export function shareResultText(result: MgToLbsResult): string {
  return [
    'mg to lbs Converter — Omega Calculators',
    '',
    `Milligrams: ${formatMass(result.milligrams)} mg`,
    `Pounds: ${formatMass(result.pounds)} lb`,
    '',
    'Formula:',
    result.explanation,
    '',
    '/tools/mg-to-lbs-converter',
  ].join('\n');
}
