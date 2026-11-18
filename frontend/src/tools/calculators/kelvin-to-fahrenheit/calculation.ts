import { formatTemp } from '../kelvin-converter/calculation';
import type { KelvinToFahrenheitInput } from './types';

export { formatTemp };

/** °F = (K − 273.15) × 9/5 + 32 */
export function kelvinToFahrenheit(kelvin: number): number {
  return (kelvin - 273.15) * (9 / 5) + 32;
}

/** Equivalent: °F = 1.8K − 459.67 */
export function kelvinToFahrenheitDirect(kelvin: number): number {
  return 1.8 * kelvin - 459.67;
}

/** K = (°F − 32) × 5/9 + 273.15 */
export function fahrenheitToKelvin(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9) + 273.15;
}

/** Equivalent: K = (°F + 459.67) × 5/9 */
export function fahrenheitToKelvinDirect(fahrenheit: number): number {
  return (fahrenheit + 459.67) * (5 / 9);
}

export interface KelvinToFahrenheitResult {
  source: 'kelvin' | 'fahrenheit';
  kelvin: number;
  fahrenheit: number;
  explanation: string;
}

export function calculateKelvinToFahrenheit(
  input: KelvinToFahrenheitInput,
): KelvinToFahrenheitResult {
  let kelvin: number;
  let fahrenheit: number;

  if (input.source === 'kelvin') {
    kelvin = input.kelvin!;
    fahrenheit = kelvinToFahrenheit(kelvin);
  } else {
    fahrenheit = input.fahrenheit!;
    kelvin = fahrenheitToKelvin(fahrenheit);
  }

  const explanation =
    input.source === 'kelvin'
      ? `(${formatTemp(kelvin)} − 273.15) × 9/5 + 32 = ${formatTemp(fahrenheit)}°F`
      : `(${formatTemp(fahrenheit)} − 32) × 5/9 + 273.15 = ${formatTemp(kelvin)} K`;

  return { source: input.source, kelvin, fahrenheit, explanation };
}

export function shareResultText(result: KelvinToFahrenheitResult): string {
  return [
    'Kelvin to Fahrenheit Converter',
    'Omega Calculators',
    '',
    `${formatTemp(result.kelvin)} K = ${formatTemp(result.fahrenheit)} °F`,
    '',
    'Formula:',
    '°F = (K − 273.15) × 9/5 + 32',
    result.explanation,
    '',
    'Calculator:',
    '/tools/kelvin-to-fahrenheit-converter',
  ].join('\n');
}
