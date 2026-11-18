export const TEMPERATURE_UNITS = [
  'celsius',
  'fahrenheit',
  'kelvin',
  'rankine',
  'reaumur',
  'romer',
  'delisle',
  'newton',
] as const;

export type TemperatureUnit = (typeof TEMPERATURE_UNITS)[number];

export const PRIMARY_UNITS: readonly TemperatureUnit[] = [
  'celsius',
  'fahrenheit',
  'kelvin',
];

export const EXTRA_UNITS: readonly TemperatureUnit[] = [
  'rankine',
  'reaumur',
  'romer',
  'delisle',
  'newton',
];

export const TEMP_LABELS: Record<TemperatureUnit, string> = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin',
  rankine: 'Rankine',
  reaumur: 'Réaumur',
  romer: 'Rømer',
  delisle: 'Delisle',
  newton: 'Newton',
};

export const TEMP_SYMBOLS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
  rankine: '°R',
  reaumur: '°Ré',
  romer: '°Rø',
  delisle: '°De',
  newton: '°N',
};

export type TemperatureFieldErrors = Partial<Record<TemperatureUnit, string>>;

/** Floating-point tolerance at absolute-zero boundaries (kelvin). */
export const ABS_ZERO_EPS = 1e-9;

export const MAX_ABS_KELVIN = 1e12;
