import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateCaliforniaOvertime,
  formatCaliforniaOvertimeMoney,
  fromHourlyRate,
} from './calculation';
import type {
  CaliforniaOvertimeFieldErrors,
  CaliforniaOvertimeInput,
  CaliforniaOvertimeResult,
} from './types';

export interface CaliforniaOvertimeValidation {
  isValid: boolean;
  errors: CaliforniaOvertimeFieldErrors;
  result: CaliforniaOvertimeResult | null;
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
 * Compute overtime in the regular-pay currency at full precision, then FX each
 * money result into its independent display currency. Time units and the
 * multiplier are never currency-converted.
 */
export function validateCaliforniaOvertimeInput(
  input: CaliforniaOvertimeInput,
  rates?: CurrencyRatesSnapshot | null
): CaliforniaOvertimeValidation {
  const errors: CaliforniaOvertimeFieldErrors = {};

  const regularPay = parseNumber(input.regularPay);
  const regularWork = parseNumber(input.regularWorkTime);
  const multiplier = parseNumber(input.overtimeMultiplier);
  const overtimeHours = parseNumber(input.overtimeHours);

  if (!regularPay.blank && (regularPay.invalid || regularPay.value === null)) {
    errors.regularPay = 'Enter a valid regular pay rate.';
  } else if (!regularPay.blank && regularPay.value !== null && regularPay.value < 0) {
    errors.regularPay = 'Regular pay cannot be negative.';
  }

  if (!regularWork.blank && (regularWork.invalid || regularWork.value === null)) {
    errors.regularWorkTime = 'Enter a valid regular work time.';
  } else if (
    !regularWork.blank &&
    regularWork.value !== null &&
    !(regularWork.value > 0)
  ) {
    errors.regularWorkTime = 'Regular work time must be greater than zero.';
  }

  if (!multiplier.blank && (multiplier.invalid || multiplier.value === null)) {
    errors.overtimeMultiplier = 'Enter a valid overtime multiplier.';
  } else if (!multiplier.blank && multiplier.value !== null && multiplier.value < 0) {
    errors.overtimeMultiplier = 'Overtime multiplier cannot be negative.';
  }

  if (
    !overtimeHours.blank &&
    (overtimeHours.invalid || overtimeHours.value === null)
  ) {
    errors.overtimeHours = 'Enter a valid number of overtime hours.';
  } else if (
    !overtimeHours.blank &&
    overtimeHours.value !== null &&
    overtimeHours.value < 0
  ) {
    errors.overtimeHours = 'Overtime hours cannot be negative.';
  }

  const otHoursValue = overtimeHours.blank ? 0 : overtimeHours.value!;
  const incomplete =
    regularPay.blank ||
    regularWork.blank ||
    multiplier.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCaliforniaOvertime({
    regularPay: regularPay.value!,
    regularPayUnit: input.regularPayUnit,
    regularWorkHours: regularWork.value!,
    regularWorkPeriod: input.regularWorkPeriod,
    overtimeMultiplier: multiplier.value!,
    overtimeHours: otHoursValue,
    overtimeHoursPeriod: input.overtimeHoursPeriod,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite overtime result.';
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.regularPayCurrency;

  const overtimePayInUnit = fromHourlyRate(
    computed.overtimeHourlyRate,
    input.overtimePayUnit,
    computed.weeklyHours
  );
  if (overtimePayInUnit === null || !Number.isFinite(overtimePayInUnit)) {
    errors.form = 'This combination does not produce a finite overtime rate.';
    return { isValid: false, errors, result: null };
  }

  const totalRegularDisplay = convertMoney(
    computed.monthlyRegularPay,
    calcCurrency,
    input.totalRegularPayCurrency,
    rates
  );
  if (!totalRegularDisplay.ok) {
    errors.form = totalRegularDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const overtimePayDisplay = convertMoney(
    overtimePayInUnit,
    calcCurrency,
    input.overtimePayCurrency,
    rates
  );
  if (!overtimePayDisplay.ok) {
    errors.form = overtimePayDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalOtDisplay = convertMoney(
    computed.monthlyOvertimePay,
    calcCurrency,
    input.totalOvertimePayCurrency,
    rates
  );
  if (!totalOtDisplay.ok) {
    errors.form = totalOtDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalPayDisplay = convertMoney(
    computed.monthlyTotalPay,
    calcCurrency,
    input.totalPayCurrency,
    rates
  );
  if (!totalPayDisplay.ok) {
    errors.form = totalPayDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: CaliforniaOvertimeResult = {
    hourlyRate: computed.hourlyRate,
    weeklyHours: computed.weeklyHours,
    monthlyRegularPay: computed.monthlyRegularPay,
    overtimeHourlyRate: computed.overtimeHourlyRate,
    overtimeHoursPerMonth: computed.overtimeHoursPerMonth,
    monthlyOvertimePay: computed.monthlyOvertimePay,
    monthlyTotalPay: computed.monthlyTotalPay,
    calcCurrency,
    totalRegularPayDisplay: totalRegularDisplay.amount,
    overtimePayDisplay: overtimePayDisplay.amount,
    totalOvertimePayDisplay: totalOtDisplay.amount,
    totalPayDisplay: totalPayDisplay.amount,
    formattedTotalRegularPay: formatCaliforniaOvertimeMoney(
      totalRegularDisplay.amount,
      input.totalRegularPayCurrency
    ),
    formattedOvertimePay: formatCaliforniaOvertimeMoney(
      overtimePayDisplay.amount,
      input.overtimePayCurrency
    ),
    formattedTotalOvertimePay: formatCaliforniaOvertimeMoney(
      totalOtDisplay.amount,
      input.totalOvertimePayCurrency
    ),
    formattedTotalPay: formatCaliforniaOvertimeMoney(
      totalPayDisplay.amount,
      input.totalPayCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
