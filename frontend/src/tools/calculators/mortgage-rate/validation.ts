import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMortgageRate,
  formatAprPercent,
  formatMortgageRateMoney,
  termToMonths,
} from './calculation';
import type {
  MortgageRateFieldErrors,
  MortgageRateInput,
  MortgageRateResult,
} from './types';

export interface MortgageRateValidation {
  isValid: boolean;
  errors: MortgageRateFieldErrors;
  result: MortgageRateResult | null;
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
 * Validates inputs, normalizes mixed-currency money into loan currency,
 * runs the fixed-rate engine at full precision, then converts money results
 * into their independent display currencies (display-only rounding).
 */
export function validateMortgageRateInput(
  input: MortgageRateInput,
  rates?: CurrencyRatesSnapshot | null
): MortgageRateValidation {
  const errors: MortgageRateFieldErrors = {};

  const loan = parseNumber(input.loanBalance);
  const term = parseNumber(input.mortgageTerm);
  const rate = parseNumber(input.mortgageRatePercent);
  const points = parseNumber(input.mortgagePointsPercent);
  const fee = parseNumber(input.upfrontFee);
  const annual = parseNumber(input.annualFee);

  if (loan.blank) {
    errors.loanBalance = 'Enter a loan balance.';
  } else if (loan.invalid || loan.value === null) {
    errors.loanBalance = 'Enter a valid loan balance.';
  } else if (!(loan.value > 0)) {
    errors.loanBalance = 'Loan balance must be greater than zero.';
  }

  if (term.blank) {
    errors.mortgageTerm = 'Enter a mortgage term.';
  } else if (term.invalid || term.value === null) {
    errors.mortgageTerm = 'Enter a valid mortgage term.';
  } else if (!(term.value > 0)) {
    errors.mortgageTerm = 'Mortgage term must be greater than zero.';
  }

  if (rate.blank) {
    errors.mortgageRatePercent = 'Enter a mortgage rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.mortgageRatePercent = 'Enter a valid mortgage rate.';
  } else if (rate.value < 0) {
    errors.mortgageRatePercent = 'Mortgage rate cannot be negative.';
  }

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
    input.loanCurrency,
    rates
  );
  if (!feeInLoan.ok) {
    errors.form = feeInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const annualInLoan = convertMoney(
    annual.value!,
    input.annualFeeCurrency,
    input.loanCurrency,
    rates
  );
  if (!annualInLoan.ok) {
    errors.form = annualInLoan.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMortgageRate({
    loanBalance: loan.value!,
    termMonths,
    mortgageRatePercent: rate.value!,
    compounding: input.compounding,
    mortgagePointsPercent: points.value!,
    upfrontFee: feeInLoan.amount,
    annualFee: annualInLoan.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const paymentOut = convertMoney(
    computed.monthlyPayment,
    input.loanCurrency,
    input.paymentCurrency,
    rates
  );
  if (!paymentOut.ok) {
    errors.form = paymentOut.message;
    return { isValid: false, errors, result: null };
  }

  const interestOut = convertMoney(
    computed.paidInterest,
    input.loanCurrency,
    input.interestCurrency,
    rates
  );
  if (!interestOut.ok) {
    errors.form = interestOut.message;
    return { isValid: false, errors, result: null };
  }

  const totalOut = convertMoney(
    computed.totalPayments,
    input.loanCurrency,
    input.totalCurrency,
    rates
  );
  if (!totalOut.ok) {
    errors.form = totalOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: MortgageRateResult = {
    monthlyPaymentInLoan: computed.monthlyPayment,
    monthlyPayment: paymentOut.amount,
    formattedMonthlyPayment: formatMortgageRateMoney(
      paymentOut.amount,
      input.paymentCurrency
    ),
    aprPercent: computed.aprPercent,
    formattedApr: formatAprPercent(computed.aprPercent),
    paidInterestInLoan: computed.paidInterest,
    paidInterest: interestOut.amount,
    formattedPaidInterest: formatMortgageRateMoney(
      interestOut.amount,
      input.interestCurrency
    ),
    totalPaymentsInLoan: computed.totalPayments,
    totalPayments: totalOut.amount,
    formattedTotalPayments: formatMortgageRateMoney(
      totalOut.amount,
      input.totalCurrency
    ),
    pointsCostInLoan: computed.pointsCost,
    loanCurrency: input.loanCurrency,
    paymentCurrency: input.paymentCurrency,
    interestCurrency: input.interestCurrency,
    totalCurrency: input.totalCurrency,
  };

  return { isValid: true, errors: {}, result };
}
