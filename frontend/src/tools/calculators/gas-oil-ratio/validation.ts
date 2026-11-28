import { calculateGasOilFromInput } from './calculation';
import type { GasOilFieldErrors, GasOilInput, GasOilResult } from './types';

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

export interface GasOilValidation {
  isValid: boolean;
  errors: GasOilFieldErrors;
  result: GasOilResult | null;
}

export function collectFieldErrors(input: GasOilInput): GasOilFieldErrors {
  const errors: GasOilFieldErrors = {};

  if (input.mode !== 'calculateRatio') {
    const r = parseNumber(input.ratio);
    if (!r.blank) {
      if (r.invalid || r.value == null) {
        errors.ratio = 'Please enter a valid gas-to-oil ratio.';
      } else if (!(r.value > 0)) {
        errors.ratio = 'Ratio must be greater than zero (e.g. 50 for 50:1).';
      }
    }
  }

  if (input.mode === 'calculateOil' || input.mode === 'calculateRatio') {
    const g = parseNumber(input.gasVolume);
    if (!g.blank) {
      if (g.invalid || g.value == null) {
        errors.gasVolume = 'Please enter a valid gasoline volume.';
      } else if (g.value < 0) {
        errors.gasVolume = 'Gasoline volume cannot be negative.';
      }
    }
  }

  if (input.mode === 'calculateGas' || input.mode === 'calculateRatio') {
    const o = parseNumber(input.oilVolume);
    if (!o.blank) {
      if (o.invalid || o.value == null) {
        errors.oilVolume = 'Please enter a valid oil volume.';
      } else if (o.value < 0) {
        errors.oilVolume = 'Oil volume cannot be negative.';
      } else if (input.mode === 'calculateRatio' && !(o.value > 0)) {
        errors.oilVolume = 'Oil volume must be greater than zero to find a ratio.';
      }
    }
  }

  if (input.mode === 'calculateTotalMixture') {
    const t = parseNumber(input.totalMixtureVolume);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.totalMixtureVolume =
          'Please enter a valid total mixture volume.';
      } else if (t.value < 0) {
        errors.totalMixtureVolume =
          'Total mixture volume cannot be negative.';
      }
    }
  }

  return errors;
}

export function validateGasOilInputs(input: GasOilInput): GasOilValidation {
  const errors = collectFieldErrors(input);

  const needsRatio = input.mode !== 'calculateRatio';
  const ratioBlank = needsRatio && parseNumber(input.ratio).blank;
  const gasBlank =
    (input.mode === 'calculateOil' || input.mode === 'calculateRatio') &&
    parseNumber(input.gasVolume).blank;
  const oilBlank =
    (input.mode === 'calculateGas' || input.mode === 'calculateRatio') &&
    parseNumber(input.oilVolume).blank;
  const totalBlank =
    input.mode === 'calculateTotalMixture' &&
    parseNumber(input.totalMixtureVolume).blank;

  if (ratioBlank || gasBlank || oilBlank || totalBlank) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateGasOilFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
