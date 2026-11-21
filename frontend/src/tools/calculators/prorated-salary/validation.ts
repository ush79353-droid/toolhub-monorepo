import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateProratedSalary,
  formatProratedSalaryMoney,
} from './calculation';
import type {
  ProratedSalaryFieldErrors,
  ProratedSalaryInput,
  ProratedSalaryResult,
  Weekday,
} from './types';

export interface ProratedSalaryValidation {
  isValid: boolean;
  errors: ProratedSalaryFieldErrors;
  result: ProratedSalaryResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates schedule + money inputs, computes proration in gross currency,
 * then FX-converts the prorated salary into the independent result currency.
 * Day counts / workweek are never converted.
 */
export function validateProratedSalaryInput(
  input: ProratedSalaryInput,
  rates?: CurrencyRatesSnapshot | null
): ProratedSalaryValidation {
  const errors: ProratedSalaryFieldErrors = {};

  const year = parseNumber(input.year);
  const month = parseNumber(input.month);
  const gross = parseNumber(input.grossSalary);
  const daysWorked = parseNumber(input.daysWorked);
  const holidays = parseNumber(input.holidays);
  const leave = parseNumber(input.approvedLeave);

  if (year.blank || year.invalid || year.value === null) {
    errors.year = 'Enter a valid year.';
  } else if (!Number.isInteger(year.value) || year.value < 1 || year.value > 9999) {
    errors.year = 'Year must be a whole number from 1 to 9999.';
  }

  if (month.blank || month.invalid || month.value === null) {
    errors.month = 'Select a month.';
  } else if (
    !Number.isInteger(month.value) ||
    month.value < 1 ||
    month.value > 12
  ) {
    errors.month = 'Month must be between 1 and 12.';
  }

  if (gross.blank || gross.invalid || gross.value === null) {
    errors.grossSalary = 'Enter a valid gross salary.';
  } else if (!(gross.value >= 0)) {
    errors.grossSalary = 'Gross salary must be zero or greater.';
  }

  if (daysWorked.blank || daysWorked.invalid || daysWorked.value === null) {
    errors.daysWorked = 'Enter a valid number of days worked.';
  } else if (!(daysWorked.value >= 0)) {
    errors.daysWorked = 'Days worked must be zero or greater.';
  }

  if (holidays.blank || holidays.invalid || holidays.value === null) {
    errors.holidays = 'Enter a valid number of holidays.';
  } else if (!(holidays.value >= 0)) {
    errors.holidays = 'Holidays must be zero or greater.';
  }

  if (leave.blank || leave.invalid || leave.value === null) {
    errors.approvedLeave = 'Enter a valid number of approved leave days.';
  } else if (!(leave.value >= 0)) {
    errors.approvedLeave = 'Approved leave must be zero or greater.';
  }

  if (![1, 2, 3, 4, 5, 6, 7].includes(input.workdaysPerWeek)) {
    errors.workdaysPerWeek = 'Select days worked per week.';
  }

  const offNeeded = 7 - input.workdaysPerWeek;
  const activeOff = input.daysOff.slice(0, Math.max(0, offNeeded));
  if (offNeeded > 0) {
    if (activeOff.length < offNeeded) {
      errors.daysOff = 'Select all days off for your workweek.';
    } else if (
      !activeOff.every((d) => [0, 1, 2, 3, 4, 5, 6].includes(d as number))
    ) {
      errors.daysOff = 'Select valid weekdays for days off.';
    } else if (new Set(activeOff).size !== activeOff.length) {
      errors.daysOff = 'Days off must be distinct weekdays.';
    }
  }

  if (
    Boolean(errors.year) ||
    Boolean(errors.month) ||
    Boolean(errors.grossSalary) ||
    Boolean(errors.daysWorked) ||
    Boolean(errors.holidays) ||
    Boolean(errors.approvedLeave) ||
    Boolean(errors.workdaysPerWeek) ||
    Boolean(errors.daysOff)
  ) {
    return { isValid: false, errors, result: null };
  }

  const payable =
    daysWorked.value! + holidays.value! + leave.value!;

  const computed = calculateProratedSalary({
    year: year.value!,
    month: month.value!,
    grossSalary: gross.value!,
    payPeriod: input.payPeriod,
    daysWorked: daysWorked.value!,
    holidays: holidays.value!,
    approvedLeave: leave.value!,
    daysOff: activeOff as Weekday[],
  });

  if (computed === null) {
    errors.form =
      'This schedule has no working days in the selected month, or the inputs do not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  if (payable > computed.scheduledWorkingDays) {
    errors.form = `Payable days (${payable}) cannot exceed scheduled working days (${computed.scheduledWorkingDays}). Reduce days worked, holidays, or leave so they are not double-counted.`;
    return { isValid: false, errors, result: null };
  }

  const baseCurrency = input.grossSalaryCurrency;
  const resultFx = convertMoney(
    computed.proratedSalary,
    baseCurrency,
    input.resultCurrency,
    rates
  );
  if (!resultFx.ok) {
    errors.form = resultFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: ProratedSalaryResult = {
    calendarDaysInMonth: computed.calendarDaysInMonth,
    scheduledWorkingDays: computed.scheduledWorkingDays,
    payableDays: computed.payableDays,
    monthlySalaryCanonical: computed.monthlySalary,
    proratedSalaryCanonical: computed.proratedSalary,
    proratedSalary: resultFx.amount,
    grossSalaryCurrency: baseCurrency,
    resultCurrency: input.resultCurrency,
    formattedProratedSalary: formatProratedSalaryMoney(
      resultFx.amount,
      input.resultCurrency
    ),
  };

  return { isValid: true, errors, result };
}
