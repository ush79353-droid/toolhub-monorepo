import {
  BAR_PER_ATM,
  PA_PER_ATM,
  PA_PER_BAR,
  type BarToAtmInput,
  type BarToAtmResult,
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

export function barToAtm(bar: number): number {
  return (bar * PA_PER_BAR) / PA_PER_ATM;
}

export function atmToBar(atm: number): number {
  return (atm * PA_PER_ATM) / PA_PER_BAR;
}

export function convertPressure(
  value: number,
  fromPascals: number,
  toPascals: number,
): number {
  return (value * fromPascals) / toPascals;
}

export function calculateBarToAtm(input: BarToAtmInput): BarToAtmResult {
  let bar: number;
  let atm: number;

  if (input.source === 'bar') {
    bar = input.bar!;
    atm = barToAtm(bar);
  } else {
    atm = input.atm!;
    bar = atmToBar(atm);
  }

  const explanation =
    input.source === 'bar'
      ? `${formatPressure(bar)} bar × (${PA_PER_BAR.toLocaleString('en-US')} / ${PA_PER_ATM.toLocaleString('en-US')}) = ${formatPressure(atm)} atm`
      : `${formatPressure(atm)} atm × ${BAR_PER_ATM} = ${formatPressure(bar)} bar`;

  return { source: input.source, bar, atm, explanation };
}

export function shareResultText(result: BarToAtmResult): string {
  return [
    'Bar to ATM Conversion | Omega Calculators',
    '',
    'Input:',
    result.source === 'bar'
      ? `${formatPressure(result.bar)} bar`
      : `${formatPressure(result.atm)} atm`,
    '',
    'Result:',
    result.source === 'bar'
      ? `${formatPressure(result.atm)} atm`
      : `${formatPressure(result.bar)} bar`,
    '',
    'Formula:',
    'atm = bar × (100000 / 101325)',
    `bar = atm × ${BAR_PER_ATM}`,
  ].join('\n');
}
