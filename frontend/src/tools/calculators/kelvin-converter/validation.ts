import { celsiusFromUnit as sharedCelsiusFromUnit } from '../celsius-converter/validation';
import type { TemperatureUnit } from './types';

export {
  isIncompleteNumber,
  parseOptionalNumber,
  parseTempInput,
} from '../celsius-converter/validation';

/** Kelvin-branded absolute-zero message while reusing the shared Celsius check. */
export function celsiusFromUnit(
  value: number,
  unit: TemperatureUnit,
): { ok: true; celsius: number } | { ok: false; error: string } {
  const result = sharedCelsiusFromUnit(value, unit);
  if (!result.ok && result.error.includes('absolute zero')) {
    return { ok: false, error: 'Temperature cannot be below absolute zero (0 K).' };
  }
  return result;
}
