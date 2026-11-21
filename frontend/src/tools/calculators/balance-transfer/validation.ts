import {
  calculateTransferFee,
  findBreakEvenMonth,
  formatBtMoney,
  interpretBalanceTransfer,
  requiredPaymentForPromoPayoff,
  resolveNewStartingBalance,
  simulateBalanceTransferCard,
  simulateFixedRateCard,
} from './calculation';
import type {
  BalanceTransferFieldErrors,
  BalanceTransferInput,
  BalanceTransferResult,
  BalanceTransferStatus,
} from './types';

export interface BalanceTransferValidation {
  isValid: boolean;
  errors: BalanceTransferFieldErrors;
  result: BalanceTransferResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function optionalNonneg(
  parsed: ReturnType<typeof parseNumber>
): number | null {
  if (parsed.blank) return 0;
  if (parsed.invalid || parsed.value === null || parsed.value < 0) return null;
  return parsed.value;
}

export function validateBalanceTransferInput(
  input: BalanceTransferInput
): BalanceTransferValidation {
  const errors: BalanceTransferFieldErrors = {};
  const currency = input.currency;

  const balance = parseNumber(input.currentBalance);
  const oldApr = parseNumber(input.oldApr);
  const payment = parseNumber(input.monthlyPayment);
  const transfer = parseNumber(input.transferAmount);
  const fee = parseNumber(input.transferFee);
  const promoApr = parseNumber(input.promotionalApr);
  const promoMonths = parseNumber(input.promotionalMonths);
  const regularApr = parseNumber(input.regularApr);

  if (balance.blank) {
    // required
  } else if (balance.invalid || balance.value === null) {
    errors.currentBalance = 'Enter a valid current balance.';
  } else if (balance.value <= 0) {
    errors.currentBalance = 'Current balance must be greater than zero.';
  }

  if (oldApr.blank) {
    // required
  } else if (oldApr.invalid || oldApr.value === null) {
    errors.oldApr = 'Enter a valid old-card APR.';
  } else if (oldApr.value < 0) {
    errors.oldApr = 'Old APR cannot be negative.';
  }

  if (input.paymentStrategy === 'fixed') {
    if (payment.blank) {
      // required
    } else if (payment.invalid || payment.value === null) {
      errors.monthlyPayment = 'Enter a valid monthly payment.';
    } else if (payment.value <= 0) {
      errors.monthlyPayment = 'Monthly payment must be greater than zero.';
    }
  }

  // Transfer amount: blank → default to current balance when balance ready
  let transferValue: number | null = null;
  if (transfer.blank) {
    if (!balance.blank && balance.value != null && balance.value > 0) {
      transferValue = balance.value;
    }
  } else if (transfer.invalid || transfer.value === null) {
    errors.transferAmount = 'Enter a valid transfer amount.';
  } else if (transfer.value <= 0) {
    errors.transferAmount = 'Transfer amount must be greater than zero.';
  } else if (
    balance.value != null &&
    balance.value > 0 &&
    transfer.value > balance.value + 1e-9
  ) {
    errors.transferAmount = 'Transfer amount cannot exceed the current balance.';
  } else {
    transferValue = transfer.value;
  }

  const feeValue = optionalNonneg(fee);
  if (feeValue === null) {
    errors.transferFee =
      fee.value !== null && fee.value < 0
        ? 'Transfer fee cannot be negative.'
        : 'Enter a valid transfer fee.';
  } else if (
    input.transferFeeType === 'percentage' &&
    feeValue > 100
  ) {
    errors.transferFee = 'Transfer fee percentage cannot exceed 100%.';
  }

  if (promoApr.blank) {
    // default handled as 0 if blank? Spec says editable, can be 0. Treat blank as missing when other fields ready — use 0 if blank for convenience when promotional
  } else if (promoApr.invalid || promoApr.value === null) {
    errors.promotionalApr = 'Enter a valid promotional APR.';
  } else if (promoApr.value < 0) {
    errors.promotionalApr = 'Promotional APR cannot be negative.';
  }

  if (promoMonths.blank) {
    // required
  } else if (
    promoMonths.invalid ||
    promoMonths.value === null ||
    !Number.isInteger(promoMonths.value) ||
    promoMonths.value <= 0
  ) {
    errors.promotionalMonths =
      'Enter a whole number of promotional months greater than zero.';
  }

  if (regularApr.blank) {
    // required for post-promo
  } else if (regularApr.invalid || regularApr.value === null) {
    errors.regularApr = 'Enter a valid post-promotional APR.';
  } else if (regularApr.value < 0) {
    errors.regularApr = 'Post-promotional APR cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const balanceReady =
    !balance.blank && balance.value !== null && balance.value > 0;
  const oldAprReady =
    !oldApr.blank && oldApr.value !== null && oldApr.value >= 0;
  const paymentReady =
    input.paymentStrategy === 'pay-during-promo' ||
    (!payment.blank && payment.value !== null && payment.value > 0);
  const promoAprValue = promoApr.blank ? 0 : promoApr.value!;
  const promoMonthsReady =
    !promoMonths.blank &&
    promoMonths.value !== null &&
    Number.isInteger(promoMonths.value) &&
    promoMonths.value > 0;
  const regularReady =
    !regularApr.blank && regularApr.value !== null && regularApr.value >= 0;

  if (
    !balanceReady ||
    !oldAprReady ||
    !paymentReady ||
    transferValue === null ||
    feeValue === null ||
    !promoMonthsReady ||
    !regularReady
  ) {
    return { isValid: false, errors, result: null };
  }

  const feeAmount = calculateTransferFee(
    transferValue,
    feeValue,
    input.transferFeeType
  );
  if (feeAmount === null) {
    errors.transferFee = 'Could not resolve transfer fee.';
    return { isValid: false, errors, result: null };
  }

  const start = resolveNewStartingBalance(
    transferValue,
    feeAmount,
    input.feeTreatment
  );
  if (start === null) {
    errors.form = 'Could not resolve the new card starting balance.';
    return { isValid: false, errors, result: null };
  }

  const requiredPromoPayment = requiredPaymentForPromoPayoff(
    start.interestBearing,
    promoAprValue,
    promoMonths.value!
  );

  let effectivePayment: number;
  if (input.paymentStrategy === 'pay-during-promo') {
    if (requiredPromoPayment === null) {
      errors.form =
        'Could not compute the payment needed to clear the balance during the promotional period.';
      return { isValid: false, errors, result: null };
    }
    effectivePayment = requiredPromoPayment;
  } else {
    effectivePayment = payment.value!;
  }

  const remainingUntransferred = Math.max(
    0,
    balance.value! - transferValue
  );

  // Old strategy: pay off full current balance on old card
  const oldSim = simulateFixedRateCard(
    balance.value!,
    oldApr.value!,
    effectivePayment
  );
  if (oldSim === null) {
    errors.form = 'Could not simulate the old card repayment.';
    return { isValid: false, errors, result: null };
  }

  const transferSim = simulateBalanceTransferCard({
    newStartingBalance: start.interestBearing,
    promotionalApr: promoAprValue,
    promotionalMonths: promoMonths.value!,
    regularApr: regularApr.value!,
    monthlyPayment: effectivePayment,
    remainingOldBalance: remainingUntransferred,
    oldApr: oldApr.value!,
  });
  if (transferSim === null) {
    errors.form = 'Could not simulate the balance transfer repayment.';
    return { isValid: false, errors, result: null };
  }

  // Costs: principal components cancel when comparing same transferred principal;
  // total cost = interest + fees (+ untransferred interest on new path).
  const oldInterest = oldSim.interest;
  const oldTotalCost = balance.value! + oldInterest;

  const newInterest =
    transferSim.newCard.interest + transferSim.remainingOldInterest;
  // New total cost = original balance + new interest + fee
  // (fee either financed into payments or paid upfront)
  const newTotalCost = balance.value! + newInterest + feeAmount;

  const totalSavings =
    oldSim.neverPaysOff || transferSim.newCard.neverPaysOff
      ? null
      : oldTotalCost - newTotalCost;

  // Break-even: compare interest-only paths on transferred principal (same payment)
  const oldOnTransferOnly = simulateFixedRateCard(
    transferValue,
    oldApr.value!,
    effectivePayment
  );
  const newOnTransferOnly = simulateBalanceTransferCard({
    newStartingBalance: start.interestBearing,
    promotionalApr: promoAprValue,
    promotionalMonths: promoMonths.value!,
    regularApr: regularApr.value!,
    monthlyPayment: effectivePayment,
  });

  let breakEvenMonth: number | null = null;
  if (
    oldOnTransferOnly &&
    newOnTransferOnly &&
    !oldOnTransferOnly.neverPaysOff
  ) {
    breakEvenMonth = findBreakEvenMonth(
      oldOnTransferOnly.cumulativeInterestByMonth,
      newOnTransferOnly.newCard.cumulativeInterestByMonth,
      feeAmount
    );
  }

  let status: BalanceTransferStatus = 'valid';
  const warnings: string[] = [
    'Monthly interest estimate (APR÷12). Issuers often use daily balances — statements may differ. No new purchases, late fees, or penalty APRs modeled.',
  ];

  if (oldSim.neverPaysOff) {
    status = 'neverPaysOff';
    warnings.unshift(
      'Your monthly payment is insufficient to pay off the old-card balance under the selected assumptions.'
    );
    errors.form = warnings[0]!;
  }
  if (transferSim.newCard.neverPaysOff) {
    status = 'neverPaysOff';
    warnings.unshift(
      'Your monthly payment is insufficient to pay off the transfer scenario under the selected assumptions.'
    );
    errors.form = warnings[0]!;
  }

  if (
    breakEvenMonth === null &&
    feeAmount > 0 &&
    totalSavings !== null &&
    totalSavings <= 0
  ) {
    warnings.push(
      'Transfer fees are not recovered during the selected comparison period.'
    );
  }

  const result: BalanceTransferResult = {
    transferFeeAmount: feeAmount,
    newStartingBalance: start.interestBearing,
    upfrontFee: start.upfrontFee,

    oldCardInterest: oldInterest,
    oldCardTotalCost: oldSim.neverPaysOff ? null : oldTotalCost,
    oldCardPayoffMonths: oldSim.months,
    oldCardNeverPaysOff: oldSim.neverPaysOff,

    newCardInterest: newInterest,
    newCardTotalCost: transferSim.newCard.neverPaysOff ? null : newTotalCost,
    newCardPayoffMonths: transferSim.newCard.months,
    newCardNeverPaysOff: transferSim.newCard.neverPaysOff,

    remainingOnOldCard: remainingUntransferred,
    remainingBalanceAfterPromotion: transferSim.remainingAfterPromotion,
    promotionalInterest: transferSim.newCard.interestDuringPromo,
    postPromotionalInterest: transferSim.newCard.interestAfterPromo,

    requiredPromoPayment,
    effectiveMonthlyPayment: effectivePayment,

    totalSavings,
    breakEvenMonth,

    status,
    interpretation: interpretBalanceTransfer(
      totalSavings,
      oldSim.neverPaysOff,
      transferSim.newCard.neverPaysOff,
      currency
    ),
    warningMessage: warnings.join(' '),
    currency,

    formattedTransferFee: formatBtMoney(feeAmount, currency),
    formattedNewStartingBalance: formatBtMoney(
      start.interestBearing,
      currency
    ),
    formattedOldInterest: formatBtMoney(oldInterest, currency),
    formattedOldTotalCost:
      oldSim.neverPaysOff ? null : formatBtMoney(oldTotalCost, currency),
    formattedNewInterest: formatBtMoney(newInterest, currency),
    formattedNewTotalCost: transferSim.newCard.neverPaysOff
      ? null
      : formatBtMoney(newTotalCost, currency),
    formattedRemainingAfterPromo: formatBtMoney(
      transferSim.remainingAfterPromotion,
      currency
    ),
    formattedSavings:
      totalSavings === null ? null : formatBtMoney(totalSavings, currency),
    formattedRequiredPromoPayment:
      requiredPromoPayment === null
        ? null
        : formatBtMoney(requiredPromoPayment, currency),
    formattedEffectivePayment: formatBtMoney(effectivePayment, currency),
  };

  return {
    isValid: status !== 'neverPaysOff',
    errors,
    result,
  };
}
