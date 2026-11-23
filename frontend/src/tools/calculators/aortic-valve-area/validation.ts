import {
  calculateAorticValveArea,
  lengthToCm,
  MAX_LVOT_CM,
  MAX_VTI_CM,
  vtiToCm,
} from './calculation';
import type {
  AorticValveAreaFieldErrors,
  AorticValveAreaInput,
  AorticValveAreaResult,
} from './types';

export interface AorticValveAreaValidation {
  isValid: boolean;
  errors: AorticValveAreaFieldErrors;
  result: AorticValveAreaResult | null;
}

function parseNumber(raw: string): {
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
 * AVA stays blank until all three inputs are valid and positive.
 * Zero or negative VTI₂ is rejected (division by zero / non-physical).
 */
export function validateAorticValveAreaInput(
  input: AorticValveAreaInput
): AorticValveAreaValidation {
  const errors: AorticValveAreaFieldErrors = {};
  const lvot = parseNumber(input.lvotValue);
  const vti1 = parseNumber(input.vti1Value);
  const vti2 = parseNumber(input.vti2Value);

  if (lvot.blank && vti1.blank && vti2.blank) {
    return { isValid: false, errors, result: null };
  }

  let incomplete = false;

  if (lvot.blank) {
    incomplete = true;
  } else if (lvot.invalid || lvot.value === null || lvot.value <= 0) {
    errors.lvotValue = 'Enter a positive LVOT diameter.';
  } else {
    const cm = lengthToCm(lvot.value, input.lvotUnit);
    if (cm == null) {
      errors.lvotValue = 'Enter a valid LVOT diameter.';
    } else if (cm > MAX_LVOT_CM) {
      errors.lvotValue = `LVOT above ${MAX_LVOT_CM} cm is outside the supported range.`;
    }
  }

  if (vti1.blank) {
    incomplete = true;
  } else if (vti1.invalid || vti1.value === null || vti1.value <= 0) {
    errors.vti1Value = 'Enter a positive VTI₁ (LVOT).';
  } else {
    const cm = vtiToCm(vti1.value, input.vti1Unit);
    if (cm == null) {
      errors.vti1Value = 'Enter a valid VTI₁.';
    } else if (cm > MAX_VTI_CM) {
      errors.vti1Value = `VTI₁ above ${MAX_VTI_CM} cm is outside the supported range.`;
    }
  }

  if (vti2.blank) {
    incomplete = true;
  } else if (vti2.invalid || vti2.value === null || vti2.value <= 0) {
    errors.vti2Value = 'Enter a positive VTI₂ (transaortic jet).';
  } else {
    const cm = vtiToCm(vti2.value, input.vti2Unit);
    if (cm == null) {
      errors.vti2Value = 'Enter a valid VTI₂.';
    } else if (cm > MAX_VTI_CM) {
      errors.vti2Value = `VTI₂ above ${MAX_VTI_CM} cm is outside the supported range.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (incomplete || lvot.value == null || vti1.value == null || vti2.value == null) {
    return { isValid: false, errors, result: null };
  }

  const lvotCm = lengthToCm(lvot.value, input.lvotUnit);
  const vtiLvotCm = vtiToCm(vti1.value, input.vti1Unit);
  const vtiAvCm = vtiToCm(vti2.value, input.vti2Unit);
  if (lvotCm == null || vtiLvotCm == null || vtiAvCm == null) {
    errors.form = 'Enter valid positive measurements.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateAorticValveArea(
    lvotCm,
    vtiLvotCm,
    vtiAvCm,
    input.avaUnit
  );
  if (result == null) {
    errors.form = 'Unable to compute AVA from these values.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
