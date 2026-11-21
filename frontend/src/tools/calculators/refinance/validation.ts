import {
  calculateRefinance,
  formatTermLabel,
  formatUsd,
} from './calculation';
import type {
  RefinanceFieldErrors,
  RefinanceInput,
  RefinanceResult,
} from './types';

export interface RefinanceValidation {
  isValid: boolean;
  errors: RefinanceFieldErrors;
  result: RefinanceResult | null;
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

export function validateRefinanceInput(
  input: RefinanceInput
): RefinanceValidation {
  const errors: RefinanceFieldErrors = {};

  const balance = parseNumber(input.remainingBalance);
  const payment = parseNumber(input.monthlyPayment);
  const currentRate = parseNumber(input.currentRatePercent);
  const termYears = parseNumber(input.newTermYears);
  const newRate = parseNumber(input.newRatePercent);
  const points = parseNumber(input.points);
  const fees = parseNumber(input.costsAndFees);
  const cashOut = parseNumber(input.cashOutAmount);

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.remainingBalance = 'Enter a valid remaining balance.';
  } else if (balance.value !== null && balance.value < 0) {
    errors.remainingBalance = 'Remaining balance must be zero or greater.';
  }

  if (!payment.blank && (payment.invalid || payment.value === null)) {
    errors.monthlyPayment = 'Enter a valid monthly payment.';
  } else if (payment.value !== null && !(payment.value > 0)) {
    errors.monthlyPayment = 'Monthly payment must be greater than zero.';
  }

  if (!currentRate.blank && (currentRate.invalid || currentRate.value === null)) {
    errors.currentRatePercent = 'Enter a valid interest rate.';
  } else if (currentRate.value !== null && currentRate.value < 0) {
    errors.currentRatePercent = 'Interest rate cannot be negative.';
  }

  if (!termYears.blank && (termYears.invalid || termYears.value === null)) {
    errors.newTermYears = 'Enter a valid loan term in years.';
  } else if (termYears.value !== null && !(termYears.value > 0)) {
    errors.newTermYears = 'New loan term must be greater than zero.';
  }

  if (!newRate.blank && (newRate.invalid || newRate.value === null)) {
    errors.newRatePercent = 'Enter a valid interest rate.';
  } else if (newRate.value !== null && newRate.value < 0) {
    errors.newRatePercent = 'Interest rate cannot be negative.';
  }

  if (!points.blank && (points.invalid || points.value === null)) {
    errors.points = 'Enter a valid points value.';
  } else if (points.value !== null && points.value < 0) {
    errors.points = 'Points cannot be negative.';
  }

  if (!fees.blank && (fees.invalid || fees.value === null)) {
    errors.costsAndFees = 'Enter a valid costs and fees amount.';
  } else if (fees.value !== null && fees.value < 0) {
    errors.costsAndFees = 'Costs and fees cannot be negative.';
  }

  if (!cashOut.blank && (cashOut.invalid || cashOut.value === null)) {
    errors.cashOutAmount = 'Enter a valid cash-out amount.';
  } else if (cashOut.value !== null && cashOut.value < 0) {
    errors.cashOutAmount = 'Cash-out amount cannot be negative.';
  }

  const incomplete =
    balance.blank ||
    payment.blank ||
    currentRate.blank ||
    termYears.blank ||
    newRate.blank ||
    points.blank ||
    fees.blank ||
    cashOut.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRefinance({
    remainingBalance: balance.value!,
    currentMonthlyPayment: payment.value!,
    currentRatePercent: currentRate.value!,
    newTermYears: termYears.value!,
    newRatePercent: newRate.value!,
    pointsPercent: points.value!,
    costsAndFees: fees.value!,
    cashOutAmount: cashOut.value!,
  });

  if (computed === null) {
    errors.form =
      'Could not solve this refinance. Check that the current payment covers interest and all inputs are finite.';
    return { isValid: false, errors, result: null };
  }

  const breakEvenLabel =
    computed.breakEvenMonths === null
      ? 'No break-even (no monthly savings)'
      : computed.breakEvenMonths === 0
        ? 'Immediate (no closing costs)'
        : `${formatUsd(computed.breakEvenMonths)} months (~${formatTermLabel(computed.breakEvenMonths)})`;

  const result: RefinanceResult = {
    currentRemainingMonths: computed.currentRemainingMonths,
    currentRemainingTermLabel: formatTermLabel(computed.currentRemainingMonths),
    currentRemainingInterest: computed.currentRemainingInterest,
    newMonthlyPayment: computed.newMonthlyPayment,
    newLoanAmount: computed.newLoanAmount,
    pointsCost: computed.pointsCost,
    closingCosts: computed.closingCosts,
    monthlyPaymentDiff: computed.monthlyPaymentDiff,
    currentTotalInterest: computed.currentTotalInterest,
    newTotalInterest: computed.newTotalInterest,
    interestDiff: computed.interestDiff,
    breakEvenMonths: computed.breakEvenMonths,
    breakEvenLabel,
    netSavings: computed.netSavings,
    formatted: {
      remainingBalance: formatUsd(balance.value!),
      currentPayment: formatUsd(payment.value!),
      currentInterest: formatUsd(computed.currentRemainingInterest),
      newPayment: formatUsd(computed.newMonthlyPayment),
      newLoanAmount: formatUsd(computed.newLoanAmount),
      pointsCost: formatUsd(computed.pointsCost),
      closingCosts: formatUsd(computed.closingCosts),
      monthlyDiff: formatUsd(computed.monthlyPaymentDiff),
      currentTotalInterest: formatUsd(computed.currentTotalInterest),
      newTotalInterest: formatUsd(computed.newTotalInterest),
      interestDiff: formatUsd(computed.interestDiff),
      netSavings: formatUsd(computed.netSavings),
    },
  };

  return { isValid: true, errors, result };
}
