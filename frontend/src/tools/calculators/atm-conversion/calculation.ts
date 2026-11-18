import {
  PA_PER_ATM,
  PRESSURE_FACTORS_PA,
  type AtmConversionInput,
  type AtmConversionResult,
  type AtmPressureUnit,
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

export function convertPressure(
  value: number,
  from: AtmPressureUnit,
  to: AtmPressureUnit,
): number {
  const pressurePa = value * PRESSURE_FACTORS_PA[from];
  return pressurePa / PRESSURE_FACTORS_PA[to];
}

export function toPascals(value: number, unit: AtmPressureUnit): number {
  return value * PRESSURE_FACTORS_PA[unit];
}

export function fromPascals(pa: number, unit: AtmPressureUnit): number {
  return pa / PRESSURE_FACTORS_PA[unit];
}

export function calculateAtmConversion(input: AtmConversionInput): AtmConversionResult {
  const sourceValue =
    input.source === 'atm'
      ? input.atm!
      : input.source === 'bar'
        ? input.bar!
        : input.source === 'psi'
          ? input.psi!
          : input.Pa!;

  const Pa = toPascals(sourceValue, input.source);
  const atm = fromPascals(Pa, 'atm');
  const bar = fromPascals(Pa, 'bar');
  const psi = fromPascals(Pa, 'psi');
  const isGaugeRelative = sourceValue < 0;

  const explanation = `${formatPressure(sourceValue)} ${input.source} → ${formatPressure(atm)} atm · ${formatPressure(bar)} bar · ${formatPressure(psi)} psi · ${formatPressure(Pa)} Pa`;

  return {
    source: input.source,
    atm,
    bar,
    psi,
    Pa,
    isGaugeRelative,
    explanation,
  };
}

export function shareResultText(result: AtmConversionResult): string {
  return [
    'ATM Conversion — Omega Calculators',
    '',
    `Atmospheres: ${formatPressure(result.atm)} atm`,
    `Bar: ${formatPressure(result.bar)} bar`,
    `PSI: ${formatPressure(result.psi)} psi`,
    `Pascals: ${formatPressure(result.Pa)} Pa`,
    result.isGaugeRelative
      ? '(Negative value treated as gauge-relative, not absolute pressure.)'
      : `Reference: 1 atm = ${PA_PER_ATM.toLocaleString('en-US')} Pa`,
  ].join('\n');
}
