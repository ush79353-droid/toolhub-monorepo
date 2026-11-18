export type {
  TemperatureUnit,
  CelsiusFieldErrors as FahrenheitFieldErrors,
} from '../celsius-converter/types';

export {
  ABSOLUTE_ZERO_C,
  ABS_ZERO_EPS,
  MAX_ABS_CELSIUS,
  TEMPERATURE_UNITS,
  TEMP_LABELS,
  TEMP_SYMBOLS,
} from '../celsius-converter/types';

import type { TemperatureUnit } from '../celsius-converter/types';

/** Other scales under the “Other temperatures” accordion (Fahrenheit is primary). */
export const OTHER_UNITS: readonly TemperatureUnit[] = [
  'celsius',
  'kelvin',
  'rankine',
  'delisle',
  'newton',
  'reaumur',
  'romer',
];

/** Absolute zero on the Fahrenheit scale (−459.67°F). */
export const ABSOLUTE_ZERO_F = -459.67;
