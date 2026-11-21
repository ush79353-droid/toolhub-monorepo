import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateBillableHours,
  formatBillableMoney,
  formatBillableTime,
} from './calculation';
import type {
  BillableHoursDraft,
  BillableHoursFieldErrors,
  BillableHoursResult,
  BillableHoursSolveTarget,
} from './types';
import { RATE_TIME_UNITS, BILLABLE_TIME_UNITS } from './types';

export interface BillableHoursValidation {
  isValid: boolean;
  errors: BillableHoursFieldErrors;
  result: BillableHoursResult | null;
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

function resolveSolveFor(input: BillableHoursDraft): {
  solveFor: BillableHoursSolveTarget | null;
  error?: string;
} {
  const rate = parseNumber(input.rate);
  const time = parseNumber(input.time);
  const value = parseNumber(input.value);
  const blanks: BillableHoursSolveTarget[] = [];
  if (rate.blank) blanks.push('rate');
  if (time.blank) blanks.push('time');
  if (value.blank) blanks.push('value');

  if (blanks.length === 1) return { solveFor: blanks[0]! };
  if (blanks.length === 0) return { solveFor: input.lastEdited };
  if (blanks.length === 3) {
    return { solveFor: null, error: 'Enter any two values to solve for the third.' };
  }
  return {
    solveFor: null,
    error:
      'Enter exactly two values (leave one blank), or fill all three to refresh the last-edited field.',
  };
}

function rateUnitLabel(unit: BillableHoursDraft['rateUnit']): string {
  return RATE_TIME_UNITS.find((u) => u.value === unit)?.label ?? unit;
}

function timeUnitLabel(unit: BillableHoursDraft['timeUnit']): string {
  return BILLABLE_TIME_UNITS.find((u) => u.value === unit)?.label ?? unit;
}

/**
 * Validates bidirectional billable-hours inputs, normalizes money into rate currency,
 * solves for the blank (or last-edited) field, then converts value for display.
 */
export function validateBillableHoursInput(
  input: BillableHoursDraft,
  rates?: CurrencyRatesSnapshot | null
): BillableHoursValidation {
  const errors: BillableHoursFieldErrors = {};
  const rateParsed = parseNumber(input.rate);
  const timeParsed = parseNumber(input.time);
  const valueParsed = parseNumber(input.value);

  if (!rateParsed.blank && (rateParsed.invalid || rateParsed.value === null)) {
    errors.rate = 'Enter a valid billable rate.';
  } else if (!rateParsed.blank && rateParsed.value! < 0) {
    errors.rate = 'Billable rate cannot be negative.';
  }

  if (!timeParsed.blank && (timeParsed.invalid || timeParsed.value === null)) {
    errors.time = 'Enter a valid billable time.';
  } else if (!timeParsed.blank && timeParsed.value! < 0) {
    errors.time = 'Billable time cannot be negative.';
  }

  if (!valueParsed.blank && (valueParsed.invalid || valueParsed.value === null)) {
    errors.value = 'Enter a valid billable value.';
  } else if (!valueParsed.blank && valueParsed.value! < 0) {
    errors.value = 'Billable value cannot be negative.';
  }

  const resolved = resolveSolveFor(input);
  if (resolved.error) {
    errors.form = resolved.error;
  }

  if (Object.keys(errors).length > 0 || !resolved.solveFor) {
    return { isValid: false, errors, result: null };
  }

  const solveFor = resolved.solveFor;
  let rateCanonical: number | null = rateParsed.blank ? null : rateParsed.value;
  let timeCanonical: number | null = timeParsed.blank ? null : timeParsed.value;
  let valueCanonical: number | null = valueParsed.blank ? null : valueParsed.value;

  if (valueCanonical !== null) {
    const converted = convertMoney(
      valueCanonical,
      input.valueCurrency,
      input.rateCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    valueCanonical = converted.amount;
  }

  if (!rateParsed.blank && !timeParsed.blank && !valueParsed.blank) {
    if (solveFor === 'rate') rateCanonical = null;
    if (solveFor === 'time') timeCanonical = null;
    if (solveFor === 'value') valueCanonical = null;
  }

  const computed = calculateBillableHours({
    solveFor,
    rate: rateCanonical,
    rateUnit: input.rateUnit,
    time: timeCanonical,
    timeUnit: input.timeUnit,
    value: valueCanonical,
  });

  if (!computed) {
    if (solveFor === 'rate' && timeCanonical === 0) {
      errors.time = 'Billable time must be greater than zero to solve for rate.';
    } else if (solveFor === 'time' && rateCanonical === 0) {
      errors.rate = 'Billable rate must be greater than zero to solve for time.';
    } else {
      errors.form = 'This combination does not produce a finite result.';
    }
    return { isValid: false, errors, result: null };
  }

  const valueDisplay = convertMoney(
    computed.value,
    input.rateCurrency,
    input.valueCurrency,
    rates
  );
  if (!valueDisplay.ok) {
    errors.form = valueDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: BillableHoursResult = {
    solvedField: computed.solvedField,
    rate: computed.rate,
    time: computed.time,
    value: valueDisplay.amount,
    rateUnit: computed.rateUnit,
    timeUnit: computed.timeUnit,
    calcCurrency: input.rateCurrency,
    valueCurrency: input.valueCurrency,
    formattedRate: formatBillableMoney(computed.rate, input.rateCurrency),
    formattedTime: formatBillableTime(computed.time),
    formattedValue: formatBillableMoney(valueDisplay.amount, input.valueCurrency),
    summaryText: `Solved ${computed.solvedField}: rate ${formatBillableMoney(computed.rate, input.rateCurrency)} ${input.rateCurrency}/${rateUnitLabel(computed.rateUnit)} · time ${formatBillableTime(computed.time)} ${timeUnitLabel(computed.timeUnit)} · value ${formatBillableMoney(valueDisplay.amount, input.valueCurrency)} ${input.valueCurrency}`,
  };

  return { isValid: true, errors: {}, result };
}
