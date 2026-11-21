import {
  TEMPERATURE_UNITS,
  TEMP_SYMBOLS,
  type TemperatureUnit,
} from './types';

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

export function toCelsius(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return value;
    case 'fahrenheit':
      return (value - 32) * (5 / 9);
    case 'kelvin':
      return value - 273.15;
    case 'rankine':
      return value * (5 / 9) - 273.15;
    case 'delisle':
      return 100 - value * (2 / 3);
    case 'newton':
      return value * (100 / 33);
    case 'reaumur':
      return value * (5 / 4);
    case 'romer':
      return (value - 7.5) * (40 / 21);
  }
}

export function fromCelsius(celsius: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return celsius * (9 / 5) + 32;
    case 'kelvin':
      return celsius + 273.15;
    case 'rankine':
      return (celsius + 273.15) * (9 / 5);
    case 'delisle':
      return (100 - celsius) * (3 / 2);
    case 'newton':
      return celsius * (33 / 100);
    case 'reaumur':
      return celsius * (4 / 5);
    case 'romer':
      return celsius * (21 / 40) + 7.5;
  }
}

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  if (from === to) return value;
  return fromCelsius(toCelsius(value, from), to);
}

export function allFromCelsius(celsius: number): Record<TemperatureUnit, number> {
  const out = {} as Record<TemperatureUnit, number>;
  for (const unit of TEMPERATURE_UNITS) {
    out[unit] = fromCelsius(celsius, unit);
  }
  return out;
}

export function shareResultText(amounts: Record<TemperatureUnit, number>): string {
  return [
    'Celsius Converter | Omega Calculators',
    '',
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.fahrenheit)}${TEMP_SYMBOLS.fahrenheit}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.kelvin)} ${TEMP_SYMBOLS.kelvin}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.rankine)}${TEMP_SYMBOLS.rankine}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.delisle)}${TEMP_SYMBOLS.delisle}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.newton)}${TEMP_SYMBOLS.newton}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.reaumur)}${TEMP_SYMBOLS.reaumur}`,
    `${formatTemp(amounts.celsius)}${TEMP_SYMBOLS.celsius} = ${formatTemp(amounts.romer)}${TEMP_SYMBOLS.romer}`,
  ].join('\n');
}
