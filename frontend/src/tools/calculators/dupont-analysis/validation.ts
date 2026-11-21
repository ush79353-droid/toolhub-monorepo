import {
  calculateDupontAnalysis,
  formatDupontPercent,
  formatDupontRatio,
  interpretDupont,
} from './calculation';
import type {
  DupontFieldErrors,
  DupontInput,
  DupontResult,
} from './types';

export interface DupontValidation {
  isValid: boolean;
  errors: DupontFieldErrors;
  result: DupontResult | null;
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

export function validateDupontInput(input: DupontInput): DupontValidation {
  const errors: DupontFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const sales = parseNumber(input.sales);
  if (sales.blank) {
    errors.sales = 'Enter sales (revenue).';
    hasFieldError = true;
  } else if (sales.invalid || sales.value === null) {
    errors.sales = 'Enter a valid sales amount.';
    hasFieldError = true;
  } else if (sales.value <= 0) {
    errors.sales =
      'Sales must be greater than zero to calculate net profit margin.';
    hasFieldError = true;
  }

  const netIncome = parseNumber(input.netIncome);
  if (netIncome.blank) {
    errors.netIncome = 'Enter net income (use 0 or a negative value for a loss).';
    hasFieldError = true;
  } else if (netIncome.invalid || netIncome.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasFieldError = true;
  }

  const assets = parseNumber(input.totalAssets);
  if (assets.blank) {
    errors.totalAssets = 'Enter total assets.';
    hasFieldError = true;
  } else if (assets.invalid || assets.value === null) {
    errors.totalAssets = 'Enter a valid total assets amount.';
    hasFieldError = true;
  } else if (assets.value <= 0) {
    errors.totalAssets = 'Total assets must be greater than zero.';
    hasFieldError = true;
  }

  const equity = parseNumber(input.totalEquity);
  if (equity.blank) {
    errors.totalEquity = 'Enter total equity.';
    hasFieldError = true;
  } else if (equity.invalid || equity.value === null) {
    errors.totalEquity = 'Enter a valid total equity amount.';
    hasFieldError = true;
  } else if (equity.value === 0) {
    errors.totalEquity =
      'Total equity cannot be zero when calculating financial leverage and return on equity.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    sales.value === null ||
    netIncome.value === null ||
    assets.value === null ||
    equity.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateDupontAnalysis({
    sales: sales.value,
    netIncome: netIncome.value,
    totalAssets: assets.value,
    totalEquity: equity.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate DuPont analysis with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const warnings: string[] = [];
  if (math.negativeEquity) {
    warnings.push(
      'Total equity is negative. Conventional ROE and leverage interpretation can be misleading — treat results with caution.'
    );
  }
  warnings.push(
    'Three-factor DuPont decomposition of book ROE. Accounting policies, one-time items, and industry norms matter. Amounts share one currency label (no FX).'
  );

  const result: DupontResult = {
    ...math,
    currency,
    formattedNpm: `${formatDupontPercent(math.netProfitMargin)}%`,
    formattedTat: `${formatDupontRatio(math.totalAssetTurnover)}×`,
    formattedFl: `${formatDupontRatio(math.financialLeverage)}×`,
    formattedRoe: `${formatDupontPercent(math.returnOnEquity)}%`,
    interpretation: interpretDupont(
      math.returnOnEquity,
      math.netProfitMargin,
      math.totalAssetTurnover,
      math.financialLeverage
    ),
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
