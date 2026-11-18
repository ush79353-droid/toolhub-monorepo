import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMortgageInterest,
  formatAprPercent,
  formatMortgageInterestMoney,
  termToMonths,
} from './calculation';
import type {
  MortgageInterestFieldErrors,
  MortgageInterestInput,
  MortgageInterestResult,
} from './types';

export interface MortgageInterestValidation {
  isValid: boolean;
  errors: MortgageInterestFieldErrors;
  result: MortgageInterestResult | null;
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
 * Validates inputs, normalizes mixed-currency fees into principal currency,
 * runs the fixed-rate engine at full precision, then converts money results
 * into their independent display currencies (display-only rounding).
 */
export function validateMortgageInterestInput(
  input: MortgageInterestInput,
  rates?: CurrencyRatesSnapshot | null
): MortgageInterestValidation {
  const errors: MortgageInterestFieldErrors = {};

  const principal = parseNumber(input.principal);
  const term = parseNumber(input.mortgageTerm);
  const rate = parseNumber(input.interestRatePercent);
  const points = parseNumber(input.addFees ? input.mortgagePointsPercent : '0');
  const fee = parseNumber(input.addFees ? input.upfrontFee : '0');
  const annual = parseNumber(input.addFees ? input.annualFee : '0');

  if (principal.blank) {
    errors.principal = 'Enter a mortgage principal.';
  } else if (principal.invalid || principal.value === null) {
    errors.principal = 'Enter a valid mortgage principal.';
  } else if (!(principal.value > 0)) {
    errors.principal = 'Mortgage principal must be greater than zero.';
  }

  if (term.blank) {
    errors.mortgageTerm = 'Enter a mortgage term.';
  } else if (term.invalid || term.value === null) {
    errors.mortgageTerm = 'Enter a valid mortgage term.';
  } else if (!(term.value > 0)) {
    errors.mortgageTerm = 'Mortgage term must be greater than zero.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (input.addFees) {
    if (points.blank) {
      errors.mortgagePointsPercent = 'Enter mortgage points.';
    } else if (points.invalid || points.value === null) {
      errors.mortgagePointsPercent = 'Enter valid mortgage points.';
    } else if (points.value < 0) {
      errors.mortgagePointsPercent = 'Mortgage points cannot be negative.';
    }

    if (fee.blank) {
      errors.upfrontFee = 'Enter an up-front fee.';
    } else if (fee.invalid || fee.value === null) {
      errors.upfrontFee = 'Enter a valid up-front fee.';
    } else if (fee.value < 0) {
      errors.upfrontFee = 'Up-front fee cannot be negative.';
    }

    if (annual.blank) {
      errors.annualFee = 'Enter an annual fee.';
    } else if (annual.invalid || annual.value === null) {
      errors.annualFee = 'Enter a valid annual fee.';
    } else if (annual.value < 0) {
      errors.annualFee = 'Annual fee cannot be negative.';
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.scheduleFrom.trim())) {
    errors.scheduleFrom = 'Enter a valid schedule start date.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termMonths = termToMonths(term.value!, input.termUnit);
  if (termMonths === null) {
    errors.mortgageTerm = 'Mortgage term must produce a positive number of months.';
    return { isValid: false, errors, result: null };
  }

  const feeInLoan = convertMoney(
    fee.value!,
    input.upfrontFeeCurrency,
    input.principalCurrency,
    rates
  );
  if (!feeInLoan.ok) {
    errors.form = feeInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const annualInLoan = convertMoney(
    annual.value!,
    input.annualFeeCurrency,
    input.principalCurrency,
    rates
  );
  if (!annualInLoan.ok) {
    errors.form = annualInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMortgageInterest({
    principal: principal.value!,
    termMonths,
    interestRatePercent: rate.value!,
    compounding: input.compounding,
    mortgagePointsPercent: points.value!,
    upfrontFee: feeInLoan.amount,
    annualFee: annualInLoan.amount,
    scheduleFrom: input.scheduleFrom.trim(),
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const paymentOut = convertMoney(
    computed.monthlyPayment,
    input.principalCurrency,
    input.paymentCurrency,
    rates
  );
  if (!paymentOut.ok) {
    errors.form = paymentOut.message;
    return { isValid: false, errors, result: null };
  }

  const interestOut = convertMoney(
    computed.mortgageInterest,
    input.principalCurrency,
    input.interestCurrency,
    rates
  );
  if (!interestOut.ok) {
    errors.form = interestOut.message;
    return { isValid: false, errors, result: null };
  }

  const totalOut = convertMoney(
    computed.totalPayments,
    input.principalCurrency,
    input.totalCurrency,
    rates
  );
  if (!totalOut.ok) {
    errors.form = totalOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: MortgageInterestResult = {
    monthlyPaymentInLoan: computed.monthlyPayment,
    monthlyPayment: paymentOut.amount,
    formattedMonthlyPayment: formatMortgageInterestMoney(
      paymentOut.amount,
      input.paymentCurrency
    ),
    aprPercent: computed.aprPercent,
    formattedApr: formatAprPercent(computed.aprPercent),
    mortgageInterestInLoan: computed.mortgageInterest,
    mortgageInterest: interestOut.amount,
    formattedMortgageInterest: formatMortgageInterestMoney(
      interestOut.amount,
      input.interestCurrency
    ),
    totalPaymentsInLoan: computed.totalPayments,
    totalPayments: totalOut.amount,
    formattedTotalPayments: formatMortgageInterestMoney(
      totalOut.amount,
      input.totalCurrency
    ),
    pointsCostInLoan: computed.pointsCost,
    chartPoints: computed.chartPoints,
    schedule: computed.schedule,
    loanCurrency: input.principalCurrency,
    paymentCurrency: input.paymentCurrency,
    interestCurrency: input.interestCurrency,
    totalCurrency: input.totalCurrency,
  };

  return { isValid: true, errors: {}, result };
}
