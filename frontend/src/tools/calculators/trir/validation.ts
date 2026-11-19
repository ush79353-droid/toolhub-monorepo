import {
  calculateTRIR,
  solveEstimatedInjuries,
  solveHoursWorked,
  toTrirResult,
} from './calculation';
import type { TrirFieldErrors, TrirInput, TrirResult } from './types';

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

function parseInjuries(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } | { ok: true; value: null } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  if (!/^-?\d+$/.test(cleaned)) {
    if (/[.]/.test(cleaned)) {
      return { ok: false, error: 'Recordable incidents must be a whole number.' };
    }
    return { ok: false, error: 'Enter a whole number of recordable incidents.' };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return { ok: false, error: 'Incident count is too large.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Recordable incidents cannot be negative.' };
  }
  return { ok: true, value };
}

export function validateTrirInput(input: TrirInput): {
  isValid: boolean;
  errors: TrirFieldErrors;
  result: TrirResult | null;
} {
  const errors: TrirFieldErrors = {};
  const injuriesParsed = parseInjuries(input.injuries);
  const hours = parseNumber(input.hoursWorked);
  const rate = parseNumber(input.trir);

  if (!injuriesParsed.ok) {
    errors.injuries = injuriesParsed.error;
  }
  const injuries = injuriesParsed.ok ? injuriesParsed.value : null;

  if (input.hoursWorked.trim() !== '') {
    if (hours === null) {
      errors.hoursWorked = 'Enter a valid number of hours worked.';
    } else if (hours < 0) {
      errors.hoursWorked = 'Total hours worked cannot be negative.';
    } else if (!(hours > 0) && input.driver !== 'hoursWorked') {
      errors.hoursWorked =
        'Hours worked must be greater than zero to calculate TRIR.';
    }
  }

  if (input.trir.trim() !== '') {
    if (rate === null) {
      errors.trir = 'Enter a valid TRIR.';
    } else if (rate < 0) {
      errors.trir = 'TRIR cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const driver = input.driver;

  if (driver === 'trir') {
    if (rate === null) {
      return {
        isValid: false,
        errors: { trir: 'Enter a TRIR value.' },
        result: null,
      };
    }
    if (hours === null || !(hours > 0)) {
      return {
        isValid: false,
        errors: {
          hoursWorked:
            hours !== null && hours === 0
              ? 'Hours worked must be greater than zero to calculate TRIR.'
              : 'Enter total hours worked.',
        },
        result: null,
      };
    }
    const breakdown = solveEstimatedInjuries(rate, hours);
    if (!breakdown) {
      return {
        isValid: false,
        errors: { form: 'Unable to estimate recordable cases with the current inputs.' },
        result: null,
      };
    }
    return { isValid: true, errors: {}, result: toTrirResult(breakdown) };
  }

  if (driver === 'hoursWorked') {
    if (injuries === null) {
      return {
        isValid: false,
        errors: { injuries: 'Enter the number of recordable injuries.' },
        result: null,
      };
    }
    if (rate === null || !(rate > 0)) {
      return {
        isValid: false,
        errors: {
          trir:
            rate !== null && rate === 0
              ? 'TRIR must be greater than zero to solve hours worked.'
              : 'Enter a TRIR greater than zero.',
        },
        result: null,
      };
    }
    if (injuries === 0) {
      return {
        isValid: false,
        errors: {
          form: 'Hours cannot be uniquely determined when both injuries and rate would imply zero cases.',
        },
        result: null,
      };
    }
    const breakdown = solveHoursWorked(injuries, rate);
    if (!breakdown) {
      return {
        isValid: false,
        errors: { form: 'Unable to solve hours worked with the current inputs.' },
        result: null,
      };
    }
    return { isValid: true, errors: {}, result: toTrirResult(breakdown) };
  }

  // Forward: injuries + hours → TRIR
  if (injuries === null && hours === null) {
    return { isValid: false, errors: {}, result: null };
  }
  if (injuries === null) {
    return {
      isValid: false,
      errors: { injuries: 'Enter the number of recordable injuries.' },
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
      errors: {
        hoursWorked: 'Hours worked must be greater than zero to calculate TRIR.',
      },
      result: null,
    };
  }

  const breakdown = calculateTRIR(injuries, hours);
  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate a finite TRIR.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result: toTrirResult(breakdown) };
}
