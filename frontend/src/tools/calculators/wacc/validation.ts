import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateWacc,
  explainWacc,
  formatWaccMoney,
  formatWaccPercent,
  interpretWacc,
} from './calculation';
import type { WaccFieldErrors, WaccInput, WaccResult } from './types';

export interface WaccValidation {
  isValid: boolean;
  errors: WaccFieldErrors;
  result: WaccResult | null;
}

function parseFinite(raw: string): {
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

export function validateWaccInput(input: WaccInput): WaccValidation {
  const errors: WaccFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const re = parseFinite(input.costOfEquity);
  if (re.blank) {
    errors.costOfEquity = 'Enter cost of equity.';
    hasError = true;
  } else if (re.invalid || re.value === null) {
    errors.costOfEquity = 'Enter a valid cost of equity.';
    hasError = true;
  }

  const equity = parseFinite(input.equity);
  if (equity.blank) {
    errors.equity = 'Enter equity value.';
    hasError = true;
  } else if (equity.invalid || equity.value === null) {
    errors.equity = 'Enter a valid equity amount.';
    hasError = true;
  } else if (equity.value < 0) {
    errors.equity = 'Equity cannot be negative.';
    hasError = true;
  }

  const rd = parseFinite(input.costOfDebt);
  if (rd.blank) {
    errors.costOfDebt = 'Enter cost of debt.';
    hasError = true;
  } else if (rd.invalid || rd.value === null) {
    errors.costOfDebt = 'Enter a valid cost of debt.';
    hasError = true;
  }

  const debt = parseFinite(input.debt);
  if (debt.blank) {
    errors.debt = 'Enter debt value.';
    hasError = true;
  } else if (debt.invalid || debt.value === null) {
    errors.debt = 'Enter a valid debt amount.';
    hasError = true;
  } else if (debt.value < 0) {
    errors.debt = 'Debt cannot be negative.';
    hasError = true;
  }

  const tax = parseFinite(input.corporateTaxRate);
  if (tax.blank) {
    errors.corporateTaxRate = 'Enter corporate tax rate.';
    hasError = true;
  } else if (tax.invalid || tax.value === null) {
    errors.corporateTaxRate = 'Enter a valid tax rate.';
    hasError = true;
  } else if (tax.value < 0 || tax.value > 100) {
    errors.corporateTaxRate = 'Tax rate must be between 0% and 100%.';
    hasError = true;
  }

  if (
    equity.value !== null &&
    !equity.invalid &&
    equity.value >= 0 &&
    debt.value !== null &&
    !debt.invalid &&
    debt.value >= 0 &&
    equity.value + debt.value <= 0
  ) {
    errors.form = 'Total capital must be greater than zero to calculate WACC.';
    hasError = true;
  }

  if (
    hasError ||
    re.value === null ||
    equity.value === null ||
    rd.value === null ||
    debt.value === null ||
    tax.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateWacc(
    re.value / 100,
    equity.value,
    rd.value / 100,
    debt.value,
    tax.value / 100
  );
  if (!math) {
    errors.form = 'Unable to calculate WACC.';
    return { isValid: false, errors, result: null };
  }

  const waccPercent = math.wacc * 100;
  const afterTaxPercent = math.afterTaxCostOfDebt * 100;
  const equityContribPercent = math.equityContribution * 100;
  const debtContribPercent = math.debtContribution * 100;

  const warnings: string[] = [
    'Market-value capital structure weights are preferred for WACC; book values are an approximation. Preferred stock or hybrids need an expanded formula.',
  ];
  if (debt.value === 0 && equity.value > 0) {
    warnings.push(
      'With zero debt, WACC equals the cost of equity under this two-source model.'
    );
  }
  if (equity.value === 0 && debt.value > 0) {
    warnings.push(
      'With zero equity, WACC equals the after-tax cost of debt: a simplified all-debt capital structure scenario.'
    );
  }
  if (re.value < 0 || rd.value < 0) {
    warnings.push(
      'Negative financing rates are unusual analytical inputs; interpret the resulting WACC with caution.'
    );
  }

  const formulaBreakdown = [
    `V = ${formatWaccMoney(math.totalCapital, currency)}`,
    `We = ${formatWaccPercent(math.equityWeight * 100)} · Wd = ${formatWaccPercent(math.debtWeight * 100)}`,
    `Rd(1−T) = ${formatWaccPercent(afterTaxPercent)}`,
    `Equity contrib. = ${formatWaccPercent(equityContribPercent)}`,
    `Debt contrib. = ${formatWaccPercent(debtContribPercent)}`,
    `WACC = ${formatWaccPercent(waccPercent)}`,
  ].join(' · ');

  const result: WaccResult = {
    totalCapital: math.totalCapital,
    equityWeight: math.equityWeight,
    debtWeight: math.debtWeight,
    afterTaxCostOfDebtPercent: afterTaxPercent,
    equityContributionPercent: equityContribPercent,
    debtContributionPercent: debtContribPercent,
    waccPercent,
    currency,
    formattedTotalCapital: `${symbol}${formatWaccMoney(math.totalCapital, currency)}`,
    formattedEquityWeight: formatWaccPercent(math.equityWeight * 100),
    formattedDebtWeight: formatWaccPercent(math.debtWeight * 100),
    formattedAfterTaxCostOfDebt: formatWaccPercent(afterTaxPercent),
    formattedEquityContribution: formatWaccPercent(equityContribPercent),
    formattedDebtContribution: formatWaccPercent(debtContribPercent),
    formattedWacc: formatWaccPercent(waccPercent),
    interpretation: interpretWacc(waccPercent),
    explanation: explainWacc(waccPercent, currency),
    formulaBreakdown,
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
