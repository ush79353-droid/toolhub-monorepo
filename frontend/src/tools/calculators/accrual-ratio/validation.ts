import {
  calculateAverageNetOperatingAssets,
  calculateBalanceSheetAccrualRatio,
  calculateCashFlowAccrualRatio,
  calculateCashFlowAccruals,
  calculateChangeInNetOperatingAssets,
  calculateNetOperatingAssets,
  formatAccrualMoney,
  formatAccrualPercent,
  interpretAccrualRatio,
  validateAccrualRatioDenominator,
} from './calculation';
import type {
  AccrualRatioFieldErrors,
  AccrualRatioInput,
  AccrualRatioResult,
  AccrualRatioStatus,
} from './types';

export interface AccrualRatioValidation {
  isValid: boolean;
  errors: AccrualRatioFieldErrors;
  result: AccrualRatioResult | null;
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

function parseNonNegativeAsset(
  raw: string,
  field: keyof AccrualRatioFieldErrors,
  errors: AccrualRatioFieldErrors,
  label: string
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) return null;
  if (parsed.invalid || parsed.value === null) {
    errors[field] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[field] = `${label} cannot be negative.`;
    return null;
  }
  return parsed.value;
}

/** Signed amount (net income / OCF). Blank waits. */
function parseSigned(
  raw: string,
  field: keyof AccrualRatioFieldErrors,
  errors: AccrualRatioFieldErrors,
  label: string
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) return null;
  if (parsed.invalid || parsed.value === null) {
    errors[field] = `Enter a valid ${label}.`;
    return null;
  }
  return parsed.value;
}

export function validateAccrualRatioInput(
  input: AccrualRatioInput
): AccrualRatioValidation {
  const errors: AccrualRatioFieldErrors = {};
  const currency = input.currency;

  const beginningAssets = parseNonNegativeAsset(
    input.beginningOperatingAssets,
    'beginningOperatingAssets',
    errors,
    'beginning operating assets'
  );
  const beginningLiabilities = parseNonNegativeAsset(
    input.beginningOperatingLiabilities,
    'beginningOperatingLiabilities',
    errors,
    'beginning operating liabilities'
  );
  const endingAssets = parseNonNegativeAsset(
    input.endingOperatingAssets,
    'endingOperatingAssets',
    errors,
    'ending operating assets'
  );
  const endingLiabilities = parseNonNegativeAsset(
    input.endingOperatingLiabilities,
    'endingOperatingLiabilities',
    errors,
    'ending operating liabilities'
  );

  let netIncome: number | null = null;
  let operatingCashFlow: number | null = null;
  if (input.method === 'cashFlow') {
    netIncome = parseSigned(input.netIncome, 'netIncome', errors, 'net income');
    operatingCashFlow = parseSigned(
      input.operatingCashFlow,
      'operatingCashFlow',
      errors,
      'operating cash flow'
    );
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    beginningAssets === null ||
    beginningLiabilities === null ||
    endingAssets === null ||
    endingLiabilities === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (
    input.method === 'cashFlow' &&
    (netIncome === null || operatingCashFlow === null)
  ) {
    return { isValid: false, errors, result: null };
  }

  const beginningNOA = calculateNetOperatingAssets(
    beginningAssets,
    beginningLiabilities
  );
  const endingNOA = calculateNetOperatingAssets(endingAssets, endingLiabilities);
  if (beginningNOA === null || endingNOA === null) {
    return { isValid: false, errors, result: null };
  }

  const averageNOA = calculateAverageNetOperatingAssets(
    beginningNOA,
    endingNOA
  );
  const changeInNOA = calculateChangeInNetOperatingAssets(
    beginningNOA,
    endingNOA
  );
  if (averageNOA === null || changeInNOA === null) {
    return { isValid: false, errors, result: null };
  }

  const denom = validateAccrualRatioDenominator(averageNOA, currency);

  let cashFlowAccruals: number | null = null;
  let accrualRatio: number | null = null;
  let status: AccrualRatioStatus = denom.status;
  let warningMessage = denom.warningMessage;

  if (denom.status === 'zeroDenominator') {
    accrualRatio = null;
  } else if (input.method === 'balanceSheet') {
    accrualRatio = calculateBalanceSheetAccrualRatio(changeInNOA, averageNOA);
    if (accrualRatio === null) status = 'invalid';
  } else {
    cashFlowAccruals = calculateCashFlowAccruals(
      netIncome!,
      operatingCashFlow!
    );
    if (cashFlowAccruals === null) {
      return { isValid: false, errors, result: null };
    }
    accrualRatio = calculateCashFlowAccrualRatio(
      cashFlowAccruals,
      averageNOA
    );
    if (accrualRatio === null) status = 'invalid';
  }

  if (accrualRatio !== null && denom.status === 'valid') {
    status = 'valid';
  } else if (accrualRatio !== null && denom.status === 'negativeDenominator') {
    status = 'negativeDenominator';
  }

  const accrualRatioPercent =
    accrualRatio === null ? null : accrualRatio * 100;

  const interpretation = interpretAccrualRatio(
    accrualRatio,
    status,
    input.method
  );

  const result: AccrualRatioResult = {
    method: input.method,
    beginningNOA,
    endingNOA,
    averageNOA,
    changeInNOA,
    cashFlowAccruals,
    accrualRatio,
    accrualRatioPercent,
    status,
    warningMessage,
    interpretation,
    currency,
    formattedBeginningNOA: formatAccrualMoney(beginningNOA, currency),
    formattedEndingNOA: formatAccrualMoney(endingNOA, currency),
    formattedAverageNOA: formatAccrualMoney(averageNOA, currency),
    formattedChangeInNOA: formatAccrualMoney(changeInNOA, currency),
    formattedCashFlowAccruals:
      cashFlowAccruals === null
        ? null
        : formatAccrualMoney(cashFlowAccruals, currency),
    formattedAccrualRatioPercent:
      accrualRatioPercent === null
        ? null
        : formatAccrualPercent(accrualRatioPercent),
    formattedNetIncome:
      netIncome === null ? null : formatAccrualMoney(netIncome, currency),
    formattedOperatingCashFlow:
      operatingCashFlow === null
        ? null
        : formatAccrualMoney(operatingCashFlow, currency),
  };

  return { isValid: true, errors, result };
}
