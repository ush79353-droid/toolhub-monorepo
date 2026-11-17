import { formatTemp } from '../kelvin-converter/calculation';
import type { KelvinToCelsiusInput } from './types';

export { formatTemp };

export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

export interface KelvinToCelsiusResult {
  source: 'kelvin' | 'celsius';
  kelvin: number;
  celsius: number;
  explanation: string;
}

export function calculateKelvinToCelsius(input: KelvinToCelsiusInput): KelvinToCelsiusResult {
  let kelvin: number;
  let celsius: number;

  if (input.source === 'kelvin') {
    kelvin = input.kelvin!;
    celsius = kelvinToCelsius(kelvin);
  } else {
    celsius = input.celsius!;
    kelvin = celsiusToKelvin(celsius);
  }

  const explanation =
    input.source === 'kelvin'
      ? `${formatTemp(kelvin)} − 273.15 = ${formatTemp(celsius)}°C`
      : `${formatTemp(celsius)} + 273.15 = ${formatTemp(kelvin)} K`;

  return { source: input.source, kelvin, celsius, explanation };
}

export function shareResultText(result: KelvinToCelsiusResult): string {
  return [
    'Kelvin to Celsius Converter',
    'Omega Calculators',
    '',
    `${formatTemp(result.kelvin)} K = ${formatTemp(result.celsius)} °C`,
    '',
    'Formula:',
    '°C = K − 273.15',
    result.explanation,
    '',
    'Calculator:',
    '/tools/kelvin-to-celsius-converter',
  ].join('\n');
}
