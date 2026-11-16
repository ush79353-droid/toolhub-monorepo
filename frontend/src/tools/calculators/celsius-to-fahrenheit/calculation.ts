import type { CelsiusToFahrenheitInput } from './types';

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

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export interface CelsiusToFahrenheitResult {
  source: 'celsius' | 'fahrenheit';
  celsius: number;
  fahrenheit: number;
  explanation: string;
}

export function calculateCelsiusToFahrenheit(
  input: CelsiusToFahrenheitInput,
): CelsiusToFahrenheitResult {
  let celsius: number;
  let fahrenheit: number;

  if (input.source === 'celsius') {
    celsius = input.celsius!;
    fahrenheit = celsiusToFahrenheit(celsius);
  } else {
    fahrenheit = input.fahrenheit!;
    celsius = fahrenheitToCelsius(fahrenheit);
  }

  const explanation =
    input.source === 'celsius'
      ? `(${formatTemp(celsius)} × 9/5) + 32 = ${formatTemp(fahrenheit)}°F`
      : `(${formatTemp(fahrenheit)} − 32) × 5/9 = ${formatTemp(celsius)}°C`;

  return { source: input.source, celsius, fahrenheit, explanation };
}

export function shareResultText(result: CelsiusToFahrenheitResult): string {
  return [
    'Celsius to Fahrenheit Converter — Omega Calculators',
    '',
    `${formatTemp(result.celsius)}°C = ${formatTemp(result.fahrenheit)}°F`,
    '',
    'Formula:',
    '°F = (°C × 9/5) + 32',
    result.explanation,
  ].join('\n');
}
