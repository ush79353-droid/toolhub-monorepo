import {
  calculateEquityRatio,
  calculateFinancialLeverage,
  calculateLiabilitiesToEquity,
  calculateTotalAssets,
  calculateTotalLiabilities,
  formatFlMoney,
  formatLeverage,
  formatPercent,
  interpretFinancialLeverage,
} from './calculation';
import type {
  FinancialLeverageRatioFieldErrors,
  FinancialLeverageRatioInput,
  FinancialLeverageRatioResult,
  FinancialLeverageStatus,
} from './types';

export interface FinancialLeverageRatioValidation {
  isValid: boolean;
  errors: FinancialLeverageRatioFieldErrors;
  result: FinancialLeverageRatioResult | null;
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

export function validateFinancialLeverageRatioInput(
  input: FinancialLeverageRatioInput
): FinancialLeverageRatioValidation {
  const errors: FinancialLeverageRatioFieldErrors = {};
  const currency = input.currency;

  const current = parseNumber(input.currentAssets);
  const nonCurrent = parseNumber(input.nonCurrentAssets);
  const equity = parseNumber(input.totalEquity);

  if (!current.blank) {
    if (current.invalid || current.value === null) {
      errors.currentAssets = 'Enter a valid current assets amount.';
    } else if (current.value < 0) {
      errors.currentAssets = 'Current assets cannot be negative.';
    }
  }
  if (!nonCurrent.blank) {
    if (nonCurrent.invalid || nonCurrent.value === null) {
      errors.nonCurrentAssets = 'Enter a valid non-current assets amount.';
    } else if (nonCurrent.value < 0) {
      errors.nonCurrentAssets = 'Non-current assets cannot be negative.';
    }
  }
  if (!equity.blank) {
    if (equity.invalid || equity.value === null) {
      errors.totalEquity = 'Enter a valid total equity amount.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    current.blank ||
    nonCurrent.blank ||
    equity.blank ||
    current.value === null ||
    nonCurrent.value === null ||
    equity.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const totalAssets = calculateTotalAssets(current.value, nonCurrent.value);
  if (totalAssets === null) {
    return { isValid: false, errors, result: null };
  }

  const totalLiabilities = calculateTotalLiabilities(
    totalAssets,
    equity.value
  );
  const equityRatio = calculateEquityRatio(equity.value, totalAssets);
  const liabilitiesToEquity =
    totalLiabilities === null
      ? null
      : calculateLiabilitiesToEquity(totalLiabilities, equity.value);

  let status: FinancialLeverageStatus = 'valid';
  let warningMessage: string | null =
    'Financial leverage here means the equity multiplier: Total Assets ÷ Total Equity — not debt-to-equity. Amounts share one currency label (no FX conversion).';
  let leverage: number | null = null;
  let isValid = true;

  if (equity.value === 0) {
    status = 'zeroEquity';
    isValid = false;
    warningMessage =
      'Financial leverage cannot be calculated when total equity is zero.';
    errors.form = warningMessage;
  } else {
    leverage = calculateFinancialLeverage(totalAssets, equity.value);
    if (leverage === null) {
      return { isValid: false, errors, result: null };
    }
    if (equity.value < 0) {
      status = 'negativeEquity';
      warningMessage =
        'Negative equity makes conventional financial leverage interpretation unreliable. Review the company’s liabilities and financial position. A more negative ratio is not “safer” than a moderate positive multiplier.';
    } else if (totalLiabilities !== null && totalLiabilities < 0) {
      status = 'inconsistentBalanceSheet';
      warningMessage =
        'Calculated liabilities are negative (equity exceeds assets). That is inconsistent with a standard balance sheet where liabilities are nonnegative — review the inputs.';
    } else if (totalAssets === 0 && equity.value > 0) {
      status = 'inconsistentBalanceSheet';
      warningMessage =
        'Zero assets with positive equity is inconsistent with the ordinary balance-sheet identity for nonnegative liabilities — review the inputs.';
    } else if (leverage > 0 && leverage < 1) {
      status = 'inconsistentBalanceSheet';
      warningMessage =
        'Leverage between 0 and 1 with positive equity is generally inconsistent with Assets = Liabilities + Equity when liabilities are nonnegative.';
    }
  }

  const result: FinancialLeverageRatioResult = {
    currentAssets: current.value,
    nonCurrentAssets: nonCurrent.value,
    totalAssets,
    totalEquity: equity.value,
    financialLeverage: leverage,
    totalLiabilities,
    equityRatio,
    liabilitiesToEquity,
    status,
    interpretation: interpretFinancialLeverage(
      leverage,
      totalAssets,
      equity.value,
      status
    ),
    warningMessage,
    currency,
    formattedCurrentAssets: formatFlMoney(current.value, currency),
    formattedNonCurrentAssets: formatFlMoney(nonCurrent.value, currency),
    formattedTotalAssets: formatFlMoney(totalAssets, currency),
    formattedTotalEquity: formatFlMoney(equity.value, currency),
    formattedFinancialLeverage:
      leverage === null ? null : formatLeverage(leverage),
    formattedTotalLiabilities:
      totalLiabilities === null
        ? null
        : formatFlMoney(totalLiabilities, currency),
    formattedEquityRatio:
      equityRatio === null ? null : formatPercent(equityRatio),
    formattedLiabilitiesToEquity:
      liabilitiesToEquity === null
        ? null
        : formatLeverage(liabilitiesToEquity),
  };

  // Still return result for zero/negative equity so UI can show warnings
  if (status === 'zeroEquity') {
    return { isValid: false, errors, result };
  }

  return { isValid, errors, result };
}
