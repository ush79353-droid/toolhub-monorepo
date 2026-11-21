import type { CentigradeToCelsiusInput } from './types';

/** Readable temperature display without ugly trailing zeros. */
export function formatTemp(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;

  const rounded = Number(value.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

/** Identity: centigrade is the historical name for Celsius. */
export function centigradeToCelsius(value: number): number {
  return value;
}

/** Identity: Celsius numerical value equals degrees centigrade. */
export function celsiusToCentigrade(value: number): number {
  return value;
}

export interface CentigradeToCelsiusResult {
  source: 'centigrade' | 'celsius';
  centigrade: number;
  celsius: number;
  explanation: string;
}

export function calculateCentigradeToCelsius(
  input: CentigradeToCelsiusInput,
): CentigradeToCelsiusResult {
  const value =
    input.source === 'centigrade' ? input.centigrade! : input.celsius!;
  const centigrade = celsiusToCentigrade(value);
  const celsius = centigradeToCelsius(value);

  return {
    source: input.source,
    centigrade,
    celsius,
    explanation: `${formatTemp(centigrade)} °centigrade = ${formatTemp(celsius)} °C (identical scale)`,
  };
}

export function shareResultText(result: CentigradeToCelsiusResult): string {
  return [
    'Centigrade to Celsius Converter | Omega Calculators',
    '',
    `${formatTemp(result.centigrade)} °centigrade = ${formatTemp(result.celsius)} °C`,
    '',
    'Formula:',
    '°C = °centigrade (identity)',
    result.explanation,
  ].join('\n');
}
