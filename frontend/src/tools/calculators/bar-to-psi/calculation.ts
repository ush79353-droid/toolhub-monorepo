import {
  PASCALS_PER_BAR,
  PASCALS_PER_PSI,
  PASCALS_PER_UNIT,
  PSI_PER_BAR,
  PRESSURE_UNIT_LABEL,
  type BarToPsiInput,
  type BarToPsiResult,
  type PressureUnit,
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

export function toPascals(value: number, unit: PressureUnit): number {
  return value * PASCALS_PER_UNIT[unit];
}

export function fromPascals(pascals: number, unit: PressureUnit): number {
  return pascals / PASCALS_PER_UNIT[unit];
}

export function barToPsi(bar: number): number {
  return (bar * PASCALS_PER_BAR) / PASCALS_PER_PSI;
}

export function psiToBar(psi: number): number {
  return (psi * PASCALS_PER_PSI) / PASCALS_PER_BAR;
}

export function convertPressure(
  value: number,
  from: PressureUnit,
  to: PressureUnit,
): number {
  return fromPascals(toPascals(value, from), to);
}

export function calculateBarToPsi(input: BarToPsiInput): BarToPsiResult {
  let pascals: number;
  let primary: number;
  let secondary: number;

  if (input.source === 'primary') {
    primary = input.primary!;
    pascals = toPascals(primary, input.primaryUnit);
    secondary = fromPascals(pascals, input.secondaryUnit);
  } else {
    secondary = input.secondary!;
    pascals = toPascals(secondary, input.secondaryUnit);
    primary = fromPascals(pascals, input.primaryUnit);
  }

  const bar = fromPascals(pascals, 'bar');
  const psi = fromPascals(pascals, 'psi');
  const pLabel = PRESSURE_UNIT_LABEL[input.primaryUnit];
  const sLabel = PRESSURE_UNIT_LABEL[input.secondaryUnit];

  const explanation =
    input.source === 'primary'
      ? `${formatPressure(primary)} ${pLabel} → ${formatPressure(secondary)} ${sLabel} (via Pa)`
      : `${formatPressure(secondary)} ${sLabel} → ${formatPressure(primary)} ${pLabel} (via Pa)`;

  return {
    source: input.source,
    primary,
    secondary,
    primaryUnit: input.primaryUnit,
    secondaryUnit: input.secondaryUnit,
    bar,
    psi,
    explanation,
  };
}

export function shareResultText(result: BarToPsiResult): string {
  const pLabel = PRESSURE_UNIT_LABEL[result.primaryUnit];
  const sLabel = PRESSURE_UNIT_LABEL[result.secondaryUnit];
  return [
    'Bar to PSI Conversion | Omega Calculators',
    '',
    'Input:',
    result.source === 'primary'
      ? `${formatPressure(result.primary)} ${pLabel}`
      : `${formatPressure(result.secondary)} ${sLabel}`,
    '',
    'Result:',
    `${formatPressure(result.primary)} ${pLabel}`,
    `${formatPressure(result.secondary)} ${sLabel}`,
    `${formatPressure(result.bar)} bar ≈ ${formatPressure(result.psi)} psi`,
    '',
    'Formula:',
    `psi = bar × ${PSI_PER_BAR}`,
    `bar = psi × ${PASCALS_PER_PSI / PASCALS_PER_BAR}`,
    `${formatPressure(result.bar)} bar ≈ ${formatPressure(result.psi)} psi`,
  ].join('\n');
}
