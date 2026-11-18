import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateNetEffectiveRent,
  formatNetEffectiveRentMoney,
  toMonthlyAmount,
} from './calculation';
import type {
  NetEffectiveRentFieldErrors,
  NetEffectiveRentInput,
  NetEffectiveRentResult,
} from './types';

export interface NetEffectiveRentValidation {
  isValid: boolean;
  errors: NetEffectiveRentFieldErrors;
  result: NetEffectiveRentResult | null;
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
 * Canonical calc currency = monthly rent currency.
 * Blank discount/expense money → 0. Blank rent-free → 0. Blank % → 0.
 * Lease term and monthly rent required.
 */
export function validateNetEffectiveRentInput(
  input: NetEffectiveRentInput,
  rates?: CurrencyRatesSnapshot | null
): NetEffectiveRentValidation {
  const errors: NetEffectiveRentFieldErrors = {};
  const calcCurrency = input.monthlyRentCurrency;

  const years = parseNumber(input.leaseYears);
  const months = parseNumber(input.leaseMonths);
  const rent = parseNumber(input.monthlyRent);
  const rentFree = parseNumber(input.rentFreeMonths);
  const allowance = parseNumber(input.tenantCashAllowance);
  const opEx = parseNumber(input.operatingCosts);
  const opExPct = parseNumber(input.operatingCostsPercent);

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.leaseYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.leaseYears = 'Lease years cannot be negative.';
  } else if (
    !years.blank &&
    years.value !== null &&
    !Number.isInteger(years.value)
  ) {
    errors.leaseYears = 'Lease years must be a whole number.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.leaseMonths = 'Enter a valid number of months.';
  } else if (!months.blank && months.value !== null && months.value < 0) {
    errors.leaseMonths = 'Lease months cannot be negative.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value > 11)
  ) {
    errors.leaseMonths = 'Lease months must be a whole number from 0 to 11.';
  }

  if (!rent.blank && (rent.invalid || rent.value === null)) {
    errors.monthlyRent = 'Enter a valid monthly rent.';
  } else if (!rent.blank && rent.value !== null && rent.value < 0) {
    errors.monthlyRent = 'Monthly rent cannot be negative.';
  }

  if (!rentFree.blank && (rentFree.invalid || rentFree.value === null)) {
    errors.rentFreeMonths = 'Enter a valid number of rent-free months.';
  } else if (!rentFree.blank && rentFree.value !== null && rentFree.value < 0) {
    errors.rentFreeMonths = 'Rent-free months cannot be negative.';
  }

  if (!allowance.blank && (allowance.invalid || allowance.value === null)) {
    errors.tenantCashAllowance = 'Enter a valid tenant cash allowance.';
  } else if (!allowance.blank && allowance.value !== null && allowance.value < 0) {
    errors.tenantCashAllowance = 'Tenant cash allowance cannot be negative.';
  }

  if (!opEx.blank && (opEx.invalid || opEx.value === null)) {
    errors.operatingCosts = 'Enter a valid operating cost.';
  } else if (!opEx.blank && opEx.value !== null && opEx.value < 0) {
    errors.operatingCosts = 'Operating costs cannot be negative.';
  }

  if (!opExPct.blank && (opExPct.invalid || opExPct.value === null)) {
    errors.operatingCostsPercent = 'Enter a valid operating costs %.';
  } else if (!opExPct.blank && opExPct.value !== null && opExPct.value < 0) {
    errors.operatingCostsPercent = 'Operating costs % cannot be negative.';
  }

  const yearsVal = years.blank || years.value === null ? 0 : years.value;
  const monthsVal = months.blank || months.value === null ? 0 : months.value;
  const leaseMonths = yearsVal * 12 + monthsVal;

  if (Object.keys(errors).length === 0 && !(leaseMonths > 0)) {
    errors.leaseYears = 'Lease term must be greater than zero.';
  }

  if (rent.blank) {
    errors.monthlyRent = errors.monthlyRent ?? 'Enter monthly rent.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const rentFreeVal = rentFree.blank || rentFree.value === null ? 0 : rentFree.value;
  if (rentFreeVal > leaseMonths) {
    errors.rentFreeMonths = 'Rent-free months cannot exceed the lease term.';
    return { isValid: false, errors, result: null };
  }

  const rentMonthly = toMonthlyAmount(rent.value!, input.monthlyRentPeriod);
  if (rentMonthly === null) {
    errors.monthlyRent = 'Could not normalize rent to a monthly amount.';
    return { isValid: false, errors, result: null };
  }

  const allowanceRaw =
    allowance.blank || allowance.value === null ? 0 : allowance.value;
  const allowanceFx = convertMoney(
    allowanceRaw,
    input.tenantCashAllowanceCurrency,
    calcCurrency,
    rates
  );
  if (!allowanceFx.ok) {
    errors.form = allowanceFx.message;
    return { isValid: false, errors, result: null };
  }

  const opExRaw = opEx.blank || opEx.value === null ? 0 : opEx.value;
  const opExFx = convertMoney(
    opExRaw,
    input.operatingCostsCurrency,
    calcCurrency,
    rates
  );
  if (!opExFx.ok) {
    errors.form = opExFx.message;
    return { isValid: false, errors, result: null };
  }
  const opExMonthly = toMonthlyAmount(opExFx.amount, input.operatingCostsPeriod);
  if (opExMonthly === null) {
    errors.operatingCosts = 'Could not normalize operating costs to monthly.';
    return { isValid: false, errors, result: null };
  }

  const pctVal = opExPct.blank || opExPct.value === null ? 0 : opExPct.value;

  const calc = calculateNetEffectiveRent({
    leaseMonths,
    grossMonthlyRent: rentMonthly,
    rentFreeMonths: rentFreeVal,
    tenantAllowance: allowanceFx.amount,
    operatingCostMonthlyFixed: opExMonthly,
    operatingCostsPercent: pctVal,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const monthlyFx = convertMoney(
    calc.netEffectiveRentMonthly,
    calcCurrency,
    input.monthlyResultCurrency,
    rates
  );
  if (!monthlyFx.ok) {
    errors.form = monthlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const annualFx = convertMoney(
    calc.netEffectiveRentAnnual,
    calcCurrency,
    input.annualResultCurrency,
    rates
  );
  if (!annualFx.ok) {
    errors.form = annualFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: NetEffectiveRentResult = {
    leaseMonths,
    grossMonthlyRent: rentMonthly,
    netEffectiveRentMonthly: calc.netEffectiveRentMonthly,
    netEffectiveRentAnnual: calc.netEffectiveRentAnnual,
    calcCurrency,
    displayMonthly: monthlyFx.amount,
    displayAnnual: annualFx.amount,
    formattedMonthly: formatNetEffectiveRentMoney(
      monthlyFx.amount,
      input.monthlyResultCurrency
    ),
    formattedAnnual: formatNetEffectiveRentMoney(
      annualFx.amount,
      input.annualResultCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
