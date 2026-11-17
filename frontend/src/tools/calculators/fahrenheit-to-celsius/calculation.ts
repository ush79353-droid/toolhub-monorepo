import type { FahrenheitToCelsiusInput } from './types';

/** Reuse shared °C↔°F helpers from the pair converter (same affine formulas). */
export {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemp,
} from '../celsius-to-fahrenheit/calculation';

import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatTemp,
} from '../celsius-to-fahrenheit/calculation';

export interface FahrenheitToCelsiusResult {
  source: 'fahrenheit' | 'celsius';
  fahrenheit: number;
  celsius: number;
  explanation: string;
}

export function calculateFahrenheitToCelsius(
  input: FahrenheitToCelsiusInput,
): FahrenheitToCelsiusResult {
  let fahrenheit: number;
  let celsius: number;

  if (input.source === 'fahrenheit') {
    fahrenheit = input.fahrenheit!;
    celsius = fahrenheitToCelsius(fahrenheit);
  } else {
    celsius = input.celsius!;
    fahrenheit = celsiusToFahrenheit(celsius);
  }

  const explanation =
    input.source === 'fahrenheit'
      ? `(${formatTemp(fahrenheit)} − 32) × 5/9 = ${formatTemp(celsius)}°C`
      : `(${formatTemp(celsius)} × 9/5) + 32 = ${formatTemp(fahrenheit)}°F`;

  return { source: input.source, fahrenheit, celsius, explanation };
}

export function shareResultText(result: FahrenheitToCelsiusResult): string {
  return [
    'Fahrenheit to Celsius Converter — Omega Calculators',
    '',
    `${formatTemp(result.fahrenheit)}°F = ${formatTemp(result.celsius)}°C`,
    '',
    'Formula:',
    '°C = (°F − 32) × 5/9',
    result.explanation,
  ].join('\n');
}
