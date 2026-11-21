import { calculateAutoLease } from './calculation';
import type {
  AutoLeaseFieldErrors,
  AutoLeaseInput,
  AutoLeaseResult,
} from './types';

export interface AutoLeaseValidation {
  isValid: boolean;
  errors: AutoLeaseFieldErrors;
  result: AutoLeaseResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function parseWholeMonths(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank || parsed.invalid || parsed.value === null) return parsed;
  if (!Number.isInteger(parsed.value)) {
    return { value: null, blank: false, invalid: true };
  }
  return parsed;
}

export function validateAutoLeaseInput(input: AutoLeaseInput): AutoLeaseValidation {
  const errors: AutoLeaseFieldErrors = {};

  const autoPrice = parseNumber(input.autoPrice);
  const monthlyPayment = parseNumber(input.monthlyPayment);
  const term = parseWholeMonths(input.leaseTermMonths);
  const rate = parseNumber(input.rateValue);
  const down = parseNumber(input.downPayment);
  const tradeIn = parseNumber(input.tradeInValue);
  const tax = parseNumber(input.salesTaxPercent);
  const residual = parseNumber(input.residualValue);

  if (input.mode === 'total-price') {
    if (autoPrice.blank || autoPrice.invalid || autoPrice.value === null) {
      errors.autoPrice = 'Enter a valid auto price.';
    } else if (autoPrice.value < 0) {
      errors.autoPrice = 'Auto price cannot be negative.';
    }
  } else {
    if (monthlyPayment.blank || monthlyPayment.invalid || monthlyPayment.value === null) {
      errors.monthlyPayment = 'Enter a valid monthly payment.';
    } else if (monthlyPayment.value < 0) {
      errors.monthlyPayment = 'Monthly payment cannot be negative.';
    }
  }

  if (term.blank || term.invalid || term.value === null) {
    errors.leaseTermMonths = 'Enter a whole number of months.';
  } else if (term.value <= 0) {
    errors.leaseTermMonths = 'Lease term must be at least 1 month.';
  } else if (term.value > 120) {
    errors.leaseTermMonths = 'Lease term cannot exceed 120 months.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.rateValue =
      input.rateType === 'apr'
        ? 'Enter a valid APR percentage.'
        : 'Enter a valid money factor.';
  } else if (rate.value < 0) {
    errors.rateValue =
      input.rateType === 'apr'
        ? 'APR cannot be negative.'
        : 'Money factor cannot be negative.';
  } else if (input.rateType === 'apr' && rate.value > 100) {
    errors.rateValue = 'APR looks too high. Enter the annual percentage rate (for example 4.99).';
  } else if (input.rateType === 'money-factor' && rate.value > 1) {
    errors.rateValue =
      'Money factor looks too high. Typical values are near 0.002 (about APR / 2400).';
  }

  if (down.blank || down.invalid || down.value === null) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (tradeIn.blank || tradeIn.invalid || tradeIn.value === null) {
    errors.tradeInValue = 'Enter a valid trade-in value.';
  } else if (tradeIn.value < 0) {
    errors.tradeInValue = 'Trade-in value cannot be negative.';
  }

  if (tax.blank || tax.invalid || tax.value === null) {
    errors.salesTaxPercent = 'Enter a valid sales tax percentage.';
  } else if (tax.value < 0) {
    errors.salesTaxPercent = 'Sales tax cannot be negative.';
  } else if (tax.value > 100) {
    errors.salesTaxPercent = 'Sales tax cannot exceed 100%.';
  }

  if (residual.blank || residual.invalid || residual.value === null) {
    errors.residualValue = 'Enter a valid residual value.';
  } else if (residual.value < 0) {
    errors.residualValue = 'Residual value cannot be negative.';
  }

  if (
    input.mode === 'total-price' &&
    !autoPrice.blank &&
    autoPrice.value !== null &&
    !down.blank &&
    down.value !== null &&
    !tradeIn.blank &&
    tradeIn.value !== null &&
    autoPrice.value - down.value - tradeIn.value < 0
  ) {
    errors.form = 'Down payment plus trade-in cannot exceed the auto price.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateAutoLease({
    mode: input.mode,
    autoPrice: input.mode === 'total-price' ? autoPrice.value : null,
    monthlyPayment: input.mode === 'monthly-payment' ? monthlyPayment.value : null,
    leaseTermMonths: term.value!,
    rateType: input.rateType,
    rateValue: rate.value!,
    downPayment: down.value!,
    tradeInValue: tradeIn.value!,
    salesTaxPercent: tax.value!,
    residualValue: residual.value!,
  });

  if (!result) {
    errors.form =
      input.mode === 'monthly-payment'
        ? 'Unable to solve an auto price for that monthly payment with the given terms.'
        : 'Unable to calculate the lease with the given inputs.';
    return { isValid: false, errors, result: null };
  }

  if (result.capitalizedCost < 0 || result.baseMonthlyPayment < 0) {
    errors.form = 'Lease inputs produce a negative payment. Check price, residual, and allowances.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
