import {
  calculateBalloonPayment,
  formatBalloonMoney,
} from './calculation';
import type {
  BalloonPaymentFieldErrors,
  BalloonPaymentInput,
  BalloonPaymentResult,
} from './types';

export interface BalloonPaymentValidation {
  isValid: boolean;
  errors: BalloonPaymentFieldErrors;
  result: BalloonPaymentResult | null;
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

/** Blank duration part → 0 when the sibling part is filled. */
function resolveDurationPart(
  part: ReturnType<typeof parseNumber>,
  sibling: ReturnType<typeof parseNumber>
): { value: number | null; blank: boolean; invalid: boolean } {
  if (part.blank && sibling.blank) {
    return { value: null, blank: true, invalid: false };
  }
  if (part.blank) {
    return { value: 0, blank: false, invalid: false };
  }
  if (part.invalid || part.value === null) {
    return { value: null, blank: false, invalid: true };
  }
  return { value: part.value, blank: false, invalid: false };
}

/**
 * Validates inputs and computes balloon results in the loan currency at full
 * precision. Display rounding happens only in formatters. Percentages and
 * durations are never FX-converted (FX applies when the loan currency changes).
 */
export function validateBalloonPaymentInput(
  input: BalloonPaymentInput
): BalloonPaymentValidation {
  const errors: BalloonPaymentFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const rate = parseNumber(input.interestRatePercent);
  const amortYRaw = parseNumber(input.amortYears);
  const amortMRaw = parseNumber(input.amortMonths);
  const balloonAfter = parseNumber(input.balloonAfter);

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  const amortY = resolveDurationPart(amortYRaw, amortMRaw);
  const amortM = resolveDurationPart(amortMRaw, amortYRaw);

  if (amortY.invalid) errors.amortYears = 'Enter a valid number of years.';
  else if (amortY.value !== null && amortY.value < 0) {
    errors.amortYears = 'Years cannot be negative.';
  }

  if (amortM.invalid) errors.amortMonths = 'Enter a valid number of months.';
  else if (amortM.value !== null && amortM.value < 0) {
    errors.amortMonths = 'Months cannot be negative.';
  } else if (amortM.value !== null && amortM.value > 11) {
    errors.amortMonths = 'Months must be between 0 and 11.';
  }

  if (
    !amortY.blank &&
    !amortM.blank &&
    !errors.amortYears &&
    !errors.amortMonths &&
    amortY.value !== null &&
    amortM.value !== null &&
    amortY.value * 12 + amortM.value <= 0
  ) {
    errors.amortYears = 'Amortization period must be greater than zero.';
  }

  if (!balloonAfter.blank && (balloonAfter.invalid || balloonAfter.value === null)) {
    errors.balloonAfter = 'Enter a valid balloon payment timing.';
  } else if (
    !balloonAfter.blank &&
    balloonAfter.value !== null &&
    !(balloonAfter.value > 0)
  ) {
    errors.balloonAfter = 'Balloon payment after must be greater than zero.';
  }

  const incomplete =
    loan.blank ||
    rate.blank ||
    amortY.blank ||
    amortM.blank ||
    balloonAfter.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const amortMonthsTotal = amortY.value! * 12 + amortM.value!;
  const balloonMonths =
    input.balloonAfterUnit === 'yrs'
      ? Math.round(balloonAfter.value! * 12)
      : Math.round(balloonAfter.value!);

  if (!(balloonMonths > 0) || balloonMonths > amortMonthsTotal) {
    errors.balloonAfter =
      'Balloon payment after must be greater than zero and not exceed the amortization period.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBalloonPayment({
    loanAmount: loan.value!,
    annualInterestRatePercent: rate.value!,
    amortYears: amortY.value!,
    amortMonths: amortM.value!,
    balloonAfter: balloonAfter.value!,
    balloonAfterUnit: input.balloonAfterUnit,
    compoundingMethod: input.compoundingMethod,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.currency;
  const result: BalloonPaymentResult = {
    monthlyPayment: computed.monthlyPayment,
    balloonPayment: computed.balloonPayment,
    totalMonthlyPayments: computed.totalMonthlyPayments,
    totalRepayment: computed.totalRepayment,
    totalInterest: computed.totalInterest,
    balloonAfterMonths: computed.balloonAfterMonths,
    amortMonthsTotal: computed.amortMonthsTotal,
    currency,
    formattedMonthlyPayment: formatBalloonMoney(
      computed.monthlyPayment,
      currency
    ),
    formattedBalloonPayment: formatBalloonMoney(
      computed.balloonPayment,
      currency
    ),
    formattedTotalMonthlyPayments: formatBalloonMoney(
      computed.totalMonthlyPayments,
      currency
    ),
    formattedTotalRepayment: formatBalloonMoney(
      computed.totalRepayment,
      currency
    ),
    formattedTotalInterest: formatBalloonMoney(
      computed.totalInterest,
      currency
    ),
  };

  return { isValid: true, errors: {}, result };
}
