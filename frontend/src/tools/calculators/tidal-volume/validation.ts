import { calculateTidalVolume, heightToCm, MAX_HEIGHT_CM, MIN_HEIGHT_CM } from './calculation';
import type {
  TidalVolumeFieldErrors,
  TidalVolumeInput,
  TidalVolumeResult,
} from './types';

export interface TidalVolumeValidation {
  errors: TidalVolumeFieldErrors;
  result: TidalVolumeResult | null;
}

export function validateTidalVolumeInput(
  input: TidalVolumeInput,
): TidalVolumeValidation {
  const errors: TidalVolumeFieldErrors = {};

  if (input.height != null) {
    if (!Number.isFinite(input.height)) {
      errors.height = 'Enter a valid height.';
    } else {
      const cm = heightToCm(input.height, input.heightUnit);
      if (cm < MIN_HEIGHT_CM || cm > MAX_HEIGHT_CM) {
        errors.height = `Height must be between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm (or equivalent).`;
      }
    }
  }

  if (errors.height) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateTidalVolume(input) };
}
