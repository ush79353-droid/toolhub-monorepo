import {
  OUNCES_PER_POUND,
  type PoundsToOuncesInput,
  type PoundsToOuncesResult,
} from './types';

export { OUNCES_PER_POUND };

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

export function poundsToOunces(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid pounds value');
  }
  return pounds * OUNCES_PER_POUND;
}

export function ouncesToPounds(ounces: number): number {
  if (!Number.isFinite(ounces) || ounces < 0) {
    throw new Error('Invalid ounces value');
  }
  return ounces / OUNCES_PER_POUND;
}

export function calculatePoundsToOunces(input: PoundsToOuncesInput): PoundsToOuncesResult {
  let pounds: number;
  let ounces: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    ounces = poundsToOunces(pounds);
  } else {
    ounces = input.ounces!;
    pounds = ouncesToPounds(ounces);
  }

  const explanation =
    input.source === 'pounds'
      ? `${formatMass(pounds)} lb × ${OUNCES_PER_POUND} = ${formatMass(ounces)} oz`
      : `${formatMass(ounces)} oz ÷ ${OUNCES_PER_POUND} = ${formatMass(pounds)} lb`;

  return { source: input.source, pounds, ounces, explanation };
}

export function shareResultText(result: PoundsToOuncesResult): string {
  return [
    'Pounds to Ounces Converter | Omega Calculators',
    '',
    `${formatMass(result.pounds)} lb = ${formatMass(result.ounces)} oz`,
    '',
    '/tools/pounds-to-ounces-converter',
  ].join('\n');
}
