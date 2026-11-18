import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateGeorgiaOvertime,
  formatGeorgiaOvertimeMoney,
  fromHourlyRate,
  fromMonthlyPay,
  toHourlyRate,
  toMonthlyHours,
  toWeeklyHours,
} from './calculation';
import type {
  GeorgiaOvertimeFieldErrors,
  GeorgiaOvertimeInput,
  GeorgiaOvertimeResult,
} from './types';

export interface GeorgiaOvertimeValidation {
  isValid: boolean;
  errors: GeorgiaOvertimeFieldErrors;
  result: GeorgiaOvertimeResult | null;
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
 * Validates inputs, normalizes regular pay into the regular-pay currency as an
 * hourly rate, converts OT hours to monthly, then computes pay totals.
 * Result display currencies re-express monthly/hourly amounts without changing economics.
 */
export function validateGeorgiaOvertimeInput(
  input: GeorgiaOvertimeInput,
  rates?: CurrencyRatesSnapshot | null
): GeorgiaOvertimeValidation {
  const errors: GeorgiaOvertimeFieldErrors = {};
  const calcCurrency = input.regularPayCurrency;

  const regularPay = parseNumber(input.regularPay);
  const workTime = parseNumber(input.regularWorkTime);
  const multiplier = parseNumber(input.overtimeMultiplier);
  const otHours = parseNumber(input.overtimeHours);

  if (!regularPay.blank && (regularPay.invalid || regularPay.value === null)) {
    errors.regularPay = 'Enter a valid regular pay.';
  } else if (!regularPay.blank && regularPay.value !== null && regularPay.value < 0) {
    errors.regularPay = 'Regular pay cannot be negative.';
  }

  if (!workTime.blank && (workTime.invalid || workTime.value === null)) {
    errors.regularWorkTime = 'Enter a valid regular work time.';
  } else if (!workTime.blank && workTime.value !== null && !(workTime.value > 0)) {
    errors.regularWorkTime = 'Regular work time must be greater than zero.';
  }

  if (!multiplier.blank && (multiplier.invalid || multiplier.value === null)) {
    errors.overtimeMultiplier = 'Enter a valid overtime multiplier.';
  } else if (!multiplier.blank && multiplier.value !== null && multiplier.value < 0) {
    errors.overtimeMultiplier = 'Overtime multiplier cannot be negative.';
  }

  if (!otHours.blank && (otHours.invalid || otHours.value === null)) {
    errors.overtimeHours = 'Enter a valid overtime hours amount.';
  } else if (!otHours.blank && otHours.value !== null && otHours.value < 0) {
    errors.overtimeHours = 'Overtime hours cannot be negative.';
  }

  const incomplete =
    regularPay.blank ||
    workTime.blank ||
    multiplier.blank ||
    otHours.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const weeklyHours = toWeeklyHours(
    workTime.value!,
    input.regularWorkDurationUnit,
    input.regularWorkFrequency
  );
  if (weeklyHours === null || !(weeklyHours > 0)) {
    errors.regularWorkTime = 'This work-time combination is invalid.';
    return { isValid: false, errors, result: null };
  }

  const hourlyFromInput = toHourlyRate(
    regularPay.value!,
    input.regularPayPeriod,
    weeklyHours
  );
  if (hourlyFromInput === null) {
    errors.regularPay = 'Could not convert regular pay to an hourly rate.';
    return { isValid: false, errors, result: null };
  }

  const monthlyOtHours = toMonthlyHours(
    otHours.value!,
    input.overtimeHoursDurationUnit,
    input.overtimeHoursFrequency
  );
  if (monthlyOtHours === null) {
    errors.overtimeHours = 'This overtime-hours combination is invalid.';
    return { isValid: false, errors, result: null };
  }

  const calc = calculateGeorgiaOvertime({
    hourlyRegularRate: hourlyFromInput,
    weeklyRegularHours: weeklyHours,
    overtimeMultiplier: multiplier.value!,
    monthlyOvertimeHours: monthlyOtHours,
  });
  if (!calc) {
    errors.form = 'This combination does not produce a finite overtime result.';
    return { isValid: false, errors, result: null };
  }

  const displayOtRate = fromHourlyRate(
    calc.hourlyOvertimeRate,
    input.overtimePayPeriod,
    weeklyHours
  );
  const displayRegular = fromMonthlyPay(
    calc.monthlyRegularPay,
    input.totalRegularPayFrequency
  );
  const displayOtTotal = fromMonthlyPay(
    calc.monthlyOvertimePay,
    input.totalOvertimePayFrequency
  );
  const displayTotal = fromMonthlyPay(calc.monthlyTotalPay, input.totalPayFrequency);

  if (
    displayOtRate === null ||
    displayRegular === null ||
    displayOtTotal === null ||
    displayTotal === null
  ) {
    errors.form = 'Could not express results in the selected units.';
    return { isValid: false, errors, result: null };
  }

  const convertDisplay = (
    amount: number,
    to: SupportedCurrency
  ): { ok: true; amount: number } | { ok: false; message: string } =>
    convertMoney(amount, calcCurrency, to, rates);

  const otRateFx = convertDisplay(displayOtRate, input.overtimePayCurrency);
  if (!otRateFx.ok) {
    errors.form = otRateFx.message;
    return { isValid: false, errors, result: null };
  }
  const regularFx = convertDisplay(displayRegular, input.totalRegularPayCurrency);
  if (!regularFx.ok) {
    errors.form = regularFx.message;
    return { isValid: false, errors, result: null };
  }
  const otTotalFx = convertDisplay(displayOtTotal, input.totalOvertimePayCurrency);
  if (!otTotalFx.ok) {
    errors.form = otTotalFx.message;
    return { isValid: false, errors, result: null };
  }
  const totalFx = convertDisplay(displayTotal, input.totalPayCurrency);
  if (!totalFx.ok) {
    errors.form = totalFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: GeorgiaOvertimeResult = {
    hourlyRegularRate: hourlyFromInput,
    hourlyOvertimeRate: calc.hourlyOvertimeRate,
    weeklyRegularHours: weeklyHours,
    monthlyOvertimeHours: monthlyOtHours,
    monthlyRegularPay: calc.monthlyRegularPay,
    monthlyOvertimePay: calc.monthlyOvertimePay,
    monthlyTotalPay: calc.monthlyTotalPay,
    calcCurrency,
    displayOvertimeRate: otRateFx.amount,
    displayTotalRegularPay: regularFx.amount,
    displayTotalOvertimePay: otTotalFx.amount,
    displayTotalPay: totalFx.amount,
    formattedHourlyOvertimeRate: formatGeorgiaOvertimeMoney(
      otRateFx.amount,
      input.overtimePayCurrency
    ),
    formattedTotalRegularPay: formatGeorgiaOvertimeMoney(
      regularFx.amount,
      input.totalRegularPayCurrency
    ),
    formattedTotalOvertimePay: formatGeorgiaOvertimeMoney(
      otTotalFx.amount,
      input.totalOvertimePayCurrency
    ),
    formattedTotalPay: formatGeorgiaOvertimeMoney(totalFx.amount, input.totalPayCurrency),
  };

  return { isValid: true, errors: {}, result };
}
