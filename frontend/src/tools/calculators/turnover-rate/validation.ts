import { averageFromStartEnd, calculateTurnoverRate } from './calculation';
import type {
  TurnoverRateFieldErrors,
  TurnoverRateInput,
  TurnoverRateResult,
} from './types';

export interface TurnoverRateValidation {
  isValid: boolean;
  errors: TurnoverRateFieldErrors;
  result: TurnoverRateResult | null;
  /** When Yes mode has valid start/end, the derived average for the form. */
  derivedAverage: string | null;
}

function parseWholeNonNegative(
  raw: string,
  label: string
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: `${label} must be a non-negative whole number.`,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    return {
      value: null,
      blank: false,
      error: `${label} must be a non-negative whole number.`,
    };
  }
  return { value, blank: false };
}

export function validateTurnoverRateInput(input: TurnoverRateInput): TurnoverRateValidation {
  const errors: TurnoverRateFieldErrors = {};
  const left = parseWholeNonNegative(input.employeesWhoLeft, 'Employees who left');

  let averageValue: number | null = null;
  let derivedAverage: string | null = null;

  if (input.calculateAverage === 'yes') {
    const start = parseWholeNonNegative(input.employeesAtStart, 'Employees at start');
    const end = parseWholeNonNegative(input.employeesAtEnd, 'Employees at end');

    if (!start.blank && start.error) errors.employeesAtStart = start.error;
    if (!end.blank && end.error) errors.employeesAtEnd = end.error;

    if (
      !start.blank &&
      !end.blank &&
      start.value !== null &&
      end.value !== null &&
      !errors.employeesAtStart &&
      !errors.employeesAtEnd
    ) {
      const avg = averageFromStartEnd(start.value, end.value);
      if (avg === null || avg <= 0) {
        errors.general = 'Average number of employees must be greater than zero.';
      } else {
        averageValue = avg;
        derivedAverage =
          Number.isInteger(avg) ? String(avg) : String(Math.round(avg * 100) / 100);
      }
    }

    if (start.blank || end.blank || left.blank) {
      if (!left.blank && left.error) errors.employeesWhoLeft = left.error;
      return {
        isValid: false,
        errors,
        result: null,
        derivedAverage,
      };
    }
  } else {
    const average = parseWholeNonNegative(
      input.averageEmployees,
      'Average number of employees'
    );
    if (!average.blank && average.error) errors.averageEmployees = average.error;
    if (
      !average.blank &&
      average.value !== null &&
      !average.error &&
      average.value <= 0
    ) {
      errors.averageEmployees = 'Average number of employees must be greater than zero.';
    }
    if (!average.blank && average.value !== null && !errors.averageEmployees) {
      averageValue = average.value;
    }

    if (average.blank || left.blank) {
      if (!left.blank && left.error) errors.employeesWhoLeft = left.error;
      return {
        isValid: false,
        errors,
        result: null,
        derivedAverage: null,
      };
    }
  }

  if (!left.blank && left.error) errors.employeesWhoLeft = left.error;

  if (Object.keys(errors).length > 0 || averageValue === null || left.value === null) {
    return { isValid: false, errors, result: null, derivedAverage };
  }

  const result = calculateTurnoverRate(averageValue, left.value);
  if (!result) {
    errors.general = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null, derivedAverage };
  }

  return { isValid: true, errors: {}, result, derivedAverage };
}
