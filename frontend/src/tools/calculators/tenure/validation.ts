import {
  calculateAverageTenure,
  calculateSpecificTenure,
  parseIsoDate,
} from './calculation';
import type {
  TenureDraft,
  TenureFieldErrors,
  TenureResult,
} from './types';

export interface TenureValidation {
  incomplete: boolean;
  errors: TenureFieldErrors;
  result: TenureResult;
}

function parsePositiveNumber(raw: string, label: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^\+?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, error: `${label} must be a non-negative number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value, blank: false };
}

export function validateTenureDraft(draft: TenureDraft): TenureValidation {
  const errors: TenureFieldErrors = {};
  const employees = parsePositiveNumber(draft.employeeCount, 'Total number of employees');
  const combined = parsePositiveNumber(draft.combinedDuration, 'Combined duration of service');

  if (!employees.blank && employees.error) errors.employeeCount = employees.error;
  if (!combined.blank && combined.error) errors.combinedDuration = combined.error;

  if (!employees.blank && employees.value !== null && employees.value <= 0) {
    errors.employeeCount = 'Total number of employees must be greater than zero.';
  }

  const startRaw = draft.startDate.trim();
  const endRaw = draft.endDate.trim();
  const startBlank = startRaw === '';
  const endBlank = endRaw === '';

  let startOk = false;
  let endOk = false;

  if (!startBlank) {
    if (!parseIsoDate(startRaw)) {
      errors.startDate = 'Enter a valid starting date.';
    } else {
      startOk = true;
    }
  }
  if (!endBlank) {
    if (!parseIsoDate(endRaw)) {
      errors.endDate = 'Enter a valid ending date.';
    } else {
      endOk = true;
    }
  }

  if (startOk && endOk) {
    const start = parseIsoDate(startRaw)!;
    const end = parseIsoDate(endRaw)!;
    const earlier =
      end.year < start.year ||
      (end.year === start.year && end.month < start.month) ||
      (end.year === start.year && end.month === start.month && end.day < start.day);
    if (earlier) {
      errors.endDate = 'Ending date cannot be earlier than starting date.';
    }
  }

  const averageReady =
    !employees.blank &&
    !combined.blank &&
    !errors.employeeCount &&
    !errors.combinedDuration &&
    employees.value !== null &&
    combined.value !== null;

  const specificReady =
    startOk && endOk && !errors.startDate && !errors.endDate;

  const average = averageReady
    ? calculateAverageTenure(employees.value!, combined.value!, draft.combinedUnit)
    : null;

  if (averageReady && !average) {
    errors.form = 'Average tenure could not be calculated for these values.';
  }

  const specific = specificReady
    ? calculateSpecificTenure(startRaw, endRaw)
    : null;

  if (specificReady && !specific) {
    errors.form = errors.form
      ? `${errors.form} Specific duration could not be calculated.`
      : 'Specific duration could not be calculated for these dates.';
  }

  const averageIncomplete = employees.blank || combined.blank;
  const specificIncomplete = startBlank || endBlank;
  const incomplete =
    (averageIncomplete && specificIncomplete) ||
    (averageIncomplete && !specificReady) ||
    (specificIncomplete && !averageReady);

  return {
    incomplete: Boolean(incomplete) && Object.keys(errors).length === 0,
    errors,
    result: {
      average: averageReady && average ? average : null,
      specific: specificReady && specific ? specific : null,
    },
  };
}
