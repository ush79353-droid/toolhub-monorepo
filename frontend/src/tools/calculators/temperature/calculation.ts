import { formatAngle } from '../coordinates/calculation';
import {
  TEMPERATURE_UNITS,
  TEMP_SYMBOLS,
  type TemperatureUnit,
} from './types';

export interface TemperatureScale {
  label: string;
  symbol: string;
  toKelvin: (value: number) => number;
  fromKelvin: (value: number) => number;
}

export const temperatureScales: Record<TemperatureUnit, TemperatureScale> = {
  celsius: {
    label: 'Celsius',
    symbol: '°C',
    toKelvin: (value) => value + 273.15,
    fromKelvin: (value) => value - 273.15,
  },
  fahrenheit: {
    label: 'Fahrenheit',
    symbol: '°F',
    toKelvin: (value) => ((value - 32) * 5) / 9 + 273.15,
    fromKelvin: (value) => ((value - 273.15) * 9) / 5 + 32,
  },
  kelvin: {
    label: 'Kelvin',
    symbol: 'K',
    toKelvin: (value) => value,
    fromKelvin: (value) => value,
  },
  rankine: {
    label: 'Rankine',
    symbol: '°R',
    toKelvin: (value) => (value * 5) / 9,
    fromKelvin: (value) => (value * 9) / 5,
  },
  reaumur: {
    label: 'Réaumur',
    symbol: '°Ré',
    toKelvin: (value) => (value * 5) / 4 + 273.15,
    fromKelvin: (value) => ((value - 273.15) * 4) / 5,
  },
  romer: {
    label: 'Rømer',
    symbol: '°Rø',
    toKelvin: (value) => ((value - 7.5) * 40) / 21 + 273.15,
    fromKelvin: (value) => ((value - 273.15) * 21) / 40 + 7.5,
  },
  delisle: {
    label: 'Delisle',
    symbol: '°De',
    // De = (100 − C) × 3/2  →  C = 100 − De × 2/3
    toKelvin: (value) => 100 - (value * 2) / 3 + 273.15,
    fromKelvin: (value) => ((100 - (value - 273.15)) * 3) / 2,
  },
  newton: {
    label: 'Newton',
    symbol: '°N',
    toKelvin: (value) => (value * 100) / 33 + 273.15,
    fromKelvin: (value) => ((value - 273.15) * 33) / 100,
  },
};

export function formatTemp(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  const kelvin = temperatureScales[from].toKelvin(value);
  return temperatureScales[to].fromKelvin(kelvin);
}

export function allFromUnit(
  value: number,
  from: TemperatureUnit,
): Record<TemperatureUnit, number> {
  const kelvin = temperatureScales[from].toKelvin(value);
  const out = {} as Record<TemperatureUnit, number>;
  for (const unit of TEMPERATURE_UNITS) {
    out[unit] = temperatureScales[unit].fromKelvin(kelvin);
  }
  return out;
}

export function shareResultText(amounts: Record<TemperatureUnit, number>): string {
  return [
    'Temperature Conversion | Omega Calculators',
    '',
    `${formatTemp(amounts.celsius)} ${TEMP_SYMBOLS.celsius}`,
    `${formatTemp(amounts.fahrenheit)} ${TEMP_SYMBOLS.fahrenheit}`,
    `${formatTemp(amounts.kelvin)} ${TEMP_SYMBOLS.kelvin}`,
    `${formatTemp(amounts.rankine)} ${TEMP_SYMBOLS.rankine}`,
    `${formatTemp(amounts.reaumur)} ${TEMP_SYMBOLS.reaumur}`,
    `${formatTemp(amounts.romer)} ${TEMP_SYMBOLS.romer}`,
    `${formatTemp(amounts.delisle)} ${TEMP_SYMBOLS.delisle}`,
    `${formatTemp(amounts.newton)} ${TEMP_SYMBOLS.newton}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
