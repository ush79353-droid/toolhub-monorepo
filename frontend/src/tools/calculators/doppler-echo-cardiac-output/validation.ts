import {
  MAX_HEART_RATE_BPM,
  MAX_LVOT_CM,
  MIN_HEART_RATE_BPM,
  deriveOutputsFromInput,
  lvotDiameterToCm,
  lvotVtiToCm,
  parseNumber,
} from './calculation';
import type {
  DopplerEchoCardiacOutputFieldErrors,
  DopplerEchoCardiacOutputInput,
  DopplerEchoCardiacOutputResult,
} from './types';

export interface DopplerEchoCardiacOutputValidation {
  errors: DopplerEchoCardiacOutputFieldErrors;
  result: DopplerEchoCardiacOutputResult;
}

function parseField(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/**
 * Field errors only for invalid non-blank entries; derivatives update with any
 * sufficient subset (ADR-023 partial results).
 */
export function validateDopplerEchoCardiacOutputInput(
  input: DopplerEchoCardiacOutputInput,
): DopplerEchoCardiacOutputValidation {
  const errors: DopplerEchoCardiacOutputFieldErrors = {};

  const height = parseField(input.heightValue);
  const weight = parseField(input.weightValue);
  const hr = parseField(input.heartRateBpm);
  const vti = parseField(input.lvotVtiValue);
  const diameter = parseField(input.lvotDiameterValue);

  if (!height.blank) {
    if (height.invalid || height.value == null || height.value <= 0) {
      errors.heightValue = 'Enter a positive height.';
    }
  }

  if (!weight.blank) {
    if (weight.invalid || weight.value == null || weight.value <= 0) {
      errors.weightValue = 'Enter a positive weight.';
    }
  }

  if (!hr.blank) {
    if (hr.invalid || hr.value == null || hr.value <= 0) {
      errors.heartRateBpm = 'Enter a positive heart rate.';
    } else if (hr.value < MIN_HEART_RATE_BPM || hr.value > MAX_HEART_RATE_BPM) {
      errors.heartRateBpm = `Heart rate should be between ${MIN_HEART_RATE_BPM} and ${MAX_HEART_RATE_BPM} bpm.`;
    }
  }

  if (!vti.blank) {
    if (vti.invalid || vti.value == null || vti.value <= 0) {
      errors.lvotVtiValue = 'Enter a positive LVOT VTI.';
    } else {
      const cm = lvotVtiToCm(vti.value, input.lvotVtiUnit);
      if (cm == null) {
        errors.lvotVtiValue = 'Enter a valid LVOT VTI.';
      }
    }
  }

  if (!diameter.blank) {
    if (diameter.invalid || diameter.value == null || diameter.value <= 0) {
      errors.lvotDiameterValue = 'Enter a positive LVOT diameter.';
    } else {
      const cm = lvotDiameterToCm(diameter.value, input.lvotDiameterUnit);
      if (cm == null) {
        errors.lvotDiameterValue = 'Enter a valid LVOT diameter.';
      } else if (cm > MAX_LVOT_CM) {
        errors.lvotDiameterValue = `LVOT above ${MAX_LVOT_CM} cm is outside the supported range.`;
      }
    }
  }

  const heightForBsa =
    !height.blank &&
    !errors.heightValue &&
    height.value != null &&
    height.value > 0
      ? height.value
      : null;
  const weightForBsa =
    !weight.blank &&
    !errors.weightValue &&
    weight.value != null &&
    weight.value > 0
      ? weight.value
      : null;

  const hrForCo =
    !hr.blank && !errors.heartRateBpm && hr.value != null && hr.value > 0
      ? hr.value
      : null;
  const vtiForSv =
    !vti.blank && !errors.lvotVtiValue && vti.value != null && vti.value > 0
      ? vti.value
      : null;
  const diamForArea =
    !diameter.blank &&
    !errors.lvotDiameterValue &&
    diameter.value != null &&
    diameter.value > 0
      ? diameter.value
      : null;

  const result = deriveOutputsFromInput(input, {
    height: heightForBsa,
    weight: weightForBsa,
    heartRate: hrForCo,
    lvotVti: vtiForSv,
    lvotDiameter: diamForArea,
  });

  if (heightForBsa != null && weightForBsa != null && result.bsaM2 == null) {
    errors.form = 'Unable to compute body surface area from height and weight.';
  }

  return { errors, result };
}