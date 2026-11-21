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

/** Kelvin-normalized path: K = °C + 273.15 (reuses shared Celsius formulas). */
export function toKelvin(value: number, unit: TemperatureUnit): number {
  return toCelsius(value, unit) + 273.15;
}

export function fromKelvin(kelvin: number, unit: TemperatureUnit): number {
  return fromCelsius(kelvin - 273.15, unit);
}

/**
 * Convert between temperature scales via Kelvin/Celsius.
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
    throw new Error('Temperature cannot be below absolute zero');
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
    'Fahrenheit Converter | Omega Calculators',
    '',
    `${formatTemp(amounts.fahrenheit)}${TEMP_SYMBOLS.fahrenheit} equals:`,
    '',
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius}`,
    `${formatTemp(amounts.kelvin)} ${TEMP_SYMBOLS.kelvin}`,
    `${formatTemp(amounts.rankine)}${TEMP_SYMBOLS.rankine}`,
    `${formatTemp(amounts.delisle)}${TEMP_SYMBOLS.delisle}`,
    `${formatTemp(amounts.newton)}${TEMP_SYMBOLS.newton}`,
    `${formatTemp(amounts.reaumur)}${TEMP_SYMBOLS.reaumur}`,
    `${formatTemp(amounts.romer)}${TEMP_SYMBOLS.romer}`,
    '',
    `Absolute zero = −459.67°F = ${ABSOLUTE_ZERO_C}°C = 0 K`,
  ].join('\n');
}
