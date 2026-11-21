import {
  calculateRevenuePerEmployee,
  calculateRevenuePerWorkingHour,
  convertWorkingTimeToHours,
  formatProductivityCount,
  formatProductivityMoney,
  interpretProductivity,
} from './calculation';
import type {
  ProductivityFieldErrors,
  ProductivityInput,
  ProductivityResult,
  ProductivityStatus,
} from './types';

export interface ProductivityValidation {
  isValid: boolean;
  errors: ProductivityFieldErrors;
  result: ProductivityResult | null;
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

export function validateProductivityInput(
  input: ProductivityInput
): ProductivityValidation {
  const errors: ProductivityFieldErrors = {};
  const currency = input.currency;
  const workingHoursUnit = input.workingHoursUnit;

  const revenue = parseNumber(input.revenue);
  const employees = parseNumber(input.numberOfEmployees);
  const hours = parseNumber(input.workingHours);

  if (!revenue.blank) {
    if (revenue.invalid || revenue.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (revenue.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }

  let employeesUsable = false;
  if (!employees.blank) {
    if (employees.invalid || employees.value === null) {
      errors.numberOfEmployees = 'Enter a valid employee count.';
    } else if (employees.value < 0) {
      errors.numberOfEmployees = 'Number of employees cannot be negative.';
    } else if (employees.value === 0) {
      errors.numberOfEmployees =
        'Number of employees must be greater than zero.';
    } else {
      employeesUsable = true;
    }
  }

  let hoursUsable = false;
  if (!hours.blank) {
    if (hours.invalid || hours.value === null) {
      errors.workingHours = 'Enter a valid number of working hours.';
    } else if (hours.value < 0) {
      errors.workingHours = 'Working hours cannot be negative.';
    } else if (hours.value === 0) {
      errors.workingHours = 'Working hours must be greater than zero.';
    } else {
      hoursUsable = true;
    }
  }

  // Bad revenue blocks both branches.
  if (errors.revenue || revenue.blank || revenue.value === null) {
    return {
      isValid: false,
      errors,
      result: null,
    };
  }

  let numberOfEmployees: number | null = null;
  let revenuePerEmployee: number | null = null;
  let employeeUnavailableReason: string | null = null;

  if (employeesUsable && employees.value !== null) {
    numberOfEmployees = employees.value;
    revenuePerEmployee = calculateRevenuePerEmployee(
      revenue.value,
      numberOfEmployees
    );
    if (revenuePerEmployee === null) {
      employeeUnavailableReason =
        'Employee productivity unavailable; employee count must be greater than zero.';
    }
  } else if (employees.blank) {
    employeeUnavailableReason =
      'Enter number of employees to calculate revenue per employee.';
  } else {
    employeeUnavailableReason =
      'Employee productivity unavailable; employee count must be greater than zero.';
  }

  let workingTimeEntered: number | null = null;
  let totalWorkingHours: number | null = null;
  let revenuePerWorkingHour: number | null = null;
  let hourlyUnavailableReason: string | null = null;

  if (hoursUsable && hours.value !== null) {
    workingTimeEntered = hours.value;
    totalWorkingHours = convertWorkingTimeToHours(
      hours.value,
      workingHoursUnit
    );
    if (totalWorkingHours === null || totalWorkingHours <= 0) {
      hourlyUnavailableReason =
        'Hourly productivity unavailable; working hours must be greater than zero.';
      totalWorkingHours = null;
    } else {
      revenuePerWorkingHour = calculateRevenuePerWorkingHour(
        revenue.value,
        totalWorkingHours
      );
      if (revenuePerWorkingHour === null) {
        hourlyUnavailableReason =
          'Hourly productivity unavailable for these inputs.';
      }
    }
  } else if (hours.blank) {
    hourlyUnavailableReason =
      'Enter working hours to calculate revenue per working hour.';
  } else {
    hourlyUnavailableReason =
      'Hourly productivity unavailable; working hours must be greater than zero.';
  }

  const hasEmployee = revenuePerEmployee !== null;
  const hasHourly = revenuePerWorkingHour !== null;

  if (!hasEmployee && !hasHourly) {
    return { isValid: false, errors, result: null };
  }

  const status: ProductivityStatus =
    hasEmployee && hasHourly ? 'valid' : 'partial';

  const warningMessage =
    'Revenue productivity uses the same reporting period for revenue, headcount, and labor hours. Currency labels amounts only (no FX). Time units convert to hours (seconds÷3600, minutes÷60). Enter total workforce hours; do not multiply by headcount again.';

  const result: ProductivityResult = {
    revenue: revenue.value,
    numberOfEmployees,
    workingTimeEntered,
    totalWorkingHours,
    revenuePerEmployee,
    revenuePerWorkingHour,
    status,
    employeeUnavailableReason: hasEmployee ? null : employeeUnavailableReason,
    hourlyUnavailableReason: hasHourly ? null : hourlyUnavailableReason,
    interpretation: interpretProductivity(
      revenuePerEmployee,
      revenuePerWorkingHour
    ),
    warningMessage,
    currency,
    workingHoursUnit,
    formattedRevenue: formatProductivityMoney(revenue.value, currency),
    formattedEmployees:
      numberOfEmployees === null
        ? null
        : formatProductivityCount(numberOfEmployees),
    formattedWorkingTimeEntered:
      workingTimeEntered === null
        ? null
        : formatProductivityCount(workingTimeEntered),
    formattedTotalWorkingHours:
      totalWorkingHours === null
        ? null
        : formatProductivityCount(totalWorkingHours),
    formattedRevenuePerEmployee:
      revenuePerEmployee === null
        ? null
        : formatProductivityMoney(revenuePerEmployee, currency),
    formattedRevenuePerWorkingHour:
      revenuePerWorkingHour === null
        ? null
        : formatProductivityMoney(revenuePerWorkingHour, currency),
  };

  return { isValid: true, errors, result };
}
