import {
  calculateCreditUtilization,
  formatCuMoney,
  formatCuPercent,
  interpretCreditUtilization,
  type ValidCreditLine,
} from './calculation';
import type {
  CreditUtilizationFieldErrors,
  CreditUtilizationInput,
  CreditUtilizationResult,
} from './types';

export interface CreditUtilizationValidation {
  isValid: boolean;
  errors: CreditUtilizationFieldErrors;
  result: CreditUtilizationResult | null;
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

export function validateCreditUtilizationInput(
  input: CreditUtilizationInput
): CreditUtilizationValidation {
  const errors: CreditUtilizationFieldErrors = { lines: {} };
  const currency = input.currency;
  const complete: ValidCreditLine[] = [];
  let hasAnyLineInput = false;
  let hasFieldError = false;

  const targetParsed = parseNumber(input.targetUtilization);
  let targetValue: number | null = null;

  if (targetParsed.blank) {
    errors.targetUtilization = 'Enter a target utilization rate (0–100%).';
    hasFieldError = true;
  } else if (targetParsed.invalid || targetParsed.value === null) {
    errors.targetUtilization = 'Enter a valid target utilization percentage.';
    hasFieldError = true;
  } else if (targetParsed.value < 0 || targetParsed.value > 100) {
    errors.targetUtilization = 'Target utilization must be between 0% and 100%.';
    hasFieldError = true;
  } else {
    targetValue = targetParsed.value;
  }

  for (const line of input.lines) {
    const used = parseNumber(line.moneyUsed);
    const limit = parseNumber(line.creditLimit);
    const lineErrors: { moneyUsed?: string; creditLimit?: string } = {};

    if (!used.blank || !limit.blank) hasAnyLineInput = true;

    if (used.blank && limit.blank) continue;

    if (used.blank && !limit.blank) {
      lineErrors.moneyUsed =
        'Enter the money used for this credit line, or enter 0 if no credit has been used.';
      hasFieldError = true;
    } else if (used.invalid || used.value === null) {
      lineErrors.moneyUsed = 'Enter a valid money used amount.';
      hasFieldError = true;
    } else if (used.value < 0) {
      lineErrors.moneyUsed = 'Money used cannot be negative.';
      hasFieldError = true;
    }

    if (limit.blank && !used.blank) {
      lineErrors.creditLimit = 'Enter the credit limit for this credit line.';
      hasFieldError = true;
    } else if (!limit.blank && (limit.invalid || limit.value === null)) {
      lineErrors.creditLimit = 'Enter a valid credit limit.';
      hasFieldError = true;
    } else if (!limit.blank && limit.value !== null && limit.value < 0) {
      lineErrors.creditLimit = 'Credit limit cannot be negative.';
      hasFieldError = true;
    } else if (!limit.blank && limit.value !== null && limit.value === 0) {
      lineErrors.creditLimit = 'Credit limit must be greater than zero.';
      hasFieldError = true;
    }

    if (Object.keys(lineErrors).length > 0) {
      errors.lines![line.id] = lineErrors;
      continue;
    }

    if (
      used.value !== null &&
      used.value >= 0 &&
      limit.value !== null &&
      limit.value > 0
    ) {
      complete.push({
        id: line.id,
        moneyUsed: used.value,
        creditLimit: limit.value,
      });
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (!hasAnyLineInput) {
    return { isValid: false, errors, result: null };
  }

  if (complete.length === 0 || targetValue === null) {
    errors.form =
      'Enter at least one complete credit line (money used and credit limit) to calculate utilization.';
    return { isValid: false, errors, result: null };
  }

  const math = calculateCreditUtilization(complete, targetValue);
  if (math === null) {
    errors.form =
      'Enter valid credit limits greater than zero to calculate utilization.';
    return { isValid: false, errors, result: null };
  }

  const warningParts: string[] = [];
  if (math.overLimitAmount > 0) {
    warningParts.push(
      `Total balances exceed total limits by ${formatCuMoney(math.overLimitAmount, currency)} (over-limit). Utilization is not capped at 100%.`
    );
  }
  if (math.additionalLimitUnavailableReason) {
    warningParts.push(math.additionalLimitUnavailableReason);
  }
  warningParts.push(
    'Illustrative utilization bands are not official scoring cutoffs. This tool does not calculate a credit score. Amounts share one currency label (no FX).'
  );

  const result: CreditUtilizationResult = {
    ...math,
    status: 'valid',
    interpretation: interpretCreditUtilization(
      math.overallUtilization,
      math.interpretationBand,
      math.creditLineCount
    ),
    warningMessage: warningParts.join(' '),
    currency,
    formattedTotalUsed: formatCuMoney(math.totalCreditUsed, currency),
    formattedTotalLimit: formatCuMoney(math.totalCreditLimit, currency),
    formattedAvailable: formatCuMoney(math.remainingAvailableCredit, currency),
    formattedUtilization: formatCuPercent(math.overallUtilization),
    formattedTargetBalance: formatCuMoney(math.targetBalance, currency),
    formattedReduction: formatCuMoney(math.requiredBalanceReduction, currency),
    formattedAdditionalLimit:
      math.additionalCreditLimitNeeded === null
        ? null
        : formatCuMoney(math.additionalCreditLimitNeeded, currency),
  };

  if (Object.keys(errors.lines!).length === 0) {
    delete errors.lines;
  }

  return { isValid: true, errors, result };
}
