import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLease,
  formatLeaseMoney,
  termToMonthCount,
} from './calculation';
import type {
  LeaseFieldErrors,
  LeaseInput,
  LeaseResult,
} from './types';

export interface LeaseValidation {
  isValid: boolean;
  errors: LeaseFieldErrors;
  result: LeaseResult | null;
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
 * Validates inputs, normalizes money into product currency, runs the lease
 * engine at full precision, then converts results into display currencies.
 */
export function validateLeaseInput(
  input: LeaseInput,
  rates?: CurrencyRatesSnapshot | null
): LeaseValidation {
  const errors: LeaseFieldErrors = {};

  const product = parseNumber(input.productValue);
  const residualAmount = parseNumber(input.residualAmount);
  const residualPercent = parseNumber(input.residualPercent);
  const term = parseNumber(input.leaseTerm);
  const rate = parseNumber(input.annualInterestRatePercent);
  const down = parseNumber(input.downPayment);

  if (product.blank) {
    errors.productValue = 'Enter a product value.';
  } else if (product.invalid || product.value === null) {
    errors.productValue = 'Enter a valid product value.';
  } else if (!(product.value > 0)) {
    errors.productValue = 'Product value must be greater than zero.';
  }

  if (term.blank) {
    errors.leaseTerm = 'Enter a lease term.';
  } else if (term.invalid || term.value === null) {
    errors.leaseTerm = 'Enter a valid lease term.';
  } else if (!(term.value > 0)) {
    errors.leaseTerm = 'Lease term must be greater than zero.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRatePercent = 'Interest rate cannot be negative.';
  }

  let residualCanonical: number | null = null;
  if (input.residualMode === 'percent') {
    if (residualPercent.blank) {
      errors.residualPercent = 'Enter a residual percent, or enter a residual amount.';
    } else if (residualPercent.invalid || residualPercent.value === null) {
      errors.residualPercent = 'Enter a valid residual percent.';
    } else if (residualPercent.value < 0) {
      errors.residualPercent = 'Residual percent cannot be negative.';
    } else if (residualPercent.value > 100) {
      errors.residualPercent = 'Residual percent cannot exceed 100%.';
    } else if (product.value !== null && product.value > 0) {
      residualCanonical = (product.value * residualPercent.value) / 100;
    }
  } else if (residualAmount.blank && residualPercent.blank) {
    // Zero residual allowed when both blank → treat as 0
    residualCanonical = 0;
  } else if (!residualAmount.blank) {
    if (residualAmount.invalid || residualAmount.value === null) {
      errors.residualAmount = 'Enter a valid residual amount.';
    } else if (residualAmount.value < 0) {
      errors.residualAmount = 'Residual amount cannot be negative.';
    } else {
      const converted = convertMoney(
        residualAmount.value,
        input.residualCurrency,
        input.productCurrency,
        rates
      );
      if (!converted.ok) {
        errors.form = converted.message;
      } else {
        residualCanonical = converted.amount;
      }
    }
  } else if (!residualPercent.blank) {
    if (residualPercent.invalid || residualPercent.value === null) {
      errors.residualPercent = 'Enter a valid residual percent.';
    } else if (residualPercent.value < 0) {
      errors.residualPercent = 'Residual percent cannot be negative.';
    } else if (residualPercent.value > 100) {
      errors.residualPercent = 'Residual percent cannot exceed 100%.';
    } else if (product.value !== null && product.value > 0) {
      residualCanonical = (product.value * residualPercent.value) / 100;
    }
  }

  let downCanonical = 0;
  if (input.includeDownPayment) {
    if (down.blank) {
      errors.downPayment = 'Enter a down payment, or uncheck Include down payment.';
    } else if (down.invalid || down.value === null) {
      errors.downPayment = 'Enter a valid down payment.';
    } else if (down.value < 0) {
      errors.downPayment = 'Down payment cannot be negative.';
    } else {
      const converted = convertMoney(
        down.value,
        input.downPaymentCurrency,
        input.productCurrency,
        rates
      );
      if (!converted.ok) {
        errors.form = converted.message;
      } else {
        downCanonical = converted.amount;
      }
    }
  }

  if (
    residualCanonical !== null &&
    product.value !== null &&
    residualCanonical > product.value
  ) {
    errors.residualAmount = 'Residual cannot exceed product value.';
  }

  if (
    input.includeDownPayment &&
    product.value !== null &&
    downCanonical > product.value
  ) {
    errors.downPayment = 'Down payment cannot exceed product value.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = termToMonthCount(term.value!, input.termUnit);
  if (paymentCount === null) {
    errors.leaseTerm = 'Lease term must produce a positive number of months.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLease({
    productValue: product.value!,
    residualValue: residualCanonical ?? 0,
    downPayment: downCanonical,
    annualRatePercent: rate.value!,
    paymentCount,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite lease payment.';
    return { isValid: false, errors, result: null };
  }

  const monthlyDisplay = convertMoney(
    computed.monthlyPayment,
    input.productCurrency,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!monthlyDisplay.ok) {
    errors.form = monthlyDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalPaymentsDisplay = convertMoney(
    computed.totalPayments,
    input.productCurrency,
    input.totalPaymentsCurrency,
    rates
  );
  if (!totalPaymentsDisplay.ok) {
    errors.form = totalPaymentsDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const interestDisplay = convertMoney(
    computed.totalInterest,
    input.productCurrency,
    input.totalInterestCurrency,
    rates
  );
  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const costDisplay = convertMoney(
    computed.totalCostToOwn,
    input.productCurrency,
    input.totalCostCurrency,
    rates
  );
  if (!costDisplay.ok) {
    errors.form = costDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: LeaseResult = {
    monthlyPaymentCanonical: computed.monthlyPayment,
    totalPaymentsCanonical: computed.totalPayments,
    totalInterestCanonical: computed.totalInterest,
    totalCostToOwnCanonical: computed.totalCostToOwn,
    monthlyPayment: monthlyDisplay.amount,
    totalPayments: totalPaymentsDisplay.amount,
    totalInterest: interestDisplay.amount,
    totalCostToOwn: costDisplay.amount,
    monthlyPaymentCurrency: input.monthlyPaymentCurrency,
    totalPaymentsCurrency: input.totalPaymentsCurrency,
    totalInterestCurrency: input.totalInterestCurrency,
    totalCostCurrency: input.totalCostCurrency,
    formattedMonthlyPayment: formatLeaseMoney(
      monthlyDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    formattedTotalPayments: formatLeaseMoney(
      totalPaymentsDisplay.amount,
      input.totalPaymentsCurrency
    ),
    formattedTotalInterest: formatLeaseMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
    formattedTotalCostToOwn: formatLeaseMoney(
      costDisplay.amount,
      input.totalCostCurrency
    ),
    paymentCount,
    residualCanonical: residualCanonical ?? 0,
    downPaymentCanonical: downCanonical,
  };

  return { isValid: true, errors: {}, result };
}
