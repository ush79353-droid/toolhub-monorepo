import {
  PA_PER_ATM,
  type AtmToPascalsInput,
  type AtmToPascalsResult,
} from './types';

/** Readable pressure display without ugly trailing zeros. */
export function formatPressure(value: number): string {
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
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function atmToPascals(atm: number): number {
  return atm * PA_PER_ATM;
}

export function pascalsToAtm(pascals: number): number {
  return pascals / PA_PER_ATM;
}

export function calculateAtmToPascals(input: AtmToPascalsInput): AtmToPascalsResult {
  let atm: number;
  let pascals: number;

  if (input.source === 'atm') {
    atm = input.atm!;
    pascals = atmToPascals(atm);
  } else {
    pascals = input.pascals!;
    atm = pascalsToAtm(pascals);
  }

  const explanation =
    input.source === 'atm'
      ? `${formatPressure(atm)} atm × ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(pascals)} Pa`
      : `${formatPressure(pascals)} Pa ÷ ${PA_PER_ATM.toLocaleString('en-US')} = ${formatPressure(atm)} atm`;

  return { source: input.source, atm, pascals, explanation };
}

export function shareResultText(result: AtmToPascalsResult): string {
  return [
    'ATM to Pascals Conversion — Omega Calculators',
    '',
    `Atmospheres: ${formatPressure(result.atm)} atm`,
    `Pascals: ${formatPressure(result.pascals)} Pa`,
    '',
    'Formula:',
    `Pa = atm × ${PA_PER_ATM}`,
  ].join('\n');
}
