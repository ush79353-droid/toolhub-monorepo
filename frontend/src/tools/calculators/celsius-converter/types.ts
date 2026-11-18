export const TEMPERATURE_UNITS = [
  'celsius',
  'fahrenheit',
  'kelvin',
  'rankine',
  'delisle',
  'newton',
  'reaumur',
  'romer',
] as const;

export type TemperatureUnit = (typeof TEMPERATURE_UNITS)[number];

/** Other scales shown under the “Other temperature units” section. */
export const OTHER_UNITS: readonly TemperatureUnit[] = [
  'fahrenheit',
  'kelvin',
  'rankine',
  'delisle',
  'newton',
  'reaumur',
  'romer',
];

export const TEMP_LABELS: Record<TemperatureUnit, string> = {
  celsius: 'Temperature in Celsius',
  fahrenheit: 'Temperature in Fahrenheit',
  kelvin: 'Temperature in Kelvin',
  rankine: 'Temperature in Rankine',
  delisle: 'Temperature in Delisle',
  newton: 'Temperature in Newton',
  reaumur: 'Temperature in Réaumur',
  romer: 'Temperature in Rømer',
};

export const TEMP_SYMBOLS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
  rankine: '°R',
  delisle: '°De',
  newton: '°N',
  reaumur: '°Ré',
  romer: '°Rø',
};

export type CelsiusFieldErrors = Partial<Record<TemperatureUnit, string>>;

/** Floating-point tolerance at absolute-zero boundaries (°C). */
export const ABS_ZERO_EPS = 1e-9;

export const ABSOLUTE_ZERO_C = -273.15;

export const MAX_ABS_CELSIUS = 1e12;
