import {
  calculateDartRate,
  solveEstimatedIncidents,
  solveHoursWorked,
  toDartRateResult,
} from './calculation';
import type {
  DartRateFieldErrors,
  DartRateInput,
  DartRateResult,
} from './types';

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

function parseIncidents(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } | { ok: true; value: null } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  if (!/^-?\d+$/.test(cleaned)) {
    if (/[.]/.test(cleaned)) {
      return { ok: false, error: 'DART incidents must be a whole number.' };
    }
    return { ok: false, error: 'Enter a whole number of DART incidents.' };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return { ok: false, error: 'DART incident count is too large.' };
  }
  if (value < 0) {
    return { ok: false, error: 'DART incidents cannot be negative.' };
  }
  return { ok: true, value };
}

export function validateDartRateInput(input: DartRateInput): {
  isValid: boolean;
  errors: DartRateFieldErrors;
  result: DartRateResult | null;
} {
  const errors: DartRateFieldErrors = {};
  const incidentsParsed = parseIncidents(input.incidents);
  const hours = parseNumber(input.hoursWorked);
  const rate = parseNumber(input.dartRate);

  if (!incidentsParsed.ok) {
    errors.incidents = incidentsParsed.error;
  }
  const incidents = incidentsParsed.ok ? incidentsParsed.value : null;

  if (input.hoursWorked.trim() !== '') {
    if (hours === null) {
      errors.hoursWorked = 'Enter a valid number of hours worked.';
    } else if (hours < 0) {
      errors.hoursWorked = 'Total hours worked cannot be negative.';
    } else if (!(hours > 0) && input.driver !== 'hoursWorked') {
      errors.hoursWorked = 'Total hours worked must be greater than zero.';
    }
  }

  if (input.dartRate.trim() !== '') {
    if (rate === null) {
      errors.dartRate = 'Enter a valid DART rate.';
    } else if (rate < 0) {
      errors.dartRate = 'DART rate cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const driver = input.driver;

  if (driver === 'dartRate') {
    // Solve estimated incidents from rate + hours
    if (rate === null) {
      return {
        isValid: false,
        errors: { dartRate: 'Enter a DART rate.' },
        result: null,
      };
    }
    if (hours === null || !(hours > 0)) {
      return {
        isValid: false,
        errors: {
          hoursWorked:
            hours !== null && hours === 0
              ? 'Total hours worked must be greater than zero.'
              : 'Enter total hours worked.',
        },
        result: null,
      };
    }
    const breakdown = solveEstimatedIncidents(rate, hours);
    if (!breakdown) {
      return {
        isValid: false,
        errors: { form: 'Unable to estimate DART cases with the current inputs.' },
        result: null,
      };
    }
    return {
      isValid: true,
      errors: {},
      result: toDartRateResult(breakdown),
    };
  }

  if (driver === 'hoursWorked') {
    // Solve hours from incidents + rate
    if (incidents === null) {
      return {
        isValid: false,
        errors: { incidents: 'Enter total DART incidents.' },
        result: null,
      };
    }
    if (rate === null || !(rate > 0)) {
      return {
        isValid: false,
        errors: {
          dartRate:
            rate !== null && rate === 0
              ? 'DART rate must be greater than zero to solve hours worked.'
              : 'Enter a DART rate greater than zero.',
        },
        result: null,
      };
    }
    if (incidents === 0) {
      return {
        isValid: false,
        errors: {
          form: 'Hours cannot be uniquely determined when both incidents and rate would imply zero cases.',
        },
        result: null,
      };
    }
    const breakdown = solveHoursWorked(incidents, rate);
    if (!breakdown) {
      return {
        isValid: false,
        errors: { form: 'Unable to solve hours worked with the current inputs.' },
        result: null,
      };
    }
    return {
      isValid: true,
      errors: {},
      result: toDartRateResult(breakdown),
    };
  }

  // Forward: incidents + hours → rate (default)
  if (incidents === null && hours === null) {
    return { isValid: false, errors: {}, result: null };
  }
  if (incidents === null) {
    return {
      isValid: false,
      errors: { incidents: 'Enter total DART incidents.' },
      result: null,
    };
  }
  if (hours === null) {
    return {
      isValid: false,
      errors: { hoursWorked: 'Enter total hours worked.' },
      result: null,
    };
  }
  if (!(hours > 0)) {
    return {
      isValid: false,
      errors: { hoursWorked: 'Total hours worked must be greater than zero.' },
      result: null,
    };
  }

  const breakdown = calculateDartRate(incidents, hours);
  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate a finite DART rate.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toDartRateResult(breakdown),
  };
}
