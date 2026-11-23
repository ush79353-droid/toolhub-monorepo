import {
  calculateMitralValveArea,
  lengthToCm,
  MAX_DT_MS,
  MAX_LVOT_CM,
  MAX_PHT_MS,
  MAX_VTI_CM,
  timeToMs,
  vtiToCm,
} from './calculation';
import type {
  MitralValveAreaFieldErrors,
  MitralValveAreaInput,
  MitralValveAreaResult,
} from './types';

export interface MitralValveAreaValidation {
  isValid: boolean;
  errors: MitralValveAreaFieldErrors;
  result: MitralValveAreaResult | null;
}

function parsePositive(raw: string): {
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
  if (!Number.isFinite(value) || value <= 0) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateMitralValveAreaInput(
  input: MitralValveAreaInput
): MitralValveAreaValidation {
  const errors: MitralValveAreaFieldErrors = {};

  if (input.method === 'continuity') {
    const d = parsePositive(input.lvotValue);
    const v1 = parsePositive(input.lvotVtiValue);
    const v2 = parsePositive(input.mitralVtiValue);

    if (d.blank && v1.blank && v2.blank) {
      return { isValid: false, errors, result: null };
    }

    let diameterCm: number | null = null;
    let lvotVtiCm: number | null = null;
    let mitralVtiCm: number | null = null;

    if (d.blank) errors.lvotValue = 'Enter LVOT diameter.';
    else if (d.invalid || d.value == null) {
      errors.lvotValue = 'Enter a valid positive LVOT diameter.';
    } else {
      diameterCm = lengthToCm(d.value, input.lvotUnit);
      if (diameterCm == null || diameterCm > MAX_LVOT_CM) {
        errors.lvotValue = `LVOT diameter must be between 0 and ${MAX_LVOT_CM} cm.`;
        diameterCm = null;
      }
    }

    if (v1.blank) errors.lvotVtiValue = 'Enter LVOT VTI.';
    else if (v1.invalid || v1.value == null) {
      errors.lvotVtiValue = 'Enter a valid positive LVOT VTI.';
    } else {
      lvotVtiCm = vtiToCm(v1.value, input.lvotVtiUnit);
      if (lvotVtiCm == null || lvotVtiCm > MAX_VTI_CM) {
        errors.lvotVtiValue = 'LVOT VTI is out of supported range.';
        lvotVtiCm = null;
      }
    }

    if (v2.blank) errors.mitralVtiValue = 'Enter mitral valve VTI.';
    else if (v2.invalid || v2.value == null) {
      errors.mitralVtiValue = 'Enter a valid positive mitral VTI.';
    } else {
      mitralVtiCm = vtiToCm(v2.value, input.mitralVtiUnit);
      if (mitralVtiCm == null || mitralVtiCm > MAX_VTI_CM) {
        errors.mitralVtiValue = 'Mitral VTI is out of supported range.';
        mitralVtiCm = null;
      }
    }

    if (errors.lvotValue || errors.lvotVtiValue || errors.mitralVtiValue) {
      return { isValid: false, errors, result: null };
    }

    const result = calculateMitralValveArea('continuity', input.areaUnit, {
      diameterCm: diameterCm!,
      lvotVtiCm: lvotVtiCm!,
      mitralVtiCm: mitralVtiCm!,
    });
    if (!result) {
      errors.form = 'Unable to compute mitral valve area.';
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors, result };
  }

  if (input.method === 'pht') {
    const p = parsePositive(input.phtValue);
    if (p.blank) return { isValid: false, errors, result: null };
    if (p.invalid || p.value == null) {
      errors.phtValue = 'Enter a valid positive pressure half-time.';
      return { isValid: false, errors, result: null };
    }
    const phtMs = timeToMs(p.value, input.phtUnit);
    if (phtMs == null || phtMs > MAX_PHT_MS) {
      errors.phtValue = 'Pressure half-time is out of supported range.';
      return { isValid: false, errors, result: null };
    }
    const result = calculateMitralValveArea('pht', input.areaUnit, { phtMs });
    if (!result) {
      errors.form = 'Unable to compute mitral valve area.';
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors, result };
  }

  const d = parsePositive(input.dtValue);
  if (d.blank) return { isValid: false, errors, result: null };
  if (d.invalid || d.value == null) {
    errors.dtValue = 'Enter a valid positive deceleration time.';
    return { isValid: false, errors, result: null };
  }
  const dtMs = timeToMs(d.value, input.dtUnit);
  if (dtMs == null || dtMs > MAX_DT_MS) {
    errors.dtValue = 'Deceleration time is out of supported range.';
    return { isValid: false, errors, result: null };
  }
  const result = calculateMitralValveArea('deceleration', input.areaUnit, {
    dtMs,
  });
  if (!result) {
    errors.form = 'Unable to compute mitral valve area.';
    return { isValid: false, errors, result: null };
  }
  return { isValid: true, errors, result };
}
