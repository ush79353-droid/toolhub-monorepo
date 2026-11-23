import {
  NT_ASSESS_CRL_MAX,
  NT_ASSESS_CRL_MIN,
  calculateNuchalTranslucency,
  crlMmFromGestationalAgeDays,
  gestationalAgeDaysFromCrlMm,
} from './calculation';
import type {
  NuchalTranslucencyFieldErrors,
  NuchalTranslucencyInput,
  NuchalTranslucencyResult,
} from './types';

export interface NuchalTranslucencyValidation {
  isValid: boolean;
  errors: NuchalTranslucencyFieldErrors;
  result: NuchalTranslucencyResult | null;
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

export function validateNuchalTranslucencyInput(
  input: NuchalTranslucencyInput,
): NuchalTranslucencyValidation {
  const errors: NuchalTranslucencyFieldErrors = {};

  const crlParsed = parseNumber(input.crlMm);
  const estGaParsed = parseNumber(input.estimateGaDays);
  const ntParsed = parseNumber(input.measuredNtMm);
  const assessGaParsed = parseNumber(input.assessGaDays);

  const allBlank =
    crlParsed.blank &&
    estGaParsed.blank &&
    ntParsed.blank &&
    assessGaParsed.blank;
  if (allBlank) {
    return { isValid: false, errors, result: null };
  }

  let crlMm: number | null = null;
  if (!crlParsed.blank) {
    if (crlParsed.invalid || crlParsed.value == null || crlParsed.value <= 0) {
      errors.crlMm = 'Enter a valid crown–rump length greater than zero (mm).';
    } else {
      crlMm = crlParsed.value;
    }
  }

  let estimateGaDays: number | null = null;
  if (!estGaParsed.blank) {
    if (
      estGaParsed.invalid ||
      estGaParsed.value == null ||
      estGaParsed.value <= 0
    ) {
      errors.estimateGaDays = 'Enter a valid gestational age in days.';
    } else {
      estimateGaDays = Math.round(estGaParsed.value);
    }
  }

  if (crlMm != null && estimateGaDays == null && input.estimateLastEdit !== 'ga') {
    const ga = gestationalAgeDaysFromCrlMm(crlMm);
    if (ga == null) {
      errors.crlMm = 'CRL is outside the Robinson–Fleming educational range.';
    } else {
      estimateGaDays = ga;
    }
  }

  if (estimateGaDays != null && crlMm == null && input.estimateLastEdit === 'ga') {
    crlMm = crlMmFromGestationalAgeDays(estimateGaDays);
    if (crlMm == null) {
      errors.estimateGaDays = 'Gestational age cannot be converted to CRL.';
    }
  }

  let measuredNtMm: number | null = null;
  if (!ntParsed.blank) {
    if (ntParsed.invalid || ntParsed.value == null || ntParsed.value <= 0) {
      errors.measuredNtMm = 'Enter a valid measured NT greater than zero (mm).';
    } else {
      measuredNtMm = ntParsed.value;
    }
  }

  let assessGaDays: number | null = null;
  if (!assessGaParsed.blank) {
    if (
      assessGaParsed.invalid ||
      assessGaParsed.value == null ||
      assessGaParsed.value <= 0
    ) {
      errors.assessGaDays = 'Enter a valid gestational age in days.';
    } else {
      assessGaDays = Math.round(assessGaParsed.value);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateNuchalTranslucency(input, {
    crlMm,
    estimateGaDays:
      crlMm != null && estimateGaDays == null
        ? gestationalAgeDaysFromCrlMm(crlMm)
        : estimateGaDays,
    measuredNtMm,
    assessGaDays:
      assessGaDays ??
      (input.assessGaMode === 'synced' ? estimateGaDays : null),
  });

  if (
    measuredNtMm != null &&
    (assessGaDays != null || estimateGaDays != null) &&
    !result.assess
  ) {
    const ga = assessGaDays ?? estimateGaDays;
    const crlForAssess =
      crlMm ?? (ga != null ? crlMmFromGestationalAgeDays(ga) : null);
    if (crlForAssess != null && crlForAssess < NT_ASSESS_CRL_MIN) {
      errors.measuredNtMm = `NT centile table applies from about ${NT_ASSESS_CRL_MIN} mm CRL (~${NT_ASSESS_CRL_MIN}–${NT_ASSESS_CRL_MAX} mm window).`;
    } else if (crlForAssess != null && crlForAssess > NT_ASSESS_CRL_MAX) {
      errors.measuredNtMm = `CRL above ${NT_ASSESS_CRL_MAX} mm is outside the educational NT window.`;
    }
  }

  const hasOutput = result.estimate != null || result.assess != null;
  if (!hasOutput && Object.keys(errors).length === 0) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: hasOutput ? result : null };
  }

  return {
    isValid: Boolean(result.assess || result.estimate),
    errors,
    result: hasOutput ? result : null,
  };
}