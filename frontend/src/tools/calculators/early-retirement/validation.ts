import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEarlyRetirement,
  formatDurationLabel,
  formatEarlyRetirementMoney,
  roundMoneyAmount,
} from './calculation';
import type {
  EarlyRetirementFieldErrors,
  EarlyRetirementInput,
  EarlyRetirementResult,
} from './types';

export interface EarlyRetirementValidation {
  isValid: boolean;
  errors: EarlyRetirementFieldErrors;
  result: EarlyRetirementResult | null;
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

export function validateEarlyRetirementInput(
  input: EarlyRetirementInput
): EarlyRetirementValidation {
  const errors: EarlyRetirementFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const netIncome = parseNumber(input.netIncome);
  if (netIncome.blank) {
    errors.netIncome = 'Enter annual net income.';
    hasFieldError = true;
  } else if (netIncome.invalid || netIncome.value === null) {
    errors.netIncome = 'Enter a valid annual net income.';
    hasFieldError = true;
  } else if (netIncome.value < 0) {
    errors.netIncome = 'Net income cannot be negative.';
    hasFieldError = true;
  }

  const expenses = parseNumber(input.expenses);
  if (expenses.blank) {
    errors.expenses = 'Enter annual expenses.';
    hasFieldError = true;
  } else if (expenses.invalid || expenses.value === null) {
    errors.expenses = 'Enter a valid annual expense amount.';
    hasFieldError = true;
  } else if (expenses.value < 0) {
    errors.expenses = 'Expenses cannot be negative.';
    hasFieldError = true;
  }

  const initialBalance = parseNumber(input.initialBalance);
  if (initialBalance.blank) {
    errors.initialBalance = 'Enter the initial balance (use 0 if none).';
    hasFieldError = true;
  } else if (initialBalance.invalid || initialBalance.value === null) {
    errors.initialBalance = 'Enter a valid initial balance.';
    hasFieldError = true;
  } else if (initialBalance.value < 0) {
    errors.initialBalance = 'Initial balance cannot be negative.';
    hasFieldError = true;
  }

  const roi = parseNumber(input.returnOnInvestment);
  if (roi.blank) {
    errors.returnOnInvestment = 'Enter the expected annual return.';
    hasFieldError = true;
  } else if (roi.invalid || roi.value === null) {
    errors.returnOnInvestment = 'Enter a valid annual return.';
    hasFieldError = true;
  } else if (roi.value < -99.999) {
    errors.returnOnInvestment = 'Annual return cannot be −100% or lower.';
    hasFieldError = true;
  }

  const wr = parseNumber(input.withdrawalRate);
  if (wr.blank) {
    errors.withdrawalRate = 'Enter the withdrawal rate.';
    hasFieldError = true;
  } else if (wr.invalid || wr.value === null) {
    errors.withdrawalRate = 'Enter a valid withdrawal rate.';
    hasFieldError = true;
  } else if (!(wr.value > 0)) {
    errors.withdrawalRate = 'Withdrawal rate must be greater than zero.';
    hasFieldError = true;
  } else if (wr.value > 100) {
    errors.withdrawalRate = 'Withdrawal rate cannot exceed 100%.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    netIncome.value === null ||
    expenses.value === null ||
    initialBalance.value === null ||
    roi.value === null ||
    wr.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateEarlyRetirement({
    netIncome: netIncome.value,
    expenses: expenses.value,
    initialBalance: initialBalance.value,
    annualReturnPercent: roi.value,
    withdrawalRatePercent: wr.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate with these inputs.';
    return { isValid: false, errors, result: null };
  }

  if (math.unreachable && !Number.isFinite(math.requiredBalance)) {
    errors.withdrawalRate =
      math.statusMessage ?? 'Withdrawal rate must be greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const monthlyDeposit = roundMoneyAmount(math.monthlyDeposit, currency);
  const requiredBalance = roundMoneyAmount(math.requiredBalance, currency);
  const totalContribution = roundMoneyAmount(math.totalContribution, currency);
  const totalInterest = roundMoneyAmount(math.totalInterest, currency);

  const money = (n: number) =>
    `${symbol}${formatEarlyRetirementMoney(n, currency)}`;

  const result: EarlyRetirementResult = {
    netIncome: netIncome.value,
    expenses: expenses.value,
    initialBalance: initialBalance.value,
    monthlyDeposit,
    annualReturnPercent: roi.value,
    withdrawalRatePercent: wr.value,
    requiredBalance,
    totalContribution,
    totalInterest,
    monthsExact: math.monthsExact,
    monthsWhole: math.monthsWhole,
    yearsPart: math.yearsPart,
    monthsPart: math.monthsPart,
    durationYears: math.durationYears,
    durationMonths: math.durationMonths,
    alreadyIndependent: math.alreadyIndependent,
    unreachable: math.unreachable,
    statusMessage: math.statusMessage,
    currency,
    formattedMonthlyDeposit: money(monthlyDeposit),
    formattedRequiredBalance: money(requiredBalance),
    formattedTotalContribution: money(totalContribution),
    formattedTotalInterest: money(totalInterest),
    formattedDuration: formatDurationLabel(
      math.yearsPart,
      math.monthsPart,
      math.monthsWhole,
      input.durationUnit
    ),
    contributionTimingNote:
      'Monthly deposits are applied at the end of each month (ordinary annuity). The monthly rate uses (1 + annual return)^(1/12) − 1.',
  };

  return { isValid: !math.unreachable, errors, result };
}
