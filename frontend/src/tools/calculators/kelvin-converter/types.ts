export type {
  TemperatureUnit,
  CelsiusFieldErrors as KelvinFieldErrors,
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

/** Other scales under the “Other temperature units” accordion (Kelvin is primary). */
export const OTHER_UNITS: readonly TemperatureUnit[] = [
  'celsius',
  'fahrenheit',
  'rankine',
  'delisle',
  'newton',
  'reaumur',
  'romer',
];

/** Absolute zero on the Kelvin scale. */
export const ABSOLUTE_ZERO_K = 0;
