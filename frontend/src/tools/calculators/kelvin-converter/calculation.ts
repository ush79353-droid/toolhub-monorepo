import {
  allFromCelsius,
  convertTemperature as convertViaCelsius,
  formatTemp,
  fromCelsius,
  toCelsius,
} from '../celsius-converter/calculation';
import {
  ABSOLUTE_ZERO_C,
  ABS_ZERO_EPS,
  TEMP_SYMBOLS,
  type TemperatureUnit,
} from './types';

export { allFromCelsius, formatTemp, fromCelsius, toCelsius };

/** Convert any supported scale to Kelvin (canonical). */
export function toKelvin(value: number, unit: TemperatureUnit): number {
  return toCelsius(value, unit) + 273.15;
}

export function fromKelvin(kelvin: number, unit: TemperatureUnit): number {
  return fromCelsius(kelvin - 273.15, unit);
}

export function allFromKelvin(kelvin: number): Record<TemperatureUnit, number> {
  return allFromCelsius(kelvin - 273.15);
}

/**
 * Convert between temperature scales via Kelvin.
 * Rejects temperatures below absolute zero (does not silently clamp).
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid temperature value');
  }

  const kelvin = toKelvin(value, fromUnit);
  if (!Number.isFinite(kelvin)) {
    throw new Error('Temperature is out of supported range');
  }
  if (kelvin < -ABS_ZERO_EPS) {
    throw new Error('Temperature cannot be below absolute zero (0 K)');
  }

  const normalizedKelvin = kelvin < 0 ? 0 : kelvin;
  const result = fromKelvin(normalizedKelvin, toUnit);
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of supported range');
  }
  return result;
}

/** Same numeric path as convertTemperature without throw (for UI round-trips). */
export function convertTemperatureSafe(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  return convertViaCelsius(value, from, to);
}

export function shareResultText(
  amounts: Record<TemperatureUnit, number>,
): string {
  return [
    'Kelvin Converter',
    'Omega Calculators',
    '',
    `Input: ${formatTemp(amounts.kelvin)} K`,
    '',
    `Celsius: ${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius}`,
    `Fahrenheit: ${formatTemp(amounts.fahrenheit)}${TEMP_SYMBOLS.fahrenheit}`,
    `Rankine: ${formatTemp(amounts.rankine)}${TEMP_SYMBOLS.rankine}`,
    `Delisle: ${formatTemp(amounts.delisle)}${TEMP_SYMBOLS.delisle}`,
    `Newton: ${formatTemp(amounts.newton)}${TEMP_SYMBOLS.newton}`,
    `Réaumur: ${formatTemp(amounts.reaumur)}${TEMP_SYMBOLS.reaumur}`,
    `Rømer: ${formatTemp(amounts.romer)}${TEMP_SYMBOLS.romer}`,
    '',
    `Absolute zero = 0 K = ${ABSOLUTE_ZERO_C}°C = −459.67°F`,
  ].join('\n');
}
