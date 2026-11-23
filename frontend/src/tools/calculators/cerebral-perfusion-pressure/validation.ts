import {
  approximateMapFromBloodPressure,
  calculateCerebralPerfusionPressure,
  MAX_PRESSURE_MMHG,
  MIN_PRESSURE_MMHG,
} from './calculation';
import type {
  CerebralPerfusionPressureFieldErrors,
  CerebralPerfusionPressureInput,
  CerebralPerfusionPressureResult,
  MapSource,
} from './types';

export interface CerebralPerfusionPressureValidation {
  isValid: boolean;
  errors: CerebralPerfusionPressureFieldErrors;
  result: CerebralPerfusionPressureResult | null;
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

function pressureError(label: string, value: number): string | undefined {
  if (value < MIN_PRESSURE_MMHG || value > MAX_PRESSURE_MMHG) {
    return `${label} must be between ${MIN_PRESSURE_MMHG} and ${MAX_PRESSURE_MMHG} mmHg.`;
  }
  return undefined;
}

/**
 * CPP is inactive until both MAP (measured or calculated) and ICP are valid.
 * Missing ICP alone leaves CPP blank without inventing a value.
 */
export function validateCerebralPerfusionPressureInput(
  input: CerebralPerfusionPressureInput
): CerebralPerfusionPressureValidation {
  const errors: CerebralPerfusionPressureFieldErrors = {};

  let mapMmHg: number | null = null;
  let mapSource: MapSource = 'measured';

  if (input.calculateMap) {
    mapSource = 'calculated';
    const sbp = parseNumber(input.sbpMmHg);
    const dbp = parseNumber(input.dbpMmHg);

    if (sbp.blank && dbp.blank) {
      // Waiting for pressures — not an error yet.
    } else {
      if (sbp.blank || sbp.invalid || sbp.value === null) {
        errors.sbpMmHg = 'Enter a valid systolic pressure.';
      } else {
        const bound = pressureError('SBP', sbp.value);
        if (bound) errors.sbpMmHg = bound;
      }

      if (dbp.blank || dbp.invalid || dbp.value === null) {
        errors.dbpMmHg = 'Enter a valid diastolic pressure.';
      } else {
        const bound = pressureError('DBP', dbp.value);
        if (bound) errors.dbpMmHg = bound;
      }

      if (
        !errors.sbpMmHg &&
        !errors.dbpMmHg &&
        sbp.value != null &&
        dbp.value != null
      ) {
        if (sbp.value < dbp.value) {
          errors.form = 'Systolic pressure must be greater than or equal to diastolic pressure.';
        } else {
          mapMmHg = approximateMapFromBloodPressure(sbp.value, dbp.value);
          if (mapMmHg == null) {
            errors.form = 'Unable to calculate MAP from the entered pressures.';
          }
        }
      }
    }
  } else {
    const map = parseNumber(input.mapMmHg);
    if (!map.blank) {
      if (map.invalid || map.value === null) {
        errors.mapMmHg = 'Enter a valid mean arterial pressure.';
      } else {
        const bound = pressureError('MAP', map.value);
        if (bound) errors.mapMmHg = bound;
        else mapMmHg = map.value;
      }
    }
  }

  const icp = parseNumber(input.icpMmHg);
  let icpMmHg: number | null = null;
  if (!icp.blank) {
    if (icp.invalid || icp.value === null) {
      errors.icpMmHg = 'Enter a valid intracranial pressure.';
    } else {
      const bound = pressureError('ICP', icp.value);
      if (bound) errors.icpMmHg = bound;
      else icpMmHg = icp.value;
    }
  }

  const hasFieldErrors = Boolean(
    errors.form ||
      errors.mapMmHg ||
      errors.sbpMmHg ||
      errors.dbpMmHg ||
      errors.icpMmHg
  );

  if (hasFieldErrors || mapMmHg == null || icpMmHg == null) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateCerebralPerfusionPressure({
      ageGroup: input.ageGroup,
      mapMmHg,
      icpMmHg,
      mapSource,
    }),
  };
}
