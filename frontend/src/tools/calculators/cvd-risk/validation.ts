import { calculateCvdRisk, cholToMgDl } from './calculation';
import type {
  CvdRiskFieldErrors,
  CvdRiskInput,
  CvdRiskResult,
} from './types';

export interface CvdRiskValidation {
  isValid: boolean;
  errors: CvdRiskFieldErrors;
  result: CvdRiskResult | null;
  incomplete: boolean;
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

export function validateCvdRiskInput(input: CvdRiskInput): CvdRiskValidation {
  const errors: CvdRiskFieldErrors = {};
  const incomplete =
    input.sex == null ||
    input.ageYears.trim() === '' ||
    input.hdl.trim() === '' ||
    input.totalChol.trim() === '' ||
    input.sbpMmHg.trim() === '';

  if (input.sex == null && !incomplete) {
    errors.sex = 'Select sex.';
  }

  const age = parsePositive(input.ageYears);
  if (!age.blank) {
    if (age.invalid || age.value == null) {
      errors.ageYears = 'Enter a valid age in years.';
    } else if (age.value < 30 || age.value > 74) {
      errors.ageYears =
        'Framingham general CVD lipid model applies to ages 30–74.';
    }
  }

  const hdl = parsePositive(input.hdl);
  if (!hdl.blank) {
    if (hdl.invalid || hdl.value == null) {
      errors.hdl = 'Enter a valid HDL cholesterol.';
    } else {
      const mg = cholToMgDl(hdl.value, input.hdlUnit);
      if (mg < 10 || mg > 150) {
        errors.hdl = 'HDL is outside the supported range.';
      }
    }
  }

  const tc = parsePositive(input.totalChol);
  if (!tc.blank) {
    if (tc.invalid || tc.value == null) {
      errors.totalChol = 'Enter a valid total cholesterol.';
    } else {
      const mg = cholToMgDl(tc.value, input.totalCholUnit);
      if (mg < 50 || mg > 500) {
        errors.totalChol = 'Total cholesterol is outside the supported range.';
      }
    }
  }

  const sbp = parsePositive(input.sbpMmHg);
  if (!sbp.blank) {
    if (sbp.invalid || sbp.value == null) {
      errors.sbpMmHg = 'Enter a valid systolic blood pressure.';
    } else if (sbp.value < 70 || sbp.value > 250) {
      errors.sbpMmHg = 'Systolic BP is outside the supported range.';
    }
  }

  const hasHardError = Boolean(
    errors.sex ||
      errors.ageYears ||
      errors.hdl ||
      errors.totalChol ||
      errors.sbpMmHg
  );

  if (incomplete || hasHardError) {
    return {
      isValid: false,
      errors,
      result: null,
      incomplete,
    };
  }

  const result = calculateCvdRisk(input);
  if (!result) {
    errors.form = 'Unable to compute 10-year CVD risk from these inputs.';
    return { isValid: false, errors, result: null, incomplete: false };
  }

  return { isValid: true, errors, result, incomplete: false };
}
