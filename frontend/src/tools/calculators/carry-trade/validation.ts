import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateCarryTrade,
  explainCarryTrade,
  formatCarryMoney,
  formatCarryMoneySigned,
  formatCarryPercent,
  interpretCarryTrade,
  QUOTE_CONVENTION_NOTE,
} from './calculation';
import type {
  CarryTradeFieldErrors,
  CarryTradeInput,
  CarryTradeResult,
  DayCountBasis,
} from './types';

export interface CarryTradeValidation {
  isValid: boolean;
  errors: CarryTradeFieldErrors;
  result: CarryTradeResult | null;
}

function parseFinite(raw: string): {
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateCarryTradeInput(
  input: CarryTradeInput
): CarryTradeValidation {
  const errors: CarryTradeFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const s0 = parseFinite(input.initialExchangeRate);
  if (s0.blank) {
    errors.initialExchangeRate = 'Enter initial exchange rate.';
    hasError = true;
  } else if (s0.invalid || s0.value === null) {
    errors.initialExchangeRate = 'Enter a valid initial exchange rate.';
    hasError = true;
  } else if (s0.value <= 0) {
    errors.initialExchangeRate = 'Initial exchange rate must be greater than zero.';
    hasError = true;
  }

  const s1 = parseFinite(input.settlementExchangeRate);
  if (s1.blank) {
    errors.settlementExchangeRate = 'Enter settlement exchange rate.';
    hasError = true;
  } else if (s1.invalid || s1.value === null) {
    errors.settlementExchangeRate = 'Enter a valid settlement exchange rate.';
    hasError = true;
  } else if (s1.value <= 0) {
    errors.settlementExchangeRate =
      'Settlement exchange rate must be greater than zero.';
    hasError = true;
  }

  const days = parseFinite(input.days);
  if (days.blank) {
    errors.days = 'Enter days until trade settles.';
    hasError = true;
  } else if (days.invalid || days.value === null) {
    errors.days = 'Enter a valid number of days.';
    hasError = true;
  } else if (days.value <= 0) {
    errors.days = 'Days must be greater than zero.';
    hasError = true;
  }

  const lend = parseFinite(input.lendingRatePercent);
  if (lend.blank) {
    errors.lendingRatePercent = 'Enter lending rate.';
    hasError = true;
  } else if (lend.invalid || lend.value === null) {
    errors.lendingRatePercent = 'Enter a valid lending rate.';
    hasError = true;
  }

  const borrow = parseFinite(input.borrowingRatePercent);
  if (borrow.blank) {
    errors.borrowingRatePercent = 'Enter borrowing rate.';
    hasError = true;
  } else if (borrow.invalid || borrow.value === null) {
    errors.borrowingRatePercent = 'Enter a valid borrowing rate.';
    hasError = true;
  }

  const amount = parseFinite(input.amountInvested);
  if (amount.blank) {
    errors.amountInvested = 'Enter amount invested.';
    hasError = true;
  } else if (amount.invalid || amount.value === null) {
    errors.amountInvested = 'Enter a valid amount invested.';
    hasError = true;
  } else if (amount.value < 0) {
    errors.amountInvested = 'Amount invested cannot be negative.';
    hasError = true;
  }

  const basis: DayCountBasis =
    input.dayCountBasis === 360 || input.dayCountBasis === 365
      ? input.dayCountBasis
      : 365;
  if (input.dayCountBasis !== 360 && input.dayCountBasis !== 365) {
    errors.dayCountBasis = 'Day-count basis must be 360 or 365.';
    hasError = true;
  }

  if (
    hasError ||
    s0.value === null ||
    s1.value === null ||
    days.value === null ||
    lend.value === null ||
    borrow.value === null ||
    amount.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateCarryTrade(
    s0.value,
    s1.value,
    days.value,
    lend.value / 100,
    borrow.value / 100,
    amount.value,
    basis
  );
  if (!math) {
    errors.form = 'Unable to calculate carry trade under the selected inputs.';
    return { isValid: false, errors, result: null };
  }

  const totalReturnPercent = math.totalReturn * 100;
  const approxPercent = math.approximateReturn * 100;

  const result: CarryTradeResult = {
    spotRateDifferentialPercent: math.spotRateDifferentialPercent,
    lendingPeriodReturnPercent: math.lendingPeriodReturn * 100,
    borrowingPeriodCostPercent: math.borrowingPeriodCost * 100,
    netInterestDifferentialPercent: math.netInterestDifferential * 100,
    investmentProceeds: math.investmentProceeds,
    borrowingRepayment: math.borrowingRepayment,
    carryTradeProfit: math.carryTradeProfit,
    totalReturnPercent,
    approximateReturnPercent: approxPercent,
    dayCountBasis: basis,
    currency,
    formattedSpotRateDifferential: formatCarryPercent(
      math.spotRateDifferentialPercent
    ),
    formattedLendingPeriodReturn: formatCarryPercent(
      math.lendingPeriodReturn * 100
    ),
    formattedBorrowingPeriodCost: formatCarryPercent(
      math.borrowingPeriodCost * 100
    ),
    formattedNetInterestDifferential: formatCarryPercent(
      math.netInterestDifferential * 100
    ),
    formattedInvestmentProceeds: `${symbol}${formatCarryMoney(math.investmentProceeds, currency)}`,
    formattedBorrowingRepayment: `${symbol}${formatCarryMoney(math.borrowingRepayment, currency)}`,
    formattedCarryTradeProfit: formatCarryMoneySigned(
      math.carryTradeProfit,
      currency
    ),
    formattedTotalReturn: formatCarryPercent(totalReturnPercent),
    formattedApproximateReturn: formatCarryPercent(approxPercent),
    formattedAmountInvested: `${symbol}${formatCarryMoney(amount.value, currency)}`,
    interpretation: interpretCarryTrade(
      math.carryTradeProfit,
      totalReturnPercent
    ),
    explanation: explainCarryTrade(
      math.carryTradeProfit,
      totalReturnPercent,
      currency
    ),
    quoteConventionNote: QUOTE_CONVENTION_NOTE,
  };

  return { isValid: true, errors, result };
}
